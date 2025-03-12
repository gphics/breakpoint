from django.db import models
from supports.models import MetaStamps
from django.contrib.auth.models import User

# Create your models here.


class Community(MetaStamps):

    name = models.CharField(max_length=40)
    founder = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.JSONField(null=True)
    avatar = models.CharField(max_length=50)
    admins = models.JSONField(null=True)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "community"
