import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';
import { NavOverflowMenu } from './NavOverflowMenu';
import { MobileDrawer } from './MobileDrawer';

interface NavItem {
  label: string;
  href: string;
}

const PRIMARY_LINKS: NavItem[] = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

const MORE_LINKS: NavItem[] = [
  { label: 'Bundles', href: '#bundles' },
  { label: 'Playground', href: '#playground' },
];

export const Navbar: React.FC = () => {
  const {
    activeSection,
    scrollProgress,
    setActiveFace,
    setHasInteracted,
    isMuted,
    toggleMute,
    viewMode,
    setViewMode,
    openCommandPalette,
  } = useAppStore();

  const prefersReduced = useReducedMotion();

  // Scroll & visibility state
  const [isDocked, setIsDocked] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Menu states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // References for focus return
  const overflowTriggerRef = useRef<HTMLButtonElement>(null);
  const hamburgerTriggerRef = useRef<HTMLButtonElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // 1. Scroll listener: Docking after ~80px and hide-on-scroll-down / reveal-on-scroll-up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isPastThreshold = currentScrollY > 80;
          setIsDocked(isPastThreshold);

          // Check if keyboard focus is inside header
          const hasFocusWithin = headerRef.current?.contains(document.activeElement);

          // Hide on scroll down past 150px, reveal on scroll up
          // NEVER hide when any menu is open or when keyboard focus is inside header
          if (mobileMenuOpen || overflowOpen || moreDropdownOpen || hasFocusWithin) {
            setIsVisible(true);
          } else if (currentScrollY > 150 && currentScrollY > lastScrollYRef.current + 8) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollYRef.current - 8 || currentScrollY <= 80) {
            setIsVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, overflowOpen, moreDropdownOpen]);

  // Close "More" dropdown on outside click or Escape
  useEffect(() => {
    if (!moreDropdownOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreDropdownOpen(false);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [moreDropdownOpen]);

  const handleToggleMute = useCallback(() => {
    toggleMute();
    soundEngine.muted = !isMuted;
  }, [toggleMute, isMuted]);

  const handleToggleViewMode = useCallback(() => {
    const nextMode = viewMode === 'cube' ? 'list' : 'cube';
    if (!isMuted) {
      soundEngine.playTone(620, 0.08);
    }
    setViewMode(nextMode);
  }, [viewMode, setViewMode, isMuted]);

  // Smooth scroll handler with scroll-margin offset
  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setOverflowOpen(false);

    if (href === '#hero') {
      setActiveFace(null);
      setHasInteracted();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash !== '#hero') {
        window.history.pushState(null, '', '#hero');
      }
      return;
    }

    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      if (window.location.hash !== href) {
        window.history.pushState(null, '', href);
      }
    }
  };

  const handleCtaClick = () => {
    if (!isMuted) {
      soundEngine.playTone(600, 0.08);
    }
    handleNavClick('#contact');
  };

  const isMoreActive = activeSection === 'bundles' || activeSection === 'playground';

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-40 px-3 sm:px-6 pt-3 pointer-events-none transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible ? 'translate-y-0' : '-translate-y-[120%]'
        }`}
      >
        {/* Floating Centered Pill Navbar */}
        <div
          className={`mx-auto max-w-5xl rounded-full px-3.5 sm:px-5 flex items-center justify-between pointer-events-auto transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] relative ${
            isDocked
              ? 'h-14 bg-[rgba(5,6,18,0.72)] backdrop-blur-xl border border-white/[0.08] shadow-sm'
              : 'h-16 bg-transparent border border-transparent'
          }`}
        >
          {/* ============================================================== */}
          {/* 1. LEFT ZONE: Brand Logo & Wordmark (Solid White, No Gradient) */}
          {/* ============================================================== */}
          <button
            type="button"
            onClick={() => handleNavClick('#hero')}
            title="Nikneuron Home"
            aria-label="Nikneuron Home"
            className="flex items-center gap-2.5 h-10 px-1 rounded-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric shrink-0"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 p-0.5 overflow-hidden flex items-center justify-center bg-[#050612] shrink-0">
              <img
                src="/logo-mark-hd.png"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
              Nikneuron
            </span>
          </button>

          {/* ============================================================== */}
          {/* 2. CENTER ZONE: Max 6 Links with Soft Pill Shared Indicator    */}
          {/* ============================================================== */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 relative"
          >
            {PRIMARY_LINKS.map((item) => {
              const isActive = item.href === `#${activeSection}`;

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative h-10 px-3.5 flex items-center text-sm font-medium tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric rounded-full select-none ${
                    isActive ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {/* Shared Soft Pill Active Indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveIndicator"
                      transition={
                        prefersReduced
                          ? { duration: 0 }
                          : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                      }
                      className="absolute inset-0 rounded-full bg-cyan-electric/10"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}

            {/* "More" Dropdown Popover (Bundles & Playground) */}
            <div ref={moreDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={moreDropdownOpen}
                aria-label="More navigation options"
                className={`relative h-10 px-3.5 flex items-center gap-1 text-sm font-medium tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric rounded-full select-none ${
                  isMoreActive || moreDropdownOpen
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {isMoreActive && (
                  <motion.span
                    layoutId="navActiveIndicator"
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                    }
                    className="absolute inset-0 rounded-full bg-cyan-electric/10"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">More</span>
                <ChevronDown
                  className={`relative z-10 w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-cyan-electric' : 'text-white/50'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {moreDropdownOpen && (
                <div
                  role="menu"
                  aria-label="Additional pages"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-40 p-1.5 rounded-2xl bg-[rgba(5,6,18,0.92)] border border-white/[0.08] backdrop-blur-xl shadow-2xl z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150"
                >
                  {MORE_LINKS.map((subItem) => {
                    const isSubActive = subItem.href === `#${activeSection}`;
                    return (
                      <button
                        key={subItem.href}
                        role="menuitem"
                        type="button"
                        onClick={() => handleNavClick(subItem.href)}
                        aria-current={isSubActive ? 'location' : undefined}
                        className={`w-full h-9 px-3 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric ${
                          isSubActive
                            ? 'bg-cyan-electric/15 text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span>{subItem.label}</span>
                        {isSubActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ============================================================== */}
          {/* 3. RIGHT ZONE: Search (⌘K), Overflow (⋯), and Single Clean CTA */}
          {/* ============================================================== */}
          <div className="flex items-center gap-3 relative">
            {/* Command Palette Trigger (Search icon + tiny ⌘K hint on xl) */}
            <button
              type="button"
              onClick={openCommandPalette}
              title="Search (⌘K or /)"
              aria-label="Open search command palette"
              className="h-10 px-2.5 xl:px-3 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px] font-mono text-white/40 pl-1.5">
                ⌘K
              </span>
            </button>

            {/* Overflow "⋯" Menu for Sound & 2D/3D Mode (Desktop) */}
            <div className="relative hidden lg:block">
              <button
                ref={overflowTriggerRef}
                type="button"
                onClick={() => setOverflowOpen((prev) => !prev)}
                title="More settings"
                aria-label="Display and sound settings"
                aria-haspopup="menu"
                aria-expanded={overflowOpen}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric ${
                  overflowOpen
                    ? 'text-white bg-white/[0.08]'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <NavOverflowMenu
                isOpen={overflowOpen}
                onClose={() => setOverflowOpen(false)}
                triggerRef={overflowTriggerRef}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                viewMode={viewMode}
                onToggleViewMode={handleToggleViewMode}
                onOpenCommandPalette={openCommandPalette}
              />
            </div>

            {/* Primary Solid Cyan CTA (Desktop) */}
            <button
              type="button"
              onClick={handleCtaClick}
              className="hidden sm:inline-flex h-10 px-5 rounded-full bg-cyan-electric text-[#050612] text-sm font-semibold items-center justify-center hover:brightness-105 active:brightness-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric focus-visible:ring-offset-2 focus-visible:ring-offset-[#050612]"
            >
              Get in Touch
            </button>

            {/* Mobile Two-Line Animated Hamburger Button (< 1024px) */}
            <button
              ref={hamburgerTriggerRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric"
            >
              <div className="w-5 h-3.5 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* ============================================================== */}
          {/* 4. DOCKED SCROLL PROGRESS BAR: Thin Cyan-Only Line at Bottom    */}
          {/* ============================================================== */}
          <div className="absolute -bottom-px left-6 right-6 h-[2px] bg-transparent overflow-hidden rounded-full pointer-events-none">
            <div
              className="h-full bg-cyan-electric transition-all duration-150 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
            />
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 5. FULL-HEIGHT MOBILE DRAWER SHEET (< 1024px)                  */}
      {/* ============================================================== */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onNavigate={handleNavClick}
        triggerRef={hamburgerTriggerRef}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
      />
    </>
  );
};

export default Navbar;
