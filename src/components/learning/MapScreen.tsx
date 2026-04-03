import { PlayerState, Section } from './types';

interface MapScreenProps {
  sections: Section[];
  player: PlayerState;
  onSelectLesson: (sectionIdx: number, lessonIdx: number) => void;
}

const MAP_NODES = [
  { id: 0, icon: '⭐', label: 'Lição 1', x: 50, type: 'lesson' as const },
  { id: 1, icon: '🧠', label: 'Lição 2', x: 75, type: 'lesson' as const },
  { id: -1, icon: '📦', label: 'Bônus', x: 50, type: 'chest' as const },
  { id: 2, icon: '💬', label: 'Lição 3', x: 25, type: 'lesson' as const },
  { id: 3, icon: '⚙️', label: 'Lição 4', x: 50, type: 'lesson' as const },
  { id: 4, icon: '🎯', label: 'Lição 5', x: 75, type: 'lesson' as const },
  { id: -2, icon: '🏆', label: 'Teste', x: 50, type: 'trophy' as const },
];

export default function MapScreen({ sections, player, onSelectLesson }: MapScreenProps) {
  const section = sections[0];
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
      {/* Ambient glow top */}
      <div className="fixed top-0 left-0 right-0 h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(94,234,212,0.08) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="w-full max-w-[440px] px-5 pt-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-lg shadow-lg shadow-primary/20">🤖</div>
            <span className="font-display text-base font-bold text-foreground">NexSkill AI</span>
          </div>
          <div className="flex gap-2">
            <StatPill icon="🔥" value={player.streak} variant="gold" />
            <StatPill icon="⚡" value={`${player.xp}`} variant="purple" />
          </div>
        </div>

        {/* Level bar */}
        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Nível {player.level}
            </span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {player.levelTitle}
            </span>
          </div>
          <div className="bg-muted/60 h-3 rounded-full overflow-hidden relative">
            <div className="h-full rounded-full transition-all duration-700 relative"
              style={{
                width: `${levelProgress}%`,
                background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
              }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-foreground rounded-full border-2 border-background shadow-md" />
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1.5 text-right font-semibold">
            {player.currentXp} / {player.nextLevelXp} XP
          </div>
        </div>
      </div>

      {/* Section Banner */}
      <div className="w-[calc(100%-40px)] max-w-[440px] mt-5 mx-5 rounded-2xl p-4 px-5 flex items-center justify-between cursor-pointer transition-all hover:brightness-110 border-2 border-green bg-green-bright/20">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-green/80 mb-0.5">{section.label}</div>
          <div className="font-display text-lg font-bold text-foreground">{section.title}</div>
        </div>
        <div className="flex items-center gap-1.5 bg-foreground/10 rounded-xl py-2 px-3 text-[11px] font-extrabold uppercase tracking-wider">
          📋 Guia
        </div>
      </div>

      {/* ═══ SERPENTINE MAP ═══ */}
      <div className="w-full max-w-[440px] relative mt-6 pb-8" style={{ minHeight: `${MAP_NODES.length * 110 + 40}px` }}>
        {/* SVG Path connecting nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
          {MAP_NODES.map((node, i) => {
            if (i === 0) return null;
            const prev = MAP_NODES[i - 1];
            const y1 = i * 110 - 10;
            const y0 = (i - 1) * 110 - 10;
            const x0 = (prev.x / 100) * 100;
            const x1 = (node.x / 100) * 100;
            const status = getStatus(prev.id);
            const nextStatus = getStatus(node.id);
            const pathDone = status === 'completed';
            const pathCurrent = status === 'current' || (status === 'completed' && nextStatus === 'current');

            const midY = (y0 + y1) / 2;
            const d = `M ${x0}% ${y0 + 55} C ${x0}% ${midY}, ${x1}% ${midY}, ${x1}% ${y1 + 15}`;

            return (
              <path
                key={i}
                d={d}
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={!pathDone && !pathCurrent ? '8 8' : 'none'}
                stroke={pathDone ? 'hsl(var(--green))' : pathCurrent ? 'url(#gradPath)' : 'hsl(var(--locked-text))'}
                opacity={!pathDone && !pathCurrent ? 0.3 : 1}
              />
            );
          })}
          <defs>
            <linearGradient id="gradPath" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--green))" />
              <stop offset="100%" stopColor="hsl(var(--locked-text))" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        {MAP_NODES.map((node, i) => {
          const status = getStatus(node.id);
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${i * 110}px`,
                left: `${node.x}%`,
                transform: 'translateX(-50%)',
              }}
            >
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
                  onClick={() => {
                    if (status !== 'locked' && node.id >= 0) {
                      onSelectLesson(0, node.id);
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Section 2 Banner (locked) */}
      <div className="w-[calc(100%-40px)] max-w-[440px] mx-5 rounded-2xl p-4 px-5 flex items-center justify-between border-2 border-border bg-muted/60 pointer-events-none">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground mb-0.5">Seção 2 · Unidade 2</div>
          <div className="font-display text-lg font-bold text-muted-foreground">Prompting Avançado</div>
        </div>
        <div className="flex items-center gap-1.5 bg-muted rounded-xl py-2 px-3 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
          🔒 Bloqueado
        </div>
      </div>

      {/* Lock wall */}
      <div className="w-[calc(100%-40px)] max-w-[440px] bg-surface/80 backdrop-blur-sm border border-border rounded-3xl p-7 text-center flex flex-col items-center gap-3 mx-5 mt-3 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl">🔒</div>
        <div className="font-display text-base font-bold text-muted-foreground">Seção bloqueada</div>
        <div className="text-sm text-locked-text leading-relaxed max-w-[300px]">
          Complete a Seção 1 para desbloquear <strong className="text-secondary">Prompting Avançado</strong> e técnicas como Chain-of-Thought e RAG.
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
    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-extrabold border ${colors}`}>
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function LessonNodeButton({ icon, label, status, isFirst, onClick }: {
  icon: string; label: string; status: 'completed' | 'current' | 'locked'; isFirst: boolean; onClick: () => void;
}) {
  const base = 'relative flex flex-col items-center';

  const nodeStyles = {
    completed: 'bg-green shadow-[0_4px_20px_rgba(34,197,94,.3),0_0_0_4px_rgba(34,197,94,.15)] hover:scale-110 active:scale-95 cursor-pointer',
    current: 'bg-green shadow-[0_4px_25px_rgba(34,197,94,.35),0_0_0_5px_rgba(34,197,94,.2)] animate-pulse-glow hover:scale-110 active:scale-95 cursor-pointer',
    locked: 'bg-muted border-2 border-border shadow-[0_2px_8px_rgba(0,0,0,.06)] cursor-default',
  };

  return (
    <div className={base}>
      {/* Start bubble */}
      {isFirst && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-foreground text-background font-display text-[13px] font-bold py-2.5 px-5 rounded-2xl tracking-wide whitespace-nowrap animate-bobble shadow-lg relative">
            COMEÇAR
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-foreground" />
          </div>
        </div>
      )}

      <button
        onClick={onClick}
        disabled={status === 'locked'}
        className={`w-[76px] h-[76px] rounded-full flex flex-col items-center justify-center gap-1 transition-transform duration-150 ${nodeStyles[status]}`}
      >
        <span className={`text-[28px] leading-none ${status === 'locked' ? 'opacity-25 grayscale' : 'drop-shadow-md'}`}>
          {icon}
        </span>
        <span className={`text-[8px] font-black uppercase tracking-[0.08em] ${status === 'locked' ? 'text-locked-text' : 'text-foreground/80'}`}>
          {label}
        </span>

        {/* Badge */}
        {status === 'current' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold border-[2.5px] border-background flex items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-yellow-900">!</span>
          </div>
        )}
        {status === 'completed' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green border-[2.5px] border-background flex items-center justify-center shadow-md">
            <span className="text-[11px] font-bold text-foreground">✓</span>
          </div>
        )}
      </button>

      {/* Glow ring for current */}
      {status === 'current' && (
        <div className="absolute inset-0 w-[76px] h-[76px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
            transform: 'scale(2)',
          }}
        />
      )}
    </div>
  );
}

function ChestNode({ locked }: { locked: boolean }) {
  return (
    <div className={`w-[66px] h-[56px] rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-transform duration-150 ${
      locked
        ? 'bg-muted border-border shadow-[0_2px_8px_rgba(0,0,0,.06)] cursor-default'
        : 'bg-gold/10 border-gold/30 cursor-pointer hover:scale-105'
    }`}>
      <span className={`text-[24px] ${locked ? 'opacity-40 grayscale' : 'drop-shadow-md'}`}>📦</span>
      <span className={`text-[8px] font-black uppercase tracking-[0.08em] ${locked ? 'text-muted-foreground' : 'text-gold'}`}>
        Bônus
      </span>
    </div>
  );
}

function TrophyNode() {
  return (
    <div className="w-[76px] h-[76px] rounded-full flex flex-col items-center justify-center gap-1 cursor-default bg-gold/[0.08] border-2 border-dashed border-gold/25 shadow-[0_2px_8px_rgba(0,0,0,.04)]">
      <span className="text-[26px] opacity-40 grayscale">🏆</span>
      <span className="text-[8px] font-black uppercase tracking-[0.08em] text-muted-foreground">Teste</span>
    </div>
  );
}
