import { PlayerState, Section } from './types';
import { AVATARS } from './ProfileScreen';

interface MapScreenProps {
  sections: Section[];
  player: PlayerState;
  onSelectLesson: (sectionIdx: number, lessonIdx: number) => void;
  onOpenProfile?: () => void;
  selectedAvatar?: string;
  playerName?: string;
}

const MAP_NODES = [
  { id: 0, icon: '⭐', label: 'Lição 1', x: 50, type: 'lesson' as const },
  { id: 1, icon: '🧠', label: 'Lição 2', x: 30, type: 'lesson' as const },
  { id: -1, icon: '📦', label: 'Bônus', x: 55, type: 'chest' as const },
  { id: 2, icon: '💬', label: 'Lição 3', x: 70, type: 'lesson' as const },
  { id: 3, icon: '⚙️', label: 'Lição 4', x: 40, type: 'lesson' as const },
  { id: 4, icon: '🎯', label: 'Lição 5', x: 60, type: 'lesson' as const },
  { id: -2, icon: '🏆', label: 'Teste', x: 50, type: 'trophy' as const },
];

export default function MapScreen({ sections, player, onSelectLesson, onOpenProfile, selectedAvatar }: MapScreenProps) {
  const section = sections[0];
  const avatarData = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];
  const levelProgress = (player.currentXp / player.nextLevelXp) * 100;

  const getStatus = (id: number) => {
    if (id < 0) return 'locked' as const;
    if (player.completedLessons.includes(id)) return 'completed' as const;
    if (id === 0 && !player.completedLessons.includes(0)) return 'current' as const;
    if (id > 0 && player.completedLessons.includes(id - 1)) return 'current' as const;
    return 'locked' as const;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background relative overflow-x-hidden">
      {/* Header */}
      <div className="w-full max-w-[460px] px-5 pt-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button onClick={onOpenProfile}
              className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-muted">
              <img src={avatarData.src} alt={avatarData.name} width={40} height={40} className="w-full h-full object-cover" />
            </button>
            <div>
              <span className="font-display text-base font-bold text-foreground block leading-tight">NexSkill AI</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trilha de IA</span>
            </div>
          </div>
          <div className="flex gap-2">
            <StatPill icon="🔥" value={player.streak} variant="gold" />
            <StatPill icon="⚡" value={`${player.xp}`} variant="purple" />
          </div>
        </div>

        {/* Level bar */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-[13px] font-black text-primary">
                {player.level}
              </div>
              <span className="text-[12px] font-bold text-foreground">{player.levelTitle}</span>
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {player.currentXp}/{player.nextLevelXp} XP
            </span>
          </div>
          <div className="bg-muted h-3 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${levelProgress}%`, background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))' }} />
          </div>
        </div>
      </div>

      {/* Section Banner */}

      {/* Section Banner — full-width colored bar */}
      <div className="w-[calc(100%-40px)] max-w-[460px] mx-5 mt-5 rounded-2xl overflow-hidden shadow-md">
        <div className="p-5 px-6 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(160, 84%, 30%))' }}>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-primary-foreground/70 mb-1">{section.label}</div>
            <div className="font-display text-xl font-bold text-primary-foreground">{section.title}</div>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm rounded-xl py-2.5 px-4 text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground cursor-pointer hover:bg-primary-foreground/30 transition-all">
            📋 Guia
          </div>
        </div>
      </div>

      {/* ═══ MAP ═══ */}
      <div className="w-full max-w-[460px] relative mt-8 pb-8" style={{ minHeight: `${MAP_NODES.length * 120 + 40}px` }}>
        {/* SVG curved paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--green))" />
              <stop offset="100%" stopColor="hsl(var(--locked))" />
            </linearGradient>
          </defs>
          {MAP_NODES.map((node, i) => {
            if (i === 0) return null;
            const prev = MAP_NODES[i - 1];
            const y0 = (i - 1) * 120 + 44;
            const y1 = i * 120 + 10;
            const x0 = (prev.x / 100) * 100;
            const x1 = (node.x / 100) * 100;
            const status = getStatus(prev.id);
            const nextStatus = getStatus(node.id);
            const done = status === 'completed';
            const isCurrent = status === 'current' || (done && nextStatus === 'current');

            const midY = (y0 + y1) / 2;
            const d = `M ${x0}% ${y0} C ${x0}% ${midY}, ${x1}% ${midY}, ${x1}% ${y1}`;

            return (
              <path key={i} d={d} fill="none" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={!done && !isCurrent ? '6 10' : 'none'}
                stroke={done ? 'hsl(var(--green))' : isCurrent ? 'url(#pathGrad)' : 'hsl(var(--border))'}
                opacity={!done && !isCurrent ? 0.5 : 1}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {MAP_NODES.map((node, i) => {
          const status = getStatus(node.id);
          return (
            <div key={i} className="absolute" style={{ top: `${i * 120}px`, left: `${node.x}%`, transform: 'translateX(-50%)' }}>
              {node.type === 'chest' ? (
                <ChestNode locked={status === 'locked'} />
              ) : node.type === 'trophy' ? (
                <TrophyNode />
              ) : (
                <LessonNodeButton
                  icon={node.icon}
                  label={node.label}
                  status={status}
                  isFirst={i === 0 && status === 'current'}
                  onClick={() => { if (status !== 'locked' && node.id >= 0) onSelectLesson(0, node.id); }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Section 2 (locked) */}
      <div className="w-[calc(100%-40px)] max-w-[460px] mx-5 rounded-2xl overflow-hidden">
        <div className="p-5 px-6 flex items-center justify-between bg-muted border border-border">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground mb-1">Seção 2 · Unidade 2</div>
            <div className="font-display text-lg font-bold text-muted-foreground">Prompting Avançado</div>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-xl py-2 px-3 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            🔒 Bloqueado
          </div>
        </div>
      </div>

      {/* Lock wall */}
      <div className="w-[calc(100%-40px)] max-w-[460px] bg-card border border-border rounded-2xl p-7 text-center flex flex-col items-center gap-3 mx-5 mt-3 mb-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl">🔒</div>
        <div className="font-display text-base font-bold text-foreground">Seção bloqueada</div>
        <div className="text-sm text-muted-foreground leading-relaxed max-w-[300px]">
          Complete a Seção 1 para desbloquear <strong className="text-secondary font-bold">Prompting Avançado</strong> e técnicas como Chain-of-Thought e RAG.
        </div>
      </div>
    </div>
  );
}

