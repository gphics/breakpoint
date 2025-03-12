from rest_framework import serializers
from supports.models import Comment


class comment_create_serializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["content", "author", "discussion", "is_sub", "threads"]


# class thread_create_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = Thread
#         fields = ["main_comment", "replies"]


class comment_read_serializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


# class thread_read_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = Thread
#         fields = "__all__"
