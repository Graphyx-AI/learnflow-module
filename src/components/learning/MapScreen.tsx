import { PlayerState, Section } from './types';
import { AVATARS } from './ProfileScreen';
import { Flame, Zap } from 'lucide-react';

interface MapScreenProps {
  sections: Section[];
  player: PlayerState;
  onSelectLesson: (sectionIdx: number, lessonIdx: number) => void;
  onOpenProfile?: () => void;
  onOpenChest?: () => void;
  onOpenFinalTest?: () => void;
  selectedAvatar?: string;
  playerName?: string;
  chestOpened?: boolean;
  testCompleted?: boolean;
}

const MAP_NODES = [
  { id: 0, icon: '⭐', label: 'Lição 1', x: 50, type: 'lesson' as const },
  { id: 1, icon: '🧠', label: 'Lição 2', x: 28, type: 'lesson' as const },
  { id: -1, icon: '📦', label: 'Bônus', x: 55, type: 'chest' as const },
  { id: 2, icon: '💬', label: 'Lição 3', x: 72, type: 'lesson' as const },
  { id: 3, icon: '⚙️', label: 'Lição 4', x: 38, type: 'lesson' as const },
  { id: 4, icon: '🎯', label: 'Lição 5', x: 62, type: 'lesson' as const },
  { id: -2, icon: '🏆', label: 'Teste', x: 50, type: 'trophy' as const },
];

const NODE_SPACING = 130;

