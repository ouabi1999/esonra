from django.contrib import admin
from .models import *


# Register your models here.
class TodoAdmin(admin.ModelAdmin):
    list_display = (
        "firstName",
        "lastName",
        "email",
        "password",
        "birthDate",
        "country",
        "address",
        "joined_at",
        "reset_token",
        "token_expiration",
    )


class RatingAdmin(admin.ModelAdmin):
    list_display = ("id", "stars", "review", "created_at")


admin.site.register(Products)
admin.site.register(Display)

admin.site.register(Orders)

admin.site.register(Rating, RatingAdmin)
admin.site.register(Users, TodoAdmin)
