import React, { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { AsmrBackground } from './components/ui/asmr-background';
import { CubeScene } from './components/cube/CubeScene';
import { SearchBar } from './components/search/SearchBar';
import { CommandPalette } from './components/search/CommandPalette';
import { HelpMeChooseWizard } from './components/wizard/HelpMeChooseWizard';
import { CompareModal } from './components/decision/CompareModal';
import { ResumeModal } from './components/modals/ResumeModal';
import { ProjectDetailModal } from './components/projects/ProjectDetailModal';
import { NikChatbot } from './components/chat/NikChatbot';
import { FacePanel } from './components/faces/FacePanel';
import { FaceRail } from './components/navigation/FaceRail';
import { OrientationGizmo } from './components/navigation/OrientationGizmo';
import { ListViewFallback } from './components/views/ListViewFallback';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TrustStrip } from './components/sections/TrustStrip';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { PlaygroundSection } from './components/sections/PlaygroundSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { AboutSection } from './components/sections/AboutSection';
import { EngagementSection } from './components/sections/EngagementSection';
import { FAQSection } from './components/sections/FAQSection';
import { ContactSection } from './components/sections/ContactSection';
import { useAppStore } from './store/useAppStore';
import { getServiceByIndex } from './config/services.config';
import { SITE_CONFIG } from './config/site.config';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { useDeepLinks } from './hooks/useDeepLinks';
import { useScrollSections } from './hooks/useScrollSections';
import { soundEngine } from './components/ui/audio';

