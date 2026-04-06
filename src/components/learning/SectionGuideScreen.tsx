import { Section, PlayerState } from './types';
import { BIOMES } from './BiomeBackground';
import { ArrowLeft, BookOpen, CheckCircle2, Lock, Star, Brain, Target } from 'lucide-react';

interface SectionGuideScreenProps {
  section: Section;
  sectionIdx: number;
  player: PlayerState;
  onClose: () => void;
  onSelectLesson: (lessonIdx: number) => void;
}

export default function SectionGuideScreen({ section, sectionIdx, player, onClose, onSelectLesson }: SectionGuideScreenProps) {
  const biome = BIOMES[sectionIdx % BIOMES.length];
  const completedLessons = player.sectionProgress[section.id] || [];
  const perfectLessons = player.perfectLessons[section.id] || [];
  const testCompleted = player.testsCompleted[section.id] || false;
  const totalLessons = section.lessons.length;
  const completedCount = completedLessons.length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const totalQuestions = section.lessons.reduce((sum, l) => sum + l.questions.length, 0);
  const difficultyBreakdown = section.lessons.reduce(
    (acc, l) => {
      l.questions.forEach(q => {
        if (q.difficulty === 'Fácil') acc.easy++;
        else if (q.difficulty === 'Médio') acc.medium++;
        else acc.hard++;
      });
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 }
  );

  const allTopics = section.lessons.flatMap(l => l.topics);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      {/* Hero header */}
      <div
        className="w-full relative overflow-hidden"
        style={{ background: biome.bannerGradient }}
      >
        <div className="max-w-[460px] mx-auto px-5 pt-5 pb-8 relative z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-[13px] font-bold mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao mapa
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{biome.icon}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/60">
              {section.label}
            </span>
          </div>
          <h1 className="text-[22px] font-extrabold text-white leading-tight">{section.title}</h1>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <BookOpen className="w-3.5 h-3.5 text-white/80" />
              <span className="text-[11px] font-bold text-white">{totalLessons} lições</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <Brain className="w-3.5 h-3.5 text-white/80" />
              <span className="text-[11px] font-bold text-white">{totalQuestions} questões</span>
            </div>
            {testCompleted && (
              <div className="flex items-center gap-1.5 bg-white/30 rounded-xl px-3 py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-bold text-white">Aprovado</span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, background: 'rgba(255,255,255,0.8)' }}
              />
            </div>
            <span className="text-[11px] font-extrabold text-white/90">
              {progressPct}%
            </span>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Content */}
      <div className="w-full max-w-[460px] px-5 py-6 space-y-6">
        {/* Difficulty breakdown */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-[13px] font-extrabold text-foreground mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Distribuição de Dificuldade
          </h3>
          <div className="flex items-center gap-3">
            <DifficultyBar label="Fácil" count={difficultyBreakdown.easy} total={totalQuestions} color="hsl(152 68% 45%)" />
            <DifficultyBar label="Médio" count={difficultyBreakdown.medium} total={totalQuestions} color="hsl(40 96% 53%)" />
            <DifficultyBar label="Difícil" count={difficultyBreakdown.hard} total={totalQuestions} color="hsl(0 72% 50%)" />
          </div>
        </div>

        {/* Topics overview */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-[13px] font-extrabold text-foreground mb-3">📚 Tópicos Abordados</h3>
          <div className="flex flex-wrap gap-2">
            {allTopics.map((topic, i) => (
              <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Lessons list */}
        <div>
          <h3 className="text-[14px] font-extrabold text-foreground mb-3">📋 Lições</h3>
          <div className="flex flex-col gap-3">
            {section.lessons.map((lesson, lIdx) => {
              const isCompleted = completedLessons.includes(lIdx);
              const isPerfect = perfectLessons.includes(lIdx);
              const isAvailable = lIdx === 0 || completedLessons.includes(lIdx - 1);
              const isLocked = !isAvailable && !isCompleted;

              return (
                <button
                  key={lIdx}
                  onClick={() => { if (!isLocked) onSelectLesson(lIdx); }}
                  disabled={isLocked}
                  className={`w-full text-left rounded-2xl border-[1.5px] p-4 transition-all ${
                    isCompleted
                      ? 'border-primary/30 bg-primary/[0.04]'
                      : isLocked
                      ? 'border-border bg-muted/20 opacity-50 cursor-default'
                      : 'border-border bg-card hover:border-primary/30 hover:bg-primary/[0.02] cursor-pointer active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Lesson icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      isCompleted ? 'bg-primary/10' : isLocked ? 'bg-muted grayscale' : 'bg-muted/50'
                    }`}>
                      {isLocked ? <Lock className="w-5 h-5 text-muted-foreground/40" /> : lesson.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                          Lição {lIdx + 1}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        )}
                        {isPerfect && (
                          <span className="flex items-center gap-0.5 text-[9px] font-extrabold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Perfeito
                          </span>
                        )}
                      </div>
                      <h4 className="text-[13px] font-bold text-foreground leading-snug truncate">
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        {lesson.description}
                      </p>

                      {/* Topics pills */}
                      {!isLocked && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {lesson.topics.slice(0, 3).map((topic, tIdx) => (
                            <span key={tIdx} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {topic}
                            </span>
                          ))}
                          {lesson.topics.length > 3 && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              +{lesson.topics.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Question count & difficulty */}
                      {!isLocked && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] font-bold text-muted-foreground">
                            {lesson.questions.length} questões
                          </span>
                          <span className="text-muted-foreground/30">•</span>
                          <div className="flex items-center gap-1">
                            {['Fácil', 'Médio', 'Difícil'].map(d => {
                              const count = lesson.questions.filter(q => q.difficulty === d).length;
                              if (count === 0) return null;
                              const dotColor = d === 'Fácil' ? 'bg-emerald-400' : d === 'Médio' ? 'bg-amber-400' : 'bg-red-400';
                              return (
                                <span key={d} className="flex items-center gap-0.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                  <span className="text-[9px] text-muted-foreground">{count}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Final test info */}
        <div className={`rounded-2xl border-[1.5px] p-4 ${
          testCompleted
            ? 'border-amber-300/50 bg-amber-50/50 dark:bg-amber-900/10'
            : completedCount >= totalLessons
            ? 'border-amber-300/30 bg-card'
            : 'border-border bg-muted/20 opacity-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-2xl flex-shrink-0">
              🏆
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-foreground">Prova Final</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {testCompleted
                  ? '✅ Aprovado! Seção concluída.'
                  : completedCount >= totalLessons
                  ? 'Todas as lições completas — prova disponível!'
                  : `Complete ${totalLessons - completedCount} lição(ões) restante(s) para desbloquear.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}

function DifficultyBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex-1">
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-1.5">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-center">
        <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
        <span className="text-[9px] text-muted-foreground/60 ml-1">({count})</span>
      </div>
    </div>
  );
}
