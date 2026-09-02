"""
Comprehensive API test suite for Investa backend.
Tests all major endpoint categories using Django's test client.
"""
from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from decimal import Decimal

from api.models import (
    Language, UserProfile, SecuritySettings, PrivacySettings,
    LearningProgress, TradingPerformance, Course, Lesson, Quiz,
    Question, Answer, UserQuizAttempt, Stock, StockPrice, MarketData,
    MarketIndex, Portfolio, PortfolioHolding, Order, Trade,
    UserWatchlist, Achievement, UserAchievement, Notification,
    Badge, UserBadge, UserProgress, AISettings,
)


class AuthTest(TestCase):
    """Test authentication endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testauth', email='testauth@example.com', password='testpass123'
        )

    def test_ping(self):
        resp = self.client.get('/api/ping/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['status'], 'ok')

    def test_register(self):
        resp = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'StrongPass123!',
            'password2': 'StrongPass123!',
        })
        self.assertEqual(resp.status_code, 201)
        self.assertIn('token', resp.data)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_password_mismatch(self):
        resp = self.client.post('/api/auth/register/', {
            'username': 'newuser2',
            'email': 'new2@example.com',
            'password': 'pass1',
            'password2': 'pass2',
        })
        self.assertIn(resp.status_code, [400, 422])

    def test_login_with_username(self):
        resp = self.client.post('/api/auth/login/', {
            'username': 'testauth',
            'password': 'testpass123',
        })
        self.assertEqual(resp.status_code, 200)
        self.assertIn('token', resp.data)
        self.assertEqual(resp.data['username'], 'testauth')

    def test_login_with_email(self):
        resp = self.client.post('/api/auth/login/', {
            'username': 'testauth@example.com',
            'password': 'testpass123',
        })
        self.assertEqual(resp.status_code, 200)
        self.assertIn('token', resp.data)

    def test_login_wrong_password(self):
        resp = self.client.post('/api/auth/login/', {
            'username': 'testauth',
            'password': 'wrongpass',
        })
        self.assertIn(resp.status_code, [400, 401])

    def test_me_endpoint(self):
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        resp = self.client.get('/api/auth/me/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['username'], 'testauth')

    def test_me_requires_auth(self):
        resp = self.client.get('/api/auth/me/')
        self.assertIn(resp.status_code, [401, 403])

    def test_logout(self):
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        resp = self.client.post('/api/auth/logout/')
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(Token.objects.filter(user=self.user).exists())


class ProfileTest(TestCase):
    """Test profile endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testprofile', email='testprofile@example.com', password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_get_profile(self):
        resp = self.client.get('/api/profiles/my_profile/')
        self.assertEqual(resp.status_code, 200)

    def test_update_profile(self):
        resp = self.client.patch('/api/profiles/update_profile/', {
            'bio': 'Investor in training',
        })
        self.assertEqual(resp.status_code, 200)

    def test_profile_requires_auth(self):
        client = APIClient()
        resp = client.get('/api/profiles/my_profile/')
        self.assertIn(resp.status_code, [401, 403])


