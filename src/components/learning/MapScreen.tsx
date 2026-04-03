import { PlayerState, Section } from './types';
import { AVATARS } from './ProfileScreen';
import FloatingParticles from './FloatingParticles';
import { BIOMES } from './BiomeBackground';
import { Flame, Zap, Crown } from 'lucide-react';

const LEAGUE_TIERS = [
  { id: 'bronze', minXp: 0, label: 'Bronze', icon: '🥉', frameClass: 'avatar-frame-bronze' },
  { id: 'silver', minXp: 1000, label: 'Prata', icon: '🥈', frameClass: 'avatar-frame-silver' },
  { id: 'gold', minXp: 3000, label: 'Ouro', icon: '🥇', frameClass: 'avatar-frame-gold' },
  { id: 'diamond', minXp: 6000, label: 'Diamante', icon: '💎', frameClass: 'avatar-frame-diamond' },
];

function getLeagueTier(xp: number) {
  return [...LEAGUE_TIERS].reverse().find(t => xp >= t.minXp) || LEAGUE_TIERS[0];
}

/* Duolingo-style section colors */
const SECTION_COLORS = [
  { bg: 'hsl(152 68% 38%)', bgLight: 'hsl(152 68% 45%)', shadow: 'hsl(152 68% 28%)', ring: 'hsl(152 68% 55%)' },
  { bg: 'hsl(25 80% 50%)', bgLight: 'hsl(25 80% 58%)', shadow: 'hsl(25 80% 38%)', ring: 'hsl(25 80% 65%)' },
  { bg: 'hsl(252 85% 58%)', bgLight: 'hsl(252 85% 65%)', shadow: 'hsl(252 85% 42%)', ring: 'hsl(252 85% 72%)' },
  { bg: 'hsl(200 80% 45%)', bgLight: 'hsl(200 80% 55%)', shadow: 'hsl(200 80% 32%)', ring: 'hsl(200 80% 62%)' },
  { bg: 'hsl(0 72% 50%)', bgLight: 'hsl(0 72% 58%)', shadow: 'hsl(0 72% 38%)', ring: 'hsl(0 72% 65%)' },
  { bg: 'hsl(195 70% 50%)', bgLight: 'hsl(195 70% 58%)', shadow: 'hsl(195 70% 38%)', ring: 'hsl(195 70% 62%)' },
  { bg: 'hsl(80 65% 40%)', bgLight: 'hsl(80 65% 50%)', shadow: 'hsl(80 65% 28%)', ring: 'hsl(80 65% 55%)' },
];

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
  const xPositions = [50, 30, 70, 35, 65];
  lessons.forEach((l, i) => {
    nodes.push({ id: i, icon: l.icon, label: `Lição ${i + 1}`, x: xPositions[i % xPositions.length], type: 'lesson' });
    if (i === 1) nodes.push({ id: -1, icon: '📦', label: 'Bônus', x: 55, type: 'chest' });
  });
  nodes.push({ id: -2, icon: '🏆', label: 'Prova Final', x: 50, type: 'trophy' });
  return nodes;
}

