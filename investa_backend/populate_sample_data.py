#!/usr/bin/env python
"""
Script to populate the Investa backend with sample data
Run this script after setting up the Django environment
"""

import os
import sys
import django
from datetime import date, timedelta

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investa_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import (
    Language, UserProfile, Course, Lesson, UserLessonProgress,
    Quiz, Question, Answer
)

def reset_data():
    """Wipe existing app data in a safe order"""
    print("\n🧹 Resetting existing data...")
    # Delete dependent data first
    from django.db import transaction
    from django.contrib.auth.models import User
    with transaction.atomic():
        # Quiz related
        Answer.objects.all().delete()
        Question.objects.all().delete()
        Quiz.objects.all().delete()
        # Learning progress
        UserLessonProgress.objects.all().delete()
        Lesson.objects.all().delete()
        Course.objects.all().delete()
        # Keep users and languages to avoid breaking auth; languages will be recreated if missing
    print("✅ Data reset completed.")


def create_sample_data():
    """Create sample data for the Investa platform"""
    print("🚀 Creating sample data for Investa...")
    
    # Create languages
    languages = []
    language_data = [
        {'code': 'en', 'name': 'English', 'native_name': 'English'},
        {'code': 'hi', 'name': 'Hindi', 'native_name': 'हिन्दी'},
        {'code': 'ta', 'name': 'Tamil', 'native_name': 'தமிழ்'},
        {'code': 'te', 'name': 'Telugu', 'native_name': 'తెలుగు'},
        {'code': 'bn', 'name': 'Bengali', 'native_name': 'বাংলা'},
    ]
    
    for lang_data in language_data:
        lang, created = Language.objects.get_or_create(
            code=lang_data['code'],
            defaults=lang_data
        )
        languages.append(lang)
        if created:
            print(f"✅ Created language: {lang.name}")
    
    # Create sample users
    users = []
    user_data = [
        {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
        {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
        {'username': 'mike_wilson', 'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Wilson'},
    ]
    
    for user_info in user_data:
        user, created = User.objects.get_or_create(
            username=user_info['username'],
            defaults={
                'email': user_info['email'],
                'first_name': user_info['first_name'],
                'last_name': user_info['last_name'],
                'password': 'testpass123'
            }
        )
        if created:
            user.set_password('testpass123')
            user.save()
            print(f"✅ Created user: {user.username}")
        
        # Create user profile
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'preferred_language': languages[0],  # English
                'risk_profile': 'moderate',
                'investment_experience': 'beginner',
                'phone_number': '+1234567890',
                'date_of_birth': date(1990, 1, 1)
            }
        )
        users.append(user)
    
    # Create sample courses
    courses = []
    course_data = [
        {
            'title': 'Stock Market Basics',
            'description': 'Learn the fundamentals of stock market investing, including how stocks work, market analysis, and basic trading strategies.',
            'language': languages[0],  # English
            'difficulty_level': 'beginner',
            'estimated_duration': 120
        },
        {
            'title': 'Portfolio Diversification',
            'description': 'Master the art of building a balanced portfolio that spreads risk across different asset classes and sectors.',
            'language': languages[0],  # English
            'difficulty_level': 'intermediate',
            'estimated_duration': 180
        },
        {
            'title': 'Risk Management',
            'description': 'Understand how to identify, assess, and manage investment risks to protect your capital.',
            'language': languages[0],  # English
            'difficulty_level': 'advanced',
            'estimated_duration': 240
        },
        {
            'title': 'Mutual Funds 101',
            'description': 'Learn about mutual funds, their types, benefits, and how to choose the right ones for your investment goals.',
            'language': languages[1],  # Hindi
            'difficulty_level': 'beginner',
            'estimated_duration': 90
        }
    ]
    
    for course_info in course_data:
        course, created = Course.objects.get_or_create(
            title=course_info['title'],
            defaults=course_info
        )
        courses.append(course)
        if created:
            print(f"✅ Created course: {course.title}")
    
    # Create sample lessons
    lessons = []
    
    # Stock Market Basics Course (15 lessons)
    stock_market_lessons = [
        {
            'course': courses[0],  # Stock Market Basics
            'title': 'Introduction to Stock Markets',
            'content': 'Welcome to the world of stock markets! In this lesson, you\'ll learn what stock markets are, why they exist, and how they function as the backbone of the global economy. We\'ll explore the history of stock markets and their role in modern finance.',
            'order': 1,
            'estimated_duration': 20
        },
        {
            'course': courses[0],
            'title': 'What are Stocks and Shares?',
            'content': 'Stocks represent ownership in a company. When you buy a stock, you become a shareholder and own a piece of that company. Learn about the different types of stocks, how they work, and what rights shareholders have.',
            'order': 2,
            'estimated_duration': 25
        },
        {
            'course': courses[0],
            'title': 'How Stock Markets Work',
            'content': 'Stock markets are places where buyers and sellers meet to trade stocks. They provide liquidity and price discovery. Understand the mechanics of trading, market makers, and how prices are determined.',
            'order': 3,
            'estimated_duration': 30
        },
        {
            'course': courses[0],
            'title': 'Types of Stocks: Common vs Preferred',
            'content': 'Learn about common stocks, preferred stocks, and different stock classifications. Understand the differences in voting rights, dividend payments, and risk levels between these stock types.',
            'order': 4,
            'estimated_duration': 22
        },
        {
            'course': courses[0],
            'title': 'Market Indices and Benchmarks',
            'content': 'Market indices like the S&P 500, Dow Jones, and NASDAQ track the performance of groups of stocks. Learn how indices work, what they represent, and how to use them as benchmarks.',
            'order': 5,
            'estimated_duration': 18
        },
        {
            'course': courses[0],
            'title': 'Bull vs Bear Markets',
            'content': 'Understand the difference between bull markets (rising) and bear markets (falling). Learn about market cycles, investor psychology, and how to identify market trends.',
            'order': 6,
            'estimated_duration': 20
        },
        {
            'course': courses[0],
            'title': 'Market Hours and Trading Sessions',
            'content': 'Stock markets have specific trading hours and sessions. Learn about pre-market, regular trading hours, after-hours trading, and how different time zones affect global markets.',
            'order': 7,
            'estimated_duration': 15
        },
        {
            'course': courses[0],
            'title': 'Stock Exchanges Around the World',
            'content': 'Explore major stock exchanges like NYSE, NASDAQ, London Stock Exchange, Tokyo Stock Exchange, and others. Understand how global markets are interconnected.',
            'order': 8,
            'estimated_duration': 25
        },
        {
            'course': courses[0],
            'title': 'Market Participants: Who Trades Stocks?',
            'content': 'Learn about different types of market participants: individual investors, institutional investors, market makers, brokers, and algorithmic traders. Understand their roles and motivations.',
            'order': 9,
            'estimated_duration': 28
        },
        {
            'course': courses[0],
            'title': 'Order Types: Market, Limit, Stop Orders',
            'content': 'Master different order types: market orders, limit orders, stop orders, and stop-limit orders. Learn when and how to use each type effectively.',
            'order': 10,
            'estimated_duration': 30
        },
        {
            'course': courses[0],
            'title': 'Bid, Ask, and Spread',
            'content': 'Understand bid prices, ask prices, and the spread between them. Learn how spreads affect trading costs and what they tell you about market liquidity.',
            'order': 11,
            'estimated_duration': 20
        },
        {
            'course': courses[0],
            'title': 'Volume and Liquidity',
            'content': 'Trading volume and liquidity are crucial concepts. Learn how volume affects price movements, what high and low liquidity mean, and how to assess market activity.',
            'order': 12,
            'estimated_duration': 22
        },
        {
            'course': courses[0],
            'title': 'Market Volatility and Risk',
            'content': 'Volatility measures how much stock prices fluctuate. Learn about volatility indices, risk assessment, and how to manage volatility in your investment strategy.',
            'order': 13,
            'estimated_duration': 25
        },
        {
            'course': courses[0],
            'title': 'Market News and Information Sources',
            'content': 'Stay informed with reliable sources of market news and information. Learn about financial news outlets, company filings, earnings reports, and economic indicators.',
            'order': 14,
            'estimated_duration': 20
        },
        {
            'course': courses[0],
            'title': 'Getting Started: Your First Stock Purchase',
            'content': 'Practical guide to making your first stock purchase. Learn about choosing a broker, opening an account, placing your first order, and what to expect.',
            'order': 15,
            'estimated_duration': 35
        }
    ]
    
    # Portfolio Diversification Course (20 lessons)
    portfolio_lessons = [
        {
            'course': courses[1],  # Portfolio Diversification
            'title': 'Introduction to Portfolio Management',
            'content': 'Portfolio management is the art and science of making investment decisions. Learn the fundamental principles of building and managing an investment portfolio.',
            'order': 1,
            'estimated_duration': 25
        },
        {
            'course': courses[1],
            'title': 'Understanding Asset Classes',
            'content': 'Explore different asset classes: stocks, bonds, real estate, commodities, and cash. Understand their characteristics, risks, and potential returns.',
            'order': 2,
            'estimated_duration': 30
        },
        {
            'course': courses[1],
            'title': 'Asset Allocation Fundamentals',
            'content': 'Asset allocation is the process of dividing your investments among different asset classes. Learn how to create a balanced allocation based on your goals and risk tolerance.',
            'order': 3,
            'estimated_duration': 35
        },
        {
            'course': courses[1],
            'title': 'Risk and Return Relationship',
            'content': 'Understand the fundamental relationship between risk and return. Learn how higher potential returns typically come with higher risk, and how to find your optimal risk-return balance.',
            'order': 4,
            'estimated_duration': 28
        },
        {
            'course': courses[1],
            'title': 'Diversification Strategies',
            'content': 'Learn how to spread your investments across different sectors, industries, and geographic regions. Understand the benefits of diversification and how to implement it effectively.',
            'order': 5,
            'estimated_duration': 32
        },
        {
            'course': courses[1],
            'title': 'Sector Diversification',
            'content': 'Explore different market sectors: technology, healthcare, finance, consumer goods, energy, and more. Learn how sector diversification can reduce portfolio risk.',
            'order': 6,
            'estimated_duration': 25
        },
        {
            'course': courses[1],
            'title': 'Geographic Diversification',
            'content': 'Invest globally to reduce country-specific risks. Learn about developed markets, emerging markets, and how to allocate investments across different regions.',
            'order': 7,
            'estimated_duration': 30
        },
        {
            'course': courses[1],
            'title': 'Market Capitalization Diversification',
            'content': 'Understand large-cap, mid-cap, and small-cap stocks. Learn how market capitalization affects risk and return, and how to balance different cap sizes in your portfolio.',
            'order': 8,
            'estimated_duration': 22
        },
        {
            'course': courses[1],
            'title': 'Growth vs Value Investing',
            'content': 'Compare growth and value investing strategies. Learn how to identify growth stocks and value stocks, and how to combine both approaches in your portfolio.',
            'order': 9,
            'estimated_duration': 28
        },
        {
            'course': courses[1],
            'title': 'Bond Allocation and Types',
            'content': 'Bonds provide income and stability to portfolios. Learn about government bonds, corporate bonds, municipal bonds, and how to incorporate them into your allocation.',
            'order': 10,
            'estimated_duration': 35
        },
        {
            'course': courses[1],
            'title': 'Real Estate Investment Trusts (REITs)',
            'content': 'REITs offer exposure to real estate without buying property directly. Learn about different types of REITs, their benefits, and how to include them in your portfolio.',
            'order': 11,
            'estimated_duration': 25
        },
        {
            'course': courses[1],
            'title': 'Commodities and Alternative Investments',
            'content': 'Explore commodities like gold, oil, and agricultural products. Learn about alternative investments and how they can enhance portfolio diversification.',
            'order': 12,
            'estimated_duration': 30
        },
        {
            'course': courses[1],
            'title': 'International Stocks and ETFs',
            'content': 'International diversification through stocks and ETFs. Learn about currency risk, political risk, and how to invest in foreign markets effectively.',
            'order': 13,
            'estimated_duration': 28
        },
        {
            'course': courses[1],
            'title': 'Portfolio Rebalancing',
            'content': 'Regular rebalancing keeps your portfolio aligned with your goals. Learn when and how to rebalance, and strategies for maintaining your target allocation.',
            'order': 14,
            'estimated_duration': 25
        },
        {
            'course': courses[1],
            'title': 'Tax-Efficient Investing',
            'content': 'Minimize taxes on your investments. Learn about tax-advantaged accounts, tax-loss harvesting, and strategies for reducing your tax burden.',
            'order': 15,
            'estimated_duration': 30
        },
        {
            'course': courses[1],
            'title': 'Dollar-Cost Averaging',
            'content': 'Dollar-cost averaging reduces the impact of market volatility. Learn how to implement this strategy and its benefits for long-term investors.',
            'order': 16,
            'estimated_duration': 20
        },
        {
            'course': courses[1],
            'title': 'Portfolio Monitoring and Review',
            'content': 'Regular monitoring helps you stay on track. Learn what metrics to track, how often to review your portfolio, and when to make adjustments.',
            'order': 17,
            'estimated_duration': 25
        },
        {
            'course': courses[1],
            'title': 'Lifecycle Investing',
            'content': 'Adjust your portfolio as you age. Learn about target-date funds and how to modify your allocation based on your life stage and changing goals.',
            'order': 18,
            'estimated_duration': 28
        },
        {
            'course': courses[1],
            'title': 'Building a Core-Satellite Portfolio',
            'content': 'Combine index funds with active management. Learn how to build a core-satellite portfolio that balances low costs with potential outperformance.',
            'order': 19,
            'estimated_duration': 30
        },
        {
            'course': courses[1],
            'title': 'Portfolio Optimization Techniques',
            'content': 'Advanced techniques for optimizing your portfolio. Learn about modern portfolio theory, efficient frontiers, and mathematical approaches to allocation.',
            'order': 20,
            'estimated_duration': 35
        }
    ]
    
    # Risk Management Course (25 lessons)
    risk_management_lessons = [
        {
            'course': courses[2],  # Risk Management
            'title': 'Introduction to Investment Risk',
            'content': 'Risk is inherent in all investments. Learn to identify, understand, and manage different types of investment risks to protect your capital.',
            'order': 1,
            'estimated_duration': 30
        },
        {
            'course': courses[2],
            'title': 'Types of Investment Risk',
            'content': 'Explore market risk, credit risk, liquidity risk, inflation risk, and other types of investment risks. Understand how each affects your portfolio.',
            'order': 2,
            'estimated_duration': 35
        },
        {
            'course': courses[2],
            'title': 'Risk Tolerance Assessment',
            'content': 'Assess your personal risk tolerance. Learn about questionnaires, psychological factors, and how to determine the right level of risk for your situation.',
            'order': 3,
            'estimated_duration': 25
        },
        {
            'course': courses[2],
            'title': 'Risk Capacity vs Risk Tolerance',
            'content': 'Distinguish between risk capacity (ability to take risk) and risk tolerance (willingness to take risk). Learn how to balance both in your investment decisions.',
            'order': 4,
            'estimated_duration': 28
        },
        {
            'course': courses[2],
            'title': 'Volatility and Standard Deviation',
            'content': 'Understand volatility as a measure of risk. Learn about standard deviation, variance, and how to interpret these statistical measures.',
            'order': 5,
            'estimated_duration': 30
        },
        {
            'course': courses[2],
            'title': 'Beta and Systematic Risk',
            'content': 'Beta measures a stock\'s sensitivity to market movements. Learn how to use beta to assess systematic risk and compare investments.',
            'order': 6,
            'estimated_duration': 25
        },
        {
            'course': courses[2],
            'title': 'Value at Risk (VaR)',
            'content': 'Value at Risk estimates potential losses. Learn how to calculate and interpret VaR, and its limitations as a risk measure.',
            'order': 7,
            'estimated_duration': 35
        },
        {
            'course': courses[2],
            'title': 'Maximum Drawdown',
            'content': 'Maximum drawdown measures the largest peak-to-trough decline. Learn how to calculate and use this important risk metric.',
            'order': 8,
            'estimated_duration': 22
        },
        {
            'course': courses[2],
            'title': 'Sharpe Ratio and Risk-Adjusted Returns',
            'content': 'The Sharpe ratio measures risk-adjusted returns. Learn how to calculate and interpret this important performance metric.',
            'order': 9,
            'estimated_duration': 30
        },
        {
            'course': courses[2],
            'title': 'Correlation and Portfolio Risk',
            'content': 'Correlation affects portfolio diversification. Learn how correlation coefficients work and how to use them in portfolio construction.',
            'order': 10,
            'estimated_duration': 28
        },
        {
            'course': courses[2],
            'title': 'Concentration Risk',
            'content': 'Concentration risk comes from over-investing in single positions. Learn how to identify and manage concentration risk in your portfolio.',
            'order': 11,
            'estimated_duration': 25
        },
        {
            'course': courses[2],
            'title': 'Sector Concentration Risk',
            'content': 'Sector concentration can increase portfolio risk. Learn how to assess and manage sector exposure across your investments.',
            'order': 12,
            'estimated_duration': 20
        },
        {
            'course': courses[2],
            'title': 'Geographic Concentration Risk',
            'content': 'Geographic concentration exposes you to country-specific risks. Learn how to diversify across different regions and countries.',
            'order': 13,
            'estimated_duration': 25
        },
        {
            'course': courses[2],
            'title': 'Currency Risk Management',
            'content': 'Currency fluctuations affect international investments. Learn about currency risk and strategies to manage it effectively.',
            'order': 14,
            'estimated_duration': 30
        },
        {
            'course': courses[2],
            'title': 'Interest Rate Risk',
            'content': 'Interest rate changes affect bond prices and other investments. Learn how to measure and manage interest rate risk.',
            'order': 15,
            'estimated_duration': 28
        },
        {
            'course': courses[2],
            'title': 'Inflation Risk and Protection',
            'content': 'Inflation erodes purchasing power over time. Learn about inflation risk and strategies to protect your portfolio from inflation.',
            'order': 16,
            'estimated_duration': 25
        },
        {
            'course': courses[2],
            'title': 'Liquidity Risk Management',
            'content': 'Liquidity risk affects your ability to sell investments quickly. Learn how to assess and manage liquidity in your portfolio.',
            'order': 17,
            'estimated_duration': 22
        },
        {
            'course': courses[2],
            'title': 'Credit Risk Assessment',
            'content': 'Credit risk affects bond investments and other debt securities. Learn how to assess credit quality and manage credit risk.',
            'order': 18,
            'estimated_duration': 30
        },
        {
            'course': courses[2],
            'title': 'Political and Regulatory Risk',
            'content': 'Political and regulatory changes can affect investments. Learn how to identify and manage these types of risks.',
            'order': 19,
            'estimated_duration': 25
        },
        {
            'course': courses[2],
            'title': 'Environmental, Social, and Governance (ESG) Risk',
            'content': 'ESG factors can affect investment risk and returns. Learn how to incorporate ESG considerations into your risk management.',
            'order': 20,
            'estimated_duration': 28
        },
        {
            'course': courses[2],
            'title': 'Hedging Strategies',
            'content': 'Hedging can reduce portfolio risk. Learn about options, futures, and other hedging instruments and strategies.',
            'order': 21,
            'estimated_duration': 35
        },
        {
            'course': courses[2],
            'title': 'Stop-Loss Orders and Risk Control',
            'content': 'Stop-loss orders help limit potential losses. Learn how to use stop-losses effectively and other risk control techniques.',
            'order': 22,
            'estimated_duration': 25
        },
        {
            'course': courses[2],
            'title': 'Position Sizing and Risk Management',
            'content': 'Position sizing is crucial for risk management. Learn how to determine appropriate position sizes based on your risk tolerance.',
            'order': 23,
            'estimated_duration': 30
        },
        {
            'course': courses[2],
            'title': 'Stress Testing Your Portfolio',
            'content': 'Stress testing helps identify portfolio vulnerabilities. Learn how to conduct scenario analysis and stress tests.',
            'order': 24,
            'estimated_duration': 28
        },
        {
            'course': courses[2],
            'title': 'Building a Risk Management Plan',
            'content': 'Create a comprehensive risk management plan. Learn how to document your risk management approach and review it regularly.',
            'order': 25,
            'estimated_duration': 35
        }
    ]
    
    # Mutual Funds 101 Course (12 lessons)
    mutual_funds_lessons = [
        {
            'course': courses[3],  # Mutual Funds 101
            'title': 'Introduction to Mutual Funds',
            'content': 'Mutual funds pool money from many investors to invest in a diversified portfolio. Learn the basics of how mutual funds work and their benefits.',
            'order': 1,
            'estimated_duration': 25
        },
        {
            'course': courses[3],
            'title': 'Types of Mutual Funds',
            'content': 'Explore different types of mutual funds: equity funds, bond funds, money market funds, and balanced funds. Understand their characteristics and uses.',
            'order': 2,
            'estimated_duration': 30
        },
        {
            'course': courses[3],
            'title': 'Equity Mutual Funds',
            'content': 'Equity funds invest primarily in stocks. Learn about large-cap, mid-cap, small-cap, growth, value, and sector-specific equity funds.',
            'order': 3,
            'estimated_duration': 28
        },
        {
            'course': courses[3],
            'title': 'Bond Mutual Funds',
            'content': 'Bond funds invest in debt securities. Learn about government bond funds, corporate bond funds, and municipal bond funds.',
            'order': 4,
            'estimated_duration': 25
        },
        {
            'course': courses[3],
            'title': 'Index Funds vs Active Funds',
            'content': 'Compare index funds that track market benchmarks with actively managed funds. Understand the differences in costs, performance, and strategy.',
            'order': 5,
            'estimated_duration': 30
        },
        {
            'course': courses[3],
            'title': 'Fund Expenses and Fees',
            'content': 'Understand mutual fund expenses: expense ratios, loads, and other fees. Learn how fees affect your returns and how to minimize them.',
            'order': 6,
            'estimated_duration': 25
        },
        {
            'course': courses[3],
            'title': 'Net Asset Value (NAV)',
            'content': 'NAV represents the per-share value of a mutual fund. Learn how NAV is calculated and what it tells you about fund performance.',
            'order': 7,
            'estimated_duration': 20
        },
        {
            'course': courses[3],
            'title': 'Fund Performance Metrics',
            'content': 'Learn to evaluate mutual fund performance using metrics like total return, annualized return, and risk-adjusted measures.',
            'order': 8,
            'estimated_duration': 28
        },
        {
            'course': courses[3],
            'title': 'Fund Selection Criteria',
            'content': 'Develop criteria for selecting mutual funds. Consider factors like performance history, expense ratios, fund size, and manager tenure.',
            'order': 9,
            'estimated_duration': 30
        },
        {
            'course': courses[3],
            'title': 'Tax Considerations for Mutual Funds',
            'content': 'Understand the tax implications of mutual fund investing. Learn about capital gains distributions, dividend income, and tax-efficient fund selection.',
            'order': 10,
            'estimated_duration': 25
        },
        {
            'course': courses[3],
            'title': 'Building a Mutual Fund Portfolio',
            'content': 'Learn how to build a diversified portfolio using mutual funds. Consider asset allocation, fund selection, and portfolio rebalancing.',
            'order': 11,
            'estimated_duration': 35
        },
        {
            'course': courses[3],
            'title': 'Getting Started with Mutual Funds',
            'content': 'Practical guide to investing in mutual funds. Learn about account types, minimum investments, and how to make your first fund purchase.',
            'order': 12,
            'estimated_duration': 30
        }
    ]
    
    # Combine all lessons
    all_lesson_data = stock_market_lessons + portfolio_lessons + risk_management_lessons + mutual_funds_lessons
    
    for lesson_info in all_lesson_data:
        lesson, created = Lesson.objects.get_or_create(
            course=lesson_info['course'],
            title=lesson_info['title'],
            defaults=lesson_info
        )
        lessons.append(lesson)
        if created:
            print(f"✅ Created lesson: {lesson.title}")
    
    # Create sample learning progress
    if users and lessons:
        user = users[0]  # John Doe
        lesson = lessons[0]  # Introduction to Stock Markets
        
        progress, created = UserLessonProgress.objects.get_or_create(
            user=user,
            lesson=lesson,
            defaults={
                'status': 'completed',
                'progress': 100,
                'started_at': date.today() - timedelta(days=2),
                'completed_at': date.today() - timedelta(days=1)
            }
        )
        if created:
            print(f"✅ Created user progress for {user.username} on lesson: {lesson.title}")
    
    # Create sample quizzes: at least 2 per lesson
    quizzes_created = 0
    for lesson in lessons:  # Every lesson
        quiz_specs = [
            {
                'title': f'Quiz A: {lesson.title}',
                'description': f'Primary quiz for {lesson.title}',
                'time_limit': 10,
                'passing_score': 70,
            },
            {
                'title': f'Quiz B: {lesson.title}',
                'description': f'Secondary quiz for {lesson.title}',
                'time_limit': 8,
                'passing_score': 70,
            },
        ]

        for spec in quiz_specs:
            quiz, created = Quiz.objects.get_or_create(lesson=lesson, title=spec['title'], defaults=spec)
            if created:
                quizzes_created += 1
                print(f"✅ Created quiz: {quiz.title}")

                # Create questions for this quiz
                questions_data = [
                    {
                        'question_text': f'What is the main topic of {lesson.title}?',
                        'question_type': 'multiple_choice',
                        'points': 2,
                        'order': 1,
                        'explanation': 'This question tests your understanding of the lesson content.',
                        'answers': [
                            {'answer_text': 'The correct answer', 'is_correct': True, 'order': 1},
                            {'answer_text': 'An incorrect option', 'is_correct': False, 'order': 2},
                            {'answer_text': 'Another wrong choice', 'is_correct': False, 'order': 3},
                            {'answer_text': 'Not the right answer', 'is_correct': False, 'order': 4},
                        ]
                    },
                    {
                        'question_text': f'True or False: {lesson.title} is important for learning.',
                        'question_type': 'true_false',
                        'points': 1,
                        'order': 2,
                        'explanation': 'This lesson provides fundamental knowledge.',
                        'answers': [
                            {'answer_text': 'True', 'is_correct': True, 'order': 1},
                            {'answer_text': 'False', 'is_correct': False, 'order': 2},
                        ]
                    },
                    {
                        'question_text': f'Complete the sentence: {lesson.title} helps you understand...',
                        'question_type': 'fill_blank',
                        'points': 3,
                        'order': 3,
                        'explanation': 'This lesson provides comprehensive understanding.',
                        'answers': [
                            {'answer_text': 'investment concepts', 'is_correct': True, 'order': 1},
                            {'answer_text': 'market dynamics', 'is_correct': True, 'order': 2},
                            {'answer_text': 'financial planning', 'is_correct': True, 'order': 3},
                        ]
                    }
                ]

                for q_data in questions_data:
                    answers_data = q_data.pop('answers')
                    question, q_created = Question.objects.get_or_create(
                        quiz=quiz,
                        question_text=q_data['question_text'],
                        defaults=q_data
                    )
                    if q_created:
                        print(f"   ✅ Created question: {question.question_text[:50]}...")

                        # Create answers for this question
                        for a_data in answers_data:
                            answer, a_created = Answer.objects.get_or_create(
                                question=question,
                                answer_text=a_data['answer_text'],
                                defaults=a_data
                            )
                            if a_created:
                                print(f"      ✅ Created answer: {answer.answer_text[:30]}...")
    
    print("\n🎉 Sample data creation completed!")
    print(f"📊 Created {len(languages)} languages, {len(users)} users, {len(courses)} courses, {len(lessons)} lessons, {quizzes_created} quizzes")
    print(f"\n📚 Course Breakdown:")
    print(f"   • Stock Market Basics: 15 lessons")
    print(f"   • Portfolio Diversification: 20 lessons") 
    print(f"   • Risk Management: 25 lessons")
    print(f"   • Mutual Funds 101: 12 lessons")
    print(f"   • Total: 72 lessons across 4 courses")
    print(f"   • Quizzes: {quizzes_created} quizzes created")
    print(f"\n🔗 You can now:")
    print(f"   1. Visit http://localhost:8000/api/database/ to see all data")
    print(f"   2. Test the login with: john@example.com / testpass123")
    print(f"   3. Explore the database structure and sample records")
    print(f"   4. Test quiz functionality with lesson quizzes")

if __name__ == '__main__':
    reset_data()
    create_sample_data()
