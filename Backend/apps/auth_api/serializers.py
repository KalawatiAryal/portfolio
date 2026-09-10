"""
Serializers for authentication API.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserProfile, RefreshToken


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'bio', 'profile_picture', 'profile_picture_url', 'phone', 'location',
            'website', 'github', 'linkedin', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_profile_picture_url(self, obj):
        """Return absolute URL for the profile picture."""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password2 = serializers.CharField(write_only=True, required=True, min_length=8)
    profile = UserProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2', 'profile']
    
    def validate(self, data):
        """Validate password matching."""
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists.'})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already exists.'})
        
        return data
    
    def create(self, validated_data):
        """Create user and profile."""
        profile_data = validated_data.pop('profile', {})
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        
        # Create user profile
        UserProfile.objects.create(user=user, **profile_data)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user information."""
    
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'profile']
        read_only_fields = ['id', 'is_staff', 'is_superuser']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user information."""
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True, required=True, min_length=8)
    
    def validate(self, data):
        """Validate password matching."""
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match.'})
        
        return data


class RefreshTokenSerializer(serializers.ModelSerializer):
    """Serializer for refresh token."""
    
    class Meta:
        model = RefreshToken
        fields = ['token']
        read_only_fields = ['token']
