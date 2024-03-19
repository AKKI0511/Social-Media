from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    poster = models.ForeignKey('User', on_delete=models.CASCADE, related_name="my_posts")
    content = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField("User", blank=True, related_name='liked_posts')

    def __str__(self) -> str:
        return f"{self.id} - {self.poster}: {self.content}"
    
    def like_post(self, user):
        if user not in self.likes.all():
            self.likes.add(user)
        else:
            self.likes.remove(user)

    def num_of_likes(self):
        return str(len(self.likes.all()))
    
    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": len(self.likes.all()),
            "liked_users": [like.username for like in self.likes.all()]
        }
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, related_name='following', blank=True)
    following = models.ManyToManyField(User, related_name='followers', blank=True)  # Add this line

    def __str__(self):
        return self.user.username
    
    def serialize(self):
        return {
            "id": self.id,
            "posts": [post.serialize() for post in self.user.my_posts.all().order_by("-timestamp")],
            "username": self.user.username,
            "followers": [follower.username for follower in self.followers.all() if follower != self.user],
            "following": [following.username for following in self.following.all() if following != self.user]
        }
