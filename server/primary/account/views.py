from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from utils.ser.user import user_reg_serializer, user_list_serializer
from utils.res import generate_res
from shortuuid import uuid
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from community.models import Community
from discussion.models import Discussion

# Create your views here.


class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, req):
        """
        * Required data:
            > email
            > password
            > username
        """
        # validating user data
        req_password = req.data.get("password", None)
        req_email = req.data.get("email", None)
        req_username = req.data.get("username", None)
        if not req_email:
            return Response(generate_res(err={"msg": "email must be provided"}), content_type="application/json")
        if not req_username:
            return Response(generate_res(err={"msg": "username must be provided"}), content_type="application/json")
        if not req_password:
            return Response(generate_res(err={"msg": "password must be provided"}), content_type="application/json")
        try:
            # initiating the serializer
            ser = user_reg_serializer(data=req.data)
            if not ser.is_valid():
                email_err = ser.errors.get("email", None)
                password_err = ser.errors.get("password", None)
                err = {"msg": None}
                if email_err:
                    err["msg"] = "user already exists"
                    return Response(generate_res(err=err), content_type="application/json")

                if password_err:
                    err["msg"] = "password length must be greater than 5"
                    return Response(generate_res(err=err), content_type="application/json")
            # creating the user
            ser.save(req.data)

            # confirming and authenticating the user
            auth = authenticate(
                username=ser.data["username"], password=ser.data["password"]
            )

            if not auth:
                return Response(generate_res(err={"msg": "user does not exist"}), content_type="application/json")
            # creating the token obj
            token_obj = Token.objects.get_or_create(user=auth)
            token = str(token_obj[0])

            # creating user profile
            user_profile = Profile.objects.create(public_id=uuid(), user=auth)
            return Response(generate_res(data={"msg": {"token": token}}), content_type="application/json")
        except Exception as e:
            print(e)
            return Response(generate_res(err={"msg": "username already exists"}), content_type="application/json")



class ProfileListView(APIView):
    permission_classes = [AllowAny]

    def get(self, req):
        # getting username query params
        username = req.GET.get("username", None)
        user_id = req.GET.get("id", None)
        # if the result should be the profile data of the authenticated user
        if req.auth and not username:
            username = req.user.username

        # querying the db if the id q_prams exist
        if user_id:
            first = Profile.objects.filter(user = user_id)
            if not first.exists():
                return Response(generate_res(err={"msg": "user does not exist"}))
            first = first[0]
            ser = user_list_serializer(instance = first)
            return Response(generate_res({"msg":ser.data}))
        # querying the db if the username q_prams exist

        if username:
            first = User.objects.filter(username__icontains=username)
            if not first.exists():
                return Response(generate_res(err={"msg": "user does not exist"}))
            profile = []
            for x in first:
                y = Profile.objects.get(user=x.pk)
                profile.append(y)
            ser = user_list_serializer(instance=profile, many=True)
            return Response(generate_res(data={"msg": ser.data}))
        # getting all users if username does not exists
        profile_objs = Profile.objects.all().order_by("-created_at")
        ser = user_list_serializer(instance=profile_objs, many=True)
        return Response(generate_res({"msg": ser.data}))


# @api_view(["GET"])
# @permission_classes([AllowAny])
# def get_user(req):
#     id = req.GET.get("id", None)
#     if not id:
#         return Response(generate_res(err={"msg":"user id must be provided"}))

# login view
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(req):
    """
    * Required data:
        > username
        > password
    """

    username = req.data.get("username", None)
    password = req.data.get("password", None)

    if not username or not password:
        return Response(generate_res(err={"msg": "username and password are required"}))
    auth = authenticate(username=username, password=password)
    if not auth:
        return Response(generate_res(err={"msg": "invalid login credentials"}))
    # generating token
    first = Token.objects.get_or_create(user=auth)
    token = str(first[0])
    return Response(generate_res(data={"msg": {"token": token}}))


@api_view(["PUT"])
def basic_update_view(req):
    user_req = req.data.get(
        "user",
        {
            "first_name": req.user.first_name,
            "last_name": req.user.last_name,
        },
    )
    profile_req = req.data.get(
        "profile",
        {
            "address": req.user.profile.address,
            "phone": req.user.profile.phone,
            "country": req.user.profile.country,
        },
    )
    user = User.objects.filter(username=req.user)
    profile = Profile.objects.filter(user=user[0].pk)
    # print("I am", req.user.profile.country)
    profile.update(**profile_req)
    user.update(**user_req)
    return Response(generate_res(data={"msg": "update successful"}))


@api_view(["PUT"])
def update_email_view(req):
    new_email = req.data.get("email", None)
    if not new_email:
        return Response(generate_res(err={"msg": "new email must be provided"}))

    # checking for email availability
    check = User.objects.filter(email=new_email).exists()
    if check:
        return Response(generate_res(err={"msg": "email not available"}))
    User.objects.filter(username=req.user).update(email=new_email)
    return Response(generate_res({"msg": "email update successfully"}))


@api_view(["PUT"])
def update_username_view(req):
    new_username = req.data.get("username", None)
    if not new_username:
        return Response(generate_res(err={"msg": "new username must be provided"}))

    # checking for email availability
    check = User.objects.filter(username=new_username).exists()
    if check:
        return Response(generate_res(err={"msg": "username not available"}))
    User.objects.filter(username=req.user).update(username=new_username)
    return Response(generate_res({"msg": "username update successfully"}))


@api_view(["PUT"])
def update_password_view(req):
    old_password = req.data.get("old_password", None)
    new_password = req.data.get("new_password", None)

    if not old_password or not new_password:
        return Response(
            generate_res(err={"msg": "both old and new password must be provided"})
        )
    if len(new_password) < 6:
        return Response(
            generate_res(err={"msg": "new password length must be greater than 5"})
        )
    user = User.objects.get(username=req.user)

    # confirming old password
    check = authenticate(username=user.username, password=old_password)
    if not check:
        return Response(generate_res(err={"msg": "incorrect old password"}))
    user.set_password(new_password)
    user.save()
    return Response(generate_res({"msg": "password update successful"}))


@api_view(["GET"])
def reset_password_viw(req):
    user = User.objects.get(username=req.user)
    new_password = 123456
    user.set_password(new_password)
    return Response(generate_res({"msg": {"new_password": new_password}}))


@api_view(["DELETE"])
@permission_classes([AllowAny])
def clear_all(req):
    # this view clears all website database
    # & is only available to site superuser/admin
    Discussion.objects.all().delete()
    Community.objects.all().delete()
    User.objects.all().delete()
    return Response(generate_res({"msg": "database cleared successfully"}))
