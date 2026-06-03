export const DIFFICULTY_LABELS: Record<'beginner'|'intermediate'|'advanced', string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const DIFFICULTY_COLORS: Record<'beginner'|'intermediate'|'advanced', string> = {
  beginner: '#10B981',
  intermediate: '#3B82F6',
  advanced: '#8B5CF6',
};

export const PAGE_BG = '#F9FAFB';
export const CARD_BG = '#FFFFFF';
export const TEXT_DARK = '#111827';
export const TEXT_MUTED = '#6B7280';
export const BORDER = '#E5E7EB';
export const PRIMARY = '#4F46E5';

// Quiz Questions Sample Data
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary purpose of a function in programming?",
    options: [
      "To make code look organized",
      "To reuse code and perform specific tasks",
      "To slow down program execution",
      "To create random numbers"
    ],
    correctAnswer: 1,
    explanation: "Functions are designed to reuse code and perform specific tasks, making programs more modular and efficient."
  },
  {
    id: 2,
    question: "Which of the following is NOT a valid variable naming convention?",
    options: [
      "camelCase",
      "snake_case",
      "PascalCase",
      "kebab-case"
    ],
    correctAnswer: 3,
    explanation: "kebab-case is not a valid variable naming convention in most programming languages. Valid conventions include camelCase, snake_case, and PascalCase."
  },
  {
    id: 3,
    question: "What does the 'return' statement do in a function?",
    options: [
      "Stops the function execution",
      "Sends a value back to the calling code",
      "Prints output to the console",
      "Creates a new variable"
    ],
    correctAnswer: 1,
    explanation: "The return statement sends a value back to the calling code and can also stop the function execution."
  },
  {
    id: 4,
    question: "Which data type is used to store whole numbers?",
    options: [
      "String",
      "Boolean",
      "Integer",
      "Float"
    ],
    correctAnswer: 2,
    explanation: "Integer is the data type used to store whole numbers without decimal points."
  },
  {
    id: 5,
    question: "What is the purpose of comments in code?",
    options: [
      "To make the code run faster",
      "To explain what the code does",
      "To create variables",
      "To connect to databases"
    ],
    correctAnswer: 1,
    explanation: "Comments are used to explain what the code does, making it more readable and maintainable for other developers."
  }
];



