# Generated by Django 5.1.6 on 2025-02-28 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("community", "0003_alter_community_admins_alter_community_members_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="community",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="community",
            name="public_id",
            field=models.CharField(default="nCZC4wEASoX73kk4Quu64d", max_length=50),
        ),
    ]
