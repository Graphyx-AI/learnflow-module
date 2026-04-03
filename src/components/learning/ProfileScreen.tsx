import { useState } from 'react';
import { Trophy, BarChart3, UserCircle, Pencil, Check, Zap, Flame, Award, BookOpen, Target, TrendingUp, Lock, CheckCircle } from 'lucide-react';

import avatarRobot from '@/assets/avatars/avatar-robot.png';
import avatarCat from '@/assets/avatars/avatar-cat.png';
import avatarOwl from '@/assets/avatars/avatar-owl.png';
import avatarFox from '@/assets/avatars/avatar-fox.png';
import avatarPanda from '@/assets/avatars/avatar-panda.png';
import avatarAstro from '@/assets/avatars/avatar-astro.png';
import avatarDragon from '@/assets/avatars/avatar-dragon.png';
import avatarBunny from '@/assets/avatars/avatar-bunny.png';

export const AVATARS = [
  { id: 'robot', src: avatarRobot, name: 'Robô' },
  { id: 'cat', src: avatarCat, name: 'Gatinho' },
  { id: 'owl', src: avatarOwl, name: 'Coruja' },
  { id: 'fox', src: avatarFox, name: 'Raposa' },
  { id: 'panda', src: avatarPanda, name: 'Panda' },
  { id: 'astro', src: avatarAstro, name: 'Astronauta' },
  { id: 'dragon', src: avatarDragon, name: 'Dragão' },
  { id: 'bunny', src: avatarBunny, name: 'Coelha' },
];

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', icon: '🚀', title: 'Primeiro Passo', description: 'Complete sua primeira lição', unlocked: false, rarity: 'common' },
  { id: 'a2', icon: '🔥', title: 'Em Chamas', description: 'Atinja um combo de 3x', unlocked: false, rarity: 'common' },
  { id: 'a3', icon: '🎯', title: 'Precisão Total', description: 'Complete uma lição com 100% de acerto', unlocked: false, rarity: 'rare' },
  { id: 'a4', icon: '💎', title: 'Caçador de XP', description: 'Acumule 500 XP', unlocked: false, rarity: 'rare' },
  { id: 'a5', icon: '⚡', title: 'Velocista', description: 'Complete uma lição sem errar', unlocked: false, rarity: 'epic' },
  { id: 'a6', icon: '👑', title: 'Mestre da IA', description: 'Complete todas as lições da Seção 1', unlocked: false, rarity: 'legendary' },
  { id: 'a7', icon: '🧠', title: 'Mente Curiosa', description: 'Acerte 20 questões no total', unlocked: false, rarity: 'common' },
  { id: 'a8', icon: '🏆', title: 'Imparável', description: 'Mantenha um streak de 7 dias', unlocked: false, rarity: 'epic' },
];

const RARITY_STYLES = {
  common: { border: 'border-border', bg: 'bg-muted/50', label: 'Comum', labelColor: 'text-muted-foreground' },
  rare: { border: 'border-primary/30', bg: 'bg-primary/[0.04]', label: 'Raro', labelColor: 'text-primary' },
  epic: { border: 'border-secondary/30', bg: 'bg-secondary/[0.04]', label: 'Épico', labelColor: 'text-secondary' },
  legendary: { border: 'border-gold/30', bg: 'bg-gold/[0.04]', label: 'Lendário', labelColor: 'text-gold' },
};

interface ProfileScreenProps {
  player: {
    xp: number;
    streak: number;
    level: number;
    levelTitle: string;
    completedLessons: number[];
  };
  selectedAvatar: string;
  onSelectAvatar: (id: string) => void;
  playerName: string;
  onChangeName: (name: string) => void;
  onClose: () => void;
}