const NODE_SPACING = 130;

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
      
      {/* ═══ HEADER — Duolingo style ═══ */}
      <div className="w-full max-w-[460px] px-4 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-30 border-b border-border/50">
        <button onClick={onOpenProfile} className="flex items-center gap-2.5">
          <div className="relative">
            <div className={`avatar-frame ${league.frameClass} w-11 h-11 rounded-full overflow-hidden shadow-md`}>
              <img src={avatarData.src} alt={avatarData.name} width={44} height={44} className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-card border-2 border-background flex items-center justify-center text-[9px]">
              {league.icon}
            </div>
          </div>
          <div className="text-left">
            <div className="text-[13px] font-extrabold text-foreground leading-tight">{playerName || 'Estudante IA'}</div>
            <div className="text-[10px] font-bold text-muted-foreground">Nível {player.level}</div>
          </div>
        </button>
        <div className="flex items-center gap-1.5">
          <div className="duo-stat-pill bg-orange-50 border-orange-200 text-orange-500">
            <Flame className="w-4 h-4" />{player.streak}
          </div>
          <div className="duo-stat-pill bg-primary/5 border-primary/20 text-primary">
            <Zap className="w-4 h-4" />{player.xp}
          </div>
          <div className="duo-stat-pill bg-amber-50 border-amber-200 text-amber-500">
            <Crown className="w-4 h-4" />{league.icon}
          </div>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="w-full max-w-[460px] px-5 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700 bg-primary" style={{ width: `${levelProgress}%` }} />
          </div>
          <span className="text-[11px] font-extrabold text-muted-foreground whitespace-nowrap">
            {player.currentXp}/{player.nextLevelXp}
          </span>
        </div>
      </div>

      {/* ═══ ALL SECTIONS ═══ */}
      {sections.map((section, sIdx) => {
        const unlocked = isSectionUnlocked(sIdx);
        const biome = BIOMES[sIdx % BIOMES.length];
        const colors = SECTION_COLORS[sIdx % SECTION_COLORS.length];
        const mapNodes = buildMapNodes(section);
        const sectionChestOpened = player.chestsOpened[section.id] || false;

        return (
          <div key={section.id} className="w-full max-w-[460px] mt-4">
            {/* Section Banner — Duolingo style full-width colored bar */}
            <div
              className="mx-4 rounded-2xl px-5 py-4 flex items-center justify-between transition-opacity"
              style={{ background: biome.bannerGradient, opacity: unlocked ? 1 : 0.5 }}
            >
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/60">
                  {biome.icon} {section.label}
                </div>
                <div className="text-[17px] font-extrabold text-white mt-0.5">{section.title}</div>
              </div>
              <div className="rounded-xl bg-white/20 hover:bg-white/30 transition-colors px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white cursor-pointer">
                {unlocked ? '📋 Guia' : '🔒'}
              </div>
            </div>

            {/* Map nodes */}
            {unlocked ? (
              <div className="relative mt-1 pt-16 pb-4 px-4" style={{ minHeight: `${mapNodes.length * NODE_SPACING + 90}px` }}>
                {/* Dotted path lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[0]" preserveAspectRatio="none">
                  {mapNodes.map((node, i) => {
                    if (i === 0) return null;
                    const prev = mapNodes[i - 1];
                    const y0 = (i - 1) * NODE_SPACING + 50;
                    const y1 = i * NODE_SPACING + 20;
                    const x0 = (prev.x / 100) * 100;
                    const x1 = (node.x / 100) * 100;
                    const status = getSectionStatus(section.id, prev.id);
                    const nextStatus = getSectionStatus(section.id, node.id);
                    const done = status === 'completed';
                    const isActive = status === 'current' || (done && nextStatus === 'current');
                    const midY = (y0 + y1) / 2;
                    const d = `M ${x0}% ${y0} C ${x0}% ${midY}, ${x1}% ${midY}, ${x1}% ${y1}`;
                    return (
                      <path key={i} d={d} fill="none" strokeWidth="5" strokeLinecap="round"
                        strokeDasharray={done || isActive ? 'none' : '6 10'}
                        stroke={done ? colors.bg : isActive ? colors.bg : 'hsl(var(--border))'}
                        opacity={done ? 0.5 : isActive ? 0.4 : 0.25}
                      />
                    );
                  })}
                </svg>

                {/* Nodes */}
                {mapNodes.map((node, i) => {
                  const status = getSectionStatus(section.id, node.id);
                  return (
                    <div key={i} className="absolute z-[2]" style={{ top: `${i * NODE_SPACING}px`, left: `${node.x}%`, transform: 'translateX(-50%)' }}>
                      {node.type === 'chest' ? (
                        <DuoChestNode locked={status === 'locked'} opened={sectionChestOpened} colors={colors}
                          onClick={() => { if (status !== 'locked' && onOpenChest) { onSectionChange?.(sIdx); onOpenChest(); } }} />
                      ) : node.type === 'trophy' ? (
                        <DuoTrophyNode status={status} colors={colors}
                          onClick={() => { if (status !== 'locked' && onOpenFinalTest) { onSectionChange?.(sIdx); onOpenFinalTest(); } }} />
                      ) : (
                        <DuoLessonNode
                          icon={node.icon} label={node.label} status={status} colors={colors}
                          isFirst={i === 0 && status === 'current'}
                          onClick={() => { if (status !== 'locked' && node.id >= 0) { onSectionChange?.(sIdx); onSelectLesson(sIdx, node.id); } }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative mt-1 pb-4 px-4 opacity-50 grayscale pointer-events-none" style={{ minHeight: `${mapNodes.length * NODE_SPACING + 30}px` }}>
                {/* Ghost dotted paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[0]" preserveAspectRatio="none">
                  {mapNodes.map((node, i) => {
                    if (i === 0) return null;
                    const prev = mapNodes[i - 1];
                    const y0 = (i - 1) * NODE_SPACING + 50;
                    const y1 = i * NODE_SPACING + 20;
                    const x0 = (prev.x / 100) * 100;
                    const x1 = (node.x / 100) * 100;
                    const midY = (y0 + y1) / 2;
                    const d = `M ${x0}% ${y0} C ${x0}% ${midY}, ${x1}% ${midY}, ${x1}% ${y1}`;
                    return <path key={i} d={d} fill="none" strokeWidth="5" strokeLinecap="round" strokeDasharray="6 10" stroke="hsl(var(--border))" opacity="0.4" />;
                  })}
                </svg>

                {/* Ghost nodes in actual positions */}
                {mapNodes.map((node, i) => (
                  <div key={i} className="absolute z-[2]" style={{ top: `${i * NODE_SPACING}px`, left: `${node.x}%`, transform: 'translateX(-50%)' }}>
                    <div className="flex flex-col items-center">
                      <div
                        className={node.type === 'chest' ? 'duo-node-chest' : 'duo-node'}
                        style={{
                          background: 'hsl(var(--muted))',
                          boxShadow: '0 6px 0 hsl(var(--border))',
                        }}
                      >
                        {node.type !== 'chest' ? (
                          <div className="duo-node-inner" style={{ background: 'hsl(var(--muted))' }}>
                            <span className="text-[28px] opacity-40">{node.icon}</span>
                          </div>
                        ) : (
                          <span className="text-[24px] opacity-40">{node.icon}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="h-16" />
    </div>
  );
}

/* ═══ Duolingo-style Node Components ═══ */

interface DuoColors {
  bg: string;
  bgLight: string;
  shadow: string;
  ring: string;
}

function DuoLessonNode({ icon, label, status, colors, isFirst, onClick }: {
  icon: string; label: string; status: 'completed' | 'current' | 'locked'; colors: DuoColors; isFirst: boolean; onClick: () => void;
}) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';

  return (
    <div className="relative flex flex-col items-center">
      {/* COMEÇAR speech bubble */}
      {isFirst && (
        <div className="absolute -top-[52px] left-1/2 -translate-x-1/2 z-20">
          <div className="duo-speech-bubble" style={{ background: colors.bg }}>
            COMEÇAR
            <div className="duo-speech-arrow" style={{ borderTopColor: colors.bg }} />
          </div>
        </div>
      )}

      <button
        onClick={onClick}
        disabled={isLocked}
        className={`duo-node ${isCurrent ? 'animate-duo-bounce' : ''}`}
        style={{
          background: isLocked ? 'hsl(var(--muted))' : colors.bg,
          boxShadow: isLocked
            ? '0 6px 0 hsl(var(--border))'
            : `0 6px 0 ${colors.shadow}`,
          cursor: isLocked ? 'default' : 'pointer',
        }}
      >
        <div
          className="duo-node-inner"
          style={{
            background: isLocked ? 'hsl(var(--muted))' : colors.bgLight,
          }}
        >
          {isCompleted ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : isLocked ? (
            <span className="text-[28px] opacity-40 grayscale">{icon}</span>
          ) : (
            <span className="text-[30px] drop-shadow-sm">{icon}</span>
          )}
        </div>

        {/* Active indicator ring */}
        {isCurrent && (
          <div className="absolute inset-[-6px] rounded-full border-[4px] animate-pulse opacity-60" style={{ borderColor: colors.ring }} />
        )}
      </button>

      <span className={`mt-2.5 text-[10px] font-extrabold uppercase tracking-wider ${
        isLocked ? 'text-muted-foreground/40' : isCompleted ? 'opacity-70' : ''
      }`} style={{ color: isLocked ? undefined : colors.bg }}>
        {label}
      </span>
    </div>
  );
}

function DuoChestNode({ locked, opened, colors, onClick }: { locked: boolean; opened?: boolean; colors: DuoColors; onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center" onClick={!locked ? onClick : undefined}>
      <div
        className={`duo-node-chest ${!locked && !opened ? 'animate-duo-bounce' : ''}`}
        style={{
          background: locked ? 'hsl(var(--muted))' : opened ? colors.bgLight : 'hsl(40 96% 53%)',
          boxShadow: locked
            ? '0 5px 0 hsl(var(--border))'
            : opened
            ? `0 5px 0 ${colors.shadow}`
            : '0 5px 0 hsl(40 96% 38%)',
          cursor: locked ? 'default' : 'pointer',
        }}
      >
        <span className={`text-[26px] ${locked ? 'opacity-35 grayscale' : ''}`}>
          {opened ? '📭' : '📦'}
        </span>
      </div>
      <span className={`mt-2 text-[10px] font-extrabold uppercase tracking-wider ${
        locked ? 'text-muted-foreground/40' : opened ? 'text-muted-foreground' : 'text-amber-500'
      }`}>
        {opened ? 'Coletado' : 'Bônus'}
      </span>
    </div>
  );
}

function DuoTrophyNode({ status, colors, onClick }: { status: 'completed' | 'current' | 'locked'; colors: DuoColors; onClick?: () => void }) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  return (
    <div className="flex flex-col items-center" onClick={!isLocked ? onClick : undefined}>
      <div
        className={`duo-node ${isCurrent ? 'animate-duo-bounce' : ''}`}
        style={{
          background: isLocked ? 'hsl(var(--muted))' : 'hsl(40 96% 53%)',
          boxShadow: isLocked
            ? '0 6px 0 hsl(var(--border))'
            : '0 6px 0 hsl(40 96% 38%)',
          cursor: isLocked ? 'default' : 'pointer',
        }}
      >
        <div
          className="duo-node-inner"
          style={{
            background: isLocked ? 'hsl(var(--muted))' : 'hsl(40 96% 58%)',
          }}
        >
          <span className={`text-[32px] ${isLocked ? 'opacity-25 grayscale' : ''}`}>🏆</span>
        </div>

        {isCurrent && (
          <div className="absolute inset-[-6px] rounded-full border-[4px] border-amber-300 animate-pulse opacity-60" />
        )}
      </div>

      <span className={`mt-2.5 text-[10px] font-extrabold uppercase tracking-wider ${
        isCompleted ? 'text-amber-500' : isCurrent ? 'text-amber-500' : 'text-muted-foreground/40'
      }`}>
        {isCompleted ? '✅ Aprovado!' : 'Prova Final'}
      </span>
    </div>
  );
}