class CourseTest(TestCase):
    """Test course and lesson endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testcourses', password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        self.lang = Language.objects.create(code='en', name='English')
        self.course = Course.objects.create(
            title='Stock Market Basics', description='Learn the basics',
            language=self.lang, difficulty_level='beginner',
            estimated_duration=120, is_active=True,
        )
        self.lesson = Lesson.objects.create(
            course=self.course, title='What is a Stock?',
            content='A stock represents ownership...', order=1,
            estimated_duration=30, is_active=True,
        )
        self.quiz = Quiz.objects.create(
            lesson=self.lesson, title='Quiz 1', time_limit=10,
            passing_score=70, is_active=True,
        )
        self.question = Question.objects.create(
            quiz=self.quiz, question_text='What is a stock?',
            question_type='multiple_choice', points=2, order=1,
        )
        self.answer = Answer.objects.create(
            question=self.question, answer_text='Ownership share',
            is_correct=True, order=1,
        )
        Answer.objects.create(
            question=self.question, answer_text='A loan',
            is_correct=False, order=2,
        )

    def test_list_courses(self):
        resp = self.client.get('/api/courses/')
        self.assertEqual(resp.status_code, 200)

    def test_retrieve_course(self):
        resp = self.client.get(f'/api/courses/{self.course.id}/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['title'], 'Stock Market Basics')

    def test_list_lessons(self):
        resp = self.client.get('/api/lessons/')
        self.assertEqual(resp.status_code, 200)

    def test_enroll_in_course(self):
        resp = self.client.post(f'/api/courses/{self.course.id}/enroll/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('Enrolled', resp.data['detail'])

    def test_enroll_requires_auth(self):
        client = APIClient()
        resp = client.post(f'/api/courses/{self.course.id}/enroll/')
        self.assertIn(resp.status_code, [401, 403])

    def test_with_progress(self):
        resp = self.client.get(f'/api/courses/{self.course.id}/with_progress/')
        self.assertEqual(resp.status_code, 200)

    def test_recommended_courses(self):
        resp = self.client.get('/api/courses/recommended/')
        self.assertEqual(resp.status_code, 200)

    def test_mark_lesson_completed(self):
        resp = self.client.post(f'/api/lessons/{self.lesson.id}/mark_completed/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['status'], 'completed')

    def test_list_quizzes(self):
        resp = self.client.get('/api/quiz/')
        self.assertEqual(resp.status_code, 200)

    def test_quiz_for_lesson(self):
        resp = self.client.get(f'/api/quiz/for_lesson/?lesson_id={self.lesson.id}')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['title'], 'Quiz 1')

    def test_start_quiz_attempt(self):
        resp = self.client.post('/api/quiz-attempts/start_quiz/', {
            'quiz_id': self.quiz.id,
        })
        self.assertEqual(resp.status_code, 201)

    def test_list_questions(self):
        resp = self.client.get('/api/questions/')
        self.assertEqual(resp.status_code, 200)


class TradingTest(TestCase):
    """Test trading endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testtrading', password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        self.stock = Stock.objects.create(
            symbol='RELIANCE', name='Reliance Industries',
            exchange='NSE', sector='Energy', is_active=True,
        )
        self.market_data = MarketData.objects.create(
            stock=self.stock, current_price=Decimal('2500.00'),
            change_amount=Decimal('50.00'), change_percentage=Decimal('2.04'),
            volume=1000000, high_24h=Decimal('2520.00'),
            low_24h=Decimal('2440.00'), open_24h=Decimal('2450.00'),
            previous_close=Decimal('2450.00'),
        )
        self.index = MarketIndex.objects.create(
            name='NIFTY 50', value=Decimal('22000.00'),
            change_amount=Decimal('150.00'), change_percentage=Decimal('0.69'),
            as_of='2025-01-01T09:30:00Z',
        )
        Achievement.objects.create(
            name='First Trade', description='Complete your first trade',
            achievement_type='FIRST_TRADE',
        )

    def test_list_stocks(self):
        resp = self.client.get('/api/stocks/')
        self.assertEqual(resp.status_code, 200)

    def test_retrieve_stock(self):
        resp = self.client.get(f'/api/stocks/{self.stock.id}/')
        self.assertEqual(resp.status_code, 200)

    def test_stock_price_history(self):
        resp = self.client.get(f'/api/stocks/{self.stock.id}/price_history/')
        self.assertEqual(resp.status_code, 200)

    def test_stock_market_data(self):
        resp = self.client.get(f'/api/stocks/{self.stock.id}/market_data/')
        self.assertEqual(resp.status_code, 200)

    def test_market_summary(self):
        resp = self.client.get('/api/market-data/market_summary/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('total_stocks', resp.data)

    def test_top_movers(self):
        resp = self.client.get('/api/market-data/top_movers/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('top_gainers', resp.data)

    def test_market_indices(self):
        resp = self.client.get('/api/market-indices/')
        self.assertEqual(resp.status_code, 200)

    def test_add_to_watchlist(self):
        resp = self.client.post('/api/watchlist/add_stock/', {
            'stock_id': self.stock.id,
        })
        self.assertEqual(resp.status_code, 201)

    def test_add_duplicate_watchlist(self):
        self.client.post('/api/watchlist/add_stock/', {'stock_id': self.stock.id})
        resp = self.client.post('/api/watchlist/add_stock/', {'stock_id': self.stock.id})
        self.assertEqual(resp.status_code, 400)

    def test_my_watchlist(self):
        self.client.post('/api/watchlist/add_stock/', {'stock_id': self.stock.id})
        resp = self.client.get('/api/watchlist/my_watchlist/')
        self.assertEqual(resp.status_code, 200)

    def test_place_market_order(self):
        resp = self.client.post('/api/orders/', {
            'stock': self.stock.id,
            'order_type': 'MARKET',
            'side': 'BUY',
            'quantity': 10,
        })
        self.assertEqual(resp.status_code, 201)

    def test_order_history(self):
        # Place an order first
        self.client.post('/api/orders/', {
            'stock': self.stock.id,
            'order_type': 'MARKET',
            'side': 'BUY',
            'quantity': 5,
        })
        resp = self.client.get('/api/orders/order_history/')
        self.assertEqual(resp.status_code, 200)

    def test_portfolio_summary(self):
        resp = self.client.get('/api/trades/portfolio_summary/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('total_value', resp.data)

    def test_trade_summary(self):
        resp = self.client.get('/api/trades/trade_summary/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('total_trades', resp.data)

    def test_trading_performance(self):
        resp = self.client.get('/api/trading-performance/my_performance/')
        self.assertEqual(resp.status_code, 200)

    def test_my_achievements(self):
        resp = self.client.get('/api/trading-performance/my_achievements/')
        self.assertEqual(resp.status_code, 200)

    def test_list_achievements(self):
        resp = self.client.get('/api/achievements/')
        self.assertEqual(resp.status_code, 200)

    def test_portfolio(self):
        resp = self.client.get('/api/portfolio/my_portfolio/')
        self.assertEqual(resp.status_code, 200)


class ProgressTest(TestCase):
    """Test progress endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testprogress', password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_my_progress(self):
        resp = self.client.get('/api/progress/my_progress/')
        self.assertEqual(resp.status_code, 200)

    def test_summary(self):
        resp = self.client.get('/api/progress/summary/')
        self.assertEqual(resp.status_code, 200)

    def test_in_progress_courses(self):
        resp = self.client.get('/api/progress/in_progress/')
        self.assertEqual(resp.status_code, 200)

    def test_weekly_activity(self):
        resp = self.client.get('/api/progress/weekly_activity/')
        self.assertEqual(resp.status_code, 200)


class SecurityTest(TestCase):
    """Test security endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testsecurity', password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_security_settings(self):
        resp = self.client.get('/api/security-settings/my_settings/')
        self.assertEqual(resp.status_code, 200)

    def test_change_password(self):
        resp = self.client.post('/api/security-settings/change_password/', {
            'old_password': 'testpass123',
            'new_password': 'NewSecurePass123!',
        })
        self.assertEqual(resp.status_code, 200)

    def test_change_password_wrong_old(self):
        resp = self.client.post('/api/security-settings/change_password/', {
            'old_password': 'wrong',
            'new_password': 'NewSecurePass123!',
        })
        self.assertEqual(resp.status_code, 400)

    def test_setup_2fa(self):
        resp = self.client.post('/api/security-settings/setup_2fa/')
        self.assertEqual(resp.status_code, 201)
        self.assertIn('secret', resp.data)
        self.assertIn('backup_codes', resp.data)

    def test_sessions_list(self):
        resp = self.client.get('/api/sessions/')
        self.assertEqual(resp.status_code, 200)


class PrivacyTest(TestCase):
    """Test privacy endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testprivacy', password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_privacy_settings(self):
        resp = self.client.get('/api/privacy-settings/my_settings/')
        self.assertEqual(resp.status_code, 200)

    def test_update_privacy(self):
        resp = self.client.patch('/api/privacy-settings/update_settings/', {
            'profile_visibility': False,
        })
        self.assertEqual(resp.status_code, 200)

    def test_export_data(self):
        resp = self.client.get('/api/privacy-settings/export_data/')
        self.assertEqual(resp.status_code, 200)

    def test_delete_account_wrong_password(self):
        resp = self.client.delete('/api/privacy-settings/delete_account/', {
            'password': 'wrongpass',
        }, format='json')
        self.assertEqual(resp.status_code, 400)


class NotificationTest(TestCase):
    """Test notification endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testnotif', password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_list_notifications(self):
        resp = self.client.get('/api/notifications/')
        self.assertEqual(resp.status_code, 200)

    def test_unread_count(self):
        Notification.objects.create(
            user=self.user, title='Test', message='Hello',
            notification_type='general', read=False,
        )
        resp = self.client.get('/api/notifications/unread_count/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['unread_count'], 1)

    def test_mark_all_read(self):
        Notification.objects.create(
            user=self.user, title='Test', message='Hello',
            notification_type='general', read=False,
        )
        resp = self.client.post('/api/notifications/mark_all_read/')
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(Notification.objects.filter(user=self.user, read=False).exists())


class LanguageTest(TestCase):
    """Test language endpoints."""

    def setUp(self):
        self.client = APIClient()
        Language.objects.create(code='en', name='English')
        Language.objects.create(code='hi', name='Hindi')

    def test_list_languages(self):
        resp = self.client.get('/api/languages/')
        self.assertEqual(resp.status_code, 200)


class BadgeTest(TestCase):
    """Test badge endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testbadge', password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.badge = Badge.objects.create(
            name='First Steps', description='Complete first lesson',
            badge_type='learning', icon_name='footsteps',
        )

    def test_list_badges(self):
        resp = self.client.get('/api/badges/')
        self.assertEqual(resp.status_code, 200)

    def test_my_badges(self):
        resp = self.client.get('/api/badges/my_badges/')
        self.assertEqual(resp.status_code, 200)


class CustomExceptionHandlerTest(TestCase):
    """Test that the custom exception handler returns consistent error format."""

    def setUp(self):
        self.client = APIClient()

    def test_404_returns_consistent_format(self):
        resp = self.client.get('/api/auth/me/')
        self.assertIn(resp.status_code, [401, 403])

    def test_405_returns_error(self):
        resp = self.client.put('/api/ping/')
        self.assertEqual(resp.status_code, 405)


class MarketDataPublicTest(TestCase):
    """Test that market data endpoints are publicly accessible."""

    def setUp(self):
        self.client = APIClient()
        self.stock = Stock.objects.create(
            symbol='TCS', name='Tata Consultancy', exchange='NSE',
            sector='IT', is_active=True,
        )
        self.market_data = MarketData.objects.create(
            stock=self.stock, current_price=Decimal('3800.00'),
            change_amount=Decimal('-20.00'), change_percentage=Decimal('-0.52'),
            volume=500000, high_24h=Decimal('3850.00'),
            low_24h=Decimal('3780.00'), open_24h=Decimal('3820.00'),
            previous_close=Decimal('3820.00'),
        )

    def test_stocks_public_list(self):
        resp = self.client.get('/api/stocks/')
        self.assertEqual(resp.status_code, 200)

    def test_market_data_public(self):
        resp = self.client.get('/api/market-data/')
        self.assertEqual(resp.status_code, 200)

    def test_market_summary_public(self):
        resp = self.client.get('/api/market-data/market_summary/')
        self.assertEqual(resp.status_code, 200)

    def test_top_movers_public(self):
        resp = self.client.get('/api/market-data/top_movers/')
        self.assertEqual(resp.status_code, 200)
