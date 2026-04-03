import { useState } from 'react';
import { Home, Target, User, Trophy, Award } from 'lucide-react';
import DailyMissions from './DailyMissions';
import { ACHIEVEMENTS, Achievement } from './ProfileScreen';

const FAKE_LEADERBOARD = [
  { rank: 1, name: 'Luna Silva', xp: 4200, streak: 14, badges: 7, avatar: '🦊' },
  { rank: 2, name: 'Pedro Tech', xp: 3800, streak: 11, badges: 6, avatar: '🐼' },
  { rank: 3, name: 'Ana Costa', xp: 3500, streak: 9, badges: 5, avatar: '🦉' },
  { rank: 4, name: 'Carlos IA', xp: 3100, streak: 8, badges: 5, avatar: '🐉' },
  { rank: 5, name: 'Mari Dev', xp: 2900, streak: 7, badges: 4, avatar: '🐱' },
  { rank: 6, name: 'João R.', xp: 2600, streak: 6, badges: 4, avatar: '🤖' },
  { rank: 7, name: 'Bia Santos', xp: 2300, streak: 5, badges: 3, avatar: '🐰' },
  { rank: 8, name: 'Lucas M.', xp: 2000, streak: 4, badges: 3, avatar: '🚀' },
  { rank: 9, name: 'Sofia L.', xp: 1700, streak: 3, badges: 2, avatar: '🌟' },
  { rank: 10, name: 'Rafa K.', xp: 1400, streak: 2, badges: 2, avatar: '🎯' },
];

interface SidebarProps {
  completedLessons: number[];
  activeTab: string;
  onNavigate: (tab: string) => void;
  playerXp?: number;
  playerStreak?: number;
  playerBadges?: number;
  playerName?: string;
  achievements?: Achievement[];
}

