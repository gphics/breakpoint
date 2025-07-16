from django.urls import path
from .consumer import CommentConsumer
websocket_url_patterns=[
    path("ws/discussion/<int:id>/", CommentConsumer.as_asgi())
]