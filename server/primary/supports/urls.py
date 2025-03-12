from django.urls import path
from .views import comment_crud_view

urlpatterns = [
    path("comment", comment_crud_view.as_view())
]
