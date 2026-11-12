import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SERVICES_CONFIG, getServiceByIndex } from '../../config/services.config';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';

export interface FaceRailProps {
  className?: string;
}

export const FaceRail: React.FC<FaceRailProps> = ({ className }) => {
  const {
    activeFaceIndex,
    frontFaceIndex,
    setActiveFace,
    nextFace,
    prevFace,
  } = useAppStore();

  const currentFaceIndex = activeFaceIndex !== null ? activeFaceIndex : frontFaceIndex;

  const handleSelectService = (index: number) => {
    soundEngine.playSnapHolo();
    setActiveFace(index);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTone(550, 0.1);
    prevFace();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTone(600, 0.1);
    nextFace();
  };

  return (
    <nav
      aria-label="Nikneuron IT Services Quick Rail"
      className={`relative pointer-events-auto flex items-center gap-2 max-w-[96vw] ${className || ''}`}
    >
      {/* Prev Service Button */}
      <button
        onClick={handlePrev}
        title="Previous Service (Left Arrow)"
        aria-label="Previous Service"
        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-void-surface/90 border border-cyan-electric/30 text-text-secondary hover:text-white hover:border-cyan-electric hover:shadow-cyan-glow backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-cyan-electric"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Service Thumbnails & Titles Rail */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-void-deep/90 border border-cyan-electric/25 backdrop-blur-2xl shadow-glass overflow-x-auto scrollbar-none snap-x snap-mandatory">
        {SERVICES_CONFIG.map((service) => {
          const isSelected = activeFaceIndex === service.faceIndex;
          const isFacingFront = currentFaceIndex === service.faceIndex;

          return (
            <button
              key={service.id}
              onClick={() => handleSelectService(service.faceIndex)}
              title={`${service.title} - ${service.tagline} (Press ${service.faceIndex + 1})`}
              aria-label={`Service ${service.faceIndex + 1}: ${service.title}`}
              aria-current={isSelected ? 'true' : undefined}
              className={`snap-center shrink-0 group relative flex items-center gap-2 px-3 py-1.5 min-h-[38px] rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-electric ${
                isSelected
                  ? 'bg-cyan-electric text-void font-bold shadow-cyan-glow scale-[1.03]'
                  : isFacingFront
                  ? 'bg-white/10 text-white border border-cyan-electric/50 shadow-cyan-glow/50'
                  : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {/* Mini Thumbnail Icon */}
              <div
                className="w-5 h-5 rounded-full overflow-hidden shrink-0 border flex items-center justify-center bg-void"
                style={{
                  borderColor: isSelected ? '#050612' : service.accentColor,
                  boxShadow: isSelected ? 'none' : `0 0 6px ${service.accentColor}`,
                }}
              >
                <img
                  src={service.thumbnailPath}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Service Title */}
              <span className="whitespace-nowrap font-display text-[11px] md:text-xs">
                {service.title}
              </span>

              {/* Shortcut Key Badge */}
              <span
                className={`hidden sm:inline-block text-[9px] font-mono px-1 rounded ${
                  isSelected
                    ? 'bg-void text-cyan-electric font-bold'
                    : 'bg-white/10 text-text-dim group-hover:text-text-secondary'
                }`}
              >
                {service.faceIndex + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Next Service Button */}
      <button
        onClick={handleNext}
        title="Next Service (Right Arrow)"
        aria-label="Next Service"
        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-void-surface/90 border border-cyan-electric/30 text-text-secondary hover:text-white hover:border-cyan-electric hover:shadow-cyan-glow backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-cyan-electric"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
