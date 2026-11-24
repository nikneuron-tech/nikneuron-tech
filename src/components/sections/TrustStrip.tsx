import React from 'react';
import { SITE_CONFIG } from '../../config/site.config';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section id="trust" className="relative z-20 py-8 px-4 sm:px-8 border-y border-cyan-electric/25 bg-void-surface/90 backdrop-blur-2xl shadow-glass">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Banner Tag */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-4 shrink-0">
          <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-electric uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-cyan-electric animate-pulse shadow-cyan-glow" />
            <ShieldCheck className="w-4 h-4 text-cyan-electric" />
            <span className="font-bold">Verifiable Competencies</span>
          </div>

          <a
            href="#projects"
            className="lg:hidden flex items-center gap-1 text-[11px] font-mono text-cyan-electric hover:underline"
          >
            <span>Projects</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto flex-1 lg:max-w-4xl lg:ml-6">
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

        {/* Desktop link to Case Studies */}
        <a
          href="#projects"
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-void bg-cyan-electric hover:opacity-90 transition-all shadow-cyan-glow shrink-0"
        >
          <span>See Projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};

export default TrustStrip;
