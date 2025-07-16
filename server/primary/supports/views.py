from django.shortcuts import render
from rest_framework.response import Response
from utils.res import generate_res
from utils.ser.sup import (
    comment_create_serializer,
    comment_read_serializer,
    # thread_create_serializer,
    # thread_read_serializer,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from discussion.models import Discussion
from community.models import Community
from utils.perm.comm import is_community_active, is_community_admin
from utils.perm.dis import is_discussion_member
from .models import Comment


class comment_crud_view(APIView):

    def get(self, req):
        d_id = req.GET.get("d", None)
        if not d_id:
            return Response(generate_res(err={"msg": "discussion id must be provided"}))

        discussion = Discussion.objects.filter(pk=d_id)
        if not discussion.exists():
            return Response(generate_res(err={"msg": "discussion does not exists"}))
        discussion = discussion[0]
        comments = Comment.objects.filter(discussion = d_id)
        ser = comment_read_serializer(instance=comments, many=True)
        return Response(generate_res({"msg": ser.data}))

    def post(self, req):
        """
        * This view is responsible for creating the comment
        * Req data :
            > content
            > discussion (id)
        * Opt dat :
            > media
        """
        discussion = req.data.get("discussion", None)
        content = req.data.get("content", None)
        if not discussion or not content:
            return Response(
                generate_res(err={"msg": "all required data must be provided"})
            )

        # validating discussion
        discussion = Discussion.objects.filter(pk=discussion)
        if not discussion.exists():
            return Response(generate_res(err={"msg": "discussion does not exists"}))
        discussion = discussion[0]
        d_members = discussion.members
        # querying community
        community = Community.objects.filter(pk=discussion.community.pk)[0]
        # checking if community is inactive
        is_c_active = is_community_active(community)
        if not is_c_active:
            return Response(generate_res(err={"msg": "community is not active"}))
        # validating if user is discussion member
        is_d_member = is_discussion_member(d_members, req.user.pk)
        is_c_admin = is_community_admin(community, req.user.pk)

        if not is_d_member and not is_c_admin:
            return Response(generate_res(err={"msg": "action not permitted"}))
        data = {
            "author": req.user.pk,
            "content": content,
            "discussion": discussion.pk,
        }
        ser = comment_create_serializer(data=data)
        if not ser.is_valid():
            return Response(generate_res(err={"msg": "something went wrong"}))
        ser.save()

        return Response(generate_res({"msg": "comment created"}))

    def delete(self, req):
        comment_id = req.GET.get("comment")
        if not comment_id:
            return Response(generate_res(err={"msg": "comment id must be provided"}))
        comments = Comment.objects.filter(pk=comment_id)
        if not comments.exists():
            return Response(generate_res(err={"msg": "comment does not exist"}))
        discussion = Discussion.objects.filter(pk=comments[0].discussion.id)[0]
        community = Community.objects.filter(pk=discussion.community.id)[0]
        is_c_active = is_community_active(community)
        is_c_admin = is_community_admin(community, req.user.id)
        if not is_c_active:
            return Response(generate_res(err={"msg": "community is not active"}))
        if not is_c_admin:
            return Response(generate_res(err={"msg": "permission denied"}))
        comments.delete()
        # Comment.objects.all().delete()
        return Response(generate_res({"msg": "comment deleted"}))
    


# class comment_crud_view(APIView):

#     def get(self, req):
#         d_id = req.GET.get("d", None)
#         comment_id = req.GET.get("comment", None)
#         if not d_id:
#             return Response(generate_res(err={"msg": "discussion id must be provided"}))

#         if comment_id:
#             comments = Comment.objects.filter(pk=comment_id)
#             if not comments.exists():
#                 return Response(generate_res(err={"msg": "comment does not exist"}))
#             x = comment_read_serializer(instance=comments[0]).data
#             if not x["has_threads"]:
#                 return Response(generate_res({"msg": x}))
#             # querying the threads
#             comments = {"main": x, "replies": []}
#             threads = x["threads"]
#             for i in threads:
#                 y = Comment.objects.get(pk=i)
#                 z = comment_read_serializer(instance=y).data
#                 comments["replies"].append(z)
#             return Response(generate_res({"msg": comments}))

#         discussion = Discussion.objects.filter(pk=d_id)
#         if not discussion.exists():
#             return Response(generate_res(err={"msg": "discussion does not exists"}))
#         discussion = discussion[0]
#         comments = Comment.objects.filter(discussion = d_id, is_sub = False)
#         ser = comment_read_serializer(instance=comments, many=True)
#         return Response(generate_res({"msg": ser.data}))

#     def post(self, req):
#         """
#         * This view is responsible for creating the comment
#         * Req data :
#             > content
#             > discussion (id)
#         * Opt dat :
#             > media
#             > comment_id
#         """
#         discussion = req.data.get("discussion", None)
#         content = req.data.get("content", None)
#         comment_id = req.data.get("comment_id", None)
#         if not discussion or not content:
#             return Response(
#                 generate_res(err={"msg": "all required data must be provided"})
#             )

#         # validating discussion
#         discussion = Discussion.objects.filter(pk=discussion)
#         if not discussion.exists():
#             return Response(generate_res(err={"msg": "discussion does not exists"}))
#         discussion = discussion[0]
#         d_members = discussion.members
#         # querying community
#         community = Community.objects.filter(pk=discussion.community.pk)[0]
#         # checking if community is inactive
#         is_c_active = is_community_active(community)
#         if not is_c_active:
#             return Response(generate_res(err={"msg": "community is not active"}))
#         # validating if user is discussion member
#         is_d_member = is_discussion_member(d_members, req.user.pk)
#         is_c_admin = is_community_admin(community, req.user.pk)

#         if not is_d_member and not is_c_admin:
#             return Response(generate_res(err={"msg": "action not permitted"}))
#         data = {
#             "author": req.user.pk,
#             "content": content,
#             "discussion": discussion.pk,
#             "threads": [],
#             "is_sub":bool(comment_id)
#         }
#         ser = comment_create_serializer(data=data)
#         if not ser.is_valid():
#             return Response(generate_res(err={"msg": "something went wrong"}))
#         ser.save()
#         # creating thread if necessary
#         if comment_id:
#             comment = Comment.objects.filter(pk=comment_id)
#             if not comment.exists():
#                 return Response(generate_res(err={"msg": "comment does not exists"}))
#             comment = comment[0]
#             # comment.has_threads = True
#             threads = list(comment.threads) if comment.threads else []
#             threads.append(ser.instance.id)
#             comment.threads = threads
#             comment.save()

#         state = "thread" if comment_id else "comment"
#         return Response(generate_res({"msg": f"{state} created"}))

#     def delete(self, req):
#         comment_id = req.GET.get("comment")
#         if not comment_id:
#             return Response(generate_res(err={"msg": "comment id must be provided"}))
#         comments = Comment.objects.filter(pk=comment_id)
#         if not comments.exists():
#             return Response(generate_res(err={"msg": "comment does not exist"}))
#         discussion = Discussion.objects.filter(pk=comments[0].discussion.id)[0]
#         community = Community.objects.filter(pk=discussion.community.id)[0]
#         is_c_active = is_community_active(community)
#         is_c_admin = is_community_admin(community, req.user.id)
#         if not is_c_active:
#             return Response(generate_res(err={"msg": "community is not active"}))
#         if not is_c_admin:
#             return Response(generate_res(err={"msg": "permission denied"}))
#         # erasing thread if necessary
#         if comments[0].has_threads:
#             threads = comments[0].threads
#             for x in threads:
#                 Comment.objects.filter(pk = x).delete()
#         comments.delete()
#         # Comment.objects.all().delete()
#         return Response(generate_res({"msg": "comment deleted"}))
