<div align="center">

# Investa — Multilingual Investor Education + Paper Trading Platform

A modern, inclusive learning platform helping retail investors in India build financial literacy through structured courses, quizzes, progress tracking, notifications, and simulated trading.

<p>
  <a href="https://reactnative.dev" target="_blank"><img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.79+-61dafb?logo=react&logoColor=white"></a>
  <a href="https://expo.dev" target="_blank"><img alt="Expo" src="https://img.shields.io/badge/Expo-53-000000?logo=expo&logoColor=white"></a>
  <a href="https://www.djangoproject.com/" target="_blank"><img alt="Django" src="https://img.shields.io/badge/Django-5.2-092e20?logo=django&logoColor=white"></a>
  <a href="https://www.django-rest-framework.org/" target="_blank"><img alt="DRF" src="https://img.shields.io/badge/DRF-3.16-red"></a>
  <img alt="Platform" src="https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web-673ab7">
  <img alt="Status" src="https://img.shields.io/badge/Status-Active%20MVP-blue">
</p>

<p>
  <a href="#quickstart"><img alt="Quickstart" src="https://img.shields.io/badge/Jump%20to-Quickstart-22c55e?style=for-the-badge"></a>
  <a href="#architecture"><img alt="Architecture" src="https://img.shields.io/badge/View-Architecture-3b82f6?style=for-the-badge"></a>
  <a href="#api-examples"><img alt="API" src="https://img.shields.io/badge/Browse-API%20Examples-f59e0b?style=for-the-badge"></a>
</p>

</div>

---

