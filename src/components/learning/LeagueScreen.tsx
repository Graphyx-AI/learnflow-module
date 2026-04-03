import { useState, useEffect } from 'react';
import { Shield, ChevronUp, ChevronDown, Minus } from 'lucide-react';

const LEAGUES = [
  { id: 'bronze', name: 'Bronze', icon: '🥉', color: 'from-amber-700 to-amber-600', border: 'border-amber-600/30', bg: 'bg-amber-900/10', text: 'text-amber-600', minXp: 0 },
  { id: 'silver', name: 'Prata', icon: '🥈', color: 'from-slate-400 to-slate-300', border: 'border-slate-400/30', bg: 'bg-slate-400/10', text: 'text-slate-500', minXp: 1000 },
  { id: 'gold', name: 'Ouro', icon: '🥇', color: 'from-yellow-500 to-amber-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-600', minXp: 3000 },
  { id: 'diamond', name: 'Diamante', icon: '💎', color: 'from-cyan-400 to-blue-400', border: 'border-cyan-400/30', bg: 'bg-cyan-400/10', text: 'text-cyan-500', minXp: 6000 },
];

const LEAGUE_PLAYERS: Record<string, { name: string; xp: number; avatar: string }[]> = {
  bronze: [
    { name: 'Bia Santos', xp: 680, avatar: '🐰' },
    { name: 'Lucas M.', xp: 520, avatar: '🚀' },
    { name: 'Rafa K.', xp: 410, avatar: '🎯' },
    { name: 'Sofia L.', xp: 350, avatar: '🌟' },
    { name: 'Dani P.', xp: 290, avatar: '🦋' },
  ],
  silver: [
    { name: 'João R.', xp: 1800, avatar: '🤖' },
    { name: 'Mari Dev', xp: 1650, avatar: '🐱' },
    { name: 'Thiago B.', xp: 1400, avatar: '🦅' },
    { name: 'Clara V.', xp: 1200, avatar: '🌸' },
    { name: 'Felipe N.', xp: 1100, avatar: '⚡' },
  ],
  gold: [
    { name: 'Pedro Tech', xp: 4200, avatar: '🐼' },
    { name: 'Ana Costa', xp: 3800, avatar: '🦉' },
    { name: 'Carlos IA', xp: 3500, avatar: '🐉' },
    { name: 'Luana F.', xp: 3300, avatar: '🎭' },
    { name: 'Marcos S.', xp: 3100, avatar: '🏆' },
  ],
  diamond: [
    { name: 'Luna Silva', xp: 8500, avatar: '🦊' },
    { name: 'Alex Pro', xp: 7800, avatar: '👑' },
    { name: 'Gabi ML', xp: 7200, avatar: '🔮' },
    { name: 'Leo AI', xp: 6800, avatar: '🧠' },
    { name: 'Nina Dev', xp: 6500, avatar: '💫' },
  ],
};

function getPlayerLeague(xp: number) {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (xp >= LEAGUES[i].minXp) return LEAGUES[i];
  }
  return LEAGUES[0];
}

function getNextLeague(currentId: string) {
  const idx = LEAGUES.findIndex(l => l.id === currentId);
  return idx < LEAGUES.length - 1 ? LEAGUES[idx + 1] : null;
}

interface LeagueScreenProps {
  playerXp: number;
  playerName: string;
  onClose: () => void;
}

