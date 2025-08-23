# Views Directory

This directory contains all Django REST Framework views and ViewSets organized by functionality. Each file contains related views that handle specific API endpoints and business logic.

## 📁 Directory Structure

```
views/
├── __init__.py           # Main import file - exports all views
├── auth.py              # Authentication views (login, register, logout)
├── user.py              # User profile and language views
├── security.py          # Security settings and session views
├── privacy.py           # Privacy settings views
├── learning.py          # Learning progress and achievement views
├── trading.py           # Trading performance views
├── notifications.py     # Notification views
├── console.py           # Development console views
└── README.md           # This file
```

## 🎯 View Files

### `auth.py` - Authentication Views
**Purpose**: Handle user authentication, registration, and session management

**Views**:
- **`CustomAuthToken`**: Enhanced login with profile data
  - **Method**: POST
  - **URL**: `/api/auth/login/`
  - **Features**: 
    - Token-based authentication
    - Automatic profile creation
    - Returns complete user data
  - **Response**: Token + user profile + settings

- **`UserRegistrationView`**: User registration with profile setup
  - **Method**: POST
  - **URL**: `/api/auth/register/`
  - **Features**:
    - User creation with validation
    - Automatic related model creation
    - Token generation
  - **Response**: Token + user data + success message

- **`MeView`**: Get current user's complete data
  - **Method**: GET
  - **URL**: `/api/auth/me/`
  - **Features**:
    - Requires authentication
    - Returns all user-related data
    - Automatic model creation if missing
  - **Response**: Complete user profile + settings + progress

- **`LogoutView`**: Invalidate user tokens
  - **Method**: POST
  - **URL**: `/api/auth/logout/`
  - **Features**:
    - Token invalidation
    - Session cleanup
  - **Response**: Success message

### `user.py` - User Profile Views
**Purpose**: Handle user profile and language management

**ViewSets**:
- **`LanguageViewSet`**: Language management
  - **Type**: ReadOnlyModelViewSet
  - **URL**: `/api/languages/`
  - **Features**:
    - List all supported languages
    - Retrieve specific language
    - Public access (no authentication required)
  - **Actions**: `list`, `retrieve`

- **`UserProfileViewSet`**: User profile management
  - **Type**: ModelViewSet
  - **URL**: `/api/profiles/`
  - **Features**:
    - User-specific profile access
    - Profile creation and updates
    - Multiple serializer types for different operations
  - **Actions**: `list`, `create`, `retrieve`, `update`, `partial_update`, `destroy`
  - **Custom Actions**:
    - `my_profile`: Get current user's profile
    - `update_profile`: Update current user's profile
    - `complete_profile`: Complete profile setup

### `security.py` - Security Views
**Purpose**: Handle security settings and session management

**ViewSets**:
- **`SecuritySettingsViewSet`**: Security settings management
  - **Type**: ModelViewSet
  - **URL**: `/api/security-settings/`
  - **Features**:
    - User-specific security settings
    - Settings creation and updates
    - Security-focused operations
  - **Actions**: `list`, `create`, `retrieve`, `update`, `partial_update`, `destroy`
  - **Custom Actions**:
    - `my_settings`: Get current user's security settings
    - `update_settings`: Update current user's security settings
    - `toggle_2fa`: Toggle two-factor authentication

- **`UserSessionViewSet`**: Session management
  - **Type**: ReadOnlyModelViewSet
  - **URL**: `/api/sessions/`
  - **Features**:
    - Active session listing
    - Session monitoring
    - Security-focused operations
  - **Actions**: `list`, `retrieve`
  - **Custom Actions**:
    - `logout_all_devices`: Logout from all devices except current

### `privacy.py` - Privacy Views
**Purpose**: Handle privacy settings management

