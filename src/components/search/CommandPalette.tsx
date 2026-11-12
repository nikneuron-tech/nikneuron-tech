import React, { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, Box, Sparkles, ArrowRight, Layers, FileCode, Hash, Navigation } from 'lucide-react';
import { ALL_SERVICES_CONFIG, ServiceConfig, getServiceById } from '../../config/services.config';
import { PROJECTS_CONFIG, Project } from '../../config/projects.config';
import { SITE_CONFIG } from '../../config/site.config';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';

export type SearchEntry =
  | {
    type: 'service';
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    accentColor: string;
    service: ServiceConfig;
  }
  | {
    type: 'project';
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    stack: string[];
    project: Project;
  }
  | {
    type: 'section';
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    href: string;
  };

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    selectFaceItem,
    setViewMode,
    setSelectedProjectId,
    rotateToFace,
  } = useAppStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isCommandPaletteOpen]);

  // Build unified search corpus
  const searchEntries = useMemo<SearchEntry[]>(() => {
    const serviceEntries: SearchEntry[] = ALL_SERVICES_CONFIG.map((s) => ({
      type: 'service',
      id: `svc-${s.id}`,
      title: s.title,
      subtitle: s.tagline,
      badge: `Face 0${s.faceIndex + 1}`,
      accentColor: s.accentColor,
      service: s,
    }));

    const projectEntries: SearchEntry[] = PROJECTS_CONFIG.map((p) => ({
      type: 'project',
      id: `proj-${p.id}`,
      title: p.title,
      subtitle: p.tagline,
      badge: p.status.toUpperCase(),
      stack: p.stack,
      project: p,
    }));

    const sectionEntries: SearchEntry[] = SITE_CONFIG.navigation.map((n) => ({
      type: 'section',
      id: `sec-${n.href}`,
      title: n.label,
      subtitle: `Jump to ${n.label} section`,
      badge: 'SECTION',
      href: n.href,
    }));

    return [...serviceEntries, ...projectEntries, ...sectionEntries];
  }, []);

  // Fuzzy search index
  const fuse = useMemo(() => {
    return new Fuse(searchEntries, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'subtitle', weight: 0.3 },
        { name: 'stack', weight: 0.2 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [searchEntries]);

  const results = useMemo<SearchEntry[]>(() => {
    if (!query.trim()) {
      return searchEntries;
    }
    return fuse.search(query.trim()).map((res) => res.item);
  }, [query, fuse, searchEntries]);

  const handleSelectItem = (entry: SearchEntry) => {
    soundEngine.playSnapHolo();
    closeCommandPalette();

    if (entry.type === 'service') {
      setViewMode('cube');
      selectFaceItem(entry.service.faceIndex, entry.service.id);
    } else if (entry.type === 'project') {
      // Rotate cube to primary service face that this project proves
      const primarySvcId = entry.project.serviceIds[0];
      const primarySvc = primarySvcId ? getServiceById(primarySvcId) : null;
      if (primarySvc) {
        rotateToFace(primarySvc.faceIndex);
      }
      setSelectedProjectId(entry.project.id);
    } else if (entry.type === 'section') {
      if (entry.href === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(entry.href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
        soundEngine.playTone(500, 0.04);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
        soundEngine.playTone(500, 0.04);
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelectItem(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, results, selectedIndex, closeCommandPalette]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isCommandPaletteOpen) return null;

  const quickFilterPills = ['WhatsApp', 'AI Receptionist', 'Web', 'CRM', 'Batch Mail', 'n8n'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nikneuron Quick Search Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-void-deep/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => closeCommandPalette()}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-void-surface/95 border border-cyan-electric/40 shadow-glass overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-cyan-electric/20 bg-void-surface">
          <Search className="w-5 h-5 text-cyan-electric animate-pulse flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search projects, services, tech stacks (e.g. 'FastAPI', 'FileCore', 'voice')..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-text-dim focus:outline-none font-sans"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 border-b border-white/5 bg-void/50 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider shrink-0 mr-1">
            Try:
          </span>
          {quickFilterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => {
                setQuery(pill);
                setSelectedIndex(0);
              }}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/5 hover:bg-cyan-electric/20 hover:text-cyan-electric border border-white/10 text-text-secondary transition-all shrink-0"
            >
              #{pill}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-3 flex flex-col gap-1.5 scrollbar-thin"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-text-secondary">
              <Box className="w-8 h-8 text-text-dim opacity-50" />
              <p className="text-xs">No results match &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-text-dim">Try searching for &quot;FileCore&quot;, &quot;Python&quot;, &quot;FastAPI&quot;, or &quot;calls&quot;</p>
            </div>
          ) : (
            results.map((entry, index) => {
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={entry.id}
                  onClick={() => handleSelectItem(entry)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group flex items-center justify-between gap-4 p-3 rounded-xl cursor-pointer transition-all ${isSelected
                    ? 'bg-cyan-electric/15 border border-cyan-electric/50 shadow-cyan-glow'
                    : 'hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Icon based on item type */}
                    <div className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center flex-shrink-0 bg-void p-1.5 text-cyan-electric">
                      {entry.type === 'service' ? (
                        <Layers className="w-4 h-4 text-pink-accent" />
                      ) : entry.type === 'project' ? (
                        <FileCode className="w-4 h-4 text-cyan-electric" />
                      ) : (
                        <Navigation className="w-4 h-4 text-amber-300" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-white truncate">
                          {entry.title}
                        </span>
                        <span
                          className={`font-mono text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${entry.type === 'project'
                            ? 'bg-cyan-electric/15 text-cyan-electric border border-cyan-electric/30'
                            : entry.type === 'service'
                              ? 'bg-pink-accent/15 text-pink-accent border border-pink-accent/30'
                              : 'bg-white/10 text-text-dim border border-white/10'
                            }`}
                        >
                          {entry.badge}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary truncate mt-0.5">
                        {entry.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="hidden sm:inline-block text-[10px] font-mono text-cyan-electric opacity-0 group-hover:opacity-100 transition-opacity">
                      {entry.type === 'service'
                        ? 'Rotate Face ➔'
                        : entry.type === 'project'
                          ? 'Inspect Proof ➔'
                          : 'Jump ➔'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-electric" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Guidance */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-cyan-electric/15 bg-void-deep/80 flex items-center justify-between text-[11px] font-mono text-text-dim">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↵</kbd> select
            </span>
          </div>
          <span className="hidden sm:inline text-cyan-electric">Nikneuron Omni Navigator</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
