# Generated by Django 5.1.6 on 2025-02-13 23:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Community",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "public_id",
                    models.CharField(default="W4AiscJGAu6CdbjBk9raLm", max_length=50),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=40)),
                ("members", models.JSONField()),
                ("avatar", models.CharField(max_length=50)),
                ("admins", models.JSONField()),
                ("description", models.TextField()),
                (
                    "is_active",
                    models.BooleanField(
                        choices=[(True, "Yes"), (False, "No")], default=True
                    ),
                ),
                (
                    "founder",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "community",
            },
        ),
    ]
