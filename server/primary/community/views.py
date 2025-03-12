from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from utils.res import generate_res
from utils.ser.community import create_community_serializer, read_community_serializer
from shortuuid import uuid
from .models import Community
from utils.perm.comm import is_community_admin, is_community_active
from django.contrib.auth.models import User
from utils.ser.user import user_list_serializer
from account.models import Profile

# Create your views here.


class CommunityBasicView(APIView):

    def get(self, req):
        # This method returns all communities the current user is either an admin or a member
        x = Community.objects.all()
        res = []
        for a in x:
            current_user = req.user.pk
            if current_user in a.admins or current_user in a.members:
                res.append(a)
        ser = read_community_serializer(instance=res, many=True)
        return Response(generate_res({"msg": ser.data}))

    def post(self, req):
        """
        * Req data:
            > name : (char)
            > description : (text)
        """
        name = req.data.get("name", None)
        description = req.data.get("description", None)

        if not name or not description:

            return Response(
                generate_res(err={"msg": "name and description must be provided"})
            )

        ser = create_community_serializer(
            data={
                "name": name,
                "founder": req.user.pk,
                "description": description,
                "public_id": uuid(),
                "admins": [req.user.pk],
                "members": [],
            }
        )

        # checking for validity
        if not ser.is_valid():
            return Response(generate_res(err={"msg": "community name not available"}))
        # creating community
        ser.save()
        return Response(generate_res({"msg": "community created"}))

    # def delete(self, req):
    #     Community.objects.all().delete()

    #     return Response(generate_res({"msg": "community deleted"}))

    def delete(self, req):
        """
        * Req query_params:
            > name (community name)
        """
        c_id = req.GET.get("id", None)
        if not c_id:
            return Response(generate_res(err={"msg": "community id must be provided"}))

        x = Community.objects.filter(pk=c_id)
        # checking if community exists
        if not x.exists():
            return Response(generate_res(err={"msg": "community does not exists"}))

        # checking for permissibility
        is_superuser = req.user.is_superuser
        is_admin = req.user.username in x[0].admins

        if not is_admin and not is_superuser:
            return Response(generate_res(err={"msg": "action not permitted"}))
        # deleting community
        x.delete()

        return Response(generate_res({"msg": "community deleted"}))


