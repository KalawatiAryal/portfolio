"""
Models for portfolio app.
"""
from django.db import models
from django.contrib.auth.models import User


class HeroSection(models.Model):
    """Model for hero section content."""
    
    title = models.CharField(max_length=200, help_text="Main headline (e.g., 'Hello, I'm Kala')")
    subtitle = models.CharField(max_length=200, blank=True, default="", help_text="Secondary headline (e.g., 'Full-Stack Developer')")
    description = models.TextField(default="", help_text="Detailed description of the hero section")
    logo = models.ImageField(upload_to='hero/', blank=True, null=True, help_text="Hero section logo/image")
    primary_btn_text = models.CharField(max_length=100, default="Get Started Now", help_text="Primary button text")
    primary_btn_link = models.CharField(max_length=300, default="/register", blank=True, help_text="Primary button link")
    secondary_btn_text = models.CharField(max_length=100, default="Sign In", help_text="Secondary button text")
    secondary_btn_link = models.CharField(max_length=300, default="/login", blank=True, help_text="Secondary button link")
    background_color = models.CharField(max_length=7, default="#ffffff", help_text="Background color (hex)")
    text_color = models.CharField(max_length=7, default="#000000", help_text="Text color (hex)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Hero Section'
        verbose_name_plural = 'Hero Sections'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Hero Section - {self.title[:50]}"


class HeroStat(models.Model):
    """Model for hero statistics."""
    
    hero_section = models.ForeignKey(HeroSection, on_delete=models.CASCADE, related_name='stats')
    label = models.CharField(max_length=100, help_text="Stat label (e.g., 'Active Users')")
    value = models.CharField(max_length=50, help_text="Stat value (e.g., '1000+')")
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = 'Hero Stat'
        verbose_name_plural = 'Hero Stats'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.value} - {self.label}"


class NewsletterSubscriber(models.Model):
    """Model for newsletter subscribers."""
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    is_subscribed = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'
        ordering = ['-subscribed_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_subscribed']),
        ]
    
    def __str__(self):
        return f"{self.email} - {'Active' if self.is_subscribed else 'Inactive'}"


class HomepageSkill(models.Model):
    """Model for skills displayed on the homepage."""
    
    name = models.CharField(max_length=100, help_text="Skill name (e.g., 'Python')")
    icon_url = models.URLField(max_length=500, help_text="URL to the skill icon image")
    color = models.CharField(max_length=7, default="#667eea", help_text="Brand color hex (e.g., '#3776AB')")
    proficiency = models.PositiveIntegerField(default=0, help_text="Proficiency percentage (0-100)")
    description = models.TextField(help_text="Short description of the skill")
    order = models.PositiveIntegerField(default=0, help_text="Display order")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Homepage Skill'
        verbose_name_plural = 'Homepage Skills'
    
    def __str__(self):
        return self.name


class Project(models.Model):
    """Model for portfolio projects."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    technologies = models.CharField(max_length=500, help_text="Comma separated technologies")
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
    
    def __str__(self):
        return self.title


class Skill(models.Model):
    """Model for user skills."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    proficiency = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert'),
        ],
        default='intermediate'
    )
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'
    
    def __str__(self):
        return f"{self.name} - {self.get_proficiency_display()}"


class Experience(models.Model):
    """Model for work experience."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiences')
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'
    
    def __str__(self):
        return f"{self.title} at {self.company}"


class Contact(models.Model):
    """Model for contact messages."""
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'
    
    def __str__(self):
        return f"Message from {self.name}"
