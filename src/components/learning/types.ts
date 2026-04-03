export interface Question {
  icon: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  icon: string;
  title: string;
  description: string;
  topics: string[];
  questions: Question[];
}

export interface Section {
  id: string;
  label: string;
  title: string;
  lessons: Lesson[];
  unlocked: boolean;
}

export type NodeStatus = 'completed' | 'current' | 'locked';

export interface LessonNode {
  lessonIndex: number;
  icon: string;
  label: string;
  status: NodeStatus;
  alignment: 'center' | 'left' | 'right';
}

export interface PlayerState {
  xp: number;
  streak: number;
  level: number;
  levelTitle: string;
  currentXp: number;
  nextLevelXp: number;
  completedLessons: number[];
  /** Per-section completed lessons: { 'section-1': [0,1,2], 'section-2': [0] } */
  sectionProgress: Record<string, number[]>;
  /** Per-section chest opened */
  chestsOpened: Record<string, boolean>;
  /** Per-section test completed */
  testsCompleted: Record<string, boolean>;
}

export type Screen = 'map' | 'intro' | 'quiz' | 'victory' | 'profile' | 'missions' | 'ranking' | 'achievements' | 'chest' | 'finaltest' | 'finaltest-result' | 'league' | 'lightning' | 'course-complete';

export interface ChestReward {
  type: 'xp' | 'life' | 'achievement';
  amount?: number;
  achievementId?: string;
  label: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface QuizResult {
  xpGained: number;
  accuracy: number;
  maxStreak: number;
  totalQuestions: number;
}
