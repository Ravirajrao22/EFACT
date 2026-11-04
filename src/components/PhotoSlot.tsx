import React from 'react';
import { Camera } from 'lucide-react';
import { IMAGES, ImageManifestEntry } from '../data/images';
import { SHOW_PLACEHOLDER_BADGE } from '../config';

interface PhotoSlotProps {
  id?: string;
  entry?: ImageManifestEntry;
  className?: string;
  priority?: boolean;
  captionChip?: string;
  showCaptionText?: boolean;
}

export const PhotoSlot: React.FC<PhotoSlotProps> = ({
  id,
  entry: directEntry,
  className = '',
  priority = false,
  captionChip,
  showCaptionText = true,
}) => {
  const item: ImageManifestEntry | undefined = directEntry || (id ? IMAGES[id] : undefined);

  if (!item) {
    return (
      <div className={`w-full h-full bg-paper-2 border border-ink/15 flex items-center justify-center p-4 text-xs font-mono text-ink-soft ${className}`}>
        Missing Image ID
      </div>
    );
  }

  // Real Image is present
  if (item.src) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#EAE2D2] select-none ${className}`}>
        <img
          src={item.src}
          alt={item.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
        />
        {captionChip && (
          <span className="absolute bottom-3 left-3 bg-white border border-ink font-mono text-[12px] font-semibold tracking-wider text-ink px-2.5 py-1 rounded-[6px] shadow-sm z-10">
            {captionChip}
          </span>
        )}
      </div>
    );
  }

  // Placeholder State: --paper-2 background with 45deg diagonal hatch (1px lines, rgba(20,17,15,0.08), 10px gap)
  return (
    <div
      data-placeholder="true"
      role="img"
      aria-label={item.alt}
      className={`relative w-full h-full bg-paper-2 flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none ${className}`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(20, 17, 15, 0.08), rgba(20, 17, 15, 0.08) 1px, transparent 1px, transparent 10px)',
      }}
    >
      {/* Corner Badge: PLACEHOLDER (yellow, mono 10px) */}
      {SHOW_PLACEHOLDER_BADGE && (
        <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-[4px] bg-yellow border border-ink font-mono text-[10px] font-extrabold uppercase tracking-wider text-ink shadow-sm z-10">
          Placeholder
        </span>
      )}

      {/* Centered Camera Line Icon (40px) */}
      <div className="flex flex-col items-center justify-center gap-2 max-w-[85%] z-10">
        <div className="w-12 h-12 rounded-xl bg-paper/80 border border-ink/20 flex items-center justify-center shadow-sm">
          <Camera className="w-8 h-8 text-ink-soft/80 stroke-[1.75]" aria-hidden="true" />
        </div>

        {showCaptionText && (
          <>
            <span className="font-mono text-[13px] font-bold text-ink leading-tight line-clamp-2">
              {item.caption}
            </span>
            <span className="font-body text-[12px] text-ink-soft">
              Photo coming soon
            </span>
          </>
        )}
      </div>

      {/* Bottom-left Caption Chip (if specified) */}
      {captionChip && (
        <span className="absolute bottom-3 left-3 bg-white border border-ink font-mono text-[12px] font-semibold tracking-wider text-ink px-2.5 py-1 rounded-[6px] shadow-sm z-10">
          {captionChip}
        </span>
      )}
    </div>
  );
};

