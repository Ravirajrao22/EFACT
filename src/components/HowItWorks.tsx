import React from 'react';
import { Blocks, ArrowLeftRight, Terminal } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="py-[72px] md:py-24 lg:py-32 px-4 md:px-8 max-w-[1240px] mx-auto border-t-2 border-ink">
      {/* Header */}
      <div className="max-w-[720px] mb-10 lg:mb-14">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-blue mb-3 block">
          Pedagogy
        </span>
        <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.08] tracking-tight text-ink mb-4">
          Learn the logic once. Use it in real code.
        </h2>
        <p className="font-body text-[18px] leading-[1.6] text-ink-soft max-w-[62ch]">
          Rather than memorizing abstract syntax or playing in toy block sandboxes, students master computational logic once and apply it across real software and hardware.
        </p>
      </div>

      {/* 3 Straight Cards with Number Badges (No tilt) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        {/* Card 1: Build visually */}
        <div className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 sm:p-8 relative flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-full bg-blue text-white border-ink-2 shadow-hard-sm flex items-center justify-center font-mono font-bold text-sm mb-5">
              1
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue/15 border-ink-2 flex items-center justify-center text-blue mb-4">
              <Blocks className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-ink mb-2">
              Build visually
            </h3>
            <p className="font-body text-ink-soft text-base leading-relaxed">
              Students design the problem-solving logic first using modular visual structures. Focus stays entirely on decomposition, sequencing, and conditions without syntax frustration.
            </p>
          </div>
        </div>

        {/* Card 2: Same problem */}
        <div className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 sm:p-8 relative flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-full bg-violet text-white border-ink-2 shadow-hard-sm flex items-center justify-center font-mono font-bold text-sm mb-5">
              2
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet/15 border-ink-2 flex items-center justify-center text-violet mb-4">
              <ArrowLeftRight className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-ink mb-2">
              Same problem
            </h3>
            <p className="font-body text-ink-soft text-base leading-relaxed">
              The identical problem moves to a code-first environment without altering the underlying logic. Students see a side-by-side mirror of the exact computational steps they just formulated.
            </p>
          </div>
        </div>

        {/* Card 3: Write real code */}
        <div className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 sm:p-8 relative flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-full bg-orange text-white border-ink-2 shadow-hard-sm flex items-center justify-center font-mono font-bold text-sm mb-5">
              3
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange/15 border-ink-2 flex items-center justify-center text-orange mb-4">
              <Terminal className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-ink mb-2">
              Write real code
            </h3>
            <p className="font-body text-ink-soft text-base leading-relaxed">
              Known logic is translated into Python or Arduino C++. Because the architecture is already understood, students learn genuine programming syntax with confidence and independence.
            </p>
          </div>
        </div>
      </div>

      {/* Calm Static Diagram (Inline SVG, Ink lines only, no robot, no animation) */}
      <div className="bg-paper-2 border-ink-2 rounded-[16px] shadow-hard p-8 sm:p-10 max-w-[840px] mx-auto text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-4">
          {/* Left Box: Visual Logic */}
          <div className="w-full sm:w-64 p-5 rounded-[12px] bg-white border-ink-2 shadow-hard-sm text-center">
            <div className="font-mono text-xs uppercase font-bold text-blue mb-1">
              Step 1
            </div>
            <div className="font-heading font-bold text-xl text-ink">
              Visual Logic
            </div>
            <p className="font-body text-xs text-ink-soft mt-1">
              Decomposition &amp; Algorithm
            </p>
          </div>

          {/* SVG Arrow Line */}
          <div className="hidden sm:flex items-center justify-center">
            <svg className="w-20 h-6" viewBox="0 0 80 24" fill="none" aria-hidden="true">
              <line x1="0" y1="12" x2="68" y2="12" stroke="#14110F" strokeWidth="2.5" />
              <polygon points="68,6 80,12 68,18" fill="#14110F" />
            </svg>
          </div>
          <div className="sm:hidden text-ink font-bold text-2xl">↓</div>

          {/* Right Box: Python / C++ */}
          <div className="w-full sm:w-64 p-5 rounded-[12px] bg-white border-ink-2 shadow-hard-sm text-center">
            <div className="font-mono text-xs uppercase font-bold text-violet mb-1">
              Step 2
            </div>
            <div className="font-heading font-bold text-xl text-ink">
              Python / C++
            </div>
            <p className="font-body text-xs text-ink-soft mt-1">
              Syntax &amp; Physical Execution
            </p>
          </div>
        </div>

        {/* Diagram Caption */}
        <p className="font-mono text-xs sm:text-sm text-ink-soft mt-6 border-t border-ink/15 pt-4">
          The mental model already exists. Students only learn the syntax.
        </p>
      </div>
    </section>
  );
};
