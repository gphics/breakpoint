# Generated by Django 5.1.6 on 2025-02-28 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("discussion", "0004_alter_discussion_public_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="discussion",
            name="members",
            field=models.JSONField(null=True),
        ),
        migrations.AlterField(
            model_name="discussion",
            name="public_id",
            field=models.CharField(default="9Z8r74MRYuHfWXApbTrpTf", max_length=50),
        ),
    ]
