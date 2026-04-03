import { useState, useCallback, useRef } from 'react';
import { Question, QuizResult } from './types';
import { playCorrectSound, playWrongSound, playSelectSound, isSoundEnabled, setSoundEnabled } from './sounds';
import { Volume2, VolumeX } from 'lucide-react';

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
  const [lives, setLives] = useState(5);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpPopup, setXpPopup] = useState<{ value: number; key: number } | null>(null);
  const [deadHearts, setDeadHearts] = useState<number[]>([]);
  const [shakingHeart, setShakingHeart] = useState<number | null>(null);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  // Use refs for values needed in onComplete to avoid stale closures
  const xpRef = useRef(0);
  const correctRef = useRef(0);
  const maxStreakRef = useRef(0);
  const popupKey = useRef(0);

  const q = questions[qIdx];
  const progress = ((qIdx + (answered ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (answered) return;
    if (soundOn) playSelectSound();
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null || answered) return;

    const correct = selected === q.correctIndex;
    setAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      const newCombo = combo + 1;
      const newStreak = streak + 1;
      setCombo(newCombo);
      setStreak(newStreak);
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      correctRef.current = newCorrectCount;

      const newMax = Math.max(maxStreak, newStreak);
      setMaxStreak(newMax);
      maxStreakRef.current = newMax;

      const gained = 10 + (newCombo >= 3 ? 5 : 0);
      const newXp = xp + gained;
      setXp(newXp);
      xpRef.current = newXp;

      popupKey.current++;
      setXpPopup({ value: gained, key: popupKey.current });
    } else {
      setCombo(0);
      setStreak(0);
      setDeadHearts(prev => {
        for (let i = 4; i >= 0; i--) {
          if (!prev.includes(i)) {
            setShakingHeart(i);
            setTimeout(() => setShakingHeart(null), 600);
            return [...prev, i];
          }
        }
        return prev;
      });
      setLives(l => l - 1);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      onComplete({
        xpGained: xpRef.current,
        accuracy: Math.round((correctRef.current / questions.length) * 100),
        maxStreak: maxStreakRef.current,
        totalQuestions: questions.length,
      });
    } else {
      setQIdx(qIdx + 1);
      setSelected(null);
      setAnswered(false);
      setIsCorrect(false);
    }
  };

  const diffClass = q.difficulty === 'Fácil' ? 'bg-green/10 border-green/25 text-green' :
    q.difficulty === 'Difícil' ? 'bg-destructive/10 border-destructive/25 text-destructive' :
    'bg-gold/10 border-gold/25 text-gold';

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-4 pb-8 relative overflow-x-hidden">
      {/* Top bar */}
      <div className="w-full max-w-[680px] flex items-center gap-3 pt-5 pb-3 relative z-10">
        <button onClick={() => setShowQuitModal(true)}
          className="w-9 h-9 bg-surface border border-border rounded-full flex items-center justify-center text-muted-foreground text-base cursor-pointer transition-all hover:border-foreground/20 hover:text-foreground flex-shrink-0">
          ✕
        </button>

        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full relative transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
              transitionTimingFunction: 'cubic-bezier(.34,1.56,.64,1)',
            }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full shadow-md" />
          </div>
        </div>

        <div className="flex gap-0.5 items-center flex-shrink-0">
          {[0, 1, 2, 3, 4].map(i => (
            <span key={i} className={`text-lg transition-transform duration-300 ${deadHearts.includes(i) ? 'grayscale opacity-30 scale-75' : ''} ${shakingHeart === i ? 'animate-heart-shake' : ''}`}>
              ❤️
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-gold/[0.12] border border-gold/25 rounded-full py-1 px-2.5 text-[13px] font-bold text-gold flex-shrink-0">
          🔥 <span>{streak}</span>
        </div>
      </div>

      {/* Combo + XP */}
      <div className="w-full max-w-[680px] flex items-center justify-between mt-1 relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i <= combo ? 'bg-gold shadow-[0_0_6px_rgba(251,191,36,.6)]' : 'bg-muted'}`} />
            ))}
          </div>
          {combo >= 3 && (
            <span className="text-gold font-extrabold text-[13px]">🔥 x{combo} Combo!</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-extrabold text-primary">
          ⚡ {xp} <span className="text-muted-foreground font-semibold">XP</span>
        </div>
      </div>

      {/* Question meta */}
      <div className="w-full max-w-[680px] flex items-center justify-between mt-4 mb-3 relative z-10">
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full bg-secondary/10 border border-secondary/20 text-secondary">
            {q.icon} {q.category}
          </div>
          <div className={`text-[12px] font-bold py-1.5 px-3 rounded-full border ${diffClass}`}>
            {q.difficulty}
          </div>
        </div>
        <div className="text-[13px] text-muted-foreground font-semibold">
          {qIdx + 1} / {questions.length}
        </div>
      </div>

      {/* Question card — single card, no stacking */}
      <div className="w-full max-w-[680px] bg-card border border-border rounded-2xl p-7 relative z-10">
        <span className="text-[28px] mb-3 block">{q.icon}</span>
        <p className="font-display text-xl font-semibold leading-snug text-foreground">{q.text}</p>
      </div>

      {/* Options */}
      <div className={`w-full max-w-[680px] grid gap-2.5 mt-4 relative z-10 ${shaking ? 'animate-wrong-shake' : ''}`}>
        {q.options.map((opt, i) => {
          let optClass = 'bg-card border-border hover:border-primary hover:-translate-y-px';
          let letterClass = 'bg-muted border-border text-muted-foreground';

          if (answered) {
            if (i === q.correctIndex) {
              optClass = i === selected ? 'bg-green/10 border-green' : 'bg-green/[0.06] border-green';
              letterClass = 'bg-green border-green text-primary-foreground';
            } else if (i === selected) {
              optClass = 'bg-destructive/10 border-destructive';
              letterClass = 'bg-destructive border-destructive text-primary-foreground';
            } else {
              optClass = 'bg-card border-border opacity-40';
            }
          } else if (i === selected) {
            const selColors = [
              { opt: 'bg-[hsl(217,91%,60%)]/10 border-[hsl(217,91%,60%)] shadow-[0_0_0_1px_hsl(217,91%,60%)]', letter: 'bg-[hsl(217,91%,60%)] border-[hsl(217,91%,60%)] text-white' },
              { opt: 'bg-[hsl(280,80%,55%)]/10 border-[hsl(280,80%,55%)] shadow-[0_0_0_1px_hsl(280,80%,55%)]', letter: 'bg-[hsl(280,80%,55%)] border-[hsl(280,80%,55%)] text-white' },
              { opt: 'bg-[hsl(35,95%,55%)]/10 border-[hsl(35,95%,55%)] shadow-[0_0_0_1px_hsl(35,95%,55%)]', letter: 'bg-[hsl(35,95%,55%)] border-[hsl(35,95%,55%)] text-white' },
              { opt: 'bg-[hsl(170,70%,45%)]/10 border-[hsl(170,70%,45%)] shadow-[0_0_0_1px_hsl(170,70%,45%)]', letter: 'bg-[hsl(170,70%,45%)] border-[hsl(170,70%,45%)] text-white' },
            ];
            optClass = selColors[i].opt;
            letterClass = selColors[i].letter;
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`border-[1.5px] rounded-xl py-4 px-5 flex items-center gap-4 cursor-pointer transition-all duration-150 ${optClass} ${answered ? 'pointer-events-none' : ''}`}
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
        <div className={`w-full max-w-[680px] rounded-2xl p-5 mt-3 flex items-start gap-4 relative z-10 animate-slide-up border ${isCorrect ? 'bg-green/10 border-green/25' : 'bg-destructive/10 border-destructive/25'}`}>
          <span className="text-2xl flex-shrink-0">{isCorrect ? (streak >= 3 ? '🔥' : '🎉') : '💡'}</span>
          <div>
            <div className={`text-[15px] font-extrabold mb-1 ${isCorrect ? 'text-green' : 'text-destructive'}`}>
              {isCorrect ? (streak >= 3 ? `COMBO x${streak}! Sensacional!` : 'Correto!') : 'Quase lá!'}
            </div>
            <div className="text-[13px] text-muted-foreground leading-relaxed">{q.explanation}</div>
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="w-full max-w-[680px] mt-5 relative z-10">
        {!answered ? (
          <button
            onClick={handleCheck}
            disabled={selected === null}
            className="w-full rounded-2xl py-[18px] text-base font-extrabold tracking-wide transition-all duration-200 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground"
            style={selected !== null ? { background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' } : undefined}
          >
            VERIFICAR
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full rounded-2xl py-[18px] text-base font-extrabold tracking-wide transition-all duration-200 text-primary-foreground"
            style={{ background: isCorrect ? 'linear-gradient(135deg, hsl(var(--green)), hsl(var(--green-bright)))' : 'linear-gradient(135deg, hsl(var(--muted-foreground)), hsl(var(--muted-foreground) / 0.7))' }}
          >
            CONTINUAR →
          </button>
        )}
      </div>

      {/* XP Popup */}
      {xpPopup && (
        <div key={xpPopup.key}
          className="fixed top-1/2 left-1/2 text-primary-foreground font-black text-[28px] py-3.5 px-7 rounded-full z-[100] pointer-events-none whitespace-nowrap animate-xp-fire"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}>
          +{xpPopup.value} XP{xpPopup.value > 10 ? ' 🔥' : ''}
        </div>
      )}

      {/* Quit Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowQuitModal(false)} />
          <div className="relative bg-background border border-border rounded-2xl p-6 w-full max-w-[340px] animate-slide-up shadow-xl">
            <div className="text-center text-4xl mb-3">🚪</div>
            <h3 className="font-display text-lg font-bold text-foreground text-center mb-2">Sair da lição?</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">Seu progresso será perdido.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQuitModal(false)}
                className="flex-1 py-3 rounded-xl border border-border bg-card text-foreground font-bold text-sm transition-all hover:bg-muted cursor-pointer"
              >
                Continuar
              </button>
              <button
                onClick={onQuit}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-primary-foreground transition-all hover:brightness-110 cursor-pointer bg-destructive"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
