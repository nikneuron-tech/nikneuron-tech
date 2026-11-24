import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Box, LayoutList, Search, Check } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export interface NavOverflowMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  isMuted: boolean;
  onToggleMute: () => void;
  viewMode: 'cube' | 'list';
  onToggleViewMode: () => void;
  onOpenCommandPalette: () => void;
}

export const NavOverflowMenu: React.FC<NavOverflowMenuProps> = ({
  isOpen,
  onClose,
  triggerRef,
  isMuted,
  onToggleMute,
  viewMode,
  onToggleViewMode,
  onOpenCommandPalette,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
        return;
      }

      // Arrow navigation inside menu
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const activeElements = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
        const currentIndex = activeElements.indexOf(document.activeElement as HTMLButtonElement);
        let nextIndex = 0;
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex + 1 >= activeElements.length ? 0 : currentIndex + 1;
        } else {
          nextIndex = currentIndex - 1 < 0 ? activeElements.length - 1 : currentIndex - 1;
        }
        activeElements[nextIndex]?.focus();
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);

    // Initial focus on first item
    const timer = setTimeout(() => {
      itemsRef.current[0]?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      aria-label="Display & audio settings"
      className={`absolute right-0 top-full mt-2 w-64 p-1.5 rounded-2xl bg-[rgba(5,6,18,0.92)] border border-white/[0.08] backdrop-blur-xl shadow-2xl text-white text-xs z-50 ${
        prefersReduced ? 'opacity-100' : 'animate-in fade-in zoom-in-95 duration-200'
      }`}
    >
      {/* 1. Sound Effects Toggle Row */}
      <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-colors">
        <div className="flex items-center gap-2.5">
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/50" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-electric" />
          )}
          <span className="font-medium text-white/90">Sound effects</span>
        </div>
        <button
          ref={(el) => (itemsRef.current[0] = el)}
          role="menuitem"
          type="button"
          onClick={onToggleMute}
          aria-checked={!isMuted}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-electric focus:ring-offset-2 focus:ring-offset-[#050612] ${
            !isMuted ? 'bg-cyan-electric' : 'bg-white/20'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              !isMuted ? 'translate-x-4 bg-void' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 2. Viewport 3D / 2D Segmented Control Row */}
      <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-colors mt-0.5">
        <div className="flex items-center gap-2.5">
          {viewMode === 'cube' ? (
            <Box className="w-4 h-4 text-cyan-electric" />
          ) : (
            <LayoutList className="w-4 h-4 text-white/70" />
          )}
          <span className="font-medium text-white/90">Viewport</span>
        </div>
        <div className="inline-flex rounded-lg bg-white/[0.06] p-0.5 border border-white/[0.06]">
          <button
            ref={(el) => (itemsRef.current[1] = el)}
            role="menuitem"
            type="button"
            onClick={() => {
              if (viewMode !== 'cube') onToggleViewMode();
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              viewMode === 'cube'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            3D
          </button>
          <button
            ref={(el) => (itemsRef.current[2] = el)}
            role="menuitem"
            type="button"
            onClick={() => {
              if (viewMode !== 'list') onToggleViewMode();
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            2D
          </button>
        </div>
      </div>

      <div className="h-px bg-white/[0.08] my-1" />

      {/* 3. Command Palette Quick Action */}
      <button
        ref={(el) => (itemsRef.current[3] = el)}
        role="menuitem"
        type="button"
        onClick={() => {
          onClose();
          onOpenCommandPalette();
        }}
        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-white/[0.06] text-white/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-electric"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-white/60" />
          <span className="font-medium">Command palette</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-white/50">
          ⌘K
        </kbd>
      </button>
    </div>
  );
};

