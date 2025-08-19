# Investa API

Django REST Framework API for the Investa app. This document lists endpoints, request/response shapes, and useful development notes.

## Base URL
- Local: `http://localhost:8000/api/`

## Authentication
Token-based auth. Include header `Authorization: Token <your_token>` for protected endpoints.

- POST `auth/register/`
  - body: `{ username, email, password, confirm_password, first_name?, last_name? }`
  - resp: `{ token, user_id, username, email, detail }`

- POST `auth/login/`
  - body: `{ username, password }`
  - resp: `{ token, user_id, username, email, profile }`

- GET `auth/me/` (auth)
  - resp: `{ user_id, username, email, first_name, last_name, profile }`

- POST `auth/logout/` (auth)
  - resp: `{ detail }`

## Languages
- GET `languages/`
- GET `languages/{id}/`

## Profiles (auth)
- GET `profiles/my_profile/`
- PUT/PATCH `profiles/update_profile/`
- Standard CRUD via `profiles/` is scoped to the authenticated user (create attaches current user)

## Courses (auth)
- GET `courses/`
- GET `courses/{id}/`
- GET `courses/by_language/?language=en|hi|...`
- GET `courses/by_difficulty/?difficulty=beginner|intermediate|advanced`
- POST `courses/{id}/enroll/`

## Lessons (auth)
- GET `lessons/`
- GET `lessons/{id}/`
- POST `lessons/{id}/mark_completed/`

## Quizzes (auth)
- GET `quizzes/`
- GET `quizzes/{id}/`
- POST `quizzes/{id}/submit_attempt/`
  - body: `{ time_taken?: number, answers: [{ question_id, answer_id }] }`
  - resp: `{ score, passed, correct_answers, total_questions, attempt_id }`

## Progress (auth)
- GET `progress/`
- GET `progress/course_progress/?course_id=<id>`
- GET `progress/overall_progress/`

## Simulated Trades (auth)
- GET `trades/`
- POST `trades/` (body: `{ symbol, trade_type: "buy"|"sell", quantity, price, total_amount, notes? }`)
- GET `trades/portfolio_summary/`

## Notifications (auth)
- GET `notifications/`
- GET `notifications/unread_count/`
- GET `notifications/by_type/?type=course_update|quiz_reminder|achievement|general`
- POST `notifications/{id}/mark_read/`
- POST `notifications/mark_all_read/`

## Dev HTML (development only)
- GET `dashboard/`
- GET `database/`

## Seeding
- `python populate_sample_data.py`
- `python create_test_user.py`

## Notes
- Pagination: DRF PageNumberPagination (`page`, default `page_size` = 20)
- Media: thumbnails served under `/media/` when `DEBUG=True`
