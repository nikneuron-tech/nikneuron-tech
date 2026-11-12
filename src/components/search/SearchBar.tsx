import React from 'react';
import { Search } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ inputRef }) => {
  const { openCommandPalette } = useAppStore();

  return (
    <div className="relative w-full max-w-md">
      <button
        onClick={openCommandPalette}
        className="w-full relative flex items-center justify-between px-3.5 py-2 text-xs rounded-full bg-void-surface/90 border border-cyan-electric/25 hover:border-cyan-electric hover:shadow-cyan-glow text-text-dim transition-all backdrop-blur-xl group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-electric"
        aria-label="Open Command Palette (Press ⌘K or /)"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-cyan-electric group-hover:scale-110 transition-transform" />
          <span className="text-text-secondary group-hover:text-white transition-colors">
            Search services (e.g. website, WhatsApp, AI receptionist, CRM)...
          </span>
        </div>

        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded text-[10px] text-text-dim bg-white/10 border border-white/10 font-mono">
            ⌘K
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] text-text-dim bg-white/10 border border-white/10 font-mono">
            /
          </kbd>
        </div>
      </button>

      {/* Hidden dummy input to satisfy searchInputRef if passed */}
      <input ref={inputRef} type="hidden" />
    </div>
  );
};
