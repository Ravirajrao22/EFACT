import React from 'react';
import {
  GraduationCap,
  Laptop,
  Users,
  Cpu,
  Wrench,
  Package,
  BookMarked,
  Trophy,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { PhotoSlot } from './PhotoSlot';

export const SupportAndValidation: React.FC = () => {
  const supportItems = [
    {
      icon: <GraduationCap className="w-5 h-5 text-blue" />,
      label: 'STEM curriculum design and implementation',
    },
    {
      icon: <Laptop className="w-5 h-5 text-violet" />,
      label: 'EFACT Studio deployment',
    },
    {
      icon: <Users className="w-5 h-5 text-orange" />,
      label: 'Teacher training and faculty development',
    },
    {
      icon: <Cpu className="w-5 h-5 text-blue" />,
      label: 'Robotics and electronics kits',
    },
    {
      icon: <Wrench className="w-5 h-5 text-violet" />,
      label: 'ATL and STEM lab setup and maintenance',
    },
    {
      icon: <Package className="w-5 h-5 text-orange" />,
      label: 'Lab inventory and component management',
    },
    {
      icon: <BookMarked className="w-5 h-5 text-blue" />,
      label: 'Practical manuals and self-learning resources',
    },
    {
      icon: <Trophy className="w-5 h-5 text-violet" />,
      label: 'Inter-school competitions and technology events',
    },
    {
      icon: <Briefcase className="w-5 h-5 text-orange" />,
      label: 'Faculty deployment and programme coordination',
    },
  ];

  return (
    <section id="support" className="py-[72px] md:py-24 lg:py-32 px-4 md:px-8 max-w-[1240px] mx-auto border-t-2 border-ink">
      {/* Header */}
      <div className="max-w-[720px] mb-10 lg:mb-14">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-blue mb-3 block">
          Institutional Partnership
        </span>
        <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.08] tracking-tight text-ink mb-4">
          Full institutional support.
        </h2>
        <p className="font-body text-[18px] leading-[1.6] text-ink-soft max-w-[62ch]">
          We take care of hardware procurement, faculty mentoring, curriculum alignment, and technical maintenance so your teachers can focus on classroom teaching.
        </p>
      </div>

      {/* 3x3 Grid of Small Cards (32px gap) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
        {supportItems.map((item, index) => (
          <div
            key={index}
            className="bg-white border-ink-2 rounded-[14px] shadow-hard-sm p-5 sm:p-6 flex items-start gap-4 hover:-translate-y-[1px] transition-transform"
          >
            <div className="w-10 h-10 rounded-lg bg-paper-2 border border-ink/20 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <p className="font-heading font-bold text-[16px] leading-snug text-ink mt-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Closing Line */}
      <div className="text-center mb-16">
        <p className="font-mono text-xs sm:text-sm text-ink-soft">
          Programmes can be arranged individually or as a long-term institutional partnership.
        </p>
      </div>

      {/* "Validated with real students" Strip */}
      <div className="pt-12 border-t-2 border-ink/15">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue block mb-1">
            Academic Validation
          </span>
          <h3 className="font-heading font-extrabold text-2xl text-ink">
            Validated with real students
          </h3>
          <p className="font-body text-sm text-ink-soft mt-1">
            Designed from classroom sessions, observation and student feedback.
          </p>
        </div>

        {/* Two PhotoSlot Logo Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-[760px] mx-auto">
          {/* LPU Slot */}
          <div className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 flex flex-col items-center justify-center text-center h-[180px]">
            <PhotoSlot id="lpu" className="rounded-[10px]" />
          </div>

          {/* DPS Slot */}
          <div className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 flex flex-col items-center justify-center text-center h-[180px]">
            <PhotoSlot id="dps" className="rounded-[10px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

