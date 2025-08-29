<div align="center">

# 🚀 Investa — Multilingual Investor Education + Paper Trading Platform

> *Empowering retail investors in India with financial literacy through structured learning and simulated trading*

[![React Native](https://img.shields.io/badge/React%20Native-0.79+-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-53-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Django](https://img.shields.io/badge/Django-5.2-092e20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.16-red?style=for-the-badge)](https://www.django-rest-framework.org/)
[![Platform](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web-673ab7?style=for-the-badge)](https://reactnative.dev)
[![Status](https://img.shields.io/badge/Status-Active%20MVP-blue?style=for-the-badge)](https://github.com/your-username/investa)

---

### 🎯 **Quick Navigation**
[![Quickstart](https://img.shields.io/badge/Jump%20to-Quickstart-22c55e?style=for-the-badge&logo=rocket)](https://github.com/your-username/investa#-quickstart)
[![Architecture](https://img.shields.io/badge/View-Architecture-3b82f6?style=for-the-badge&logo=diagram-project)](https://github.com/your-username/investa#-architecture-overview)
[![API Examples](https://img.shields.io/badge/Browse-API%20Examples-f59e0b?style=for-the-badge&logo=code)](https://github.com/your-username/investa#-api-examples)

</div>

---

## 📋 **Table of Contents**
- [🎯 Overview](#-overview)
- [✨ Feature Highlights](#-feature-highlights)
- [🏗️ Architecture](#️-architecture-overview)
- [📁 Monorepo Structure](#-monorepo-structure)
- [🚀 Quickstart](#-quickstart)
- [⚙️ Setup Guide](#️-setup-guide)
- [🔧 Environment Variables](#-environment-variables)
- [🗄️ Data and Migrations](#️-data-and-migrations)
- [📊 Feature Matrix](#-feature-matrix)
- [🔌 API Examples](#-api-examples)
- [🛠️ Developer Scripts](#️-developer-scripts)
- [🧪 Testing](#-testing)
- [🔍 Troubleshooting](#-troubleshooting)
- [📝 Current App Behavior](#-current-app-behavior)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [🔒 Security](#-security)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🎯 **Overview**

**Investa** addresses core challenges faced by retail investors in India:

- 🌍 **Multilingual investor education** with structured curricula
- 🎓 **Trustworthy lessons** aligned to SEBI/NISM-style fundamentals  
- 🎮 **Safe practice** via simulated trades and portfolio tracking
- 📈 **Personalized, engaging learning flows** with quizzes and progress

---

## ✨ **Feature Highlights**

| Category | Features | Status |
|:--------:|:---------|:------:|
| 🎓 **Learning** | Courses → Lessons → Quizzes with progress, achievements | ✅ |
| 👤 **Personalization** | Profiles, language preferences, privacy/security settings | ✅ |
| 💼 **Practice** | Simulated trading, portfolio, watchlist, leaderboards | ✅ |
| 🔔 **Notifications** | Read/unread, server-driven updates | ✅ |
| 👨‍💼 **Admin** | Django Admin for full content management | ✅ |
| 🔐 **Auth** | Token-based authentication and secure endpoints | ✅ |

---

## 🏗️ **Architecture Overview**

```mermaid
flowchart LR
  %% Client Layer
  subgraph Client["📱 Client: Expo React Native (Android / iOS / Web)"]
    UI["🖥️ Screens & Components\n🧭 Navigation (AppNavigator)\n🔗 Context & Hooks"]
    Services["🔌 Services\n📡 api.ts, authApi, profileApi, tradingApi"]
  end

  %% API Layer
  subgraph API["⚙️ Django REST API (investa_backend/api)"]
    Auth["🔐 Auth & Users"]
    Learning["📚 Learning\n📖 Courses • 📝 Lessons • ❓ Quizzes • 📊 Progress"]
    Trading["💹 Trading\n💼 Portfolio • 📋 Orders • 🏆 Leaderboard"]
    Notify["🔔 Notifications"]
    Privacy["🔒 Privacy & Security"]
  end

  %% Data / Integrations
  subgraph Data["💾 Persistence & Integrations"]
    DB[("🗄️ Relational DB")]
    Media[("📁 Media Storage")]
    Market[("📈 Market Data Provider")]
    Cache[("⚡ Caching Layer")] 
  end

  %% Flows
  UI -->|"REST via Services"| API
  Services -->|"Token Auth"| Auth
  Auth --> DB
  Learning --> DB
  Trading --> DB
  Notify --> DB
  API -. "uploads" .-> Media
  Trading -. "ingests" .-> Market
  API <--> Cache
  API <-. "CORS" .-> Client
```

---

## 📁 **Monorepo Structure**

```
Investa/
├── 📱 InvestaApp/                    # React Native (Expo) app
│   ├── src/
│   │   ├── 🧭 navigation/            # AppNavigator, stacks, tabs
│   │   ├── 🖥️ screens/               # Auth/Main/Course/Trading screens
│   │   ├── 🔌 services/              # API clients
│   │   └── 🔗 context/ hooks/        # Auth and data hooks
│   ├── App.tsx, app.json             # App entry & metadata
│   └── package.json                  # Frontend dependencies
├── ⚙️ investa_backend/               # Django project
│   ├── api/                          # DRF app (models, serializers, views, urls)
│   │   ├── 🗄️ models/                # learning, trading, notifications, privacy, security, user
│   │   ├── 📝 serializers/           # per domain
│   │   ├── 🌐 views/ urls/           # endpoints
│   │   └── 🔄 migrations/            # DO commit these
│   ├── investa_backend/              # Project settings & root urls
│   ├── manage.py                     # Django management
│   ├── populate_sample_data.py       # Sample data seeding
│   ├── create_test_user.py           # Convenience script
│   ├── reset_test_user.py            # Convenience script
│   └── requirements.txt              # Backend dependencies
└── 📖 README.md
```

---

## 🚀 **Quickstart**

### 🔧 **Backend (Django)**
```bash
cd investa_backend
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate && python manage.py runserver
```

### 📱 **Frontend (Expo)**
```bash
cd InvestaApp
npm install
npx expo install       # ensures compatible native deps
npx expo doctor        # verify environment
npm start              # then run on Android/iOS/Web
```

---

## ⚙️ **Setup Guide**

<details>
<summary><b>🔧 Backend (Django)</b></summary>

1) **Create & activate venv; install deps**
```bash
cd investa_backend
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2) **Configure `.env` (see Environment Variables) and run DB**
```bash
python manage.py makemigrations && python manage.py migrate
python manage.py runserver  # http://localhost:8000/
```

3) **Optional: create superuser**
```bash
python manage.py createsuperuser
```

**Admin Panel:** `http://localhost:8000/admin/`

</details>

<details>
<summary><b>📱 Frontend (React Native / Expo)</b></summary>

1) **Install deps**
```bash
cd InvestaApp
npm install
npx expo install
```

2) **Start the dev server**
```bash
npm start
```

3) **Open on device/emulator**
- 🤖 **Android:** `npm run android`
- 🍎 **iOS (macOS):** `npm run ios`
- 🌐 **Web:** `npm run web`

> 💡 **Tip:** Ensure phone and computer are on the same network when using Expo Go.

</details>

---

## 🔧 **Environment Variables**

**Backend `investa_backend/.env` (suggested):**
```bash
SECRET_KEY=replace-with-a-strong-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# Optional DB (defaults to SQLite)
# DATABASE_URL=postgresql://user:password@host:port/dbname

# CORS for Expo/Web dev (adjust as needed)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:19006,http://127.0.0.1:19006
```

> ⚠️ **For production:** set `DEBUG=False`, configure `ALLOWED_HOSTS`, move to PostgreSQL, and harden CORS/CSRF.

---

## 🗄️ **Data and Migrations**

- 📦 **Migrations** in `api/migrations/` are critical and must be committed.
- 🗃️ **Local DB files** like `db.sqlite3` should be gitignored (already configured).
- 🌱 **Seed sample content:**
```bash
cd investa_backend
python manage.py shell < populate_sample_data.py
```
- 👤 **Convenience users:**
```bash
python create_test_user.py
python reset_test_user.py
```

---

## 📊 **Feature Matrix**

| Area | Capability | Status | Icon |
|:-----|:-----------|:------:|:----:|
| 🔐 **Auth** | Register / Login / Token | ✅ | 🟢 |
| 👤 **Profiles** | View / Update profile | ✅ | 🟢 |
| 📚 **Learning** | Courses → Lessons → Quizzes | ✅ | 🟢 |
| 📈 **Progress** | Lesson completion, module progress | ✅ | 🟢 |
| 🔔 **Notifications** | Mark read, list | ✅ | 🟢 |
| 💹 **Trading** | Portfolio, watchlist, leaderboards | ✅ | 🟢 |
| 🔒 **Privacy/Security** | Settings & 2FA scaffolding | ✅ | 🟡 |
| 🌍 **Localization** | Language selection | ✅ | 🟡 |

> 🟢 **Implemented** | 🟡 **Basic UI, API stubs** | 🔴 **Not Started**

> 💻 **Server-side implementations** live in `investa_backend/api/`; **mobile flows** in `InvestaApp/src/screens`.

---

## 🔌 **API Examples**

### 🔐 **Authentication**
**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}'
```

**Response:**
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

### 📚 **Courses**
**Request:**
```bash
curl http://localhost:8000/api/courses/
```

**Response:**
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

### 📝 **Lessons → Mark Completed**
**Request:**
```bash
curl -X POST http://localhost:8000/api/lessons/1/mark_completed/ \
  -H "Authorization: Token <drf-token>"
```

**Response:**
```json
{ "status": "ok", "lesson": 1, "completed": true }
```

### 💹 **Trading — Portfolio Summary**
**Request:**
```bash
curl http://localhost:8000/api/trades/portfolio_summary/ \
  -H "Authorization: Token <drf-token>"
```

**Response:**
```json
{ "value": 125840, "pnl_percent": 0.248, "holdings": [] }
```

> 🔍 **Explore more endpoints** in `investa_backend/api/urls/` and serializer/view code under `investa_backend/api/`.

---

## 🛠️ **Developer Scripts**

| Task | Command | Icon |
|:-----|:--------|:----:|
| 🚀 **Start Django (dev)** | `cd investa_backend && venv\Scripts\activate` (Win) → `python manage.py runserver` | 🔧 |
| 🔄 **Run migrations** | `python manage.py makemigrations && python manage.py migrate` | 📦 |
| 👑 **Create superuser** | `python manage.py createsuperuser` | 👤 |
| 🌱 **Seed sample data** | `python manage.py shell < populate_sample_data.py` | 🌱 |
| 📱 **Start Expo** | `cd InvestaApp && npm start` | 🚀 |
| 🤖 **Android** | `cd InvestaApp && npm run android` | 📱 |
| 🍎 **iOS (macOS)** | `cd InvestaApp && npm run ios` | 🍎 |
| 🌐 **Web** | `cd InvestaApp && npm run web` | 🌐 |

---

## 🧪 **Testing**

- 🧪 **Backend tests** can be added under `investa_backend/api/tests.py` or app-specific test modules.
- 📋 **Example smoke tests** included: `investa_backend/test_api.py`, `investa_backend/test_auth_flow.py`.
- 🚀 **Run tests:**
```bash
cd investa_backend
pytest  # or: python manage.py test
```

---

## 🔍 **Troubleshooting**

### 🚫 **Metro cache deserialization error:**
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

### 📱 **Expo version alignment:**
```powershell
npx expo install
npx expo install expo@53.0.22 @react-native-async-storage/async-storage@2.1.2 react-native-reanimated@~3.17.4 react-native-svg@15.11.2
npx expo doctor
```

### ⚙️ **Reanimated config:**
- Ensure `babel.config.js` includes `plugins: ['react-native-reanimated']`
- Import once at the top of the app entry: `import 'react-native-reanimated';`

---

## 📝 **Current App Behavior**

- 📚 **Lesson Detail:** quiz section is shown directly (no "mark video complete" requirement). Mark-as-completed navigates back to the lesson list with completion info.
- 📱 **Downloads/Leaderboard screens:** responsive updates prevent text overflow and maintain layout on smaller devices.

---

## 🗺️ **Roadmap**

- [x] 🗄️ Core data models (courses, lessons, quizzes, progress, trades)
- [x] 🔐 Token auth + profile APIs
- [x] 👨‍💼 Admin for content management
- [x] 📱 Expo app scaffold with navigation and screens
- [ ] 🔗 Connect app to live API + auth flow
- [ ] 🌍 Multilingual content population
- [ ] 🤖 AI-powered summaries and recommendations
- [ ] 📊 Analytics dashboard and achievements
- [ ] 🚀 Production deployment guides (API & App)

---

## 🤝 **Contributing**

We welcome contributions! Please:

- 🎯 Keep PRs focused and well-described
- 🎨 Match existing code style and formatting
- 🧪 Add tests where it makes sense (`python manage.py test` or `pytest`)

---

## 🔒 **Security**

- 🚫 **Never commit secrets;** use environment variables or a secrets manager
- 🛡️ **In production:** set `DEBUG=False`, configure `ALLOWED_HOSTS`, and harden CORS/CSRF

---

## 📄 **License**

This project is part of the **Investa hackathon project**. All rights reserved.

---

## 🙏 **Acknowledgments**

- 🎓 **SEBI and NISM** for investor education standards
- 🚀 **React Native, Expo, Django, and DRF** communities
- 👥 **Hackathon mentors, contributors, and testers**

---

<div align="center">

### 🌟 **Star this repository if it helped you!**

[![GitHub stars](https://img.shields.io/github/stars/your-username/investa?style=social)](https://github.com/your-username/investa)
[![GitHub forks](https://img.shields.io/github/forks/your-username/investa?style=social)](https://github.com/your-username/investa)
[![GitHub issues](https://img.shields.io/github/issues/your-username/investa)](https://github.com/your-username/investa/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/investa)](https://github.com/your-username/investa/pulls)

**Made with ❤️ for the Indian investor community**

</div>
