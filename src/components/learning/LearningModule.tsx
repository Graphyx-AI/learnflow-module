import { useState, useCallback } from 'react';
import { Home, Target, User, Trophy, Award, Zap, Shield } from 'lucide-react';
import { Screen, QuizResult, PlayerState, ChestReward } from './types';
import { SECTIONS, INITIAL_PLAYER, FINAL_TEST_QUESTIONS, SECTION_FINAL_TESTS } from './data';
import MapScreen from './MapScreen';
import DailyMissions from './DailyMissions';
import LessonIntro from './LessonIntro';
import QuizScreen from './QuizScreen';
import VictoryScreen from './VictoryScreen';
import ProfileScreen, { ACHIEVEMENTS } from './ProfileScreen';
import RightSidebar, { RankingScreen } from './RightSidebar';
import ChestScreen from './ChestScreen';
import FinalTestScreen, { FinalTestResultScreen } from './FinalTestScreen';
import LeagueScreen from './LeagueScreen';
import LightningChallenge from './LightningChallenge';
import StreakNotification from './StreakNotification';
import CourseCompletionScreen from './CourseCompletionScreen';

export default function LearningModule() {
  const [screen, setScreen] = useState<Screen>('map');
  const [player, setPlayer] = useState<PlayerState>({ ...INITIAL_PLAYER });
  const [selectedLesson, setSelectedLesson] = useState<{ sectionIdx: number; lessonIdx: number } | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('selectedAvatar') || 'robot');
  const [justUnlockedKey, setJustUnlockedKey] = useState<string | null>(null);

  const handleSelectAvatar = useCallback((id: string) => {
    setSelectedAvatar(id);
    localStorage.setItem('selectedAvatar', id);
  }, []);

  const [playerName, setPlayerName] = useState(() => localStorage.getItem('playerName') || 'Estudante IA');
  const [chestOpened, setChestOpened] = useState(() => localStorage.getItem('chestOpened') === 'true');
  const [testCompleted, setTestCompleted] = useState(() => localStorage.getItem('testCompleted') === 'true');
  const [testResult, setTestResult] = useState<{ score: number; total: number; passed: boolean; xpGained: number } | null>(null);
  const [streakDismissed, setStreakDismissed] = useState(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [lightningDone, setLightningDone] = useState(() => {
    const saved = localStorage.getItem('lightningDate');
    return saved === new Date().toDateString();
  });
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
    setPlayer(prev => {
      const sectionId = selectedLesson ? SECTIONS[selectedLesson.sectionIdx]?.id : '';
      const prevSectionLessons = prev.sectionProgress[sectionId] || [];
      const newSectionLessons = selectedLesson && !prevSectionLessons.includes(selectedLesson.lessonIdx)
        ? [...prevSectionLessons, selectedLesson.lessonIdx]
        : prevSectionLessons;

      // Track perfect lessons (100% accuracy)
      const prevPerfect = prev.perfectLessons[sectionId] || [];
      const newPerfect = selectedLesson && result.accuracy === 100 && !prevPerfect.includes(selectedLesson.lessonIdx)
        ? [...prevPerfect, selectedLesson.lessonIdx]
        : prevPerfect;

      return {
        ...prev,
        xp: prev.xp + result.xpGained,
        currentXp: prev.currentXp + result.xpGained,
        completedLessons: selectedLesson
          ? [...prev.completedLessons, selectedLesson.lessonIdx]
          : prev.completedLessons,
        sectionProgress: { ...prev.sectionProgress, [sectionId]: newSectionLessons },
        perfectLessons: { ...prev.perfectLessons, [sectionId]: newPerfect },
      };
    });
    setScreen('victory');
  }, [selectedLesson]);

  const handleBackToMap = useCallback(() => {
    // Determine which node just got unlocked
    if (selectedLesson) {
      const sectionId = SECTIONS[selectedLesson.sectionIdx]?.id || '';
      const nextLessonIdx = selectedLesson.lessonIdx + 1;
      const sectionLessons = SECTIONS[selectedLesson.sectionIdx]?.lessons || [];
      if (nextLessonIdx < sectionLessons.length) {
        setJustUnlockedKey(`${sectionId}:${nextLessonIdx}`);
      } else if (nextLessonIdx >= sectionLessons.length) {
        // Chest or trophy might unlock
        setJustUnlockedKey(`${sectionId}:-2`);
      }
    }
    setScreen('map');
    setSelectedLesson(null);
    setQuizResult(null);
  }, [selectedLesson]);

  const handleOpenProfile = useCallback(() => setScreen('profile'), []);
  const handleOpenChest = useCallback(() => setScreen('chest'), []);
  const handleClaimChest = useCallback((reward: ChestReward) => {
    const sectionId = SECTIONS[activeSectionIdx]?.id || 'section-1';
    setPlayer(prev => ({
      ...prev,
      xp: reward.type === 'xp' && reward.amount ? prev.xp + reward.amount : prev.xp,
      currentXp: reward.type === 'xp' && reward.amount ? prev.currentXp + reward.amount : prev.currentXp,
      chestsOpened: { ...prev.chestsOpened, [sectionId]: true },
    }));
    setChestOpened(true);
    localStorage.setItem('chestOpened', 'true');
    setScreen('map');
  }, [activeSectionIdx]);

  const handleOpenFinalTest = useCallback(() => setScreen('finaltest'), []);
  const handleFinalTestComplete = useCallback((result: { score: number; total: number; passed: boolean; xpGained: number }) => {
    setTestResult(result);
    const sectionId = SECTIONS[activeSectionIdx]?.id || 'section-1';
    setPlayer(prev => ({
      ...prev,
      xp: prev.xp + result.xpGained,
      currentXp: prev.currentXp + result.xpGained,
      testsCompleted: result.passed ? { ...prev.testsCompleted, [sectionId]: true } : prev.testsCompleted,
    }));
    if (result.passed) {
      setTestCompleted(true);
      localStorage.setItem('testCompleted', 'true');

      // Check if ALL sections are complete
      const updatedTests = { ...player.testsCompleted, [sectionId]: true };
      const allDone = SECTIONS.every(s => updatedTests[s.id]);
      if (allDone) {
        setTestResult(result);
        setScreen('course-complete');
        return;
      }
    }
    setScreen('finaltest-result');
  }, [activeSectionIdx, player.testsCompleted]);

  const handleRestartCourse = useCallback(() => {
    const fresh = { ...INITIAL_PLAYER };
    setPlayer(fresh);
    setChestOpened(false);
    setTestCompleted(false);
    setTestResult(null);
    setActiveSectionIdx(0);
    localStorage.removeItem('chestOpened');
    localStorage.removeItem('testCompleted');
    setScreen('map');
  }, []);

  const handleNavigate = useCallback((tab: string) => {
    if (tab === 'map') setScreen('map');
    else if (tab === 'profile') setScreen('profile');
    else if (tab === 'missions') setScreen('missions');
    else if (tab === 'ranking') setScreen('ranking');
    else if (tab === 'achievements') setScreen('achievements');
    else if (tab === 'league') setScreen('league');
    else if (tab === 'lightning') setScreen('lightning');
  }, []);

  const handleLightningComplete = useCallback((xpGained: number) => {
    setPlayer(prev => ({ ...prev, xp: prev.xp + xpGained, currentXp: prev.currentXp + xpGained }));
    setLightningDone(true);
    localStorage.setItem('lightningDate', new Date().toDateString());
    setScreen('map');
  }, []);

  const lesson = selectedLesson ? SECTIONS[selectedLesson.sectionIdx]?.lessons[selectedLesson.lessonIdx] : null;

  const showSidebar = ['map', 'profile', 'missions', 'ranking', 'achievements', 'league'].includes(screen);
  const activeTab = screen === 'profile' ? 'profile' : screen === 'missions' ? 'missions' : screen === 'ranking' ? 'ranking' : screen === 'achievements' ? 'achievements' : screen === 'league' ? 'league' : 'map';

  // Compute achievements
  const computedAchievements = ACHIEVEMENTS.map(a => {
    let unlocked = false;
    if (a.id === 'a1') unlocked = player.completedLessons.length >= 1;
    if (a.id === 'a4') unlocked = player.xp >= 500;
    if (a.id === 'a7') unlocked = player.completedLessons.length >= 3;
    if (a.id === 'a8') unlocked = player.streak >= 7;
    return { ...a, unlocked, unlockedAt: unlocked ? 'Hoje' : undefined };
  });
  const playerBadges = computedAchievements.filter(a => a.unlocked).length;

  const renderContent = () => {
    switch (screen) {
      case 'map':
        return <MapScreen sections={SECTIONS} player={player} onSelectLesson={handleSelectLesson} onOpenProfile={handleOpenProfile} onOpenChest={handleOpenChest} onOpenFinalTest={handleOpenFinalTest} selectedAvatar={selectedAvatar} playerName={playerName} chestOpened={chestOpened} testCompleted={testCompleted} onSectionChange={setActiveSectionIdx} />;
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
      case 'achievements':
        return (
          <div className="flex flex-col items-center min-h-screen bg-background">
            <div className="w-full max-w-[460px] px-5 pt-6 pb-24">
              <button onClick={handleBackToMap} className="text-muted-foreground text-sm font-bold flex items-center gap-1 mb-4 hover:text-foreground transition-colors cursor-pointer">
                ← Voltar
              </button>
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-display text-xl font-bold text-foreground">🏅 Conquistas</h1>
                <span className="text-[12px] font-bold text-muted-foreground">{playerBadges}/{computedAchievements.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {computedAchievements.map(a => {
                  const rarityColors: Record<string, string> = {
                    common: 'border-border bg-muted/30',
                    rare: 'border-primary/30 bg-primary/[0.04]',
                    epic: 'border-secondary/30 bg-secondary/[0.04]',
                    legendary: 'border-gold/30 bg-gold/[0.04]',
                  };
                  const rarityLabels: Record<string, string> = { common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário' };
                  return (
                    <div key={a.id} className={`rounded-2xl border-[1.5px] p-4 flex items-center gap-4 transition-all ${
                      a.unlocked ? rarityColors[a.rarity] : 'border-border bg-muted/20 opacity-50'
                    }`}>
                      <div className={`w-14 h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0 ${a.unlocked ? '' : 'grayscale opacity-40'}`}>
                        <img src={a.badgeImg} alt={a.title} width={56} height={56} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[13px] font-bold text-foreground">{a.title}</span>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">{rarityLabels[a.rarity]}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{a.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'chest':
        return <ChestScreen onClaim={handleClaimChest} onClose={handleBackToMap} alreadyOpened={chestOpened} />;
      case 'finaltest':
        const activeSectionId = SECTIONS[activeSectionIdx]?.id || 'section-1';
        const testQs = SECTION_FINAL_TESTS[activeSectionId] || FINAL_TEST_QUESTIONS;
        return <FinalTestScreen questions={testQs} onComplete={handleFinalTestComplete} onQuit={handleBackToMap} />;
      case 'finaltest-result':
        return testResult ? <FinalTestResultScreen score={testResult.score} total={testResult.total} passed={testResult.passed} xpGained={testResult.xpGained} onClose={handleBackToMap} /> : null;
      case 'league':
        return <LeagueScreen playerXp={player.xp} playerName={playerName} onClose={handleBackToMap} />;
      case 'lightning':
        return <LightningChallenge onComplete={handleLightningComplete} onClose={handleBackToMap} playerLevel={player.level} />;
      case 'course-complete':
        return <CourseCompletionScreen player={player} playerName={playerName} onRestart={handleRestartCourse} />;
      default:
        return null;
    }
  };

  const mobileNavItems = [
    { id: 'map', icon: Home, label: 'Aprender' },
    { id: 'league', icon: Shield, label: 'Liga' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'missions', icon: Target, label: 'Missões' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Streak notification */}
      {screen === 'map' && player.streak >= 1 && !streakDismissed && (
        <StreakNotification
          streak={player.streak}
          onDismiss={() => setStreakDismissed(true)}
          onStartLesson={() => { setStreakDismissed(true); handleSelectLesson(0, 0); }}
        />
      )}

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
            achievements={computedAchievements}
            lightningAvailable={!lightningDone}
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
