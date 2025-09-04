"""
Utility to seed quizzes for every lesson across all courses.
Idempotent: it will not duplicate quizzes/questions/answers if they already exist.
"""

from typing import List, Tuple


def create_quiz_for_lesson(lesson) -> Tuple[object, bool]:
    from api.models import Quiz, Question, Answer

    quiz, created = Quiz.objects.get_or_create(
        lesson=lesson,
        title=f"Lesson Quiz: {lesson.title}",
        defaults={
            'description': f"Assess your understanding of '{lesson.title}'.",
            'time_limit': 10,
            'passing_score': 70,
            'is_active': True,
        },
    )

    # If this quiz has no questions, add a small default set
    if quiz.questions.count() == 0:
        questions = [
            {
                'question_text': f"What is the key concept covered in '{lesson.title}'?",
                'question_type': 'multiple_choice',
                'points': 2,
                'order': 1,
                'explanation': 'Checks your recall of the lesson\'s core idea.',
                'answers': [
                    ('The main concept explained in the lesson', True),
                    ('An unrelated topic', False),
                    ('Only advanced strategies', False),
                    ('Historical trivia', False),
                ],
            },
            {
                'question_text': f"True or False: {lesson.title} is relevant to investing.",
                'question_type': 'true_false',
                'points': 1,
                'order': 2,
                'explanation': 'Most lessons are designed to be relevant to investing basics.',
                'answers': [('True', True), ('False', False)],
            },
            {
                'question_text': 'Select the correct statement.',
                'question_type': 'multiple_choice',
                'points': 2,
                'order': 3,
                'explanation': 'Reinforces accurate understanding.',
                'answers': [
                    ('Risk and return are related; higher risk can imply higher potential returns.', True),
                    ('Diversification increases risk without benefits.', False),
                    ('Passing score has to be 100% to pass any quiz.', False),
                    ('Time limits are always required for quizzes.', False),
                ],
            },
        ]

        for qd in questions:
            answers_data = qd.pop('answers')
            q = Question.objects.create(quiz=quiz, **qd)
            for idx, (text, is_correct) in enumerate(answers_data, start=1):
                Answer.objects.create(
                    question=q,
                    answer_text=text,
                    is_correct=is_correct,
                    order=idx,
                )

    return quiz, created


def create_quizzes_for_all_lessons() -> List[object]:
    """Create (or ensure) one active quiz for each lesson in the database."""
    from api.models import Lesson

    quizzes = []
    lessons = Lesson.objects.select_related('course').all()
    print(f"🔍 Creating quizzes for {lessons.count()} lessons…")
    for lesson in lessons:
        quiz, created = create_quiz_for_lesson(lesson)
        quizzes.append(quiz)
        if created:
            print(f"✅ Created quiz for lesson: {lesson.course.title} → {lesson.title}")
        else:
            print(f"ℹ️ Quiz already exists for lesson: {lesson.course.title} → {lesson.title}")
    return quizzes


def run():
    """Entrypoint to be called from populate scripts or Django shell."""
    return create_quizzes_for_all_lessons()