/* ═══ Sub-components ═══ */

function StatPill({ icon, value, variant }: { icon: string; value: string | number; variant: 'gold' | 'purple' }) {
  const colors = variant === 'gold'
    ? 'text-gold border-gold/25 bg-gold/[0.08]'
    : 'text-primary border-primary/25 bg-primary/[0.08]';
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-extrabold border ${colors}`}>
      <span>{icon}</span><span>{value}</span>
    </div>
  );
}

function LessonNodeButton({ icon, label, status, isFirst, onClick }: {
  icon: string; label: string; status: 'completed' | 'current' | 'locked'; isFirst: boolean; onClick: () => void;
}) {
  // Outer ring + inner circle design
  const outerRing = status === 'completed'
    ? 'border-[4px] border-green shadow-[0_6px_20px_rgba(34,197,94,.25)]'
    : status === 'current'
    ? 'border-[4px] border-green shadow-[0_6px_25px_rgba(34,197,94,.3)] animate-pulse-glow'
    : 'border-[4px] border-border shadow-[0_2px_10px_rgba(0,0,0,.06)]';

  const innerBg = status === 'completed'
    ? 'bg-green'
    : status === 'current'
    ? 'bg-green'
    : 'bg-muted';

  return (
    <div className="relative flex flex-col items-center">
      {/* Start bubble */}
      {isFirst && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-foreground text-background font-display text-[12px] font-bold py-2 px-5 rounded-2xl tracking-wider whitespace-nowrap animate-bobble shadow-lg relative">
            COMEÇAR
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-foreground" />
          </div>
        </div>
      )}

      <button
        onClick={onClick}
        disabled={status === 'locked'}
        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center relative transition-transform duration-150 ${outerRing} ${status !== 'locked' ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'}`}
      >
        <div className={`w-[56px] h-[56px] rounded-full flex items-center justify-center ${innerBg}`}>
          {status === 'completed' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <span className={`text-[26px] leading-none ${status === 'locked' ? 'opacity-30 grayscale' : 'drop-shadow-sm'}`}>
              {icon}
            </span>
          )}
        </div>

        {/* Badge */}
        {status === 'current' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold border-[3px] border-background flex items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-yellow-900">!</span>
          </div>
        )}
      </button>

      {/* Label */}
      <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
        status === 'locked' ? 'text-muted-foreground' : status === 'completed' ? 'text-green' : 'text-foreground'
      }`}>
        {label}
      </span>
    </div>
  );
}

function ChestNode({ locked }: { locked: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-[60px] h-[52px] rounded-2xl flex items-center justify-center border-[3px] transition-transform duration-150 ${
        locked
          ? 'bg-muted border-border cursor-default'
          : 'bg-gold/10 border-gold/30 cursor-pointer hover:scale-105'
      }`}>
        <span className={`text-[24px] ${locked ? 'opacity-30 grayscale' : 'drop-shadow-sm'}`}>📦</span>
      </div>
      <span className={`mt-1.5 text-[9px] font-bold uppercase tracking-wider ${locked ? 'text-muted-foreground' : 'text-gold'}`}>
        Bônus
      </span>
    </div>
  );
}

function TrophyNode() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center border-[3px] border-dashed border-gold/25 bg-gold/[0.05]">
        <span className="text-[28px] opacity-30 grayscale">🏆</span>
      </div>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Teste</span>
    </div>
  );
}
