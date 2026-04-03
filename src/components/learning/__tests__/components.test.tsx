import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VictoryScreen from '../VictoryScreen';
import LessonIntro from '../LessonIntro';
import { FinalTestResultScreen } from '../FinalTestScreen';
import CourseCompletionScreen from '../CourseCompletionScreen';
import type { QuizResult, PlayerState, Lesson } from '../types';

// Mock sounds
vi.mock('../sounds', () => ({
  playVictorySound: vi.fn(),
  playCorrectSound: vi.fn(),
  playWrongSound: vi.fn(),
  playSelectSound: vi.fn(),
  isSoundEnabled: () => false,
  setSoundEnabled: vi.fn(),
}));

const mockPlayer: PlayerState = {
  xp: 500, streak: 3, level: 5, levelTitle: 'Explorer',
  currentXp: 200, nextLevelXp: 500, completedLessons: [0, 1],
  sectionProgress: { 'section-1': [0, 1] },
  chestsOpened: {}, testsCompleted: {},
  perfectLessons: { 'section-1': [0] },
};

const mockResult: QuizResult = {
  xpGained: 80, accuracy: 100, maxStreak: 8, totalQuestions: 8,
};

const mockLesson: Lesson = {
  icon: '⭐', title: 'Test Lesson', description: 'A test lesson.',
  topics: ['Topic 1', 'Topic 2'],
  questions: [
    { icon: '🤖', category: 'Test', difficulty: 'Fácil', text: 'Q?', options: ['A', 'B', 'C', 'D'], correctIndex: 1, explanation: 'B.' },
  ],
};

describe('VictoryScreen', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.runOnlyPendingTimers(); vi.useRealTimers(); });
  it('renders with result data', () => {
    render(<VictoryScreen result={mockResult} player={mockPlayer} onContinue={vi.fn()} />);
    expect(screen.getByText('Lição concluída!')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument(); // XP
    expect(screen.getByText('100%')).toBeInTheDocument(); // Accuracy
    expect(screen.getByText('8')).toBeInTheDocument(); // Streak
  });

  it('calls onContinue when button clicked', () => {
    const onContinue = vi.fn();
    render(<VictoryScreen result={mockResult} player={mockPlayer} onContinue={onContinue} />);
    fireEvent.click(screen.getByText('Continuar →'));
    expect(onContinue).toHaveBeenCalledOnce();
  });
});

describe('LessonIntro', () => {
  it('renders lesson info', () => {
    render(<LessonIntro lesson={mockLesson} lessonNumber={1} onStart={vi.fn()} onClose={vi.fn()} />);
    // Title is split: "Lição 1 — Test Lesson"
    expect(screen.getByText(/Test Lesson/)).toBeInTheDocument();
    expect(screen.getByText('A test lesson.')).toBeInTheDocument();
  });

  it('calls onStart when start button is clicked', () => {
    const onStart = vi.fn();
    render(<LessonIntro lesson={mockLesson} lessonNumber={1} onStart={onStart} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText(/COMEÇAR/i));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('calls onClose when back button is clicked', () => {
    const onClose = vi.fn();
    render(<LessonIntro lesson={mockLesson} lessonNumber={1} onStart={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText(/Agora não/i));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('FinalTestResultScreen', () => {
  it('shows pass message when passed', () => {
    render(<FinalTestResultScreen score={8} total={10} passed={true} xpGained={320} onClose={vi.fn()} />);
    expect(screen.getByText(/Parabéns/i)).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('8/10 questões corretas')).toBeInTheDocument();
  });

  it('shows fail message when not passed', () => {
    render(<FinalTestResultScreen score={4} total={10} passed={false} xpGained={80} onClose={vi.fn()} />);
    expect(screen.getByText(/Não foi dessa vez/i)).toBeInTheDocument();
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
  });

  it('calls onClose', () => {
    const onClose = vi.fn();
    render(<FinalTestResultScreen score={8} total={10} passed={true} xpGained={320} onClose={onClose} />);
    fireEvent.click(screen.getByText('Voltar ao Mapa'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('CourseCompletionScreen', () => {
  it('renders completion message', () => {
    render(<CourseCompletionScreen player={mockPlayer} playerName="João" onRestart={vi.fn()} />);
    expect(screen.getByText('TRILHA CONCLUÍDA!')).toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText(/Trilha Skills AI/i)).toBeInTheDocument();
  });

  it('calls onRestart when restart button is clicked', () => {
    const onRestart = vi.fn();
    render(<CourseCompletionScreen player={mockPlayer} playerName="João" onRestart={onRestart} />);
    fireEvent.click(screen.getByText(/Recomeçar/i));
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it('shows player XP in stats', () => {
    render(<CourseCompletionScreen player={mockPlayer} playerName="João" onRestart={vi.fn()} />);
    expect(screen.getByText('500')).toBeInTheDocument(); // XP
    expect(screen.getByText('10/10')).toBeInTheDocument(); // Sections
  });
});
