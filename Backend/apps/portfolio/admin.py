"""
Admin configuration for portfolio app.
"""
from django.contrib import admin
from .models import Project, Skill, Experience, Contact, HeroSection, HeroStat, NewsletterSubscriber


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'subtitle', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Main Content', {
            'fields': ('title', 'subtitle', 'description', 'logo')
        }),
        ('Primary Button', {
            'fields': ('primary_btn_text', 'primary_btn_link')
        }),
        ('Secondary Button', {
            'fields': ('secondary_btn_text', 'secondary_btn_link')
        }),
        ('Styling', {
            'fields': ('background_color', 'text_color')
        }),
        ('Status', {
            'fields': ('is_active', 'created_at', 'updated_at')
        }),
    )


class HeroStatInline(admin.TabularInline):
    model = HeroStat
    extra = 1
    fields = ('label', 'value', 'order')


@admin.register(HeroStat)
class HeroStatAdmin(admin.ModelAdmin):
    list_display = ('hero_section', 'label', 'value', 'order')
    list_filter = ('hero_section', 'order')
    search_fields = ('label', 'value')


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'is_subscribed', 'subscribed_at')
    list_filter = ('is_subscribed', 'subscribed_at')
    search_fields = ('email', 'first_name')
    readonly_fields = ('subscribed_at', 'unsubscribed_at')
    fieldsets = (
        ('Information', {
            'fields': ('email', 'first_name')
        }),
        ('Subscription', {
            'fields': ('is_subscribed', 'subscribed_at', 'unsubscribed_at')
        }),
    )
    actions = ['mark_subscribed', 'mark_unsubscribed']
    
    def mark_subscribed(self, request, queryset):
        queryset.update(is_subscribed=True, unsubscribed_at=None)
    mark_subscribed.short_description = "Mark selected as subscribed"
    
    def mark_unsubscribed(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_subscribed=False, unsubscribed_at=timezone.now())
    mark_unsubscribed.short_description = "Mark selected as unsubscribed"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'is_featured', 'created_at')
    list_filter = ('is_featured', 'created_at', 'user')
    search_fields = ('title', 'description', 'technologies')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'proficiency', 'order')
    list_filter = ('proficiency', 'user')
    search_fields = ('name', 'user__username')


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'user', 'is_current', 'start_date')
    list_filter = ('is_current', 'start_date', 'user')
    search_fields = ('title', 'company', 'description', 'user__username')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"
    
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
    mark_as_unread.short_description = "Mark selected messages as unread"
