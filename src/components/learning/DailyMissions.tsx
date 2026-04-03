import { useState } from 'react';

export interface Mission {
  id: string;
  icon: string;
  title: string;
  description: string;
  current: number;
  target: number;
  xpReward: number;
  claimed: boolean;
}

const DEFAULT_MISSIONS: Mission[] = [
  { id: 'm1', icon: '📚', title: 'Estudante dedicado', description: 'Complete 1 lição', current: 0, target: 1, xpReward: 20, claimed: false },
  { id: 'm2', icon: '🎯', title: 'Mira perfeita', description: 'Acerte 5 questões seguidas', current: 0, target: 5, xpReward: 30, claimed: false },
  { id: 'm3', icon: '⚡', title: 'Caçador de XP', description: 'Ganhe 50 XP hoje', current: 0, target: 50, xpReward: 25, claimed: false },
  { id: 'm4', icon: '🔥', title: 'Em chamas', description: 'Mantenha um combo de 3x', current: 0, target: 3, xpReward: 15, claimed: false },
];

interface DailyMissionsProps {
  completedLessons: number[];
  totalXpToday?: number;
  maxCombo?: number;
  maxStreak?: number;
}

export default function DailyMissions({ completedLessons, totalXpToday = 0, maxCombo = 0, maxStreak = 0 }: DailyMissionsProps) {
  const [expanded, setExpanded] = useState(true);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  const missions: Mission[] = DEFAULT_MISSIONS.map(m => {
    let current = 0;
    if (m.id === 'm1') current = completedLessons.length;
    if (m.id === 'm2') current = maxStreak;
    if (m.id === 'm3') current = totalXpToday;
    if (m.id === 'm4') current = maxCombo;
    return { ...m, current: Math.min(current, m.target), claimed: claimedIds.includes(m.id) };
  });

  const completedCount = missions.filter(m => m.current >= m.target).length;
  const totalMissions = missions.length;

  const handleClaim = (id: string) => {
    setClaimedIds(prev => [...prev, id]);
  };

  // Time remaining (mock — always shows a fixed time)
  const hoursLeft = 14;
  const minsLeft = 32;

  return (
    <div className="w-[calc(100%-40px)] max-w-[440px] mx-5 mt-5 relative z-10">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between bg-surface border border-border rounded-2xl p-4 px-5 cursor-pointer transition-all hover:border-primary/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-xl">🎯</div>
          <div className="text-left">
            <div className="font-display text-sm font-bold text-foreground">Missões Diárias</div>
            <div className="text-[11px] text-muted-foreground font-semibold">
              {completedCount}/{totalMissions} completas · ⏱ {hoursLeft}h {minsLeft}m
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mini progress dots */}
          <div className="flex gap-1">
            {missions.map((m, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${
                m.claimed ? 'bg-green' : m.current >= m.target ? 'bg-gold' : 'bg-muted'
              }`} />
            ))}
          </div>
          <span className={`text-muted-foreground text-sm transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>

      {/* Mission cards */}
      {expanded && (
        <div className="mt-2 flex flex-col gap-2 animate-slide-up">
          {missions.map((mission) => {
            const progress = (mission.current / mission.target) * 100;
            const isComplete = mission.current >= mission.target;
            const isClaimed = mission.claimed;

            return (
              <div
                key={mission.id}
                className={`border rounded-xl p-4 px-5 flex items-center gap-4 transition-all ${
                  isClaimed
                    ? 'bg-green/[0.06] border-green/20 opacity-60'
                    : isComplete
                    ? 'bg-gold/[0.06] border-gold/25 shadow-sm'
                    : 'bg-card border-border'
                }`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  isClaimed ? 'bg-green/10' : isComplete ? 'bg-gold/15' : 'bg-muted'
                }`}>
                  {isClaimed ? '✅' : mission.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[13px] font-bold ${isClaimed ? 'text-green line-through' : 'text-foreground'}`}>
                      {mission.title}
                    </span>
                    <span className="text-[11px] font-extrabold text-primary flex items-center gap-1">
                      +{mission.xpReward} XP
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mb-2">{mission.description}</div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          background: isClaimed
                            ? 'hsl(var(--green))'
                            : isComplete
                            ? 'hsl(var(--gold))'
                            : 'hsl(var(--primary))',
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                      {mission.current}/{mission.target}
                    </span>
                  </div>
                </div>

                {/* Claim button */}
                {isComplete && !isClaimed && (
                  <button
                    onClick={() => handleClaim(mission.id)}
                    className="flex-shrink-0 py-2 px-4 rounded-xl text-[12px] font-extrabold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--gold)), hsl(40, 96%, 40%))' }}
                  >
                    Coletar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
