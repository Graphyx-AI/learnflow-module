import { useState, useEffect } from 'react';
import { X, Flame, AlertTriangle } from 'lucide-react';

interface StreakNotificationProps {
  streak: number;
  onDismiss: () => void;
  onStartLesson: () => void;
}

export default function StreakNotification({ streak, onDismiss, onStartLesson }: StreakNotificationProps) {
  const [visible, setVisible] = useState(true);

  if (!visible || streak < 1) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-32px)] max-w-[440px] animate-slide-up">
      <div className="bg-card border border-orange-300/40 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Urgency bar */}
        <div className="h-1 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 animate-pulse" />

        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-500">Streak em risco!</span>
            </div>
            <p className="text-[13px] font-semibold text-foreground leading-snug">
              Seu streak de <strong className="text-orange-500">{streak} dias</strong> vai acabar! Complete uma lição hoje para mantê-lo.
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={onStartLesson}
                className="px-4 py-2 rounded-xl text-[11px] font-extrabold text-primary-foreground cursor-pointer transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
              >
                Estudar Agora 🔥
              </button>
              <button
                onClick={() => { setVisible(false); onDismiss(); }}
                className="px-3 py-2 rounded-xl text-[11px] font-bold text-muted-foreground bg-muted hover:bg-muted/80 cursor-pointer transition-all"
              >
                Depois
              </button>
            </div>
          </div>

          {/* Close */}
          <button onClick={() => { setVisible(false); onDismiss(); }} className="text-muted-foreground hover:text-foreground cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
