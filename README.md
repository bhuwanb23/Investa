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

</div>

## 🎯 **Overview**

### **Problem Statement**
Many retail investors in India lack the knowledge and tools to navigate the securities market effectively. Available financial education resources are often complex, fragmented, or limited to English, making it difficult for a large segment of the population to access reliable information. This leads to uninformed decisions, susceptibility to misinformation, and financial losses.
<div align="center">
  <img src="assets/images/Major Problems - visual selection.png" alt="Major Problems in Indian Retail Investing" width="800"/>
</div>

### **Impact of the Problems**

<div align="center">
  <img src="assets/images/Impacts of the problems.png" alt="Impacts of Investment Problems" width="800"/>
</div>

---

## 👥 **Target Audience**

<div align="center">
  <img src="assets/images/target audience.png" alt="Target Audience for Investa" width="800"/>
</div>

---

## ✨ **Solution Features**

<div align="center">
  <img src="assets/images/Solution features.png" alt="Investa Solution Features" width="800"/>
</div>

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
python manage.py migrate
python manage.py runserver 0.0.0.0:8000    # Bind to all interfaces for devices
```

### 📱 **Frontend (Expo)**
```bash
cd InvestaApp
npm install
npx expo install       # ensures compatible native deps
npx expo doctor        # verify environment

# Set API base URL for device connectivity
$env:EXPO_PUBLIC_API_BASE_URL="http://YOUR_PC_LAN_IP:8000/api/"
npx expo start --clear
```

### 📱 **Open on Device/Emulator**
- 🤖 **Android:** `npm run android`
- 🍎 **iOS (macOS):** `npm run ios`
- 🌐 **Web:** `npm run web`

> 💡 **Tip:** Ensure phone and computer are on the same network when using Expo Go.

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

## 🧪 **Testing**

- 🧪 **Backend tests** can be added under `investa_backend/api/tests.py` or app-specific test modules.
- 📋 **Example smoke tests** included: `investa_backend/test_api.py`, `investa_backend/test_auth_flow.py`.
- 🚀 **Run tests:**
```bash
cd investa_backend
pytest  # or: python manage.py test
```

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
