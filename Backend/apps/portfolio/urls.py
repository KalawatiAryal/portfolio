"""
URL configuration for portfolio app.
"""
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, SkillViewSet, ExperienceViewSet, ContactViewSet,
    HeroSectionViewSet, NewsletterSubscriberViewSet
)

router = DefaultRouter()
router.register(r'hero', HeroSectionViewSet, basename='hero')
router.register(r'newsletter', NewsletterSubscriberViewSet, basename='newsletter')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'contacts', ContactViewSet, basename='contact')

urlpatterns = router.urls
