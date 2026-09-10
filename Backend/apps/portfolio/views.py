"""
Views for portfolio app.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import (
    Project, Skill, Experience, Contact, HeroSection, 
    HeroStat, NewsletterSubscriber
)
from .serializers import (
    ProjectSerializer, SkillSerializer, ExperienceSerializer,
    ContactSerializer, HeroSectionSerializer, HeroStatSerializer,
    NewsletterSubscriberSerializer
)


class HeroSectionViewSet(viewsets.ModelViewSet):
    """ViewSet for hero section (CRUD operations with nested stats)."""
    
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def create(self, request, *args, **kwargs):
        """Create hero section with statistics."""
        data = request.data.copy()
        stats_data = data.pop('stats', [])
        
        # Create hero section
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        hero = serializer.save()
        
        # Create statistics
        for i, stat in enumerate(stats_data):
            HeroStat.objects.create(
                hero_section=hero,
                label=stat.get('label'),
                value=stat.get('value'),
                order=i
            )
        
        # Re-fetch with stats
        hero_data = HeroSectionSerializer(hero).data
        return Response(hero_data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Update hero section with statistics."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        data = request.data.copy()
        stats_data = data.pop('stats', None)
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        hero = serializer.save()
        
        # Update statistics if provided
        if stats_data is not None:
            hero.stats.all().delete()
            for i, stat in enumerate(stats_data):
                HeroStat.objects.create(
                    hero_section=hero,
                    label=stat.get('label'),
                    value=stat.get('value'),
                    order=i
                )
        
        # Re-fetch with stats
        hero_data = HeroSectionSerializer(hero).data
        return Response(hero_data)
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get the latest active hero section."""
        hero = HeroSection.objects.filter(is_active=True).order_by('-created_at').first()
        if not hero:
            return Response(
                {'error': 'No active hero section found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(hero)
        return Response(serializer.data)


class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    """ViewSet for newsletter subscribers."""
    
    serializer_class = NewsletterSubscriberSerializer
    
    def get_queryset(self):
        """Return subscribers based on user type."""
        # For any list/retrieve operation, if authenticated, return all
        # This includes admin users accessing the admin panel
        if self.request.user and self.request.user.is_authenticated:
            if self.request.user.is_staff:
                # Staff can see all subscribers (active and inactive)
                return NewsletterSubscriber.objects.all()
        
        # Non-authenticated users can't list
        # But we'll return empty queryset instead of 403
        return NewsletterSubscriber.objects.none()
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['list', 'retrieve', 'destroy', 'update', 'partial_update']:
            # Require authentication for admin operations
            permission_classes = [IsAuthenticated]
        else:
            # Allow anyone for subscribe/unsubscribe/check/count
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        """Subscribe to newsletter."""
        email = request.data.get('email', '').strip().lower()
        first_name = request.data.get('first_name', '').strip()
        
        if not email:
            return Response(
                {'error': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already subscribed
        existing = NewsletterSubscriber.objects.filter(email=email).first()
        
        if existing:
            if existing.is_subscribed:
                return Response(
                    {'message': 'Email is already subscribed.', 'subscriber': self.get_serializer(existing).data},
                    status=status.HTTP_200_OK
                )
            else:
                # Reactivate subscription
                existing.is_subscribed = True
                existing.unsubscribed_at = None
                if first_name:
                    existing.first_name = first_name
                existing.save()
                return Response(
                    {'message': 'Successfully resubscribed!', 'subscriber': self.get_serializer(existing).data},
                    status=status.HTTP_200_OK
                )
        
        # Create new subscriber
        serializer = self.get_serializer(data={
            'email': email,
            'first_name': first_name
        })
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Successfully subscribed to newsletter!', 'subscriber': serializer.data},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def unsubscribe(self, request):
        """Unsubscribe from newsletter."""
        email = request.data.get('email', '').strip().lower()
        
        if not email:
            return Response(
                {'error': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        subscriber = NewsletterSubscriber.objects.filter(email=email).first()
        
        if not subscriber:
            return Response(
                {'error': 'Email not found in subscriber list.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not subscriber.is_subscribed:
            return Response(
                {'message': 'Email is already unsubscribed.'},
                status=status.HTTP_200_OK
            )
        
        subscriber.is_subscribed = False
        from django.utils import timezone
        subscriber.unsubscribed_at = timezone.now()
        subscriber.save()
        
        return Response(
            {'message': 'Successfully unsubscribed from newsletter.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Get subscriber count."""
        count = NewsletterSubscriber.objects.filter(is_subscribed=True).count()
        return Response({'total_subscribers': count}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def check(self, request):
        """Check if email is subscribed."""
        email = request.query_params.get('email', '').strip().lower()
        
        if not email:
            return Response(
                {'error': 'Email parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        subscriber = NewsletterSubscriber.objects.filter(email=email).first()
        
        if not subscriber:
            return Response(
                {'email': email, 'is_subscribed': False},
                status=status.HTTP_200_OK
            )
        
        return Response(
            {'email': email, 'is_subscribed': subscriber.is_subscribed},
            status=status.HTTP_200_OK
        )


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for managing projects."""
    
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_featured', 'user']
    search_fields = ['title', 'description', 'technologies']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter projects by current user if editing."""
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return Project.objects.filter(user=self.request.user)
        return Project.objects.all()
    
    def perform_create(self, serializer):
        """Set the user when creating a project."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured projects."""
        projects = Project.objects.filter(is_featured=True)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)


class SkillViewSet(viewsets.ModelViewSet):
    """ViewSet for managing skills."""
    
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user', 'proficiency']
    ordering_fields = ['order', 'name']
    ordering = ['order']
    
    def get_queryset(self):
        """Filter skills by current user if editing."""
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return Skill.objects.filter(user=self.request.user)
        return Skill.objects.all()
    
    def perform_create(self, serializer):
        """Set the user when creating a skill."""
        serializer.save(user=self.request.user)


class ExperienceViewSet(viewsets.ModelViewSet):
    """ViewSet for managing experience."""
    
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user', 'is_current']
    search_fields = ['title', 'company', 'description']
    ordering_fields = ['start_date', 'title']
    ordering = ['-start_date']
    
    def get_queryset(self):
        """Filter experiences by current user if editing."""
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return Experience.objects.filter(user=self.request.user)
        return Experience.objects.all()
    
    def perform_create(self, serializer):
        """Set the user when creating experience."""
        serializer.save(user=self.request.user)


class ContactViewSet(viewsets.ModelViewSet):
    """ViewSet for managing contact messages."""
    
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_read']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Only allow admins to view all messages."""
        if self.request.user.is_staff:
            return Contact.objects.all()
        return Contact.objects.none()
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def recent(self, request):
        """Get recent contact messages (public)."""
        count = Contact.objects.count()
        return Response({'total_messages': count})
