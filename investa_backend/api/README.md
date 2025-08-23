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
│   │   ├── dashboard.html      # API testing console
│   │   └── database.html       # Database explorer
│   ├── models.py               # Database models
│   ├── views.py                # API views and console views
│   ├── serializers.py          # DRF serializers
│   ├── admin.py                # Django admin configuration
│   └── README.md               # This file
├── investa_backend/
│   ├── settings.py             # Django settings
│   └── urls.py                 # Main URL configuration
└── manage.py                   # Django management
```

## 🎛️ Development Console

### Features
- **Interactive Dashboard**: Test API calls, register users, and manage the backend
- **Database Explorer**: Browse all database tables with real-time data visualization
- **API Documentation**: Visual endpoint documentation with examples
- **System Monitoring**: View statistics and system status
- **Quick Actions**: Fast access to common development tasks

### Console Pages

#### 1. Landing Page (`/`)
- Welcome screen with quick navigation
- System overview and feature highlights
- Quick access to dashboard, database, and admin

#### 2. Dashboard (`/dashboard/`)
- **API Testing**: Register and login forms with real-time responses
- **Statistics**: Live system statistics (courses, users, lessons, endpoints)
- **Quick Actions**: Direct links to common endpoints
- **Feature Cards**: System capabilities overview
- **Recent Activity**: Mock activity feed for development
- **API Documentation**: Visual endpoint cards with HTTP methods

#### 3. Database Explorer (`/database/`)
- **Table Navigation**: Tabbed interface for all database models
- **Data Visualization**: Color-coded data types and smart truncation
- **Search & Filter**: Find tables and models quickly
- **Export Features**: Copy data, download CSV, view schema
- **Responsive Design**: Works on all screen sizes
- **Interactive Elements**: Hover effects and smooth animations

## 🔐 Authentication

Token-based authentication. Include header `Authorization: Token <your_token>` for protected endpoints.

### Auth Endpoints

#### Register User
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "user@example.com",
  "email": "user@example.com",
  "password": "securepassword",
  "confirm_password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/auth/me/
Authorization: Token <your_token>
```

#### Logout
```http
POST /api/auth/logout/
Authorization: Token <your_token>
```

## 📚 API Endpoints

### Languages
- `GET /api/languages/` - List all languages
- `GET /api/languages/{id}/` - Get specific language

### User Profiles (Auth Required)
- `GET /api/profiles/my_profile/` - Get current user's profile
- `PUT/PATCH /api/profiles/update_profile/` - Update profile
- Standard CRUD via `profiles/` (scoped to authenticated user)

### Courses (Auth Required)
- `GET /api/courses/` - List all courses
- `GET /api/courses/{id}/` - Get specific course
- `GET /api/courses/by_language/?language=en|hi|...` - Filter by language
- `GET /api/courses/by_difficulty/?difficulty=beginner|intermediate|advanced` - Filter by difficulty
- `POST /api/courses/{id}/enroll/` - Enroll in course

### Lessons (Auth Required)
- `GET /api/lessons/` - List all lessons
- `GET /api/lessons/{id}/` - Get specific lesson
- `POST /api/lessons/{id}/mark_completed/` - Mark lesson as completed

### Quizzes (Auth Required)
- `GET /api/quizzes/` - List all quizzes
- `GET /api/quizzes/{id}/` - Get specific quiz
- `POST /api/quizzes/{id}/submit_attempt/` - Submit quiz attempt

**Quiz Submission Format:**
```json
{
  "time_taken": 300,
  "answers": [
    {"question_id": 1, "answer_id": 3},
    {"question_id": 2, "answer_id": 1}
  ]
}
```

### Progress Tracking (Auth Required)
- `GET /api/progress/` - Get user progress
- `GET /api/progress/course_progress/?course_id=<id>` - Course-specific progress
- `GET /api/progress/overall_progress/` - Overall learning progress

### Simulated Trading (Auth Required)
- `GET /api/trades/` - List user's trades
- `POST /api/trades/` - Create new trade
- `GET /api/trades/portfolio_summary/` - Portfolio summary

**Trade Creation Format:**
```json
{
  "symbol": "AAPL",
  "trade_type": "buy",
  "quantity": 10,
  "price": 150.00,
  "total_amount": 1500.00,
  "notes": "Long-term investment"
}
```

### Notifications (Auth Required)
- `GET /api/notifications/` - List notifications
- `GET /api/notifications/unread_count/` - Count unread notifications
- `GET /api/notifications/by_type/?type=course_update|quiz_reminder|achievement|general` - Filter by type
- `POST /api/notifications/{id}/mark_read/` - Mark notification as read
- `POST /api/notifications/mark_all_read/` - Mark all notifications as read

## 🛠️ Development Tools

### Database Management
- **Interactive Explorer**: Browse all tables with real-time data
- **Data Export**: Copy to clipboard or download as CSV
- **Schema Viewing**: View table structure and field types
- **Search & Filter**: Find specific data quickly

### API Testing
- **Live Testing**: Test endpoints directly from dashboard
- **Response Preview**: Real-time JSON response display
- **Error Handling**: Color-coded success/error responses
- **Token Management**: Automatic token handling for auth

### System Monitoring
- **Statistics Dashboard**: Live system metrics
- **Activity Feed**: Recent system activities
- **Status Indicators**: System health monitoring
- **Configuration**: Environment and API settings

## 🚀 Getting Started

### 1. Setup Environment
```bash
cd investa_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Database Setup
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 3. Populate Sample Data
```bash
python populate_sample_data.py
python create_test_user.py
```

### 4. Run Development Server
```bash
python manage.py runserver
```

### 5. Access Console
- Open `http://localhost:8000/` in your browser
- Use the dashboard to test API endpoints
- Explore the database with the database explorer

## 📋 API Response Format

All API responses follow this format:
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional message"
}
```

### Pagination
- Uses DRF PageNumberPagination
- Default page size: 20
- Query parameter: `?page=<number>`

### Error Handling
```json
{
  "status": "error",
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔧 Configuration

### Environment Variables
- `DEBUG`: Set to `True` for development
- `SECRET_KEY`: Django secret key
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

### Media Files
- Served under `/media/` when `DEBUG=True`
- Configure `MEDIA_ROOT` and `MEDIA_URL` in settings

## 📝 Notes

- **Pagination**: DRF PageNumberPagination (`page`, default `page_size` = 20)
- **Media**: Thumbnails served under `/media/` when `DEBUG=True`
- **CORS**: Configured for cross-origin requests in development
- **Authentication**: Token-based auth with automatic token creation
- **Responsive**: Console works on desktop, tablet, and mobile devices

## 🎯 Keyboard Shortcuts

### Dashboard
- `Ctrl+F`: Focus search box
- `Ctrl+R`: Refresh data

### Database Explorer
- `Ctrl+F`: Focus search box
- `Ctrl+R`: Refresh data
- Click API cards to open endpoints in new tab

## 🔄 Updates

This console and API are actively maintained. Check for updates regularly and refer to the commit history for detailed change logs.
