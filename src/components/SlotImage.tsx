import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { HomeImageSlot } from '../lib/home-images';

interface SlotImageProps {
  slot: HomeImageSlot;
  className?: string;
  priority?: boolean;
}

export const SlotImage: React.FC<SlotImageProps> = ({ slot, className = '', priority = false }) => {
  if (slot.src) {
    return (
      <img
        src={slot.src}
        alt={slot.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none ${className}`}
      />
    );
  }

  // Placeholder state: muted surface background, 1px border, faint 24px grid pattern (6% opacity), centered 20px icon + 13px label
  return (
    <div
      data-placeholder="true"
      aria-label={slot.alt}
      role="img"
      className={`w-full h-full bg-paper-2 border border-ink/15 flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(20, 17, 15, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(20, 17, 15, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }}
    >
      <div className="flex flex-col items-center justify-center gap-1.5 z-10">
        <ImageIcon className="w-5 h-5 text-ink-soft/60 stroke-[1.75]" aria-hidden="true" />
        <span className="text-[13px] font-medium text-ink-soft/80 leading-tight">
          {slot.label}
        </span>
      </div>
    </div>
  );
};
