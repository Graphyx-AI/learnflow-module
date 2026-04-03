import { PlayerState, Section, LessonNode } from './types';

interface MapScreenProps {
  sections: Section[];
  player: PlayerState;
  onSelectLesson: (sectionIdx: number, lessonIdx: number) => void;
}

const alignments: Array<'center' | 'right' | 'left' | 'center' | 'right'> = ['center', 'right', 'center', 'left', 'center'];

export default function MapScreen({ sections, player, onSelectLesson }: MapScreenProps) {
  const section = sections[0];
  const lessons = section.lessons;

  const nodes: LessonNode[] = lessons.map((lesson, i) => ({
    lessonIndex: i,
    icon: lesson.icon,
    label: `Lição ${i + 1}`,
    status: player.completedLessons.includes(i) ? 'completed' : (i === 0 && !player.completedLessons.includes(0) ? 'current' : (player.completedLessons.includes(i - 1) ? 'current' : 'locked')),
    alignment: alignments[i % alignments.length],
  }));

  // Extra locked nodes for visual depth
  const extraNodes: LessonNode[] = [
    { lessonIndex: 1, icon: '🧠', label: 'Lição 2', status: player.completedLessons.includes(0) ? 'current' : 'locked', alignment: 'right' },
    { lessonIndex: -1, icon: '📦', label: 'Bônus', status: 'locked', alignment: 'center' },
    { lessonIndex: 2, icon: '💬', label: 'Lição 3', status: 'locked', alignment: 'left' },
    { lessonIndex: 3, icon: '⚙️', label: 'Lição 4', status: 'locked', alignment: 'center' },
    { lessonIndex: 4, icon: '🎯', label: 'Lição 5', status: 'locked', alignment: 'right' },
  ];

  const allNodes = [nodes[0], ...extraNodes];

  const levelProgress = (player.currentXp / player.nextLevelXp) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen bg-background relative">
      {/* Ambient glow */}
      <div className="fixed top-0 left-0 right-0 h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(94,234,212,0.07) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="w-full max-w-[420px] px-5 pt-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-base">🤖</div>
            <span className="font-display text-[15px] font-bold text-foreground">NexSkill AI</span>
          </div>
          <div className="flex gap-2">
            <StatPill icon="🔥" value={player.streak} variant="gold" />
            <StatPill icon="⚡" value={`${player.xp} XP`} variant="purple" />
          </div>
        </div>

        {/* Level bar */}
        <div className="bg-surface border border-border rounded-xl p-3 px-4">
          <div className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1.5">
            Nível {player.level} — {player.levelTitle}
          </div>
          <div className="bg-muted/60 h-2 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${levelProgress}%`, background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))' }} />
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {player.currentXp} / {player.nextLevelXp} XP para Nível {player.level + 1}
          </div>
        </div>
      </div>

      {/* Section 1 Banner */}
      <SectionBanner label={section.label} title={section.title} unlocked variant="green" />

      {/* Map */}
      <div className="w-full max-w-[420px] px-5 flex flex-col items-center relative pb-16">
        <div className="h-5" />
        {allNodes.map((node, i) => (
          <div key={i}>
            <NodeRow
              node={node}
              isFirst={i === 0}
              onClick={() => {
                if (node.status !== 'locked' && node.lessonIndex >= 0) {
                  onSelectLesson(0, node.lessonIndex);
                }
              }}
            />
            {i < allNodes.length - 1 && (
              <PathSegment status={
                node.status === 'completed' ? 'done' :
                node.status === 'current' ? 'current' : 'locked'
              } />
            )}
          </div>
        ))}

        {/* Trophy */}
        <PathSegment status="locked" />
        <div className="flex justify-center w-full">
          <div className="w-[68px] h-[68px] rounded-full flex flex-col items-center justify-center gap-0.5 text-[10px] font-extrabold text-locked-text uppercase tracking-wider"
            style={{ background: 'rgba(251,191,36,.08)', border: '2px dashed rgba(251,191,36,.25)' }}>
            <span className="text-[22px] opacity-30">🏆</span>
            <span>Teste</span>
          </div>
        </div>
      </div>

      {/* Section 2 Banner (locked) */}
      <SectionBanner label="Seção 2 · Unidade 2" title="Prompting Avançado" unlocked={false} variant="blue" />
      <LockWall />
      <div className="h-12" />
    </div>
  );
}

