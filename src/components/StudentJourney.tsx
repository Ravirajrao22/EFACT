import React from 'react';
import { Smartphone, Puzzle, Terminal, Cpu } from 'lucide-react';

export const StudentJourney: React.FC = () => {
  const stages = [
    {
      level: 1,
      name: 'User',
      tag: 'Passive Consumer',
      badgeColor: 'bg-[#E3DDCF] text-ink',
      icon: <Smartphone className="w-6 h-6 stroke-[1.75]" />,
      desc: 'Consumer mode: swipes feeds, consumes video, plays pre-built games.',
    },
    {
      level: 2,
      name: 'Tinkerer',
      tag: 'Logic & Decomposition',
      badgeColor: 'bg-yellow text-ink',
      icon: <Puzzle className="w-6 h-6 stroke-[1.75]" />,
      desc: 'Snaps visual blocks, experiments with sensors, controls virtual rovers.',
    },
    {
      level: 3,
      name: 'Coder',
      tag: 'Real Syntax Mastery',
      badgeColor: 'bg-violet text-white',
      icon: <Terminal className="w-6 h-6 stroke-[1.75]" />,
      desc: 'Writes real Python, creates custom functions, designs algorithmic logic.',
    },
    {
      level: 4,
      name: 'Maker',
      tag: 'Autonomous Engineering',
      badgeColor: 'bg-orange text-white',
      icon: <Cpu className="w-6 h-6 stroke-[1.75]" />,
      desc: 'Programs physical microcontroller hardware, builds real robots at school workshops.',
    },
  ];

  return (
    <section id="journey" className="py-[72px] md:py-24 lg:py-32 px-4 md:px-8 max-w-[1240px] mx-auto border-t-2 border-ink">
      {/* Header */}
      <div className="max-w-[720px] mb-10 lg:mb-14">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-blue mb-3 block">
          Student Trajectory
        </span>
        <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.08] tracking-tight text-ink mb-4">
          From technology users to technology makers.
        </h2>
        <p className="font-body text-[18px] leading-[1.6] text-ink-soft max-w-[62ch]">
          Technology is not magic; it is engineered. Here is the trajectory students traverse from passive consumer to autonomous builder.
        </p>
      </div>

      {/* Clean Horizontal Stepper (Desktop) / Vertical on Mobile */}
      <div className="relative">
        {/* Horizontal Connecting Line (Desktop) */}
        <div
          className="hidden lg:block absolute top-[80px] left-8 right-8 h-[2.5px] border-t-2 border-dashed border-ink/30 z-0"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
          {stages.map((st) => (
            <div
              key={st.level}
              className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Level Tag & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-ink-soft uppercase tracking-wider">
                    Stage 0{st.level}
                  </span>
                  <span className="font-mono text-[10px] uppercase font-bold text-ink-soft bg-paper-2 px-2 py-0.5 rounded-full border border-ink/15">
                    {st.tag}
                  </span>
                </div>

                {/* Stage Icon */}
                <div
                  className={`w-12 h-12 rounded-xl border-ink-2 shadow-hard-sm flex items-center justify-center mb-4 ${st.badgeColor}`}
                >
                  {st.icon}
                </div>

                {/* Title */}
                <h3 className="font-heading font-extrabold text-[22px] text-ink mb-2">
                  {st.name}
                </h3>

                {/* Description */}
                <p className="font-body text-ink-soft text-[14px] leading-relaxed">
                  {st.desc}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 pt-3 border-t border-ink/10 font-mono text-[11px] text-ink-soft flex items-center justify-between">
                <span>Phase {st.level} of 4</span>
                <span className="text-blue font-bold">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption under Stepper */}
      <div className="mt-12 text-center">
        <p className="font-mono text-xs sm:text-sm font-semibold text-ink-soft bg-paper-2 border border-ink/20 inline-block px-5 py-2.5 rounded-full shadow-sm">
          Our goal: turn technology users into technology makers.
        </p>
      </div>
    </section>
  );
};

