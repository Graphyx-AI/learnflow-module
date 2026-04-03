import { PlayerState, Section } from './types';
import { AVATARS } from './ProfileScreen';
import FloatingParticles from './FloatingParticles';
import BiomeBackground, { BIOMES } from './BiomeBackground';
import { Flame, Zap } from 'lucide-react';

const LEAGUE_TIERS = [
  { id: 'bronze', minXp: 0, label: 'Bronze', icon: '🥉', frameClass: 'avatar-frame-bronze' },
  { id: 'silver', minXp: 1000, label: 'Prata', icon: '🥈', frameClass: 'avatar-frame-silver' },
  { id: 'gold', minXp: 3000, label: 'Ouro', icon: '🥇', frameClass: 'avatar-frame-gold' },
  { id: 'diamond', minXp: 6000, label: 'Diamante', icon: '💎', frameClass: 'avatar-frame-diamond' },
];

function getLeagueTier(xp: number) {
  return [...LEAGUE_TIERS].reverse().find(t => xp >= t.minXp) || LEAGUE_TIERS[0];
}

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
  onSectionChange?: (idx: number) => void;
}

function buildMapNodes(section: Section) {
  const lessons = section.lessons;
  const nodes: { id: number; icon: string; label: string; x: number; type: 'lesson' | 'chest' | 'trophy' }[] = [];
  const xPositions = [50, 28, 72, 38, 62];
  lessons.forEach((l, i) => {
    nodes.push({ id: i, icon: l.icon, label: `Lição ${i + 1}`, x: xPositions[i % xPositions.length], type: 'lesson' });
    if (i === 1) nodes.push({ id: -1, icon: '📦', label: 'Bônus', x: 55, type: 'chest' });
  });
  nodes.push({ id: -2, icon: '🏆', label: 'Teste', x: 50, type: 'trophy' });
  return nodes;
}

const NODE_SPACING = 145;

