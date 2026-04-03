import { useEffect, useRef } from 'react';

const CONFETTI_COLORS = [
  '#7c6af7', '#5eead4', '#f472b6', '#fbbf24', '#22c55e',
  '#818cf8', '#fb923c', '#38bdf8', '#f43f5e', '#a78bfa',
];

const SHAPES = ['square', 'circle', 'strip'] as const;

export default function Confetti({ count = 80 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !containerRef.current) return;
    fired.current = true;

    const container = containerRef.current;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const size = shape === 'strip' ? `${3 + Math.random() * 3}px` : `${5 + Math.random() * 7}px`;
      const height = shape === 'strip' ? `${12 + Math.random() * 10}px` : size;

      el.style.cssText = `
        position: fixed;
        width: ${size};
        height: ${height};
        border-radius: ${shape === 'circle' ? '50%' : '2px'};
        pointer-events: none;
        z-index: 300;
        left: ${10 + Math.random() * 80}vw;
        top: -15px;
        background: ${color};
        opacity: 0;
        animation: confettiDrop ${1.8 + Math.random() * 2.2}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: ${Math.random() * 0.6}s;
      `;

      container.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  }, [count]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[300]" aria-hidden />;
}
