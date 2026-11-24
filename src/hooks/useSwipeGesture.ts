import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { soundEngine } from '../components/ui/audio';

export function useSwipeGesture() {
  const { nextFace, prevFace, isIntroActive, isDraggingCube, activeFaceIndex } = useAppStore();
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only track single touch if not dragging cube and not in detail inspector
      if (e.touches.length === 1 && !isDraggingCube && activeFaceIndex === null) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        };
      } else {
        touchStartRef.current = null;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || isIntroActive || isDraggingCube || activeFaceIndex !== null) {
        touchStartRef.current = null;
        return;
      }

      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - touchStartRef.current.x;
      const deltaY = touchEnd.clientY - touchStartRef.current.y;
      const elapsedTime = Date.now() - touchStartRef.current.time;

      // Ensure gesture was primarily horizontal, brisk, and not an axis-locked drag
      const minDistance = 60; // pixels
      const maxTime = 400; // ms

      if (
        elapsedTime < maxTime &&
        Math.abs(deltaX) > minDistance &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.8
      ) {
        if (deltaX < 0) {
          // Swipe Left -> Next face
          soundEngine.playTone(600, 0.08);
          nextFace();
        } else {
          // Swipe Right -> Prev face
          soundEngine.playTone(550, 0.08);
          prevFace();
        }
      }

      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextFace, prevFace, isIntroActive, isDraggingCube, activeFaceIndex]);
}
