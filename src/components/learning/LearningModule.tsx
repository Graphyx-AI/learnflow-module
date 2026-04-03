import { useState, useCallback } from 'react';
import { Screen, QuizResult, PlayerState } from './types';
import { SECTIONS, INITIAL_PLAYER } from './data';
import MapScreen from './MapScreen';
import LessonIntro from './LessonIntro';
import QuizScreen from './QuizScreen';
import VictoryScreen from './VictoryScreen';
import ProfileScreen from './ProfileScreen';
import RightSidebar from './RightSidebar';

export default function LearningModule() {
  const [screen, setScreen] = useState<Screen>('map');
  const [player, setPlayer] = useState<PlayerState>({ ...INITIAL_PLAYER });
  const [selectedLesson, setSelectedLesson] = useState<{ sectionIdx: number; lessonIdx: number } | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('selectedAvatar') || 'robot');

  const handleSelectAvatar = useCallback((id: string) => {
    setSelectedAvatar(id);
    localStorage.setItem('selectedAvatar', id);
  }, []);

  const handleSelectLesson = useCallback((sectionIdx: number, lessonIdx: number) => {
    setSelectedLesson({ sectionIdx, lessonIdx });
    setScreen('intro');
  }, []);

  const handleStartQuiz = useCallback(() => setScreen('quiz'), []);

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

  const handleOpenProfile = useCallback(() => setScreen('profile'), []);

  const handleNavigate = useCallback((tab: string) => {
    if (tab === 'map') setScreen('map');
    else if (tab === 'profile') setScreen('profile');
    // missions tab just highlights in sidebar
  }, []);

  const lesson = selectedLesson ? SECTIONS[selectedLesson.sectionIdx]?.lessons[selectedLesson.lessonIdx] : null;

  // Sidebar only shows on map and profile screens
  const showSidebar = screen === 'map' || screen === 'profile';
  const activeTab = screen === 'profile' ? 'profile' : 'map';

  const renderContent = () => {
    switch (screen) {
      case 'map':
        return <MapScreen sections={SECTIONS} player={player} onSelectLesson={handleSelectLesson} onOpenProfile={handleOpenProfile} selectedAvatar={selectedAvatar} />;
      case 'intro':
        return lesson ? <LessonIntro lesson={lesson} lessonNumber={(selectedLesson?.lessonIdx ?? 0) + 1} onStart={handleStartQuiz} onClose={handleBackToMap} /> : null;
      case 'quiz':
        return lesson ? <QuizScreen questions={lesson.questions} onComplete={handleQuizComplete} onQuit={handleBackToMap} /> : null;
      case 'victory':
        return quizResult ? <VictoryScreen result={quizResult} player={player} onContinue={handleBackToMap} /> : null;
      case 'profile':
        return <ProfileScreen player={player} selectedAvatar={selectedAvatar} onSelectAvatar={handleSelectAvatar} onClose={handleBackToMap} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>

      {/* Right sidebar — hidden on mobile, visible on lg+ */}
      {showSidebar && (
        <div className="hidden lg:block">
          <RightSidebar
            completedLessons={player.completedLessons}
            activeTab={activeTab}
            onNavigate={handleNavigate}
          />
        </div>
      )}
    </div>
  );
}
