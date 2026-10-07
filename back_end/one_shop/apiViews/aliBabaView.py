from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import json
import hashlib
import hmac
import base64
from datetime import datetime
import uuid
import iop
from dotenv import load_dotenv
import os, uuid


load_dotenv()

url = "https://openapi-api.alibaba.com/rest"

appkey = os.getenv("ALIBABA_APP_KEY")
appSecret = os.getenv("ALIBABA_APP_SECRET")

class AlibabaAuthView(APIView):
    def post(self, request):
        print(appkey, appSecret)

        code = request.data.get("code")
        if not code:
            return Response(
                {"error": "authorization code required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not appkey or not appSecret:
            return Response(
                {"error": "Alibaba appkey or secret missing"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        client = iop.IopClient(url, appkey, appSecret)

        req = iop.IopRequest("/auth/token/create")
        req.add_api_param("code", code)

        response = client.execute(req)
        data = response.body

        return Response({
            "success": True,
            "access_token": data.get("access_token"),
            "refresh_token": data.get("refresh_token"),
            "raw": data
        })

class AliBabaProductsView(APIView):
    def get(self, request):
        access_token = request.query_params.get("alibaba_access_token")
        product_id = request.data.get("product_id")
        client = iop.IopClient(url, appkey ,appSecret)
        request = iop.IopRequest('/eco/buyer/product/description')
        request.add_api_param('product_id', product_id)
        response = client.execute(request, access_token)
        data = response.body

        return Response({
            "success": True,
            
            "raw": data
        })
