from django.urls import path
from .views import BasicCRUDView, update_members, discussion_members_list

urlpatterns = [
    path("", BasicCRUDView.as_view()),
    path("update-members", update_members),
    path("list-members", discussion_members_list),
]
