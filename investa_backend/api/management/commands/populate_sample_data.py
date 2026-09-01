from django.core.management.base import BaseCommand
from django.db import transaction


class Command(BaseCommand):
    help = "Populate the database with comprehensive sample data for development"

    def handle(self, *args, **options):
        from api.sample.user_sample_data import create_languages, create_users_and_profiles
        from api.sample.security_sample_data import create_security_settings, create_user_sessions
        from api.sample.privacy_sample_data import create_privacy_settings
        from api.sample.learning_sample_data import (
            create_courses, create_badges, create_learning_progress,
            create_user_lesson_progress, create_user_quiz_attempts
        )
        from api.sample.quizzes_sample_data import create_quizzes_for_all_lessons
        from api.sample.trading_sample_data import (
            create_stocks, create_stock_prices, create_stock_news,
            create_market_indices, create_market_data, create_technical_indicators,
            create_user_watchlists, create_portfolios, create_portfolio_holdings,
            create_orders_and_trades, create_trading_performance, create_trading_sessions,
            create_achievements
        )
        from api.sample.notifications_sample_data import create_notifications
        from api.sample.progress_sample_data import create_progress_sample_data

        self.stdout.write("Populating sample data...")

        with transaction.atomic():
            # 1. Users & Languages
            self.stdout.write("  Creating languages and users...")
            languages = create_languages()
            users = create_users_and_profiles(languages)

            # 2. Security & Privacy
            self.stdout.write("  Creating security and privacy settings...")
            create_security_settings(users)
            create_user_sessions(users)
            create_privacy_settings(users)

            # 3. Learning
            self.stdout.write("  Creating courses, badges, and learning progress...")
            courses = create_courses(languages)
            create_badges()
            create_learning_progress(users)

            # 4. Quizzes
            self.stdout.write("  Creating quizzes...")
            quizzes = create_quizzes_for_all_lessons()

            # 5. Lesson progress & quiz attempts
            self.stdout.write("  Creating lesson progress and quiz attempts...")
            from api.models import Lesson
            lessons = list(Lesson.objects.filter(is_active=True))
            create_user_lesson_progress(users, lessons)
            create_user_quiz_attempts(users, quizzes)

            # 6. Stocks & Trading
            self.stdout.write("  Creating stocks and market data...")
            stocks = create_stocks()
            create_stock_prices(stocks)
            create_stock_news(stocks)
            create_market_indices()
            create_market_data(stocks)
            create_technical_indicators(stocks)

            # 7. Portfolios & Trading
            self.stdout.write("  Creating portfolios and trading data...")
            create_user_watchlists(users, stocks)
            portfolios = create_portfolios(users)
            create_portfolio_holdings(portfolios, stocks)
            create_trading_performance(users)
            create_trading_sessions(users)
            create_orders_and_trades(users, stocks)

            # 8. Achievements
            self.stdout.write("  Creating achievements...")
            create_achievements()

            # 9. Notifications
            self.stdout.write("  Creating notifications...")
            create_notifications(users)

            # 10. Progress
            self.stdout.write("  Creating progress data...")
            create_progress_sample_data()

        self.stdout.write(self.style.SUCCESS("Sample data populated successfully"))
