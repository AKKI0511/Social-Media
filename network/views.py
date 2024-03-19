from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
import json

from .models import User
from .forms import *


def index(request):
    return render(request, "network/index.html", {
        "form": NewForm()
        })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            userProfile = UserProfile(user=user)
            userProfile.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

################################################################################
    
@login_required
def new_post(request):
    if request.method != "POST":
        return render(request, "network/index.html")
        
    form = NewForm(request.POST)
    if form.is_valid():
        content = form.cleaned_data['content']
        new_post = Post(poster=request.user, content=content)
        new_post.save()
        return HttpResponseRedirect(reverse('index'))
    
    return render(request, "network/index.html")

@require_http_methods(["PUT"])
@login_required
def edit_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        data = json.loads(request.body)
        if data.get('content') is not None:
            post.content = data.get('content')
        if data.get("liked") is not None:
            post.like_post(request.user)
        post.save()
        return JsonResponse({'message': 'Post edited successfully',
                             'likes': post.num_of_likes(),
                             'post': post.serialize()}, status=200)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found or you do not have permission to edit'}, status=404)

@login_required
def my_profile(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        return JsonResponse(user_profile.serialize())
    except UserProfile.DoesNotExist:
        return JsonResponse({"error": "User profile not found"}, status=404)
    except Exception as e:
        print(f"Error in profile view: {e}")
        return JsonResponse({"error": "Internal Server Error"}, status=500)

@require_http_methods(["GET", "PUT"])
@login_required
def profile(request, username):
    user = get_object_or_404(User, username=username)
    user_profile = get_object_or_404(UserProfile, user=user)
    current_user_profile = get_object_or_404(UserProfile, user=request.user)

    if request.method == "PUT":
        if request.user in user_profile.followers.all():
            user_profile.followers.remove(request.user)
            is_following = False
        else:
            user_profile.followers.add(request.user)
            is_following = True

        if is_following:
            current_user_profile.following.add(user)
        else:
            current_user_profile.following.remove(user)

        return JsonResponse({"is_following": is_following})

    return JsonResponse(user_profile.serialize())

def all_posts(request, page_number):
    posts = Post.objects.all().order_by("-timestamp")
    paginator = Paginator(posts, 10)
    page_obj = paginator.get_page(page_number)
    response = {
        "prev_page": page_obj.previous_page_number() if page_obj.has_previous() else None,
        "next_page": page_obj.next_page_number() if page_obj.has_next() else None,
        "post_info": [post.serialize() for post in page_obj]
    }
    return JsonResponse(response, safe=False)

def following(request, page_number):
    profile = UserProfile.objects.get(user=request.user)
    following_users = profile.following.all()
    posts = []
    for user in following_users:
        p = list(user.my_posts.all())
        posts += p

    paginator = Paginator(posts, 10)
    page_obj = paginator.get_page(page_number)
    response = {
        "prev_page": page_obj.previous_page_number() if page_obj.has_previous() else None,
        "next_page": page_obj.next_page_number() if page_obj.has_next() else None,
        "post_info": [post.serialize() for post in page_obj]
    }
    return JsonResponse(response, safe=False)
