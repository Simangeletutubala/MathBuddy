export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum Operation {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  ROUNDING = 'ROUNDING',
  PLACE_VALUE = 'PLACE_VALUE',
  FRACTIONS = 'FRACTIONS',
  NUMBER_SENTENCES = 'NUMBER_SENTENCES',
  PATTERNS = 'PATTERNS',
  SHAPES_2D = 'SHAPES_2D',
  OBJECTS_3D = 'OBJECTS_3D',
  DATA_HANDLING = 'DATA_HANDLING',
  MEASUREMENT = 'MEASUREMENT',
  TIME = 'TIME',
  PERIMETER_AREA = 'PERIMETER_AREA',
  PROBABILITY = 'PROBABILITY',
  MULTIPLICATION_TABLE = 'MULTIPLICATION_TABLE',
}

export interface Question {
  id: string;
  text: string;
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  explanation: string[];
  isRealLife?: boolean;
  category?: 'money' | 'time' | 'sharing' | 'general';
}

export interface StudentProfile {
  name: string;
  avatar: string;
  stars: number;
  streak: number;
  bestStreak: number;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  badges: string[];
  weakAreas: { [key in Operation]: number };
  lastPlayedDate?: string;
  lastDailyChallengeDate?: string;
  dailyChallengeStreak: number;
  unlockedAvatars: string[];
  parentPassword?: string;
  enabledOperations: Operation[];
}

export interface SessionState {
  correctInARow: number;
  wrongInARow: number;
}
