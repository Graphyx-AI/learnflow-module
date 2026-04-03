import { Lesson } from './types';

interface LessonIntroProps {
  lesson: Lesson;
  lessonNumber: number;
  onStart: () => void;
  onClose: () => void;
}

export default function LessonIntro({ lesson, lessonNumber, onStart, onClose }: LessonIntroProps) {
  return (
    <div className="flex flex-col items-center justify-end min-h-screen bg-background relative">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-0" onClick={onClose} />

      {/* Bottom sheet */}
      <div className="w-full max-w-[420px] bg-surface border border-border rounded-t-[28px] p-5 px-5 pb-6 relative z-10 animate-slide-up">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-foreground/15 rounded-full mx-auto mb-3" />

        {/* Icon */}
        <div className="text-[32px] text-center mb-2">{lesson.icon}</div>

        {/* Title */}
        <h2 className="font-display text-lg font-bold text-center text-foreground mb-1">
          Lição {lessonNumber} — {lesson.title}
        </h2>

        {/* Description */}
        <p className="text-[12px] text-muted-foreground text-center leading-relaxed mb-4">
          {lesson.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <IntroStat icon="❓" label="Questões" value={String(lesson.questions.length)} />
          <IntroStat icon="⚡" label="XP" value="+30" valueColor="text-primary" />
          <IntroStat icon="⏱️" label="Tempo" value="~5min" />
        </div>

        {/* Topics */}
        <div className="bg-foreground/[0.03] border border-border rounded-xl p-3 px-3.5 mb-4">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
            Você vai aprender
          </div>
          <div className="flex flex-col gap-1.5">
            {lesson.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px]">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                <span className="text-foreground">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full rounded-xl py-3.5 text-sm font-black text-primary-foreground tracking-wide mb-2 transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
        >
          COMEÇAR LIÇÃO 🚀
        </button>
        <button
          onClick={onClose}
          className="w-full bg-transparent border-none text-[13px] text-muted-foreground cursor-pointer py-2 hover:text-foreground transition-colors"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}

function IntroStat({ icon, label, value, valueColor = 'text-foreground' }: { icon: string; label: string; value: string; valueColor?: string }) {
  return (
    <div className="bg-foreground/[0.04] border border-border rounded-xl p-3 text-center">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-black ${valueColor}`}>{value}</div>
    </div>
  );
}