function StatPill({ icon, value, variant }: { icon: string; value: string | number; variant: 'gold' | 'purple' }) {
  const colors = variant === 'gold'
    ? 'text-gold border-gold/20 bg-gold/[0.06]'
    : 'text-primary border-primary/20 bg-primary/[0.06]';
  return (
    <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-extrabold border ${colors}`}>
      {icon} <span>{value}</span>
    </div>
  );
}

function SectionBanner({ label, title, unlocked, variant }: { label: string; title: string; unlocked: boolean; variant: 'green' | 'blue' }) {
  const bg = variant === 'green' ? 'bg-green-bright/30 border-green' : 'bg-blue-900/40 border-blue-500';
  return (
    <div className={`w-[calc(100%-40px)] max-w-[420px] rounded-2xl p-[18px] px-5 flex items-center justify-between mt-3 mx-5 border transition-all ${bg} ${!unlocked ? 'opacity-60 pointer-events-none' : 'cursor-pointer hover:brightness-110'}`}>
      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-wider opacity-75">{label}</div>
        <div className="font-display text-[17px] font-bold text-foreground">{title}</div>
      </div>
      <div className="flex items-center gap-1.5 bg-foreground/10 rounded-[10px] py-[7px] px-3 text-[12px] font-extrabold uppercase tracking-wider">
        {unlocked ? '📋 Guia' : '🔒 Bloqueado'}
      </div>
    </div>
  );
}

function NodeRow({ node, isFirst, onClick }: { node: LessonNode; isFirst: boolean; onClick: () => void }) {
  const justifyClass = node.alignment === 'center' ? 'justify-center' :
    node.alignment === 'left' ? 'justify-start pl-10' : 'justify-end pr-10';

  const nodeStyle = node.status === 'completed'
    ? 'bg-green shadow-[0_0_0_4px_rgba(34,197,94,.18),0_0_0_8px_rgba(34,197,94,.06)]'
    : node.status === 'current'
    ? 'bg-green shadow-[0_0_0_4px_rgba(34,197,94,.25),0_0_0_10px_rgba(34,197,94,.08)] animate-pulse-glow'
    : 'bg-locked shadow-[0_0_0_4px_rgba(42,42,66,.5)] cursor-default';

  const isChest = node.lessonIndex === -1;

  if (isChest) {
    return (
      <div className={`w-full flex min-h-[80px] ${justifyClass}`}>
        <div className="w-[62px] h-[52px] bg-locked border-2 border-locked-text/40 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-transform hover:scale-105">
          <span className="text-[22px] opacity-30">📦</span>
          <span className="text-[9px] font-extrabold tracking-wider text-locked-text uppercase">Bônus</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex min-h-[80px] items-center ${justifyClass}`}>
      <div className="relative flex flex-col items-center">
        {isFirst && node.status === 'current' && (
          <div className="absolute -top-[46px] bg-foreground text-background font-display text-[13px] font-bold py-2 px-4 rounded-[10px] tracking-wider whitespace-nowrap animate-bobble">
            COMEÇAR
            <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-foreground" />
          </div>
        )}
        <button
          onClick={onClick}
          disabled={node.status === 'locked'}
          className={`w-[68px] h-[68px] rounded-full flex flex-col items-center justify-center gap-0.5 relative transition-transform duration-150 ${nodeStyle} ${node.status !== 'locked' ? 'hover:scale-[1.08] active:scale-95 cursor-pointer' : ''}`}
        >
          <span className={`text-2xl leading-none ${node.status === 'locked' ? 'opacity-30' : ''}`}>{node.icon}</span>
          <span className={`text-[9px] font-black uppercase tracking-wider ${node.status === 'locked' ? 'text-locked-text' : 'opacity-85'}`}>{node.label}</span>
          {node.status === 'current' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold border-2 border-background flex items-center justify-center text-[9px] font-black text-yellow-900">!</div>
          )}
          {node.status === 'completed' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green border-2 border-background flex items-center justify-center text-[9px]">✓</div>
          )}
        </button>
      </div>
    </div>
  );
}

function PathSegment({ status }: { status: 'done' | 'current' | 'locked' }) {
  const bg = status === 'done' ? 'bg-green-bright' :
    status === 'current' ? 'bg-gradient-to-b from-green-bright to-locked-text' :
    'bg-locked-text/30';
  return <div className={`w-[3px] h-8 mx-auto rounded-full ${bg}`} />;
}

function LockWall() {
  return (
    <div className="w-[calc(100%-40px)] max-w-[420px] bg-background/85 border border-border rounded-[20px] p-6 px-5 text-center flex flex-col items-center gap-3 mx-5 mt-2">
      <span className="text-[32px]">🔒</span>
      <div className="font-display text-base font-bold text-muted-foreground">Seção bloqueada</div>
      <div className="text-[13px] text-locked-text leading-relaxed">
        Complete a Seção 1 para desbloquear <strong className="text-secondary">Prompting Avançado</strong> e técnicas como Chain-of-Thought e RAG.
      </div>
    </div>
  );
}
