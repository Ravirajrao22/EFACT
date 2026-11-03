import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Zap, Settings, Code, Terminal, Check } from 'lucide-react';

interface HeroProps {
  onStartBuilding: () => void;
  onExploreBridge: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBuilding, onExploreBridge }) => {
  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [typedCode, setTypedCode] = useState('');
  const [easterEggActive, setEasterEggActive] = useState(false);

  // Konami Code listener
  useEffect(() => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === konamiSequence[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          setEasterEggActive(true);
          console.log('%c You found it. Respect. ', 'background: #B6F23A; color: #14110F; font-size: 16px; font-weight: bold; border: 2px solid #14110F;');
          konamiIndex = 0;
          setTimeout(() => setEasterEggActive(false), 4000);
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Mini canvas auto-playing simulation (8-second loop)
  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fullCodeSnippet = "for i in range(4):\n    bot.forward(2)\n    bot.turn_right()\nbot.pick_up()";

    const drawFrame = (now: number) => {
      const elapsed = (now - startTime) % 8000;
      const progress = prefersReducedMotion ? 0.5 : elapsed / 8000;

      // Typing animation for snippet
      const charIndex = Math.min(
        fullCodeSnippet.length,
        Math.floor((elapsed / 4500) * fullCodeSnippet.length)
      );
      setTypedCode(fullCodeSnippet.substring(0, charIndex));

      // Canvas dimensions
      const dpr = window.devicePixelRatio || 1;
      const size = 320;
      if (canvas.width !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = 200 * dpr;
      }
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Background
      ctx.fillStyle = '#FFF8EC';
      ctx.fillRect(0, 0, size, 200);

      // Mini Grid
      const tileSize = 32;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 10; c++) {
          ctx.strokeStyle = 'rgba(20, 17, 15, 0.08)';
          ctx.lineWidth = 1;
          ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
        }
      }

      // Star item at (7, 2)
      const starCollected = progress > 0.75;
      if (!starCollected) {
        const sx = 7 * tileSize + 16;
        const sy = 2 * tileSize + 16;
        ctx.fillStyle = '#FFD23F';
        ctx.strokeStyle = '#14110F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(sx + Math.cos(((18 + i * 72) * Math.PI) / 180) * 10, sy - Math.sin(((18 + i * 72) * Math.PI) / 180) * 10);
          ctx.lineTo(sx + Math.cos(((54 + i * 72) * Math.PI) / 180) * 4, sy - Math.sin(((54 + i * 72) * Math.PI) / 180) * 4);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Target Goal at (8, 2)
      ctx.fillStyle = '#B6F23A';
      ctx.fillRect(8 * tileSize + 2, 2 * tileSize + 2, tileSize - 4, tileSize - 4);
      ctx.strokeStyle = '#14110F';
      ctx.lineWidth = 2;
      ctx.strokeRect(8 * tileSize + 2, 2 * tileSize + 2, tileSize - 4, tileSize - 4);

      // Robot animation path: (2, 2) -> (7, 2) -> (8, 2)
      const botStartX = 2 * tileSize + 16;
      const botEndX = 8 * tileSize + 16;
      const curBotX = botStartX + Math.min(progress / 0.8, 1) * (botEndX - botStartX);
      const curBotY = 2 * tileSize + 16;

      // Faint breadcrumbs
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = 'rgba(47, 91, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(botStartX, curBotY);
      ctx.lineTo(curBotX, curBotY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Robot Body
      ctx.save();
      ctx.translate(curBotX, curBotY);
      if (easterEggActive) {
        ctx.rotate((elapsed / 200) * Math.PI * 2);
      }

      ctx.fillStyle = '#FF6B2C';
      ctx.strokeStyle = '#14110F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-12, -10, 24, 20, 4);
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(5, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#14110F';
      ctx.beginPath();
      ctx.arc(6, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(drawFrame);
      }
    };

    animId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animId);
  }, [easterEggActive]);

  return (
    <section className="relative pt-12 md:pt-20 pb-16 px-4 md:px-8 max-w-[1240px] mx-auto min-h-[84vh] flex flex-col justify-between">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline and Pitch (55% on desktop) */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          {/* Sticker */}
          <div className="inline-block px-3 py-1 bg-yellow border-ink-2 shadow-hard-sm font-mono text-xs font-bold text-ink rounded-md mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
            ⚡ No cartoons. Real code.
          </div>

          {/* H1 Headline */}
          <h1 className="font-heading font-extrabold text-ink leading-[1.0] tracking-tight mb-6 text-4xl sm:text-6xl md:text-7xl">
            Don't just use tech.{' '}
            <span className="marker-lime">Build</span> it.
          </h1>

          {/* Subparagraph */}
          <p className="font-body text-ink-soft text-lg sm:text-xl max-w-[52ch] leading-relaxed mb-8">
            Program a virtual robot with blocks, watch the real Python appear next to it, and then write the code yourself. No baby stuff. No dead ends.
          </p>

          {/* CTA Buttons Row */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={onStartBuilding}
              className="px-7 py-3.5 rounded-full bg-blue text-white font-heading font-extrabold text-base md:text-lg btn-brutal flex items-center gap-2"
            >
              <span>Start Building (free)</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>

            <button
              onClick={onExploreBridge}
              className="px-6 py-3.5 rounded-full bg-paper text-ink font-body font-bold text-base btn-brutal hover:bg-paper-2"
            >
              See how blocks become Python
            </button>
          </div>

          {/* Three Tiny Proof Chips */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ink-soft font-semibold">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-paper border border-ink/30">
              <Check className="w-3.5 h-3.5 text-lime stroke-[3]" />
              <span>Blocks → Real Python</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-paper border border-ink/30">
              <Check className="w-3.5 h-3.5 text-lime stroke-[3]" />
              <span>Runs in your browser</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-paper border border-ink/30">
              <Check className="w-3.5 h-3.5 text-lime stroke-[3]" />
              <span>No sign-up required</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Looping Mini-Demo Card (45% on desktop) */}
        <div className="lg:col-span-5 relative flex justify-center">
          {/* Floating Sticker 1: Gear */}
          <div className="absolute -top-6 -left-6 z-20 px-3 py-1 bg-yellow border-ink-2 shadow-hard-sm font-mono text-xs font-bold rounded-full rotate-6 animate-bobbing hidden sm:flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Motor 240 RPM</span>
          </div>

          {/* Floating Sticker 2: Python */}
          <div className="absolute -bottom-4 -left-4 z-20 px-3 py-1 bg-violet text-white border-ink-2 shadow-hard-sm font-mono text-xs font-bold rounded-full -rotate-6 animate-bobbing hidden sm:flex items-center gap-1">
            <Code className="w-3.5 h-3.5" />
            <span>Python 3.12</span>
          </div>

          {/* Floating Sticker 3: while True */}
          <div className="absolute -top-4 -right-4 z-20 px-3 py-1 bg-pink text-ink border-ink-2 shadow-hard-sm font-mono text-xs font-bold rounded-lg rotate-12 animate-bobbing hidden sm:flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>while True:</span>
          </div>

          {/* Window Container Card */}
          <div className="w-full max-w-[420px] bg-paper border-ink-2 rounded-2xl shadow-hard-lg overflow-hidden flex flex-col">
            {/* Fake Window Bar */}
            <div className="h-9 bg-[#1E1D33] px-3.5 flex items-center justify-between border-b-ink-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-danger border border-ink"></span>
                <span className="w-3 h-3 rounded-full bg-yellow border border-ink"></span>
                <span className="w-3 h-3 rounded-full bg-lime border border-ink"></span>
              </div>
              <span className="font-mono text-xs text-[#A09BBF]">sim_preview.py</span>
              <div className="w-8"></div>
            </div>

            {/* Canvas Area */}
            <div className="bg-paper p-3 flex justify-center border-b border-ink/20">
              <canvas
                ref={miniCanvasRef}
                style={{ width: '100%', maxWidth: '320px', height: '180px' }}
                className="rounded-lg border border-ink/30"
              />
            </div>

            {/* Live Typing Code Box Beneath */}
            <div className="bg-[#141324] p-3 text-xs font-mono text-[#D8CEFF] min-h-[90px] flex items-center">
              <pre className="leading-snug">
                <code>
                  {typedCode}
                  <span className="inline-block w-2 h-3.5 bg-lime ml-0.5 animate-pulse align-middle" />
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Easter egg notice if activated */}
      {easterEggActive && (
        <div className="mt-4 p-2 bg-lime border-ink-2 rounded-lg font-mono text-xs font-bold text-center text-ink shadow-hard-sm">
          🎉 Konami Code Activated: Robot Turbo Spin! "You found it. Respect."
        </div>
      )}

      {/* Marquee Strip Beneath Hero */}
      <div className="w-full mt-12 -mx-4 md:-mx-8 overflow-hidden bg-ink text-paper py-3 border-y-ink-2 select-none">
        <div className="animate-marquee whitespace-nowrap font-mono text-sm md:text-base font-bold tracking-wider">
          <span className="mx-4">FORWARD ✦ TURN ✦ SENSE ✦ LOOP ✦ DECIDE ✦ DEBUG ✦ SHIP ✦</span>
          <span className="mx-4">FORWARD ✦ TURN ✦ SENSE ✦ LOOP ✦ DECIDE ✦ DEBUG ✦ SHIP ✦</span>
          <span className="mx-4">FORWARD ✦ TURN ✦ SENSE ✦ LOOP ✦ DECIDE ✦ DEBUG ✦ SHIP ✦</span>
          <span className="mx-4">FORWARD ✦ TURN ✦ SENSE ✦ LOOP ✦ DECIDE ✦ DEBUG ✦ SHIP ✦</span>
        </div>
      </div>
    </section>
  );
};

