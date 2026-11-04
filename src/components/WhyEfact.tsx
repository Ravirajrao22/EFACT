import React from 'react';
import {
  TrendingDown,
  Unlink,
  Frown,
  Bot,
  Terminal,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ArrowRight,
  Wrench,
} from 'lucide-react';

export const WhyEfact: React.FC = () => {
  return (
    <section id="why" className="py-[72px] md:py-24 lg:py-32 px-4 md:px-8 max-w-[1240px] mx-auto border-t-2 border-ink">
      {/* Section Header */}
      <div className="max-w-[720px] mb-10 lg:mb-14">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-blue mb-3 block">
          Why EFACT
        </span>
        <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.08] tracking-tight text-ink mb-4">
          Coding class loses students by week two.{' '}
          <span className="marker-yellow">We fixed that.</span>
        </h2>
        <p className="font-body text-[18px] leading-[1.6] text-ink-soft max-w-[62ch]">
          Schools invest in software and hardware, but curiosity runs out when exercises feel disconnected and patronizing. Here is what goes wrong, and how EFACT addresses each stage.
        </p>
      </div>

      {/* Problem -> Solution Board */}
      <div className="w-full">
        {/* Desktop Column Headers */}
        <div className="hidden lg:grid grid-cols-[1fr_96px_1.15fr] items-center mb-6 px-2">
          <div className="flex items-center">
            <div className="h-10 px-4 py-2 rounded-[8px] bg-[#E7E1D6] border-[2.5px] border-dashed border-ink font-mono text-[13px] font-semibold tracking-[0.12em] flex items-center gap-2 text-ink">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <span>THE GLITCH</span>
            </div>
          </div>
          <div aria-hidden="true" />
          <div className="flex items-center">
            <div className="h-10 px-4 py-2 rounded-[8px] bg-lime border-[2.5px] border-solid border-ink font-mono text-[13px] font-semibold tracking-[0.12em] shadow-hard-sm flex items-center gap-2 text-ink">
              <Zap className="w-4 h-4 text-ink fill-ink" />
              <span>THE FIX</span>
            </div>
          </div>
        </div>

        {/* The 3 Pairs */}
        <ul role="list" aria-label="Problems and how EFACT Studio fixes them" className="space-y-6">
          {/* PAIR 1 */}
          <li className="grid grid-cols-1 lg:grid-cols-[1fr_96px_1.15fr] items-stretch gap-4 lg:gap-0">
            {/* Problem Card 1 */}
            <div className="bg-glitch border-[2.5px] border-dashed border-ink rounded-[14px] p-6 sm:p-8 min-h-[140px] flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-8 h-8 flex items-center justify-center text-glitch-ink">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-ink/40 font-mono text-[11px] font-bold text-glitch-ink uppercase bg-white/50">
                  <span className="lg:hidden text-ink font-extrabold mr-1">THE GLITCH:</span>
                  <span>INTEREST DROPS</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-[20px] text-ink leading-snug mb-2">
                  You try it a few times. Then it's dead.
                </h3>
                <p className="font-body text-[16px] text-ink-soft leading-[1.55]">
                  Same tiny exercises, nothing real at the end. Your curiosity runs out before anything actually works.
                </p>
              </div>
            </div>

            {/* Bridge 1 (Desktop) */}
            <div className="hidden lg:flex items-center justify-center relative" aria-hidden="true">
              <svg className="w-full h-8" viewBox="0 0 96 32" fill="none">
                <line x1="0" y1="16" x2="96" y2="16" stroke="#14110F" strokeWidth="2.5" strokeDasharray="6 6" />
              </svg>
              <div className="absolute w-10 h-10 rounded-full bg-lime border-[2.5px] border-ink flex items-center justify-center shadow-hard-sm">
                <Zap className="w-4 h-4 text-ink fill-ink" />
              </div>
            </div>

            {/* Solution Card 1 */}
            <div className="bg-white border-[2.5px] border-solid border-ink rounded-[14px] shadow-hard p-6 sm:p-8 min-h-[140px] relative overflow-hidden flex flex-col justify-between hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-blue" />
              <div className="pl-3">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center text-blue">
                    <Bot className="w-8 h-8 stroke-[1.75]" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime border border-ink font-mono text-[11px] font-bold text-ink uppercase">
                    <Zap className="w-3 h-3 fill-ink text-ink" />
                    <span>REAL ROBOT</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[22px] text-ink leading-snug mb-2">
                    A robot that actually moves.
                  </h3>
                  <p className="font-body text-[16px] text-ink leading-[1.55]">
                    Every mission ends with a result you can see and re-run in seconds. Fail, tweak, try again. That's the whole loop.
                  </p>
                </div>
              </div>
            </div>
          </li>

          {/* PAIR 2 */}
          <li className="grid grid-cols-1 lg:grid-cols-[1fr_96px_1.15fr] items-stretch gap-4 lg:gap-0">
            {/* Problem Card 2 */}
            <div className="bg-glitch border-[2.5px] border-dashed border-ink rounded-[14px] p-6 sm:p-8 min-h-[140px] flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-8 h-8 flex items-center justify-center text-glitch-ink">
                  <Unlink className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-ink/40 font-mono text-[11px] font-bold text-glitch-ink uppercase bg-white/50">
                  <span className="lg:hidden text-ink font-extrabold mr-1">THE GLITCH:</span>
                  <span>DISCONNECTED</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-[20px] text-ink leading-snug mb-2">
                  Blocks over here. Python over there.
                </h3>
                <p className="font-body text-[16px] text-ink-soft leading-[1.55]">
                  Scratch-style tools are fun, but when real code shows up it feels like a brand-new subject with nothing in common.
                </p>
              </div>
            </div>

            {/* Bridge 2 (Desktop) */}
            <div className="hidden lg:flex items-center justify-center relative" aria-hidden="true">
              <svg className="w-full h-8" viewBox="0 0 96 32" fill="none">
                <line x1="0" y1="16" x2="96" y2="16" stroke="#14110F" strokeWidth="2.5" strokeDasharray="6 6" />
              </svg>
              <div className="absolute w-10 h-10 rounded-full bg-lime border-[2.5px] border-ink flex items-center justify-center shadow-hard-sm">
                <Wrench className="w-4 h-4 text-ink" />
              </div>
            </div>

            {/* Solution Card 2 */}
            <div className="bg-white border-[2.5px] border-solid border-ink rounded-[14px] shadow-hard p-6 sm:p-8 min-h-[140px] relative overflow-hidden flex flex-col justify-between hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-violet" />
              <div className="pl-3">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center text-violet">
                    <Terminal className="w-8 h-8 stroke-[1.75]" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime border border-ink font-mono text-[11px] font-bold text-ink uppercase">
                    <Zap className="w-3 h-3 fill-ink text-ink" />
                    <span>BLOCKS &lt;-&gt; PYTHON</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[22px] text-ink leading-snug mb-2">
                    Every block shows its Python twin.
                  </h3>
                  <p className="font-body text-[16px] text-ink leading-[1.55]">
                    Snap blocks and watch real Python write itself next to them. Switch to typing it yourself when you're ready.
                  </p>
                </div>
              </div>
            </div>
          </li>

          {/* PAIR 3 */}
          <li className="grid grid-cols-1 lg:grid-cols-[1fr_96px_1.15fr] items-stretch gap-4 lg:gap-0">
            {/* Problem Card 3 */}
            <div className="bg-glitch border-[2.5px] border-dashed border-ink rounded-[14px] p-6 sm:p-8 min-h-[140px] flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-8 h-8 flex items-center justify-center text-glitch-ink">
                  <Frown className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-ink/40 font-mono text-[11px] font-bold text-glitch-ink uppercase bg-white/50">
                  <span className="lg:hidden text-ink font-extrabold mr-1">THE GLITCH:</span>
                  <span>PATRONIZING</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-[20px] text-ink leading-snug mb-2">
                  Treated like a little kid.
                </h3>
                <p className="font-body text-[16px] text-ink-soft leading-[1.55]">
                  Cartoon mascots, fake praise, points for nothing. You can tell when you're being managed.
                </p>
              </div>
            </div>

            {/* Bridge 3 (Desktop) */}
            <div className="hidden lg:flex items-center justify-center relative" aria-hidden="true">
              <svg className="w-full h-8" viewBox="0 0 96 32" fill="none">
                <line x1="0" y1="16" x2="96" y2="16" stroke="#14110F" strokeWidth="2.5" strokeDasharray="6 6" />
              </svg>
              <div className="absolute w-10 h-10 rounded-full bg-lime border-[2.5px] border-ink flex items-center justify-center shadow-hard-sm">
                <Zap className="w-4 h-4 text-ink fill-ink" />
              </div>
            </div>

            {/* Solution Card 3 */}
            <div className="bg-white border-[2.5px] border-solid border-ink rounded-[14px] shadow-hard p-6 sm:p-8 min-h-[140px] relative overflow-hidden flex flex-col justify-between hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-orange" />
              <div className="pl-3">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center text-orange">
                    <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime border border-ink font-mono text-[11px] font-bold text-ink uppercase">
                    <Zap className="w-3 h-3 fill-ink text-ink" />
                    <span>RESPECT</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[22px] text-ink leading-snug mb-2">
                    Real challenges. Honest feedback.
                  </h3>
                  <p className="font-body text-[16px] text-ink leading-[1.55]">
                    Clean stats, par scores, and error messages that explain what went wrong. No confetti. Ever.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>

        {/* Teacher Strip */}
        <div className="bg-paper-2 border-[2.5px] border-dashed border-ink rounded-[14px] p-6 sm:p-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body font-medium text-[16px] leading-relaxed text-ink">
            Teachers feel it too: you want to teach coding, but the tools don't hold students past week two. EFACT Studio drops into your existing curriculum.
          </p>
          <a
            href="#schools"
            className="font-heading font-bold text-blue hover:text-ink shrink-0 inline-flex items-center gap-1.5 hover:underline"
          >
            <span>See for schools</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* How interest feels chart card (Placed below the board, centered, max-w-640px) */}
        <div className="mt-12 max-w-[640px] mx-auto bg-white border-ink-2 rounded-[14px] shadow-hard p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 border-b border-ink/10 pb-3">
            <h3 className="font-heading font-bold text-xl text-ink">
              How interest feels
            </h3>
            <span className="font-mono text-xs text-ink-soft">Week 1 - 6</span>
          </div>

          {/* Inline SVG Line Chart */}
          <div className="w-full h-[160px] relative">
            <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible" aria-describedby="interest-chart-desc">
              {/* Guidelines */}
              <line x1="30" y1="20" x2="290" y2="20" stroke="rgba(20,17,15,0.08)" strokeWidth="1" />
              <line x1="30" y1="55" x2="290" y2="55" stroke="rgba(20,17,15,0.08)" strokeWidth="1" />
              <line x1="30" y1="90" x2="290" y2="90" stroke="rgba(20,17,15,0.08)" strokeWidth="1" />

              {/* Y Axis labels */}
              <text x="5" y="24" fontSize="9" fill="#6B645B" fontFamily="JetBrains Mono">High</text>
              <text x="5" y="94" fontSize="9" fill="#6B645B" fontFamily="JetBrains Mono">Low</text>

              {/* Typical class: Starts high, sharp drop at week 3 */}
              <path
                d="M 35 25 Q 80 30, 130 85 T 285 95"
                fill="none"
                stroke="#6B645B"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />

              {/* EFACT: Starts steady, rises gradually */}
              <path
                d="M 35 50 Q 120 45, 180 32 T 285 18"
                fill="none"
                stroke="#FF6B2C"
                strokeWidth="3.5"
              />

              {/* End points */}
              <circle cx="285" cy="95" r="4" fill="#6B645B" />
              <circle cx="285" cy="18" r="4.5" fill="#FF6B2C" stroke="#14110F" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono font-medium mt-3 pt-3 border-t border-ink/10">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#6B645B]" />
              <span className="text-ink-soft">Typical class</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-orange rounded-full" />
              <span className="text-ink font-bold">With EFACT Studio</span>
            </div>
            <span className="text-ink-soft text-[11px]">Illustrative, not measured data.</span>
          </div>

          <p id="interest-chart-desc" className="sr-only">
            Line chart comparing student interest over 6 weeks: typical coding classes drop sharply after week 2; with EFACT Studio, student interest stays steady and rises through week 6.
          </p>
        </div>
      </div>
    </section>
  );
};

