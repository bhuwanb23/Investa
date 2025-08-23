# Serializers Directory

This directory contains all Django REST Framework serializers organized by functionality. Each file contains related serializers that handle data transformation for specific model groups.

## 📁 Directory Structure

```
serializers/
├── __init__.py           # Main import file - exports all serializers
├── auth.py              # Authentication and user registration serializers
├── user.py              # User profile and language serializers
├── security.py          # Security settings serializers
├── privacy.py           # Privacy settings serializers
├── learning.py          # Learning progress and achievement serializers
├── trading.py           # Trading performance serializers
├── notifications.py     # Notification serializers
└── README.md           # This file
```

## 🔄 Serializer Files

### `auth.py` - Authentication Serializers
**Purpose**: Handle user authentication and registration

**Serializers**:
- **`UserSerializer`**: Basic user information
  - **Fields**: `id`, `username`, `email`, `first_name`, `last_name`, `date_joined`
  - **Read-only**: `id`, `date_joined`
  - **Usage**: Display user information in responses

- **`UserRegistrationSerializer`**: User registration with validation
  - **Fields**: `username`, `email`, `password`, `confirm_password`, `first_name`, `last_name`
  - **Validation**: 
    - Username uniqueness
    - Email uniqueness
    - Password confirmation match
  - **Write-only**: `password`, `confirm_password`
  - **Usage**: User registration endpoint

### `user.py` - User Profile Serializers
**Purpose**: Handle user profile and language data

**Serializers**:
- **`LanguageSerializer`**: Language information
  - **Fields**: All fields from Language model
  - **Usage**: Language selection and display

- **`UserProfileSerializer`**: Basic user profile
  - **Fields**: All UserProfile fields
  - **Nested**: `user` (UserSerializer), `preferred_language` (LanguageSerializer)
  - **Read-only**: `created_at`, `updated_at`
  - **Usage**: Profile display and basic operations

- **`UserProfileDetailSerializer`**: Detailed user profile
  - **Fields**: All UserProfile fields with nested relationships
  - **Usage**: Complete profile information display

- **`ProfileUpdateSerializer`**: Profile update operations
  - **Fields**: All UserProfile fields
  - **Read-only**: `user`, `created_at`, `updated_at`
  - **Usage**: Profile update endpoints

- **`CompleteProfileSerializer`**: Profile completion
  - **Fields**: `phone_number`, `preferred_language`, `learning_goal`, `risk_profile`, `investment_experience`, `date_of_birth`
  - **Read-only**: `user`, `created_at`, `updated_at`
  - **Usage**: Initial profile setup

### `security.py` - Security Serializers
**Purpose**: Handle security settings and session data

**Serializers**:
- **`SecuritySettingsSerializer`**: Security settings display
  - **Fields**: All SecuritySettings fields
  - **Nested**: `user` (UserSerializer)
  - **Read-only**: `user`, `created_at`, `updated_at`, `last_password_change`
  - **Usage**: Security settings display

- **`SecuritySettingsUpdateSerializer`**: Security settings update
  - **Fields**: All SecuritySettings fields
  - **Read-only**: `user`, `created_at`, `updated_at`, `last_password_change`
  - **Usage**: Security settings update endpoints

- **`UserSessionSerializer`**: User session information
  - **Fields**: All UserSession fields
  - **Nested**: `user` (UserSerializer)
  - **Read-only**: `user`, `created_at`, `last_activity`
  - **Usage**: Session management

### `privacy.py` - Privacy Serializers
**Purpose**: Handle privacy settings data

**Serializers**:
- **`PrivacySettingsSerializer`**: Privacy settings display
  - **Fields**: All PrivacySettings fields
  - **Nested**: `user` (UserSerializer)
  - **Read-only**: `user`, `created_at`, `updated_at`
  - **Usage**: Privacy settings display

- **`PrivacySettingsUpdateSerializer`**: Privacy settings update
  - **Fields**: All PrivacySettings fields
  - **Read-only**: `user`, `created_at`, `updated_at`
  - **Usage**: Privacy settings update endpoints

### `learning.py` - Learning Serializers
**Purpose**: Handle learning progress and achievement data

**Serializers**:
- **`LearningProgressSerializer`**: Learning progress display
  - **Fields**: All LearningProgress fields
  - **Nested**: `user` (UserSerializer)
  - **Read-only**: `user`, `created_at`, `updated_at`, `last_activity`, `completion_percentage`
  - **Usage**: Learning progress display

