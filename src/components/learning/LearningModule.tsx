import { useState, useCallback } from 'react';
import { Home, Target, User, Trophy, Award } from 'lucide-react';
import { Screen, QuizResult, PlayerState } from './types';
import { SECTIONS, INITIAL_PLAYER } from './data';
import MapScreen from './MapScreen';
import DailyMissions from './DailyMissions';
import LessonIntro from './LessonIntro';
import QuizScreen from './QuizScreen';
import VictoryScreen from './VictoryScreen';
import ProfileScreen, { ACHIEVEMENTS } from './ProfileScreen';
import RightSidebar, { RankingScreen } from './RightSidebar';

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

  const [playerName, setPlayerName] = useState(() => localStorage.getItem('playerName') || 'Estudante IA');
  const handleChangeName = useCallback((name: string) => {
    setPlayerName(name);
    localStorage.setItem('playerName', name);
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
    else if (tab === 'missions') setScreen('missions');
    else if (tab === 'ranking') setScreen('ranking');
    else if (tab === 'achievements') setScreen('achievements');
  }, []);

  const lesson = selectedLesson ? SECTIONS[selectedLesson.sectionIdx]?.lessons[selectedLesson.lessonIdx] : null;

  const showSidebar = screen === 'map' || screen === 'profile' || screen === 'missions' || screen === 'ranking' || screen === 'achievements';
  const activeTab = screen === 'profile' ? 'profile' : screen === 'missions' ? 'missions' : screen === 'ranking' ? 'ranking' : screen === 'achievements' ? 'achievements' : 'map';

  // Count badges for ranking
  const playerBadges = ACHIEVEMENTS.filter(a => {
    if (a.id === 'a1') return player.completedLessons.length >= 1;
    if (a.id === 'a4') return player.xp >= 500;
    if (a.id === 'a7') return player.completedLessons.length >= 3;
    if (a.id === 'a8') return player.streak >= 7;
    return false;
  }).length;

  const renderContent = () => {
    switch (screen) {
      case 'map':
        return <MapScreen sections={SECTIONS} player={player} onSelectLesson={handleSelectLesson} onOpenProfile={handleOpenProfile} selectedAvatar={selectedAvatar} playerName={playerName} />;
      case 'intro':
        return lesson ? <LessonIntro lesson={lesson} lessonNumber={(selectedLesson?.lessonIdx ?? 0) + 1} onStart={handleStartQuiz} onClose={handleBackToMap} /> : null;
      case 'quiz':
        return lesson ? <QuizScreen questions={lesson.questions} onComplete={handleQuizComplete} onQuit={handleBackToMap} /> : null;
      case 'victory':
        return quizResult ? <VictoryScreen result={quizResult} player={player} onContinue={handleBackToMap} /> : null;
      case 'profile':
        return <ProfileScreen player={player} selectedAvatar={selectedAvatar} onSelectAvatar={handleSelectAvatar} playerName={playerName} onChangeName={handleChangeName} onClose={handleBackToMap} />;
      case 'missions':
        return (
          <div className="flex flex-col items-center min-h-screen bg-background">
            <div className="w-full max-w-[460px] px-5 pt-6">
              <button onClick={handleBackToMap} className="text-muted-foreground text-sm font-bold flex items-center gap-1 mb-4 hover:text-foreground transition-colors cursor-pointer">
                ← Voltar
              </button>
              <h1 className="font-display text-xl font-bold text-foreground mb-4">🎯 Missões Diárias</h1>
              <DailyMissions completedLessons={player.completedLessons} />
            </div>
          </div>
        );
      case 'ranking':
        return <RankingScreen playerXp={player.xp} playerStreak={player.streak} playerBadges={playerBadges} playerName={playerName} onClose={handleBackToMap} />;
      default:
        return null;
    }
  };

  const mobileNavItems = [
    { id: 'map', icon: Home, label: 'Aprender' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'missions', icon: Target, label: 'Missões' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 min-w-0 pb-20 lg:pb-0">
        {renderContent()}
      </div>

      {showSidebar && (
        <div className="hidden lg:block">
          <RightSidebar
            completedLessons={player.completedLessons}
            activeTab={activeTab}
            onNavigate={handleNavigate}
            playerXp={player.xp}
            playerStreak={player.streak}
            playerBadges={playerBadges}
            playerName={playerName}
          />
        </div>
      )}

      {showSidebar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border">
          <div className="flex items-center justify-around h-16 max-w-[460px] mx-auto">
            {mobileNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all cursor-pointer ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
