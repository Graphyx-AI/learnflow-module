import { useState, useCallback } from 'react';
import { Screen, QuizResult, PlayerState } from './types';
import { SECTIONS, INITIAL_PLAYER } from './data';
import MapScreen from './MapScreen';
import LessonIntro from './LessonIntro';
import QuizScreen from './QuizScreen';
import VictoryScreen from './VictoryScreen';

/**
 * LearningModule — Gamified AI learning experience.
 * 
 * Usage in Next.js:
 * ```tsx
 * import LearningModule from '@/components/learning/LearningModule';
 * 
 * export default function LearnPage() {
 *   return <LearningModule />;
 * }
 * ```
 */
export default function LearningModule() {
  const [screen, setScreen] = useState<Screen>('map');
  const [player, setPlayer] = useState<PlayerState>({ ...INITIAL_PLAYER });
  const [selectedLesson, setSelectedLesson] = useState<{ sectionIdx: number; lessonIdx: number } | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleSelectLesson = useCallback((sectionIdx: number, lessonIdx: number) => {
    setSelectedLesson({ sectionIdx, lessonIdx });
    setScreen('intro');
  }, []);

  const handleStartQuiz = useCallback(() => {
    setScreen('quiz');
  }, []);

  const handleQuizComplete = useCallback((result: QuizResult) => {
    setQuizResult(result);
    setPlayer(prev => ({
      ...prev,
      xp: prev.xp + result.xpGained,
      currentXp: prev.currentXp + result.xpGained,
      completedLessons: selectedLesson
        ? [...prev.completedLessons, selectedLesson.lessonIdx]
        : prev.completedLessons,
    }));
    setScreen('victory');
  }, [selectedLesson]);

  const handleBackToMap = useCallback(() => {
    setScreen('map');
    setSelectedLesson(null);
    setQuizResult(null);
  }, []);

  const lesson = selectedLesson ? SECTIONS[selectedLesson.sectionIdx]?.lessons[selectedLesson.lessonIdx] : null;

  switch (screen) {
    case 'map':
      return <MapScreen sections={SECTIONS} player={player} onSelectLesson={handleSelectLesson} />;
    case 'intro':
      return lesson ? (
        <LessonIntro
          lesson={lesson}
          lessonNumber={(selectedLesson?.lessonIdx ?? 0) + 1}
          onStart={handleStartQuiz}
          onClose={handleBackToMap}
        />
      ) : null;
    case 'quiz':
      return lesson ? (
        <QuizScreen
          questions={lesson.questions}
          onComplete={handleQuizComplete}
          onQuit={handleBackToMap}
        />
      ) : null;
    case 'victory':
      return quizResult ? (
        <VictoryScreen
          result={quizResult}
          player={player}
          onContinue={handleBackToMap}
        />
      ) : null;
    default:
      return null;
  }
}