export default function LeagueScreen({ playerXp, playerName, onClose }: LeagueScreenProps) {
  const league = getPlayerLeague(playerXp);
  const nextLeague = getNextLeague(league.id);
  const leaguePlayers = LEAGUE_PLAYERS[league.id] || [];

  // Sort all players including the user
  const allPlayers = [
    ...leaguePlayers.map(p => ({ ...p, isPlayer: false })),
    { name: playerName, xp: playerXp, avatar: '⭐', isPlayer: true },
  ].sort((a, b) => b.xp - a.xp).map((p, i) => ({ ...p, rank: i + 1 }));

  // Top 3 promote, bottom 3 demote
  const totalPlayers = allPlayers.length;

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <div className="w-full max-w-[460px] px-5 pt-6 pb-24">
        <button onClick={onClose} className="text-muted-foreground text-sm font-bold flex items-center gap-1 mb-4 hover:text-foreground transition-colors cursor-pointer">
          ← Voltar
        </button>

        {/* League header */}
        <div className={`rounded-2xl border ${league.border} overflow-hidden mb-6`}>
          <div className={`bg-gradient-to-r ${league.color} p-6 text-center`}>
            <div className="text-5xl mb-2">{league.icon}</div>
            <h1 className="font-display text-2xl font-bold text-white">Liga {league.name}</h1>
            <p className="text-white/70 text-[12px] font-semibold mt-1">Semana 12 · Termina em 3 dias</p>
          </div>

          {nextLeague && (
            <div className={`${league.bg} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${league.text}`} />
                <span className="text-[12px] font-bold text-foreground">Próxima liga: <strong className={league.text}>{nextLeague.name} {nextLeague.icon}</strong></span>
              </div>
              <span className="text-[11px] font-extrabold text-muted-foreground">
                {Math.max(0, nextLeague.minXp - playerXp)} XP restantes
              </span>
            </div>
          )}
        </div>

        {/* Zones legend */}
        <div className="flex gap-3 mb-4 justify-center">
          <div className="flex items-center gap-1.5">
            <ChevronUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground">Promoção (Top 3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground">Permanece</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChevronDown className="w-3.5 h-3.5 text-destructive" />
            <span className="text-[10px] font-bold text-muted-foreground">Rebaixamento</span>
          </div>
        </div>

        {/* Player list */}
        <div className="flex flex-col gap-2">
          {allPlayers.map((p) => {
            const isPromo = p.rank <= 3;
            const isDemo = p.rank > totalPlayers - 2;
            const zone = isPromo ? 'promo' : isDemo ? 'demo' : 'stay';

            return (
              <div key={p.name} className={`flex items-center gap-3 rounded-xl py-3 px-4 transition-all ${
                p.isPlayer
                  ? 'bg-primary/10 border-[1.5px] border-primary/25'
                  : zone === 'promo'
                  ? 'bg-primary/[0.03] border border-primary/10'
                  : zone === 'demo'
                  ? 'bg-destructive/[0.03] border border-destructive/10'
                  : 'bg-card border border-border'
              }`}>
                {/* Rank */}
                <div className="w-7 text-center">
                  {p.rank <= 3 ? (
                    <span className="text-sm">{['🥇','🥈','🥉'][p.rank - 1]}</span>
                  ) : (
                    <span className="text-[12px] font-black text-muted-foreground">#{p.rank}</span>
                  )}
                </div>

                {/* Zone indicator */}
                <div className="w-4">
                  {zone === 'promo' && <ChevronUp className="w-3.5 h-3.5 text-primary" />}
                  {zone === 'demo' && <ChevronDown className="w-3.5 h-3.5 text-destructive" />}
                </div>

                {/* Avatar & Name */}
                <span className="text-lg">{p.avatar}</span>
                <span className={`text-[13px] font-semibold flex-1 truncate ${p.isPlayer ? 'text-primary font-bold' : 'text-foreground'}`}>
                  {p.name} {p.isPlayer && '(você)'}
                </span>

                {/* XP */}
                <span className={`text-[11px] font-extrabold ${p.isPlayer ? 'text-primary' : 'text-muted-foreground'}`}>
                  {p.xp.toLocaleString()} XP
                </span>
              </div>
            );
          })}
        </div>

        {/* All leagues */}
        <div className="mt-8">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-3">Todas as Ligas</h3>
          <div className="grid grid-cols-4 gap-2">
            {LEAGUES.map(l => (
              <div key={l.id} className={`rounded-xl border p-3 text-center transition-all ${
                l.id === league.id ? `${l.border} ${l.bg}` : 'border-border bg-card opacity-60'
              }`}>
                <div className="text-2xl mb-1">{l.icon}</div>
                <div className={`text-[10px] font-bold ${l.id === league.id ? l.text : 'text-muted-foreground'}`}>{l.name}</div>
                <div className="text-[9px] text-muted-foreground">{l.minXp}+ XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { getPlayerLeague, LEAGUES };
