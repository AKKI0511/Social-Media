from django import forms
from .models import *

# Form for new comments
class NewForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content']