from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.paginator import Paginator
from django.http.response import JsonResponse
import json
from rest_framework.views import APIView
from ..models import Products, Address, Users, Orders, Rating
from django.db.models import Count
from django.http import JsonResponse
from django.db.models import Avg, Count, Value
from django.db.models.functions import Coalesce
from django.utils.text import slugify

from ..serializer import (
    ProductSerializer,
    OrderSerializer,
    RatingSerializer,
    ProductDetailsSerializer,
    HeroProductSerializer,
)
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import Q, Case, When, IntegerField, Count, Min, Max, FloatField
from django.db.models.functions import Cast
from django.utils.text import slugify


import cloudinary.uploader



class ProductView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        data = request.data.copy()

        multimedia_info = json.loads(data.get("multimediaInfo"))
        image = request.FILES.get("main_image")

        if image:
            # Cloudinary - Upload main image
            main_image_result = cloudinary.uploader.upload(image)

            multimedia_info["main_image"] = main_image_result["secure_url"]
            data["multimediaInfo"] = json.dumps(multimedia_info)

        else:
            image = request.data.get("main_image")

            multimedia_info["main_image"] = image
            data["multimediaInfo"] = json.dumps(multimedia_info)

            color_urls = []

            # Get the color images from the request files
            color_images = data.getlist("colors")

            if color_images:
                # Upload each color image to Cloudinary
                for color_img in color_images:

                    upload_result = cloudinary.uploader.upload(color_img)

                    color_urls.append(upload_result["secure_url"])

                # Update colors field
                data["colors"] = json.dumps(color_urls)

        # Cloudinary - Upload additional images
        image_urls = multimedia_info.get("image_urls", [])

        additionalImageFiles = request.FILES.getlist(
            "additionalImageFiles"
        )

        if additionalImageFiles:

            for image_file in additionalImageFiles:

                result = cloudinary.uploader.upload(
                    image_file,
                    folder="enouza/products"
                )

                image_urls.append(result["secure_url"])

            multimedia_info["image_urls"] = image_urls

            data["multimediaInfo"] = json.dumps(
                multimedia_info
            )

        # --------------------------------------------------
        # CREATE UNIQUE PRODUCT SLUG
        # --------------------------------------------------

        name_data = data.get("name")

        if isinstance(name_data, str):
            name_data = json.loads(name_data)

        base_slug = slugify(
            name_data.get("en", "")
        )

        slug = base_slug
        counter = 2

        while Products.objects.filter(slug=slug).exists():

            slug = f"{base_slug}-{counter}"

            counter += 1

        data["slug"] = slug

        # --------------------------------------------------
        # SAVE PRODUCT
        # --------------------------------------------------

        serializer = ProductSerializer(data=data)

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request):

        start = int(
            request.GET.get("start", 0)
        )

        per_page = int(
            request.GET.get("per_page", 4)
        )

        products_qs = Products.objects.annotate(
            ratings_count=Count(
                "user_ratings",
                distinct=True
            ),
            orders_count=Count(
                "orders",
                distinct=True
            ),
        ).order_by(
            "orders_count",
            "-ratings_count",
            "-release_date"
        )

        total_products = products_qs.count()

        products = products_qs[
            start : start + per_page
        ]

        serializer = ProductSerializer(
            products,
            many=True
        )

        return JsonResponse(
            {
                "products": serializer.data,
                "total_products": total_products,
                "has_more": (
                    start + per_page
                    < total_products
                ),
            }
        )


