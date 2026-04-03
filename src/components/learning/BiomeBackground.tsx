import { useMemo } from 'react';

export interface BiomeConfig {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  bannerGradient: string;
  decorEmojis: string[];
  decorCount: number;
  pathColor: string;
  accentColor: string;
}

export const BIOMES: BiomeConfig[] = [
  {
    id: 'forest',
    name: 'Floresta do Conhecimento',
    icon: '🌿',
    gradient: 'linear-gradient(180deg, hsl(152 40% 96%) 0%, hsl(152 30% 92%) 50%, hsl(140 25% 88%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(152 68% 38%), hsl(160 84% 39%))',
    decorEmojis: ['🌿', '🍃', '🌱', '🌳', '🍀', '🦋', '🐛', '🌸'],
    decorCount: 14,
    pathColor: 'hsl(152 68% 38%)',
    accentColor: 'hsl(160 84% 39%)',
  },
  {
    id: 'desert',
    name: 'Deserto dos Prompts',
    icon: '🏜️',
    gradient: 'linear-gradient(180deg, hsl(35 60% 95%) 0%, hsl(30 50% 90%) 50%, hsl(25 45% 86%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(25 80% 50%), hsl(35 90% 55%))',
    decorEmojis: ['🌵', '☀️', '🏜️', '🦂', '🐪', '💨', '🪨', '⭐'],
    decorCount: 12,
    pathColor: 'hsl(25 80% 50%)',
    accentColor: 'hsl(35 90% 55%)',
  },
  {
    id: 'space',
    name: 'Espaço Sideral',
    icon: '🚀',
    gradient: 'linear-gradient(180deg, hsl(240 30% 16%) 0%, hsl(250 35% 12%) 50%, hsl(260 40% 10%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(252 85% 58%), hsl(280 70% 50%))',
    decorEmojis: ['⭐', '✨', '🌟', '💫', '🪐', '🛸', '☄️', '🌙'],
    decorCount: 18,
    pathColor: 'hsl(252 85% 58%)',
    accentColor: 'hsl(280 70% 50%)',
  },
  {
    id: 'ocean',
    name: 'Oceano Profundo',
    icon: '🌊',
    gradient: 'linear-gradient(180deg, hsl(200 50% 94%) 0%, hsl(205 55% 88%) 50%, hsl(210 50% 84%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(200 80% 45%), hsl(210 90% 40%))',
    decorEmojis: ['🐠', '🐚', '🌊', '🪸', '🐙', '💎', '🫧', '🦈'],
    decorCount: 14,
    pathColor: 'hsl(200 80% 45%)',
    accentColor: 'hsl(210 90% 40%)',
  },
  {
    id: 'volcano',
    name: 'Vulcão da Inovação',
    icon: '🌋',
    gradient: 'linear-gradient(180deg, hsl(0 40% 95%) 0%, hsl(10 45% 90%) 50%, hsl(15 50% 85%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(0 72% 50%), hsl(15 85% 55%))',
    decorEmojis: ['🌋', '🔥', '💥', '⚡', '🪨', '🧱', '♨️', '💎'],
    decorCount: 12,
    pathColor: 'hsl(0 72% 50%)',
    accentColor: 'hsl(15 85% 55%)',
  },
  {
    id: 'arctic',
    name: 'Ártico Digital',
    icon: '❄️',
    gradient: 'linear-gradient(180deg, hsl(195 50% 96%) 0%, hsl(200 45% 92%) 50%, hsl(210 40% 88%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(195 70% 50%), hsl(210 80% 55%))',
    decorEmojis: ['❄️', '🧊', '⛄', '🌨️', '🐧', '🦭', '💠', '🏔️'],
    decorCount: 14,
    pathColor: 'hsl(195 70% 50%)',
    accentColor: 'hsl(210 80% 55%)',
  },
  {
    id: 'jungle',
    name: 'Selva Neural',
    icon: '🦜',
    gradient: 'linear-gradient(180deg, hsl(80 40% 94%) 0%, hsl(90 45% 88%) 50%, hsl(100 40% 82%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(80 65% 40%), hsl(120 70% 35%))',
    decorEmojis: ['🦜', '🐒', '🌺', '🍄', '🦎', '🌴', '🪲', '🌿'],
    decorCount: 14,
    pathColor: 'hsl(80 65% 40%)',
    accentColor: 'hsl(120 70% 35%)',
  },
  {
    id: 'crystal',
    name: 'Caverna de Cristal',
    icon: '💎',
    gradient: 'linear-gradient(180deg, hsl(270 30% 95%) 0%, hsl(280 35% 90%) 50%, hsl(290 30% 85%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(270 60% 55%), hsl(300 65% 50%))',
    decorEmojis: ['💎', '🔮', '✨', '🪨', '💠', '🌌', '🦇', '⚗️'],
    decorCount: 14,
    pathColor: 'hsl(270 60% 55%)',
    accentColor: 'hsl(300 65% 50%)',
  },
  {
    id: 'cyberpunk',
    name: 'Cidade Cyberpunk',
    icon: '🏙️',
    gradient: 'linear-gradient(180deg, hsl(220 25% 14%) 0%, hsl(230 30% 10%) 50%, hsl(240 35% 8%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(330 80% 55%), hsl(280 70% 50%))',
    decorEmojis: ['🏙️', '🌃', '💜', '🔷', '⚡', '🎮', '🤖', '💿'],
    decorCount: 16,
    pathColor: 'hsl(330 80% 55%)',
    accentColor: 'hsl(280 70% 50%)',
  },
  {
    id: 'garden',
    name: 'Jardim Quântico',
    icon: '🌸',
    gradient: 'linear-gradient(180deg, hsl(340 40% 96%) 0%, hsl(330 35% 92%) 50%, hsl(320 30% 88%) 100%)',
    bannerGradient: 'linear-gradient(135deg, hsl(340 70% 55%), hsl(10 80% 55%))',
    decorEmojis: ['🌸', '🌺', '🦋', '🌷', '🍒', '🌹', '🐝', '💮'],
    decorCount: 14,
    pathColor: 'hsl(340 70% 55%)',
    accentColor: 'hsl(10 80% 55%)',
  },
];

interface DecorItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

export default function BiomeBackground({ biomeId, height }: { biomeId: string; height: number }) {
  const biome = BIOMES.find(b => b.id === biomeId) || BIOMES[0];

  const decors = useMemo<DecorItem[]>(() =>
    Array.from({ length: biome.decorCount }, (_, i) => ({
      id: i,
      emoji: biome.decorEmojis[i % biome.decorEmojis.length],
      x: 3 + Math.random() * 94,
      y: 5 + Math.random() * 90,
      size: 12 + Math.random() * 18,
      opacity: 0.08 + Math.random() * 0.15,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6,
    })),
    [biome]
  );

  return (
    <div
      className="absolute inset-0 w-full pointer-events-none overflow-hidden rounded-3xl"
      style={{ height, background: biome.gradient }}
      aria-hidden
    >
      {decors.map(d => (
        <div
          key={d.id}
          className="absolute animate-bobble"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            fontSize: d.size,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        >
          {d.emoji}
        </div>
      ))}
    </div>
  );
}
