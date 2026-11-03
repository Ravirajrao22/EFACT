import React from 'react';
import { Blocks, Eye, Terminal, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 md:px-8 bg-paper-2 border-y-ink-2 relative">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-violet text-white border-ink-2 font-mono text-xs font-bold shadow-hard-sm mb-3">
            The Bridge Philosophy
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink tracking-tight mb-4">
            Blocks today.{' '}
            <span className="marker-yellow">Real Python</span> tomorrow.
          </h2>
          <p className="font-body text-ink-soft text-lg">
            Traditional tools trap students in toy block environments. EFACT Studio creates an explicit, step-by-step pathway directly to industrial code.
          </p>
        </div>

        {/* 3 Big Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Snap */}
          <div className="bg-paper border-ink-2 rounded-2xl p-6 shadow-hard relative transform md:-rotate-1 hover:rotate-0 transition-transform">
            <div className="absolute -top-4 -left-3 w-9 h-9 rounded-full bg-blue text-white border-ink-2 shadow-hard-sm flex items-center justify-center font-mono font-bold text-sm">
              1
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue/15 border-ink-2 flex items-center justify-center text-blue mb-4">
              <Blocks className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-ink mb-2">Snap</h3>
            <p className="font-body text-ink-soft text-base leading-relaxed mb-4">
              Build complete robot algorithms with snapping logic blocks. Zero syntax friction, 100% focus on problem decomposition and spatial reasoning.
            </p>
            <div className="bg-paper-2 p-2.5 rounded-lg border border-ink/20 font-mono text-xs text-ink-soft">
              <code>bot.forward(4)</code>
            </div>
          </div>

          {/* Card 2: Peek */}
          <div className="bg-paper border-ink-2 rounded-2xl p-6 shadow-hard relative transform md:rotate-0 hover:-rotate-1 transition-transform">
            <div className="absolute -top-4 -left-3 w-9 h-9 rounded-full bg-violet text-white border-ink-2 shadow-hard-sm flex items-center justify-center font-mono font-bold text-sm">
              2
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet/15 border-ink-2 flex items-center justify-center text-violet mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-ink mb-2">Peek</h3>
            <p className="font-body text-ink-soft text-base leading-relaxed mb-4">
              Every single block translates instantly into clean, readable Python next to it. Hover over any block to watch its Python lines glow in violet.
            </p>
            <div className="bg-panel-dark text-white p-2.5 rounded-lg border border-ink/20 font-mono text-xs">
              <span className="text-yellow">while not</span> bot.at_goal():
            </div>
          </div>

          {/* Card 3: Type */}
          <div className="bg-paper border-ink-2 rounded-2xl p-6 shadow-hard relative transform md:rotate-1 hover:rotate-0 transition-transform">
            <div className="absolute -top-4 -left-3 w-9 h-9 rounded-full bg-orange text-white border-ink-2 shadow-hard-sm flex items-center justify-center font-mono font-bold text-sm">
              3
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange/15 border-ink-2 flex items-center justify-center text-orange mb-4">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-ink mb-2">Type</h3>
            <p className="font-body text-ink-soft text-base leading-relaxed mb-4">
              Flip the switch to Python Mode. Write the code yourself in a code editor with autocomplete, debugging, and line execution in the exact same arena.
            </p>
            <div className="bg-paper-2 p-2.5 rounded-lg border border-ink/20 font-mono text-xs text-ink-soft">
              <code>def search_wall():</code>
            </div>
          </div>
        </div>

        {/* Animated Horizontal Bridge Graphic */}
        <div className="bg-paper border-ink-2 rounded-2xl p-8 shadow-hard-lg max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-full flex items-center justify-between gap-4 relative py-8">
            {/* Left Island: Blocks */}
            <div className="px-5 py-3 rounded-xl bg-blue text-white border-ink-2 shadow-hard text-center z-10 shrink-0">
              <div className="font-mono text-xs uppercase opacity-80">Foundation</div>
              <div className="font-heading font-extrabold text-lg sm:text-xl">Blocks Logic</div>
            </div>

            {/* Connecting Bridge Track */}
            <div className="flex-1 relative flex items-center justify-center">
              <div className="w-full h-2 border-t-2 border-b-2 border-dashed border-ink" />

              {/* Little Crossing Robot */}
              <div className="absolute px-3 py-1.5 rounded-full bg-orange text-white border-ink-2 shadow-hard-sm flex items-center gap-1.5 font-mono text-xs font-bold animate-pulse">
                <span>🤖</span>
                <span className="hidden sm:inline">Active Bridge</span>
              </div>
            </div>

            {/* Right Island: Python */}
            <div className="px-5 py-3 rounded-xl bg-violet text-white border-ink-2 shadow-hard text-center z-10 shrink-0">
              <div className="font-mono text-xs uppercase opacity-80">Destination</div>
              <div className="font-heading font-extrabold text-lg sm:text-xl">Real Python 3</div>
            </div>
          </div>

          <p className="font-mono text-xs sm:text-sm text-ink-soft text-center mt-2">
            No second subject to learn. It's the same thing, one level up.
          </p>
        </div>
      </div>
    </section>
  );
};

