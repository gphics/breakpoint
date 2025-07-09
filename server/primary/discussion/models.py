from django.db import models
from supports.models import MetaStamps
# Create your models here.


class Discussion(MetaStamps):
    title = models.CharField(max_length=50)
    description = models.TextField()
    avatar = models.CharField(max_length=50)
    community = models.ForeignKey("community.Community", on_delete=models.CASCADE)
    members = models.JSONField(null = True, default=list)
    class Meta:
        db_table = "discussion" 