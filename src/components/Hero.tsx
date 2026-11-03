import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  Zap,
  Settings,
  Code,
  Terminal,
  Check,
  AlertTriangle,
  TrendingDown,
  Unlink,
  Frown,
  Bot,
  ArrowLeftRight,
  ShieldCheck,
  Wrench,
  ArrowRight,
  CornerDownRight,
} from 'lucide-react';

interface HeroProps {
  onStartBuilding: () => void;
  onExploreBridge: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBuilding, onExploreBridge }) => {
  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [typedCode, setTypedCode] = useState('');
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [chartInView, setChartInView] = useState(false);
  const chartRef = useRef<HTMLDivElement | null>(null);

  // Pair 1 mini-visual: Robot driving 5x3 grid
  const [pair1Time, setPair1Time] = useState(0);

  // Pair 2 mini-visual: Typing snippet
  const [pair2Typed, setPair2Typed] = useState('');

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
          setTimeout(() => setEasterEggActive(false), 4500);
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Intersection observer for chart animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChartInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  // Mini-visual timers
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Pair 1 4s loop
    const p1Interval = setInterval(() => {
      setPair1Time((t) => (t + 1) % 4);
    }, 1000);

    // Pair 2 5s typing loop
    const fullSnippet = 'for i in range(4):';
    let charIdx = 0;
    const p2Interval = setInterval(() => {
      charIdx = (charIdx + 1) % (fullSnippet.length + 8);
      if (charIdx <= fullSnippet.length) {
        setPair2Typed(fullSnippet.slice(0, charIdx));
      }
    }, 140);

    return () => {
      clearInterval(p1Interval);
      clearInterval(p2Interval);
    };
  }, []);

  // Live 8-second looping mini-demo canvas
  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fullCodeSnippet = 'for i in range(4):\n    bot.forward(2)\n    bot.turn_right()\nbot.pick_up()';

    const drawFrame = (now: number) => {
      const elapsed = (now - startTime) % 8000;
      const progress = prefersReducedMotion ? 0.6 : elapsed / 8000;

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
        ctx.rotate((elapsed / 180) * Math.PI * 2);
      }

      ctx.fillStyle = '#FF6B2C';
      ctx.strokeStyle = '#14110F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-12, -10, 24, 20, 4);
      } else {
        ctx.rect(-12, -10, 24, 20);
      }
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

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="top" className="relative pt-10 md:pt-12 pb-16 px-4 md:px-8 max-w-[1240px] mx-auto min-h-[calc(100vh-72px)] flex flex-col justify-between overflow-x-clip">
      {/* ========================================================
          ROW A: HEADER BLOCK (centered, max-width 980px, gap 16px)
         ======================================================== */}
      <div className="max-w-[980px] mx-auto text-center flex flex-col items-center gap-4">
        {/* Yellow Sticker */}
        <div className="inline-block px-3.5 py-1 bg-yellow border-ink-2 shadow-hard-sm font-mono text-[13px] font-bold text-ink rounded-md uppercase transform -rotate-3 hover:rotate-0 transition-transform">
          Real talk about coding class
        </div>

        {/* H1 Headline */}
        <h1 className="font-heading font-extrabold text-ink leading-[1.02] tracking-[-0.02em] text-center text-4xl sm:text-6xl md:text-7xl">
          Coding class loses you by week two.{' '}
          <span className="marker-yellow">We fixed that.</span>
        </h1>

        {/* Sub-paragraph */}
        <p className="font-body text-ink-soft text-[17px] md:text-[20px] leading-[1.55] max-w-[60ch] text-center">
          You were curious. Then the tool got boring, the blocks stopped making sense, and nobody explained why Python feels like a different planet. Here's what goes wrong, and how EFACT Studio fixes each part.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto mt-2">
          <button
            onClick={() => scrollToSection('#playground')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-blue text-white font-heading font-extrabold text-base md:text-lg btn-brutal flex items-center justify-center gap-2"
          >
            <span>Start Building (free)</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>

          <button
            onClick={() => scrollToSection('#how-it-works')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-ink font-body font-bold text-base btn-brutal hover:bg-paper-2"
          >
            See how blocks become Python
          </button>
        </div>

        {/* Proof Chips under CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[13px] text-ink-soft font-semibold pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-white border-ink-2 shadow-hard-sm">
            <Check className="w-3.5 h-3.5 text-lime stroke-[3]" />
            <span>Blocks -&gt; Python</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-white border-ink-2 shadow-hard-sm">
            <Check className="w-3.5 h-3.5 text-lime stroke-[3]" />
            <span>Runs in your browser</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-white border-ink-2 shadow-hard-sm">
            <Check className="w-3.5 h-3.5 text-lime stroke-[3]" />
            <span>No sign-up</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          ROW B: THE PROBLEM -> SOLUTION BOARD
         ======================================================== */}
      <div className="mt-12">
        <h2 className="sr-only">Problems and fixes</h2>

        {/* Desktop Column Headers (>= 1100px) */}
        <div className="hidden lg:grid grid-cols-[1fr_96px_1.15fr] items-center mb-4 px-2">
          <div className="flex items-center">
            <div className="h-10 px-3.5 py-1.5 rounded-[8px] bg-[#E7E1D6] border-[2.5px] border-dashed border-ink font-mono text-[13px] font-semibold tracking-[0.12em] flex items-center gap-2 text-ink">
              <AlertTriangle className="w-4 h-4 text-[#C93B2B]" />
              <span>THE GLITCH</span>
            </div>
          </div>
          <div aria-hidden="true" />
          <div className="flex items-center">
            <div className="h-10 px-3.5 py-1.5 rounded-[8px] bg-lime border-[2.5px] border-solid border-ink font-mono text-[13px] font-semibold tracking-[0.12em] shadow-hard-sm flex items-center gap-2 text-ink">
              <Zap className="w-4 h-4 text-ink fill-ink" />
              <span>THE FIX</span>
            </div>
          </div>
        </div>

        <ul role="list" aria-label="Problems and how EFACT Studio fixes them" className="space-y-6 md:space-y-6">
          {/* PAIR 1 */}
          <li className="grid grid-cols-1 lg:grid-cols-[1fr_96px_1.15fr] items-center gap-4 lg:gap-0">
            {/* Problem Card 1 */}
            <div className="relative bg-glitch border-[2.5px] border-dashed border-ink rounded-[14px] p-5 md:p-6 min-h-[132px] transform lg:rotate-[-0.8deg] hover:rotate-0 transition-transform flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-8 h-8 flex items-center justify-center text-glitch-ink">
                  <TrendingDown className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-ink/40 font-mono text-[11px] font-bold text-glitch-ink uppercase bg-white/40">
                  <span className="lg:hidden text-ink font-extrabold mr-1">THE GLITCH:</span>
                  <TrendingDown className="w-3 h-3" />
                  <span>INTEREST DROPS</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-[20px] text-ink leading-snug mb-1 glitch-text">
                  You try it a few times. Then it's dead.
                </h3>
                <p className="font-body text-[16px] text-ink-soft leading-[1.55]">
                  Same tiny exercises, nothing real at the end. Your curiosity runs out before anything actually works.
                </p>
              </div>
              {/* Tablet indicator */}
              <div className="hidden md:flex lg:hidden justify-end mt-2 text-ink-soft">
                <CornerDownRight className="w-5 h-5 text-blue" />
              </div>
            </div>

            {/* Bridge 1 (Desktop) */}
            <div className="hidden lg:flex items-center justify-center relative" aria-hidden="true">
              <svg className="w-full h-8" viewBox="0 0 96 32" fill="none">
                <line x1="0" y1="16" x2="96" y2="16" stroke="#14110F" strokeWidth="2.5" strokeDasharray="6 6" />
              </svg>
              <div className="absolute w-10 h-10 rounded-full bg-lime border-[2.5px] border-ink flex items-center justify-center shadow-hard-sm">
                <BoltIcon className="w-4 h-4 text-ink" />
              </div>
            </div>

            {/* Mobile Connecting Arrow (<640px) */}
            <div className="flex lg:hidden justify-center items-center py-1" aria-hidden="true">
              <div className="w-8 h-8 rounded-full bg-lime border-[2.5px] border-ink flex items-center justify-center shadow-hard-sm">
                <ArrowDown className="w-4 h-4 text-ink" />
              </div>
            </div>

            {/* Solution Card 1 */}
            <div className="relative bg-white border-[2.5px] border-solid border-ink rounded-[14px] p-5 md:p-6 min-h-[132px] shadow-hard hover:shadow-hard-hover hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden">
              {/* Left Stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-[10px] bg-blue" aria-hidden="true" />

              <div className="pl-3 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-heading font-bold text-[22px] text-ink">
                    A robot that actually moves.
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime border border-ink font-mono text-[11px] font-bold text-ink uppercase shadow-hard-sm shrink-0">
                    <span className="lg:hidden font-extrabold mr-1">THE FIX:</span>
                    <Bot className="w-3 h-3" />
                    <span>REAL ROBOT</span>
                  </div>
                </div>
                <p className="font-body text-[16px] text-ink leading-[1.55]">
                  Every mission ends with a result you can see and re-run in seconds. Fail, tweak, try again. That's the whole loop.
                </p>
              </div>

              {/* Mini-visual 1: Tiny 5x3 Grid SVG */}
              <div className="w-full md:w-[130px] h-[84px] bg-paper-2 rounded-lg border border-ink/30 p-1 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 60" className="w-full h-full">
                  {/* 5x3 tiles */}
                  {[0, 1, 2].map((r) =>
                    [0, 1, 2, 3, 4].map((c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={c * 20}
                        y={r * 20}
                        width="19"
                        height="19"
                        fill={c === 4 && r === 1 ? '#B6F23A' : '#FFF8EC'}
                        stroke="#14110F"
                        strokeWidth="1"
                      />
                    ))
                  )}
                  {/* Goal Star */}
                  <circle cx="89.5" cy="29.5" r="4" fill="#14110F" />
                  {/* Driving Robot */}
                  <g transform={`translate(${Math.min(pair1Time * 20 + 10, 89.5)}, 29.5)`}>
                    <rect x="-7" y="-6" width="14" height="12" rx="2" fill="#FF6B2C" stroke="#14110F" strokeWidth="1.5" />
                    <circle cx="2" cy="0" r="2.5" fill="#FFFFFF" />
                    <circle cx="3" cy="0" r="1" fill="#14110F" />
                  </g>
                </svg>
              </div>
            </div>
          </li>

          {/* PAIR 2 */}
          <li className="grid grid-cols-1 lg:grid-cols-[1fr_96px_1.15fr] items-center gap-4 lg:gap-0">
            {/* Problem Card 2 */}
            <div className="relative bg-glitch border-[2.5px] border-dashed border-ink rounded-[14px] p-5 md:p-6 min-h-[132px] transform lg:rotate-[0.6deg] hover:rotate-0 transition-transform flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-8 h-8 flex items-center justify-center text-glitch-ink">
                  <Unlink className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-ink/40 font-mono text-[11px] font-bold text-glitch-ink uppercase bg-white/40">
                  <span className="lg:hidden text-ink font-extrabold mr-1">THE GLITCH:</span>
                  <Unlink className="w-3 h-3" />
                  <span>DISCONNECTED</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-[20px] text-ink leading-snug mb-1 glitch-text">
                  Blocks over here. Python over there.
                </h3>
                <p className="font-body text-[16px] text-ink-soft leading-[1.55]">
                  Scratch-style tools are fun, but when real code shows up it feels like a brand-new subject with nothing in common.
                </p>
              </div>
              {/* Tablet indicator */}
              <div className="hidden md:flex lg:hidden justify-end mt-2 text-ink-soft">
                <CornerDownRight className="w-5 h-5 text-violet" />
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

            {/* Mobile Connecting Arrow (<640px) */}
            <div className="flex lg:hidden justify-center items-center py-1" aria-hidden="true">
              <div className="w-8 h-8 rounded-full bg-lime border-[2.5px] border-ink flex items-center justify-center shadow-hard-sm">
                <ArrowDown className="w-4 h-4 text-ink" />
              </div>
            </div>

            {/* Solution Card 2 */}
            <div className="relative bg-white border-[2.5px] border-solid border-ink rounded-[14px] p-5 md:p-6 min-h-[132px] shadow-hard hover:shadow-hard-hover hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden">
              {/* Left Stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-[10px] bg-violet" aria-hidden="true" />

              <div className="pl-3 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-heading font-bold text-[22px] text-ink">
                    Every block shows its Python twin.
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow border border-ink font-mono text-[11px] font-bold text-ink uppercase shadow-hard-sm shrink-0">
                    <span className="lg:hidden font-extrabold mr-1">THE FIX:</span>
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>BLOCKS &lt;-&gt; PYTHON</span>
                  </div>
                </div>
                <p className="font-body text-[16px] text-ink leading-[1.55]">
                  Snap blocks and watch real Python write itself next to them. Switch to typing it yourself when you're ready.
                </p>
              </div>

              {/* Mini-visual 2: Block to Python sync preview */}
              <div className="w-full md:w-[150px] h-[84px] bg-[#1B1A2E] rounded-lg border border-ink/30 p-2 flex flex-col justify-center text-xs font-mono shrink-0">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-blue text-white font-bold">repeat 4</span>
                  <span className="text-yellow">→</span>
                </div>
                <div className="text-[#D8CEFF] text-[11px] leading-tight">
                  <span className="text-yellow">for</span> i <span className="text-yellow">in</span>:
                  <div className="text-lime">{pair2Typed}<span className="inline-block w-1.5 h-3 bg-lime ml-0.5 align-middle animate-pulse" /></div>
                </div>
              </div>
            </div>
          </li>

          {/* PAIR 3 */}
          <li className="grid grid-cols-1 lg:grid-cols-[1fr_96px_1.15fr] items-center gap-4 lg:gap-0">
            {/* Problem Card 3 */}
            <div className="relative bg-glitch border-[2.5px] border-dashed border-ink rounded-[14px] p-5 md:p-6 min-h-[132px] transform lg:rotate-[-0.5deg] hover:rotate-0 transition-transform flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-8 h-8 flex items-center justify-center text-glitch-ink">
                  <Frown className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-ink/40 font-mono text-[11px] font-bold text-glitch-ink uppercase bg-white/40">
                  <span className="lg:hidden text-ink font-extrabold mr-1">THE GLITCH:</span>
                  <Frown className="w-3 h-3" />
                  <span>PATRONIZING</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-[20px] text-ink leading-snug mb-1 glitch-text">
                  Treated like a little kid.
                </h3>
                <p className="font-body text-[16px] text-ink-soft leading-[1.55]">
                  Cartoon mascots, fake praise, points for nothing. You can tell when you're being managed.
                </p>
              </div>
              {/* Tablet indicator */}
              <div className="hidden md:flex lg:hidden justify-end mt-2 text-ink-soft">
                <CornerDownRight className="w-5 h-5 text-orange" />
              </div>
            </div>

            {/* Bridge 3 (Desktop) */}
            <div className="hidden lg:flex items-center justify-center relative" aria-hidden="true">
              <svg className="w-full h-8" viewBox="0 0 96 32" fill="none">
                <line x1="0" y1="16" x2="96" y2="16" stroke="#14110F" strokeWidth="2.5" strokeDasharray="6 6" />
              </svg>
              <div className="absolute w-10 h-10 rounded-full bg-lime border-[2.5px] border-ink flex items-center justify-center shadow-hard-sm">
                <BoltIcon className="w-4 h-4 text-ink" />
              </div>
            </div>

            {/* Mobile Connecting Arrow (<640px) */}
            <div className="flex lg:hidden justify-center items-center py-1" aria-hidden="true">
              <div className="w-8 h-8 rounded-full bg-lime border-[2.5px] border-ink flex items-center justify-center shadow-hard-sm">
                <ArrowDown className="w-4 h-4 text-ink" />
              </div>
            </div>

            {/* Solution Card 3 */}
            <div className="relative bg-white border-[2.5px] border-solid border-ink rounded-[14px] p-5 md:p-6 min-h-[132px] shadow-hard hover:shadow-hard-hover hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden">
              {/* Left Stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-[10px] bg-orange" aria-hidden="true" />

              <div className="pl-3 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-heading font-bold text-[22px] text-ink">
                    Real challenges. Honest feedback.
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime border border-ink font-mono text-[11px] font-bold text-ink uppercase shadow-hard-sm shrink-0">
                    <span className="lg:hidden font-extrabold mr-1">THE FIX:</span>
                    <ShieldCheck className="w-3 h-3" />
                    <span>RESPECT</span>
                  </div>
                </div>
                <p className="font-body text-[16px] text-ink leading-[1.55]">
                  Clean stats, par scores, and error messages that explain what went wrong. No confetti. Ever.
                </p>
              </div>

              {/* Mini-visual 3: Console Chip */}
              <div className="w-full md:w-[160px] h-[84px] bg-[#11101E] rounded-lg border border-ink/30 p-2.5 flex flex-col justify-center font-mono shrink-0">
                <div className="text-[10px] text-[#7A75A0] mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime inline-block" />
                  <span>PAR VERIFIED</span>
                </div>
                <div className="text-lime text-[11px] font-bold leading-tight">
                  Mission clear: 7 blocks, 12 steps.
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* ========================================================
          ROW C: TEACHER STRIP
         ======================================================== */}
      <div className="w-full bg-paper-2 border-[2.5px] border-dashed border-ink rounded-[14px] p-4 md:px-6 my-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="font-body font-medium text-[16px] text-ink flex-1">
          Teachers feel it too: you want to teach coding, but the tools don't hold students past week two. EFACT Studio drops into your existing curriculum.
        </p>
        <button
          onClick={() => scrollToSection('#schools')}
          className="font-body font-semibold text-[16px] text-blue hover:text-ink flex items-center gap-1 group whitespace-nowrap"
        >
          <span>See for schools</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* ========================================================
          ROW D: LIVE DEMO + INTEREST CHART (margin-top 48px)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        {/* Left Column: 8-Second Demo Card (60% on desktop) */}
        <div className="lg:col-span-7 relative flex flex-col justify-between">
          {/* Sticker Label Top-Left */}
          <div className="inline-block self-start px-3 py-1 bg-lime border-ink-2 shadow-hard-sm font-mono text-xs font-bold text-ink rounded-md mb-2 transform -rotate-2">
            ⚡ See the fix in 8 seconds
          </div>

          {/* Floating Sticker 1: Gear */}
          <div className="absolute -top-3 -right-2 z-20 px-2.5 py-1 bg-yellow border-ink-2 shadow-hard-sm font-mono text-[11px] font-bold rounded-full rotate-6 animate-bobbing hidden sm:flex items-center gap-1" aria-hidden="true">
            <Settings className="w-3 h-3" />
            <span>Motor 240 RPM</span>
          </div>

          {/* Floating Sticker 2: Python */}
          <div className="absolute -bottom-3 -left-2 z-20 px-2.5 py-1 bg-violet text-white border-ink-2 shadow-hard-sm font-mono text-[11px] font-bold rounded-full -rotate-6 animate-bobbing hidden sm:flex items-center gap-1" aria-hidden="true">
            <Code className="w-3 h-3" />
            <span>Python 3.12</span>
          </div>

          {/* Floating Sticker 3: while True */}
          <div className="absolute -top-3 left-48 z-20 px-2.5 py-1 bg-pink text-ink border-ink-2 shadow-hard-sm font-mono text-[11px] font-bold rounded-lg rotate-12 animate-bobbing hidden sm:flex items-center gap-1" aria-hidden="true">
            <Terminal className="w-3 h-3" />
            <span>while True:</span>
          </div>

          {/* Window Container Card */}
          <div className="w-full bg-paper border-ink-2 rounded-2xl shadow-hard-lg overflow-hidden flex flex-col h-[280px]">
            {/* Fake Window Bar */}
            <div className="h-8 bg-[#1E1D33] px-3 flex items-center justify-between border-b-ink-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-danger border border-ink" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow border border-ink" />
                <span className="w-2.5 h-2.5 rounded-full bg-lime border border-ink" />
              </div>
              <span className="font-mono text-[11px] text-[#A09BBF]">sim_preview.py</span>
              <div className="w-6" />
            </div>

            {/* Split Arena & Python */}
            <div className="grid grid-cols-1 sm:grid-cols-2 h-full overflow-hidden">
              {/* Left Canvas Arena */}
              <div className="bg-paper p-2 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-ink/20">
                <span className="sr-only">Animation: a robot drives to a star while the matching Python code appears.</span>
                <canvas
                  ref={miniCanvasRef}
                  style={{ width: '100%', maxWidth: '280px', height: '180px' }}
                  className="rounded-lg border border-ink/30"
                />
              </div>

              {/* Right Dark Panel */}
              <div className="bg-[#141324] p-3 text-xs font-mono text-[#D8CEFF] flex items-center overflow-auto dark-scrollbar">
                <pre className="leading-relaxed">
                  <code>
                    {typedCode}
                    <span className="inline-block w-2 h-3.5 bg-lime ml-0.5 animate-pulse align-middle" />
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interest Chart Card (40% on desktop) */}
        <div ref={chartRef} className="lg:col-span-5 bg-white border-ink-2 rounded-2xl p-6 shadow-hard flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-extrabold text-xl text-ink">
                How interest feels
              </h3>
              <span className="font-mono text-[11px] text-ink-soft">Week 1 - 6</span>
            </div>

            {/* Inline SVG Line Chart */}
            <div className="w-full h-[150px] relative">
              <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible" aria-describedby="chart-desc">
                {/* Grid guidelines */}
                <line x1="30" y1="20" x2="290" y2="20" stroke="rgba(20,17,15,0.08)" strokeWidth="1" />
                <line x1="30" y1="55" x2="290" y2="55" stroke="rgba(20,17,15,0.08)" strokeWidth="1" />
                <line x1="30" y1="90" x2="290" y2="90" stroke="rgba(20,17,15,0.08)" strokeWidth="1" />

                {/* Y Axis labels */}
                <text x="5" y="24" fontSize="9" fill="#6B645B" fontFamily="JetBrains Mono">High</text>
                <text x="5" y="94" fontSize="9" fill="#6B645B" fontFamily="JetBrains Mono">Low</text>

                {/* Typical class: Starts high (y=30), sharp drop at week 3 (y=90) */}
                <path
                  d="M 35 25 Q 80 30, 130 85 T 285 95"
                  fill="none"
                  stroke="#6B645B"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  style={{
                    strokeDashoffset: chartInView ? 0 : 300,
                    transition: 'stroke-dashoffset 800ms ease-out',
                  }}
                />

                {/* EFACT Studio: Starts steady (y=50), rises gradually (y=18) */}
                <path
                  d="M 35 50 Q 120 45, 180 32 T 285 18"
                  fill="none"
                  stroke="#FF6B2C"
                  strokeWidth="3.5"
                  style={{
                    strokeDashoffset: chartInView ? 0 : 300,
                    transition: 'stroke-dashoffset 800ms ease-out',
                  }}
                />

                {/* End points */}
                <circle cx="285" cy="95" r="4" fill="#6B645B" />
                <circle cx="285" cy="18" r="4.5" fill="#FF6B2C" stroke="#14110F" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-medium mt-2 pt-2 border-t border-ink/10">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-[#6B645B]" />
                <span className="text-[#6B645B]">Typical class</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-orange rounded-full" />
                <span className="text-ink font-bold">With EFACT Studio</span>
              </div>
            </div>
          </div>

          {/* Accessible Description */}
          <p id="chart-desc" className="sr-only">
            Line chart comparing student interest over 6 weeks: in a typical coding class, interest drops sharply after week 2; with EFACT Studio, student interest stays steady and rises through week 6.
          </p>

          <p className="font-mono text-[12px] text-ink-soft mt-3">
            Illustrative, not measured data.
          </p>
        </div>
      </div>

      {/* Easter egg notice if activated */}
      {easterEggActive && (
        <div className="mt-2 mb-4 p-2 bg-lime border-ink-2 rounded-lg font-mono text-xs font-bold text-center text-ink shadow-hard-sm">
          🎉 Konami Code Activated: Robot Turbo Spin! "You found it. Respect."
        </div>
      )}

      {/* ========================================================
          MARQUEE STRIP: Under Hero, Full Width (Unchanged)
         ======================================================== */}
      <div className="w-full mt-10 -mx-4 md:-mx-8 overflow-hidden bg-ink text-paper py-3 border-y-ink-2 select-none">
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

// Small helper icon for the bridge node
const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
  </svg>
);
