from rest_framework import serializers
from django.contrib.auth.models import User
from account.models import Profile


class user_reg_serializer(serializers.ModelSerializer):

    def validate_email(self, value):
        is_exists = User.objects.filter(email=value).exists()
        if is_exists:
            raise serializers.ValidationError("user already exists")
        return value

    def validate_password(self, value):
        is_valid = len(value) > 5 or False
        if not is_valid:
            raise serializers.ValidationError(
                "password length should be greater than 5"
            )
        return value

    def save(self, data):
        user = User.objects.create_user(**data)
        return data

    class Meta:
        model = User
        fields = ["username", "password", "email"]


class user_list_serializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
        depth = 2
