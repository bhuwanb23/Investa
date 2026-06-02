# Investa — Phase 1: Fix Fake / Mock Data

> **Goal**: Remove every piece of hardcoded / mocked / fake data currently shipping in the core flows, wire all UI to real backend data, and add the small set of new endpoints required to make those flows real.
> **Approach**: 6 PRs, one per theme. Each PR is independently reviewable, independently testable, and independently revertable. Backend additions are kept minimal and production-ready.

---

## Progress Tracker

| PR | Theme | Status | Items Fixed | PR Link |
|----|-------|--------|-------------|---------|
| 1 | Auth & Profile | ✅ Done | A1, A2, A6, A31, A32, A33 + login bundle | — |
| 2 | Trading data integrity | ✅ Done | A14–A25 (12 items) | — |
| 3 | Home & Profile data | ⬜ Not started | A7, A8 | — |
| 4 | Stock & Lesson detail | ⬜ Not started | A9, A10, A11 (stub), A12, A13, A14, A23, A24, A25 | — |
| 5 | Settings (Security / Privacy / 2FA) | ⬜ Not started | A3, A4, A5 | — |
| 6 | Quiz | ⬜ Not started | A27, A28, A29, A30 | — |

Legend: ⬜ Not started · 🟡 In progress · ✅ Done · ⚠️ Blocked

**Total critical items to resolve in Phase 1**: 33
**Backend additions**: 1 new model (`PasswordResetToken`) + ~6 new endpoints + 1 new view action
**New frontend screen**: `EditProfileScreen`

---

## Phase 1 — Overview

### Out of scope (saved for later phases)
- **Phase 2 — AI features**: "Ask Me Anything" with Ollama (primary) / Gemini / OpenAI. SEBI news with AI summaries.
- **Phase 3 — Production hardening**:
  - Remove dead `api/views.py` shadow file (B1)
  - Empty `api/tests.py` (B2)
  - Duplicate `api/models.py` and `api/serializers.py` (B3, B4)
  - Orphan `app_html/*.html` (B5)
  - Root-level Python scripts → `manage.py` commands (B6)
  - Two test directories consolidation (B7)
  - 168 debug `console.log` calls (B8)
  - `AuthDebug` / `ApiTest` components (B9)
  - Hardcoded `SECRET_KEY` (C1)
  - `DEBUG=True` / `ALLOWED_HOSTS=['*']` / `CORS_ALLOW_ALL_ORIGINS=True` (C2)
  - `DEFAULT_PERMISSION_CLASSES = [AllowAny]` (C3)
  - Pre-filled credentials removed in PR 1 (C4) — partially in scope
- **Phase 4 — Web build**: replace static `app_html/` with proper React Native Web or Next.js
- **Phase 5 — i18n overhaul**: switch to i18next, completeness checks, remove `|| 'English fallback'` patterns

---

# PR 1 — Auth & Profile

**Branch**: `fix/fake-data-pr1-auth-profile`
**Depends on**: nothing
**Blocks**: PR 3 (Home & Profile data uses the login-bundle from this PR)

## 1.1 Scope

| Item | File | Change |
|------|------|--------|
| A1 | `src/screens/auth/CompleteProfileScreen.tsx` | Wire `onSave` to `profileApi.completeProfile()`. Replace US `+1 (555) 000-0000` placeholder with Indian `+91` format. Replace hardcoded `language: 'English (US)'` with `useLanguage` context value. Navigate to `Main` stack on success (not `Login`). |
| A2 | `src/screens/auth/ForgotPasswordScreen.tsx` | Wire to new `/api/auth/forgot-password/` and `/api/auth/reset-password/` endpoints. Show token-input form on second step. |
| A6 | `src/screens/main/ProfileScreen.tsx` | Replace "will be implemented here" Alerts with navigation to new `EditProfileScreen` and to `ForgotPassword` respectively. |
| A31 | `src/context/AuthContext.tsx` | Delete the `USE_FAKE_AUTH` branch (~67 lines, lines 46-112). |
| A32 | `src/hooks/useProfile.ts` | Delete the `USE_FAKE_PROFILE` branch (~260 lines, lines 38-296). |
| A33 | `src/screens/auth/LoginScreen.tsx` | Remove pre-filled `john@example.com` / `testpass123`; start with `''`. |
| Login bundle | `src/context/AuthContext.tsx`, `useProfile.ts`, `src/screens/main/ProfileScreen.tsx` | Use the full `CustomAuthToken` response (profile + security_settings + privacy_settings + learning_progress + trading_performance) as initial state so first render is not empty. |
| New | `src/screens/profile/EditProfileScreen.tsx` | New screen with form for first_name, last_name, phone, learning_goal, preferred_language; calls `profileApi.updateProfile()`. |
| New | Backend `PasswordResetToken` model | `user` (FK), `token` (UUID), `expires_at`, `used_at`, `created_at`. |
| New | Backend `/api/auth/forgot-password/` | Accepts `{email}`, returns generic 200. Creates token, sends/returns reset URL. |
| New | Backend `/api/auth/reset-password/` | Accepts `{token, new_password}`, validates, sets password, marks token used. |

