from django.db import models
from shortuuid import uuid
from django.contrib.auth.models import User

# Create your models here.


class MetaStamps(models.Model):
    public_id = models.CharField(max_length=50, default=uuid())
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Comment(MetaStamps):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    media = models.JSONField(blank=True, null = True)
    discussion = models.ForeignKey("discussion.Discussion", on_delete=models.CASCADE)
    has_threads = models.BooleanField(default = False)
    threads = models.JSONField(null = True)
    is_sub = models.BooleanField(default = False)
    class Meta:
        db_table = "comments"


# class Thread(MetaStamps):
#     main_comment = models.OneToOneField(Comment, on_delete=models.CASCADE)
#     replies = models.JSONField(blank=True, null = True)

#     class Meta:
#         db_table = "thread"
