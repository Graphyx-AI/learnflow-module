import { useState, useCallback } from 'react';
import { Question } from './types';
import { CheckCircle, XCircle, ArrowRight, Trophy, Star, Volume2, VolumeX } from 'lucide-react';
import { playCorrectSound, playWrongSound, isSoundEnabled, setSoundEnabled } from './sounds';

interface FinalTestScreenProps {
  questions: Question[];
  onComplete: (result: { score: number; total: number; passed: boolean; xpGained: number }) => void;
  onQuit: () => void;
}

export default function FinalTestScreen({ questions, onComplete, onQuit }: FinalTestScreenProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const q = questions[currentQ];
  const progress = ((currentQ + (answered ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === q.correctIndex;
    if (isCorrect) {
      setCorrect(c => c + 1);
      setStreak(s => {
        const ns = s + 1;
        setMaxStreak(m => Math.max(m, ns));
        return ns;
      });
    } else {
      setStreak(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const score = correct + (selected === q.correctIndex ? 0 : 0); // already counted
      const passed = correct >= Math.ceil(questions.length * 0.7);
      const baseXp = correct * 20;
      const xpGained = passed ? baseXp * 2 : baseXp;
      onComplete({ score: correct, total: questions.length, passed, xpGained });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-5">
      <div className="w-full max-w-[460px] pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onQuit} className="text-muted-foreground text-sm font-bold hover:text-foreground transition-colors cursor-pointer">
            ✕ Sair
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-[12px] font-extrabold text-foreground">PROVA FINAL</span>
          </div>
          <span className="text-[12px] font-bold text-muted-foreground">{currentQ + 1}/{questions.length}</span>
        </div>

        {/* Progress */}
        <div className="bg-muted h-3 rounded-full overflow-hidden mb-8">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(var(--gold)), hsl(var(--primary)))' }} />
        </div>

        {/* Score tracker */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-bold text-primary">{correct} certas</span>
          </div>
          <div className="flex items-center gap-1.5 bg-destructive/5 border border-destructive/20 rounded-xl px-3 py-2">
            <XCircle className="w-4 h-4 text-destructive" />
            <span className="text-[12px] font-bold text-destructive">{currentQ - correct + (answered && selected !== q.correctIndex ? 1 : 0)} erradas</span>
          </div>
          {streak >= 2 && (
            <div className="flex items-center gap-1 bg-gold/10 border border-gold/20 rounded-xl px-3 py-2 animate-bobble">
              <span className="text-[12px] font-bold text-gold">🔥 {streak}x</span>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{q.icon}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">{q.category} · {q.difficulty}</span>
          </div>
          <h2 className="font-display text-lg font-bold text-foreground leading-snug">{q.text}</h2>
        </div>

        {/* Options */}
        <div className={`flex flex-col gap-3 mb-6 ${shaking ? 'animate-wrong-shake' : ''}`}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrectOpt = i === q.correctIndex;
            const selColors = [
              { bg: 'bg-[hsl(217,91%,60%)]/10 border-[hsl(217,91%,60%)]', letter: 'bg-[hsl(217,91%,60%)] text-white' },
              { bg: 'bg-[hsl(280,80%,55%)]/10 border-[hsl(280,80%,55%)]', letter: 'bg-[hsl(280,80%,55%)] text-white' },
              { bg: 'bg-[hsl(35,95%,55%)]/10 border-[hsl(35,95%,55%)]', letter: 'bg-[hsl(35,95%,55%)] text-white' },
              { bg: 'bg-[hsl(170,70%,45%)]/10 border-[hsl(170,70%,45%)]', letter: 'bg-[hsl(170,70%,45%)] text-white' },
            ];
            let style = 'bg-card border-border hover:border-primary/40 hover:bg-primary/[0.02] cursor-pointer';
            if (answered) {
              if (isCorrectOpt) style = 'bg-primary/10 border-primary/40';
              else if (isSelected) style = 'bg-destructive/10 border-destructive/40';
              else style = 'bg-card border-border opacity-50';
            } else if (isSelected) {
              style = selColors[i].bg;
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-xl border-[1.5px] transition-all ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-black flex-shrink-0 transition-all ${!answered && isSelected ? selColors[i].letter : 'bg-muted text-muted-foreground'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-[13px] font-semibold text-foreground">{opt}</span>
                  {answered && isCorrectOpt && <CheckCircle className="w-5 h-5 text-primary ml-auto flex-shrink-0" />}
                  {answered && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-destructive ml-auto flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className={`rounded-xl border p-4 mb-6 animate-fade-in ${
            selected === q.correctIndex ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'
          }`}>
            <p className="text-[12px] font-semibold text-foreground leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Next */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl font-display font-bold text-base text-primary-foreground cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
          >
            {currentQ < questions.length - 1 ? (
              <>Próxima <ArrowRight className="w-5 h-5" /></>
            ) : (
              <>Ver Resultado <Star className="w-5 h-5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Result Screen ──
interface FinalTestResultProps {
  score: number;
  total: number;
  passed: boolean;
  xpGained: number;
  onClose: () => void;
}

export function FinalTestResultScreen({ score, total, passed, xpGained, onClose }: FinalTestResultProps) {
  const pct = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-5">
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6">
        {/* Icon */}
        <div className={`text-7xl ${passed ? 'animate-bobble' : ''}`}>
          {passed ? '🏆' : '😔'}
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {passed ? 'Parabéns! Você passou!' : 'Não foi dessa vez...'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {passed
              ? 'Você completou a Prova Final e desbloqueou uma conquista exclusiva!'
              : 'Você precisa de pelo menos 70% para passar. Tente novamente!'}
          </p>
        </div>

        {/* Score card */}
        <div className={`w-full rounded-3xl border-2 p-8 flex flex-col items-center gap-4 ${
          passed ? 'border-gold/30 bg-gold/5 shadow-[0_0_40px_rgba(var(--gold-rgb),0.15)]' : 'border-border bg-card'
        }`}>
          <div className="text-5xl font-display font-black text-foreground">{pct}%</div>
          <div className="text-sm text-muted-foreground">{score}/{total} questões corretas</div>

          <div className="w-full h-px bg-border my-2" />

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">+{xpGained}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">XP{passed ? ' (2x)' : ''}</div>
            </div>
            {passed && (
              <div className="text-center">
                <div className="text-xl">🏅</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Conquista</div>
              </div>
            )}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-display font-bold text-base text-primary-foreground cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
        >
          {passed ? 'Voltar ao Mapa' : 'Tentar Novamente'}
        </button>
      </div>
    </div>
  );
}
