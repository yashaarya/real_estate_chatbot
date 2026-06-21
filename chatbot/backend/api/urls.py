from django.urls import path
from .views import analyze_property, chat

urlpatterns = [
    path('analyze/', analyze_property, name='analyze'),
    path('chat/', chat, name='chat'),
]
