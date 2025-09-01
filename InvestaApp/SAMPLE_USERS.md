# Sample Users for Testing

The following sample users are available for testing the Investa app. All users have the password: `testpass123`

## Available Users

| Username | Email | First Name | Last Name | Level | Experience |
|----------|-------|------------|-----------|-------|------------|
| john_doe | john@example.com | John | Doe | 3 | 450 XP |
| jane_smith | jane@example.com | Jane | Smith | 7 | 1200 XP |
| mike_wilson | mike@example.com | Mike | Wilson | 2 | 280 XP |
| sarah_jones | sarah@example.com | Sarah | Jones | 12 | 2800 XP |
| david_brown | david@example.com | David | Brown | 8 | 1600 XP |
| emma_davis | emma@example.com | Emma | Davis | 4 | 650 XP |
| alex_chen | alex@example.com | Alex | Chen | 15 | 3500 XP |
| priya_patel | priya@example.com | Priya | Patel | 6 | 950 XP |
| raj_kumar | raj@example.com | Raj | Kumar | 9 | 1800 XP |
| anita_sharma | anita@example.com | Anita | Sharma | 5 | 750 XP |

## Login Instructions

1. Use any of the email addresses above as the username
2. Use `testpass123` as the password
3. The app will automatically authenticate with the backend

## Features Available

Each user has:
- Complete user profile with learning goals and preferences
- Portfolio with sample holdings
- Order history with sample trades
- Learning progress and achievements
- Security and privacy settings

## Development Notes

- Backend authentication accepts both email and username
- All sample data is automatically created when running `python populate_sample_data.py`
- Users have realistic trading data and learning progress
- The `dev_user` account is used for unauthenticated API calls
