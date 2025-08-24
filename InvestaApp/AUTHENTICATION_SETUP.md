# Authentication Setup Guide

## Development Mode (Current)

The app is currently configured to use **fake authentication** for development purposes. This allows you to test the app without running the Django backend.

### How to Use Development Mode

1. **Login Credentials**: Use `test@example.com` / `test123`
2. **No Backend Required**: The app will work offline
3. **Fake Token**: Uses a development token (`dev-token`)

### Current Configuration

- `USE_FAKE_AUTH = true` in `src/context/AuthContext.tsx`
- `USE_FAKE_PROFILE = true` in `src/hooks/useProfile.ts`
- Token interceptor disabled in `src/services/api.ts`
- API base URL set to dummy localhost:3000

## Production Mode (Backend Required)

To switch to real backend authentication:

### Step 1: Update AuthContext

In `src/context/AuthContext.tsx`, change:
```typescript
const USE_FAKE_AUTH = false; // Set to false for real backend
```

### Step 2: Update Profile Hook

In `src/hooks/useProfile.ts`, change:
```typescript
const USE_FAKE_PROFILE = false; // Set to false for real backend
```

### Step 3: Enable Token Interceptor

In `src/services/api.ts`, uncomment the token interceptor code:
```typescript
// Remove the /* */ comment block around the token logic
```

### Step 4: Start Django Backend

1. Navigate to `investa_backend/`
2. Run: `python manage.py runserver 0.0.0.0:8000`
3. Ensure the server is accessible from your device/emulator

### Step 5: Update API Configuration

In `src/config/config.ts`, ensure the API base URL points to your Django server:
```typescript
// For Android emulator
return 'http://10.0.2.2:8000/api/';

// For iOS simulator
return 'http://127.0.0.1:8000/api/';

// For physical device (same network)
return 'http://192.168.31.67:8000/api/';
```

### Step 6: Create Test User

In your Django backend, run:
```bash
python manage.py shell
python create_test_user.py
```

## Troubleshooting

### Network Errors
- Ensure Django server is running on `0.0.0.0:8000` (not just 127.0.0.1)
- Check firewall settings
- Verify device/emulator can reach your computer's IP

### CORS Issues
- Django CORS settings are configured for development
- Check `investa_backend/investa_backend/settings.py` for CORS configuration

### Token Issues
- Clear AsyncStorage if switching between modes
- Check browser console for authentication errors

## Quick Switch Commands

### Enable Development Mode
```bash
# No backend required
# Just run your Expo app
```

### Enable Production Mode
```bash
cd investa_backend
python manage.py runserver 0.0.0.0:8000
# Then set USE_FAKE_AUTH = false in AuthContext
```