export default function RightSidebar({ completedLessons, activeTab, onNavigate, playerXp = 0, playerStreak = 0, playerBadges = 0, playerName = 'Você' }: SidebarProps) {
  const [missionsExpanded, setMissionsExpanded] = useState(true);
  const [rankingExpanded, setRankingExpanded] = useState(true);

  const navItems = [
    { id: 'map', icon: Home, label: 'Aprender' },
    { id: 'missions', icon: Target, label: 'Missões' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  // Find player's rank
  const playerRank = FAKE_LEADERBOARD.filter(u => u.xp > playerXp).length + 1;

  return (
    <div className="w-[280px] flex-shrink-0 h-screen sticky top-0 border-l border-border bg-card/50 overflow-y-auto">
      <div className="p-5 flex flex-col gap-3">
        {/* Nav items */}
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}

        <div className="h-px bg-border my-2" />

        {/* Inline Daily Missions */}
        <div>
          <button
            onClick={() => setMissionsExpanded(!missionsExpanded)}
            className="w-full flex items-center justify-between py-2 px-1 cursor-pointer"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Missões Diárias
            </span>
            <span className={`text-muted-foreground text-xs transition-transform duration-200 ${missionsExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {missionsExpanded && (
            <SidebarMissions completedLessons={completedLessons} />
          )}
        </div>

        <div className="h-px bg-border my-2" />

        {/* Ranking */}
        <div>
          <button
            onClick={() => setRankingExpanded(!rankingExpanded)}
            className="w-full flex items-center justify-between py-2 px-1 cursor-pointer"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              🏆 Ranking
            </span>
            <span className={`text-muted-foreground text-xs transition-transform duration-200 ${rankingExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {rankingExpanded && (
            <SidebarRanking playerXp={playerXp} playerName={playerName} playerRank={playerRank} />
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarRanking({ playerXp, playerName, playerRank }: { playerXp: number; playerName: string; playerRank: number }) {
  return (
    <div className="flex flex-col gap-1.5 mt-1 animate-slide-up">
      {FAKE_LEADERBOARD.slice(0, 5).map(user => (
        <RankRow key={user.rank} rank={user.rank} name={user.name} xp={user.xp} avatar={user.avatar} highlight={false} />
      ))}

      {/* Player row */}
      {playerRank > 5 && (
        <>
          <div className="text-center text-muted-foreground text-[10px] font-bold py-0.5">···</div>
          <RankRow rank={playerRank} name={playerName} xp={playerXp} avatar="⭐" highlight />
        </>
      )}
      {playerRank <= 5 && null}

      <div className="text-center mt-1">
        <span className="text-[10px] font-semibold text-muted-foreground">Sua posição: </span>
        <span className="text-[10px] font-extrabold text-primary">#{playerRank}</span>
      </div>
    </div>
  );
}

function RankRow({ rank, name, xp, avatar, highlight }: { rank: number; name: string; xp: number; avatar: string; highlight: boolean }) {
  const medalColors: Record<number, string> = {
    1: 'text-gold',
    2: 'text-muted-foreground',
    3: 'text-orange-400',
  };
  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div className={`flex items-center gap-2 py-2 px-2.5 rounded-lg transition-all ${
      highlight ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
    }`}>
      <span className={`text-[11px] font-black w-5 text-center ${medalColors[rank] || 'text-muted-foreground'}`}>
        {medals[rank] || `${rank}`}
      </span>
      <span className="text-sm">{avatar}</span>
      <span className={`text-[12px] font-semibold flex-1 truncate ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {name}
      </span>
      <span className="text-[10px] font-extrabold text-muted-foreground">{xp.toLocaleString()} XP</span>
    </div>
  );
}

// ── Ranking Full Screen (for mobile) ──
export function RankingScreen({ playerXp, playerStreak, playerBadges, playerName, onClose }: {
  playerXp: number; playerStreak: number; playerBadges: number; playerName: string; onClose: () => void;
}) {
  const [sortBy, setSortBy] = useState<'xp' | 'streak' | 'badges'>('xp');

  const sorted = [...FAKE_LEADERBOARD].sort((a, b) => {
    if (sortBy === 'streak') return b.streak - a.streak;
    if (sortBy === 'badges') return b.badges - a.badges;
    return b.xp - a.xp;
  }).map((u, i) => ({ ...u, rank: i + 1 }));

  const playerVal = sortBy === 'xp' ? playerXp : sortBy === 'streak' ? playerStreak : playerBadges;
  const playerRank = sorted.filter(u => {
    const val = sortBy === 'xp' ? u.xp : sortBy === 'streak' ? u.streak : u.badges;
    return val > playerVal;
  }).length + 1;

  const getVal = (u: typeof FAKE_LEADERBOARD[0]) => {
    if (sortBy === 'streak') return `${u.streak} 🔥`;
    if (sortBy === 'badges') return `${u.badges} 🏅`;
    return `${u.xp.toLocaleString()} XP`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <div className="w-full max-w-[460px] px-5 pt-6 pb-24">
        <button onClick={onClose} className="text-muted-foreground text-sm font-bold flex items-center gap-1 mb-4 hover:text-foreground transition-colors cursor-pointer">
          ← Voltar
        </button>

        <h1 className="font-display text-xl font-bold text-foreground mb-1">🏆 Ranking</h1>
        <p className="text-[12px] text-muted-foreground mb-4">Top 10 estudantes desta semana</p>

        {/* Sort tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-5">
          {([
            { key: 'xp' as const, label: '⚡ XP' },
            { key: 'streak' as const, label: '🔥 Streak' },
            { key: 'badges' as const, label: '🏅 Badges' },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                sortBy === tab.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Podium top 3 */}
        <div className="flex items-end justify-center gap-3 mb-6">
          {[sorted[1], sorted[0], sorted[2]].map((user, idx) => {
            if (!user) return null;
            const heights = ['h-20', 'h-28', 'h-16'];
            const sizes = ['text-2xl', 'text-3xl', 'text-2xl'];
            const medals = ['🥈', '🥇', '🥉'];
            return (
              <div key={user.rank} className="flex flex-col items-center">
                <span className={sizes[idx]}>{user.avatar}</span>
                <span className="text-[11px] font-bold text-foreground mt-1 truncate max-w-[80px]">{user.name}</span>
                <span className="text-[10px] font-extrabold text-primary">{getVal(user)}</span>
                <div className={`${heights[idx]} w-20 rounded-t-xl mt-2 flex items-start justify-center pt-2`}
                  style={{ background: idx === 1 ? 'linear-gradient(180deg, hsl(var(--gold)/0.3), hsl(var(--gold)/0.05))' : 'hsl(var(--muted))' }}>
                  <span className="text-xl">{medals[idx]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="flex flex-col gap-2">
          {sorted.map(user => (
            <div key={user.rank} className="flex items-center gap-3 bg-card border border-border rounded-xl py-3 px-4">
              <span className="text-[12px] font-black w-6 text-center text-muted-foreground">
                {user.rank <= 3 ? ['🥇','🥈','🥉'][user.rank - 1] : `#${user.rank}`}
              </span>
              <span className="text-lg">{user.avatar}</span>
              <span className="text-[13px] font-semibold text-foreground flex-1 truncate">{user.name}</span>
              <span className="text-[11px] font-extrabold text-primary">{getVal(user)}</span>
            </div>
          ))}

          {/* Player */}
          {playerRank > 10 && (
            <>
              <div className="text-center text-muted-foreground text-xs font-bold py-1">···</div>
              <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl py-3 px-4">
                <span className="text-[12px] font-black w-6 text-center text-primary">#{playerRank}</span>
                <span className="text-lg">⭐</span>
                <span className="text-[13px] font-semibold text-primary flex-1 truncate">{playerName} (você)</span>
                <span className="text-[11px] font-extrabold text-primary">
                  {sortBy === 'xp' ? `${playerXp.toLocaleString()} XP` : sortBy === 'streak' ? `${playerStreak} 🔥` : `${playerBadges} 🏅`}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarMissions({ completedLessons }: { completedLessons: number[] }) {
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  const missions = [
    { id: 'm1', icon: '📚', title: 'Estudante dedicado', desc: 'Complete 1 lição', current: completedLessons.length, target: 1, xp: 20 },
    { id: 'm2', icon: '🎯', title: 'Mira perfeita', desc: 'Acerte 5 seguidas', current: 0, target: 5, xp: 30 },
    { id: 'm3', icon: '⚡', title: 'Caçador de XP', desc: 'Ganhe 50 XP', current: 0, target: 50, xp: 25 },
    { id: 'm4', icon: '🔥', title: 'Em chamas', desc: 'Combo de 3x', current: 0, target: 3, xp: 15 },
  ];

  return (
    <div className="flex flex-col gap-2 mt-1 animate-slide-up">
      {missions.map(m => {
        const progress = Math.min(m.current / m.target, 1) * 100;
        const done = m.current >= m.target;
        const claimed = claimedIds.includes(m.id);

        return (
          <div key={m.id} className={`rounded-xl border p-3 transition-all ${
            claimed ? 'bg-green/[0.05] border-green/20 opacity-50' :
            done ? 'bg-gold/[0.05] border-gold/25' :
            'bg-background border-border'
          }`}>
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`text-base ${claimed ? '' : done ? '' : 'opacity-70'}`}>
                {claimed ? '✅' : m.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-[12px] font-bold leading-tight ${claimed ? 'text-green line-through' : 'text-foreground'}`}>
                  {m.title}
                </div>
                <div className="text-[10px] text-muted-foreground">{m.desc}</div>
              </div>
              <span className="text-[10px] font-extrabold text-primary">+{m.xp}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: claimed ? 'hsl(var(--green))' : done ? 'hsl(var(--gold))' : 'hsl(var(--primary))',
                  }} />
              </div>
              <span className="text-[9px] font-bold text-muted-foreground">{Math.min(m.current, m.target)}/{m.target}</span>
              {done && !claimed && (
                <button
                  onClick={() => setClaimedIds(p => [...p, m.id])}
                  className="text-[9px] font-extrabold text-gold bg-gold/10 rounded-lg py-1 px-2 cursor-pointer hover:bg-gold/20 transition-all"
                >
                  Coletar
                </button>
              )}
            </div>
          </div>
        );
      })}

      <div className="text-center text-[10px] text-muted-foreground font-semibold mt-1">
        ⏱ Renova em 14h 32m
      </div>
    </div>
  );
}
