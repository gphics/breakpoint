from django.db import models
from django.contrib.auth.models import User
from supports.models import MetaStamps

# Create your models here.


class Profile(MetaStamps):
    country = models.CharField(max_length=50, null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    avatar = models.CharField(max_length=50, null=True, blank=True)
    communities = models.JSONField(null = True)

    class Meta:
        db_table = "profile"