export default function ProfileScreen({ player, selectedAvatar, onSelectAvatar, playerName, onChangeName, onClose }: ProfileScreenProps) {
  const [tab, setTab] = useState<'badges' | 'stats' | 'avatar'>('badges');
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);

  const currentAvatar = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];

  const achievements: Achievement[] = ACHIEVEMENTS.map(a => {
    let unlocked = false;
    if (a.id === 'a1') unlocked = player.completedLessons.length >= 1;
    if (a.id === 'a4') unlocked = player.xp >= 500;
    if (a.id === 'a7') unlocked = player.completedLessons.length >= 3;
    if (a.id === 'a8') unlocked = player.streak >= 7;
    return { ...a, unlocked, unlockedAt: unlocked ? 'Hoje' : undefined };
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="flex flex-col items-center min-h-screen bg-background relative overflow-x-hidden">
      {/* Header */}
      <div className="w-full max-w-[460px] px-5 pt-6 pb-4 relative z-10">
        <button onClick={onClose} className="text-muted-foreground text-sm font-bold flex items-center gap-1 mb-4 hover:text-foreground transition-colors cursor-pointer">
          ← Voltar
        </button>

        {/* Profile card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg bg-muted flex items-center justify-center">
              <img src={currentAvatar.src} alt={currentAvatar.name} width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div>
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { onChangeName(nameInput.trim() || playerName); setEditing(false); } }}
                    className="font-display text-xl font-bold text-foreground bg-muted rounded-lg px-2 py-1 outline-none border border-primary/30 w-40"
                    autoFocus
                    maxLength={20}
                  />
                  <button
                    onClick={() => { onChangeName(nameInput.trim() || playerName); setEditing(false); }}
                    className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-foreground">{playerName}</h2>
                  <button
                    onClick={() => { setNameInput(playerName); setEditing(true); }}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold bg-primary/10 text-primary py-0.5 px-2 rounded-full">
                  Nível {player.level}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">{player.levelTitle}</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <QuickStat icon={<Zap className="w-4 h-4 text-primary" />} value={player.xp} label="XP Total" />
            <QuickStat icon={<Flame className="w-4 h-4 text-orange-500" />} value={player.streak} label="Streak" />
            <QuickStat icon={<Award className="w-4 h-4 text-amber-500" />} value={unlockedCount} label="Badges" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-[460px] px-5 mt-2 relative z-10">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setTab('badges')}
            className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'badges' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <Trophy className="w-4 h-4" /> Conquistas
          </button>
          <button
            onClick={() => setTab('stats')}
            className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'stats' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Stats
          </button>
          <button
            onClick={() => setTab('avatar')}
            className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'avatar' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <UserCircle className="w-4 h-4" /> Avatar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[460px] px-5 mt-4 pb-10 relative z-10">
        {tab === 'badges' ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                {unlockedCount}/{achievements.length} desbloqueadas
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map(a => (
                <BadgeCard key={a.id} achievement={a} />
              ))}
            </div>
          </>
        ) : tab === 'stats' ? (
          <div className="flex flex-col gap-3">
            <StatRow icon={<BookOpen className="w-[18px] h-[18px] text-blue-500" />} label="Lições completas" value={player.completedLessons.length} />
            <StatRow icon={<Zap className="w-[18px] h-[18px] text-primary" />} label="XP total" value={player.xp} />
            <StatRow icon={<Flame className="w-[18px] h-[18px] text-orange-500" />} label="Maior streak" value={`${player.streak} dias`} />
            <StatRow icon={<Target className="w-[18px] h-[18px] text-emerald-500" />} label="Questões respondidas" value={player.completedLessons.length * 8} />
            <StatRow icon={<Trophy className="w-[18px] h-[18px] text-amber-500" />} label="Conquistas" value={`${unlockedCount}/${achievements.length}`} />
            <StatRow icon={<TrendingUp className="w-[18px] h-[18px] text-violet-500" />} label="Nível atual" value={`${player.level} — ${player.levelTitle}`} />
          </div>
        ) : (
          <>
            <p className="text-[13px] text-muted-foreground font-semibold mb-4 text-center">
              Escolha seu companheiro de estudos!
            </p>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => onSelectAvatar(avatar.id)}
                  className={`group relative rounded-2xl border-[2.5px] p-2 transition-all cursor-pointer hover:scale-105 ${
                    selectedAvatar === avatar.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted/30">
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className={`text-[11px] font-bold text-center mt-1.5 ${
                    selectedAvatar === avatar.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {avatar.name}
                  </p>
                  {selectedAvatar === avatar.id && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-[10px] text-primary-foreground">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function QuickStat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-muted/50 rounded-xl p-3 text-center">
      <div className="flex justify-center">{icon}</div>
      <div className="text-lg font-black text-foreground mt-0.5">{value}</div>
      <div className="text-[10px] font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

function BadgeCard({ achievement }: { achievement: Achievement }) {
  const style = RARITY_STYLES[achievement.rarity];
  return (
    <div className={`rounded-2xl border-[1.5px] p-4 transition-all ${style.border} ${
      achievement.unlocked ? style.bg : 'bg-muted/30 opacity-50 grayscale'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <span className={`text-3xl ${achievement.unlocked ? 'drop-shadow-sm' : 'opacity-40'}`}>
          {achievement.unlocked ? achievement.icon : <Lock className="w-7 h-7 text-muted-foreground" />}
        </span>
        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.border} ${style.labelColor}`}>
          {style.label}
        </span>
      </div>
      <h4 className="font-display text-[13px] font-bold text-foreground mb-0.5">{achievement.title}</h4>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{achievement.description}</p>
      {achievement.unlocked && achievement.unlockedAt && (
        <div className="mt-2 text-[10px] font-semibold text-green flex items-center gap-1">
          ✅ {achievement.unlockedAt}
        </div>
      )}
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-[13px] font-semibold text-foreground">{label}</span>
      </div>
      <span className="text-[14px] font-extrabold text-primary">{value}</span>
    </div>
  );
}
