# Generated by Django 5.1.6 on 2025-06-23 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('supports', '0014_alter_comment_public_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='public_id',
            field=models.CharField(default='LQjKYjbFZDEeuaPAahop7W', max_length=50),
        ),
    ]
