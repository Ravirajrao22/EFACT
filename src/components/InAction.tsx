import React, { useState } from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { PhotoSlot } from './PhotoSlot';

interface InActionProps {
  onAskWorkshops: () => void;
}

export const InAction: React.FC<InActionProps> = ({ onAskWorkshops }) => {
  const [filter, setFilter] = useState<'All' | 'Workshops' | 'Events' | 'Projects'>('All');

  const items = [
    // Workshops
    {
      id: 'workshop-1',
      category: 'Workshops',
      tag: 'WORKSHOP',
      title: 'Robotics & Automation Lab',
      desc: 'Hands-on builds with boards, sensors and motors.',
    },
    {
      id: 'workshop-2',
      category: 'Workshops',
      tag: 'WORKSHOP',
      title: 'PCB Design & Electronics',
      desc: 'From a circuit idea to a working board.',
    },
    {
      id: 'workshop-3',
      category: 'Workshops',
      tag: 'WORKSHOP',
      title: '3D Design & Printing',
      desc: 'Design it, print it, test it.',
    },

    // Events
    {
      id: 'event-1',
      category: 'Events',
      tag: 'EVENT',
      title: 'Inter-school Technology Challenge',
      desc: 'We prepare and mentor student teams for school, inter-school and national events.',
    },
    {
      id: 'event-2',
      category: 'Events',
      tag: 'EVENT',
      title: 'School-level Robotics Showcase',
      desc: 'We prepare and mentor student teams for school, inter-school and national events.',
    },
    {
      id: 'event-3',
      category: 'Events',
      tag: 'EVENT',
      title: 'National Competition Mentoring',
      desc: 'We prepare and mentor student teams for school, inter-school and national events.',
    },

    // Student Projects
    {
      id: 'project-1',
      category: 'Projects',
      tag: 'STUDENT PROJECT',
      title: 'Autonomous Line-Following Bot',
      desc: 'Real-world sensor feedback loop with motor speed regulation built by students.',
    },
    {
      id: 'project-2',
      category: 'Projects',
      tag: 'STUDENT PROJECT',
      title: 'Smart Classroom Sensor Project',
      desc: 'Environmental telemetry and automation built by students in an applied workshop.',
    },
    {
      id: 'project-3',
      category: 'Projects',
      tag: 'STUDENT PROJECT',
      title: 'App built by Class 9 students',
      desc: 'Practical mobile utility designed and coded in class on structured logic.',
    },
  ];

  const filteredItems = items.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Workshops') return item.category === 'Workshops';
    if (filter === 'Events') return item.category === 'Events';
    if (filter === 'Projects') return item.category === 'Projects';
    return true;
  });

  const filterOptions: { label: string; val: 'All' | 'Workshops' | 'Events' | 'Projects' }[] = [
    { label: 'All', val: 'All' },
    { label: 'Workshops', val: 'Workshops' },
    { label: 'Events & Competitions', val: 'Events' },
    { label: 'Student Projects', val: 'Projects' },
  ];

  return (
    <section id="in-action" className="py-[72px] md:py-24 lg:py-32 px-4 md:px-8 max-w-[1240px] mx-auto border-t-2 border-ink">
      {/* Header */}
      <div className="max-w-[720px] mb-8">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-blue mb-3 block">
          See It in Action
        </span>
        <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.08] tracking-tight text-ink mb-4">
          What your students could be doing.
        </h2>
        <p className="font-body text-[18px] leading-[1.6] text-ink-soft max-w-[62ch]">
          Workshops, events and student projects, built on the same logic they learn in class.
        </p>
      </div>

      {/* Filter Chips (Accessible radiogroup) */}
      <div
        role="radiogroup"
        aria-label="Filter action categories"
        className="flex flex-wrap gap-2.5 mb-10 lg:mb-14"
      >
        {filterOptions.map((opt) => {
          const isSelected = filter === opt.val;
          return (
            <button
              key={opt.val}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setFilter(opt.val)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold border-ink-2 transition-all ${
                isSelected
                  ? 'bg-lime text-ink shadow-hard-sm'
                  : 'bg-white text-ink shadow-none hover:bg-paper-2'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* 9 Cards Grid (3 columns desktop, 2 tablet, 1 mobile, 32px gap) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="bg-white border-ink-2 rounded-[16px] shadow-hard p-6 flex flex-col justify-between group transition-all"
          >
            <div>
              {/* Photo Slot (3:2 ratio) */}
              <div className="aspect-[3/2] w-full rounded-[10px] overflow-hidden border border-ink/20 mb-5 relative">
                <PhotoSlot id={item.id} showCaptionText={false} />
              </div>

              {/* Tag Chip */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-paper-2 border border-ink/20 font-mono text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                  <Tag className="w-3 h-3 text-blue" />
                  <span>{item.tag}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-[22px] leading-snug text-ink mb-2">
                {item.title}
              </h3>

              {/* One-line Description */}
              <p className="font-body text-[15px] leading-relaxed text-ink-soft">
                {item.desc}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Closing Banner under Grid */}
      <div className="mt-14 bg-paper-2 border-ink-2 rounded-[16px] shadow-hard p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-heading font-extrabold text-[20px] sm:text-[24px] text-ink leading-tight">
            A student's best idea should not end with a school project.
          </p>
          <p className="font-body text-[15px] text-ink-soft mt-1">
            Let's organize a tailored showcase, workshop, or competition squad for your school.
          </p>
        </div>

        <button
          onClick={onAskWorkshops}
          className="h-11 px-6 rounded-full bg-blue text-white font-heading font-bold text-sm btn-brutal shrink-0 inline-flex items-center gap-2 shadow-hard-sm"
        >
          <span>Ask about workshops & events</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

