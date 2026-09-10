"""
URL configuration for authentication API.
"""
from django.urls import path
from .views import AuthViewSet

urlpatterns = [
    path('register/', AuthViewSet.as_view({'post': 'register'}), name='register'),
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('refresh-token/', AuthViewSet.as_view({'post': 'refresh_token'}), name='refresh-token'),
    path('me/', AuthViewSet.as_view({'get': 'me'}), name='me'),
    path('update-profile/', AuthViewSet.as_view({'put': 'update_profile'}), name='update-profile'),
    path('change-password/', AuthViewSet.as_view({'post': 'change_password'}), name='change-password'),
    path('logout/', AuthViewSet.as_view({'post': 'logout'}), name='logout'),
]
