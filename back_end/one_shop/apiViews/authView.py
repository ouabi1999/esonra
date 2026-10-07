
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
from ..serializer import UserSerializer, UserCreateSerializer, UserLoginSerializer, UserUpdateSerializer,  UpdatePasswordSerializer
from ..models import Users
from django.contrib.auth import get_user_model, login, logout, authenticate


import os
from django.views import View
from pathlib import Path

User = get_user_model
class UsersList(APIView):
    def get(self, request, format=None):
        users_data = Users.objects.all()
        serializer = UserSerializer(users_data, many=True)
        return Response(serializer.data)
    
class Auth(generics.RetrieveAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        #tasks = self.request.user.task_set.all()
        return self.request.user
    
    

    
    
class RegisterView(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserCreateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        # If the registration is successful, generate JWT tokens and include them in the response
        if response.status_code == status.HTTP_201_CREATED:
            user = Users.objects.get(email=request.data['email'])
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response.data['access_token'] = access_token
            response.data['refresh_token'] = refresh_token

        return response
    
    
    
class LoginView(generics.CreateAPIView):
    queryset = Users.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            
            refresh = RefreshToken.for_user(user)
            
                
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            })
        else:
            return Response(serializer.errors, status=400)
        

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        
        logout(request)
        return Response({'message': 'Logout successful',"status":200 })
    
        """ refresh_token = request.data.get('refresh_token')
        print(refresh_token)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Successfully logged out.'})
        except Exception as e:
            return Response({'detail': 'Invalid refresh token.'}, status=400)
        """




class PasswordResetView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return Response({'detail': 'User with this email does not exist.'}, status=400)

        uidb64 = urlsafe_base64_encode(force_bytes(user.id))
        token = default_token_generator.make_token(user)

        reset_link = f'{settings.FRONTEND_URL}/password-reset/{uidb64}/{token}/'

        send_mail(
            'Password Reset',
            f'Click the following link to reset your password: {reset_link}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response({'detail': 'Password reset link sent to your email.'})

class UpdateUserView(generics.CreateAPIView):
    queryset = Users.objects.all()
    permission_classes = (IsAuthenticated,)

    def put(self, request, pk=None, *args, **kwargs):
        try:
            user_to_update = Users.objects.get(id=pk)
        except Users.DoesNotExist:
            return Response({'detail': 'User with this email does not exist.'}, status=400)
        
        serializer = UserUpdateSerializer(user_to_update, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=400)
        
class UpdateUserPasswordView(generics.CreateAPIView):
    queryset = Users.objects.all()
    permission_classes = (IsAuthenticated,)

    def put(self, request, pk=None):
        user = request.user
        serializer = UpdatePasswordSerializer(data=request.data)
        serializer_class = UserSerializer(user)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            # Verify the old password
            if not user.check_password(old_password):
                return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

            # Set and save the new password
            user.set_password(new_password)
            user.save()

            return Response(serializer_class.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
