"""
Admin configuration for authentication app.
"""
from django.contrib import admin
from .models import UserProfile, RefreshToken


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'location')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_blacklisted', 'created_at', 'expires_at')
    list_filter = ('is_blacklisted', 'created_at')
    search_fields = ('user__username', 'token')
    readonly_fields = ('token', 'created_at')
