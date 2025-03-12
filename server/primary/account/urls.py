from django.urls import path
from .views import (
    UserRegisterView,
    ProfileListView,
    login_view,
    basic_update_view,
    update_email_view,
    update_username_view,
    update_password_view,
    clear_all
)


urlpatterns = [
    path("reg", UserRegisterView.as_view()),
    path("profile", ProfileListView.as_view()),
    path("login", login_view),
    path("email-update", update_email_view),
    path("username-update", update_username_view),
    path("password-update", update_password_view),
    path("basic-update", basic_update_view),
    path("clear", clear_all),
]
