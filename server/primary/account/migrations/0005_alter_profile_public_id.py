# Generated by Django 5.1.6 on 2025-02-28 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0004_alter_profile_public_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="public_id",
            field=models.CharField(default="9Z8r74MRYuHfWXApbTrpTf", max_length=50),
        ),
    ]
