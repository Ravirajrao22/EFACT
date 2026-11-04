import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Phone,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PhotoSlot } from './PhotoSlot';
import { PHONE_NUMBER } from '../config';

interface HeroProps {
  selectedStage: number | null;
  onSelectStage: (stageIndex: number) => void;
  onNavigateToSchools: (stageIndex?: number) => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedStage,
  onSelectStage,
  onNavigateToSchools,
}) => {
  const stageOptions = [
    {
      index: 1,
      title: 'Just starting',
      subtitle: 'No coding experience yet',
      track: 'The Core Logic',
      icon: <Layers className="w-5 h-5 text-ink shrink-0" />,
      description:
        'We start with computational thinking, logical sequencing and problem-solving before any syntax appears.',
    },
    {
      index: 2,
      title: 'Coding, no robotics',
      subtitle: 'Students code, hardware is limited',
      track: 'The Physical Computing Bridge',
      icon: <Sparkles className="w-5 h-5 text-ink shrink-0" />,
      description:
        'We connect programming with sensors, motors, electronics and real physical systems.',
    },
    {
      index: 3,
      title: 'Coding + robotics',
      subtitle: 'Ready for advanced projects',
      track: 'Autonomous Systems Engineering',
      icon: <Cpu className="w-5 h-5 text-ink shrink-0" />,
      description:
        'We take students into algorithm design, system development and autonomous robotics.',
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectStage(index);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = index < 3 ? index + 1 : 1;
      onSelectStage(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = index > 1 ? index - 1 : 3;
      onSelectStage(prev);
    }
  };

  const activeStageData = stageOptions.find((s) => s.index === selectedStage);

  return (
    <section
      id="top"
      className="min-h-[calc(100vh-72px)] flex flex-col justify-between pt-12 pb-12 lg:pt-16 lg:pb-16 px-4 md:px-8 max-w-[1240px] mx-auto w-full"
    >
      {/* Two-Column Grid: 56% Text / 44% Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center flex-1 my-auto">
        {/* LEFT COLUMN (56% -> 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow with 24px ink line before it */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[2px] bg-ink shrink-0" aria-hidden="true" />
            <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Practical STEM education for K-12 schools
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-heading font-extrabold text-[38px] sm:text-[46px] lg:text-[56px] xl:text-[62px] leading-[1.04] tracking-[-0.02em] text-ink mb-6">
            Equipment doesn't make engineers.{' '}
            <mark className="bg-yellow text-ink px-2 py-0.5 inline-block">
              Thinking does.
            </mark>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-[18px] sm:text-[20px] leading-[1.6] text-ink-soft max-w-[56ch] mb-8">
            A robotics kit teaches students to connect components. But can they understand a problem, write the logic and build a solution on their own? EFACT brings the curriculum, the software, the teacher training and the workshops that make that happen inside your school.
          </p>

          {/* NEED PICKER (Key Curiosity Element) */}
          <div className="w-full bg-paper-2/60 border-ink-2 rounded-[16px] p-5 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-body font-semibold text-[16px] text-ink">
                Where is your school today?
              </label>
              {!selectedStage && (
                <span className="font-mono text-xs text-ink-soft hidden sm:inline">
                  Tap one to see what we'd bring
                </span>
              )}
            </div>

            {/* 3 Selectable Cards */}
            <div
              role="radiogroup"
              aria-label="Where is your school today?"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full"
            >
              {stageOptions.map((stage) => {
                const isSelected = selectedStage === stage.index;
                return (
                  <div
                    key={stage.index}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => onSelectStage(stage.index)}
                    onKeyDown={(e) => handleKeyDown(e, stage.index)}
                    className={`min-h-[96px] p-3.5 rounded-[14px] border-ink-2 cursor-pointer flex flex-col justify-between transition-all select-none ${
                      isSelected
                        ? 'bg-lime text-ink shadow-hard translate-x-[1px] translate-y-[1px]'
                        : 'bg-white text-ink shadow-hard-sm hover:border-blue hover:bg-paper'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <span className="font-mono text-xs font-bold text-ink-soft">
                        0{stage.index}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-ink text-lime flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        stage.icon
                      )}
                    </div>
                    <div>
                      <div className="font-heading font-bold text-[14px] leading-tight text-ink">
                        {stage.title}
                      </div>
                      <div className="font-body text-[12px] text-ink-soft leading-tight mt-0.5">
                        {stage.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Response Panel: Slides in (200ms) when a stage is chosen */}
            {activeStageData ? (
              <div className="mt-4 pt-4 border-t border-ink/15 animate-fadeIn transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue">
                    Recommended Track
                  </span>
                  <a
                    href="#programme"
                    className="font-mono text-xs text-ink-soft hover:text-ink underline inline-flex items-center gap-1"
                  >
                    <span>See the full programme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="font-heading font-bold text-[18px] sm:text-[20px] text-ink mb-1">
                  {activeStageData.track}
                </h3>
                <p className="font-body text-[15px] leading-relaxed text-ink mb-4">
                  {activeStageData.description}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigateToSchools(activeStageData.index)}
                    className="h-10 px-5 rounded-full bg-blue text-white font-heading font-bold text-sm btn-brutal inline-flex items-center gap-1.5 shadow-hard-sm"
                  >
                    <span>Book a demo for this stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="#programme"
                    className="font-body text-sm font-semibold text-ink-soft hover:text-ink px-2 py-1"
                  >
                    View curriculum syllabus →
                  </a>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-ink-soft font-body sm:hidden">
                Tap one stage to see what we'd bring.
              </p>
            )}
          </div>

          {/* Trust line under picker */}
          <div className="flex items-center gap-2 font-mono text-[13px] text-ink-soft mb-3">
            <CheckCircle2 className="w-4 h-4 text-blue shrink-0" />
            <span>
              Validated with students at Lovely Professional University and Delhi Public School, Jalandhar.
            </span>
          </div>

          {/* Secondary CTA row: Phone Link */}
          <div className="pt-1">
            <a
              href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 font-mono text-sm text-ink-soft hover:text-ink transition-colors font-medium"
            >
              <Phone className="w-4 h-4 text-blue" />
              <span>
                Or just talk to us: <strong className="text-ink">{PHONE_NUMBER}</strong>
              </span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Asymmetric Photo Collage (44% -> 5 Cols) */}
        <div className="lg:col-span-5 w-full">
          <div className="grid grid-cols-4 grid-rows-4 gap-4 h-[440px] sm:h-[520px] lg:h-[560px] w-full">
            {/* Slot A: Large (rows 1-3, cols 1-3, 4:3) */}
            <div className="col-span-3 row-span-3 rounded-[14px] border-ink-2 shadow-hard overflow-hidden group">
              <PhotoSlot
                id="hero-a"
                priority={true}
                captionChip="WORKSHOP"
                className="rounded-[12px]"
              />
            </div>

            {/* Slot B: Small (rows 1-2, col 4, 3:4) */}
            <div className="col-span-1 row-span-2 rounded-[14px] border-ink-2 shadow-hard overflow-hidden group">
              <PhotoSlot
                id="hero-b"
                captionChip="STUDENT PROJECT"
                className="rounded-[12px]"
                showCaptionText={false}
              />
            </div>

            {/* Slot C: Small (rows 3-4, col 4, 3:4) */}
            <div className="col-span-1 row-span-2 rounded-[14px] border-ink-2 shadow-hard overflow-hidden group">
              <PhotoSlot
                id="hero-c"
                captionChip="EVENT"
                className="rounded-[12px]"
                showCaptionText={false}
              />
            </div>

            {/* Slot D: Wide (row 4, cols 1-3, 3:1) */}
            <div className="col-span-3 row-span-1 rounded-[14px] border-ink-2 shadow-hard overflow-hidden group">
              <PhotoSlot
                id="hero-d"
                captionChip="TEACHER TRAINING"
                className="rounded-[12px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BELOW THE FOLD EDGE: Thin Proof Strip (Inside hero bottom, 48px above next section) */}
      <div className="mt-12 pt-6 border-t-2 border-ink w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 font-mono text-[13px] sm:text-[14px] font-bold text-ink text-center">
          <span>Curriculum + Software + Workshops</span>
          <span className="hidden sm:inline text-ink-soft select-none">|</span>
          <span>Programmes for every school stage</span>
          <span className="hidden sm:inline text-ink-soft select-none">|</span>
          <span>Teacher training included</span>
        </div>
      </div>
    </section>
  );
};
