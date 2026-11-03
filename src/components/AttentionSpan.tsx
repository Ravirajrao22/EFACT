import React from 'react';

export const AttentionSpan: React.FC = () => {
  return (
    <section className="bg-ink text-paper py-20 md:py-28 px-6 md:px-12 border-y-ink-2 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto flex flex-col items-start relative z-10">
        {/* Pink Sticker */}
        <div className="inline-block px-4 py-1.5 bg-pink text-ink border-2 border-white shadow-[4px_4px_0_#FFFFFF] font-mono text-xs sm:text-sm font-extrabold rounded-md mb-8 transform rotate-3 hover:-rotate-1 transition-transform">
          ✦ Respect included.
        </div>

        {/* Huge Bold Headline */}
        <blockquote className="font-heading font-extrabold leading-[1.08] tracking-tight mb-8 text-3xl sm:text-5xl md:text-6xl text-paper">
          You don't have a short attention span.
          <br className="hidden sm:inline" />
          <span className="block mt-2">
            You have a{' '}
            <span className="relative inline-block text-ink px-2 bg-lime border-2 border-ink rounded-md transform -rotate-1">
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

