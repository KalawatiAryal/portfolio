"""
Views for authentication API.
"""
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import jwt
from django.conf import settings

from .models import UserProfile, RefreshToken
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    UserUpdateSerializer,
    PasswordChangeSerializer,
    UserProfileSerializer
)
from .authentication import generate_tokens


class AuthViewSet(viewsets.ViewSet):
    """ViewSet for authentication endpoints."""
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['register', 'login', 'refresh_token']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new user."""
        serializer = UserRegistrationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            tokens = generate_tokens(user)
            
            user_data = UserSerializer(user, context={'request': request}).data
            
            return Response({
                'message': 'User registered successfully.',
                'user': user_data,
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login user and return tokens."""
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')
        
        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {'error': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        tokens = generate_tokens(user)
        user_data = UserSerializer(user, context={'request': request}).data
        
        return Response({
            'message': 'Login successful.',
            'user': user_data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def refresh_token(self, request):
        """Refresh access token using refresh token."""
        refresh_token = request.data.get('refresh_token')
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            payload = jwt.decode(
                refresh_token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM]
            )
            
            if payload.get('type') != 'refresh':
                raise jwt.InvalidTokenError('Invalid token type.')
            
            user = User.objects.get(id=payload['user_id'])
            new_tokens = generate_tokens(user)
            
            return Response({
                'message': 'Token refreshed successfully.',
                'tokens': new_tokens
            }, status=status.HTTP_200_OK)
        
        except jwt.ExpiredSignatureError:
            return Response(
                {'error': 'Refresh token has expired.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except (jwt.InvalidTokenError, User.DoesNotExist):
            return Response(
                {'error': 'Invalid refresh token.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user information."""
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update user profile information (JSON or multipart form)."""
        user = request.user
        
        # Update user info
        user_serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Update profile info
        if 'profile' in request.data:
            # Nested JSON format: { profile: { ... } }
            profile_data = request.data.get('profile', {})
        else:
            # Flat multipart/JSON format: profile fields at top level
            profile_data = {}
            for field in ['bio', 'phone', 'location', 'website', 'github', 'linkedin']:
                if field in request.data:
                    profile_data[field] = request.data[field]
            # Profile picture can come from FILES or data
            picture = request.FILES.get('profile_picture') or request.data.get('profile_picture')
            if picture:
                profile_data['profile_picture'] = picture
        
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile_serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Profile updated successfully.',
            'user': UserSerializer(user, context={'request': request}).data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password."""
        user = request.user
        serializer = PasswordChangeSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        old_password = serializer.validated_data.get('old_password')
        new_password = serializer.validated_data.get('new_password')
        
        if not user.check_password(old_password):
            return Response(
                {'error': 'Old password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'Password changed successfully.'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logout user (invalidate refresh token)."""
        # In a production environment, you would blacklist the token here
        return Response({
            'message': 'Logged out successfully.'
        }, status=status.HTTP_200_OK)
