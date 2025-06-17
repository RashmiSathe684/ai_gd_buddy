// Application constants
export const APP_NAME = 'AI GD Helper Buddy';

// Session durations (in seconds)
export const SESSION_DURATIONS = {
  SHORT: 300,   // 5 minutes
  MEDIUM: 600,  // 10 minutes
  LONG: 900     // 15 minutes
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate', 
  ADVANCED: 'Advanced'
};

// Score thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 80,
  AVERAGE: 70,
  NEEDS_IMPROVEMENT: 60
};

// Colors for different score ranges
export const SCORE_COLORS = {
  EXCELLENT: 'green',
  GOOD: 'blue', 
  AVERAGE: 'yellow',
  NEEDS_IMPROVEMENT: 'red'
};

// Topic categories
export const TOPIC_CATEGORIES = [
  'Technology',
  'Society', 
  'Health',
  'Business',
  'Politics',
  'Environment',
  'Education',
  'Ethics'
];

// Skills evaluated during GD sessions
export const EVALUATION_SKILLS = [
  'Communication',
  'Critical Thinking',
  'Leadership',
  'Active Listening',
  'Confidence',
  'Knowledge',
  'Persuasion',
  'Time Management'
];

// Default user preferences
export const DEFAULT_PREFERENCES = {
  sessionDuration: SESSION_DURATIONS.MEDIUM,
  difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
  voiceEnabled: true,
  realTimeFeedback: true
};