# Generated by Django 5.1.6 on 2025-02-28 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("supports", "0004_alter_comment_public_id_alter_thread_public_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="public_id",
            field=models.CharField(default="9Z8r74MRYuHfWXApbTrpTf", max_length=50),
        ),
        migrations.AlterField(
            model_name="thread",
            name="public_id",
            field=models.CharField(default="9Z8r74MRYuHfWXApbTrpTf", max_length=50),
        ),
    ]
