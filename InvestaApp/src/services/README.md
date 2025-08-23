# API Integration Documentation

This directory contains the API integration layer for the Investa app, providing a clean and organized way to interact with the backend services.

## Structure

```
services/
├── api.ts                 # Base API configuration and error handling
├── authApi.ts            # Authentication-related API calls
├── profileApi.ts         # User profile-related API calls
├── notificationsApi.ts   # Notifications-related API calls
├── index.ts              # Centralized exports
└── README.md             # This documentation
```

## Base API Configuration (`api.ts`)

The base API service provides:
- Axios instance with proper configuration
- Request/response interceptors for authentication
- Centralized error handling
- Type definitions for API responses

### Features:
- Automatic token injection from AsyncStorage
- Automatic logout on 401 errors
- Comprehensive error handling with user-friendly messages
- TypeScript support with proper typing

## API Services

### Authentication API (`authApi.ts`)
Handles all authentication-related operations:
- Login
- Registration
- Password reset
- Password change
- User info retrieval

### Profile API (`profileApi.ts`)
Manages user profile operations:
- Get user profile
- Update profile
- Complete profile setup
- Avatar upload
- Language preferences

### Notifications API (`notificationsApi.ts`)
Handles notification operations:
- Get user notifications
- Mark notifications as read
- Get unread count

## Custom Hooks

The hooks directory contains React hooks that wrap the API services with state management:

### `useProfile()`
Provides profile management with loading states, error handling, and automatic data fetching.

### `useAuthApi()`
Provides authentication operations with proper error handling and user feedback.

### `useNotifications()`
Manages notifications with real-time updates and state synchronization.

## Usage Examples

### Using API Services Directly

```typescript
import { profileApi } from '../services';

// Get user profile
const profile = await profileApi.getMyProfile();

// Update profile
await profileApi.updateProfile({
  phone_number: '+1234567890',
  learning_goal: 'Advanced Trading'
});
```

### Using Custom Hooks

```typescript
import { useProfile } from '../hooks';

const MyComponent = () => {
  const { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile 
  } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const success = await updateProfile({
      phone_number: '+1234567890'
    });
    if (success) {
      console.log('Profile updated successfully');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ProfileDisplay profile={profile} />;
};
```

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors

Errors are automatically converted to user-friendly messages and can be handled at the component level.

## Authentication Flow

1. User logs in via `authApi.login()`
2. Token is stored in AsyncStorage
3. All subsequent requests automatically include the token
4. On 401 errors, user is automatically logged out
5. Token is cleared from storage and app state

## Type Safety

All API services are fully typed with TypeScript:
- Request/response types
- Error types
- Hook return types

This ensures compile-time safety and better developer experience.

## Configuration

API configuration is handled in `config/config.ts`:
- Base URL resolution for different environments
- Timeout settings
- Feature flags

The system automatically detects the development environment and configures the appropriate backend URL.
