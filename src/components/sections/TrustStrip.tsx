import React from 'react';
import { SITE_CONFIG } from '../../config/site.config';
import { ShieldCheck } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section id="trust" className="relative z-20 py-8 px-4 sm:px-8 border-y border-cyan-electric/25 bg-void-surface/90 backdrop-blur-2xl shadow-glass">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Banner Tag */}
        <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-electric uppercase tracking-wider shrink-0">
          <div className="w-2 h-2 rounded-full bg-cyan-electric animate-pulse shadow-cyan-glow" />
          <ShieldCheck className="w-4 h-4 text-cyan-electric" />
          <span className="font-bold">Verifiable Competencies</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full md:w-auto flex-1 md:max-w-4xl md:ml-8">
          {SITE_CONFIG.trustStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col text-left border-l border-cyan-electric/20 pl-3 sm:pl-4 group hover:border-cyan-electric transition-colors"
            >
              <span className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-electric transition-colors">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-cyan-electric tracking-wide mt-0.5">
                {stat.label}
              </span>
              <span className="text-[11px] text-text-dim leading-tight mt-1 line-clamp-1 sm:line-clamp-none">
                {stat.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
