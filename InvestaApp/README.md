# Login Functionality Setup Guide

This guide explains how to set up and test the login functionality in the Investa app.

## Prerequisites

1. **Django Backend Running**: Make sure your Django backend is running on `http://localhost:8000`
2. **Database Setup**: Ensure the database is migrated and has the required tables
3. **Test User**: Create a test user in the Django backend

## Backend Setup

### 1. Start Django Server
```bash
cd investa_backend
python manage.py runserver
```

### 2. Create Sample Data
```bash
cd investa_backend
python populate_sample_data.py
```

This will create sample users with:
- **Email**: john@example.com, jane@example.com, etc.
- **Password**: testpass123

See `SAMPLE_USERS.md` for the complete list of available users.

### 3. Verify API Endpoints
The following endpoints should be available:
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/courses/` - List courses (requires authentication)

## Frontend Setup

### 1. Install Dependencies
```bash
cd InvestaApp
npm install @react-native-async-storage/async-storage
```

### 2. Configure API URL
Edit `src/config/config.ts` to match your Django server URL:
- **Android Emulator**: `http://10.0.2.2:8000/api/`
- **iOS Simulator**: `http://localhost:8000/api/`
- **Physical Device**: `http://YOUR_IP_ADDRESS:8000/api/`

### 3. Start React Native App
```bash
npm start
# or
expo start
```

## Testing Login

1. **Open the app** - You should see the login screen
2. **Enter credentials**:
   - Email: `john@example.com` (or any sample user email)
   - Password: `testpass123`
3. **Tap "Sign In"** - The app should authenticate and navigate to the home screen
4. **Verify navigation** - You should see the home screen with user information
5. **Test logout** - Tap the logout button to return to the login screen

## Troubleshooting

### Common Issues

1. **"Network error" message**:
   - Check if Django server is running
   - Verify the API URL in `config.ts`
   - Check network permissions on device/emulator

2. **"Invalid credentials" message**:
   - Verify the test user was created successfully
   - Check Django server logs for authentication errors

3. **App stays on login screen**:
   - Check browser console for JavaScript errors
   - Verify AsyncStorage is working properly
   - Check if the AuthContext is properly set up

### Debug Steps

1. **Check Django logs** for API request details
2. **Check React Native logs** for frontend errors
3. **Verify API response** using tools like Postman or curl
4. **Check AsyncStorage** in React Native debugger

## API Testing with curl

Test the login endpoint directly:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "john@example.com", "password": "testpass123"}'
```

Expected response:
```json
{
  "token": "your-auth-token",
  "user_id": 1,
  "username": "test@example.com",
  "email": "test@example.com",
  "profile": {...}
}
```

## Next Steps

After successful login:
1. **Implement user registration**
2. **Add password reset functionality**
3. **Implement course enrollment**
4. **Add progress tracking**
5. **Implement quiz functionality**

## Security Notes

- This is a development setup with basic authentication
- For production, consider:
  - HTTPS enforcement
  - Token expiration
  - Rate limiting
  - Input validation
  - SQL injection protection
