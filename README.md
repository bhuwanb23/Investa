# Investa - Investor Education Platform

A comprehensive multilingual investor education platform designed to help retail investors in India navigate the securities market with confidence. Built with React Native for the mobile app and Django for the backend API.

## 🚀 Project Overview

Investa addresses the challenges faced by retail investors in India by providing:
- **Multilingual Learning**: Content in multiple Indian languages
- **Structured Education**: Comprehensive courses on stock market basics, risk profiling, and portfolio diversification
- **Interactive Learning**: Quizzes, gamified progress tracking, and scenario-based simulations
- **Safe Practice**: Simulated trading using delayed market data
- **AI-Powered Content**: Simplified explanations of complex SEBI, NISM, and exchange circulars
- **Personalized Learning**: Tailored learning paths based on risk profiles

## 🏗️ Architecture

```
Investa/
├── InvestaApp/           # React Native Mobile App
│   ├── src/
│   │   ├── navigation/   # Navigation setup
│   │   ├── screens/      # App screens
│   │   └── components/   # Reusable components
│   └── package.json
├── investa_backend/      # Django Backend API
│   ├── api/             # Main API application
│   ├── investa_backend/ # Django project settings
│   └── requirements.txt
└── README.md
```

## 🛠️ Technology Stack

### Frontend (React Native)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **UI Components**: React Native Paper
- **Icons**: Expo Vector Icons
- **Charts**: React Native Chart Kit
- **State Management**: React Hooks

### Backend (Django)
- **Framework**: Django 5.2.5
- **API**: Django REST Framework
- **Authentication**: Token-based authentication
- **Database**: SQLite (dev), PostgreSQL (prod)
- **CORS**: django-cors-headers
- **Media**: Pillow for image handling

## 📱 Features

### Core Features
- ✅ User authentication and profile management
- ✅ Multilingual course content
- ✅ Interactive lessons with video support
- ✅ Quiz system with scoring
- ✅ Progress tracking and analytics
- ✅ Simulated trading practice
- ✅ Personalized learning paths
- ✅ Notification system

### User Experience
- 🎨 Modern, intuitive UI design
- 📱 Responsive mobile-first design
- 🌐 Offline content support
- 🔔 Real-time notifications
- 📊 Visual progress indicators
- 🎯 Gamified learning elements

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio / Xcode (for mobile development)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd investa_backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
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

6. **Start the development server**
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. **Navigate to app directory**
   ```bash
   cd InvestaApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   
   # Web
   npm run web
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/` - Get authentication token

### Core Endpoints
- `GET /api/courses/` - List all courses
- `GET /api/lessons/` - List all lessons
- `GET /api/quizzes/` - List all quizzes
- `GET /api/progress/` - User learning progress
- `GET /api/trades/` - Simulated trading data

### Admin Interface
Access Django admin at `http://localhost:8000/admin/` to manage:
- Users and profiles
- Courses and lessons
- Quizzes and questions
- User progress tracking
- System configuration

## 🎯 Development Roadmap

### Phase 1: Core Platform ✅
- [x] User authentication system
- [x] Basic course structure
- [x] Quiz system
- [x] Progress tracking

### Phase 2: Enhanced Features 🚧
- [ ] AI-powered content summarization
- [ ] Real-time market data integration
- [ ] Advanced analytics dashboard
- [ ] Social learning features

### Phase 3: Advanced Capabilities 📋
- [ ] Machine learning recommendations
- [ ] Voice-based learning
- [ ] AR/VR learning experiences
- [ ] Blockchain certification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the Investa hackathon project. All rights reserved.

## 🆘 Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Check the documentation in each component

## 🙏 Acknowledgments

- SEBI for investor protection guidelines
- NISM for educational standards
- React Native and Django communities
- All contributors and mentors

---

**Built with ❤️ for the Indian investor community**
