import { useEffect, useRef, useCallback } from 'react';
import { QuizResult, PlayerState } from './types';

interface VictoryScreenProps {
  result: QuizResult;
  player: PlayerState;
  onContinue: () => void;
}

export default function VictoryScreen({ result, player, onContinue }: VictoryScreenProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef(false);

  const praises = [
    'Você arrasou! Continue assim! 🚀',
    'Incrível performance! Lição 2 desbloqueada!',
    'Você está pegando o jeito! 🔥',
  ];
  const praise = praises[Math.floor(Math.random() * praises.length)];

  const newXp = player.currentXp + result.xpGained;
  const newPct = Math.min((newXp / player.nextLevelXp) * 100, 100);

  const shootConfetti = useCallback(() => {
    const colors = ['#7c6af7', '#5eead4', '#f472b6', '#fbbf24', '#22c55e'];
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.style.cssText = `
          position:fixed;width:${6 + Math.random() * 6}px;height:${6 + Math.random() * 6}px;
          border-radius:2px;pointer-events:none;z-index:300;
          left:${Math.random() * 100}vw;top:-10px;
          background:${colors[i % colors.length]};
          animation:confettiFall ${2 + Math.random() * 2}s ease forwards;
          animation-delay:${Math.random() * 0.5}s;
          transform:rotate(${Math.random() * 360}deg);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }, i * 40);
    }
  }, []);

  useEffect(() => {
    if (!confettiRef.current) {
      confettiRef.current = true;
      shootConfetti();
      // Animate bar
      setTimeout(() => {
        if (barRef.current) barRef.current.style.width = `${newPct}%`;
      }, 400);
    }
  }, [shootConfetti, newPct]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-5 py-10">
      {/* Trophy */}
      <div className="text-[72px] mb-4 animate-bounce-trophy">🏆</div>

      {/* Title */}
      <h1 className="font-display text-[32px] font-bold mb-2 bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--primary)))' }}>
        Lição concluída!
      </h1>

      <p className="text-base text-muted-foreground mb-8 text-center">{praise}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[420px] mb-7">
        <StatCard icon="⚡" value={result.xpGained} label="XP ganhos" valueClass="text-primary" />
        <StatCard icon="🎯" value={`${result.accuracy}%`} label="Acertos" valueClass="text-secondary" />
        <StatCard icon="🔥" value={result.maxStreak} label="Maior combo" valueClass="text-gold" />
      </div>

      {/* XP Bar */}
      <div className="w-full max-w-[420px] mb-7">
        <div className="flex justify-between text-[12px] font-bold text-muted-foreground mb-1.5">
          <span>Nível {player.level}</span>
          <span>Nível {player.level + 1}</span>
        </div>
        <div className="bg-foreground/[0.06] h-3 rounded-full overflow-hidden">
          <div ref={barRef}
            className="h-full rounded-full"
            style={{
              width: `${(player.currentXp / player.nextLevelXp) * 100}%`,
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
              transition: 'width 1.5s cubic-bezier(.34,1.2,.64,1)',
            }} />
        </div>
        <div className="text-[11px] text-muted-foreground mt-1 text-right">
          {newXp} / {player.nextLevelXp} XP
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="rounded-2xl py-[17px] px-12 text-base font-extrabold text-primary-foreground cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)' }}
      >
        Continuar →
      </button>
    </div>
  );
}

function StatCard({ icon, value, label, valueClass }: { icon: string; value: string | number; label: string; valueClass: string }) {
  return (
    <div className="bg-card border border-border rounded-[10px] p-4 text-center">
      <div className="text-[22px] mb-1.5">{icon}</div>
      <div className={`text-[22px] font-black ${valueClass}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
