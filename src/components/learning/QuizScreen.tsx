import { useState, useCallback, useRef, useEffect } from 'react';
import { Question, QuizResult } from './types';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (result: QuizResult) => void;
  onQuit: () => void;
}

export default function QuizScreen({ questions, onComplete, onQuit }: QuizScreenProps) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(3);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpPopup, setXpPopup] = useState<{ value: number; key: number } | null>(null);
  const [deadHearts, setDeadHearts] = useState<number[]>([]);
  const [shakingHeart, setShakingHeart] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const popupKey = useRef(0);
  const [showQuitModal, setShowQuitModal] = useState(false);

  const q = questions[qIdx];
  const progress = (qIdx / questions.length) * 100;

  const handleSelect = useCallback((idx: number) => {
    if (answered) return;
    setSelected(idx);
  }, [answered]);

  const handleVerify = useCallback(() => {
    if (selected === null) return;

    if (!answered) {
      // Check answer
      const correct = selected === q.correctIndex;
      setAnswered(true);
      setIsCorrect(correct);

      if (correct) {
        const newCombo = combo + 1;
        const newStreak = streak + 1;
        setCombo(newCombo);
        setStreak(newStreak);
        setCorrectCount(c => c + 1);
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        const gained = 10 + (newCombo >= 3 ? 5 : 0);
        setXp(x => x + gained);
        popupKey.current++;
        setXpPopup({ value: gained, key: popupKey.current });
      } else {
        setCombo(0);
        setStreak(0);
        // Lose a heart
        const nextDead = [...deadHearts];
        for (let i = 2; i >= 0; i--) {
          if (!nextDead.includes(i)) { nextDead.push(i); setShakingHeart(i); setTimeout(() => setShakingHeart(null), 600); break; }
        }
        setDeadHearts(nextDead);
        setLives(l => l - 1);
      }
    } else {
      // Next question
      if (qIdx + 1 >= questions.length) {
        onComplete({
          xpGained: xp + (isCorrect ? 0 : 0), // xp already updated
          accuracy: Math.round(((correctCount + (isCorrect ? 0 : 0)) / questions.length) * 100),
          maxStreak,
          totalQuestions: questions.length,
        });
      } else {
        setQIdx(i => i + 1);
        setSelected(null);
        setAnswered(false);
        setIsCorrect(false);
        setAnimKey(k => k + 1);
      }
    }
  }, [selected, answered, q, combo, streak, maxStreak, deadHearts, qIdx, questions, onComplete, xp, correctCount, isCorrect]);

  const diffClass = q.difficulty === 'Fácil' ? 'bg-green/10 border-green/25 text-green' :
    q.difficulty === 'Difícil' ? 'bg-destructive/10 border-destructive/25 text-destructive' :
    'bg-gold/10 border-gold/25 text-gold';

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-4 pb-8 relative">
      {/* Ambient glow */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(124,106,247,.12) 0%, transparent 70%)' }} />

      {/* Top bar */}
      <div className="w-full max-w-[680px] flex items-center gap-3 pt-5 pb-3 relative z-10">
        <button onClick={() => setShowQuitModal(true)}
          className="w-9 h-9 bg-surface border border-border rounded-full flex items-center justify-center text-muted-foreground text-base cursor-pointer transition-all hover:border-foreground/20 hover:text-foreground flex-shrink-0">
          ✕
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-2.5 bg-foreground/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full relative transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
              transitionTimingFunction: 'cubic-bezier(.34,1.56,.64,1)',
            }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-foreground rounded-full"
              style={{ boxShadow: '0 0 8px hsl(var(--secondary))' }} />
          </div>
        </div>

        {/* Hearts */}
        <div className="flex gap-1 items-center flex-shrink-0">
          {[0, 1, 2].map(i => (
            <span key={i} className={`text-[22px] transition-transform duration-300 ${deadHearts.includes(i) ? 'grayscale opacity-30 scale-[0.8]' : ''} ${shakingHeart === i ? 'animate-heart-shake' : ''}`}>
              ❤️
            </span>
          ))}
        </div>

        {/* Streak badge */}
        <div className="flex items-center gap-1 bg-gold/[0.12] border border-gold/25 rounded-full py-1 px-2.5 text-[13px] font-bold text-gold flex-shrink-0">
          🔥 <span>{streak}</span>
        </div>
      </div>

      {/* Combo bar */}
      <div className="w-full max-w-[680px] flex items-center justify-between mt-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i <= combo ? 'bg-gold shadow-[0_0_6px_rgba(251,191,36,.6)]' : 'bg-foreground/10'}`} />
            ))}
          </div>
          <span className={`text-gold font-extrabold text-[13px] transition-opacity duration-300 ${combo >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            🔥 x{combo} Combo!
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-extrabold text-primary">
          ⚡ <span>{xp}</span> <span className="text-muted-foreground font-semibold">XP</span>
        </div>
      </div>

      {/* Question meta */}
      <div className="w-full max-w-[680px] flex items-center justify-between mt-3.5 mb-2 relative z-10">
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider py-1 px-3 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
            {q.icon} {q.category}
          </div>
          <div className={`text-[12px] font-bold py-1 px-2.5 rounded-full border ${diffClass}`}>
            {q.difficulty}
          </div>
        </div>
        <div className="text-[13px] text-muted-foreground font-semibold">
          {qIdx + 1} / {questions.length}
        </div>
      </div>

      {/* Question card */}
      <div key={animKey} className="w-full max-w-[680px] bg-card border border-border rounded-2xl p-7 relative z-10 animate-slide-up">
        <span className="text-[28px] mb-3.5 block">{q.icon}</span>
        <p className="font-display text-xl font-semibold leading-snug text-foreground">{q.text}</p>
      </div>

      {/* Options */}
      <div key={`opts-${animKey}`} className="w-full max-w-[680px] grid gap-2.5 mt-4 relative z-10">
        {q.options.map((opt, i) => {
          let optClass = 'bg-card border-border hover:border-primary hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(124,106,247,.15)]';
          if (answered) {
            if (i === q.correctIndex) {
              optClass = i === selected ? 'bg-green/[0.08] border-green animate-correct-pop' : 'bg-green/[0.06] border-green';
            } else if (i === selected) {
              optClass = 'bg-destructive/[0.08] border-destructive animate-wrong-shake';
            } else {
              optClass = 'bg-card border-border opacity-50';
            }
          } else if (i === selected) {
            optClass = 'bg-primary/[0.08] border-primary shadow-[0_0_0_1px_hsl(var(--primary))]';
          }

          const letterClass = answered
            ? (i === q.correctIndex ? 'bg-green border-green text-primary-foreground' :
              i === selected ? 'bg-destructive border-destructive text-primary-foreground' :
              'bg-foreground/5 border-border text-muted-foreground')
            : i === selected
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-foreground/5 border-border text-muted-foreground';

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`border-[1.5px] rounded-[10px] py-4 px-[18px] flex items-center gap-3.5 cursor-pointer transition-all duration-150 animate-slide-up ${optClass} ${answered ? 'pointer-events-none' : ''}`}
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
            >
              <div className={`w-8 h-8 flex-shrink-0 border-[1.5px] rounded-lg flex items-center justify-center font-display text-[13px] font-bold transition-all duration-200 ${letterClass}`}>
                {['A', 'B', 'C', 'D'][i]}
              </div>
              <span className="text-[15px] font-semibold text-foreground leading-snug text-left">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`w-full max-w-[680px] rounded-2xl p-[18px] px-[22px] mt-2.5 flex items-start gap-3.5 relative z-10 animate-slide-up ${isCorrect ? 'bg-green/[0.08] border border-green/25' : 'bg-destructive/[0.08] border border-destructive/25'}`}>
          <span className="text-2xl flex-shrink-0">{isCorrect ? (streak >= 3 ? '🔥' : '🎉') : '💡'}</span>
          <div>
            <div className={`text-[15px] font-extrabold mb-1 ${isCorrect ? 'text-green' : 'text-destructive'}`}>
              {isCorrect ? (streak >= 3 ? `COMBO x${streak}! Sensacional!` : 'Correto!') : 'Quase lá!'}
            </div>
            <div className="text-[13px] text-muted-foreground leading-relaxed">{q.explanation}</div>
          </div>
        </div>
      )}

      {/* Button */}
      <div className="w-full max-w-[680px] mt-4 relative z-10">
        <button
          onClick={handleVerify}
          disabled={selected === null && !answered}
          className={`w-full rounded-2xl py-[18px] text-base font-extrabold text-primary-foreground tracking-wide transition-all duration-200 disabled:bg-foreground/[0.06] disabled:text-muted-foreground disabled:cursor-not-allowed ${
            !answered
              ? 'bg-gradient-to-br from-primary to-primary/80'
              : isCorrect
              ? 'bg-gradient-to-br from-secondary to-secondary/80'
              : 'bg-gradient-to-br from-muted-foreground/60 to-muted-foreground/40'
          }`}
        >
          {!answered ? 'VERIFICAR' : 'CONTINUAR →'}
        </button>
      </div>

      {/* XP Popup */}
      {xpPopup && (
        <div key={xpPopup.key}
          className="fixed top-1/2 left-1/2 text-primary-foreground font-black text-[28px] py-3.5 px-7 rounded-full z-[100] pointer-events-none whitespace-nowrap animate-xp-fire"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}>
          +{xpPopup.value} XP{xpPopup.value > 10 ? ' 🔥' : ''}
        </div>
      )}
    </div>
  );
}
