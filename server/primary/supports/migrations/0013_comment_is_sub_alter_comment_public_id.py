# Generated by Django 5.1.6 on 2025-03-12 20:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("supports", "0012_alter_comment_public_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="comment",
            name="is_sub",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="comment",
            name="public_id",
            field=models.CharField(default="3VAHfnwn5KvTtTswQsBZX3", max_length=50),
        ),
    ]
