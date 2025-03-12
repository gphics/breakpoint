from discussion.models import Discussion
from rest_framework.serializers import ModelSerializer


class discussion_create_serializer(ModelSerializer):
    class Meta:
        model = Discussion
        fields = ["title", "members", "description", "community"]



class discussion_read_serializer(ModelSerializer):
    class Meta:
        model = Discussion
        fields = "__all__"
        # depth = 2