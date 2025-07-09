from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import Discussion
from utils.res import generate_res
from utils.ser.discussion import (
    discussion_create_serializer,
    discussion_read_serializer,
)
from utils.perm.comm import is_community_active, is_community_admin
from community.models import Community
from django.contrib.auth.models import User
from utils.ser.user import user_list_serializer
from account.models import Profile

# Create your views here.


class BasicCRUDView(APIView):

    def get(self, req):
        """
        * CASE:
            > display all discussions that you are a member of within a community
            > if you are an admin of the community, display all discussions within the community
            > else; display only discussions that you are a member of
            > Return a specific discussion if title is provided

        * Permission:
            > Basically an admin cannot become a member of a discussion unless the admin status has been revoked
            > and vice versa

        * Req & Opt url params:
            > d (discussion id)
            > c (community id)
        """
        d_id = req.GET.get("d", None)
        c_id = req.GET.get("c", None)
       

        # if community id is provided
        # return all discussions that have the req.user as a member or is the community admin
        if c_id:
            community = Community.objects.filter(pk=c_id)
            if not community.exists():
                return Response(generate_res(err={"msg": "community does not exists"}))
            community = community[0]
            is_c_admin = is_community_admin(community, req.user.pk)
            community_discussions = Discussion.objects.filter(community=c_id)
            y = [] 
            for community_discussion  in community_discussions:
                if req.user.pk in list(community_discussion.members) or is_c_admin:
                    y.append(community_discussion)
            ser = discussion_read_serializer(instance=y, many=True)
            return Response(generate_res({"msg": ser.data}))

        # if discussion id is provided
        discussion = Discussion.objects.filter(pk=d_id)
        if not discussion.exists():
            return Response(generate_res(err={"msg": "discussion does not exist"}))
        ser = discussion_read_serializer(instance=discussion[0])
        return Response(generate_res({"msg": ser.data}))

    def post(self, req):
        """
        * Req data:
            > title 
            > description
            > c_id (community id)
        """
        # getting request data
        title = req.data.get("title", None)
        description = req.data.get("description", None)
        c_id = req.data.get("c_id", None)
        if not title or not description or not c_id:
            return Response(generate_res(err={"msg": "required data not provided"}))
        community = Community.objects.filter(pk=c_id)
        if not community.exists():
            return Response(generate_res(err={"msg": "community does not exists"}))
        community = community[0]
        # validating permissibility
        is_c_active = community.is_active
        is_permitted = is_community_admin(community, req.user.pk)
        if not is_c_active:
            return Response(generate_res(err={"msg": "community is inactive"}))
        if not is_permitted:
            return Response(generate_res(err={"msg": "permission denied"}))
        # validating title
        if Discussion.objects.filter(community=c_id, title=title).exists():
            return Response(generate_res(err={"msg": "discussion already exists"}))
        # is_title_avail
        ser = discussion_create_serializer(
            data={
                "title": title,
                "community": c_id,
                "members": [],
                "description": description,
            }
        )
        if not ser.is_valid():
            return Response(generate_res(err={"msg": "something went wrong"}))
        ser.save()
        return Response(generate_res({"msg": "discussion created successfully"}))

    def put(self, req):
        """
        For title and description update
        * Req param:
            > d (discussion id))
        * Optional data:
            > title
            > description
        """
        d_id = req.GET.get("d", None)
        if not d_id:
            return Response(generate_res(err={"msg": "id params must be provided"}))
        discussion = Discussion.objects.filter(pk=d_id)
        # validating the title param
        if not discussion.exists():
            return Response(generate_res(err={"msg": "discussion does not exists"}))
        discussion = discussion[0]
        # validating permissibility
        community = Community.objects.filter(pk=discussion.community.pk)[0]
        is_permitted = is_community_admin(community, req.user.pk)
        if not is_permitted:
            return Response(generate_res(err={"msg": "permission denied"}))
        # getting the request data
        title = req.data.get("title", None)
        description = req.data.get("description", None)
        if not title and not description:
            return Response(
                generate_res(err={"msg": "title or description must be provided"})
            )
        if title:
            is_not_available = Discussion.objects.filter(
                community=discussion.community, title=title
            ).exists()
            if is_not_available:
                return Response(generate_res(err={"msg": "title is not available"}))
            else:
                discussion.title = title

        if description:
            discussion.description = description
        discussion.save()
        return Response(generate_res({"msg": "discussion updated successfully"}))

    def delete(self, req):
        d_id = req.GET.get("d", None)
        if not d_id:
            return Response(generate_res(err={"msg": "id params must be provided"}))
        discussion = Discussion.objects.filter(pk=d_id)
        # validating the title params
        if not discussion.exists():
            return Response(generate_res(err={"msg": "discussion does not exists"}))
        discussion = discussion[0]
        if discussion.title == "Announcement":
            return Response(generate_res(err={"msg": "Announcement discussion cannot be deleted"}))
        # validating permissibility
        community = Community.objects.filter(pk=discussion.community.pk)[0]
        is_permitted = is_community_admin(community, req.user.pk)
        if not is_permitted:
            return Response(generate_res(err={"msg": "permission denied"}))
        discussion.delete()
        # Discussion.objects.all().delete()
        return Response(generate_res({"msg": "discussion deleted successfully"}))


