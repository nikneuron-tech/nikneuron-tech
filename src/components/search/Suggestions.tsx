import React from 'react';

export interface SearchResultItem {
  id?: string;
  name: string;
  desc: string;
  faceIndex: number;
  faceName: string;
}

interface SuggestionsProps {
  results: SearchResultItem[];
  query: string;
  onSelect: (item: SearchResultItem) => void;
  onSelectTag: (tag: string) => void;
}

export const Suggestions: React.FC<SuggestionsProps> = ({
  results,
  query,
  onSelect,
  onSelectTag,
}) => {
  if (!query) return null;

  if (results.length === 0) {
    const suggestedTags = ['toggle', 'voice', 'chart', 'navbar', 'color', 'toasts'];
    return (
      <div className="p-6 text-center">
        <h4 className="text-xs font-semibold text-white mb-1">No direct match for "{query}"</h4>
        <p className="text-[11px] text-text-secondary mb-3">Explore these foundational paradigms:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className="px-3 py-1 rounded-full text-xs text-cyan-electric bg-cyan-electric/10 border border-cyan-electric/25 hover:bg-cyan-electric/25 hover:text-white transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2 max-h-80 overflow-y-auto">
      {results.slice(0, 6).map((item, idx) => (
        <button
          key={`${item.faceName}-${item.name}-${idx}`}
          onClick={() => onSelect(item)}
          className="flex items-center justify-between p-3 rounded-xl text-left hover:bg-cyan-electric/15 hover:border hover:border-cyan-electric/30 transition-all group"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white group-hover:text-cyan-electric transition-colors">
              {item.name}
            </span>
            <span className="text-[11px] text-text-secondary line-clamp-1">
              {item.desc}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold text-cyan-electric bg-cyan-electric/10 border border-cyan-electric/25">
            {item.faceName}
          </span>
        </button>
      ))}
    </div>
  );
};
