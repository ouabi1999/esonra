#! /usr/bin/env python3.6
from rest_framework.views import APIView
from django.http.response import JsonResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import json
import stripe
from ..models import Orders
from ..serializer import OrderSerializer
from django.db import transaction
import os
import environ

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)




stripe.api_key = env("STRIPE_SECRET_KEY")
YOUR_DOMAIN = env("CLIENT_HOST")

endpoint_secret = env("END_POINT_SECRET") # Add your endpoint secret to Django settings
payment_method_domain = stripe.PaymentMethodDomain.create(domain_name="enouza.com")


   

class CreatePaymentIntentView(APIView):
    """
    Creates a PaymentIntent with tax calculation.
    """
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            currency = data.get("currency", "usd")
            items = data.get('ordered_items', [])
            locale = data.get("locale", "auto")

            # Calculate total order amount including tax
            
            # Create the PaymentIntent
            intent = stripe.PaymentIntent.create(
                amount=data.get('total_price'),
                metadata = data,
                currency= currency,
                receipt_email =  data["email"],
                automatic_payment_methods={'enabled': True},
               
            )
            
            
            return Response({
                'clientSecret': intent['client_secret'],
                # Link for demo purposes only
                'dpmCheckerLink': f'https://dashboard.stripe.com/settings/payment_methods/review?transaction_id={intent["id"]}',
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)


class HandlePaymentSuccessView(APIView):
    """
    Handles successful PaymentIntent by creating a tax transaction.
    """
    def post(self, request, *args, **kwargs):
        try:
            payment_intent_id = request.data.get('payment_intent_id')
            if not payment_intent_id:
                return Response({'error': 'PaymentIntent ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Retrieve the payment intent metadata for tax calculation ID
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            tax_calculation_id = payment_intent.metadata['tax_calculation']
            
            # Create a tax transaction using the calculation ID
            stripe.tax.Transaction.create_from_calculation(
                calculation=tax_calculation_id,
                reference="myOrder_123"  # Replace with unique order reference
            )
            print("payment success")
            return Response({'status': 'Tax transaction created successfully'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
class StripeWebhookView(APIView):
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None
        # Verify the event by constructing it with Stripe's webhook
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except (ValueError, stripe.error.SignatureVerificationError) as e:
            # Invalid payload or signature verification failed
            print(f'⚠️ Webhook error: {str(e)}')
            return JsonResponse({'success': False}, status=400)

        # Process the event
        if event and event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']  # Stripe payment intent object
            request_data = payment_intent['metadata']  # Metadata from the payment intent

            # Retrieve payment method type
            payment_method = payment_intent['payment_method_types'][0]

            
            try:
                with transaction.atomic():
                    address = {
                            "first_name": request_data["first_name"],
                            "last_name": request_data["last_name"],
                            "email": request_data["email"],
                            "address1": request_data["address1"],
                            "city": request_data["city"],
                            "state": request_data["state"],        # Optional field with default
                            "country": request_data["country"],
                            "zipcode": request_data["zipcode"],
                        }
                    request_data["address"] = address
                    serializer = OrderSerializer(data=request_data)

                    if serializer.is_valid():
                        order = serializer.save()
                        return Response({
                            "message": "Order created successfully",
                            "order_id": order.id
                        }, status=status.HTTP_201_CREATED)
                    
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
               

           
        elif event['type'] == 'payment_method.attached':
            # Handle the payment method attached event if needed
            payment_method = event['data']['object']  # Stripe PaymentMethod object
            print(f'Payment method attached: {payment_method}')

        else:
            # Handle unexpected events
            print(f'Unhandled event type {event["type"]}')

        return JsonResponse({'success': True})
