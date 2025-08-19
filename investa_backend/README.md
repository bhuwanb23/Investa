# Investa Backend - Django API

A comprehensive Django REST API backend for the Investa investor education platform. This backend provides APIs for user management, course management, learning progress tracking, quizzes, simulated trading, and more.

## Features

- **User Management**: Registration, authentication, and profile management
- **Multilingual Support**: Course content in multiple Indian languages
- **Course Management**: Structured learning modules with lessons and quizzes
- **Progress Tracking**: Monitor user learning progress and achievements
- **Quiz System**: Interactive quizzes with scoring and analytics
- **Simulated Trading**: Practice trading with virtual money
- **Notifications**: Real-time updates and reminders
- **Admin Interface**: Comprehensive Django admin for content management

## Technology Stack

- **Framework**: Django 5.2.5
- **API**: Django REST Framework
- **Authentication**: Token-based authentication
- **Database**: SQLite (development), PostgreSQL (production)
- **Media**: File uploads for course thumbnails and content
- **CORS**: Cross-origin resource sharing support

## Project Structure

```
investa_backend/
├── api/                    # Main API application
│   ├── models.py          # Database models
│   ├── serializers.py     # API serializers
│   ├── views.py           # API views and ViewSets
│   ├── urls.py            # API URL routing
│   └── admin.py           # Django admin configuration
├── investa_backend/        # Django project settings
│   ├── settings.py        # Project configuration
│   ├── urls.py            # Main URL routing
│   └── wsgi.py            # WSGI application
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd investa_backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/` - Get authentication token
- `GET /api/auth/me/` - Get current authenticated user and profile
- `POST /api/auth/logout/` - Logout and invalidate token

### Languages
- `GET /api/languages/` - List all supported languages
- `GET /api/languages/{id}/` - Get specific language details

### User Profiles
- `GET /api/profiles/my_profile/` - Get current user's profile
- `PUT /api/profiles/update_profile/` - Update user profile
- `GET /api/profiles/` - List user profiles (admin only)

### Courses
- `GET /api/courses/` - List all courses
- `GET /api/courses/{id}/` - Get course details with lessons
- `GET /api/courses/by_language/?language={code}` - Filter courses by language
- `GET /api/courses/by_difficulty/?difficulty={level}` - Filter courses by difficulty
- `POST /api/courses/{id}/enroll/` - Enroll in a course

### Lessons
- `GET /api/lessons/` - List all lessons
- `GET /api/lessons/{id}/` - Get lesson details with quizzes
- `POST /api/lessons/{id}/mark_completed/` - Mark lesson as completed

### Quizzes
- `GET /api/quizzes/` - List all quizzes
- `GET /api/quizzes/{id}/` - Get quiz details with questions
- `POST /api/quizzes/{id}/submit_attempt/` - Submit quiz answers

### User Progress
- `GET /api/progress/` - List user progress
- `GET /api/progress/course_progress/?course_id={id}` - Get progress for specific course
- `GET /api/progress/overall_progress/` - Get overall learning progress

### Simulated Trading
- `GET /api/trades/` - List user's simulated trades
- `POST /api/trades/` - Create new simulated trade
- `GET /api/trades/portfolio_summary/` - Get portfolio summary

### Notifications
- `GET /api/notifications/` - List user notifications
- `POST /api/notifications/{id}/mark_read/` - Mark notification as read
- `POST /api/notifications/mark_all_read/` - Mark all notifications as read
- `GET /api/notifications/unread_count/` - Get unread notifications count
- `GET /api/notifications/by_type/?type={notification_type}` - Filter notifications by type

### Developer Tools (Development only)
- `GET /api/dashboard/` - Simple dashboard to explore available models
- `GET /api/database/` - Visualize tables and sample rows from the database

## Database Models

### Core Models
- **Language**: Supported languages for the platform
- **UserProfile**: Extended user information and preferences
- **Course**: Educational courses with metadata
- **Lesson**: Individual lessons within courses
- **Quiz**: Assessment quizzes for lessons
- **Question**: Quiz questions with multiple choice answers
- **Answer**: Possible answers for quiz questions

### Tracking Models
- **UserProgress**: Track lesson completion and time spent
- **QuizAttempt**: Record quiz attempts and scores
- **SimulatedTrade**: Virtual trading transactions
- **Notification**: User notifications and updates

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to:
- Manage users and profiles
- Create and edit courses, lessons, and quizzes
- Monitor user progress and quiz attempts
- Manage simulated trades and notifications
- Configure languages and system settings

## Development

### Adding New Features
1. Create models in `api/models.py`
2. Add serializers in `api/serializers.py`
3. Create views in `api/views.py`
4. Update URL routing in `api/urls.py`
5. Register models in `api/admin.py`

### Running Tests
```bash
python manage.py test
```

### Seeding Sample Data
- Populate languages, courses, lessons, quizzes, progress, trades, and notifications:
```bash
python populate_sample_data.py
```

- Create a ready-to-use test user (`test@example.com` / `testpass123`):
```bash
python create_test_user.py
```

After seeding, you can log in via:
```http
POST /api/auth/login/
{
  "username": "test@example.com",
  "password": "testpass123"
}
```

### Code Style
- Follow PEP 8 guidelines
- Use meaningful variable and function names
- Add docstrings for classes and methods
- Include type hints where appropriate

## Deployment

### Production Settings
- Set `DEBUG = False`
- Configure production database (PostgreSQL recommended)
- Set up static and media file serving
- Configure CORS settings for production domains
- Use environment variables for sensitive settings

### Environment Variables
Create a `.env` file with:
```
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:password@host:port/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Investa hackathon project.

## Support

For questions or issues, please contact the development team or create an issue in the repository.
