import React, { useState } from 'react';
import { Copy, Check, Heart, Columns, Sparkles } from 'lucide-react';
import { ComponentItem } from '../../data/faces';
import { soundEngine } from '../ui/audio';
import { useAppStore } from '../../store/useAppStore';

interface ComponentCardProps {
  component: ComponentItem;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const [copied, setCopied] = useState(false);
  const {
    highlightedComponentId,
    favorites,
    toggleFavorite,
    compareList,
    toggleCompareItem,
  } = useAppStore();

  const isTarget = highlightedComponentId === component.id;
  const isFav = favorites.includes(component.id);
  const isCompared = compareList.includes(component.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(component.code);
    setCopied(true);
    soundEngine.playTone(880, 0.2);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = () => {
    soundEngine.playTone(isFav ? 400 : 700, 0.1);
    toggleFavorite(component.id);
  };

  const handleToggleCompare = () => {
    soundEngine.playTone(650, 0.1);
    toggleCompareItem(component.id);
  };

  const Demo = component.DemoComponent;

  return (
    <article
      id={`comp-${component.id}`}
      className={`glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between gap-4 relative transition-all duration-300 ${
        isTarget
          ? 'border-pink-accent shadow-pink-glow ring-2 ring-pink-accent animate-pulse scale-[1.01]'
          : ''
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* Top Header: Title, Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="font-display text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{component.name}</span>
              {isTarget && (
                <span className="text-[9px] font-mono font-bold text-pink-accent px-1.5 py-0.2 rounded-full bg-pink-accent/20 border border-pink-accent/40 flex items-center gap-0.5 animate-pulse">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>RECOMMENDED</span>
                </span>
              )}
            </h3>
            {component.popularity && (
              <span className="text-[10px] font-mono text-cyan-electric/80">
                Popularity: {component.popularity}%
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Favorite button */}
            <button
              onClick={handleToggleFavorite}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-full border transition-all ${
                isFav
                  ? 'bg-pink-accent/20 border-pink-accent text-pink-accent shadow-pink-glow'
                  : 'bg-white/5 border-white/10 text-text-dim hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-pink-accent' : ''}`} />
            </button>

            {/* Compare button */}
            <button
              onClick={handleToggleCompare}
              title={isCompared ? 'In comparison' : 'Compare with another item'}
              aria-label={isCompared ? 'In comparison' : 'Compare with another item'}
              className={`p-1.5 rounded-full border transition-all ${
                isCompared
                  ? 'bg-cyan-electric/20 border-cyan-electric text-cyan-electric shadow-cyan-glow'
                  : 'bg-white/5 border-white/10 text-text-dim hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              title="Copy component code snippet"
              aria-label="Copy code snippet"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-cyan-electric bg-cyan-electric/10 border border-cyan-electric/30 hover:bg-cyan-electric hover:text-void transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Description / Rule */}
        <p className="text-xs text-text-secondary font-light leading-relaxed">
          {component.description || component.rule}
        </p>

        {/* Tags */}
        {component.tags && component.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {component.tags.map((t) => (
              <span
                key={t}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-text-dim border border-white/5"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Real working interactive demo */}
      <div className="min-h-[110px] rounded-xl bg-void-deep/85 border border-cyan-electric/15 p-3 flex items-center justify-center relative overflow-hidden">
        <Demo />
      </div>
    </article>
  );
};
