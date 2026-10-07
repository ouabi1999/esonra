from django.contrib.sitemaps.views import sitemap
from one_shop.sitemaps import ProductSitemap, StaticPagesSitemap
import os
ENV = os.getenv("DJANGO_ENV", "development")  # default to development

sitemaps = {
    "static": StaticPagesSitemap,
    "products": ProductSitemap,
}


def enouza_sitemap(request):
    if ENV == "production":
        request.META["HTTP_HOST"] = "www.enouza.com"
        request.META["SERVER_NAME"] = "www.enouza.com"
        request.META["SERVER_PORT"] = "443"
        request.META["wsgi.url_scheme"] = "https"
    else:
        request.META["HTTP_HOST"] = "localhost:5173"
        request.META["SERVER_NAME"] = "localhost"
        request.META["SERVER_PORT"] = "5173"
        request.META["wsgi.url_scheme"] = "http"
    return sitemap(request, sitemaps=sitemaps)