- **`BadgeSerializer`**: Badge information
  - **Fields**: All Badge fields
  - **Read-only**: `created_at`
  - **Usage**: Badge display and management

- **`UserBadgeSerializer`**: User earned badges
  - **Fields**: All UserBadge fields
  - **Nested**: `user` (UserSerializer), `badge` (BadgeSerializer)
  - **Read-only**: `user`, `badge`, `earned_at`
  - **Usage**: User achievements display

### `trading.py` - Trading Serializers
**Purpose**: Handle trading performance data

**Serializers**:
- **`TradingPerformanceSerializer`**: Trading performance display
  - **Fields**: All TradingPerformance fields
  - **Nested**: `user` (UserSerializer)
  - **Read-only**: `user`, `created_at`, `updated_at`, `success_rate`
  - **Usage**: Trading performance display

### `notifications.py` - Notification Serializers
**Purpose**: Handle notification data

**Serializers**:
- **`NotificationSerializer`**: Notification display
  - **Fields**: All Notification fields
  - **Nested**: `user` (UserSerializer)
  - **Read-only**: `user`, `created_at`
  - **Usage**: Notification display and management

## 🔗 Serializer Relationships

### Nested Serializers
- User-related serializers include nested `UserSerializer`
- Profile serializers include nested `LanguageSerializer`
- Badge serializers include nested `BadgeSerializer`
- All serializers maintain proper read-only fields

### Validation Rules
- **Unique Fields**: Username, email validation in registration
- **Password Confirmation**: Registration requires password confirmation
- **Required Fields**: Essential fields marked as required
- **Field Types**: Proper field types and formats

## 🛠️ Usage Examples

### User Registration
```python
from .serializers import UserRegistrationSerializer

serializer = UserRegistrationSerializer(data=request.data)
if serializer.is_valid():
    user = serializer.save()
    # User and related models created automatically
```

### Profile Update
```python
from .serializers import ProfileUpdateSerializer

serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
if serializer.is_valid():
    serializer.save()
```

### Learning Progress Display
```python
from .serializers import LearningProgressSerializer

progress = LearningProgress.objects.get(user=user)
serializer = LearningProgressSerializer(progress)
return Response(serializer.data)
```

### Creating Notifications
```python
from .serializers import NotificationSerializer

notification = Notification.objects.create(...)
serializer = NotificationSerializer(notification)
return Response(serializer.data)
```

## 🔧 Custom Serializer Features

### Calculated Fields
- `completion_percentage` in LearningProgressSerializer
- `success_rate` in TradingPerformanceSerializer

### Nested Relationships
- Automatic inclusion of related model data
- Proper read-only protection for nested fields

### Validation
- Custom validation methods for complex business logic
- Field-level validation for data integrity

## 📊 Response Formats

### User Profile Response
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "preferred_language": {
    "id": 1,
    "code": "en",
    "name": "English",
    "native_name": "English"
  },
  "risk_profile": "moderate",
  "investment_experience": "beginner",
  "level": 5,
  "experience_points": 1250
}
```

### Learning Progress Response
```json
{
  "id": 1,
  "user": {...},
  "total_modules": 30,
  "completed_modules": 22,
  "completion_percentage": 73.3,
  "total_hours_learned": 156,
  "certificates_earned": 12,
  "average_quiz_score": "87.50"
}
```

## 🔒 Security Considerations

### Field Protection
- Sensitive fields marked as read-only
- Password fields marked as write-only
- User relationships protected from modification

### Validation
- Input validation for all user data
- Business logic validation for complex operations
- Data integrity checks

### Performance
- Selective field inclusion for different use cases
- Efficient nested serializer usage
- Proper database query optimization

## 🚀 Best Practices

### Serializer Design
1. **Single Responsibility**: Each serializer handles one model type
2. **Consistent Naming**: Clear, descriptive serializer names
3. **Field Selection**: Include only necessary fields for each use case
4. **Validation**: Comprehensive validation for data integrity

### Usage Patterns
1. **Create Operations**: Use appropriate serializer for creation
2. **Update Operations**: Use update serializers with partial=True
3. **Display Operations**: Use detail serializers for complete information
4. **List Operations**: Use basic serializers for list views

### Maintenance
1. **Version Control**: Track serializer changes carefully
2. **Backward Compatibility**: Maintain API compatibility
3. **Documentation**: Keep serializer documentation updated
4. **Testing**: Comprehensive tests for all serializers
