# Generated by Django 5.1.6 on 2025-02-28 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0003_alter_profile_public_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="public_id",
            field=models.CharField(default="nCZC4wEASoX73kk4Quu64d", max_length=50),
        ),
    ]
