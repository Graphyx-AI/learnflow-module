import { useState, useEffect, useCallback } from 'react';
import { Question } from './types';
import { Zap, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

const LIGHTNING_QUESTIONS: Question[] = [
  {
    icon: '⚡', category: 'Relâmpago', difficulty: 'Médio',
    text: 'Qual modelo de IA é famoso por gerar imagens a partir de texto?',
    options: ['BERT', 'DALL-E', 'ResNet', 'LSTM'],
    correctIndex: 1,
    explanation: 'DALL-E, criado pela OpenAI, gera imagens originais a partir de descrições textuais.',
  },
  {
    icon: '⚡', category: 'Relâmpago', difficulty: 'Difícil',
    text: 'O que é "hallucination" em LLMs?',
    options: ['Bug de memória', 'Quando o modelo gera informações falsas com confiança', 'Erro de GPU', 'Latência alta'],
    correctIndex: 1,
    explanation: 'Alucinação é quando o modelo gera informações plausíveis mas factualmente incorretas.',
  },
  {
    icon: '⚡', category: 'Relâmpago', difficulty: 'Fácil',
    text: 'Qual empresa criou o ChatGPT?',
    options: ['Google', 'OpenAI', 'Meta', 'Microsoft'],
    correctIndex: 1,
    explanation: 'O ChatGPT foi criado pela OpenAI e lançado em novembro de 2022.',
  },
  {
    icon: '⚡', category: 'Relâmpago', difficulty: 'Médio',
    text: 'O que é "fine-tuning" em IA?',
    options: ['Ajustar hiperparâmetros', 'Retreinar um modelo pré-treinado para tarefa específica', 'Comprimir o modelo', 'Aumentar o dataset'],
    correctIndex: 1,
    explanation: 'Fine-tuning adapta um modelo pré-treinado para uma tarefa ou domínio específico com dados adicionais.',
  },
  {
    icon: '⚡', category: 'Relâmpago', difficulty: 'Difícil',
    text: 'O que é RAG (Retrieval-Augmented Generation)?',
    options: ['Tipo de GPU', 'Combinar busca de dados com geração de texto', 'Rede adversarial', 'Método de compressão'],
    correctIndex: 1,
    explanation: 'RAG combina recuperação de informações de bases de dados com geração de texto por LLMs para respostas mais precisas.',
  },
];

interface LightningChallengeProps {
  onComplete: (xpGained: number) => void;
  onClose: () => void;
}

export default function LightningChallenge({ onComplete, onClose }: LightningChallengeProps) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [questions] = useState(() => {
    const shuffled = [...LIGHTNING_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalTime, setTotalTime] = useState(0);

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || answered) return;
    if (timeLeft <= 0) {
      // Time's up — auto-fail current question
      setAnswered(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft, answered]);

  const handleSelect = (idx: number) => {
    if (answered || phase !== 'playing') return;
    setSelected(idx);
    setAnswered(true);
    setTotalTime(prev => prev + (60 - timeLeft));
    if (idx === questions[currentQ].correctIndex) {
      setCorrect(c => c + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(60);
    } else {
      setPhase('result');
    }
  };

  const xpGained = correct * 30; // Triple XP (normal is 10)
  const q = questions[currentQ];
  const urgency = timeLeft <= 10;

  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-5">
        <div className="w-full max-w-[400px] flex flex-col items-center gap-6 animate-fade-in">
          <div className="relative">
            <div className="text-6xl animate-bobble">⚡</div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive flex items-center justify-center animate-pulse">
              <span className="text-[10px] font-black text-white">3x</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Desafio Relâmpago!</h1>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              3 perguntas, 60 segundos cada. Responda rápido e ganhe <strong className="text-primary">XP TRIPLO</strong>!
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Tempo</div>
              <div className="text-lg font-black text-foreground">60s</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase">XP</div>
              <div className="text-lg font-black text-primary">3x</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Star className="w-5 h-5 text-gold mx-auto mb-1" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Questões</div>
              <div className="text-lg font-black text-foreground">3</div>
            </div>
          </div>

          <button
            onClick={() => setPhase('playing')}
            className="mt-2 px-8 py-4 rounded-2xl font-display font-bold text-base text-white cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-orange-500 to-red-500"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Aceitar Desafio
            </span>
          </button>

          <button onClick={onClose} className="text-sm text-muted-foreground font-semibold cursor-pointer hover:text-foreground transition-colors">
            Agora não
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-5">
        <div className="w-full max-w-[400px] flex flex-col items-center gap-6 animate-fade-in">
          <div className="text-6xl">{correct === questions.length ? '🏆' : correct > 0 ? '⚡' : '😔'}</div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {correct === questions.length ? 'Perfeito!' : correct > 0 ? 'Bom trabalho!' : 'Tente novamente!'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Você acertou {correct}/{questions.length} no Desafio Relâmpago
            </p>
          </div>

          <div className="w-full rounded-2xl border border-border bg-card p-6 text-center">
            <div className="text-4xl font-display font-black text-primary mb-1">+{xpGained} XP</div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase">Recompensa tripla ⚡</div>
          </div>

          <button
            onClick={() => onComplete(xpGained)}
            className="w-full py-4 rounded-2xl font-display font-bold text-base text-primary-foreground cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
          >
            Coletar Recompensa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-5">
      <div className="w-full max-w-[460px] pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="text-muted-foreground text-sm font-bold hover:text-foreground transition-colors cursor-pointer">
            ✕
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-[12px] font-extrabold text-orange-500 uppercase">Relâmpago</span>
          </div>
          <span className="text-[12px] font-bold text-muted-foreground">{currentQ + 1}/{questions.length}</span>
        </div>

        {/* Timer */}
        <div className="relative mb-6">
          <div className={`h-3 rounded-full overflow-hidden ${urgency ? 'bg-destructive/20' : 'bg-muted'}`}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ${urgency ? 'bg-destructive animate-pulse' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>
          <div className={`absolute right-0 -top-6 flex items-center gap-1 ${urgency ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}>
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[13px] font-black">{timeLeft}s</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-5 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-500">⚡ {q.category} · {q.difficulty}</span>
          <h2 className="font-display text-lg font-bold text-foreground leading-snug mt-2">{q.text}</h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-5">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrectOpt = i === q.correctIndex;
            let style = 'bg-card border-border hover:border-orange-400/40 cursor-pointer';
            if (answered) {
              if (isCorrectOpt) style = 'bg-primary/10 border-primary/40';
              else if (isSelected) style = 'bg-destructive/10 border-destructive/40';
              else style = 'bg-card border-border opacity-50';
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={answered}
                className={`w-full text-left p-4 rounded-xl border-[1.5px] transition-all ${style}`}>
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-[12px] font-black text-muted-foreground flex-shrink-0">
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

        {/* Explanation + Next */}
        {answered && (
          <>
            <div className={`rounded-xl border p-4 mb-5 animate-fade-in ${
              selected === q.correctIndex ? 'bg-primary/5 border-primary/20' : timeLeft <= 0 && selected === null ? 'bg-muted border-border' : 'bg-destructive/5 border-destructive/20'
            }`}>
              <p className="text-[12px] font-semibold text-foreground leading-relaxed">
                {timeLeft <= 0 && selected === null ? '⏰ Tempo esgotado! ' : ''}{q.explanation}
              </p>
            </div>
            <button onClick={handleNext}
              className="w-full py-4 rounded-2xl font-display font-bold text-base text-white cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center gap-2">
              {currentQ < questions.length - 1 ? 'Próxima ⚡' : 'Ver Resultado'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
