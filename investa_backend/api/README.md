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
│   ├── models/                    # Organized model structure
│   │   ├── __init__.py           # Model imports
│   │   ├── user.py               # User & Language models
│   │   ├── security.py           # Security & Session models
│   │   ├── privacy.py            # Privacy settings models
│   │   ├── learning.py           # Learning & Badge models
│   │   ├── trading.py            # Trading performance models
│   │   └── notifications.py      # Notification models
│   ├── serializers/              # Organized serializer structure
│   │   ├── __init__.py           # Serializer imports
│   │   ├── auth.py               # Authentication serializers
│   │   ├── user.py               # User profile serializers
│   │   ├── security.py           # Security serializers
│   │   ├── privacy.py            # Privacy serializers
│   │   ├── learning.py           # Learning serializers
│   │   ├── trading.py            # Trading serializers
│   │   └── notifications.py      # Notification serializers
│   ├── views/                    # Organized view structure
│   │   ├── __init__.py           # View imports
│   │   ├── auth.py               # Authentication views
│   │   ├── user.py               # User profile views
│   │   ├── security.py           # Security views
│   │   ├── privacy.py            # Privacy views
│   │   ├── learning.py           # Learning views
│   │   ├── trading.py            # Trading views
│   │   ├── notifications.py      # Notification views
│   │   └── console.py            # Development console views
│   ├── urls/                     # URL organization
│   │   ├── __init__.py
│   │   ├── api.py                # API endpoints
│   │   └── console.py            # Console views
│   ├── templates/                # HTML templates
│   │   ├── base.html             # Base template with navbar
│   │   ├── index.html            # Landing page
│   │   ├── dashboard.html        # Development dashboard
│   │   └── database.html         # Database explorer
│   ├── migrations/               # Database migrations
│   ├── models.py                 # Main models import
│   ├── serializers.py            # Main serializers import
│   ├── views.py                  # Main views import
│   ├── admin.py                  # Django admin configuration
│   ├── apps.py                   # App configuration
│   ├── tests.py                  # Test files
│   └── README.md                 # This file
```

## 🗄️ Database Models

### User Models (`models/user.py`)
- **Language**: Supported languages for the app
- **UserProfile**: Extended user profile with avatar, phone, language preferences, learning goals, risk profile, experience level, and XP system

### Security Models (`models/security.py`)
- **SecuritySettings**: Biometric login, 2FA, session timeout, notifications, recovery email
- **UserSession**: Track user login sessions for security monitoring

### Privacy Models (`models/privacy.py`)
- **PrivacySettings**: Profile visibility, activity visibility, data sharing, location sharing

### Learning Models (`models/learning.py`)
- **LearningProgress**: Modules completed, hours learned, certificates, quiz scores, badges earned
- **Badge**: Achievement badges with criteria and visual properties
- **UserBadge**: User earned badges with timestamps

### Trading Models (`models/trading.py`)
- **TradingPerformance**: Portfolio value, growth percentage, trade statistics, profit/loss tracking

### Notification Models (`models/notifications.py`)
- **Notification**: User notifications with types, read status, and timestamps

## 🔌 API Endpoints

### Authentication (`/api/auth/`)
- `POST /auth/login/` - User login with token
- `POST /auth/register/` - User registration
- `GET /auth/me/` - Get current user data
- `POST /auth/logout/` - Logout and invalidate token

### User Profile (`/api/profiles/`)
- `GET /profiles/` - List user profiles (authenticated users only)
- `GET /profiles/{id}/` - Get specific profile
- `PUT /profiles/{id}/` - Update profile
- `GET /profiles/my_profile/` - Get current user's profile
- `PUT /profiles/update_profile/` - Update current user's profile
- `POST /profiles/complete_profile/` - Complete profile setup

### Security Settings (`/api/security-settings/`)
- `GET /security-settings/` - List security settings
- `GET /security-settings/{id}/` - Get specific settings
- `PUT /security-settings/{id}/` - Update settings
- `GET /security-settings/my_settings/` - Get current user's settings
- `PUT /security-settings/update_settings/` - Update current user's settings
- `POST /security-settings/toggle_2fa/` - Toggle two-factor authentication

### Privacy Settings (`/api/privacy-settings/`)
- `GET /privacy-settings/` - List privacy settings
- `GET /privacy-settings/{id}/` - Get specific settings
- `PUT /privacy-settings/{id}/` - Update settings
- `GET /privacy-settings/my_settings/` - Get current user's settings
- `PUT /privacy-settings/update_settings/` - Update current user's settings

### Learning Progress (`/api/learning-progress/`)
- `GET /learning-progress/` - List learning progress
- `GET /learning-progress/{id}/` - Get specific progress
- `GET /learning-progress/my_progress/` - Get current user's progress
- `POST /learning-progress/update_progress/` - Update learning progress

### Trading Performance (`/api/trading-performance/`)
- `GET /trading-performance/` - List trading performance
- `GET /trading-performance/{id}/` - Get specific performance
- `GET /trading-performance/my_performance/` - Get current user's performance
- `POST /trading-performance/update_performance/` - Update trading performance

### Notifications (`/api/notifications/`)
- `GET /notifications/` - List notifications
- `GET /notifications/{id}/` - Get specific notification
- `GET /notifications/my_notifications/` - Get current user's notifications
- `POST /notifications/mark_all_read/` - Mark all notifications as read
- `POST /notifications/{id}/mark_read/` - Mark specific notification as read
- `GET /notifications/unread_count/` - Get unread notification count

### Badges (`/api/badges/`)
- `GET /badges/` - List all badges
- `GET /badges/{id}/` - Get specific badge
- `GET /badges/my_badges/` - Get current user's earned badges
- `GET /badges/available_badges/` - Get all available badges

### Languages (`/api/languages/`)
- `GET /languages/` - List supported languages
- `GET /languages/{id}/` - Get specific language

### User Sessions (`/api/sessions/`)
- `GET /sessions/` - List user sessions
- `GET /sessions/{id}/` - Get specific session
- `POST /sessions/logout_all_devices/` - Logout from all devices except current

## 🎯 Console Views

### Home (`/`)
- Landing page with quick links to dashboard and database explorer

### Dashboard (`/dashboard/`)
- Interactive development dashboard
- API testing interface
- Quick stats and system information
- Authentication forms for testing
- Recent activity feed

### Database Explorer (`/database/`)
- Interactive database table explorer
- Real-time data viewing
- Export functionality (CSV)
- Search and filter capabilities
- Table schema information

## 🔧 Development Features

### Automatic Profile Creation
When a user registers or logs in for the first time, the system automatically creates:
- UserProfile with default settings
- SecuritySettings with secure defaults
- PrivacySettings with privacy-focused defaults
- LearningProgress with zero values
- TradingPerformance with zero values

### Security Features
- Token-based authentication
- Session tracking and management
- Two-factor authentication support
- Biometric login support
- Suspicious activity alerts
- Login notifications

### Data Validation
- Comprehensive field validation
- Unique constraint enforcement
- Data type validation
- Business logic validation

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

3. **Create Superuser**:
   ```bash
   python manage.py createsuperuser
   ```

4. **Start Development Server**:
   ```bash
   python manage.py runserver
   ```

5. **Access Console**:
   - Open `http://localhost:8000/` for the main console
   - Open `http://localhost:8000/admin/` for Django admin

## 📝 API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword",
    "confirm_password": "securepassword",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### User Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:8000/api/profiles/my_profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:8000/api/profiles/update_profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "risk_profile": "moderate",
    "investment_experience": "intermediate"
  }'
```

## 🔗 Related Links

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [Investa Mobile App Repository](link-to-mobile-repo)