export default function MapScreen({ sections, player, onSelectLesson, onOpenProfile, onOpenChest, onOpenFinalTest, selectedAvatar, playerName, chestOpened, testCompleted }: MapScreenProps) {
  const section = sections[0];
  const avatarData = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];
  const levelProgress = (player.currentXp / player.nextLevelXp) * 100;

  const getStatus = (id: number) => {
    if (id === -1) return player.completedLessons.length >= 2 ? (chestOpened ? 'completed' as const : 'current' as const) : 'locked' as const;
    if (id === -2) return 'locked' as const;
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
          <div className="flex items-center gap-3">
            <button onClick={onOpenProfile}
              className="w-11 h-11 rounded-full overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 ring-2 ring-primary/20">
              <img src={avatarData.src} alt={avatarData.name} width={44} height={44} className="w-full h-full object-cover" />
            </button>
            <div>
              <span className="font-display text-[15px] font-bold text-foreground block leading-tight">NexSkill AI</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{playerName || 'Estudante IA'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-extrabold border border-orange-200 bg-orange-50 text-orange-500">
              <Flame className="w-4 h-4" /><span>{player.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-extrabold border border-primary/20 bg-primary/5 text-primary">
              <Zap className="w-4 h-4" /><span>{player.xp}</span>
            </div>
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
      <div className="w-[calc(100%-40px)] max-w-[460px] mx-5 mt-5 rounded-2xl overflow-hidden shadow-md">
        <div className="p-5 px-6 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}>
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
      <div className="w-full max-w-[460px] relative mt-10 pb-8 px-5" style={{ minHeight: `${MAP_NODES.length * NODE_SPACING + 40}px` }}>
        {/* SVG paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
          {MAP_NODES.map((node, i) => {
            if (i === 0) return null;
            const prev = MAP_NODES[i - 1];
            const y0 = (i - 1) * NODE_SPACING + 44;
            const y1 = i * NODE_SPACING + 10;
            const x0 = (prev.x / 100) * 100;
            const x1 = (node.x / 100) * 100;
            const status = getStatus(prev.id);
            const nextStatus = getStatus(node.id);
            const done = status === 'completed';
            const isCurrent = status === 'current' || (done && nextStatus === 'current');

            const midY = (y0 + y1) / 2;
            const d = `M ${x0}% ${y0} C ${x0}% ${midY}, ${x1}% ${midY}, ${x1}% ${y1}`;

            return (
              <path key={i} d={d} fill="none" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={!done && !isCurrent ? '8 12' : 'none'}
                stroke={done ? 'hsl(var(--primary))' : isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                opacity={!done && !isCurrent ? 0.4 : done ? 0.7 : 0.5}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {MAP_NODES.map((node, i) => {
          const status = getStatus(node.id);
          return (
            <div key={i} className="absolute" style={{ top: `${i * NODE_SPACING}px`, left: `${node.x}%`, transform: 'translateX(-50%)' }}>
              {node.type === 'chest' ? (
                <ChestNode locked={status === 'locked'} opened={chestOpened} onClick={() => { if (status !== 'locked' && onOpenChest) onOpenChest(); }} />
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
        <div className="p-5 px-6 flex items-center justify-between bg-muted/50 border border-border">
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
        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-2xl">🔒</div>
        <div className="font-display text-base font-bold text-foreground">Seção bloqueada</div>
        <div className="text-sm text-muted-foreground leading-relaxed max-w-[300px]">
          Complete a Seção 1 para desbloquear <strong className="text-primary font-bold">Prompting Avançado</strong> e técnicas como Chain-of-Thought e RAG.
        </div>
      </div>
    </div>
  );
}

/* ═══ Sub-components ═══ */

function LessonNodeButton({ icon, label, status, isFirst, onClick }: {
  icon: string; label: string; status: 'completed' | 'current' | 'locked'; isFirst: boolean; onClick: () => void;
}) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';

  return (
    <div className="relative flex flex-col items-center">
      {/* Start bubble */}
      {isFirst && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-primary text-primary-foreground font-display text-[12px] font-bold py-2 px-5 rounded-2xl tracking-wider whitespace-nowrap animate-bobble shadow-lg relative">
            COMEÇAR
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-primary" />
          </div>
        </div>
      )}

      <button
        onClick={onClick}
        disabled={isLocked}
        className={`relative w-[76px] h-[76px] rounded-full flex items-center justify-center transition-all duration-200 ${
          isCompleted
            ? 'bg-primary shadow-[0_4px_20px_rgba(var(--primary-rgb),0.3)] cursor-pointer hover:scale-110 active:scale-95'
            : isCurrent
            ? 'bg-primary shadow-[0_4px_24px_rgba(var(--primary-rgb),0.35)] cursor-pointer hover:scale-110 active:scale-95'
            : 'bg-muted/80 border-2 border-border shadow-sm cursor-default'
        }`}
      >
        {/* Inner white circle for current/completed */}
        {(isCompleted || isCurrent) && (
          <div className="absolute inset-[4px] rounded-full bg-primary flex items-center justify-center">
            {isCompleted ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span className="text-[28px] leading-none drop-shadow-sm">{icon}</span>
            )}
          </div>
        )}

        {/* Locked state */}
        {isLocked && (
          <span className="text-[26px] leading-none opacity-30 grayscale">{icon}</span>
        )}

        {/* Current indicator badge */}
        {isCurrent && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-[3px] border-background flex items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-amber-900">!</span>
          </div>
        )}
      </button>

      {/* Label */}
      <span className={`mt-2.5 text-[10px] font-bold uppercase tracking-wider ${
        isLocked ? 'text-muted-foreground/60' : isCompleted ? 'text-primary' : 'text-foreground'
      }`}>
        {label}
      </span>
    </div>
  );
}

function ChestNode({ locked, opened, onClick }: { locked: boolean; opened?: boolean; onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center" onClick={!locked ? onClick : undefined}>
      <div className={`w-[64px] h-[56px] rounded-2xl flex items-center justify-center border-2 transition-transform duration-150 ${
        locked
          ? 'bg-muted/60 border-border cursor-default'
          : opened
          ? 'bg-primary/10 border-primary/30 cursor-pointer hover:scale-105 shadow-md'
          : 'bg-gold/10 border-gold/30 cursor-pointer hover:scale-105 shadow-md animate-bobble'
      }`}>
        <span className={`text-[24px] ${locked ? 'opacity-25 grayscale' : 'drop-shadow-sm'}`}>
          {opened ? '📭' : '📦'}
        </span>
      </div>
      <span className={`mt-2 text-[9px] font-bold uppercase tracking-wider ${locked ? 'text-muted-foreground/60' : opened ? 'text-primary' : 'text-gold'}`}>
        {opened ? 'Coletado' : 'Bônus'}
      </span>
    </div>
  );
}

function TrophyNode() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[76px] h-[76px] rounded-full flex items-center justify-center border-2 border-dashed border-border bg-muted/30">
        <span className="text-[28px] opacity-20 grayscale">🏆</span>
      </div>
      <span className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Teste</span>
    </div>
  );
}
