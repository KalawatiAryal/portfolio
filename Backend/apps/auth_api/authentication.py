"""
Custom JWT authentication for the portfolio backend.
"""
import jwt
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings


class JWTAuthentication(BaseAuthentication):
    """Custom JWT authentication class."""
    
    def authenticate(self, request):
        """Authenticate the request using JWT token."""
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header:
            return None
        
        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            raise AuthenticationFailed('Invalid authorization header format.')
        
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM]
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token.')
        
        try:
            user = User.objects.get(id=payload['user_id'])
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found.')
        
        return (user, token)


def generate_tokens(user):
    """Generate access and refresh tokens for a user."""
    now = datetime.utcnow()
    
    # Access token payload
    access_payload = {
        'user_id': user.id,
        'username': user.username,
        'iat': now,
        'exp': now + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    }
    
    # Refresh token payload
    refresh_payload = {
        'user_id': user.id,
        'type': 'refresh',
        'iat': now,
        'exp': now + timedelta(days=7)
    }
    
    access_token = jwt.encode(
        access_payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    refresh_token = jwt.encode(
        refresh_payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'expires_in': int(timedelta(hours=settings.JWT_EXPIRATION_HOURS).total_seconds())
    }