**ViewSets**:
- **`PrivacySettingsViewSet`**: Privacy settings management
  - **Type**: ModelViewSet
  - **URL**: `/api/privacy-settings/`
  - **Features**:
    - User-specific privacy settings
    - Settings creation and updates
    - Privacy-focused operations
  - **Actions**: `list`, `create`, `retrieve`, `update`, `partial_update`, `destroy`
  - **Custom Actions**:
    - `my_settings`: Get current user's privacy settings
    - `update_settings`: Update current user's privacy settings

### `learning.py` - Learning Views
**Purpose**: Handle learning progress and achievement management

**ViewSets**:
- **`LearningProgressViewSet`**: Learning progress management
  - **Type**: ReadOnlyModelViewSet
  - **URL**: `/api/learning-progress/`
  - **Features**:
    - User-specific learning progress
    - Progress tracking and display
    - Achievement monitoring
  - **Actions**: `list`, `retrieve`
  - **Custom Actions**:
    - `my_progress`: Get current user's learning progress
    - `update_progress`: Update learning progress (internal use)

- **`BadgeViewSet`**: Badge management
  - **Type**: ReadOnlyModelViewSet
  - **URL**: `/api/badges/`
  - **Features**:
    - Badge listing and details
    - User achievement tracking
    - Badge criteria display
  - **Actions**: `list`, `retrieve`
  - **Custom Actions**:
    - `my_badges`: Get current user's earned badges
    - `available_badges`: Get all available badges

### `trading.py` - Trading Views
**Purpose**: Handle trading performance management

**ViewSets**:
- **`TradingPerformanceViewSet`**: Trading performance management
  - **Type**: ReadOnlyModelViewSet
  - **URL**: `/api/trading-performance/`
  - **Features**:
    - User-specific trading performance
    - Performance tracking and display
    - Trading statistics
  - **Actions**: `list`, `retrieve`
  - **Custom Actions**:
    - `my_performance`: Get current user's trading performance
    - `update_performance`: Update trading performance (internal use)

### `notifications.py` - Notification Views
**Purpose**: Handle notification management

**ViewSets**:
- **`NotificationViewSet`**: Notification management
  - **Type**: ReadOnlyModelViewSet
  - **URL**: `/api/notifications/`
  - **Features**:
    - User-specific notifications
    - Notification reading and management
    - Notification statistics
  - **Actions**: `list`, `retrieve`
  - **Custom Actions**:
    - `my_notifications`: Get current user's notifications
    - `mark_all_read`: Mark all notifications as read
    - `mark_read`: Mark specific notification as read
    - `unread_count`: Get unread notification count

### `console.py` - Development Console Views
**Purpose**: Handle development console and database exploration

**Views**:
- **`index`**: Landing page
  - **Method**: GET
  - **URL**: `/`
  - **Features**: Console landing page with navigation

- **`dashboard`**: Development dashboard
  - **Method**: GET
  - **URL**: `/dashboard/`
  - **Features**: Interactive API testing interface

- **`database_view`**: Database explorer
  - **Method**: GET
  - **URL**: `/database/`
  - **Features**: Database table exploration and visualization

- **`_build_model_entries`**: Helper function
  - **Purpose**: Build model metadata for database explorer
  - **Features**: Model introspection and data collection

## 🔗 View Relationships

### Authentication Flow
1. **Registration**: `UserRegistrationView` → Creates user + all related models
2. **Login**: `CustomAuthToken` → Returns token + complete user data
3. **Profile Access**: `MeView` → Returns all user-related information
4. **Logout**: `LogoutView` → Invalidates tokens

### Data Access Patterns
- **User-Specific Data**: All ViewSets filter by current user
- **Read-Only Operations**: Learning, trading, and notification views
- **Update Operations**: Profile, security, and privacy views
- **Custom Actions**: Specialized operations for each domain

## 🛠️ Usage Examples

### User Registration
```python
# POST /api/auth/register/
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "confirm_password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}

# Response
{
  "token": "your_auth_token",
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "detail": "User registered successfully"
}
```

