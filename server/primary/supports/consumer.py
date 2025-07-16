import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Comment
from utils.res import generate_res
from discussion.models import Discussion
from community.models import Community
from utils.perm.comm import is_community_active, is_community_admin
from utils.perm.dis import is_discussion_member
from utils.ser.sup import comment_read_serializer
from rest_framework.authtoken.models import Token
from urllib.parse import parse_qs
from channels.exceptions import StopConsumer
class CommentConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.discussion_id = self.scope["url_route"]["kwargs"]["id"]
        self.discussion_group = f"discussion_{self.discussion_id}"

        # Getting auth token
        query_bytes = self.scope["query_string"]
        query_str = query_bytes.decode("utf-8")
        qs= parse_qs(query_str)
        auth_token = qs["token"][0]
        if not auth_token:
            await self.send(text_data=json.dumps(generate_res(err={"msg":"You are not authenticated"})))
            raise StopConsumer()
        
        # Verifying auth token &
        # setting auth_user
        res = await self.get_auth(auth_token)
        err = res["err"]
        if err:
            await self.send(text_data=json.dumps(res))
            raise StopConsumer()
        # creating channel group
        await self.channel_layer.group_add(self.discussion_group, self.channel_name)

        await self.accept()
    @sync_to_async
    def get_auth(self, auth_token):
        try:
            verified_auth = Token.objects.get(key = auth_token)
            self.auth_user = verified_auth.user
            return generate_res({"msg":"done"})
        except Exception as e:
            return generate_res(err={"msg":"User does not exists"})
        
    async def disconnect(self, code):
        print("Websocket disconnected")
   
    @sync_to_async
    def create_comment(self, data):
        """
        * This function is responsible for creating the comment
        * Req data :
            > content
            > discussion (id)
        * Opt dat :
            > media
        """
        # destructuring the data parameter
        discussion_id= data.get("discussion", None)
        content = data.get("content", None)
        if not discussion_id or not content:
            return generate_res(err={'msg':"content and discussion id must be provided"})
        # validating discussion
        discussion = Discussion.objects.filter(pk=discussion_id)
        if not discussion.exists():
            return generate_res(err={"msg": "discussion does not exists"})
        discussion = discussion[0]
        d_members = discussion.members
        # querying community
        community = Community.objects.filter(pk=discussion.community.pk)[0]
        # checking if community is inactive
        is_c_active = is_community_active(community)
        if not is_c_active:
            return generate_res(err={"msg": "community is not active"})
        auth_user = self.auth_user
        # validating if user is discussion member
        is_d_member = is_discussion_member(d_members, auth_user.pk)
        is_c_admin = is_community_admin(community, auth_user.pk)
        if not is_d_member and not is_c_admin:
            return generate_res(err={"msg": "action not permitted"})
        
        # creating the comment
        new_comment = Comment(author = auth_user, content = content, discussion = discussion)
        new_comment.save()
        ser = comment_read_serializer(instance = new_comment)
        return generate_res({"msg":ser.data})

    async def receive(self, text_data):
        data = json.loads(text_data)
        res = await self.create_comment(data)
        await self.channel_layer.group_send(self.discussion_group, {"type":"discussion.message", "data":res})

    async def discussion_message(self, event):
        data = event["data"]
        await self.send(text_data=json.dumps(data))
