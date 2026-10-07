from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("one_shop", "0006_rename_aliexpressratings_rating"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Ratings",
        ),
    ]