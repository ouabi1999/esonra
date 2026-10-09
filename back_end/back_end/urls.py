from django.contrib import admin
from django.urls import include, path

from .sitemap_view import ensora_sitemap

urlpatterns = [
    path(
        "sitemap.xml",
        ensora_sitemap,
        name="django-sitemap",
    ),
    path("admin/", admin.site.urls),
    path("api/", include("one_shop.urls")),
]
