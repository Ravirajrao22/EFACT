import React from 'react';
import { BookOpen, Laptop, Hammer, CheckCircle2 } from 'lucide-react';

export const Offerings: React.FC = () => {
  const workshopPills = [
    'Robotics and Automation',
    '3D Design and Printing',
    'PCB Design and Electronics',
    'Website, App and Software Development',
    'Product Design and Prototyping',
    'Woodworking and Fabrication',
    'Entrepreneurship and Innovation',
    'Emerging Technologies',
  ];

  return (
    <section id="offerings" className="py-[72px] md:py-24 lg:py-32 px-4 md:px-8 max-w-[1240px] mx-auto border-t-2 border-ink">
      {/* Section Header */}
      <div className="max-w-[720px] mb-10 lg:mb-14">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-blue mb-3 block">
          What We Bring
        </span>
        <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.08] tracking-tight text-ink mb-4">
          Three offerings. One connected learning experience.
        </h2>
        <p className="font-body text-[18px] leading-[1.6] text-ink-soft max-w-[62ch]">
          A cohesive STEM ecosystem that combines syllabus-aligned coursework, classroom software, and hands-on fabrication workshops under one unified programme.
        </p>
      </div>

      {/* 3 Equal Cards (32px gap) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Card 1: Adaptive STEM Curriculum (Blue stripe) */}
        <div className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-blue" />
          <div className="pl-2">
            <div className="w-12 h-12 rounded-xl bg-blue/15 border-ink-2 flex items-center justify-center text-blue mb-6 shadow-sm">
              <BookOpen className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h3 className="font-heading font-extrabold text-[24px] text-ink mb-2">
              Adaptive STEM Curriculum
            </h3>
            <p className="font-body text-[16px] leading-[1.6] text-ink-soft mb-6">
              Not another subject. A practical extension of what students already learn.
            </p>

            <ul className="space-y-3 font-body text-[15px] text-ink leading-snug">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                <span>We work with your teachers to connect STEM activities with the school's existing academic syllabus.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                <span>Students explore concepts from Science and Mathematics through experiments, programming and real-world projects.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                <span>Structured progression tailored to each grade band from primary through senior secondary.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2: EFACT Studio (Violet stripe) */}
        <div className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-violet" />
          <div className="pl-2">
            <div className="w-12 h-12 rounded-xl bg-violet/15 border-ink-2 flex items-center justify-center text-violet mb-6 shadow-sm">
              <Laptop className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h3 className="font-heading font-extrabold text-[24px] text-ink mb-2">
              EFACT Studio
            </h3>
            <p className="font-body text-[16px] leading-[1.6] text-ink-soft mb-6">
              Our educational software for structured programming and problem-solving, with a visual-to-real-code bridge.
            </p>

            <ul className="space-y-3 font-body text-[15px] text-ink leading-snug mb-6">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet shrink-0 mt-0.5" />
                <span>Students first solve a problem in a structured, simulated environment.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet shrink-0 mt-0.5" />
                <span>Then they solve the same problem using real programming.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet shrink-0 mt-0.5" />
                <span>The bridge between understanding code and actually being able to write it.</span>
              </li>
            </ul>

            {/* Static Software Diagram Box */}
            <div className="p-3 bg-paper-2 rounded-[10px] border border-ink/20 font-mono text-xs text-ink-soft flex items-center justify-between">
              <span className="font-bold text-ink">Visual Logic</span>
              <span className="text-violet font-bold">→</span>
              <span className="font-bold text-ink">Real Python / C++</span>
            </div>
          </div>
        </div>

        {/* Card 3: Advanced Skills & Maker Workshops (Orange stripe) */}
        <div className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-orange" />
          <div className="pl-2">
            <div className="w-12 h-12 rounded-xl bg-orange/15 border-ink-2 flex items-center justify-center text-orange mb-6 shadow-sm">
              <Hammer className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h3 className="font-heading font-extrabold text-[24px] text-ink mb-2">
              Advanced Skills & Maker Workshops
            </h3>
            <p className="font-body text-[16px] leading-[1.6] text-ink-soft mb-6">
              Give students the opportunity to build beyond the syllabus.
            </p>

            {/* Workshop Areas Pills */}
            <div className="flex flex-wrap gap-2">
              {workshopPills.map((pill) => (
                <span
                  key={pill}
                  className="px-2.5 py-1 rounded-full bg-paper border border-ink/20 font-mono text-[11px] font-semibold text-ink leading-tight shadow-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

