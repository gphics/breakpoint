from django.urls import path
from .views import (
    CommunityBasicView,
    admins_update,
    members_update,
    name_update,
    description_update, 
    is_active_update,
    community_admins_list,
    community_members_list,
    user_community_position,
    single_community,
    leave_community
)

urlpatterns = [
    path("", CommunityBasicView.as_view()),
    path("update-admins", admins_update),
    path("user-position", user_community_position),
    path("single", single_community),
    path("update-members", members_update),
    path("update-name", name_update),
    path("update-description", description_update),
    path("update-is-active", is_active_update),
    path("list-admins", community_admins_list),
    path("list-members", community_members_list),
    path("leave",leave_community ),
]
 