# update discussion members


@api_view(["PUT"])
def update_members(req):
    """
    Req data:
        > user_id (member to be added)
        > d_id (discussion id)
        > c_id (community id)
        > action ('DEL', 'ADD')
    CASE :
        > check if community is active
        > check if not admin
        > confirm if community member

    """  
    user_id = req.data.get("user_id", None)
    d_id = req.data.get("d_id", None)
    c_id = req.data.get("c_id", None)
    action = req.data.get("action", "ADD")
 
    if not user_id or not d_id or not c_id:
        return Response(generate_res(err={"msg": "incomplete required data"}))

    # community validation
    community = Community.objects.filter(pk=c_id)
    if not community.exists():
        return Response(generate_res(err={"msg": "community does not exists"}))
    community = community[0]
    if not community.is_active:
        return Response(generate_res(err={"msg": "community is inactive"}))
    # checking if user exists
    user = User.objects.filter(pk=user_id)
    if not user.exists():
        return Response(generate_res(err={"msg": "user does not exists"}))
    user = user[0]
    # checking if user is already a admin/member of the community
    is_c_member = user_id in community.members
    is_c_admin = user_id in community.admins
    # prevents admin user from beign a member of a discussion since it's not needed
    if is_c_admin:
        return Response(generate_res(err={"msg": "user is a community admin"}))

    # discussion validation
    discussion = Discussion.objects.filter(pk=d_id)
    if not discussion.exists():
        return Response(generate_res(err={"msg": "discussion does not exists"}))
    discussion = discussion[0]
    c_members = list(community.members)
    d_members = list(discussion.members)
    is_d_member = user_id in discussion.members
    # validating discussion membership
    if action != "DEL" and is_d_member:
        return Response(generate_res(err={"msg": "user is already a member"}))
    
    # altering discussion member
    if action == "ADD":
        # if user is not a community member
        # make the user one
        if not is_c_member:
            c_members.append(user_id)
            # Adding user to the announcement discussion
            announcement_discussion = Discussion.objects.get(title="Announcement", community= c_id)
            announcement_members = list(announcement_discussion.members)
            announcement_members.append(user_id)
            announcement_discussion.save()
        d_members.append(user_id)
    elif action == "DEL":
        d_members.remove(user_id)

    else:
        return Response(generate_res(err={"msg": "action does not exist"}))
    discussion.members = d_members
    community.members = c_members
    discussion.save()
    community.save()
    state = "added" if action == "ADD" else "removed"
    return Response(generate_res({"msg": f"member {state} successfully "}))


@api_view(["GET"])
def discussion_members_list(req):
    # list all discussion members
    # this view works even if community is inactive
    """
    * Req url params:
        > d (discussion id)
    """
    d_id = req.GET.get("d", None)
    if not d_id:
        return Response(generate_res(err={"msg": "discussion title must be provided"}))
    discussion = Discussion.objects.filter(pk=d_id)
    if not discussion.exists():
        return Response(generate_res(err={"msg": "discussion does not exist"}))
    discussion = discussion[0]
  
    d_members = list(discussion.members)
 
    user_profiles = []
    for member in d_members:
        # x = User.objects.get(username=member)
        y = Profile.objects.get(user=member)
        user_profiles.append(y)
    ser = user_list_serializer(instance=user_profiles, many=True)
    return Response(generate_res({"msg": ser.data}))