class ProductDetailsView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk=None):
        product = get_object_or_404(Products, slug=pk)
        serializer = ProductDetailsSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk=None):
        product_to_delete = Products.objects.get(id=pk)
        product_to_delete.delete()

        return JsonResponse("User Deleted Successfully", safe=False)

    def put(self, request, pk=None):
        product_to_update = Products.objects.get(id=pk)
        data = request.data  # Make a copy to modify
        multimedia_info = json.loads(data.get("multimediaInfo"))
        image = request.FILES.get("main_image")

        if image:

            # Cloudinary - Upload main image, check if file exists in request.FILES
            main_image_result = cloudinary.uploader.upload(image)
            multimedia_info["main_image"] = main_image_result["secure_url"]
            data["multimediaInfo"] = json.dumps(multimedia_info)

        else:
            print(image)
            data = request.data.copy()
            image = request.data.get("main_image")
            multimedia_info["main_image"] = image
            data["multimediaInfo"] = json.dumps(multimedia_info)

        color_urls = []
        # Get the color images from the request files
        color_images = data.getlist("colors")
        if color_images:
            # Upload each color image to Cloudinary and get the URL
            for color_img in color_images:
                upload_result = cloudinary.uploader.upload(color_img)
                # Append the secure URL of the uploaded image
                color_urls.append(upload_result["secure_url"])
            # Update the 'colors' field with the list of color image URLs (flat list)
            data["colors"] = json.dumps(color_urls)

            # Cloudinary - Upload additional images, if they are provided in request.FILES

        image_urls = multimedia_info.get("image_urls", [])
        additionalImageFiles = request.FILES.getlist("additionalImageFiles")
        if additionalImageFiles:
            for image_file in additionalImageFiles:
                result = cloudinary.uploader.upload(
                    image_file, folder="enouza/products"
                )
                image_urls.append(result["secure_url"])

            multimedia_info["image_urls"] = image_urls

            data["multimediaInfo"] = json.dumps(multimedia_info)

        serializer = ProductDetailsSerializer(product_to_update, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardProductsView(APIView):
    def get(self, request, *args, **kwargs):
        current_page = int(request.GET.get("currentPage", 1))
        per_page = int(request.GET.get("per_page", 10))  # Default 10 products per page

        # Fetch all products
        products = Products.objects.all()

        # Apply pagination
        paginator = Paginator(products, per_page)
        page = paginator.get_page(current_page)

        # Serialize the products data
        serializer = ProductDetailsSerializer(page.object_list, many=True)

        # Return response with paginated data
        return Response(
            {
                "products": serializer.data,
                "total_products": paginator.count,
                "total_pages": paginator.num_pages,
            }
        )


class OrderCreateView(APIView):
    def post(self, request, *args, **kwargs):
        request_data = request.data
        try:
            with transaction.atomic():
                address = {
                    "first_name": request_data["first_name"],
                    "last_name": request_data["last_name"],
                    "email": request_data["email"],
                    "address1": request_data["address1"],
                    "address2": request_data["address2"],  # Optional field with default
                    "city": request_data["city"],
                    "state": request_data["state"],  # Optional field with default
                    "country": request_data["country"],
                    "zipcode": request_data["zipcode"],
                }
                request_data["address"] = address
                serializer = OrderSerializer(data=request_data)

                if serializer.is_valid():
                    order = serializer.save()
                    return Response(
                        {"message": "Order created successfully", "order_id": order},
                        status=status.HTTP_201_CREATED,
                    )

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        Ordersdata = Orders.objects.all()
        serializer = OrderSerializer(Ordersdata, many=True, default=[])

        return Response(serializer.data)


class RatingView(APIView):
    def get(self, request):
        current_page = int(request.GET.get("currentPage", 1))
        per_page = int(request.GET.get("per_page", 15))
        start = int(request.GET.get("start", 0))
        ratings = Rating.objects.all()
        paginator = Paginator(ratings, per_page)
        page = paginator.get_page(current_page)


        serializer = RatingSerializer(page.object_list, many=True)

        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        product_id = data.get("product")

        product = Products.objects.get(id=product_id)
        if not product:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )
        images_urls = []
        review = data.get("review")
        if isinstance(review, str):
            try:
                review = json.loads(review)  # Parse string to dictionary
            except json.JSONDecodeError as e:
                return Response(
                    {"error": "Invalid JSON format for review."}, status=400
                )

        for img in review["images"]:
            if img:  # Ensure the file is not empty
                upload_result = cloudinary.uploader.upload(img)
                images_urls.append(upload_result["secure_url"])
                print(upload_result["secure_url"])

        review["images"] = images_urls
        data["review"] = review

        serializer = RatingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Rating submitted successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductFilterView(APIView):

    def get(self, request):

        search = request.query_params.get("search", "").strip()
        category = request.query_params.get("category", "").strip()
        min_price = request.query_params.get("min_price", "").strip()
        max_price = request.query_params.get("max_price", "").strip()
        sort = request.query_params.get("sort", "best_match").strip()

        try:
            page = max(int(request.query_params.get("page", 1)), 1)
        except (TypeError, ValueError):
            page = 1

        try:
            per_page = int(request.query_params.get("per_page", 12))
        except (TypeError, ValueError):
            per_page = 12

        per_page = max(1, min(per_page, 50))

        # Base queryset
        queryset = Products.objects.all()

        # Search
        if search:
            queryset = queryset.filter(
                Q(name__en__icontains=search) |
                Q(description__en__icontains=search)
            )

        # Category
        if category:
            categories = [
                value.strip()
                for value in category.split(",")
                if value.strip()
            ]

            queryset = queryset.filter(
                category__in=categories
            )

        # Ratings and orders
        queryset = queryset.annotate(
            average_rating=Avg("user_ratings__stars"),
            ratings_count=Count(
                "user_ratings",
                distinct=True
            ),
            orders_count=Count(
                "orders",
                distinct=True
            ),
        )

        products = list(queryset)

        # Get SKU prices
        def get_prices(product):

            sku_info = product.skuInfo

            if not sku_info:
                return []

            if isinstance(sku_info, list):
                skus = sku_info

            elif isinstance(sku_info, dict):
                skus = (
                    sku_info.get("skus")
                    or sku_info.get("items")
                    or sku_info.get("list")
                    or [sku_info]
                )

            else:
                return []

            prices = []

            for sku in skus:

                if not isinstance(sku, dict):
                    continue

                try:
                    price = float(sku.get("sellingPrice"))
                    prices.append(price)
                except (TypeError, ValueError):
                    continue

            return prices

        # Price filters
        try:
            min_price = float(min_price) if min_price else None
        except (TypeError, ValueError):
            min_price = None

        try:
            max_price = float(max_price) if max_price else None
        except (TypeError, ValueError):
            max_price = None

        filtered_products = []

        for product in products:

            prices = get_prices(product)

            product_min_price = min(prices) if prices else None
            product_max_price = max(prices) if prices else None

            product._filter_min_price = product_min_price
            product._filter_max_price = product_max_price

            if min_price is not None:
                if (
                    product_min_price is None
                    or product_min_price < min_price
                ):
                    continue

            if max_price is not None:
                if (
                    product_max_price is None
                    or product_max_price > max_price
                ):
                    continue

            filtered_products.append(product)

        products = filtered_products

        # Sorting
        if sort == "price_asc":

            products.sort(
                key=lambda product: (
                    product._filter_min_price is None,
                    product._filter_min_price
                    if product._filter_min_price is not None
                    else float("inf"),
                    product.id,
                )
            )

        elif sort == "price_desc":

            products.sort(
                key=lambda product: (
                    product._filter_min_price is None,
                    -product._filter_min_price
                    if product._filter_min_price is not None
                    else float("inf"),
                    product.id,
                )
            )

        # Homepage best sellers
        elif sort == "bestsellers":

            products = list(
                Products.objects.annotate(
                    ratings_count=Count(
                        "user_ratings",
                        distinct=True
                    ),
                    orders_count=Count(
                        "orders",
                        distinct=True
                    ),
                ).order_by(
                    "-orders_count",
                    "-ratings_count",
                    "-release_date",
                )
            )

        # Filter-page order sorting
        elif sort == "orders":

            products.sort(
                key=lambda product: (
                    -(product.orders_count or 0),
                    -(product.ratings_count or 0),
                    -(
                        product.release_date.timestamp()
                        if product.release_date
                        else 0
                    ),
                    product.id,
                )
            )

        # Best match
        elif sort == "best_match" and search:

            search_lower = search.lower()

            def relevance(product):

                name = product.name or {}
                description = product.description or {}

                name_en = str(
                    name.get("en", "")
                ).lower()

                description_en = str(
                    description.get("en", "")
                ).lower()

                score = 0

                if search_lower in name_en:
                    score += 3

                if search_lower in description_en:
                    score += 2

                return score

            products.sort(
                key=lambda product: (
                    -relevance(product),
                    -(product.orders_count or 0),
                    product.id,
                )
            )

        else:

            products.sort(
                key=lambda product: (
                    -(
                        product.release_date.timestamp()
                        if product.release_date
                        else 0
                    ),
                    product.id,
                )
            )

        # Pagination
        paginator = Paginator(
            products,
            per_page
        )

        page_obj = paginator.get_page(page)

        serializer = ProductSerializer(
            page_obj.object_list,
            many=True
        )

        return Response(
            {
                "count": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": page_obj.number,
                "per_page": per_page,
                "results": serializer.data,
            },
            status=status.HTTP_200_OK
        )


class HeroProductView(APIView):
    def get(self, request):
        # 1️⃣ Try manual hero product
        hero = Products.objects.filter(isHero=True).first()
        if not hero:
            return Response(
                {"detail": "No hero product available"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = HeroProductSerializer(hero)
        return Response(serializer.data, status=status.HTTP_200_OK)
