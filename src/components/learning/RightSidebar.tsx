import { useState } from 'react';
import DailyMissions from './DailyMissions';

interface SidebarProps {
  completedLessons: number[];
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export default function RightSidebar({ completedLessons, activeTab, onNavigate }: SidebarProps) {
  const [missionsExpanded, setMissionsExpanded] = useState(true);

  const navItems = [
    { id: 'map', icon: '🏠', label: 'Aprender' },
    { id: 'missions', icon: '🎯', label: 'Missões' },
    { id: 'profile', icon: '👤', label: 'Perfil' },
  ];

  return (
    <div className="w-[280px] flex-shrink-0 h-screen sticky top-0 border-l border-border bg-card/50 overflow-y-auto">
      <div className="p-5 flex flex-col gap-3">
        {/* Nav items */}
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              activeTab === item.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="uppercase tracking-wider">{item.label}</span>
          </button>
        ))}

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

      {/* Timer */}
      <div className="text-center text-[10px] text-muted-foreground font-semibold mt-1">
        ⏱ Renova em 14h 32m
      </div>
    </div>
  );
}
