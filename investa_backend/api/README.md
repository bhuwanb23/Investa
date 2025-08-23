# Investa API & Console

Django REST Framework API and development console for the Investa learning platform. This document covers both the API endpoints and the development console features.

## 🚀 Quick Start

### Development Console
- **Local Console**: `http://localhost:8000/`
- **Dashboard**: `http://localhost:8000/dashboard/`
- **Database Explorer**: `http://localhost:8000/database/`
- **Admin Panel**: `http://localhost:8000/admin/`

### API Base URL
- **Local API**: `http://localhost:8000/api/`
- **Android Emulator**: `http://10.0.2.2:8000/api/`

## 📁 Project Structure

```
investa_backend/
├── api/
│   ├── urls/                    # URL organization
│   │   ├── __init__.py
│   │   ├── api.py              # API endpoints
│   │   └── console.py          # Console views
│   ├── templates/              # HTML templates
│   │   ├── base.html           # Base template with navbar
│   │   ├── index.html          # Landing page
│   │   ├── dashboard.html      # Development dashboard
│   │   └── database.html       # Database explorer
│   ├── models.py               # Database models
│   ├── views.py                # API views and ViewSets
│   ├── serializers.py          # DRF serializers
│   ├── admin.py                # Django admin configuration
│   └── README.md               # This file
└── investa_backend/
    ├── settings.py             # Django settings
    └── urls.py                 # Main URL configuration
```

## 🗄️ Database Models

### Core Models
- **Language**: Supported languages for the app
- **UserProfile**: Extended user profile with learning preferences
- **SecuritySettings**: User security preferences and 2FA settings
- **PrivacySettings**: User privacy preferences
- **LearningProgress**: Track user's learning achievements
- **TradingPerformance**: Track simulated trading performance
- **UserSession**: Track user login sessions for security
- **Notification**: User notifications system
- **Badge**: Achievement badges
- **UserBadge**: User earned badges

### Model Relationships
- Each user has one profile, security settings, privacy settings, learning progress, and trading performance
- Users can have multiple sessions, notifications, and badges
- Languages are referenced by user profiles

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (returns token)
- `GET /api/auth/me/` - Get current user data
- `POST /api/auth/logout/` - Logout (invalidate token)

### User Profile
- `GET /api/profiles/` - List user profiles (own only)
- `GET /api/profiles/my_profile/` - Get complete profile data
- `PUT /api/profiles/update_profile/` - Update profile
- `POST /api/profiles/complete_profile/` - Complete profile setup

### Security Settings
- `GET /api/security-settings/` - List security settings (own only)
- `GET /api/security-settings/my_settings/` - Get security settings
- `PUT /api/security-settings/update_settings/` - Update security settings
- `POST /api/security-settings/toggle_2fa/` - Toggle 2FA

### Privacy Settings
- `GET /api/privacy-settings/` - List privacy settings (own only)
- `GET /api/privacy-settings/my_settings/` - Get privacy settings
- `PUT /api/privacy-settings/update_settings/` - Update privacy settings

### Learning Progress
- `GET /api/learning-progress/` - List learning progress (own only)
- `GET /api/learning-progress/my_progress/` - Get learning progress

### Trading Performance
- `GET /api/trading-performance/` - List trading performance (own only)
- `GET /api/trading-performance/my_performance/` - Get trading performance

### Sessions
- `GET /api/sessions/` - List active sessions (own only)
- `POST /api/sessions/logout_all_devices/` - Logout from all devices

### Notifications
- `GET /api/notifications/` - List notifications (own only)
- `GET /api/notifications/unread_count/` - Get unread count
- `GET /api/notifications/by_type/` - Filter by type
- `POST /api/notifications/{id}/mark_read/` - Mark as read
- `POST /api/notifications/mark_all_read/` - Mark all as read

### Badges
- `GET /api/badges/` - List all badges
- `GET /api/badges/my_badges/` - Get user's earned badges