## Table of Contents
- [Overview](#overview)
- [Feature Highlights](#feature-highlights)
- [Architecture](#architecture)
- [Monorepo Structure](#monorepo-structure)
- [Quickstart](#quickstart)
- [Setup Guide](#setup-guide)
- [Environment Variables](#environment-variables)
- [Data and Migrations](#data-and-migrations)
- [Feature Matrix](#feature-matrix)
- [API Examples](#api-examples)
- [Developer Scripts](#developer-scripts)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Notes on Current App Behavior](#notes-on-current-app-behavior)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview
Investa addresses core challenges faced by retail investors in India:
- Multilingual investor education with structured curricula
- Trustworthy lessons aligned to SEBI/NISM-style fundamentals
- Safe practice via simulated trades and portfolio tracking
- Personalized, engaging learning flows with quizzes and progress

## Feature Highlights
- **Learning**: Courses → Lessons → Quizzes with progress, achievements
- **Personalization**: Profiles, language preferences, privacy/security settings
- **Practice**: Simulated trading, portfolio, watchlist, leaderboards
- **Notifications**: Read/unread, server-driven updates
- **Admin**: Django Admin for full content management
- **Auth**: Token-based authentication and secure endpoints

## Architecture
```mermaid
flowchart LR
  A["React Native (Expo)"] -- "REST" --> B["Django REST API"]
  B --> C[("Database")]
  B -. "Media" .-> D[("Media Storage")]
  A <-. "CORS" .-> B
```

## Monorepo Structure
```
Investa/
├── InvestaApp/                    # React Native (Expo) app
│   ├── src/
│   │   ├── navigation/            # AppNavigator, stacks, tabs
│   │   ├── screens/               # Auth/Main/Course/Trading screens
│   │   ├── services/              # API clients
│   │   └── context/ hooks/        # Auth and data hooks
│   ├── App.tsx, app.json          # App entry & metadata
│   └── package.json               # Frontend dependencies
├── investa_backend/               # Django project
│   ├── api/                       # DRF app (models, serializers, views, urls)
│   │   ├── models/                # learning, trading, notifications, privacy, security, user
│   │   ├── serializers/           # per domain
│   │   ├── views/ urls/           # endpoints
│   │   └── migrations/            # DO commit these
│   ├── investa_backend/           # Project settings & root urls
│   ├── manage.py                  # Django management
│   ├── populate_sample_data.py    # Sample data seeding
│   ├── create_test_user.py        # Convenience script
│   ├── reset_test_user.py         # Convenience script
│   └── requirements.txt           # Backend dependencies
└── README.md
```

## Quickstart
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
npx expo install       # ensures compatible native deps
npx expo doctor        # verify environment
npm start              # then run on Android/iOS/Web
```

## Setup Guide

<details>
<summary><b>Backend (Django)</b></summary>

1) Create & activate venv; install deps
```bash
cd investa_backend
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
2) Configure `.env` (see Environment Variables) and run DB
```bash
python manage.py makemigrations && python manage.py migrate
python manage.py runserver  # http://localhost:8000/
```
3) Optional: create superuser
```bash
python manage.py createsuperuser
```
Admin: `http://localhost:8000/admin/`

</details>

<details>
<summary><b>Frontend (React Native / Expo)</b></summary>

1) Install deps
```bash
cd InvestaApp
npm install
npx expo install
```
2) Start the dev server
```bash
npm start
```
3) Open on device/emulator
- Android: `npm run android`
- iOS (macOS): `npm run ios`
- Web: `npm run web`

Tip: Ensure phone and computer are on the same network when using Expo Go.

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
For production: set `DEBUG=False`, configure `ALLOWED_HOSTS`, move to PostgreSQL, and harden CORS/CSRF.

## Data and Migrations
- Migrations in `api/migrations/` are critical and must be committed.
- Local DB files like `db.sqlite3` should be gitignored (already configured).
- Seed sample content:
```bash
cd investa_backend
python manage.py shell < populate_sample_data.py
```
- Convenience users:
```bash
python create_test_user.py
python reset_test_user.py
```

## Feature Matrix

| Area | Capability | Status |
|---|---|---|
| Auth | Register / Login / Token | ✅ Implemented |
| Profiles | View / Update profile | ✅ Implemented |
| Learning | Courses → Lessons → Quizzes | ✅ Implemented |
| Progress | Lesson completion, module progress | ✅ Implemented |
| Notifications | Mark read, list | ✅ Implemented |
| Trading | Portfolio, watchlist, leaderboards | ✅ Implemented (simulated) |
| Privacy/Security | Settings & 2FA scaffolding | ✅ Basic UI, API stubs |
| Localization | Language selection | ✅ Basic flow |

> Server-side implementations live in `investa_backend/api/`; mobile flows in `InvestaApp/src/screens`.

## API Examples

### Auth
Request
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}'
```
Response
```json
{
  "token": "<drf-token>",
  "profile": {
    "id": 1,
    "username": "testuser",
    "language": "en"
  }
}
```

### Courses
Request
```bash
curl http://localhost:8000/api/courses/
```
Response
```json
[
  {
    "id": 1,
    "title": "Investing Basics",
    "language": { "code": "en", "name": "English" },
    "estimated_duration": 120
  }
]
```

### Lessons → Mark Completed
Request
```bash
curl -X POST http://localhost:8000/api/lessons/1/mark_completed/ \
  -H "Authorization: Token <drf-token>"
```
Response
```json
{ "status": "ok", "lesson": 1, "completed": true }
```

### Trading — Portfolio Summary
Request
```bash
curl http://localhost:8000/api/trades/portfolio_summary/ \
  -H "Authorization: Token <drf-token>"
```
Response
```json
{ "value": 125840, "pnl_percent": 0.248, "holdings": [] }
```

> Explore more endpoints in `investa_backend/api/urls/` and serializer/view code under `investa_backend/api/`.

## Developer Scripts
| Task | Command |
|---|---|
| Start Django (dev) | `cd investa_backend && venv\Scripts\activate` (Win) → `python manage.py runserver` |
| Run migrations | `python manage.py makemigrations && python manage.py migrate` |
| Create superuser | `python manage.py createsuperuser` |
| Seed sample data | `python manage.py shell < populate_sample_data.py` |
| Start Expo | `cd InvestaApp && npm start` |
| Android | `cd InvestaApp && npm run android` |
| iOS (macOS) | `cd InvestaApp && npm run ios` |
| Web | `cd InvestaApp && npm run web` |

## Testing
- Backend tests can be added under `investa_backend/api/tests.py` or app-specific test modules.
- Example smoke tests included: `investa_backend/test_api.py`, `investa_backend/test_auth_flow.py`.
- Run tests:
```bash
cd investa_backend
pytest  # or: python manage.py test
```

## Troubleshooting
- Metro cache deserialization error:
  ```powershell
  # From InvestaApp
  Ctrl+C to stop Expo
  rd /s /q node_modules
  del /f /q package-lock.json
  npm cache verify
  del /s /q %TEMP%\metro-cache\*
  rd /s /q .expo
  rd /s /q .cache
  npm install
  npx expo start -c
  ```
- Expo version alignment:
  ```powershell
  npx expo install
  npx expo install expo@53.0.22 @react-native-async-storage/async-storage@2.1.2 react-native-reanimated@~3.17.4 react-native-svg@15.11.2
  npx expo doctor
  ```
- Reanimated config:
  - Ensure `babel.config.js` includes `plugins: ['react-native-reanimated']`
  - Import once at the top of the app entry: `import 'react-native-reanimated';`

## Notes on Current App Behavior
- Lesson Detail: quiz section is shown directly (no “mark video complete” requirement). Mark-as-completed navigates back to the lesson list with completion info.
- Downloads/Leaderboard screens: responsive updates prevent text overflow and maintain layout on smaller devices.

## Roadmap
- [x] Core data models (courses, lessons, quizzes, progress, trades)
- [x] Token auth + profile APIs
- [x] Admin for content management
- [x] Expo app scaffold with navigation and screens
- [ ] Connect app to live API + auth flow
- [ ] Multilingual content population
- [ ] AI-powered summaries and recommendations
- [ ] Analytics dashboard and achievements
- [ ] Production deployment guides (API & App)

## Contributing
We welcome contributions! Please:
- Keep PRs focused and well-described
- Match existing code style and formatting
- Add tests where it makes sense (`python manage.py test` or `pytest`)

## Security
- Never commit secrets; use environment variables or a secrets manager
- In production: set `DEBUG=False`, configure `ALLOWED_HOSTS`, and harden CORS/CSRF

## License
This project is part of the Investa hackathon project. All rights reserved.

## Acknowledgments
- SEBI and NISM for investor education standards
- React Native, Expo, Django, and DRF communities
- Hackathon mentors, contributors, and testers
