from django.contrib.sitemaps import Sitemap
from .models import Products



class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9

    def items(self):
        return Products.objects.all().order_by("id")

    def location(self, item):
        return f"/product/{item.slug}"


class StaticPagesSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        return [
            "/",
            "/collections",
            "/about-us",
            "/contact-us",
            "/Faq",
            "/privacy-policy",
            "/terms-of-services",
            "/return-policy",
            "/shipping-policy",
        ]

    def location(self, item):
        return item