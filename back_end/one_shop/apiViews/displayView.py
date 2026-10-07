# views.py
from gettext import NullTranslations
from rest_framework.views import APIView

from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import json
import cloudinary.uploader
from ..models import Display
from ..serializer import DisplaySerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404


import cloudinary.uploader

def upload_to_cloudinary(file, folder):
    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        resource_type="image"
    )
    return result["secure_url"]



class DisplayInfoAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        data = Display.objects.all()
        serializer = DisplaySerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = {}

        # JSON fields
        data["header"] = json.loads(request.data.get("header", "{}"))
        data["category"] = json.loads(request.data.get("category", "[]"))
        data["pop_up"] = json.loads(request.data.get("pop_up", "[]"))
        data["count_Down"] = request.data.get("count_Down", False)

        # LOGO
        logo = request.FILES.get("logo")
        if logo:
            data["logo"] = upload_to_cloudinary(logo, "display/logo")
        else:
            data["logo"] = request.data.get("logo")

        # MAIN CATEGORY
        main_category = []
        index = 0
        while f"main_category[{index}][categoryName]" in request.data:
            img_file = request.FILES.get(f"main_category[{index}][img]")
            img_url = request.data.get(f"main_category[{index}][img]")

            main_category.append({
                "categoryName": request.data.get(f"main_category[{index}][categoryName]"),
                "img": upload_to_cloudinary(img_file, "display/main_category")
                if img_file else img_url
            })
            index += 1

        data["main_category"] = main_category

        # BANNERS (FILES ONLY)
        banners = []
        for file in request.FILES.getlist("banners"):
            banners.append(upload_to_cloudinary(file, "display/banners"))
        data["banners"] = banners

        # SLIDER (FILES + URLS)
        slider = []

        # Existing URLs
        slider_urls = request.data.get("slider_urls")
        if slider_urls:
            slider.extend(json.loads(slider_urls))

        # New uploads
        for file in request.FILES.getlist("slider"):
            slider.append(upload_to_cloudinary(file, "display/slider"))

        data["slider"] = slider

        serializer = DisplaySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request):
        display_id = request.query_params.get("id")

        instance = Display.objects.get(pk=display_id)
        data = {}

        data["header"] = json.loads(request.data.get("header", "{}"))
        data["category"] = json.loads(request.data.get("category", "[]"))
        data["pop_up"] = json.loads(request.data.get("pop_up", "[]"))
        data["count_Down"] = request.data.get("count_Down", instance.count_Down)

        # LOGO
        logo = request.FILES.get("logo")
        if logo:
            data["logo"] = upload_to_cloudinary(logo, "display/logo")
        elif "logo" in request.data:
            data["logo"] = request.data.get("logo")

        # MAIN CATEGORY
        main_category = []
        index = 0
        while f"main_category[{index}][categoryName]" in request.data:
            img_file = request.FILES.get(f"main_category[{index}][img]")
            img_url = request.data.get(f"main_category[{index}][img]")

            main_category.append({
                "categoryName": request.data.get(f"main_category[{index}][categoryName]"),
                "img": upload_to_cloudinary(img_file, "display/main_category")
                if img_file else img_url
            })
            index += 1

        data["main_category"] = main_category

        # BANNERS
        if request.FILES.getlist("banners"):
            banners = [
                upload_to_cloudinary(file, "display/banners")
                for file in request.FILES.getlist("banners")
            ]
            data["banners"] = banners

        # SLIDER
        slider = []

        slider_urls = request.data.get("slider_urls")
        if slider_urls:
            slider.extend(json.loads(slider_urls))

        for file in request.FILES.getlist("slider"):
            slider.append(upload_to_cloudinary(file, "display/slider"))

        if slider:
            data["slider"] = slider

        serializer = DisplaySerializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

