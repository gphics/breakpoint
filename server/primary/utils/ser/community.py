from rest_framework import serializers
from community.models import Community

class create_community_serializer(serializers.ModelSerializer):

    def validate_name(self, value):
        check = Community.objects.filter(name=value).exists()
        if check:
            raise serializers.ValidationError("name already exists")
        return value

    class Meta:
        model = Community
        fields = ["name", "founder", "description", "public_id", "admins", "members"]


class read_community_serializer(serializers.ModelSerializer):

    class Meta:
        model = Community
        fields = "__all__"
        depth = 3