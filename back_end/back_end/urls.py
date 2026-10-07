from django.contrib import admin
from django.urls import include, path

from .sitemap_view import enouza_sitemap

urlpatterns = [
    path(
        "sitemap.xml",
        enouza_sitemap,
        name="django-sitemap",
    ),
    path("admin/", admin.site.urls),
    path("api/", include("one_shop.urls")),
]
