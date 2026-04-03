import { useMemo } from 'react';

const PARTICLE_COLORS = [
  'hsl(var(--primary) / 0.15)',
  'hsl(var(--secondary) / 0.12)',
  'hsl(var(--primary) / 0.08)',
  'hsl(var(--secondary) / 0.06)',
  'hsl(var(--gold) / 0.1)',
];

interface Particle {
  id: number;
  size: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  blur: number;
  shape: 'circle' | 'square' | 'diamond';
}

export default function FloatingParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 12,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 18,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      blur: Math.random() > 0.6 ? 1 + Math.random() * 2 : 0,
      shape: (['circle', 'square', 'diamond'] as const)[Math.floor(Math.random() * 3)],
    })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-particle-float"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: `-${p.size + 10}px`,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '3px',
            transform: p.shape === 'diamond' ? 'rotate(45deg)' : undefined,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
