# Generated by Django 5.1.6 on 2025-06-29 22:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0015_alter_community_public_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='community',
            name='admins',
            field=models.JSONField(default=[], null=True),
        ),
        migrations.AlterField(
            model_name='community',
            name='members',
            field=models.JSONField(default=[], null=True),
        ),
        migrations.AlterField(
            model_name='community',
            name='public_id',
            field=models.CharField(default='TrTVwacAuNNox7C5vtuvp4', max_length=50),
        ),
    ]
