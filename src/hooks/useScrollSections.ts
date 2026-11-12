import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

const SECTION_FACE_MAP: Record<string, number> = {
  hero: 4,        // AI Receptionist (+Z)
  services: 0,    // UI/UX & Web (+X)
  trust: 4,       // Core stats
  playground: 0,  // Interactive UI demos
  process: 2,     // Custom Software (+Y)
  about: 5,       // AI & Chat Automation (-Z)
  engagement: 1,  // Batch Mail & Marketing (-X)
  faq: 3,         // Support & Growth (-Y)
  contact: 4,     // AI Receptionist (+Z)
};

export function useScrollSections() {
  const {
    setActiveSection,
    setScrollProgress,
    setIsCubeDocked,
    rotateToFace,
    isUserInteractingWithCube,
    activeFaceIndex,
  } = useAppStore();

  const isInteractingRef = useRef(isUserInteractingWithCube);
  isInteractingRef.current = isUserInteractingWithCube;

  const activeFaceRef = useRef(activeFaceIndex);
  activeFaceRef.current = activeFaceIndex;

  useEffect(() => {
    let ticking = false;

    const updateScrollMetrics = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);

      // Dock cube when user scrolls past the hero zone (~380px)
      const docked = scrollY > 380;
      setIsCubeDocked(docked);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollMetrics);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollMetrics();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsCubeDocked, setScrollProgress]);

  // Section visibility observer
  useEffect(() => {
    const sectionIds = Object.keys(SECTION_FACE_MAP);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);

            // Scroll-linked rotation: only rotate if user is NOT actively dragging/clicking the cube
            // and no modal face panel is explicitly pinned
            if (!isInteractingRef.current && activeFaceRef.current === null) {
              const targetFace = SECTION_FACE_MAP[sectionId];
              const currentFront = useAppStore.getState().frontFaceIndex;
              if (targetFace !== undefined && currentFront !== targetFace) {
                rotateToFace(targetFace);
              }
            }
          }
        });
      },
      {
        threshold: [0.35, 0.6],
        rootMargin: '-10% 0px -20% 0px',
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection, rotateToFace]);
}

export default useScrollSections;
