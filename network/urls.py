
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.new_post, name="post"),

    # API Routes
    path("my-profile", views.my_profile, name="my-profile"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("all-post/<int:page_number>", views.all_posts, name="all-posts"),
    path("Following/<int:page_number>", views.following, name="following"),
    path('posts/<int:post_id>/edit/', views.edit_post, name='edit_post')
]
