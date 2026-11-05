
import json
import re
import requests

from decimal import Decimal, InvalidOperation

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from django.db import transaction
from django.core.paginator import Paginator

from ..models import Orders
from ..serializer import OrderSerializer

import os
# ==========================================
# COD NETWORK CONFIGURATION
# ==========================================

COD_NETWORK_URL = "https://api.cod.network/v2/seller/leads"
COD_NETWORK_API_TOKEN = os.getenv("COD_API_TOKEN")

def create_cod_network_order(payload):

    token = COD_NETWORK_API_TOKEN

    if not token:
        raise RuntimeError("COD Network API token is not configured.")

    try:
        response = requests.post(
            COD_NETWORK_URL,
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
            },
            timeout=30,
        )

        try:
            response_data = response.json()
        except ValueError:
            response_data = {"message": response.text}

    except requests.RequestException as exc:
        raise RuntimeError(
            "Could not connect to COD Network."
        ) from exc

    if (
        response.status_code != 201
        or response_data.get("status") != "success"
    ):
        raise RuntimeError(
            f"COD Network rejected the order: {response_data}"
        )

    return response_data


# ==========================================
# ORDER CREATION
# ==========================================

class OrderCreateView(APIView):

    def post(self, request, *args, **kwargs):

        try:

            request_data = request.data.copy()

            # ----------------------------------
            # 1. EXTRACT CUSTOMER ADDRESS
            # ----------------------------------

            address = {
                "first_name": request_data.pop("first_name"),
                "last_name": request_data.pop("last_name"),
                "email": request_data.pop("email"),
                "phone_number": request_data.pop("phoneNumber"),
                "address1": request_data.pop("address1"),
                "address2": request_data.pop("address2", ""),
                "city": request_data.pop("city"),
                "state": request_data.pop("state", ""),
                "country": request_data.pop("country"),
                "zipcode": request_data.pop("zipcode"),
            }

            request_data["address"] = address

            # ----------------------------------
            # 2. VALIDATE COUNTRY CODE
            # ----------------------------------

            country = str(address["country"]).strip().upper()

            if not re.fullmatch(r"[A-Z]{2}", country):
                return Response(
                    {
                        "error": (
                            "Country must be a two-letter ISO code, "
                            "for example MA or ES."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ----------------------------------
            # 3. GET ORDERED ITEMS
            # ----------------------------------

            ordered_items = request_data.get("ordered_items")

            if isinstance(ordered_items, str):
                try:
                    ordered_items = json.loads(ordered_items)
                except json.JSONDecodeError:
                    return Response(
                        {"error": "Invalid ordered_items format."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            if not isinstance(ordered_items, list) or not ordered_items:
                return Response(
                    {"error": "Your order must contain at least one item."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            request_data["ordered_items"] = ordered_items

            # ----------------------------------
            # 4. BUILD COD NETWORK ITEMS
            # ----------------------------------

            cod_items = []

            for item in ordered_items:

                if not isinstance(item, dict):
                    raise ValueError("Invalid order item.")

                product_id = item.get("id")
                sku = item.get("sku")
                quantity = item.get("quantity")
                price = item.get("price")

                if product_id is None:
                    raise ValueError("Product ID is missing.")

                if not isinstance(sku, str) or not sku.strip():
                    raise ValueError("Product SKU is missing.")

                if (
                    isinstance(quantity, bool)
                    or not isinstance(quantity, int)
                    or quantity < 1
                ):
                    raise ValueError("Invalid product quantity.")

                try:
                    price = Decimal(str(price))
                except (InvalidOperation, TypeError, ValueError):
                    raise ValueError("Invalid product price.")

                if not price.is_finite() or price < 0:
                    raise ValueError("Invalid product price.")

                cod_items.append({
                    "sku": sku.strip(),
                    "quantity": quantity,
                    "price": float(price),
                })

            # ----------------------------------
            # 5. VALIDATE LOCAL ORDER
            # ----------------------------------

            serializer = OrderSerializer(data=request_data)

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ----------------------------------
            # 6. BUILD COD NETWORK PAYLOAD
            # ----------------------------------

            cod_payload = {
                "full_name": (
                    f"{address['first_name']} "
                    f"{address['last_name']}"
                ),
                "phone": address["phone_number"],
                "country": country,
                "address": address["address1"],
                "city": address["city"],
                "area": address["state"],
                "pay_mode": "cod",
                "items": cod_items,
            }

            # ----------------------------------
            # 7. SAVE LOCAL ORDER AND SUBMIT
            # ----------------------------------

            with transaction.atomic():

                order = serializer.save()

                # If COD Network rejects the order,
                # the local database transaction rolls back.
                cod_response = create_cod_network_order(
                    cod_payload
                )

            # ----------------------------------
            # 8. SUCCESS RESPONSE
            # ----------------------------------

            return Response(
                {
                    "message": "Order created successfully",
                    "order_id": order.id,
                    "cod_network_order_id": (
                        cod_response.get("data", {}).get("id")
                    ),
                },
                status=status.HTTP_201_CREATED,
            )

        except ValueError as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except RuntimeError as e:

            print("COD Network error:", str(e))

            return Response(
                {
                    "error": (
                        "COD Network could not accept your order. "
                        "Please try again."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        except Exception as e:

            print("Order creation error:", str(e))

            return Response(
                {"error": "Failed to create order."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    # --------------------------------------
    # GET ALL ORDERS
    # --------------------------------------

    def get(self, request):

        orders = Orders.objects.all()

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)


# ==========================================
# USER ORDERS WITH PAGINATION
# ==========================================

class OrdersView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):

        current_page = int(
            request.data.get("current_page", 1)
        )

        per_page = int(
            request.GET.get("per_page", 4)
        )

        orders = Orders.objects.filter(user=pk)

        paginator = Paginator(
            orders,
            per_page
        )

        page = paginator.get_page(current_page)

        serializer = OrderSerializer(
            page.object_list,
            many=True
        )

        return Response({
            "orders": serializer.data,
            "total_orders": paginator.count,
            "total_pages": paginator.num_pages,
        })