export const App: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    activeFaceIndex,
    frontFaceIndex,
    setActiveFace,
    hasInteracted,
    liveAnnouncement,
    viewMode,
  } = useAppStore();

  const frontService = getServiceByIndex(frontFaceIndex);

  // Global hooks
  useKeyboardShortcuts(searchInputRef);
  useSwipeGesture();
  useDeepLinks();
  useScrollSections();

  const handleScrollCue = () => {
    soundEngine.playTone(600, 0.1);
    const target = document.getElementById('services') || document.getElementById('trust');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AsmrBackground galaxyIntensity={0.85}>
      <div className="relative w-full min-h-screen bg-transparent font-body text-white overflow-x-hidden selection:bg-cyan-electric selection:text-void">
        {/* Accessibility ARIA live region for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {liveAnnouncement}
        </div>

        {/* Global Command / Search Palette (⌘K or /) */}
        <CommandPalette />

        {/* Decision Engine: Help Me Choose Wizard */}
        <HelpMeChooseWizard />

        {/* Decision Engine: Side-by-Side Compare Modal */}
        <CompareModal />

        {/* Founder Resume / CV Modal */}
        <ResumeModal />

        {/* Project Case Study Modal */}
        <ProjectDetailModal />

        {/* Persistent Floating Nik Chatbot */}
        <NikChatbot />

        {/* Persistent 3D AI Receptionist Appointment Core */}
        <div className="fixed bottom-5 left-4 sm:left-6 z-40 pointer-events-auto">
          <OrientationGizmo />
        </div>

        {/* 2. Sticky Top Glass Navigation Bar */}
        <Navbar />

      {/* Main View Area: 3D Holographic Cube Mode OR Accessible 2D List Mode */}
      {viewMode === 'cube' ? (
        <>
          {/* ========================================================= */}
          {/* 3D CUBE CONTAINER: Fluid Fullscreen in Hero */}
          {/* ========================================================= */}
          <div
            className="absolute top-0 left-0 right-0 h-screen z-10 pointer-events-auto overflow-hidden"
            aria-label="3D Interactive Energy Cube"
          >
            <CubeScene />
          </div>

          {/* ========================================================= */}
          {/* HERO SECTION */}
          {/* ========================================================= */}
          <section
            id="hero"
            className="relative z-20 min-h-[100dvh] w-full flex flex-col justify-between pt-20 sm:pt-24 pb-5 sm:pb-8 px-3 sm:px-8 max-w-7xl mx-auto pointer-events-none"
          >
            {/* Hero Left-Hand Side Introduction (leaves center 3D Cube fully shown & unobstructed) */}
            <div className="flex flex-col items-start text-left mt-1 sm:mt-4 pointer-events-auto max-w-xs sm:max-w-sm md:max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-electric/10 border border-cyan-electric/25 backdrop-blur-md shadow-cyan-glow mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-electric font-semibold">
                  Nikneuron Studio · Built, Not Promised
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                Software & Autonomous AI Systems
              </h1>

              <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed mt-2 max-w-sm">
                We engineer 24/7 AI receptionists, sub-second websites, and automated business workflows with direct founder engineering from Almora, Uttarakhand.
              </p>

              {/* Search Bar on Left */}
              <div className="w-full mt-3 hidden sm:block">
                <SearchBar inputRef={searchInputRef} />
              </div>
            </div>


            {/* Hero Bottom Dock: cleanly organized, zero overwriting */}
            <div className="relative z-20 flex flex-col items-center gap-2.5 sm:gap-3 w-full pointer-events-auto mt-auto pb-1 sm:pb-2">
              {/* Interactive Hint */}
              <div
                className={`flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider sm:tracking-widest text-cyan-electric bg-void-surface/75 border border-cyan-electric/30 backdrop-blur-xl shadow-cyan-glow transition-all duration-500 ${
                  hasInteracted || activeFaceIndex !== null
                    ? 'opacity-0 pointer-events-none h-0 py-0 overflow-hidden m-0'
                    : 'opacity-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-pink-accent shadow-pink-glow animate-pulse shrink-0" />
                <span className="sm:hidden">Drag cube · Tap face to explore</span>
                <span className="hidden sm:inline">Drag cube to rotate · Tap face to open · Keys 1–6</span>
              </div>

              {/* "Open <Service>" Confirmation CTA Button in Hero */}
              {activeFaceIndex === null && frontService && (
                <button
                  onClick={() => {
                    soundEngine.playSnapHolo();
                    setActiveFace(frontFaceIndex);
                  }}
                  title={`Open ${frontService.title} Details (Face 0${frontService.faceIndex + 1})`}
                  aria-label={`Open ${frontService.title} Details`}
                  className="min-h-[44px] px-6 py-2 rounded-full bg-void-deep/95 border-2 border-cyan-electric/80 text-white shadow-cyan-glow backdrop-blur-2xl font-display text-xs font-bold uppercase tracking-wider flex items-center gap-3 hover:bg-cyan-electric hover:text-void transition-all duration-200 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-cyan-electric"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                    style={{
                      backgroundColor: frontService.accentColor,
                      boxShadow: `0 0 10px ${frontService.accentColor}`,
                    }}
                  />
                  <span>Open {frontService.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-electric group-hover:bg-void/25 group-hover:text-void">
                    Face 0{frontService.faceIndex + 1}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {/* Face Rail Navigation in Hero */}
              <FaceRail />

              {/* Bottom Scroll Cue & Quick-Jump Links */}
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
                <button
                  onClick={handleScrollCue}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold text-text-secondary hover:text-cyan-electric bg-void-surface/60 border border-white/10 hover:border-cyan-electric/40 backdrop-blur-md transition-all group"
                >
                  <span>Explore services</span>
                  <ArrowDown className="w-3.5 h-3.5 text-cyan-electric animate-bounce" />
                </button>

                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <a
                    href="#bundles"
                    className="px-2.5 py-1 rounded-full bg-void-surface/60 border border-white/10 hover:border-pink-accent hover:text-white text-text-dim transition-all"
                  >
                    Bundles
                  </a>
                  <a
                    href="#projects"
                    className="px-2.5 py-1 rounded-full bg-void-surface/60 border border-white/10 hover:border-cyan-electric hover:text-white text-text-dim transition-all"
                  >
                    Projects
                  </a>
                  <a
                    href="#contact"
                    className="px-2.5 py-1 rounded-full bg-cyan-electric/15 border border-cyan-electric/40 hover:bg-cyan-electric hover:text-void text-cyan-electric font-semibold transition-all"
                  >
                    Get in Touch →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Slide-In Face Component Inspector */}
          <FacePanel />

          {/* ========================================================= */}
          {/* CONTENT SECTIONS IN NATURAL SCROLL ORDER */}
          {/* ========================================================= */}
          <main className="relative z-20 w-full">
            {/* 1. Core Services Showcase (First below Hero) */}
            <ServicesSection />

            {/* 2. Trust Telemetry Strip */}
            <TrustStrip />

            {/* 3. Real Systems & Case Studies */}
            <ProjectsSection />

            {/* 4. Client-Side Live Playgrounds */}
            <PlaygroundSection />

            {/* 5. How We Work Timeline */}
            <ProcessSection />

            {/* 6. About the Founder */}
            <AboutSection />

            {/* 7. Engagement Options */}
            <EngagementSection />

            {/* 8. Frequently Asked Questions */}
            <FAQSection />

            {/* 9. Contact Section */}
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer />
        </>
      ) : (
        /* 2D Accessible List Fallback View */
        <div className="pt-20">
          <ListViewFallback />
          <Footer />
        </div>
      )}
      </div>
    </AsmrBackground>
  );
};

export default App;
