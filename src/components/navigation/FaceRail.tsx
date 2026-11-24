import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  RotateCw,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { SERVICES_CONFIG, getServiceByIndex, ServiceConfig } from '../../config/services.config';
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
    rotateToFace,
    nextFace,
    prevFace,
  } = useAppStore();

  const [hoveredService, setHoveredService] = useState<ServiceConfig | null>(null);
  const [hoverPos, setHoverPos] = useState<{ left: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastSoundTimeRef = useRef<number>(0);

  const currentFaceIndex = activeFaceIndex !== null ? activeFaceIndex : frontFaceIndex;
  const currentService = getServiceByIndex(currentFaceIndex);

  // Auto-scroll the active pill horizontally inside the rail container without scrolling the main window
  useEffect(() => {
    const activeBtn = pillRefs.current[currentFaceIndex];
    const container = containerRef.current;
    if (activeBtn && container) {
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScrollLeft = btnLeft - containerWidth / 2 + btnWidth / 2;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [currentFaceIndex]);

  // Support horizontal mouse wheel scrolling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        containerRef.current.scrollLeft += e.deltaY * 0.8;
      }
    }
  };

  // Sound throttler for hover
  const playHoverSound = () => {
    const now = Date.now();
    if (now - lastSoundTimeRef.current > 70) {
      soundEngine.playTone(840, 0.02, 'sine', 0.03);
      lastSoundTimeRef.current = now;
    }
  };

  const handleSelectService = (service: ServiceConfig) => {
    const isAlreadyFacing = currentFaceIndex === service.faceIndex;

    if (isAlreadyFacing) {
      // If already facing front, open or toggle the deep inspect panel
      soundEngine.playSnapHolo();
      setActiveFace(activeFaceIndex === service.faceIndex ? null : service.faceIndex);
    } else {
      // Rotate 3D Energy Cube directly to this service face
      soundEngine.playTone(520 + service.faceIndex * 45, 0.1, 'sine', 0.07);
      rotateToFace(service.faceIndex);
    }
  };

  const handleInspectClick = (e: React.MouseEvent, faceIndex: number) => {
    e.stopPropagation();
    soundEngine.playSnapHolo();
    setActiveFace(faceIndex);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTone(550, 0.08, 'sine', 0.06);
    prevFace();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTone(600, 0.08, 'sine', 0.06);
    nextFace();
  };

  const handleMouseEnter = (service: ServiceConfig, index: number) => {
    playHoverSound();
    setHoveredService(service);
    const btn = pillRefs.current[index];
    if (btn && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const relativeLeft = btnRect.left - containerRect.left + btnRect.width / 2;
      setHoverPos({ left: relativeLeft });
    }
  };

  const handleMouseLeave = () => {
    setHoveredService(null);
    setHoverPos(null);
  };

  return (
    <nav
      aria-label="Nikneuron IT Services Quick Rail"
      className={`relative pointer-events-auto flex flex-col items-center gap-1.5 max-w-[96vw] ${className || ''}`}
    >
      {/* Floating Micro-Card Hologram Tooltip */}
      {hoveredService && hoverPos && (
        <div
          role="tooltip"
          aria-live="polite"
          className="absolute bottom-full mb-3 pointer-events-none z-50 transition-all duration-200 transform -translate-x-1/2 hidden md:flex flex-col w-72 p-3.5 rounded-2xl bg-void-deep/95 border backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${hoverPos.left}px`,
            borderColor: `${hoveredService.accentColor}80`,
            boxShadow: `0 12px 32px -4px rgba(0,0,0,0.8), 0 0 20px -2px ${hoveredService.accentColor}40`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: hoveredService.accentColor }}
              />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                Face 0{hoveredService.faceIndex + 1} • {hoveredService.tags?.[0] || 'Service'}
              </span>
            </div>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold"
              style={{
                backgroundColor: `${hoveredService.accentColor}25`,
                color: hoveredService.accentColor,
              }}
            >
              Key {hoveredService.faceIndex + 1}
            </span>
          </div>

          {/* Title & Tagline */}
          <h4 className="text-xs font-display font-bold text-white mb-1 flex items-center gap-1.5">
            {hoveredService.title}
          </h4>
          <p className="text-[11px] text-text-secondary leading-snug line-clamp-2 mb-2.5">
            {hoveredService.tagline}
          </p>

          {/* Quick Deliverable Bullets */}
          {hoveredService.benefits && hoveredService.benefits.length > 0 && (
            <div className="space-y-1 mb-2.5 pt-1 border-t border-white/5">
              {hoveredService.benefits.slice(0, 2).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[10px] text-text-muted">
                  <CheckCircle2
                    className="w-3 h-3 shrink-0 mt-0.5"
                    style={{ color: hoveredService.accentColor }}
                  />
                  <span className="line-clamp-1">{benefit}</span>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Action Prompt */}
          <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-white/10">
            {currentFaceIndex === hoveredService.faceIndex ? (
              <span className="flex items-center gap-1 text-cyan-electric font-semibold">
                <Sparkles className="w-3 h-3" />
                Active Face • Click to open details
              </span>
            ) : (
              <span className="flex items-center gap-1 text-text-secondary">
                <RotateCw className="w-3 h-3 text-cyan-electric" />
                Click to rotate 3D Cube
              </span>
            )}
            <ArrowUpRight className="w-3 h-3 text-text-dim" />
          </div>

          {/* Tooltip Arrow Pointer */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px]"
            style={{ borderTopColor: hoveredService.accentColor }}
          />
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="flex items-center gap-2">
        {/* Previous Service Button */}
        <button
          onClick={handlePrev}
          title="Previous Service (Left Arrow or click)"
          aria-label="Previous Service"
          className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-void-surface/90 border border-cyan-electric/30 text-text-secondary hover:text-white hover:border-cyan-electric hover:shadow-cyan-glow backdrop-blur-xl transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-cyan-electric group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Scrollable Service Pills Container */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          className="flex items-center gap-1.5 p-1.5 rounded-full bg-void-deep/90 border border-cyan-electric/25 backdrop-blur-2xl shadow-glass overflow-x-auto scrollbar-none snap-x snap-mandatory max-w-[82vw] md:max-w-[70vw]"
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          {SERVICES_CONFIG.map((service, index) => {
            const isSelected = activeFaceIndex === service.faceIndex;
            const isFacingFront = currentFaceIndex === service.faceIndex;

            return (
              <button
                key={service.id}
                ref={(el) => {
                  pillRefs.current[index] = el;
                }}
                onClick={() => handleSelectService(service)}
                onMouseEnter={() => handleMouseEnter(service, index)}
                onMouseLeave={handleMouseLeave}
                title={`${service.title} - ${service.tagline} (Click to rotate, Press ${service.faceIndex + 1})`}
                aria-label={`Service ${service.faceIndex + 1}: ${service.title}${isFacingFront ? ' (Currently facing front)' : ''}`}
                aria-current={isSelected ? 'true' : undefined}
                className={`snap-center shrink-0 group relative flex items-center gap-2 px-3 py-1.5 min-h-[38px] rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-electric select-none ${
                  isSelected
                    ? 'font-bold scale-[1.03] text-void shadow-lg'
                    : isFacingFront
                    ? 'scale-[1.02] text-white shadow-md'
                    : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                style={{
                  backgroundColor: isSelected
                    ? service.accentColor
                    : isFacingFront
                    ? `${service.accentColor}18`
                    : undefined,
                  borderColor: isFacingFront && !isSelected ? `${service.accentColor}70` : undefined,
                  borderWidth: isFacingFront && !isSelected ? '1px' : undefined,
                  boxShadow: isSelected
                    ? `0 0 16px ${service.accentColor}`
                    : isFacingFront
                    ? `0 0 12px ${service.accentColor}40`
                    : undefined,
                }}
              >
                {/* Glowing Beacon / Active Indicator */}
                {isFacingFront && !isSelected && (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                    style={{
                      backgroundColor: service.accentColor,
                      boxShadow: `0 0 6px ${service.accentColor}`,
                    }}
                  />
                )}

                {/* Mini Thumbnail Icon */}
                <div
                  className="w-5 h-5 rounded-full overflow-hidden shrink-0 border flex items-center justify-center bg-void transition-transform group-hover:scale-110"
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

                {/* Shortcut Key or Inspect Trigger */}
                {isFacingFront ? (
                  <span
                    onClick={(e) => handleInspectClick(e, service.faceIndex)}
                    title="Click to open deep specification drawer"
                    className={`inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold transition-all ${
                      isSelected
                        ? 'bg-void text-white'
                        : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
                    }`}
                  >
                    <span>{isSelected ? 'Open' : 'Explore'}</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                ) : (
                  <span
                    className={`hidden sm:inline-block text-[9px] font-mono px-1 rounded transition-colors ${
                      isSelected
                        ? 'bg-void text-cyan-electric font-bold'
                        : 'bg-white/10 text-text-dim group-hover:text-text-secondary'
                    }`}
                  >
                    {service.faceIndex + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Next Service Button */}
        <button
          onClick={handleNext}
          title="Next Service (Right Arrow or click)"
          aria-label="Next Service"
          className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-void-surface/90 border border-cyan-electric/30 text-text-secondary hover:text-white hover:border-cyan-electric hover:shadow-cyan-glow backdrop-blur-xl transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-cyan-electric group"
        >
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Subtle Keyboard & Interaction Hint */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-dim">
        <span className="hidden sm:inline-flex items-center gap-1">
          <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-text-secondary text-[9px]">
            ←
          </kbd>
          <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-text-secondary text-[9px]">
            →
          </kbd>
          <span>or keys</span>
          <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-text-secondary text-[9px]">
            1-6
          </kbd>
          <span>to rotate cube</span>
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="text-text-muted">
          Active:{' '}
          <span
            className="font-semibold"
            style={{ color: currentService?.accentColor || '#4fd8ff' }}
          >
            {currentService?.title}
          </span>
        </span>
      </div>
    </nav>
  );
};
