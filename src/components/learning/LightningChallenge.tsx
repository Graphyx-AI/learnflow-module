import { useState, useEffect, useCallback } from 'react';
import { Question } from './types';
import { Zap, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

const EASY_QUESTIONS: Question[] = [
  { icon: '⚡', category: 'Básico', difficulty: 'Fácil', text: 'Qual empresa criou o ChatGPT?', options: ['Google', 'OpenAI', 'Meta', 'Microsoft'], correctIndex: 1, explanation: 'O ChatGPT foi criado pela OpenAI e lançado em novembro de 2022.' },
  { icon: '⚡', category: 'Básico', difficulty: 'Fácil', text: 'O que significa "IA"?', options: ['Internet Avançada', 'Inteligência Artificial', 'Interface Automática', 'Integração de Apps'], correctIndex: 1, explanation: 'IA significa Inteligência Artificial — sistemas que simulam capacidades cognitivas humanas.' },
  { icon: '⚡', category: 'Básico', difficulty: 'Fácil', text: 'Qual destes é um assistente de IA?', options: ['Excel', 'Siri', 'Linux', 'Python'], correctIndex: 1, explanation: 'Siri é o assistente de IA da Apple, capaz de entender comandos de voz.' },
  { icon: '⚡', category: 'Básico', difficulty: 'Fácil', text: 'O que um chatbot faz?', options: ['Edita fotos', 'Conversa com humanos via texto', 'Programa jogos', 'Cria planilhas'], correctIndex: 1, explanation: 'Chatbots são programas que simulam conversas humanas via texto ou voz.' },
  { icon: '⚡', category: 'Básico', difficulty: 'Fácil', text: 'IA pode reconhecer imagens?', options: ['Não, apenas texto', 'Sim, usando visão computacional', 'Só em preto e branco', 'Apenas QR codes'], correctIndex: 1, explanation: 'Visão computacional permite que a IA analise e reconheça conteúdo em imagens.' },
];

const MEDIUM_QUESTIONS: Question[] = [
  { icon: '⚡', category: 'Intermediário', difficulty: 'Médio', text: 'Qual modelo de IA gera imagens a partir de texto?', options: ['BERT', 'DALL-E', 'ResNet', 'LSTM'], correctIndex: 1, explanation: 'DALL-E gera imagens originais a partir de descrições textuais.' },
  { icon: '⚡', category: 'Intermediário', difficulty: 'Médio', text: 'O que é "fine-tuning" em IA?', options: ['Ajustar hiperparâmetros', 'Retreinar um modelo pré-treinado para tarefa específica', 'Comprimir o modelo', 'Aumentar o dataset'], correctIndex: 1, explanation: 'Fine-tuning adapta um modelo pré-treinado para uma tarefa específica.' },
  { icon: '⚡', category: 'Intermediário', difficulty: 'Médio', text: 'O que é overfitting?', options: ['Modelo perfeito', 'Modelo que memoriza dados sem generalizar', 'Falta de dados', 'Treino rápido'], correctIndex: 1, explanation: 'Overfitting ocorre quando o modelo decora os dados de treino e falha em dados novos.' },
  { icon: '⚡', category: 'Intermediário', difficulty: 'Médio', text: 'O que são "embeddings"?', options: ['Imagens embutidas', 'Vetores numéricos que representam palavras', 'Links de sites', 'Plugins'], correctIndex: 1, explanation: 'Embeddings convertem palavras em vetores numéricos que capturam significado semântico.' },
  { icon: '⚡', category: 'Intermediário', difficulty: 'Médio', text: 'O que é aprendizado por reforço?', options: ['Estudar muito', 'IA que aprende por tentativa, erro e recompensa', 'Backup de dados', 'Duplicar modelos'], correctIndex: 1, explanation: 'No aprendizado por reforço, o agente aprende tomando ações e recebendo recompensas ou penalidades.' },
];

const HARD_QUESTIONS: Question[] = [
  { icon: '⚡', category: 'Avançado', difficulty: 'Difícil', text: 'O que é "hallucination" em LLMs?', options: ['Bug de memória', 'Gerar informações falsas com confiança', 'Erro de GPU', 'Latência alta'], correctIndex: 1, explanation: 'Alucinação é quando o modelo gera informações plausíveis mas incorretas.' },
  { icon: '⚡', category: 'Avançado', difficulty: 'Difícil', text: 'O que é RAG?', options: ['Tipo de GPU', 'Busca de dados + geração de texto', 'Rede adversarial', 'Compressão'], correctIndex: 1, explanation: 'RAG combina recuperação de informações com geração por LLMs para respostas mais precisas.' },
  { icon: '⚡', category: 'Avançado', difficulty: 'Difícil', text: 'O que é o mecanismo de Attention?', options: ['Filtro de spam', 'Focar nas partes relevantes da entrada', 'Cache de memória', 'Compressão de dados'], correctIndex: 1, explanation: 'Attention permite ao modelo ponderar a importância de cada parte da entrada.' },
  { icon: '⚡', category: 'Avançado', difficulty: 'Difícil', text: 'O que é "model drift"?', options: ['Bug de código', 'Degradação do modelo quando dados mudam ao longo do tempo', 'Modelo lento', 'Erro de deploy'], correctIndex: 1, explanation: 'Model drift ocorre quando a distribuição dos dados muda, fazendo o modelo perder performance.' },
  { icon: '⚡', category: 'Avançado', difficulty: 'Difícil', text: 'O que é quantização de modelos?', options: ['Aumentar parâmetros', 'Reduzir precisão numérica para comprimir o modelo', 'Treinar mais rápido', 'Adicionar camadas'], correctIndex: 1, explanation: 'Quantização reduz a precisão dos pesos (ex: float32 → int8), diminuindo tamanho e acelerando inferência.' },
];

type DifficultyTier = { label: string; questions: Question[]; timePerQuestion: number; color: string };

const DIFFICULTY_TIERS: Record<string, DifficultyTier> = {
  easy: { label: 'Fácil', questions: EASY_QUESTIONS, timePerQuestion: 60, color: 'text-primary' },
  medium: { label: 'Médio', questions: MEDIUM_QUESTIONS, timePerQuestion: 45, color: 'text-orange-500' },
  hard: { label: 'Difícil', questions: HARD_QUESTIONS, timePerQuestion: 30, color: 'text-destructive' },
};

function getTier(level: number): DifficultyTier {
  if (level <= 10) return DIFFICULTY_TIERS.easy;
  if (level <= 20) return DIFFICULTY_TIERS.medium;
  return DIFFICULTY_TIERS.hard;
}

interface LightningChallengeProps {
  onComplete: (xpGained: number) => void;
  onClose: () => void;
  playerLevel?: number;
}

export default function LightningChallenge({ onComplete, onClose, playerLevel = 1 }: LightningChallengeProps) {
  const tier = getTier(playerLevel);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [questions] = useState(() => {
    const shuffled = [...tier.questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(tier.timePerQuestion);
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
      setTimeLeft(tier.timePerQuestion);
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
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">Desafio Relâmpago!</h1>
            <div className={`text-[11px] font-extrabold uppercase tracking-wider ${tier.color} mb-2`}>
              Dificuldade: {tier.label}
            </div>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              3 perguntas, {tier.timePerQuestion}s cada. Responda rápido e ganhe <strong className="text-primary">XP TRIPLO</strong>!
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Tempo</div>
              <div className={`text-lg font-black ${tier.color}`}>{tier.timePerQuestion}s</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase">XP</div>
              <div className="text-lg font-black text-primary">3x</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Star className="w-5 h-5 text-gold mx-auto mb-1" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Nível</div>
              <div className={`text-lg font-black ${tier.color}`}>{tier.label}</div>
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
              style={{ width: `${(timeLeft / tier.timePerQuestion) * 100}%` }}
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