@api_view(["PUT"])
def admins_update(req):
    """
    * Req data:
        > c_id (community id)
        > user_id (for the user to be added as admin)
        > action (enum['ADD', 'DEL'])
    """
    # querying & checking for community validity
    c_id = req.data.get("c_id", None)
    user_id = req.data.get("user_id", None)
    action = req.data.get("action", "ADD")

    if not c_id or not user_id:
        return Response(
            generate_res(err={"msg": "user id and community name must be provided"})
        )
    community = Community.objects.filter(pk=c_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exists"}))
    # checking user permission
    community = community[0]
    is_active = is_community_active(community)
    if not is_active:
        return Response(generate_res(err={"msg": "community is inactive"}))

    is_permitted = is_community_admin(community, req.user.pk)
    if not is_permitted:
        return Response(generate_res(err={"msg": "action not permitted"}))

    # getting new admin user data
    x = User.objects.filter(pk=user_id)
    if not x.exists():
        return Response(generate_res(err={"msg": "user does not exists"}))
    # running check up on the username provided
    if x[0] == req.user:
        return Response(generate_res(err={"msg": "action denied"}))

    x_id = x[0].pk
    # getting the members and admins list
    c_admins = list(community.admins)
    c_members = list(community.members)
    # getting membership or admin state
    is_already_admin = x_id in c_admins
    is_already_member = x_id in c_members
    # main operations
    if action == "ADD":
        if is_already_admin:
            return Response(generate_res(err={"msg": "user is already an admin"}))
        else:
            c_admins.append(x_id)
            # altering community members
            if is_already_member:
                c_members.remove(x_id)

    else:
        if not is_already_admin:
            return Response(generate_res(err={"msg": "this admin user does not exist"}))
        else:
            c_admins.remove(x_id)
            # altering community members
            if not is_already_member:
                c_members.append(x_id)

    # final update
    community.admins = c_admins
    community.members = c_members
    # saving the community
    community.save()
    full_action_word = "added" if action == "ADD" else "deleted"
    return Response(
        generate_res({"msg": f"admin user {full_action_word} successfully"})
    )


@api_view(["PUT"])
def members_update(req):
    """
    * Req data:
        > c_id (community id)
        > user_id (for the user to be added as admin)
        > action (enum['ADD', 'DEL'])
    """
    # querying & checking for community validity
    c_id = req.data.get("c_id", None)
    user_id = req.data.get("user_id", None)
    action = req.data.get("action", "ADD")

    if not c_id or not user_id:
        return Response(
            generate_res(err={"msg": "user id and community id must be provided"})
        )
    community = Community.objects.filter(pk=c_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exists"}))
    # checking user permission
    community = community[0]
    is_active = is_community_active(community)
    if not is_active:
        return Response(generate_res(err={"msg": "community is inactive"}))

    is_permitted = is_community_admin(community, req.user.pk)
    if not is_permitted:
        return Response(generate_res(err={"msg": "action not permitted"}))

    # getting new admin user data
    x = User.objects.filter(pk=user_id)
    if not x.exists():
        return Response(generate_res(err={"msg": "user does not exists"}))
    # running check up on the username provided
    if x[0] == req.user:
        return Response(generate_res(err={"msg": "action denied"}))

    x_id = x[0].pk
    # getting the members and admins list
    c_admins = list(community.admins)
    c_members = list(community.members)
    # getting membership or admin state
    is_already_admin = x_id in c_admins
    is_already_member = x_id in c_members
    # main operations
    if action == "ADD":
        if is_already_member or is_already_admin:
            return Response(generate_res(err={"msg": "user is already a member"}))
        else:
            c_members.append(x_id)
    else:
        if not is_already_member:
            return Response(
                generate_res(err={"msg": "this community member does not exist"})
            )
        else:
            c_members.remove(x_id)

    community.members = c_members
    # saving the community
    community.save()
    full_action_word = "added" if action == "ADD" else "deleted"
    return Response(
        generate_res({"msg": f"community member {full_action_word} successfully"})
    )


@api_view(["PUT"])
def name_update(req):
    """
    * Req data:
        > new_name
        > old_name
    """
    c_old_name = req.data.get("old_name", None)
    c_new_name = req.data.get("new_name", None)

    if not c_old_name or not c_new_name:
        return Response(
            generate_res(err={"msg": "both old nane and new name should be provided"})
        )
    community = Community.objects.filter(name=c_old_name)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exists"}))
    community = community[0]
    # community validation
    is_c_active = is_community_active(community)
    if not is_c_active:
        return Response(generate_res(err={"msg": "community is inactive"}))
    # user permission validation
    is_permitted = is_community_admin(community, req.user.username)
    if not is_permitted:
        return Response(generate_res(err={"msg": "permission denied"}))
    # checking name availablility
    is_c_name_available = Community.objects.filter(name=c_new_name).exists()
    if is_c_name_available:
        return Response(generate_res(err={"msg": "community name not available"}))

    community.name = c_new_name
    community.save()
    return Response(generate_res({"msg": "community name updated successfully"}))
    pass


@api_view(["PUT"])
def description_update(req):
    """
    * Req data:
        > description
        > c_id (community id)
    """
    description = req.data.get("description", None)
    c_id = req.data.get("c_id", None)
    if not description or not c_name:
        return Response(
            generate_res(err={"msg": "description and community id must be provided"})
        )
    community = Community.objects.filter(pk=c_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exists"}))
    community = community[0]
    is_c_active = is_community_active(community)
    if not is_c_active:
        return Response(generate_res(err={"msg": "community is inactive"}))
    is_permitted = is_community_admin(community, req.user.username)
    if not is_permitted:
        return Response(generate_res(err={"msg": "permission denied"}))
    community.description = description
    community.save()
    return Response(generate_res({"msg": "community updated successfully"}))


@api_view(["PUT"])
def is_active_update(req):
    """
    * Req data:
        > is_active
        > c_id (community id)
    """
    req_is_active = req.data.get("is_active", False)
    c_id = req.data.get("c_id", None)

    if not c_id:
        return Response(generate_res(er={"msg": "community name must be provided"}))
    community = Community.objects.filter(pk=c_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exists"}))
    community = community[0]
    community.is_active = req_is_active
    community.save()
    state = "deactivated" if not req_is_active else "activated"
    return Response(generate_res({"msg": f"community {state} "}))


@api_view(["GET"])
def community_admins_list(req):
    # list all community admins
    # this view works even if community is inactive
    """
    * Req url params:
        > id (community id)
    """
    c_id = req.GET.get("id", None)
    if not c_id:
        return Response(generate_res(err={"msg": "community id must be provided"}))
    community = Community.objects.filter(pk=c_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exist"}))
    c_admins = list(community[0].admins)
    user_profiles = []
    for admin in c_admins:
        # x = User.objects.get(pk=admin)
        y = Profile.objects.get(user=admin)
        user_profiles.append(y)
    ser = user_list_serializer(instance=user_profiles, many=True)
    return Response(generate_res({"msg": ser.data}))


@api_view(["GET"])
def community_members_list(req):
    # list all community members
    # this view works even if community is inactive
    """
    * Req url params:
        > id (community id)
    """
    c_id = req.GET.get("id", None)
    if not c_id:
        return Response(generate_res(err={"msg": "community id must be provided"}))
    community = Community.objects.filter(pk=c_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exist"}))
    c_members = list(community[0].members)
    user_profiles = []
    for member in c_members:
        # x = User.objects.get(username=member)
        y = Profile.objects.get(user=member)
        user_profiles.append(y)
    ser = user_list_serializer(instance=user_profiles, many=True)
    return Response(generate_res({"msg": ser.data}))
