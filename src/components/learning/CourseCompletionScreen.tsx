import { useEffect, useRef, useState } from 'react';
import { PlayerState } from './types';
import Confetti from './Confetti';
import { playVictorySound, isSoundEnabled } from './sounds';
import { Award, RotateCcw, Download, Star, Sparkles } from 'lucide-react';

interface CourseCompletionScreenProps {
  player: PlayerState;
  playerName: string;
  onRestart: () => void;
}

export default function CourseCompletionScreen({ player, playerName, onRestart }: CourseCompletionScreenProps) {
  const [phase, setPhase] = useState(0); // 0=intro, 1=stats, 2=certificate
  const [showCert, setShowCert] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    if (isSoundEnabled()) playVictorySound();

    // Staggered reveal
    setTimeout(() => setPhase(1), 800);
    setTimeout(() => setPhase(2), 2000);
    setTimeout(() => setShowCert(true), 3000);
  }, []);

  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-5 py-10 overflow-hidden relative">
      <Confetti />

      {/* Radial glow behind */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-15 animate-pulse"
          style={{ background: 'radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[480px]">

        {/* Giant trophy animation */}
        <div className={`transition-all duration-1000 ${phase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative">
            <span className="text-[100px] block animate-bounce-trophy drop-shadow-2xl">🏆</span>
            <div className="absolute -top-2 -right-2 animate-spin-slow">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <div className="absolute -bottom-1 -left-3 animate-spin-slow" style={{ animationDelay: '0.5s' }}>
              <Star className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className={`mt-4 text-center transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="font-display text-[36px] font-black bg-clip-text text-transparent leading-tight"
            style={{ backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--gold)))' }}>
            TRILHA CONCLUÍDA!
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-[360px] mx-auto">
            Você dominou todos os 10 módulos de Inteligência Artificial. Isso é incrível! 🎉
          </p>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 gap-3 w-full mt-8 transition-all duration-700 delay-200 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <StatCard icon="⚡" value={player.xp} label="XP Total" color="text-primary" />
          <StatCard icon="🔥" value={player.streak} label="Dias seguidos" color="text-orange-500" />
          <StatCard icon="📚" value="10/10" label="Seções" color="text-secondary" />
        </div>

        {/* Certificate */}
        <div className={`w-full mt-8 transition-all duration-1000 ${showCert ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="relative rounded-3xl border-2 border-gold/30 bg-gradient-to-br from-card via-card to-gold/5 p-8 shadow-[0_0_60px_rgba(var(--gold-rgb,251,191,36),0.15)]">
            {/* Corner decorations */}
            <div className="absolute top-3 left-3 text-gold/30 text-xl">✦</div>
            <div className="absolute top-3 right-3 text-gold/30 text-xl">✦</div>
            <div className="absolute bottom-3 left-3 text-gold/30 text-xl">✦</div>
            <div className="absolute bottom-3 right-3 text-gold/30 text-xl">✦</div>

            <div className="flex flex-col items-center text-center">
              <Award className="w-12 h-12 text-gold mb-3" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-gold/70 mb-1">
                Certificado de Conclusão
              </p>
              <h2 className="font-display text-xl font-bold text-foreground mb-1">
                Trilha Skills AI
              </h2>
              <div className="w-16 h-px bg-gold/30 my-3" />
              <p className="text-sm text-muted-foreground mb-1">Certificamos que</p>
              <p className="font-display text-2xl font-black text-foreground mb-1">
                {playerName || 'Estudante IA'}
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-[300px]">
                completou com êxito todas as 10 seções da trilha de Inteligência Artificial, demonstrando domínio nos fundamentos, aplicações práticas e temas avançados de IA.
              </p>
              <div className="flex items-center gap-6 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">+{player.xp}</div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase">XP Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg">🏅</div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase">Mestre IA</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">100%</div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase">Completo</div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">{today}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex flex-col gap-3 w-full mt-8 transition-all duration-700 ${showCert ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl font-display font-bold text-base cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 text-primary-foreground"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
          >
            <RotateCcw className="w-5 h-5" />
            Recomeçar a Trilha do Zero
          </button>

          <button
            onClick={() => {
              // Trigger print dialog for certificate
              window.print();
            }}
            className="w-full py-3.5 rounded-2xl font-display font-bold text-sm cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] border-2 border-gold/30 bg-gold/5 text-foreground flex items-center justify-center gap-2 hover:bg-gold/10"
          >
            <Download className="w-4 h-4 text-gold" />
            Salvar Certificado
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
      <div className="text-[22px] mb-1">{icon}</div>
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground font-bold mt-0.5">{label}</div>
    </div>
  );
}
