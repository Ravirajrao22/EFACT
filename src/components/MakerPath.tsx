import React from 'react';
import { Smartphone, Puzzle, Terminal, Cpu, CheckCircle } from 'lucide-react';

interface MakerPathProps {
  completedCount: number;
}

export const MakerPath: React.FC<MakerPathProps> = ({ completedCount }) => {
  // Determine current active level
  let currentRank = 1;
  if (completedCount >= 6) currentRank = 4;
  else if (completedCount >= 3) currentRank = 3;
  else if (completedCount >= 1) currentRank = 2;

  const stations = [
    {
      level: 1,
      name: 'User',
      badgeColor: 'bg-[#E3DDCF] text-ink',
      borderColor: 'border-ink',
      icon: <Smartphone className="w-6 h-6" />,
      desc: 'Consumer mode: swipes feeds, consumes video, plays pre-built games.',
      criteria: 'Start here',
    },
    {
      level: 2,
      id: 'algorithmic-foundations',
      trackName: 'Algorithmic Foundations',
      name: 'Tinkerer',
      badgeColor: 'bg-yellow text-ink',
      borderColor: 'border-ink',
      icon: <Puzzle className="w-6 h-6" />,
      desc: 'Snaps visual blocks, experiments with sensors, controls virtual rovers.',
      criteria: '1–2 missions solved',
    },
    {
      level: 3,
      id: 'applied-syntax-bridge',
      trackName: 'Applied Syntax Bridge',
      name: 'Coder',
      badgeColor: 'bg-violet text-white',
      borderColor: 'border-ink',
      icon: <Terminal className="w-6 h-6" />,
      desc: 'Writes real Python, creates custom functions, designs algorithmic logic.',
      criteria: '3–5 missions solved',
    },
    {
      level: 4,
      id: 'autonomous-engineering',
      trackName: 'Autonomous Engineering',
      name: 'Maker',
      badgeColor: 'bg-orange text-white',
      borderColor: 'border-ink',
      icon: <Cpu className="w-6 h-6" />,
      desc: 'Programs physical microcontroller hardware, builds real robots at school workshops.',
      criteria: '6+ missions solved',
    },
  ];

  return (
    <section id="maker-path" className="py-20 px-4 md:px-8 max-w-[1240px] mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block px-3 py-1 rounded-full bg-orange text-white border-ink-2 font-mono text-xs font-bold shadow-hard-sm mb-3">
          Growth Trajectory
        </div>
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink tracking-tight mb-4">
          From <span className="text-ink-soft line-through">User</span> to{' '}
          <span className="marker-lime">Maker</span>.
        </h2>
        <p className="font-body text-ink-soft text-lg">
          Technology is not magic; it is engineered. Here is the path students traverse from passive consumer to autonomous builder.
        </p>
      </div>

      {/* Progress Path Stations */}
      <div className="relative">
        {/* Connecting SVG Path Line (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 border-t-2 border-dashed border-ink/40 z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {stations.map((st) => {
            const isCurrent = currentRank === st.level;
            const isAchieved = currentRank >= st.level;

            return (
              <div
                key={st.level}
                id={st.id}
                className={`bg-paper border-ink-2 rounded-2xl p-6 shadow-hard flex flex-col justify-between transition-all scroll-mt-24 ${
                  isCurrent ? 'ring-4 ring-blue ring-offset-2 scale-[1.03] shadow-hard-lg' : ''
                }`}
              >
                <div>
                  {/* Top Badge & Level Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-ink-soft uppercase tracking-wider">
                      Level {st.level}
                    </span>
                    {isAchieved && (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-blue">
                        <CheckCircle className="w-3.5 h-3.5 text-lime fill-lime text-ink" />
                        <span>Achieved</span>
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div
                    className={`w-12 h-12 rounded-xl border-ink-2 shadow-hard-sm flex items-center justify-center mb-4 ${st.badgeColor}`}
                  >
                    {st.icon}
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-ink mb-1">
                    {st.name}
                  </h3>
                  {st.trackName && (
                    <div className="font-mono text-xs text-blue font-bold mb-2">
                      {st.trackName}
                    </div>
                  )}
                  <p className="font-body text-ink-soft text-sm leading-relaxed mb-6">
                    {st.desc}
                  </p>
                </div>

                {/* Bottom Status Chip */}
                <div className="pt-4 border-t border-ink/15 flex items-center justify-between font-mono text-xs">
                  <span className="text-ink-soft">{st.criteria}</span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-blue text-white font-bold animate-pulse">
                      You are here
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maker rank unlock message if completed >= 6 */}
      {completedCount >= 6 && (
        <div className="mt-12 p-4 bg-orange/15 border-ink-2 rounded-xl text-center font-mono text-sm font-bold text-ink shadow-hard-sm max-w-xl mx-auto">
          🚀 <span className="font-extrabold">Maker Rank Unlocked!</span> Ready for hands-on microcontrollers and hardware robotics? Ask your school teacher about bringing EFACT workshops to your campus.
        </div>
      )}
    </section>
  );
};

