from django.db import models
from django.contrib.auth.models import User


class Notification(models.Model):
    """User notifications"""
    NOTIFICATION_TYPES = [
        ('security', 'Security Alert'),
        ('learning', 'Learning Update'),
        ('trading', 'Trading Update'),
        ('achievement', 'Achievement'),
        ('general', 'General'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
