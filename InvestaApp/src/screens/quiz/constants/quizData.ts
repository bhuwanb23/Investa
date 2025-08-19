export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  questions: number;
  timeLimit: number;
  difficulty: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  quizId: string;
}

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: '1',
    title: 'Stock Market Basics',
    description: 'Fundamental concepts and terminology',
    icon: 'business',
    color: '#10B981',
    bgColor: '#ECFDF5',
    questions: 10,
    timeLimit: 15,
    difficulty: 'Beginner',
  },
  {
    id: '2',
    title: 'Risk Management',
    description: 'Understanding financial risks',
    icon: 'shield-halved',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    questions: 10,
    timeLimit: 15,
    difficulty: 'Intermediate',
  },
  {
    id: '3',
    title: 'Trading Strategies',
    description: 'Market strategies & analysis',
    icon: 'chart-line',
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    questions: 10,
    timeLimit: 15,
    difficulty: 'Advanced',
  },
];

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  '1': [
    {
      id: 1,
      question: 'What is a stock?',
      options: [
        'A type of bond issued by companies',
        'A share of ownership in a company',
        'A government security',
        'A type of mutual fund',
      ],
      correctAnswer: 1,
      explanation: 'A stock represents a share of ownership in a company. When you buy a stock, you\'re purchasing a small piece of that company, called a share.',
    },
    {
      id: 2,
      question: 'What is the primary purpose of a stock exchange?',
      options: [
        'To provide loans to companies',
        'To facilitate buying and selling of securities',
        'To regulate company operations',
        'To provide insurance for investors',
      ],
      correctAnswer: 1,
      explanation: 'Stock exchanges provide a marketplace where buyers and sellers can trade securities like stocks, bonds, and other financial instruments.',
    },
    {
      id: 3,
      question: 'What does "bull market" refer to?',
      options: [
        'A market where prices are falling',
        'A market where prices are rising',
        'A market with high volatility',
        'A market with low trading volume',
      ],
      correctAnswer: 1,
      explanation: 'A bull market is characterized by rising stock prices and optimistic investor sentiment, typically lasting for an extended period.',
    },
    {
      id: 4,
      question: 'What is a dividend?',
      options: [
        'A fee paid to brokers',
        'A portion of company profits paid to shareholders',
        'A type of stock option',
        'A government tax on investments',
      ],
      correctAnswer: 1,
      explanation: 'A dividend is a distribution of profits by a corporation to its shareholders, usually paid in cash or additional shares.',
    },
    {
      id: 5,
      question: 'What is market capitalization?',
      options: [
        'The total number of shares outstanding',
        'The total value of a company\'s shares',
        'The price of a single share',
        'The annual revenue of a company',
      ],
      correctAnswer: 1,
      explanation: 'Market capitalization is calculated by multiplying the current share price by the total number of outstanding shares.',
    },
  ],
  '2': [
    {
      id: 1,
      question: 'What is diversification?',
      options: [
        'Investing all money in one stock',
        'Spreading investments across different assets',
        'Selling all investments at once',
        'Buying only government bonds',
      ],
      correctAnswer: 1,
      explanation: 'Diversification is a risk management strategy that involves spreading investments across different assets to reduce exposure to any single investment.',
    },
    {
      id: 2,
      question: 'What is a stop-loss order?',
      options: [
        'An order to buy at a specific price',
        'An order to sell when price drops to a certain level',
        'An order to hold a stock indefinitely',
        'An order to buy more shares',
      ],
      correctAnswer: 1,
      explanation: 'A stop-loss order is a type of order that automatically sells a security when it reaches a certain price, helping to limit potential losses.',
    },
  ],
  '3': [
    {
      id: 1,
      question: 'What is technical analysis?',
      options: [
        'Analyzing company financial statements',
        'Studying price patterns and market data',
        'Reading news articles about companies',
        'Following expert recommendations',
      ],
      correctAnswer: 1,
      explanation: 'Technical analysis involves studying price patterns, volume, and other market data to predict future price movements.',
    },
    {
      id: 2,
      question: 'What is a moving average?',
      options: [
        'The highest price a stock has reached',
        'The average price over a specific time period',
        'The lowest price a stock has reached',
        'The current market price',
      ],
      correctAnswer: 1,
      explanation: 'A moving average is a calculation that shows the average price of a security over a specific time period, helping to identify trends.',
    },
  ],
};

export const QUIZ_SETTINGS = {
  maxAttemptsPerDay: 5,
  timeLimitPerQuestion: 90, // seconds
  passingScore: 70,
  showExplanations: true,
  allowRetakes: true,
};

export const SCORE_MESSAGES = {
  excellent: 'Excellent! Outstanding performance!',
  great: 'Great job! You have solid knowledge!',
  good: 'Good work! Keep learning to improve!',
  needsImprovement: 'Keep practicing! Review the basics!',
  poor: 'Don\'t worry! Learning takes time!',
};

export const SCORE_COLORS = {
  excellent: '#10B981',
  great: '#3B82F6',
  good: '#F59E0B',
  needsImprovement: '#EF4444',
  poor: '#DC2626',
};

export const getScoreLevel = (score: number) => {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'great';
  if (score >= 70) return 'good';
  if (score >= 60) return 'needsImprovement';
  return 'poor';
};
