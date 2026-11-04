import React from 'react';

export const AttentionSpan: React.FC = () => {
  return (
    <section className="bg-ink text-paper py-[72px] md:py-24 lg:py-32 px-6 md:px-12 border-y-ink-2 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto flex flex-col items-start relative z-10">
        {/* Pink Chip (Straight, no tilt) */}
        <div className="inline-block px-4 py-1.5 bg-pink text-ink border-2 border-white shadow-[3px_3px_0_#FFFFFF] font-mono text-xs sm:text-sm font-extrabold rounded-md mb-8">
          ✦ Respect included.
        </div>

        {/* Bold Headline */}
        <blockquote className="font-heading font-extrabold leading-[1.08] tracking-tight mb-8 text-3xl sm:text-5xl md:text-6xl text-paper">
          You don't have a short attention span.
          <br className="hidden sm:inline" />
          <span className="block mt-3">
            You have a{' '}
            <span className="relative inline-block text-ink px-3 py-0.5 bg-lime border-2 border-ink rounded-md">
              low tolerance for being talked down to.
            </span>
          </span>
        </blockquote>

        {/* Philosophy Caption */}
        <p className="font-mono text-sm sm:text-base text-[#D0C9BA] max-w-xl">
          We built EFACT Studio for people who want the real thing. No cartoon cheerleaders, no pointless badge farms. Just genuine robotics problem-solving.
        </p>
      </div>

      {/* Subtle blueprint accent grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(to right, #FFF8EC 1px, transparent 1px), linear-gradient(to bottom, #FFF8EC 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </section>
  );
};
