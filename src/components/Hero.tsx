import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SlotImage } from './SlotImage';
import { HOME_IMAGES } from '../lib/home-images';

interface HeroProps {
  onStartBuilding?: () => void;
  onExploreBridge?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBuilding, onExploreBridge }) => {
  return (
    <section id="top" className="pt-8 pb-16 lg:pt-16 lg:pb-24 px-4 md:px-8 max-w-[1200px] mx-auto min-h-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column (Columns 1-6): Text & Need Selector */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Kicker */}
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-blue font-mono mb-4">
            For schools and institutions
          </span>

          {/* H1 */}
          <h1 className="font-heading font-extrabold text-[30px] leading-[34px] lg:text-[44px] lg:leading-[48px] text-ink mb-6 [text-wrap:balance]">
            Teach students to think like engineers, not just use technology.
          </h1>

          {/* Subtitle */}
          <p className="text-[18px] leading-[28px] text-ink-soft max-w-[520px] font-body mb-8">
            Structured coding and robotics for K-12 schools: software, teacher training, workshops and mentorship in one connected programme.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
            <a
              href="#schools"
              onClick={(e) => {
                if (onStartBuilding) {
                  e.preventDefault();
                  onStartBuilding();
                }
              }}
              className="h-10 px-6 rounded-full bg-blue text-white font-heading font-bold text-sm inline-flex items-center justify-center border-ink-2 shadow-hard hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-hard-active transition-all"
            >
              Book a pilot session
            </a>

            <a
              href="#what-happens-at-rig"
              onClick={(e) => {
                if (onExploreBridge) {
                  e.preventDefault();
                  onExploreBridge();
                }
              }}
              className="h-10 px-6 rounded-full bg-paper border-ink-2 text-ink font-heading font-bold text-sm inline-flex items-center justify-center shadow-hard hover:bg-paper-2 hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              Explore workshops & events
            </a>
          </div>

          {/* Need Selector */}
          <div className="w-full">
            <p className="text-[13px] text-ink-soft font-body mb-3">
              Where is your school today?
            </p>

            {/* 3 Link-chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
              {/* Chip 1 */}
              <a
                href="#algorithmic-foundations"
                className="min-h-[64px] p-[12px_16px] border border-ink/20 rounded-lg bg-paper flex flex-col justify-between group transition-colors duration-150 hover:border-blue focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
              >
                <span className="text-[12px] text-ink-soft font-mono">Level 1</span>
                <span className="text-[14px] font-semibold text-ink flex items-center justify-between mt-1">
                  <span>No coding yet</span>
                  <ArrowRight className="w-4 h-4 text-ink-soft group-hover:text-blue group-hover:translate-x-0.5 group-focus:translate-x-0.5 transition-transform duration-150 motion-reduce:transform-none shrink-0 ml-1.5" />
                </span>
              </a>

              {/* Chip 2 */}
              <a
                href="#applied-syntax-bridge"
                className="min-h-[64px] p-[12px_16px] border border-ink/20 rounded-lg bg-paper flex flex-col justify-between group transition-colors duration-150 hover:border-blue focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
              >
                <span className="text-[12px] text-ink-soft font-mono">Level 2</span>
                <span className="text-[14px] font-semibold text-ink flex items-center justify-between mt-1">
                  <span>Coding, no robotics</span>
                  <ArrowRight className="w-4 h-4 text-ink-soft group-hover:text-blue group-hover:translate-x-0.5 group-focus:translate-x-0.5 transition-transform duration-150 motion-reduce:transform-none shrink-0 ml-1.5" />
                </span>
              </a>

              {/* Chip 3 */}
              <a
                href="#autonomous-engineering"
                className="min-h-[64px] p-[12px_16px] border border-ink/20 rounded-lg bg-paper flex flex-col justify-between group transition-colors duration-150 hover:border-blue focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
              >
                <span className="text-[12px] text-ink-soft font-mono">Level 3</span>
                <span className="text-[14px] font-semibold text-ink flex items-center justify-between mt-1">
                  <span>Coding and robotics</span>
                  <ArrowRight className="w-4 h-4 text-ink-soft group-hover:text-blue group-hover:translate-x-0.5 group-focus:translate-x-0.5 transition-transform duration-150 motion-reduce:transform-none shrink-0 ml-1.5" />
                </span>
              </a>
            </div>

            {/* Muted line under chips */}
            <p className="mt-3 text-[13px] text-ink-soft font-body">
              No school is behind. Every track is a starting point.
            </p>
          </div>
        </div>

        {/* Right Column (Columns 7-12): Image Collage */}
        <div className="lg:col-span-6 w-full">
          {/* Desktop collage layout (sm and up) */}
          <div className="hidden sm:grid grid-cols-[1.4fr_1fr] gap-4 h-[480px]">
            {/* Left tall image: Workshops (480px high, spans 2 rows) */}
            <a
              href="#card-workshops"
              aria-label="View workshops card"
              className="relative h-[480px] rounded-[6px] overflow-hidden group border border-ink/15 block"
            >
              <SlotImage slot={HOME_IMAGES.heroMain} priority={true} />
              <span className="absolute bottom-3 left-3 text-[12px] font-semibold uppercase tracking-[0.08em] font-mono bg-paper/92 text-ink backdrop-blur-sm px-2.5 py-1 rounded-full border border-ink/15 shadow-sm">
                Workshops
              </span>
            </a>

            {/* Right stacked images: Events & Student projects */}
            <div className="flex flex-col gap-4 h-[480px] justify-between">
              {/* Top: Events (1:1) */}
              <a
                href="#card-events"
                aria-label="View events card"
                className="relative h-[232px] w-[232px] max-w-full rounded-[6px] overflow-hidden group border border-ink/15 block"
              >
                <SlotImage slot={HOME_IMAGES.heroEvents} />
                <span className="absolute bottom-3 left-3 text-[12px] font-semibold uppercase tracking-[0.08em] font-mono bg-paper/92 text-ink backdrop-blur-sm px-2.5 py-1 rounded-full border border-ink/15 shadow-sm">
                  Events
                </span>
              </a>

              {/* Bottom: Student projects (1:1) */}
              <a
                href="#card-projects"
                aria-label="View student projects card"
                className="relative h-[232px] w-[232px] max-w-full rounded-[6px] overflow-hidden group border border-ink/15 block"
              >
                <SlotImage slot={HOME_IMAGES.heroProjects} />
                <span className="absolute bottom-3 left-3 text-[12px] font-semibold uppercase tracking-[0.08em] font-mono bg-paper/92 text-ink backdrop-blur-sm px-2.5 py-1 rounded-full border border-ink/15 shadow-sm">
                  Student projects
                </span>
              </a>
            </div>
          </div>

          {/* Mobile collage layout (<sm): First 4:3 full width, then 2 side-by-side 1:1 with 12px gap */}
          <div className="sm:hidden flex flex-col gap-3 w-full">
            {/* Top 4:3 full-width image: Workshops */}
            <a
              href="#card-workshops"
              aria-label="View workshops card"
              className="relative aspect-[4/3] w-full rounded-[6px] overflow-hidden group border border-ink/15 block"
            >
              <SlotImage slot={HOME_IMAGES.heroMain} priority={true} />
              <span className="absolute bottom-3 left-3 text-[12px] font-semibold uppercase tracking-[0.08em] font-mono bg-paper/92 text-ink backdrop-blur-sm px-2.5 py-1 rounded-full border border-ink/15 shadow-sm">
                Workshops
              </span>
            </a>

            {/* Bottom 2 side-by-side 1:1 images */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Left 1:1: Events */}
              <a
                href="#card-events"
                aria-label="View events card"
                className="relative aspect-square w-full rounded-[6px] overflow-hidden group border border-ink/15 block"
              >
                <SlotImage slot={HOME_IMAGES.heroEvents} />
                <span className="absolute bottom-2.5 left-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] font-mono bg-paper/92 text-ink backdrop-blur-sm px-2 py-0.5 rounded-full border border-ink/15 shadow-sm">
                  Events
                </span>
              </a>

              {/* Right 1:1: Student projects */}
              <a
                href="#card-projects"
                aria-label="View student projects card"
                className="relative aspect-square w-full rounded-[6px] overflow-hidden group border border-ink/15 block"
              >
                <SlotImage slot={HOME_IMAGES.heroProjects} />
                <span className="absolute bottom-2.5 left-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] font-mono bg-paper/92 text-ink backdrop-blur-sm px-2 py-0.5 rounded-full border border-ink/15 shadow-sm">
                  Student projects
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
