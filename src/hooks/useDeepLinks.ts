import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FACES_CONFIG, getFaceById, getFaceByIndex } from '../config/faces.config';

export function useDeepLinks() {
  const {
    activeFaceIndex,
    activeItemId,
    setActiveFace,
    selectFaceItem,
  } = useAppStore();

  const isInitialLoadRef = useRef(true);

  // 1. Read deep links on initial mount (?face=<id>&item=<id>) and section hash anchors
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const faceParam = searchParams.get('face');
      const itemParam = searchParams.get('item');

      if (faceParam) {
        let matchedFace = getFaceById(faceParam);
        if (!matchedFace) {
          const parsedIndex = parseInt(faceParam, 10);
          if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < FACES_CONFIG.length) {
            matchedFace = getFaceByIndex(parsedIndex);
          }
        }

        if (matchedFace) {
          if (itemParam) {
            selectFaceItem(matchedFace.index, itemParam);
          } else {
            setActiveFace(matchedFace.index);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to parse URL deep link parameters:', err);
    }

    // Read plain section hash anchors (#projects, #services, #contact)
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const targetId = hash.replace('#', '');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    window.addEventListener('hashchange', handleHashNavigation);
    handleHashNavigation();

    isInitialLoadRef.current = false;
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [setActiveFace, selectFaceItem]);

  // 2. Sync URL when selection changes
  useEffect(() => {
    if (isInitialLoadRef.current || typeof window === 'undefined') return;

    try {
      const currentUrl = new URL(window.location.href);

      if (activeFaceIndex !== null) {
        const face = getFaceByIndex(activeFaceIndex);
        currentUrl.searchParams.set('face', face.id);

        if (activeItemId) {
          currentUrl.searchParams.set('item', activeItemId);
        } else {
          currentUrl.searchParams.delete('item');
        }
      } else {
        currentUrl.searchParams.delete('face');
        currentUrl.searchParams.delete('item');
      }

      window.history.replaceState({}, '', currentUrl.toString());
    } catch (err) {
      console.warn('Failed to update URL deep link state:', err);
    }
  }, [activeFaceIndex, activeItemId]);
}

export default useDeepLinks;
