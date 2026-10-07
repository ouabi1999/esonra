from django.core.management.base import BaseCommand
from django.utils.text import slugify

from one_shop.models import Products


class Command(BaseCommand):
    help = "Populate missing product slugs"

    def handle(self, *args, **options):
        products = Products.objects.filter(slug__isnull=True) | Products.objects.filter(
            slug=""
        )

        products = products.order_by("id")

        updated = 0

        for product in products:
            name_data = product.name or {}
            base_slug = slugify(name_data.get("en", ""))

            if not base_slug:
                self.stdout.write(
                    self.style.WARNING(
                        f"Product {product.id} has no English name. Skipped."
                    )
                )
                continue

            slug = base_slug
            counter = 2

            while Products.objects.filter(slug=slug).exclude(
                pk=product.pk
            ).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            product.slug = slug
            product.save(update_fields=["slug"])

            updated += 1

            self.stdout.write(
                f"Product {product.id}: {slug}"
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Finished. Updated {updated} products."
            )
        )