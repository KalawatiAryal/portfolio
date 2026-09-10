"""
Serializers for portfolio app.
"""
from rest_framework import serializers
from .models import Project, Skill, Experience, Contact, HeroSection, HeroStat, NewsletterSubscriber


class HeroStatSerializer(serializers.ModelSerializer):
    """Serializer for hero statistics."""
    
    class Meta:
        model = HeroStat
        fields = ['id', 'label', 'value', 'order']


class HeroSectionSerializer(serializers.ModelSerializer):
    """Serializer for hero section with nested stats."""
    
    stats = HeroStatSerializer(many=True, read_only=True)
    
    class Meta:
        model = HeroSection
        fields = [
            'id', 'title', 'subtitle', 'description', 'logo',
            'primary_btn_text', 'primary_btn_link',
            'secondary_btn_text', 'secondary_btn_link',
            'background_color', 'text_color', 'is_active', 'stats',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """Create hero section."""
        hero = HeroSection.objects.create(**validated_data)
        return hero
    
    def update(self, instance, validated_data):
        """Update hero section."""
        for attr, value in validated_data.items():
            if attr != 'stats':
                setattr(instance, attr, value)
        instance.save()
        return instance


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscribers."""
    
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'first_name', 'is_subscribed', 'subscribed_at', 'unsubscribed_at']
        read_only_fields = ['id', 'subscribed_at', 'unsubscribed_at']
    
    def validate_email(self, value):
        """Validate email is not already subscribed."""
        if self.instance:
            # Updating existing subscriber
            if NewsletterSubscriber.objects.filter(email=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("This email is already subscribed.")
        else:
            # Creating new subscriber
            if NewsletterSubscriber.objects.filter(email=value).exists():
                existing = NewsletterSubscriber.objects.get(email=value)
                if existing.is_subscribed:
                    raise serializers.ValidationError("This email is already subscribed.")
        return value
    
    def create(self, validated_data):
        """Create or reactivate subscriber."""
        email = validated_data.get('email')
        
        # Check if subscriber exists but is unsubscribed
        existing = NewsletterSubscriber.objects.filter(email=email).first()
        if existing:
            if not existing.is_subscribed:
                existing.is_subscribed = True
                existing.unsubscribed_at = None
                existing.save()
                return existing
            else:
                raise serializers.ValidationError("This email is already subscribed.")
        
        return super().create(validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for projects."""
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'image', 'link', 'github_link',
            'technologies', 'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for skills."""
    
    class Meta:
        model = Skill
        fields = ['id', 'name', 'proficiency', 'order']
        read_only_fields = ['id']


class ExperienceSerializer(serializers.ModelSerializer):
    """Serializer for experience."""
    
    class Meta:
        model = Experience
        fields = [
            'id', 'title', 'company', 'description', 'start_date',
            'end_date', 'is_current', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContactSerializer(serializers.ModelSerializer):
    """Serializer for contact messages."""
    
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
