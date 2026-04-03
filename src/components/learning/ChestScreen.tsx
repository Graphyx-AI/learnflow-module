import { useState, useEffect } from 'react';
import { ChestReward } from './types';
import { Gift, Heart, Zap, Award, Sparkles } from 'lucide-react';

interface ChestScreenProps {
  onClaim: (reward: ChestReward) => void;
  onClose: () => void;
  alreadyOpened?: boolean;
}

const POSSIBLE_REWARDS: ChestReward[] = [
  { type: 'xp', amount: 25, label: '+25 XP', description: 'Um pouco de experiência para sua jornada!', icon: '⚡', rarity: 'common' },
  { type: 'xp', amount: 50, label: '+50 XP', description: 'Uma boa dose de experiência!', icon: '⚡', rarity: 'common' },
  { type: 'xp', amount: 100, label: '+100 XP', description: 'Uau! Uma grande quantidade de XP!', icon: '✨', rarity: 'rare' },
  { type: 'life', amount: 1, label: '+1 Vida', description: 'Uma vida extra para usar nas lições!', icon: '❤️', rarity: 'common' },
  { type: 'life', amount: 2, label: '+2 Vidas', description: 'Duas vidas extras!', icon: '💖', rarity: 'rare' },
  { type: 'life', amount: 3, label: '+3 Vidas', description: 'Três vidas extras! Que sorte!', icon: '💝', rarity: 'epic' },
  { type: 'xp', amount: 200, label: '+200 XP', description: 'Jackpot de experiência!', icon: '💎', rarity: 'epic' },
  { type: 'achievement', achievementId: 'a_chest', label: '🏅 Conquista Rara!', description: 'Você desbloqueou "Caçador de Tesouros"!', icon: '🏆', rarity: 'legendary' },
];

// Weighted random: common=50%, rare=30%, epic=15%, legendary=5%
function rollReward(): ChestReward {
  const roll = Math.random() * 100;
  let rarity: ChestReward['rarity'];
  if (roll < 50) rarity = 'common';
  else if (roll < 80) rarity = 'rare';
  else if (roll < 95) rarity = 'epic';
  else rarity = 'legendary';

  const pool = POSSIBLE_REWARDS.filter(r => r.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

const RARITY_STYLES: Record<string, { bg: string; border: string; glow: string; label: string; text: string }> = {
  common: { bg: 'bg-muted/50', border: 'border-border', glow: '', label: 'Comum', text: 'text-muted-foreground' },
  rare: { bg: 'bg-primary/5', border: 'border-primary/30', glow: 'shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]', label: 'Raro', text: 'text-primary' },
  epic: { bg: 'bg-secondary/5', border: 'border-secondary/30', glow: 'shadow-[0_0_40px_rgba(var(--secondary-rgb),0.2)]', label: 'Épico', text: 'text-secondary' },
  legendary: { bg: 'bg-gold/5', border: 'border-gold/40', glow: 'shadow-[0_0_60px_rgba(var(--gold-rgb),0.3)]', label: 'Lendário', text: 'text-gold' },
};

export default function ChestScreen({ onClaim, onClose, alreadyOpened }: ChestScreenProps) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'revealed'>(alreadyOpened ? 'revealed' : 'closed');
  const [reward, setReward] = useState<ChestReward | null>(null);

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    const r = rollReward();
    setReward(r);
    setTimeout(() => setPhase('revealed'), 1500);
  };

  const style = reward ? RARITY_STYLES[reward.rarity] : RARITY_STYLES.common;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-5">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Back */}
        <button onClick={onClose} className="self-start text-muted-foreground text-sm font-bold flex items-center gap-1 mb-8 hover:text-foreground transition-colors cursor-pointer">
          ← Voltar
        </button>

        {phase === 'closed' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="text-7xl animate-bobble">📦</div>
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Baú de Recompensa</h2>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Toque para abrir e descobrir sua recompensa! Pode ser XP, vidas ou até uma conquista rara!
              </p>
            </div>
            <button
              onClick={handleOpen}
              className="mt-4 px-8 py-4 rounded-2xl font-display font-bold text-base text-primary-foreground cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
            >
              <span className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Abrir Baú
              </span>
            </button>
          </div>
        )}

        {phase === 'opening' && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-7xl animate-spin">✨</div>
            <p className="font-display text-lg font-bold text-foreground animate-pulse">Abrindo...</p>
          </div>
        )}

        {phase === 'revealed' && reward && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            {/* Reward card */}
            <div className={`w-full rounded-3xl border-2 ${style.border} ${style.bg} ${style.glow} p-8 flex flex-col items-center gap-4 transition-all`}>
              {/* Rarity label */}
              <span className={`text-[10px] font-extrabold uppercase tracking-[0.15em] ${style.text}`}>
                {style.label}
              </span>

              {/* Icon */}
              <div className="text-6xl">{reward.icon}</div>

              {/* Reward info */}
              <h3 className="font-display text-xl font-bold text-foreground">{reward.label}</h3>
              <p className="text-sm text-muted-foreground text-center max-w-[260px]">{reward.description}</p>

              {/* Type indicator */}
              <div className="flex items-center gap-2 mt-2">
                {reward.type === 'xp' && <Zap className="w-4 h-4 text-primary" />}
                {reward.type === 'life' && <Heart className="w-4 h-4 text-destructive" />}
                {reward.type === 'achievement' && <Award className="w-4 h-4 text-gold" />}
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {reward.type === 'xp' ? 'Experiência' : reward.type === 'life' ? 'Vida Extra' : 'Conquista'}
                </span>
              </div>
            </div>

            {/* Claim button */}
            {!alreadyOpened && (
              <button
                onClick={() => onClaim(reward)}
                className="px-8 py-4 rounded-2xl font-display font-bold text-base text-primary-foreground cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Coletar Recompensa
                </span>
              </button>
            )}

            {alreadyOpened && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-semibold">Você já coletou esta recompensa!</p>
                <button onClick={onClose} className="mt-3 text-primary font-bold text-sm cursor-pointer hover:underline">
                  Voltar ao mapa
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
