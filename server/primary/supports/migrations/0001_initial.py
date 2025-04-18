# Generated by Django 5.1.6 on 2025-02-13 23:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("discussion", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Comment",
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
                ("content", models.TextField()),
                ("media", models.JSONField(blank=True)),
                (
                    "author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "discussion",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="discussion.discussion",
                    ),
                ),
            ],
            options={
                "db_table": "comment",
            },
        ),
        migrations.CreateModel(
            name="Thread",
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
                ("replies", models.JSONField(blank=True)),
                (
                    "main_comment",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="supports.comment",
                    ),
                ),
            ],
            options={
                "db_table": "thread",
            },
        ),
    ]
