# Generated by Django 5.1.6 on 2025-06-29 22:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0016_alter_profile_public_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='public_id',
            field=models.CharField(default='GvSz6pLERaKBYiXgACzeX3', max_length=50),
        ),
    ]
