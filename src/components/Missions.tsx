import React, { useState } from 'react';
import { LEVELS, LevelData } from '../sim/levels';
import { Lock, CheckCircle2, Play, Unlock } from 'lucide-react';

interface MissionsProps {
  completedMissions: Record<number, { blocks: number; steps: number }>;
  onSelectAndScroll: (lvlId: number) => void;
}

export const Missions: React.FC<MissionsProps> = ({
  completedMissions,
  onSelectAndScroll,
}) => {
  const [unlockAll, setUnlockAll] = useState(false);

  return (
    <section id="missions" className="py-20 px-4 md:px-8 bg-paper-2 border-y-ink-2">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-lime text-ink border-ink-2 font-mono text-xs font-bold shadow-hard-sm mb-3">
              Curriculum Missions
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink tracking-tight mb-2">
              The Mission Board
            </h2>
            <p className="font-body text-ink-soft text-lg max-w-xl">
              Solve challenges that simulate real autonomous navigation, optical line sensing, and robotic manipulation.
            </p>
          </div>

          {/* Teacher / Tester Override Toggle */}
          <button
            onClick={() => setUnlockAll(!unlockAll)}
            className="self-start md:self-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper border-ink-2 shadow-hard-sm font-mono text-xs font-bold text-ink hover:bg-yellow transition-colors"
          >
            {unlockAll ? <Unlock className="w-3.5 h-3.5 text-blue" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{unlockAll ? 'Teacher Mode: All Unlocked' : 'Unlock All (For Teachers)'}</span>
          </button>
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((lvl, index) => {
            const isCompleted = !!completedMissions[lvl.id];
            // Mission is unlocked if it's the first level, or previous is completed, or unlockAll is true
            const isUnlocked = unlockAll || lvl.id === 1 || !!completedMissions[lvl.id - 1];

            return (
              <div
                key={lvl.id}
                className={`bg-paper border-ink-2 rounded-2xl p-6 shadow-hard flex flex-col justify-between transition-all ${
                  !isUnlocked ? 'opacity-65 grayscale-[30%]' : 'hover:-translate-y-1 hover:shadow-hard-lg'
                }`}
              >
                <div>
                  {/* Top Bar with Level Sticker & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-yellow text-ink border-ink-2 font-mono text-xs font-bold shadow-hard-sm">
                      Mission #{lvl.id}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-ink px-2 py-0.5 rounded-full bg-lime border border-ink">
                        <CheckCircle2 className="w-3.5 h-3.5 text-ink" />
                        <span>Cleared</span>
                      </span>
                    ) : !isUnlocked ? (
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-ink-soft">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-blue font-bold">Available</span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-ink mb-1">
                    {lvl.title}
                  </h3>
                  <p className="font-body text-ink-soft text-sm mb-4">
                    {lvl.subtitle}
                  </p>

                  {/* Tiny Thumbnail Grid representation */}
                  <div className="w-full h-24 bg-paper-2 rounded-xl border border-ink/20 p-2 mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="grid grid-cols-10 gap-0.5 w-20 h-20 opacity-80">
                      {lvl.grid.flatMap((row, r) =>
                        row.map((cell, c) => (
                          <div
                            key={`${r}-${c}`}
                            className={`w-full h-full rounded-[1px] ${
                              cell === 'wall'
                                ? 'bg-ink'
                                : cell === 'goal'
                                ? 'bg-lime'
                                : cell === 'star'
                                ? 'bg-yellow'
                                : cell === 'line'
                                ? 'bg-ink/80'
                                : 'bg-paper'
                            }`}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Concept Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {lvl.concepts.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-paper border border-ink/20 font-mono text-[11px] text-ink-soft"
                      >
                        #{c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => onSelectAndScroll(lvl.id)}
                  className={`w-full py-2.5 px-4 rounded-full font-heading font-bold text-sm border-ink-2 flex items-center justify-center gap-2 transition-all ${
                    isUnlocked
                      ? 'bg-blue text-white shadow-hard-sm hover:translate-x-[1px]'
                      : 'bg-paper text-ink-soft border-ink/30 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isCompleted ? 'Replay Mission' : 'Play Mission'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

