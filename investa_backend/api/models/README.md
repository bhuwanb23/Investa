# Models Directory

This directory contains all database models organized by functionality. Each file contains related models that serve a specific purpose in the Investa application.

## 📁 Directory Structure

```
models/
├── __init__.py           # Main import file - exports all models
├── user.py              # User profile and language models
├── security.py          # Security settings and session models
├── privacy.py           # Privacy settings models
├── learning.py          # Learning progress and achievement models
├── trading.py           # Trading performance models
├── notifications.py     # Notification models
└── README.md           # This file
```

## 🗄️ Model Files

### `user.py` - User & Profile Models
**Purpose**: Core user data and profile information

**Models**:
- **`Language`**: Supported languages for the app
  - `code`: Language code (e.g., en, hi, ta)
  - `name`: Language name (e.g., English, Hindi, Tamil)
  - `native_name`: Native language name

- **`UserProfile`**: Extended user profile for investor education
  - `user`: OneToOne relationship with Django User
  - `avatar`: Profile picture
  - `phone_number`: Contact number
  - `preferred_language`: ForeignKey to Language
  - `learning_goal`: User's learning objective
  - `risk_profile`: Conservative/Moderate/Aggressive
  - `investment_experience`: Beginner/Intermediate/Advanced
  - `date_of_birth`: User's birth date
  - `level`: User level (1-100)
  - `experience_points`: XP system

### `security.py` - Security & Session Models
**Purpose**: User security preferences and session management

**Models**:
- **`SecuritySettings`**: User security preferences
  - `user`: OneToOne relationship with Django User
  - `biometric_enabled`: Biometric login toggle
  - `session_timeout`: Session timeout in minutes (5-120)
  - `login_notifications`: Login alert toggle
  - `suspicious_activity_alerts`: Security alert toggle
  - `two_factor_enabled`: 2FA toggle
  - `two_factor_secret`: 2FA secret key
  - `backup_codes`: JSON field for backup codes
  - `recovery_email`: Recovery email address
  - `last_password_change`: Password change timestamp

- **`UserSession`**: Track user login sessions
  - `user`: ForeignKey to Django User
  - `session_key`: Unique session identifier
  - `device_info`: Device information
  - `ip_address`: User's IP address
  - `user_agent`: Browser/device info
  - `is_active`: Session status
  - `last_activity`: Last activity timestamp

### `privacy.py` - Privacy Models
**Purpose**: User privacy preferences and data sharing settings

**Models**:
- **`PrivacySettings`**: User privacy preferences
  - `user`: OneToOne relationship with Django User
  - `profile_visibility`: Profile visibility toggle
  - `activity_visibility`: Activity visibility toggle
  - `data_sharing`: Data sharing consent
  - `location_sharing`: Location sharing toggle

### `learning.py` - Learning & Achievement Models
**Purpose**: Track learning progress and achievements

**Models**:
- **`LearningProgress`**: User's learning progress
  - `user`: OneToOne relationship with Django User
  - `total_modules`: Total available modules
  - `completed_modules`: Completed modules count
  - `total_hours_learned`: Total learning hours
  - `certificates_earned`: Certificates count
  - `average_quiz_score`: Average quiz performance
  - `quizzes_taken`: Total quizzes taken
  - `quizzes_passed`: Passed quizzes count
  - `badges_earned`: Earned badges count
  - `last_activity`: Last learning activity
  - `completion_percentage`: Calculated completion rate

- **`Badge`**: Achievement badges
  - `name`: Badge name
  - `description`: Badge description
  - `badge_type`: Learning/Trading/Security/Social
  - `icon_name`: Icon identifier
  - `color`: Hex color code
  - `criteria`: JSON field for earning criteria

- **`UserBadge`**: User earned badges
  - `user`: ForeignKey to Django User
  - `badge`: ForeignKey to Badge
  - `earned_at`: Timestamp when earned
  - Unique constraint on user + badge

### `trading.py` - Trading Models
**Purpose**: Track simulated trading performance

**Models**:
- **`TradingPerformance`**: User's trading performance
  - `user`: OneToOne relationship with Django User
  - `portfolio_value`: Current portfolio value
  - `portfolio_growth_percentage`: Growth percentage
  - `total_trades`: Total trades made
  - `successful_trades`: Successful trades count
  - `total_profit_loss`: Total P&L
  - `best_trade_profit`: Best profitable trade
  - `worst_trade_loss`: Worst losing trade
  - `success_rate`: Calculated success rate

### `notifications.py` - Notification Models
**Purpose**: User notification system

**Models**:
- **`Notification`**: User notifications
  - `user`: ForeignKey to Django User
  - `title`: Notification title
  - `message`: Notification message
  - `notification_type`: Security/Learning/Trading/Achievement/General
  - `read`: Read status
  - `created_at`: Creation timestamp
  - Ordered by creation date (newest first)

## 🔗 Relationships

### OneToOne Relationships
- `User` ↔ `UserProfile`
- `User` ↔ `SecuritySettings`
- `User` ↔ `PrivacySettings`
- `User` ↔ `LearningProgress`
- `User` ↔ `TradingPerformance`

### ForeignKey Relationships
- `UserProfile.preferred_language` → `Language`
- `UserSession.user` → `User`
- `Notification.user` → `User`
- `UserBadge.user` → `User`
- `UserBadge.badge` → `Badge`

## 📊 Database Schema

### User Profile Flow
1. User registers → `User` created
2. `UserProfile` automatically created with defaults
3. `SecuritySettings` automatically created with secure defaults
4. `PrivacySettings` automatically created with privacy-focused defaults
5. `LearningProgress` automatically created with zero values
6. `TradingPerformance` automatically created with zero values

### Security Flow
1. User logs in → `UserSession` created
2. Security checks against `SecuritySettings`
3. Privacy controls based on `PrivacySettings`

### Learning Flow
1. User completes modules → `LearningProgress` updated
2. Achievements unlocked → `Badge` created, `UserBadge` assigned
3. Notifications sent → `Notification` created

## 🛠️ Usage Examples

### Creating a User Profile
```python
from .models import UserProfile, Language

# Get or create language
language, created = Language.objects.get_or_create(
    code='en',
    defaults={'name': 'English', 'native_name': 'English'}
)

# Create user profile
profile = UserProfile.objects.create(
    user=user,
    preferred_language=language,
    risk_profile='moderate',
    investment_experience='beginner'
)
```

### Updating Learning Progress
```python
from .models import LearningProgress

progress = LearningProgress.objects.get(user=user)
progress.completed_modules += 1
progress.total_hours_learned += 2
progress.save()

# Access calculated property
print(f"Completion: {progress.completion_percentage}%")
```

### Creating Notifications
```python
from .models import Notification

Notification.objects.create(
    user=user,
    title="Achievement Unlocked!",
    message="You've completed your first module!",
    notification_type='achievement'
)
```

## 🔧 Maintenance

### Adding New Models
1. Create new model in appropriate file
2. Add to `__init__.py` exports
3. Create and run migrations
4. Update admin.py if needed
5. Update serializers and views

### Model Validation
- All models include proper validation
- ForeignKey relationships are properly defined
- Unique constraints where needed
- Calculated properties for derived data

### Performance Considerations
- Use `select_related()` for ForeignKey relationships
- Use `prefetch_related()` for ManyToMany relationships
- Index frequently queried fields
- Consider database partitioning for large tables