### Languages
- `GET /api/languages/` - List supported languages

## 🔐 Authentication

The API uses Django REST Framework's Token Authentication:

1. **Register**: `POST /api/auth/register/`
   ```json
   {
     "username": "user123",
     "email": "user@example.com",
     "password": "password123",
     "confirm_password": "password123",
     "first_name": "John",
     "last_name": "Doe"
   }
   ```

2. **Login**: `POST /api/auth/login/`
   ```json
   {
     "username": "user123",
     "password": "password123"
   }
   ```

3. **Use Token**: Include in headers
   ```
   Authorization: Token your_token_here
   ```

## 📊 Profile Data Structure

### User Profile
```json
{
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "avatar": "avatars/profile.jpg",
  "phone_number": "+1234567890",
  "preferred_language": {
    "code": "en",
    "name": "English",
    "native_name": "English"
  },
  "learning_goal": "Advanced Trading Strategies",
  "risk_profile": "moderate",
  "investment_experience": "intermediate",
  "level": 7,
  "experience_points": 2450
}
```

### Security Settings
```json
{
  "biometric_enabled": true,
  "session_timeout": 30,
  "login_notifications": true,
  "suspicious_activity_alerts": true,
  "two_factor_enabled": false,
  "recovery_email": "recovery@example.com"
}
```

### Privacy Settings
```json
{
  "profile_visibility": true,
  "activity_visibility": false,
  "data_sharing": true,
  "location_sharing": false
}
```

### Learning Progress
```json
{
  "total_modules": 30,
  "completed_modules": 22,
  "completion_percentage": 73.3,
  "total_hours_learned": 156,
  "certificates_earned": 12,
  "average_quiz_score": 87.5,
  "quizzes_taken": 45,
  "quizzes_passed": 38,
  "badges_earned": 7
}
```

### Trading Performance
```json
{
  "portfolio_value": 12500.00,
  "portfolio_growth_percentage": 24.7,
  "total_trades": 127,
  "successful_trades": 99,
  "success_rate": 78.0,
  "total_profit_loss": 2500.00,
  "best_trade_profit": 500.00,
  "worst_trade_loss": -200.00
}
```

## 🛠️ Development

### Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Run migrations: `python manage.py migrate`
3. Create superuser: `python manage.py createsuperuser`
4. Start server: `python manage.py runserver`

### Console Features
- **Dashboard**: Interactive API testing interface
- **Database Explorer**: Real-time database visualization
- **Admin Panel**: Django admin for data management

### API Testing
Use the dashboard at `http://localhost:8000/dashboard/` to test API endpoints with a user-friendly interface.

## 🔧 Configuration

### Environment Variables
- `DEBUG`: Set to `True` for development
- `SECRET_KEY`: Django secret key
- `DATABASE_URL`: Database connection string

### CORS Settings
Configure CORS for mobile app development:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## 📱 Mobile App Integration

### Base URLs
- **Development**: `http://10.0.2.2:8000/api/` (Android Emulator)
- **Production**: `https://your-domain.com/api/`

### Key Endpoints for Mobile
1. **Registration**: `/api/auth/register/`
2. **Login**: `/api/auth/login/`
3. **Profile**: `/api/profiles/my_profile/`
4. **Settings**: `/api/security-settings/my_settings/`
5. **Progress**: `/api/learning-progress/my_progress/`

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG = False`
- [ ] Configure production database
- [ ] Set up static file serving
- [ ] Configure CORS for production domains
- [ ] Set up SSL/HTTPS
- [ ] Configure email backend
- [ ] Set up monitoring and logging

### Docker Deployment
```bash
docker build -t investa-backend .
docker run -p 8000:8000 investa-backend
```

## 📚 Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [Django Documentation](https://docs.djangoproject.com/)
- [Investa Mobile App Repository](link-to-mobile-repo)
