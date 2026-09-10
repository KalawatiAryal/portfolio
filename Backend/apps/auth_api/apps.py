"""
App configuration for authentication API.
"""
from django.apps import AppConfig


class AuthApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.auth_api'
    verbose_name = 'Authentication API'
    
    def ready(self):
        import apps.auth_api.signals
