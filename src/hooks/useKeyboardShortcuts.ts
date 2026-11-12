import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { soundEngine } from '../components/ui/audio';

export function useKeyboardShortcuts(searchInputRef: React.RefObject<HTMLInputElement>) {
  const {
    activeFaceIndex,
    setActiveFace,
    nextFace,
    prevFace,
    setHasInteracted,
    viewMode,
    setViewMode,
    openCommandPalette,
    closeCommandPalette,
    isCommandPaletteOpen,
  } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      // Quick search / command palette: "/" or Cmd/Ctrl+K
      if (
        (e.key === '/' && !isInput) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        setHasInteracted();
        openCommandPalette();
        return;
      }

      // Escape key behavior
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          e.preventDefault();
          closeCommandPalette();
          return;
        }
        if (isInput) {
          (document.activeElement as HTMLElement)?.blur();
          return;
        }
        if (activeFaceIndex !== null) {
          soundEngine.playTone(440, 0.15);
          setActiveFace(null);
          return;
        }
      }

      // If command palette or input is active, don't trigger other hotkeys
      if (isCommandPaletteOpen || isInput) return;

      // Toggle view mode: "v" key
      if (e.key.toLowerCase() === 'v') {
        e.preventDefault();
        const newView = viewMode === 'cube' ? 'list' : 'cube';
        soundEngine.playTone(700, 0.1);
        setViewMode(newView);
        return;
      }

      // Number keys 1-6 for instant face selection (unless debug=layers is active)
      const isDebugLayers = typeof window !== 'undefined' && window.location.search.includes('debug=layers');
      if (!isDebugLayers && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        const faceIndex = parseInt(e.key, 10) - 1;
        soundEngine.playSnapHolo();
        setActiveFace(faceIndex);
        return;
      }

      // Arrow keys navigation across faces
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (e.key === 'ArrowRight') {
          soundEngine.playTone(600, 0.08);
          nextFace();
        } else {
          soundEngine.playTone(550, 0.08);
          prevFace();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeFaceIndex,
    setActiveFace,
    nextFace,
    prevFace,
    setHasInteracted,
    viewMode,
    setViewMode,
    openCommandPalette,
    closeCommandPalette,
    isCommandPaletteOpen,
    searchInputRef,
  ]);
}
