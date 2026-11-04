import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SlotImage } from './SlotImage';
import { HOME_IMAGES } from '../lib/home-images';

export const WhatHappensAtRIG: React.FC = () => {
  return (
    <section id="what-happens-at-rig" className="pb-16 lg:pb-24 pt-0 px-4 md:px-8 max-w-[1200px] mx-auto">
      {/* Section Header */}
      <div>
        <h2 className="font-heading font-extrabold text-[22px] leading-[28px] lg:text-[28px] lg:leading-[34px] text-ink">
          What your students could be doing
        </h2>
        <p className="mt-4 text-[16px] leading-[24px] text-ink-soft max-w-[560px] font-body">
          Hands-on sessions, real competitions and projects built on real code and real hardware.
        </p>
      </div>

      {/* 3 Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Card 1: Workshops */}
        <article
          id="card-workshops"
          className="bg-paper border border-ink/20 rounded-[8px] p-5 shadow-hard flex flex-col justify-between group transition-shadow duration-200"
        >
          <div>
            <div className="aspect-[3/2] rounded-[6px] overflow-hidden border border-ink/15 relative">
              <SlotImage slot={HOME_IMAGES.cardWorkshops} />
            </div>
            <div className="mt-4">
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-blue font-mono">
                Workshops
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink mt-1">
                Run a workshop at your school
              </h3>
              <p className="mt-2 text-[15px] leading-[24px] text-ink-soft font-body">
                Hands-on sessions that take students from visual logic to real Python and Arduino C++.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <a
              href="#schools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:text-ink transition-colors group-hover:underline"
            >
              <span>Explore workshops</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </a>
          </div>
        </article>

        {/* Card 2: Events */}
        <article
          id="card-events"
          className="bg-paper border border-ink/20 rounded-[8px] p-5 shadow-hard flex flex-col justify-between group transition-shadow duration-200"
        >
          <div>
            <div className="aspect-[3/2] rounded-[6px] overflow-hidden border border-ink/15 relative">
              <SlotImage slot={HOME_IMAGES.cardEvents} />
            </div>
            <div className="mt-4">
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-blue font-mono">
                Events
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink mt-1">
                Take part in school and national events
              </h3>
              <p className="mt-2 text-[15px] leading-[24px] text-ink-soft font-body">
                School, inter-school and national events that give student work a real audience.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <a
              href="#schools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:text-ink transition-colors group-hover:underline"
            >
              <span>Explore events</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </a>
          </div>
        </article>

        {/* Card 3: Student projects */}
        <article
          id="card-projects"
          className="bg-paper border border-ink/20 rounded-[8px] p-5 shadow-hard flex flex-col justify-between group transition-shadow duration-200"
        >
          <div>
            <div className="aspect-[3/2] rounded-[6px] overflow-hidden border border-ink/15 relative">
              <SlotImage slot={HOME_IMAGES.cardProjects} />
            </div>
            <div className="mt-4">
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-blue font-mono">
                Student projects
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink mt-1">
                Meet the projects students build
              </h3>
              <p className="mt-2 text-[15px] leading-[24px] text-ink-soft font-body">
                Real problems solved with real code and real hardware, mentored by our team.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <a
              href="#maker-path"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:text-ink transition-colors group-hover:underline"
            >
              <span>See student projects</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </a>
          </div>
        </article>
      </div>

      {/* Validation Footer Line */}
      <div className="mt-12 border-t border-ink/10 pt-6 text-center">
        <p className="text-[13px] text-ink-soft font-body">
          Designed and validated with students at Lovely Professional University and Delhi Public School, Jalandhar.
        </p>
      </div>
    </section>
  );
};