### User Login
```python
# POST /api/auth/login/
{
  "username": "john_doe",
  "password": "securepassword"
}

# Response
{
  "token": "your_auth_token",
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "profile": {...},
  "security_settings": {...},
  "privacy_settings": {...},
  "learning_progress": {...},
  "trading_performance": {...}
}
```

### Get User Profile
```python
# GET /api/profiles/my_profile/
# Headers: Authorization: Token your_auth_token

# Response
{
  "id": 1,
  "user": {...},
  "preferred_language": {...},
  "risk_profile": "moderate",
  "investment_experience": "beginner",
  "level": 5,
  "experience_points": 1250
}
```

### Update Security Settings
```python
# PUT /api/security-settings/update_settings/
# Headers: Authorization: Token your_auth_token
{
  "two_factor_enabled": true,
  "session_timeout": 60
}

# Response
{
  "id": 1,
  "user": {...},
  "two_factor_enabled": true,
  "session_timeout": 60,
  "biometric_enabled": false
}
```

## 🔒 Security Features

### Authentication
- **Token Authentication**: All protected endpoints require valid tokens
- **User Isolation**: Users can only access their own data
- **Session Management**: Active session tracking and management

### Authorization
- **Permission Classes**: Appropriate permissions for each view
- **User Filtering**: Automatic filtering by current user
- **Read-Only Protection**: Sensitive operations are read-only

### Data Protection
- **Field Validation**: Comprehensive input validation
- **Business Logic**: Secure business logic implementation
- **Error Handling**: Proper error responses without data leakage

## 📊 API Endpoints Summary

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/me/` - Get current user data
- `POST /api/auth/logout/` - User logout

### Profile Endpoints
- `GET /api/profiles/` - List user profiles
- `GET /api/profiles/my_profile/` - Get current user's profile
- `PUT /api/profiles/update_profile/` - Update current user's profile
- `POST /api/profiles/complete_profile/` - Complete profile setup

### Security Endpoints
- `GET /api/security-settings/my_settings/` - Get security settings
- `PUT /api/security-settings/update_settings/` - Update security settings
- `POST /api/security-settings/toggle_2fa/` - Toggle 2FA
- `GET /api/sessions/` - List active sessions
- `POST /api/sessions/logout_all_devices/` - Logout all devices

### Privacy Endpoints
- `GET /api/privacy-settings/my_settings/` - Get privacy settings
- `PUT /api/privacy-settings/update_settings/` - Update privacy settings

### Learning Endpoints
- `GET /api/learning-progress/my_progress/` - Get learning progress
- `GET /api/badges/` - List all badges
- `GET /api/badges/my_badges/` - Get user's earned badges

### Trading Endpoints
- `GET /api/trading-performance/my_performance/` - Get trading performance

### Notification Endpoints
- `GET /api/notifications/my_notifications/` - Get user's notifications
- `POST /api/notifications/mark_all_read/` - Mark all as read
- `POST /api/notifications/{id}/mark_read/` - Mark specific as read
- `GET /api/notifications/unread_count/` - Get unread count

## 🚀 Best Practices

### View Design
1. **Single Responsibility**: Each view handles one specific domain
2. **Consistent Patterns**: Similar operations follow consistent patterns
3. **Proper Permissions**: Appropriate permission classes for each view
4. **Error Handling**: Comprehensive error handling and responses

### API Design
1. **RESTful Design**: Follow REST principles for API design
2. **Consistent Responses**: Standardized response formats
3. **Proper Status Codes**: Appropriate HTTP status codes
4. **Documentation**: Clear API documentation and examples

### Performance
1. **Query Optimization**: Efficient database queries
2. **Caching**: Appropriate caching strategies
3. **Pagination**: Pagination for large datasets
4. **Selective Fields**: Return only necessary data

### Security
1. **Authentication**: Proper authentication for all protected endpoints
2. **Authorization**: User-specific data access
3. **Input Validation**: Comprehensive input validation
4. **Error Handling**: Secure error responses