## 1.2 Files Touched

### Frontend
- [ ] `src/screens/auth/CompleteProfileScreen.tsx` — wire to API, fix placeholders
- [ ] `src/screens/auth/ForgotPasswordScreen.tsx` — wire to API
- [ ] `src/screens/auth/LoginScreen.tsx` — remove pre-filled creds
- [ ] `src/context/AuthContext.tsx` — delete fake branch, use login bundle
- [ ] `src/hooks/useProfile.ts` — delete fake branch
- [ ] `src/screens/main/ProfileScreen.tsx` — wire buttons to navigation, use login bundle
- [ ] `src/screens/profile/EditProfileScreen.tsx` (new) — edit form
- [ ] `src/navigation/AppNavigator.tsx` — register `EditProfile` route
- [ ] `src/screens/profile/index.ts` (new) — barrel export
- [ ] `src/services/authApi.ts` — add `forgotPassword(email)`, `resetPassword(token, newPassword)`
- [ ] `src/services/profileApi.ts` — verify `completeProfile` shape matches backend

### Backend
- [ ] `api/models/security.py` — add `PasswordResetToken` model
- [ ] `api/models/__init__.py` — export `PasswordResetToken`
- [ ] `api/serializers/security.py` — add token serializer
- [ ] `api/views/auth.py` — add `forgot_password` and `reset_password` actions
- [ ] `api/urls/api.py` — wire actions (no new URL needed; they're on `auth/login/` family or new sub-routes)
- [ ] `api/migrations/0007_passwordresettoken.py` (new) — auto-generated

## 1.3 Sub-tasks

### Backend first
- [ ] **1.3.1** Add `PasswordResetToken` model with fields and `__str__`
- [ ] **1.3.2** Create migration `0007_passwordresettoken.py`
- [ ] **1.3.3** Add `PasswordResetTokenSerializer` (write-only token + new_password)
- [ ] **1.3.4** Implement `forgot_password` view: lookup user by email, create token, return success
  - Do NOT leak whether the email exists (always 200)
  - Token expires in 1 hour
  - Use `secrets.token_urlsafe(32)` for the token value
- [ ] **1.3.5** Implement `reset_password` view: validate token (not expired, not used), set `user.set_password(new_password)`, mark token used
  - Validate password with Django's password validators
  - Return 400 with field errors on invalid
- [ ] **1.3.6** Wire both actions into URL config under `/api/auth/`
- [ ] **1.3.7** Test via curl:
  - `POST /api/auth/forgot-password/` with `{"email":"test@example.com"}` → 200
  - Token row created in DB
  - `POST /api/auth/reset-password/` with valid token → 200, password changed
  - Try again with same token → 400 "already used"
  - Wait 1h (or set short expiry for test) → 400 "expired"

### Frontend — Auth context cleanup
- [ ] **1.3.8** Delete `USE_FAKE_AUTH` constant and its offline branch from `AuthContext.tsx` (lines 46-112)
- [ ] **1.3.9** Update `AuthContext.User` type to include `profile`, `security_settings`, `privacy_settings`, `learning_progress`, `trading_performance`
- [ ] **1.3.10** In `login()`, after `authApi.login()` succeeds, store the full user data including those fields
- [ ] **1.3.11** In `checkAuthStatus()`, hydrate from stored full user data
- [ ] **1.3.12** In `logout()`, still clear everything (no change)

### Frontend — useProfile cleanup
- [ ] **1.3.13** Delete `USE_FAKE_PROFILE` constant and all fake branches from `useProfile.ts` (lines 38-296)
- [ ] **1.3.14** Each method now only calls the real API
- [ ] **1.3.15** Use login-bundle data as initial profile value if available

### Frontend — CompleteProfileScreen
- [ ] **1.3.16** Replace `setTimeout(..., 600)` with real `profileApi.completeProfile()` call
- [ ] **1.3.17** Replace `+1 (555) 000-0000` placeholder with `+91 XXXXX XXXXX`
- [ ] **1.3.18** Replace hardcoded `language: 'English (US)'` with `useLanguage().selectedLanguage`
- [ ] **1.3.19** On success, navigate to `Main` (not `Login`)
- [ ] **1.3.20** Add proper error handling with `Alert` on failure
- [ ] **1.3.21** Add loading state during submit

### Frontend — ForgotPasswordScreen
- [ ] **1.3.22** Convert to 2-step flow: email → token + new password
- [ ] **1.3.23** Step 1: `authApi.forgotPassword(email)` → show "Check your inbox" message
- [ ] **1.3.24** Step 2: `authApi.resetPassword(token, newPassword)` → navigate to Login on success
- [ ] **1.3.25** Add inline validation (email format, password length, password match)

### Frontend — LoginScreen
- [ ] **1.3.26** Remove pre-filled `useState('john@example.com')` and `useState('testpass123')` — start empty
- [ ] **1.3.27** (Optional) Add a small "Use test account" link in `__DEV__` for developer convenience

### Frontend — ProfileScreen wiring
- [ ] **1.3.28** `handleUpdateProfile` → `navigation.navigate('EditProfile')`
- [ ] **1.3.29** `handleResetPassword` → `navigation.navigate('ForgotPassword')`
- [ ] **1.3.30** Read `profile` from `useProfile()` (already done) and prefer login-bundle value if `profile` is null
- [ ] **1.3.31** Use `useLanguage().selectedLanguage` for the displayed preferred language

### Frontend — EditProfileScreen (new)
- [ ] **1.3.32** Create `src/screens/profile/EditProfileScreen.tsx`
- [ ] **1.3.33** Pre-fill fields from current profile
- [ ] **1.3.34** Save → `profileApi.updateProfile()` → navigate back to `Profile`
- [ ] **1.3.35** Add `EditProfile` route in `AppNavigator.tsx` `MainStackParamList`

## 1.4 Validation

After all sub-tasks done:

- [ ] **1.4.1** Backend: run `python manage.py migrate` and `python populate_sample_data.py`
- [ ] **1.4.2** Backend: start `runserver 0.0.0.0:8000`
- [ ] **1.4.3** Frontend: `npx expo start --clear`
- [ ] **1.4.4** Login flow:
  - [ ] Open app, log in with `test@example.com` / `testpass123`
  - [ ] First render of Profile shows real data (not empty → not fake)
- [ ] **1.4.5** Edit profile flow:
  - [ ] From Profile, tap "Update Profile" → opens EditProfile
  - [ ] Change phone, save → returns to Profile, shows new value
- [ ] **1.4.6** Forgot password flow:
  - [ ] From Login, tap "Forgot password" → enter email → submit
  - [ ] Step 2 appears; enter token + new password
  - [ ] On success, navigate to Login
  - [ ] Log in with new password
- [ ] **1.4.7** Complete profile flow:
  - [ ] Register a new user, get logged in
  - [ ] Land on CompleteProfile with `+91` placeholder and English selected
  - [ ] Fill, save → go to Main
- [ ] **1.4.8** Verify dead code gone:
  - [ ] `grep -r "USE_FAKE" src/` returns nothing
  - [ ] `grep -r "dev-token" src/` returns nothing
  - [ ] `grep -r "functionality will be implemented" src/` returns nothing
- [ ] **1.4.9** TypeScript compiles (`npx tsc --noEmit`)
- [ ] **1.4.10** No new console errors at app start

---

# PR 2 — Trading Data Integrity

**Branch**: `fix/fake-data-pr2-trading-data`
**Depends on**: PR 1
**Blocks**: PR 3, PR 4

## 2.1 Scope

| Item | File | Change |
|------|------|--------|
| A14 | `src/screens/trading/Constants/tradingConstants.ts` | Delete `STOCK_DETAIL_DATA` (Apple fallback). Show "—" for missing fields. |
| A15 | `src/screens/trading/components/ChartSection.tsx` | Remove `Math.random()` candlestick generator. Show "No historical data" when `priceHistory` is empty. |
| A16 | `src/screens/trading/OrderHistoryScreen.tsx` | Replace `% 3` / `% 2` filters with real date-range filters (today / 7d / 30d / all). |
| A17 | `src/screens/trading/PlaceOrderScreen.tsx` | Remove hardcoded `currentCash: 2817.55`. |
| A18 | `src/screens/trading/PlaceOrderScreen.tsx` | Remove fallback stock object. |
| A19 | `src/screens/trading/PlaceOrderScreen.tsx` | Always POST to backend; if `stockId` missing → show error Alert, do NOT simulate. |
| A20 | `src/screens/trading/hooks/useTradingData.ts` | Remove `PORTFOLIO_DATA` / `PORTFOLIO_HOLDINGS` / `ORDER_HISTORY` initial values. Delete `addToPortfolio` / `removeFromPortfolio` local-mutation. |
| A21 | `src/screens/trading/TradingScreen.tsx` | Replace `marketIndices` / `topMovers` / `sparklineHeights` hardcoded values. |
| A22 | `src/screens/trading/PortfolioScreen.tsx` | Replace `Math.random()` sector colors with fixed 8-color palette. |
| A23 | `src/screens/trading/StockDetailScreen.tsx` | Remove hardcoded `avgVolume: '3.1M'`, `dividendYield: '0.85%'`, `beta: '1.24'`. |
| A24 | `src/screens/trading/StockDetailScreen.tsx` | Remove hardcoded `recentTrades` array. |
| A25 | `src/screens/trading/StockDetailScreen.tsx` | Wire `handleToggleBookmark` to `watchlist/add_stock/` / `watchlist/remove_stock/`. |

### Backend additions
- [ ] `GET /api/market-data/market_summary/` — return NIFTY/SENSEX/BANK NIFTY indices
- [ ] `GET /api/market-data/top_movers/` — gainers/losers
- [ ] `GET /api/market-data/indices/` — index list
- [ ] `GET /api/stocks/{id}/news/` — stock-specific news
- [ ] `GET /api/orders/order_history/?date_from=&date_to=&status=&side=` — real filters
- [ ] `StockViewSet.retrieve` extended to return `description`, `news`, `fundamentals`, `dividend_yield`, `beta`, `avg_volume`
- [ ] New `StockNews` model (symbol, title, source, published_at, url)
- [ ] New migration `0008_stocknews.py`
- [ ] Seed news for at least 4 stocks in `trading_sample_data.py`

## 2.2 Files Touched

### Frontend
- `src/screens/trading/Constants/tradingConstants.ts`
- `src/screens/trading/components/ChartSection.tsx`
- `src/screens/trading/OrderHistoryScreen.tsx`
- `src/screens/trading/PlaceOrderScreen.tsx`
- `src/screens/trading/hooks/useTradingData.ts`
- `src/screens/trading/TradingScreen.tsx`
- `src/screens/trading/PortfolioScreen.tsx`
- `src/screens/trading/StockDetailScreen.tsx`
- `src/screens/trading/utils/tradingApi.ts` — add `fetchStockNews`
- New `src/screens/trading/constants/palette.ts` — sector colors

### Backend
- `api/models/trading.py` — add `StockNews`
- `api/models/__init__.py` — export
- `api/serializers/trading.py` — extend stock serializer, add news
- `api/views/trading.py` — add `stock_news` action, extend `order_history` with date filters
- `api/views/market_data.py` (or wherever) — confirm market summary, top movers
- `api/urls/api.py` — wire new actions
- `api/sample/trading_sample_data.py` — seed news
- `api/migrations/0008_stocknews.py` (new)

## 2.3 Sub-tasks

### Backend
- [ ] **2.3.1** Add `StockNews` model
- [ ] **2.3.2** Create migration
- [ ] **2.3.3** Extend `StockSerializer` to include `description`, `dividend_yield`, `beta`, `avg_volume`, `fundamentals`
- [ ] **2.3.4** Add `stock_news` action on `StockViewSet`
- [ ] **2.3.5** Extend `OrderHistorySerializer` and `order_history` action with `date_from`/`date_to` query params
- [ ] **2.3.6** Verify `MarketDataViewSet.market_summary` and `top_movers` return real data; if not, fix them
- [ ] **2.3.7** Seed sample stock news in `trading_sample_data.py`
- [ ] **2.3.8** Test all new endpoints with curl

### Frontend
- [ ] **2.3.9** Delete `STOCK_DETAIL_DATA` constant; replace all usages with "—" or computed fallbacks
- [ ] **2.3.10** Create `palette.ts` with 8 fixed sector colors
- [ ] **2.3.11** Update `PortfolioScreen` to use palette
- [ ] **2.3.12** Refactor `ChartSection` to render only when `priceHistory.length > 0`; otherwise show empty state
- [ ] **2.3.13** Refactor `OrderHistoryScreen` filter logic to send real date params
- [ ] **2.3.14** Refactor `PlaceOrderScreen` to require `stockId`; show error if missing
- [ ] **2.3.15** Remove `addToPortfolio` / `removeFromPortfolio` from `useTradingData`; find all callers and update them
- [ ] **2.3.16** Replace `marketIndices` / `topMovers` in `TradingScreen` with API data
- [ ] **2.3.17** Update `StockDetailScreen` to render real news via `fetchStockNews`
- [ ] **2.3.18** Wire `handleToggleBookmark` to API

## 2.4 Validation

- [ ] **2.4.1** Place an order via app → verify row in `/api/orders/`
- [ ] **2.4.2** Order history "This Week" / "This Month" filters show real date-filtered data
- [ ] **2.4.3** Stock detail for a stock with no news shows empty state, not Apple data
- [ ] **2.4.4** Chart with no price history shows empty state, not random candles
- [ ] **2.4.5** Bookmark toggle persists across app restarts
- [ ] **2.4.6** `grep -r "Math.random" src/screens/trading` returns nothing (except the genuine sparkline use in TradingScreen which is replaced too)
- [ ] **2.4.7** `grep -r "STOCK_DETAIL_DATA" src/` returns nothing
- [ ] **2.4.8** `grep -r "PORTFOLIO_DATA\|PORTFOLIO_HOLDINGS\|ORDER_HISTORY" src/screens/trading/Constants` returns nothing

---

# PR 3 — Home & Profile Data

**Branch**: `fix/fake-data-pr3-home-profile-data`
**Depends on**: PR 1, PR 2
**Blocks**: nothing

## 3.1 Scope

| Item | File | Change |
|------|------|--------|
| A7 | `src/screens/main/ProfileScreen.tsx` | Wire learning/trading/quiz cards to real backend data |
| A8 | `src/screens/main/HomeScreen.tsx` | Replace 5 hardcoded arrays with API data |

### Backend additions
- [ ] `GET /api/courses/recommended/?limit=5` — top courses by user level
- [ ] `GET /api/progress/in_progress/` — courses user started
- [ ] `GET /api/trading-performance/achievements/` (alias or rename of `my_achievements/`)
- [ ] Verify `market-data/top_movers/` returns Indian tickers

## 3.2 Files Touched

### Frontend
- `src/screens/main/HomeScreen.tsx` — replace 5 hardcoded arrays
- `src/screens/main/ProfileScreen.tsx` — wire stat cards
- `src/services/progressApi.ts` — add new methods
- `src/services/tradingApi.ts` — add `fetchAchievements`

### Backend
- `api/views/learning.py` — add `recommended` action
- `api/views/progress.py` — add `in_progress` action
- `api/views/trading.py` — confirm or add `achievements` action
- `api/urls/api.py`

## 3.3 Sub-tasks

### Backend
- [ ] **3.3.1** Add `recommended` action on `CourseViewSet`
- [ ] **3.3.2** Add `in_progress` action on `UserProgressViewSet`
- [ ] **3.3.3** Verify or add `achievements` action

### Frontend
- [ ] **3.3.4** `HomeScreen.learningPathItems` ← `progressApi.getInProgress()`
- [ ] **3.3.5** `HomeScreen.achievements` ← `fetchAchievements()`
- [ ] **3.3.6** `HomeScreen.recommendedCourses` ← `fetchRecommendedCourses()`
- [ ] **3.3.7** `HomeScreen.trendingStocks` ← `market-data/top_movers/`
- [ ] **3.3.8** `HomeScreen.portfolioData` ← `portfolio/my_portfolio/`
- [ ] **3.3.9** Add loading skeletons for each section
- [ ] **3.3.10** Add empty states
- [ ] **3.3.11** `ProfileScreen` learning progress card ← `learning-progress/my_progress/` + `progress/summary/`
- [ ] **3.3.12** `ProfileScreen` trading performance card ← `trading-performance/my_performance/`
- [ ] **3.3.13** `ProfileScreen` quiz performance ← `progress/`
- [ ] **3.3.14** Use login-bundle data as initial values

## 3.4 Validation

- [ ] **3.4.1** Home screen shows real recommended courses (not the 3 hardcoded ones)
- [ ] **3.4.2** Home screen trending stocks show real Indian movers
- [ ] **3.4.3** Home screen portfolio card reflects real portfolio
- [ ] **3.4.4** Profile screen all stat cards show real numbers
- [ ] **3.4.5** Empty states render when sections have no data
- [ ] **3.4.6** `grep -r "quickAccessItems = \[\|trendingStocks = \[\|recommendedCourses = \[" src/screens/main/HomeScreen.tsx` returns nothing (well, the function may exist with empty data)

---

# PR 4 — Stock & Lesson Detail

**Branch**: `fix/fake-data-pr4-stock-lesson-detail`
**Depends on**: PR 2
**Blocks**: nothing (but PR 6 uses some of the lesson detail work)

## 4.1 Scope

| Item | File | Change |
|------|------|--------|
| A9 | `src/screens/courses/Constants/courseConstants.ts` | Delete `QUIZ_QUESTIONS` (programming questions). |
| A10 | `src/screens/courses/Constants/courseConstants.ts` | Delete `VIDEO_DATA`. |
| A11 | `src/screens/courses/LessonDetailScreen.tsx` | Replace "Simulate AI response" with disabled "AI Tutor (coming soon)" stub. (Full LLM in Phase 2.) |
| A12 | `src/screens/courses/LessonDetailScreen.tsx` | Replace `<Text>Video Player</Text>` with `expo-av` `<Video>`. |
| A13 | `src/screens/courses/LessonDetailScreen.tsx` | Delete hardcoded JS code example; render real `lesson.content`. |
| A14 | `src/screens/trading/StockDetailScreen.tsx` | (Done in PR 2 — verify) |
| A23 | `src/screens/trading/StockDetailScreen.tsx` | (Done in PR 2 — verify) |
| A24 | `src/screens/trading/StockDetailScreen.tsx` | (Done in PR 2 — verify) |
| A25 | `src/screens/trading/StockDetailScreen.tsx` | (Done in PR 2 — verify) |

## 4.2 Files Touched

### Frontend
- `src/screens/courses/Constants/courseConstants.ts` — delete `QUIZ_QUESTIONS` and `VIDEO_DATA`
- `src/screens/courses/LessonDetailScreen.tsx` — video player, content render, AI stub
- `package.json` — add `expo-av`

### Backend
- None

## 4.3 Sub-tasks

- [ ] **4.3.1** Install `expo-av` and verify it works on Expo SDK 53 (may need to switch to `expo-video` if `expo-av` is deprecated)
- [ ] **4.3.2** Add `<Video>` component to `LessonDetailScreen` that loads `lesson.video_url` if present
- [ ] **4.3.3** Hide video block entirely if `video_url` is null
- [ ] **4.3.4** Replace hardcoded JS code example (lines 275-285) with `lesson.content` rendered as plain text (or markdown if backend supports it)
- [ ] **4.3.5** Replace "Simulate AI response" with a disabled button labelled "AI Tutor (coming soon)"
- [ ] **4.3.6** Add an `onPress` that shows a friendly `Alert` ("AI tutor launches in a future update")
- [ ] **4.3.7** Add `TODO: Phase 2 - Ollama integration` comment
- [ ] **4.3.8** Delete `QUIZ_QUESTIONS` from `courseConstants.ts`
- [ ] **4.3.9** Delete `VIDEO_DATA` from `courseConstants.ts`
- [ ] **4.3.10** Verify `LessonQuizContent.tsx` does not import deleted constants (also touched in PR 6)

## 4.4 Validation

- [ ] **4.4.1** Open a lesson with a `video_url` → video plays
- [ ] **4.4.2** Open a lesson without a `video_url` → video block hidden, no "Video Player" text
- [ ] **4.4.3** Lesson content shows real content from API, not the hardcoded JS example
- [ ] **4.4.4** "AI Tutor" button is disabled with the "coming soon" label
- [ ] **4.4.5** `grep -r "VIDEO_DATA\|QUIZ_QUESTIONS" src/screens/courses/Constants/` returns nothing
- [ ] **4.4.6** `grep -r "Video Player" src/screens/courses/LessonDetailScreen.tsx` returns nothing
- [ ] **4.4.7** `grep -r "greet(\"World\")" src/` returns nothing
- [ ] **4.4.8** `grep -r "Simulate AI" src/` returns nothing

---

# PR 5 — Settings (Security / Privacy / 2FA)

**Branch**: `fix/fake-data-pr5-settings`
**Depends on**: PR 1
**Blocks**: nothing

## 5.1 Scope

| Item | File | Change |
|------|------|--------|
| A3 | `src/components/TwoFactorAuth.tsx` | Wire to backend 2FA endpoints. Real backup codes from server, not `Math.random()`. |
| A4 | `src/components/SecuritySettings.tsx` | Wire toggles + password change to backend. |
| A5 | `src/components/PrivacySettings.tsx` | Wire toggles + export + delete to backend. |

### Backend additions
- [ ] `POST /api/security-settings/change_password/` — `{old_password, new_password}`
- [ ] `POST /api/security-settings/2fa/setup/` — returns secret + URI + backup codes
- [ ] `POST /api/security-settings/2fa/verify/` — `{code}` → enables 2FA
- [ ] `POST /api/security-settings/2fa/disable/` — disables
- [ ] `GET /api/security-settings/sessions/` — active sessions list
- [ ] `DELETE /api/security-settings/sessions/{id}/` — kill one session
- [ ] `POST /api/security-settings/sessions/delete_all/` — kill all other sessions
- [ ] `POST /api/privacy-settings/export_data/` — returns user data as JSON
- [ ] `DELETE /api/privacy-settings/delete_account/` — deletes user + cascades

### Frontend additions
- New `src/services/securityApi.ts`
- New `src/services/privacyApi.ts`

## 5.2 Files Touched

### Frontend
- `src/components/SecuritySettings.tsx`
- `src/components/TwoFactorAuth.tsx`
- `src/components/PrivacySettings.tsx`
- `src/services/securityApi.ts` (new)
- `src/services/privacyApi.ts` (new)
- `src/services/index.ts` — export new services

### Backend
- `api/views/security.py` — add actions
- `api/views/privacy.py` — add actions
- `api/serializers/security.py` — `BackupCodeSerializer`
- `api/urls/api.py`

## 5.3 Sub-tasks

### Backend
- [ ] **5.3.1** Add `change_password` action with old/new validation
- [ ] **5.3.2** Add `2fa/setup` action — generate `pyotp` secret, return QR-URI + 10 backup codes (store hashed)
- [ ] **5.3.3** Add `2fa/verify` action — verify TOTP code, set `security_settings.two_factor_enabled = True`
- [ ] **5.3.4** Add `2fa/disable` action — require password confirmation
- [ ] **5.3.5** Add `sessions` list and delete actions
- [ ] **5.3.6** Add `export_data` action — return user profile + settings + portfolio + trades as JSON
- [ ] **5.3.7** Add `delete_account` action — require password confirmation, cascade delete user
- [ ] **5.3.8** Test each via curl

### Frontend
- [ ] **5.3.9** Create `securityApi.ts` with all needed methods
- [ ] **5.3.10** Create `privacyApi.ts`
- [ ] **5.3.11** `SecuritySettings` toggles → `securityApi.updateSettings()`
- [ ] **5.3.12** `SecuritySettings.handleChangePassword` → `securityApi.changePassword()`
- [ ] **5.3.13** `SecuritySettings.handleLogoutAllDevices` → `securityApi.deleteAllSessions()`
- [ ] **5.3.14** `SecuritySettings.handleViewActiveSessions` → navigate to new Sessions screen (optional: keep console.log as TODO if not implementing now)
- [ ] **5.3.15** `TwoFactorAuth` setup → `securityApi.setup2fa()` → show QR (use `qrcode` package or display URI for manual entry) → verify code → call `verify2fa()`
- [ ] **5.3.16** `TwoFactorAuth` disable → `disable2fa(password)`
- [ ] **5.3.17** `TwoFactorAuth` recovery email → `updateSettings({recovery_email})`
- [ ] **5.3.18** `PrivacySettings` toggles → `privacyApi.updateSettings()`
- [ ] **5.3.19** `PrivacySettings.handleDataExport` → call `exportData()` → share the JSON
- [ ] **5.3.20** `PrivacySettings.handleDeleteAccount` → confirm with password → call `deleteAccount()` → log out
- [ ] **5.3.21** Update `securityApi.ts` types to match backend response shapes

## 5.4 Validation

- [ ] **5.4.1** Toggle a security setting, reload app, see it persisted
- [ ] **5.4.2** Change password, log out, log in with new password
- [ ] **5.4.3** Setup 2FA, scan QR, verify, log out, log in with TOTP code (if login flow supports 2FA — otherwise verify that the backup codes are stored)
- [ ] **5.4.4** Privacy toggles persist
- [ ] **5.4.5** Export data downloads a JSON file with user data
- [ ] **5.4.6** Delete account confirms and removes user (test on a throwaway account)
- [ ] **5.4.7** `grep -r "Math.random" src/components/TwoFactorAuth.tsx` returns nothing
- [ ] **5.4.8** `grep -r "console.log" src/components/{SecuritySettings,TwoFactorAuth,PrivacySettings}.tsx` returns nothing

---

# PR 6 — Quiz

**Branch**: `fix/fake-data-pr6-quiz`
**Depends on**: PR 4
**Blocks**: nothing

## 6.1 Scope

| Item | File | Change |
|------|------|--------|
| A27 | `src/screens/quiz/QuizStartScreen.tsx` | Fetch topics from `/api/quiz/`. Delete `quizData.ts`. |
| A28 | `src/screens/quiz/QuizQuestionScreen.tsx` | Fix URL `/quizzes/` → `/quiz/`. |
| A29 | `src/screens/quiz/QuizQuestionScreen.tsx` | Remove explanation-as-hint leak. |
| A30 | `src/screens/courses/components/LessonQuizContent.tsx` | Remove `QUIZ_QUESTIONS` fallback; show empty state. |

### Backend additions
- [ ] Verify `GET /api/quiz/` returns active quizzes
- [ ] Verify `GET /api/quiz/{id}/` returns quiz with `questions` and `answers`
- [ ] Add `?difficulty=&is_active=` filters if missing

## 6.2 Files Touched

### Frontend
- `src/screens/quiz/QuizStartScreen.tsx`
- `src/screens/quiz/QuizQuestionScreen.tsx`
- `src/screens/quiz/Constants/quizData.ts` (delete)
- `src/screens/quiz/components/QuizTopicCard.tsx` — verify not depending on deleted constants
- `src/screens/courses/components/LessonQuizContent.tsx`

### Backend
- `api/views/learning.py` — small serializer tweaks
- `api/serializers/learning.py`

## 6.3 Sub-tasks

### Backend
- [ ] **6.3.1** Verify quiz list endpoint works
- [ ] **6.3.2** Verify quiz detail endpoint returns questions with answers nested
- [ ] **6.3.3** Add `?is_active=true` default filter

### Frontend
- [ ] **6.3.4** Delete `src/screens/quiz/Constants/quizData.ts`
- [ ] **6.3.5** `QuizStartScreen` fetches from `/api/quiz/` instead of `QUIZ_TOPICS`
- [ ] **6.3.6** `QuizQuestionScreen:44` change `/quizzes/${quizId}/` → `/quiz/${quizId}/`
- [ ] **6.3.7** `QuizQuestionScreen:188` `handleHint` → return generic tip, not `currentQuestion.explanation`
- [ ] **6.3.8** `LessonQuizContent.tsx` remove `import { QUIZ_QUESTIONS }` from `courseConstants`
- [ ] **6.3.9** `LessonQuizContent.tsx` if no backend question → show "Quiz unavailable" state
- [ ] **6.3.10** Find and update any other files that import `QUIZ_TOPICS` or `QUIZ_QUESTIONS` from `quizData.ts`

## 6.4 Validation

- [ ] **6.4.1** Open Quiz Center → see topics loaded from backend
- [ ] **6.4.2** Tap a topic → questions load (no 404)
- [ ] **6.4.3** Submit answers → score shows up at end
- [ ] **6.4.4** Hint button shows generic tip, NOT the answer explanation
- [ ] **6.4.5** `grep -r "QUIZ_TOPICS\|QUIZ_QUESTIONS" src/` returns nothing
- [ ] **6.4.6** `grep -r "quizzes/" src/screens/quiz/` returns nothing
- [ ] **6.4.7** `grep -r "currentQuestion.explanation" src/screens/quiz/QuizQuestionScreen.tsx` returns nothing (unless it's the post-answer explanation)

---

# Phase 2 — AI Features (placeholder)

**Will use Ollama as primary, Gemini and OpenAI as secondary.** Not in Phase 1.

- [ ] "Ask Me Anything" LLM tutor in `LessonDetailScreen`
- [ ] SEBI news feed with AI summaries
- [ ] Provider abstraction (`llmService.ts`)
- [ ] Settings to choose provider + API key entry

---

# Phase 3 — Production Hardening (placeholder)

Not in Phase 1. See `todo.md` Phase 1 for out-of-scope items.

- [ ] Remove dead `api/views.py` shadow file (B1)
- [ ] Empty `api/tests.py` (B2)
- [ ] Duplicate `api/models.py` and `api/serializers.py` (B3, B4)
- [ ] Orphan `app_html/*.html` (B5)
- [ ] Root-level Python scripts → `manage.py` commands (B6)
- [ ] Two test directories consolidation (B7)
- [ ] 168 debug `console.log` calls (B8)
- [ ] `AuthDebug` / `ApiTest` components (B9)
- [ ] Hardcoded `SECRET_KEY` (C1)
- [ ] `DEBUG=True` / `ALLOWED_HOSTS=['*']` / `CORS_ALLOW_ALL_ORIGINS=True` (C2)
- [ ] `DEFAULT_PERMISSION_CLASSES = [AllowAny]` (C3)

---

# Phase 4 — Web Build (placeholder)

- [ ] Replace `app_html/` with proper React Native Web or Next.js

---

# Phase 5 — i18n Overhaul (placeholder)

- [ ] Switch to i18next
- [ ] Add translation completeness check
- [ ] Remove `|| 'English fallback'` patterns
- [ ] Translate all current hardcoded English strings
