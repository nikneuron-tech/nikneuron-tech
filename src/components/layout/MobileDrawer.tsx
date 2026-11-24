import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Volume2, VolumeX, Box, LayoutList, MessageSquare, Mail, X } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site.config';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavigate: (href: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  isMuted: boolean;
  onToggleMute: () => void;
  viewMode: 'cube' | 'list';
  onToggleViewMode: () => void;
}

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Bundles', href: '#bundles' },
  { label: 'Projects', href: '#projects' },
  { label: 'Playground', href: '#playground' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeSection,
  onNavigate,
  triggerRef,
  isMuted,
  onToggleMute,
  viewMode,
  onToggleViewMode,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  // 1. Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 2. Focus management & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus first interactive link after open
    const timer = setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, triggerRef]);

  const handleLinkClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden pointer-events-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-[#020308]/70 backdrop-blur-md"
          />

          {/* Drawer Sheet */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            initial={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[85vw] max-w-[380px] h-full bg-[#050612]/95 border-l border-white/[0.08] backdrop-blur-2xl flex flex-col justify-between p-6 overflow-y-auto no-scrollbar shadow-2xl z-10"
          >
            {/* Header: Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-wider text-white/40">
                Navigation
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation drawer"
                className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links with Staggered Fade-in */}
            <nav className="flex flex-col py-4 flex-1">
              {NAV_LINKS.map((link, idx) => {
                const isActive =
                  link.href === `#${activeSection}` ||
                  (link.href === '#services' && activeSection === 'bundles');

                return (
                  <motion.button
                    key={link.href}
                    ref={idx === 0 ? firstLinkRef : undefined}
                    type="button"
                    onClick={() => handleLinkClick(link.href)}
                    aria-current={isActive ? 'location' : undefined}
                    initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 12 }}
                    animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={{
                      delay: prefersReduced ? 0 : 0.04 * idx,
                      duration: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`h-14 flex items-center text-left text-xl font-medium tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric rounded-lg px-2 ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric ml-2.5" />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Bottom Controls & Contact Block */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
              {/* Primary Solid Cyan CTA */}
              <button
                type="button"
                onClick={() => handleLinkClick('#contact')}
                className="w-full h-12 rounded-full bg-cyan-electric text-[#050612] font-semibold text-sm flex items-center justify-center hover:brightness-105 active:brightness-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric"
              >
                Get in Touch
              </button>

              {/* Direct Channels (WhatsApp & Email) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={SITE_CONFIG.contact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-cyan-electric/40 text-white/80 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-cyan-electric/40 text-white/80 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-electric" />
                  <span>Email</span>
                </a>
              </div>

              {/* Compact Settings: Sound & 2D/3D */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs mt-1">
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white/40" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-cyan-electric" />
                  )}
                  <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                </button>

                <div className="inline-flex rounded-lg bg-white/[0.06] p-0.5 border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      if (viewMode !== 'cube') onToggleViewMode();
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      viewMode === 'cube' ? 'bg-white/20 text-white' : 'text-white/50'
                    }`}
                  >
                    3D
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (viewMode !== 'list') onToggleViewMode();
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/50'
                    }`}
                  >
                    2D
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

