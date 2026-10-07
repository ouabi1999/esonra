import time
import hmac
import hashlib
import requests
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api-sg.aliexpress.com/rest"
APP_KEY = os.getenv("ALIEXPRESS_APP_KEY")
APP_SECRET = os.getenv("ALIEXPRESS_APP_SECRET")


class AliExpressTokenView(APIView):
    """Exchange OAuth code for access token"""

    def post(self, request):
        code = request.data.get("code")
        if not code:
            return Response({"error": "Missing code"}, status=400)

        api_path = "/auth/token/create"
        params = {
            "app_key": APP_KEY,
            "code": code,
            "grant_type": "authorization_code",
            "sign_method": "sha256",
            "timestamp": str(int(time.time() * 1000)),
        }
        if APP_SECRET is not None:
            base_string = api_path + "".join(f"{k}{params[k]}" for k in sorted(params))
            params["sign"] = (
                hmac.new(APP_SECRET.encode(), base_string.encode(), hashlib.sha256)
                .hexdigest()
                .upper()
            )

        try:
            res = requests.post(f"{BASE_URL}{api_path}", data=params, timeout=10)
            data = res.json()
            return Response(
                {
                    "success": True,
                    "access_token": data.get("access_token"),
                    "refresh_token": data.get("refresh_token"),
                    "raw": data,
                }
            )
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=500)


class AliExpressRefreshTokenView(APIView):
    """Refresh expired access token"""

    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Missing refresh_token"}, status=400)

        api_path = "/auth/token/refresh"
        params = {
            "app_key": APP_KEY,
            "refresh_token": refresh_token,
            "sign_method": "sha256",
            "timestamp": str(int(time.time() * 1000)),
            "method": "auth.token.refresh",
        }
        if APP_SECRET is None:
            raise ValueError("value required")
        base_string = api_path + "".join(f"{k}{params[k]}" for k in sorted(params))
        params["sign"] = (
            hmac.new(APP_SECRET.encode(), base_string.encode(), hashlib.sha256)
            .hexdigest()
            .upper()
        )

        try:
            res = requests.post(f"{BASE_URL}{api_path}", data=params, timeout=10)
            data = res.json()
            return Response(
                {
                    "success": True,
                    "access_token": data.get("access_token"),
                    "refresh_token": data.get("refresh_token"),
                    "raw": data,
                }
            )
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=500)


class AliExpressProductView(APIView):
    """Fetch product details using access token"""

    PRODUCT_METHOD = "aliexpress.ds.product.get"

    def get(self, request, product_id=None):
        access_token = request.query_params.get("aliexpress_access_token")
        if not access_token:
            return Response({"error": "Missing access token"}, status=400)

        params = {
            "app_key": APP_KEY,
            "method": self.PRODUCT_METHOD,
            "timestamp": str(int(time.time() * 1000)),
            "sign_method": "sha256",
            "access_token": access_token,
            "product_id": product_id,
            "ship_to_country": "US",
            "currency_code": "USD",
        }

        if APP_SECRET is None:
            raise ValueError("value required")
        base_string = self.PRODUCT_METHOD + "".join(
            f"{k}{params[k]}" for k in sorted(params)
        )
        params["sign"] = (
            hmac.new(APP_SECRET.encode(), base_string.encode(), hashlib.sha256)
            .hexdigest()
            .upper()
        )

        try:
            res = requests.post(f"{BASE_URL}", data=params, timeout=10)
            res.raise_for_status()
            data = res.json()
            return Response({"status": "success", "data": data})
        except Exception as e:
            return Response({"error": str(e)}, status=502)
