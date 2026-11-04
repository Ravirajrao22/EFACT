import React from 'react';
import { Layers, Sparkles, Cpu, CheckCircle } from 'lucide-react';

interface ProgrammeProps {
  selectedStage: number | null;
  onSelectStage: (stageIndex: number) => void;
}

export const Programme: React.FC<ProgrammeProps> = ({ selectedStage, onSelectStage }) => {
  const tracks = [
    {
      stage: 1,
      name: 'The Core Logic',
      target: 'For students beginning with coding',
      desc: 'Build computational thinking, logical sequencing, spatial reasoning and problem-solving before introducing programming syntax.',
      accentColor: 'blue',
      icon: <Layers className="w-6 h-6 text-blue" />,
      topics: [
        'Algorithmic sequencing & flow logic',
        'Spatial decomposition & map navigation',
        'Variables and conditional decision trees',
        'Pattern recognition and loop constructs',
      ],
    },
    {
      stage: 2,
      name: 'The Physical Computing Bridge',
      target: 'For schools with coding experience but limited robotics exposure',
      desc: 'Connect programming with sensors, motors, electronics and physical systems.',
      accentColor: 'violet',
      icon: <Sparkles className="w-6 h-6 text-violet" />,
      topics: [
        'Breadboard prototyping and circuit design',
        'Sensor integration (ultrasonic, line, light)',
        'Motor control, PWM, and actuator dynamics',
        'Microcontroller programming (Arduino C++ & MicroPython)',
      ],
    },
    {
      stage: 3,
      name: 'Autonomous Systems Engineering',
      target: 'For schools with existing coding and robotics experience',
      desc: 'Take students into advanced programming, algorithm design, system development and autonomous robotics.',
      accentColor: 'orange',
      icon: <Cpu className="w-6 h-6 text-orange" />,
      topics: [
        'Autonomous navigation & PID feedback loops',
        'Custom PCB schematic and board fabrication',
        'Multi-sensor telemetry & data processing',
        'Capstone product design and competition prep',
      ],
    },
  ];

  return (
    <section id="programme" className="py-[72px] md:py-24 lg:py-32 px-4 md:px-8 max-w-[1240px] mx-auto border-t-2 border-ink">
      {/* Header */}
      <div className="max-w-[720px] mb-10 lg:mb-14">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-blue mb-3 block">
          Curriculum Architecture
        </span>
        <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.08] tracking-tight text-ink mb-4">
          A programme that starts where your school is.
        </h2>
        <p className="font-body text-[18px] leading-[1.6] text-ink-soft max-w-[62ch]">
          The objective is not to follow a fixed path. It is to help every school progress from its current capabilities.
        </p>
      </div>

      {/* 3 Track Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tracks.map((track) => {
          const isChosenInHero = selectedStage === track.stage;
          return (
            <div
              key={track.stage}
              onClick={() => onSelectStage(track.stage)}
              className={`bg-white border-ink-2 rounded-[16px] p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                isChosenInHero
                  ? 'ring-4 ring-lime shadow-hard-lg'
                  : 'shadow-hard hover:-translate-x-[1px] hover:-translate-y-[1px]'
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Stage 0{track.stage}
                  </span>
                  {isChosenInHero && (
                    <span className="px-2.5 py-0.5 rounded-full bg-lime border border-ink font-mono text-[11px] font-extrabold text-ink shadow-sm">
                      Your Selected Stage
                    </span>
                  )}
                </div>

                {/* Icon & Title */}
                <div className="w-12 h-12 rounded-xl bg-paper border-ink-2 flex items-center justify-center mb-4 shadow-sm">
                  {track.icon}
                </div>

                <h3 className="font-heading font-extrabold text-[24px] text-ink mb-1.5">
                  {track.name}
                </h3>
                <div className="font-mono text-xs font-semibold text-blue mb-3">
                  {track.target}
                </div>

                <p className="font-body text-[15px] leading-relaxed text-ink-soft mb-6">
                  {track.desc}
                </p>

                {/* Topics List */}
                <div className="pt-4 border-t border-ink/10">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2 block">
                    Core Focus Areas:
                  </span>
                  <ul className="space-y-2 font-body text-[14px] text-ink">
                    {track.topics.map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-lime fill-ink stroke-paper shrink-0 mt-1" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-8 pt-4 border-t border-ink/10 flex items-center justify-between">
                <a
                  href="#schools"
                  className="font-heading font-bold text-sm text-blue hover:text-ink hover:underline inline-flex items-center gap-1"
                >
                  <span>Book pilot for {track.name}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