export default function MapScreen({ sections, player, onSelectLesson, onOpenProfile, onOpenChest, onOpenFinalTest, selectedAvatar, playerName, chestOpened, testCompleted, onSectionChange }: MapScreenProps) {
  const avatarData = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];
  const levelProgress = (player.currentXp / player.nextLevelXp) * 100;
  const league = getLeagueTier(player.xp);

  const isSectionUnlocked = (sIdx: number) => {
    if (sIdx === 0) return true;
    const prevSection = sections[sIdx - 1];
    if (!prevSection) return false;
    const prevId = prevSection.id;
    const prevCompleted = player.sectionProgress[prevId] || [];
    return prevCompleted.length >= prevSection.lessons.length && (player.testsCompleted[prevId] || false);
  };

  const getSectionStatus = (sectionId: string, nodeId: number) => {
    const completed = player.sectionProgress[sectionId] || [];
    const sectionChestOpened = player.chestsOpened[sectionId] || false;
    const sectionTestCompleted = player.testsCompleted[sectionId] || false;
    const section = sections.find(s => s.id === sectionId);
    const lessonCount = section?.lessons.length || 5;

    if (nodeId === -1) return completed.length >= 2 ? (sectionChestOpened ? 'completed' as const : 'current' as const) : 'locked' as const;
    if (nodeId === -2) {
      const allDone = Array.from({ length: lessonCount }, (_, i) => i).every(l => completed.includes(l));
      return allDone ? (sectionTestCompleted ? 'completed' as const : 'current' as const) : 'locked' as const;
    }
    if (completed.includes(nodeId)) return 'completed' as const;
    if (nodeId === 0 && !completed.includes(0)) return 'current' as const;
    if (nodeId > 0 && completed.includes(nodeId - 1)) return 'current' as const;
    return 'locked' as const;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background relative overflow-x-hidden">
      <FloatingParticles />
      {/* Header */}
      <div className="w-full max-w-[460px] px-5 pt-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={onOpenProfile}
                className={`avatar-frame ${league.frameClass} w-12 h-12 rounded-full overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95`}>
                <img src={avatarData.src} alt={avatarData.name} width={48} height={48} className="w-full h-full object-cover rounded-full" />
              </button>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border-2 border-background flex items-center justify-center text-[10px] shadow-sm">
                {league.icon}
              </div>
            </div>
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

      {/* ═══ ALL SECTIONS ═══ */}
      {sections.map((section, sIdx) => {
        const unlocked = isSectionUnlocked(sIdx);
        const biome = BIOMES[sIdx % BIOMES.length];
        const mapNodes = buildMapNodes(section);
        const sectionChestOpened = player.chestsOpened[section.id] || false;
        const sectionTestCompleted = player.testsCompleted[section.id] || false;

        return (
          <div key={section.id} className="w-[calc(100%-40px)] max-w-[460px] mx-5 mt-5">
            {/* Banner */}
            <div className="rounded-2xl overflow-hidden shadow-md">
              <div className="p-5 px-6 flex items-center justify-between"
                style={{ background: biome.bannerGradient, opacity: unlocked ? 1 : 0.6 }}>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/70 mb-1">
                    {biome.icon} {section.label}
                  </div>
                  <div className="font-display text-xl font-bold text-white">{section.title}</div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-xl py-2.5 px-4 text-[11px] font-extrabold uppercase tracking-wider text-white cursor-pointer hover:bg-white/30 transition-all">
                  {unlocked ? '📋 Guia' : '🔒 Bloqueado'}
                </div>
              </div>
            </div>

            {/* Map or locked preview */}
            {unlocked ? (
              <div className="relative mt-2 pb-8 px-5 rounded-3xl overflow-hidden" style={{ minHeight: `${mapNodes.length * NODE_SPACING + 40}px` }}>
                <BiomeBackground biomeId={biome.id} height={mapNodes.length * NODE_SPACING + 40} />
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" preserveAspectRatio="none">
                  {mapNodes.map((node, i) => {
                    if (i === 0) return null;
                    const prev = mapNodes[i - 1];
                    const y0 = (i - 1) * NODE_SPACING + 44;
                    const y1 = i * NODE_SPACING + 10;
                    const x0 = (prev.x / 100) * 100;
                    const x1 = (node.x / 100) * 100;
                    const status = getSectionStatus(section.id, prev.id);
                    const nextStatus = getSectionStatus(section.id, node.id);
                    const done = status === 'completed';
                    const isCurrent = status === 'current' || (done && nextStatus === 'current');
                    const midY = (y0 + y1) / 2;
                    const d = `M ${x0}% ${y0} C ${x0}% ${midY}, ${x1}% ${midY}, ${x1}% ${y1}`;
                    return (
                      <path key={i} d={d} fill="none" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={!done && !isCurrent ? '8 12' : 'none'}
                        stroke={done ? biome.pathColor : isCurrent ? biome.pathColor : 'hsl(var(--border))'}
                        opacity={!done && !isCurrent ? 0.4 : done ? 0.7 : 0.5}
                      />
                    );
                  })}
                </svg>
                {mapNodes.map((node, i) => {
                  const status = getSectionStatus(section.id, node.id);
                  return (
                    <div key={i} className="absolute z-[2]" style={{ top: `${i * NODE_SPACING}px`, left: `${node.x}%`, transform: 'translateX(-50%)' }}>
                      {node.type === 'chest' ? (
                        <ChestNode locked={status === 'locked'} opened={sectionChestOpened} onClick={() => { if (status !== 'locked' && onOpenChest) { onSectionChange?.(sIdx); onOpenChest(); } }} />
                      ) : node.type === 'trophy' ? (
                        <TrophyNode status={status} onClick={() => { if (status !== 'locked' && onOpenFinalTest) { onSectionChange?.(sIdx); onOpenFinalTest(); } }} />
                      ) : (
                        <LessonNodeButton
                          icon={node.icon} label={node.label} status={status}
                          isFirst={i === 0 && status === 'current'}
                          onClick={() => { if (status !== 'locked' && node.id >= 0) { onSectionChange?.(sIdx); onSelectLesson(sIdx, node.id); } }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden mt-1" style={{ height: 160 }}>
                <BiomeBackground biomeId={biome.id} height={160} />
                <div className="absolute inset-0 z-[1] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 bg-card/80 rounded-2xl p-5 border border-border/50 shadow-sm">
                    <div className="text-3xl">🔒</div>
                    <div className="text-[11px] font-bold text-muted-foreground text-center max-w-[200px]">
                      Complete a seção anterior para desbloquear <strong className="text-foreground">{section.title}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="h-12" />
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
        className={`relative w-[88px] h-[88px] rounded-full flex items-center justify-center transition-all duration-200 ${
          isCompleted
            ? 'bg-primary shadow-[0_6px_28px_rgba(var(--primary-rgb),0.35)] cursor-pointer hover:scale-110 active:scale-95'
            : isCurrent
            ? 'bg-primary shadow-[0_6px_30px_rgba(var(--primary-rgb),0.4)] cursor-pointer hover:scale-110 active:scale-95 ring-4 ring-primary/20 animate-node-glow'
            : 'bg-muted border-[3px] border-border/60 shadow-md cursor-default'
        }`}
      >
        {(isCompleted || isCurrent) && (
          <div className="absolute inset-[5px] rounded-full bg-primary flex items-center justify-center">
            {isCompleted ? (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span className="text-[32px] leading-none drop-shadow-md">{icon}</span>
            )}
          </div>
        )}

        {isLocked && (
          <span className="text-[30px] leading-none opacity-40 grayscale">{icon}</span>
        )}

        {isCurrent && (
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 border-[3px] border-background flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-[11px] font-black text-amber-900">!</span>
          </div>
        )}
      </button>

      <span className={`mt-3 text-[11px] font-extrabold uppercase tracking-wider ${
        isLocked ? 'text-muted-foreground/50' : isCompleted ? 'text-primary' : 'text-foreground'
      }`}>
        {label}
      </span>
    </div>
  );
}

function ChestNode({ locked, opened, onClick }: { locked: boolean; opened?: boolean; onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center" onClick={!locked ? onClick : undefined}>
      <div className={`w-[76px] h-[68px] rounded-2xl flex items-center justify-center border-[2.5px] transition-all duration-200 ${
        locked
          ? 'bg-muted border-border/60 cursor-default shadow-sm'
          : opened
          ? 'bg-primary/10 border-primary/30 cursor-pointer hover:scale-110 shadow-lg'
          : 'bg-amber-50 border-amber-300/50 cursor-pointer hover:scale-110 shadow-lg animate-bobble ring-2 ring-amber-200/30'
      }`}>
        <span className={`text-[30px] ${locked ? 'opacity-35 grayscale' : 'drop-shadow-md'}`}>
          {opened ? '📭' : '📦'}
        </span>
      </div>
      <span className={`mt-2.5 text-[10px] font-extrabold uppercase tracking-wider ${locked ? 'text-muted-foreground/50' : opened ? 'text-primary' : 'text-amber-500'}`}>
        {opened ? 'Coletado' : 'Bônus'}
      </span>
    </div>
  );
}

function TrophyNode({ status, onClick }: { status: 'completed' | 'current' | 'locked'; onClick?: () => void }) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  return (
    <div className="flex flex-col items-center" onClick={!isLocked ? onClick : undefined}>
      <div className={`w-[88px] h-[88px] rounded-full flex items-center justify-center border-[2.5px] transition-all duration-200 ${
        isCompleted
          ? 'border-amber-400/50 bg-amber-50 shadow-[0_6px_28px_rgba(245,158,11,0.25)] cursor-pointer hover:scale-110'
          : isCurrent
          ? 'border-amber-300/40 bg-amber-50/50 cursor-pointer hover:scale-110 animate-bobble shadow-lg ring-4 ring-amber-200/20 animate-node-glow'
          : 'border-dashed border-border/60 bg-muted/40 cursor-default shadow-sm'
      }`}>
        <span className={`text-[34px] ${isLocked ? 'opacity-25 grayscale' : 'drop-shadow-md'}`}>🏆</span>
      </div>
      <span className={`mt-3 text-[11px] font-extrabold uppercase tracking-wider ${
        isCompleted ? 'text-amber-500' : isCurrent ? 'text-amber-500' : 'text-muted-foreground/50'
      }`}>
        {isCompleted ? 'Aprovado!' : 'Prova Final'}
      </span>
    </div>
  );
}
