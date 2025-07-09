from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
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
from rest_framework.permissions import AllowAny
from discussion.models import Discussion
# Create your views here.


@api_view(["GET"])
def user_community_position(req):
    # This view determines the position of the auth user in the community
    community_id = req.GET.get("id", None)
    if not community_id:
        return Response(generate_res(err={"msg": "community id must be provided"}))
    community = Community.objects.filter(pk=community_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exists"}))
    position = None 
    is_founder = False
    community = community[0]
    auth_username = req.user.username
    if community.founder.username == auth_username:
        position = "founder"
        is_founder = True
    elif auth_username in community.admins and not is_founder:
        position = "admin"
    else:
        position = "member"
    return Response(generate_res({"msg":{"position":position}}))

@api_view(["GET"])
def single_community(req):
    id = req.GET.get("id", None)
    if not id:
        return Response(generate_res(err={"msg":"community id must be provided"}))
    community = Community.objects.filter(pk = id)
    if not community.exists():
        return Response(generate_res(err={"msg":"community does not exists"}))
    community = community[0]
    ser = read_community_serializer(instance = community)
    return Response(generate_res({"msg":ser.data}))

class CommunityBasicView(APIView):

    def get(self, req):
        # This method returns all communities the current user is either an admin or a member
        all_communities = Community.objects.all()
        res = []
        for community in all_communities:
            current_user = req.user.pk
            if current_user in community.admins or current_user in community.members:
                res.append(community)
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
        # saving community 
        ser.save()
        # creating the announcement discussion
        c = Community.objects.get(name = name)
        Discussion.objects.create(title = "Announcement", description="Welcome to the announcement channel", community=c)
        return Response(generate_res({"msg": "community created"}))

    def delete(self, req):
        """
        * Req query_params:
            > id (community id)
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
        is_admin = req.user.pk in x[0].admins

        if not is_admin and not is_superuser:
            return Response(generate_res(err={"msg": "action not permitted"}))
        # deleting community
        x.delete()

        return Response(generate_res({"msg": "community deleted"}))


@api_view(["PUT"])
def admins_update(req):
    """
    This route is meant for permitted user only
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
    if user_id == req.user.pk:
        action_type = "delete" if action == "DEL" else "add"
        return Response(generate_res(err={"msg":f"You cannot {action_type} yourself"}))
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
            # updating the admin membrs
            c_admins.append(x_id)
           

            # altering community members
            if is_already_member:
                c_members.remove(x_id)
                 # removing user from all community discussions since the user is already an admin
                community_discussions = Discussion.objects.filter(community = c_id)
                for discussion in community_discussions:
                    d_members = list(discussion.members)
                    d_members.remove(x_id)
                    discussion.members = d_members
                    discussion.save()

    else:
        if not is_already_admin:
            return Response(generate_res(err={"msg": "this admin user does not exist"}))
        else:
            c_admins.remove(x_id)
            # altering community members
            if not is_already_member:
                c_members.append(x_id)
                # Adding the user to the announcement discussion
                announcement_discussion = Discussion.objects.get(title = "Announcement", community = c_id)
                a_members = list( announcement_discussion.members)
                a_members.append(x_id)
                announcement_discussion.members = a_members
                announcement_discussion.save()

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
    This route is meant for permitted user only
    * Req data:
        > c_id (community id)
        > user_id (for the user to be added as member)
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
    # Adding user to the announcement discussion
    announcement_discussion = Discussion.objects.get(community = c_id, title="Announcement")
    a_members = announcement_discussion.members
    # main operations
    if action == "ADD":
        if is_already_member or is_already_admin:
            return Response(generate_res(err={"msg": "user is already a member"}))
        else:
            c_members.append(x_id)
            a_members.append(user_id)
    else:
        if not is_already_member:
            return Response(
                generate_res(err={"msg": "this community member does not exist"})
            )
        else:
            c_members.remove(x_id)
            community_discussions = Discussion.objects.filter(community = c_id).exclude(title = "Announcement")
            for discussion in community_discussions:
                d_members = list(discussion.members)
                d_members.remove(x_id)
                discussion.members = d_members
                discussion.save()
            a_members.remove(user_id)
    community.members = c_members
    # saving the community
    community.save()
    # saving the announcement discussion
    announcement_discussion.members =  a_members
    announcement_discussion.save()
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
    is_permitted = is_community_admin(community, req.user.pk)
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
    if not description or not c_id:
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
    is_permitted = is_community_admin(community, req.user.pk)
    print(is_permitted)
    print(req.user.username)
    if not is_permitted:
        return Response(generate_res(err={"msg": "permission denied"}))
    community.description = description
    community.save()
    return Response(generate_res({"msg": "community updated successfully"}))


@api_view(["GET"])
def is_active_update(req):
    """
    * Req query:
        > id (community id)
    """
    c_id  = req.GET.get("id", None)

    if not c_id:
        return Response(generate_res(er={"msg": "community name must be provided"}))
    community = Community.objects.filter(pk=c_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exists"}))
    community = community[0]
    is_active= not community.is_active
    community.is_active = is_active
    community.save()
    state = "deactivated" if not is_active else "activated"
    return Response(generate_res({"msg": f"community {state} "}))


@api_view(["GET"])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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


@api_view(["PUT"])
def leave_community(req):
    """
    Data: 
        - c_id (community id)
        - status (admin | member)
    This route is meant for community members and admins to leave the community
    """
    c_id = req.data.get("c_id", None)
    status = req.data.get("status", "member")
    user_id = req.user.pk
    if not c_id:
        return Response(generate_res(err={"msg":"community does not exists"}))
    community = Community.objects.filter(id = c_id)
    if not community.exists():
        return Response(generate_res(err={"msg":"community does not exists"}))
    community = community[0]
    is_founder = user_id == community.founder.pk
    if status == "admin":
        if is_founder:
            return Response(generate_res(err={"msg":"You can only delete the community"}))
        admin_list = list(community.admins)
        admin_list.remove(user_id)
        community.admins = admin_list
    else:
        member_list = list(community.members)
        member_list.remove(user_id)
        community.members = member_list

    # Removing user from all community discussions
    community_discussions = Discussion.objects.filter(community = c_id)
    for community_discussion in community_discussions:
        c_members = list(community_discussion.members)
        c_members.remove(user_id)
        community_discussion.members = c_members
        community.save()
    community.save()
    return Response(generate_res({"msg":f"You left {community.name} community"}))