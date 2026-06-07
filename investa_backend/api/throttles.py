from rest_framework.throttling import AnonRateThrottle


class AuthAnonRateThrottle(AnonRateThrottle):
    """Strict rate limit for auth endpoints (login, register, password reset)."""
    scope = 'auth_anon'


class PingAnonRateThrottle(AnonRateThrottle):
    """Gentle rate limit for health-check endpoint."""
    scope = 'ping_anon'
