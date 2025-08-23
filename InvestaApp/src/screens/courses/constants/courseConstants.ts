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

// Video Sample Data
export const VIDEO_DATA = {
  title: "Introduction to Functions in Programming",
  description: "Learn the fundamentals of functions, their purpose, and how to create and use them effectively in your code.",
  duration: "15:30",
  thumbnail: "https://example.com/thumbnail.jpg",
  transcript: [
    { time: "0:00", text: "Welcome to our lesson on functions in programming." },
    { time: "0:15", text: "Functions are one of the most important concepts you'll learn." },
    { time: "0:30", text: "They allow you to write reusable code that can be called multiple times." },
    { time: "1:00", text: "Let's start by understanding what a function is and why we use them." },
    { time: "1:30", text: "A function is a block of code that performs a specific task." },
    { time: "2:00", text: "Think of it as a recipe - you give it ingredients (parameters) and it gives you back a result." },
    { time: "3:00", text: "Here's a simple example of how to define a function." },
    { time: "4:00", text: "Notice how we use the 'function' keyword followed by a name." },
    { time: "5:00", text: "The function body contains the code that will be executed." },
    { time: "6:00", text: "To call a function, we simply write its name followed by parentheses." },
    { time: "7:00", text: "Functions can also accept parameters to make them more flexible." },
    { time: "8:00", text: "Parameters are like variables that get their values when the function is called." },
    { time: "9:00", text: "The return statement sends a value back to the calling code." },
    { time: "10:00", text: "Without a return statement, functions return undefined by default." },
    { time: "11:00", text: "Let's look at some practical examples of functions in action." },
    { time: "12:00", text: "This function calculates the area of a rectangle." },
    { time: "13:00", text: "And this one converts temperature from Celsius to Fahrenheit." },
    { time: "14:00", text: "Functions make your code more organized and easier to maintain." },
    { time: "15:00", text: "Practice writing functions to become more comfortable with them." },
    { time: "15:30", text: "That's it for this lesson! Thanks for watching." }
  ],
  captions: [
    { time: "0:00", text: "Welcome to our lesson on functions in programming." },
    { time: "0:15", text: "Functions are one of the most important concepts you'll learn." },
    { time: "0:30", text: "They allow you to write reusable code that can be called multiple times." },
    { time: "1:00", text: "Let's start by understanding what a function is and why we use them." },
    { time: "1:30", text: "A function is a block of code that performs a specific task." },
    { time: "2:00", text: "Think of it as a recipe - you give it ingredients (parameters) and it gives you back a result." },
    { time: "3:00", text: "Here's a simple example of how to define a function." },
    { time: "4:00", text: "Notice how we use the 'function' keyword followed by a name." },
    { time: "5:00", text: "The function body contains the code that will be executed." },
    { time: "6:00", text: "To call a function, we simply write its name followed by parentheses." },
    { time: "7:00", text: "Functions can also accept parameters to make them more flexible." },
    { time: "8:00", text: "Parameters are like variables that get their values when the function is called." },
    { time: "9:00", text: "The return statement sends a value back to the calling code." },
    { time: "10:00", text: "Without a return statement, functions return undefined by default." },
    { time: "11:00", text: "Let's look at some practical examples of functions in action." },
    { time: "12:00", text: "This function calculates the area of a rectangle." },
    { time: "13:00", text: "And this one converts temperature from Celsius to Fahrenheit." },
    { time: "14:00", text: "Functions make your code more organized and easier to maintain." },
    { time: "15:00", text: "Practice writing functions to become more comfortable with them." },
    { time: "15:30", text: "That's it for this lesson! Thanks for watching." }
  ]
};


