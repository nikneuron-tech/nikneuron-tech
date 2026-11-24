import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  FileText,
  Star,
  Columns,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { getServiceByIndex, getServiceById } from '../../config/services.config';
import { getProjectById } from '../../config/projects.config';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const FacePanel: React.FC = () => {
  const {
    activeFaceIndex,
    activeItemId,
    setActiveFace,
    nextFace,
    prevFace,
    favorites,
    toggleFavorite,
    compareList,
    toggleCompareItem,
    openCompare,
    setLiveAnnouncement,
    startInquiry,
    setSelectedProjectId,
  } = useAppStore();

  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [bookingRequested, setBookingRequested] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Reset booking state when active service changes
  useEffect(() => {
    setBookingRequested(false);
    setCopiedQuote(false);
  }, [activeFaceIndex]);

  // Focus management & Escape key listener
  useEffect(() => {
    if (activeFaceIndex === null) return;

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 150);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playTone(440, 0.15);
        setActiveFace(null);
      }

      // Simple focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeFaceIndex, setActiveFace]);

  if (activeFaceIndex === null) return null;

  const matchedItem = activeItemId ? getServiceById(activeItemId) : undefined;
  const service =
    matchedItem && matchedItem.faceIndex === activeFaceIndex
      ? matchedItem
      : getServiceByIndex(activeFaceIndex);
  const isFavorite = favorites.includes(service.id);
  const isCompared = compareList.includes(service.id);

  const handleClose = () => {
    soundEngine.playTone(440, 0.2);
    setActiveFace(null);
    setLiveAnnouncement('Returned to free cube view');
  };

  const handleNext = () => {
    soundEngine.playTone(600, 0.1);
    nextFace();
  };

  const handlePrev = () => {
    soundEngine.playTone(550, 0.1);
    prevFace();
  };

  const handleBookDemo = () => {
    soundEngine.playSnapHolo();
    setBookingRequested(true);
    setLiveAnnouncement(`Demo booking requested for ${service.title}`);
    startInquiry({
      serviceType: service.id,
      brief: `I would like to book a technical demo for ${service.title} (${service.tagline}).`,
    });
  };

  const handleGetQuote = () => {
    soundEngine.playTone(720, 0.1);
    navigator.clipboard?.writeText(
      `Nikneuron Quote Inquiry: ${service.title} - ${service.tagline}`
    );
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
    setLiveAnnouncement(`Quote details for ${service.title} copied`);
    startInquiry({
      serviceType: service.id,
      brief: `Requesting a project scope & quote for ${service.title}. Key goals:`,
    });
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-40 flex items-end md:items-stretch justify-end bg-void-deep/75 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-panel-title"
      >
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Panel Container (Bottom sheet on mobile, slide from right on desktop) */}
        <motion.aside
          ref={panelRef}
          initial={
            prefersReduced
              ? { opacity: 0 }
              : isMobile
              ? { y: '100%' }
              : { x: '100%' }
          }
          animate={
            prefersReduced
              ? { opacity: 1 }
              : isMobile
              ? { y: 0 }
              : { x: 0 }
          }
          exit={
            prefersReduced
              ? { opacity: 0 }
              : isMobile
              ? { y: '100%' }
              : { x: '100%' }
          }
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative w-full md:max-w-2xl lg:max-w-3xl h-[90vh] md:h-full glass-panel border-t md:border-t-0 md:border-l border-cyan-electric/30 shadow-glass flex flex-col z-50 overflow-hidden rounded-t-3xl md:rounded-none bg-void-deep/95"
        >
          {/* Mobile Drag Indicator Handle */}
          <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-12 h-1 rounded-full bg-white/20" />
          </div>

          {/* Top Bar / Breadcrumb / Actions */}
          <div className="px-5 md:px-8 py-4 border-b border-cyan-electric/15 bg-void-surface/50 flex items-center justify-between gap-4">
            {/* Breadcrumb: Cube > Service */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={handleClose}
                className="text-text-secondary hover:text-cyan-electric transition-colors flex items-center gap-1.5 font-bold"
              >
                <span>Cube</span>
              </button>
              <span className="text-text-dim">/</span>
              <span
                className="font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
                style={{ color: service.accentColor }}
              >
                {service.title}
              </span>
            </nav>

            {/* Quick Switcher & Back to Cube */}
            <div className="flex items-center gap-2">
              {/* Prev / Next face buttons */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-0.5">
                <button
                  onClick={handlePrev}
                  title="Previous service (Left Arrow)"
                  aria-label="Previous service"
                  className="p-1 rounded-full text-text-secondary hover:text-white hover:bg-cyan-electric/20 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-electric"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold px-1.5 text-text-dim">
                  {service.faceIndex + 1}/6
                </span>
                <button
                  onClick={handleNext}
                  title="Next service (Right Arrow)"
                  aria-label="Next service"
                  className="p-1 rounded-full text-text-secondary hover:text-white hover:bg-cyan-electric/20 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-electric"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Back to Cube Button */}
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                title="Return to 3D cube (Esc)"
                aria-label="Close inspector and return to 3D cube"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-display text-xs font-bold text-white bg-cyan-electric/15 border border-cyan-electric hover:bg-cyan-electric hover:text-void shadow-cyan-glow transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-electric"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>
          </div>

          {/* Scrollable Service Content */}
          <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 flex flex-col gap-6">
            {/* Hero Visual Container */}
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-cyan-electric/30 bg-void-surface/80 shadow-lg group p-1"
              style={{
                boxShadow: `0 10px 40px -10px ${service.colorGlow}`,
              }}
            >
              <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-void flex items-center justify-center">
                {service.demoVideo ? (
                  <video
                    src={service.demoVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={service.thumbnailPath}
                    alt={`${service.title} diagram preview`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                )}

                {/* Subtle Neon Grid & Gradient Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${service.colorGlow}, transparent 70%)`,
                  }}
                />

                {/* Service Face Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-void-deep/85 border border-white/20 backdrop-blur-md">
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: service.accentColor }}
                  />
                  <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-white">
                    Face {service.faceIndex + 1} · Nikneuron IT
                  </span>
                </div>

                {/* Interactive Status Indicator */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-void-deep/85 border border-white/20 backdrop-blur-md text-[10px] font-mono text-cyan-electric font-semibold">
                  <Zap className="w-3 h-3 text-cyan-electric animate-pulse" />
                  <span>Interactive Service Primed</span>
                </div>
              </div>
            </div>

            {/* Service Header & Tagline */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <h1
                  id="service-panel-title"
                  className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight"
                >
                  {service.title}
                </h1>

                {/* Shortlist & Compare quick buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playTone(700, 0.08);
                      toggleFavorite(service.id);
                    }}
                    title={isFavorite ? 'Remove from shortlist' : 'Add to shortlist'}
                    aria-label={isFavorite ? 'Remove from shortlist' : 'Add to shortlist'}
                    className={`p-2 rounded-full border transition-all ${
                      isFavorite
                        ? 'bg-pink-accent/20 border-pink-accent text-pink-accent shadow-pink-glow'
                        : 'bg-white/5 border-white/10 text-text-dim hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-pink-accent' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playTone(650, 0.08);
                      toggleCompareItem(service.id);
                    }}
                    title={isCompared ? 'Remove from compare' : 'Add to compare'}
                    aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
                    className={`p-2 rounded-full border transition-all ${
                      isCompared
                        ? 'bg-cyan-electric/20 border-cyan-electric text-cyan-electric shadow-cyan-glow'
                        : 'bg-white/5 border-white/10 text-text-dim hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Columns className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm md:text-base text-text-secondary font-light leading-relaxed">
                {service.tagline}
              </p>
            </div>

            {/* Primary Action CTAs */}
            <div className="p-4 rounded-2xl bg-void-surface/60 border border-cyan-electric/25 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleBookDemo}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display text-xs md:text-sm font-extrabold text-void bg-gradient-to-r from-cyan-electric to-pink-accent shadow-cyan-glow hover:opacity-95 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-electric"
              >
                <Calendar className="w-4 h-4 text-void" />
                <span>{bookingRequested ? 'Demo Requested ✓' : 'Book a Demo'}</span>
              </button>

              <button
                onClick={handleGetQuote}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display text-xs md:text-sm font-bold text-white bg-white/5 border border-white/15 hover:bg-white/10 hover:border-cyan-electric transition-all focus:outline-none focus:ring-2 focus:ring-cyan-electric"
              >
                <FileText className="w-4 h-4 text-cyan-electric" />
                <span>{copiedQuote ? 'Details Copied!' : 'Get a Quote'}</span>
              </button>

              {compareList.length > 0 && (
                <button
                  onClick={() => openCompare()}
                  className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl font-mono text-xs text-pink-accent bg-pink-accent/10 border border-pink-accent/30 hover:bg-pink-accent/20 transition-all"
                  title="Open compare view"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Compare ({compareList.length})</span>
                </button>
              )}
            </div>

            {/* Key Benefits Checklist */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-electric" />
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  Key Capabilities & ROI
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {service.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-void-surface/40 border border-white/5 hover:border-cyan-electric/30 transition-colors"
                  >
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: service.accentColor }}
                    />
                    <span className="text-xs md:text-sm text-text-secondary leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Use Cases */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-accent" />
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  Target Use Cases
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.useCases.map((useCase, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 text-xs text-text-secondary"
                  >
                    <span className="text-[10px] font-mono text-cyan-electric font-semibold uppercase">
                      Scenario 0{idx + 1}
                    </span>
                    <span className="leading-snug">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Proven Projects / Case Studies */}
            {service.projectIds && service.projectIds.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-electric" />
                    <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                      Proven In Real Systems
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-mono text-cyan-electric hover:underline cursor-pointer"
                  >
                    View All Case Studies →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {service.projectIds.map((projId) => {
                    const proj = getProjectById(projId);
                    if (!proj) return null;
                    return (
                      <button
                        key={projId}
                        type="button"
                        onClick={() => {
                          handleClose();
                          setSelectedProjectId(proj.id);
                        }}
                        className="text-left p-3.5 rounded-xl bg-void-surface/50 border border-cyan-electric/25 hover:border-cyan-electric hover:bg-cyan-electric/10 transition-all flex flex-col justify-between gap-2 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-electric transition-colors">
                            {proj.title}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-text-dim">
                            {proj.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                          {proj.tagline}
                        </p>
                        <span className="text-[10px] font-mono font-semibold text-cyan-electric flex items-center gap-1 mt-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View Architecture & Specs</span>
                          <span>→</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Service Tags */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider">
                Discovery Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-text-secondary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Quick-Jump Section Navigation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left text-text-secondary hover:text-cyan-electric transition-colors cursor-pointer"
              >
                ← Browse All 8 Services
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left text-text-secondary hover:text-pink-accent transition-colors cursor-pointer"
              >
                View Ready Bundles ↓
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left text-cyan-electric hover:text-white transition-colors cursor-pointer"
              >
                Start Direct Inquiry →
              </button>
            </div>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
