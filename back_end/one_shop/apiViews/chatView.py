
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from ..serializer import ContactUsSerializer, NewsLetterSerializer
from ..models import Users, Newsletter
from rest_framework.permissions import AllowAny
from django.http.response import JsonResponse
from django.contrib.auth import get_user_model, login, logout, authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication


class ContactUsView(APIView):
    def post(self, request):
        serializer = ContactUsSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status= status.HTTP_200_OK)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    

class NewsLetterView(APIView):
    def post(self, request):
        email = request.data["email"]
       
        try:
            newsletter = Newsletter.objects.get(email=email)
        except Newsletter.DoesNotExist:
  
            serializer = NewsLetterSerializer(data= request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status= status.HTTP_200_OK)
        return Response({"error": "this email already subscribed"}, status= status.HTTP_400_BAD_REQUEST)
