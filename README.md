# Investa — Multilingual Investor Education Platform

A modern, inclusive learning platform that helps retail investors in India build financial literacy through structured courses, interactive quizzes, progress tracking, and simulated trading. Built with React Native (Expo) and Django REST Framework.

<p align="left">
  <a href="https://reactnative.dev" target="_blank"><img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.79+-61dafb?logo=react&logoColor=white"></a>
  <a href="https://expo.dev" target="_blank"><img alt="Expo" src="https://img.shields.io/badge/Expo-53-000000?logo=expo&logoColor=white"></a>
  <a href="https://www.djangoproject.com/" target="_blank"><img alt="Django" src="https://img.shields.io/badge/Django-5.2-092e20?logo=django&logoColor=white"></a>
  <a href="https://www.django-rest-framework.org/" target="_blank"><img alt="DRF" src="https://img.shields.io/badge/DRF-3.16-red"></a>
  <img alt="Platform" src="https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web-673ab7">
  <img alt="Status" src="https://img.shields.io/badge/Status-Hackathon%20MVP-blue">
</p>

---

## Table of Contents
- [Overview](#overview)
- [Why Investa](#why-investa)
- [Feature Highlights](#feature-highlights)
- [Architecture](#architecture)
- [Monorepo Structure](#monorepo-structure)
- [TL;DR Quickstart](#tldr-quickstart)
- [Setup Guide](#setup-guide)
- [Environment Variables](#environment-variables)
- [API at a Glance](#api-at-a-glance)
- [Developer Scripts](#developer-scripts)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview
Investa addresses core challenges faced by retail investors in India:
- **Multilingual education** across Indian languages
- **Trustworthy, structured learning** (SEBI/NISM aligned)
- **Safe practice** via simulated trading using delayed market data
- **Personalized learning** journeys based on a user’s risk profile

The app combines education, engagement, and practice with a clean UX that works on Android, iOS, and Web.

## Why Investa
- **Clarity over complexity**: Financial concepts explained simply
- **Inclusive by design**: Content localised in Indian languages
- **Practice without risk**: Paper-trading to build confidence

## Feature Highlights
- **Learning**: Courses → Lessons → Quizzes, with progress and achievements
- **Personalization**: Profiles with risk levels and language preferences
- **Practice**: Simulated trades, holdings summary, basic analytics
- **Admin**: Django Admin for full content management
- **Auth**: Token-based authentication and secure endpoints

## Architecture
```mermaid
flowchart LR
  A[React Native (Expo)] -- REST --> B[Django REST API]
  B --> C[(Database)]
  B -. Media .-> D[(Media Storage)]
  A <- CORS -> B
```

## Monorepo Structure
```
Investa/
├── InvestaApp/               # React Native (Expo) app
│   ├── src/
│   │   ├── navigation/       # AppNavigator, stacks, tabs
│   │   └── screens/          # Auth/Main/Course screens
│   ├── App.tsx               # App entry
│   └── package.json
├── investa_backend/          # Django project
│   ├── api/                  # DRF app (models, serializers, views, urls)
│   ├── investa_backend/      # Project settings & urls
│   ├── manage.py
│   └── requirements.txt
└── README.md                 # This file
```

## TL;DR Quickstart
Backend (Django):
```bash
cd investa_backend
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate && python manage.py runserver
```
Frontend (Expo):
```bash
cd InvestaApp
npm install
npm start   # then run on Android/iOS/Web
```

## Setup Guide

<details>
<summary><b>Backend (Django)</b></summary>

1. Create and activate a virtual environment
   - Windows (PowerShell)
     ```powershell
     cd investa_backend
     python -m venv venv
     venv\Scripts\activate
     ```
   - macOS/Linux
     ```bash
     cd investa_backend
     python3 -m venv venv
     source venv/bin/activate
     ```
2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
3. Apply migrations (and optionally create a superuser)
   ```bash
   python manage.py makemigrations && python manage.py migrate
   python manage.py createsuperuser
   ```
4. Start API server
   ```bash
   python manage.py runserver
   ```
- API base: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`
</details>

<details>
<summary><b>Frontend (React Native / Expo)</b></summary>

1. Install dependencies
   ```bash
   cd InvestaApp
   npm install
   ```
2. Start the Expo dev server
   ```bash
   npm start
   ```
3. Open on a device/emulator
   - Android: `npm run android`
   - iOS (macOS): `npm run ios`
   - Web: `npm run web`

Tip: Ensure your phone and computer are on the same network when using Expo Go.
</details>

## Environment Variables
Backend `investa_backend/.env` (suggested):
```
SECRET_KEY=replace-with-a-strong-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# Optional DB (defaults to SQLite)
# DATABASE_URL=postgresql://user:password@host:port/dbname

# CORS for Expo/Web dev (adjust as needed)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:19006,http://127.0.0.1:19006
```

> For production: set `DEBUG=False`, configure `ALLOWED_HOSTS`, move to PostgreSQL, and harden CORS/CSRF.

## API at a Glance

| Area | Method | Path | Description |
|---|---|---|---|
| Auth | POST | `/api/auth/register/` | Register user |
| Auth | POST | `/api/auth/login/` | Get token + profile |
| Auth | POST | `/api/auth/token/` | Obtain DRF token |
| Languages | GET | `/api/languages/` | Supported languages |
| Profiles | GET | `/api/profiles/my_profile/` | Current user profile |
| Profiles | PUT/PATCH | `/api/profiles/update_profile/` | Update profile |
| Courses | GET | `/api/courses/` | List courses |
| Courses | GET | `/api/courses/{id}/` | Course detail |
| Courses | GET | `/api/courses/by_language/?language=hi` | Filter by language |
| Courses | POST | `/api/courses/{id}/enroll/` | Enroll in course |
| Lessons | GET | `/api/lessons/` | List lessons |
| Lessons | POST | `/api/lessons/{id}/mark_completed/` | Mark completed |
| Quizzes | POST | `/api/quizzes/{id}/submit_attempt/` | Submit answers |
| Progress | GET | `/api/progress/overall_progress/` | Your progress summary |
| Trades | GET | `/api/trades/portfolio_summary/` | Holdings summary |
| Notifications | POST | `/api/notifications/{id}/mark_read/` | Mark read |

> Full serializer/view logic lives in `investa_backend/api/`.

## Developer Scripts
| Task | Command |
|---|---|
| Start Django (dev) | `cd investa_backend && venv\Scripts\activate` (Win) → `python manage.py runserver` |
| Run migrations | `python manage.py makemigrations && python manage.py migrate` |
| Create superuser | `python manage.py createsuperuser` |
| Start Expo | `cd InvestaApp && npm start` |
| Android | `cd InvestaApp && npm run android` |
| iOS (macOS) | `cd InvestaApp && npm run ios` |
| Web | `cd InvestaApp && npm run web` |

## Roadmap
- [x] Core data models (courses, lessons, quizzes, progress, trades)
- [x] Token auth + profile APIs
- [x] Admin for content management
- [x] Expo app scaffold with navigation and screens
- [ ] Connect app to live API + auth flow
- [ ] Multilingual content population
- [ ] AI-powered circular summarization (SEBI/NISM)
- [ ] Analytics dashboard and achievements
- [ ] Production deployment guides (API & App)

## Contributing
We welcome contributions! Please:
- Keep PRs focused and well-described
- Match existing code style and formatting
- Add tests where it makes sense (`python manage.py test`)

## Security
- Never commit secrets; use environment variables or a secrets manager
- In production: set `DEBUG=False`, configure `ALLOWED_HOSTS`, and harden CORS/CSRF

## License
This project is part of the Investa hackathon project. All rights reserved.

## Acknowledgments
- SEBI and NISM for investor education standards
- React Native, Expo, Django, and DRF communities
- Hackathon mentors, contributors, and testers
