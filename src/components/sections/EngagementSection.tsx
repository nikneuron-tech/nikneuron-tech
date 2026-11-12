import React from 'react';
import { SITE_CONFIG } from '../../config/site.config';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { soundEngine } from '../ui/audio';
import { useAppStore } from '../../store/useAppStore';
import { GradientSkewCard } from '../ui/gradient-card-showcase';

const ENGAGEMENT_GRADIENTS: Record<string, { from: string; to: string }> = {
  pilot: { from: '#34d399', to: '#4fd8ff' },
  'fixed-project': { from: '#03a9f4', to: '#ff0058' },
  retainer: { from: '#ffbc00', to: '#ff0058' },
};

export const EngagementSection: React.FC = () => {
  const { startInquiry } = useAppStore();

  const handleSelectOption = (optId: string, optTitle: string) => {
    soundEngine.playTone(600, 0.1);
    startInquiry({
      serviceType: optId,
      brief: `Interested in the "${optTitle}" engagement model. Here is a quick overview of what we want to build:`,
    });
  };

  return (
    <section id="engagement" className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 sm:mb-14">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric shadow-cyan-glow" />
          <span>Collaboration Frameworks // No Hidden Costs</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Transparent Engagement Options
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
          Choose the partnership model that best fits your technical velocity and stage.
        </p>
      </div>

      {/* Grid of 3 Skewed Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-10 lg:gap-12">
        {SITE_CONFIG.engagementOptions.map((opt) => {
          const palette = ENGAGEMENT_GRADIENTS[opt.id] || { from: '#4fd8ff', to: '#ff5aa5' };
          return (
            <GradientSkewCard
              key={opt.id}
              gradientFrom={palette.from}
              gradientTo={palette.to}
              highlighted={opt.id === 'fixed-project'}
              contentClassName="p-6 sm:p-8"
            >
              <div>
                {/* Badge */}
                {opt.badge && (
                  <div className="mb-4">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        opt.id === 'fixed-project'
                          ? 'bg-cyan-electric/20 border-cyan-electric text-cyan-electric'
                          : opt.id === 'pilot'
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-pink-accent/20 border-pink-accent text-pink-accent'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                )}

                <h3 className="font-display text-xl font-bold text-white mb-2">
                  {opt.title}
                </h3>
                <p className="text-xs font-mono text-cyan-electric/90 mb-3">
                  {opt.tagline}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed mb-6">
                  {opt.description}
                </p>

                {/* Ideal For */}
                <div className="p-3 rounded-xl bg-void/80 border border-white/10 mb-6 text-xs text-text-dim">
                  <span className="text-cyan-electric font-semibold block mb-0.5">Best suited for:</span>
                  {opt.idealFor}
                </div>

                {/* Deliverables */}
                <ul className="flex flex-col gap-2 mb-8 text-xs text-text-secondary">
                  {opt.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectOption(opt.id, opt.title)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  opt.id === 'fixed-project'
                    ? 'bg-cyan-electric text-void hover:opacity-90 shadow-cyan-glow'
                    : 'bg-white text-void hover:bg-[#ffcf4d] shadow-md'
                }`}
              >
                <span>{opt.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </GradientSkewCard>
          );
        })}
      </div>
    </section>
  );
};

export default EngagementSection;
