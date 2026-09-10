"""
Authentication models for the portfolio backend.
"""
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile model."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'


class RefreshToken(models.Model):
    """Model to store refresh tokens for token blacklisting."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refresh_tokens')
    token = models.TextField()
    is_blacklisted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"Refresh token for {self.user.username}"
    
    class Meta:
        verbose_name = 'Refresh Token'
        verbose_name_plural = 'Refresh Tokens'
