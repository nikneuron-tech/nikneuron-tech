import React, { useState } from 'react';
import { Volume2, VolumeX, LayoutList, Box, Wand2, Columns, Menu, X, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SITE_CONFIG } from '../../config/site.config';
import { soundEngine } from '../ui/audio';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    activeSection,
    scrollProgress,
    isCubeDocked,
    setActiveFace,
    setHasInteracted,
    isMuted,
    toggleMute,
    viewMode,
    setViewMode,
    openWizard,
    compareList,
    openCompare,
    openCommandPalette,
  } = useAppStore();

  const handleToggleMute = () => {
    toggleMute();
    soundEngine.muted = !isMuted;
  };

  const handleToggleViewMode = () => {
    const nextMode = viewMode === 'cube' ? 'list' : 'cube';
    soundEngine.playTone(650, 0.1);
    setViewMode(nextMode);
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    soundEngine.playTone(550, 0.08);

    if (href === '#hero') {
      setActiveFace(null);
      setHasInteracted();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Real-time Scroll Progress Bar across top edge */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-white/5 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-cyan-electric via-pink-accent to-cyan-electric transition-all duration-150 ease-out shadow-cyan-glow"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
        />
      </div>

      {/* 2. Primary Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
          isCubeDocked
            ? 'py-2.5 px-4 sm:px-8 bg-void-deep/90 border-b border-cyan-electric/20 backdrop-blur-2xl shadow-glass'
            : 'py-4 sm:py-5 px-4 sm:px-6 md:px-12 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('#hero')}
            title="Nikneuron Home (Return to Top)"
            aria-label="Nikneuron Home"
            className="flex items-center gap-2.5 group outline-none focus:ring-2 focus:ring-cyan-electric rounded-lg p-1 shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-void-deep border border-cyan-electric/35 p-1 flex items-center justify-center shadow-cyan-glow group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img
                src="/logo-mark-hd.png"
                alt="Nikneuron Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-base font-bold tracking-tight leading-none">
                <span className="text-white">Nik</span>
                <span className="bg-gradient-to-r from-[#00e5ff] via-[#2979ff] to-[#651fff] bg-clip-text text-transparent">
                  neuron
                </span>
              </span>
              <span className="hidden sm:inline text-[9px] font-mono text-cyan-electric/75 tracking-wider uppercase mt-0.5">
                Engineering & Design
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-void-surface/80 border border-cyan-electric/25 backdrop-blur-xl shadow-cyan-glow"
          >
            {SITE_CONFIG.navigation.map((item) => {
              const isActive =
                item.href === `#${activeSection}` ||
                (item.href === '#hero' && (!activeSection || activeSection === 'hero'));
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-cyan-electric bg-cyan-electric/15 border border-cyan-electric/40 shadow-neon-cyan'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full bg-cyan-electric" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Direct Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Command Palette Search Trigger (⌘K) */}
            <button
              onClick={() => {
                soundEngine.playTone(600, 0.08);
                openCommandPalette();
              }}
              title="Search Services, Projects & Stacks (⌘K or /)"
              aria-label="Open Search Command Palette"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-text-secondary bg-void-surface/80 border border-cyan-electric/30 hover:border-cyan-electric hover:text-white shadow-cyan-glow backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-cyan-electric"
            >
              <span className="text-[11px] font-mono text-cyan-electric/90">⌘K</span>
              <span className="hidden xl:inline text-text-dim text-[11px]">Search</span>
            </button>

            {/* Compare Button (When items added) */}
            {compareList.length > 0 && (
              <button
                onClick={() => {
                  soundEngine.playTone(650, 0.1);
                  openCompare();
                }}
                title={`Compare ${compareList.length} items`}
                aria-label={`Compare ${compareList.length} items`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-pink-accent/20 border border-pink-accent shadow-pink-glow backdrop-blur-xl transition-all animate-pulse"
              >
                <Columns className="w-3.5 h-3.5 text-pink-accent" />
                <span className="hidden sm:inline">Compare</span>
                <span className="px-1.5 py-0.2 rounded-full bg-pink-accent text-void font-bold text-[10px]">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Help Me Choose Wizard Button */}
            <button
              onClick={() => {
                soundEngine.playTone(700, 0.1);
                openWizard();
              }}
              title="Help me choose: 3-step recommendation wizard"
              aria-label="Help me choose wizard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-void bg-gradient-to-r from-pink-accent to-cyan-electric shadow-pink-glow hover:opacity-90 backdrop-blur-xl transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Wizard</span>
            </button>

            {/* View Mode Toggle: 3D Cube vs 2D List (V key) */}
            <button
              onClick={handleToggleViewMode}
              title={
                viewMode === 'cube'
                  ? 'Switch to Accessible 2D Mode (Press V)'
                  : 'Switch to 3D Cube Mode (Press V)'
              }
              aria-label={viewMode === 'cube' ? 'Switch to 2D Mode' : 'Switch to 3D Mode'}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-text-secondary bg-void-surface border border-cyan-electric/30 hover:border-cyan-electric hover:text-white shadow-cyan-glow backdrop-blur-xl transition-all"
            >
              {viewMode === 'cube' ? (
                <>
                  <LayoutList className="w-3.5 h-3.5 text-cyan-electric" />
                  <span className="text-[10px] font-mono text-cyan-electric/80 px-1 rounded bg-white/10">V</span>
                </>
              ) : (
                <>
                  <Box className="w-3.5 h-3.5 text-cyan-electric animate-pulse" />
                  <span className="text-[10px] font-mono text-cyan-electric/80 px-1 rounded bg-white/10">V</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="flex items-center justify-center w-8 h-8 rounded-full text-text-secondary bg-void-surface border border-cyan-electric/25 hover:border-cyan-electric hover:text-white shadow-cyan-glow backdrop-blur-xl transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-text-dim" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-cyan-electric" />
              )}
            </button>

            {/* Primary Contact CTA button */}
            <button
              onClick={() => handleNavClick('#contact')}
              className="hidden sm:flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-cyan-electric/20 border border-cyan-electric/60 hover:bg-cyan-electric hover:text-void shadow-cyan-glow backdrop-blur-xl transition-all group"
            >
              <span>Work Together</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-text-secondary bg-void-surface border border-cyan-electric/30 hover:text-white backdrop-blur-xl"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-pink-accent" /> : <Menu className="w-4 h-4 text-cyan-electric" />}
            </button>
          </div>
        </div>

        {/* 3. Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl bg-void-deep/95 border border-cyan-electric/40 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 pointer-events-auto animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {SITE_CONFIG.navigation.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-left px-3 py-2.5 min-h-[42px] rounded-xl text-xs font-semibold transition-all ${
                    item.href === `#${activeSection}`
                      ? 'text-cyan-electric bg-cyan-electric/15 border border-cyan-electric/30'
                      : 'text-text-secondary bg-white/5 hover:text-white border border-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-cyan-electric/20 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleToggleViewMode();
                }}
                className="w-full py-2.5 min-h-[42px] rounded-xl text-xs font-semibold text-cyan-electric bg-void-surface border border-cyan-electric/35 flex items-center justify-center gap-2"
              >
                {viewMode === 'cube' ? <LayoutList className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                <span>{viewMode === 'cube' ? 'Switch to 2D List Mode' : 'Back to 3D Cube Mode'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWizard();
                }}
                className="w-full py-2.5 min-h-[42px] rounded-xl text-xs font-bold text-void bg-gradient-to-r from-pink-accent to-cyan-electric shadow-pink-glow text-center"
              >
                Help Me Choose Wizard
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('#contact');
                }}
                className="w-full py-2.5 min-h-[42px] rounded-xl text-xs font-bold text-white bg-cyan-electric/20 border border-cyan-electric text-center"
              >
                Get in Touch (Within 24h)
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
