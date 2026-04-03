import { describe, it, expect } from 'vitest';
import type { PlayerState, Screen, QuizResult, Section, Question } from '../types';

describe('Type Contracts', () => {
  it('PlayerState has perfectLessons field', () => {
    const player: PlayerState = {
      xp: 0, streak: 0, level: 1, levelTitle: 'Test',
      currentXp: 0, nextLevelXp: 100, completedLessons: [],
      sectionProgress: {}, chestsOpened: {}, testsCompleted: {},
      perfectLessons: {},
    };
    expect(player.perfectLessons).toEqual({});
  });

  it('Screen type includes course-complete', () => {
    const screen: Screen = 'course-complete';
    expect(screen).toBe('course-complete');
  });

  it('QuizResult has all fields', () => {
    const result: QuizResult = { xpGained: 50, accuracy: 100, maxStreak: 5, totalQuestions: 8 };
    expect(result.accuracy).toBe(100);
  });

  it('Question has correct structure', () => {
    const q: Question = {
      icon: '🤖', category: 'Test', difficulty: 'Fácil',
      text: 'Test?', options: ['A', 'B', 'C', 'D'],
      correctIndex: 2, explanation: 'Because.',
    };
    expect(q.options).toHaveLength(4);
    expect(q.correctIndex).toBe(2);
  });
});
