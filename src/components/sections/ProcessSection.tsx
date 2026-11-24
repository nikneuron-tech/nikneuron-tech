import React from 'react';
import { SITE_CONFIG } from '../../config/site.config';
import { Clock, CheckCircle, ArrowRight, ArrowDown, UserCheck } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="relative z-20 py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-16">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric shadow-cyan-glow" />
          <span>Engineering Velocity // Methodology</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          How We Work: 4 Predictable Milestones
        </h2>
        <p className="text-sm text-text-secondary max-w-2xl">
          Zero opaque delays, no middleman bureaucracy. Clear deliverables, weekly sprint checkpoints, and full source code ownership.
        </p>
      </div>

      {/* Vertical Animated Timeline */}
      <div className="relative border-l border-cyan-electric/30 ml-4 sm:ml-8 pl-6 sm:pl-10 flex flex-col gap-12">
        {SITE_CONFIG.processSteps.map((step, idx) => (
          <div key={step.step} className="relative group">
            {/* Step Node Marker */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-1 w-6 h-6 rounded-full bg-void-deep border-2 border-cyan-electric flex items-center justify-center shadow-cyan-glow group-hover:scale-110 transition-transform">
              <span className="w-2 h-2 rounded-full bg-pink-accent shadow-pink-glow" />
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 rounded-2xl bg-void-surface/90 border border-cyan-electric/25 hover:border-cyan-electric/60 transition-all shadow-glass backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-cyan-electric">
                    STEP {step.step}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    {step.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-pink-accent px-3 py-1 rounded-full bg-pink-accent/10 border border-pink-accent/20 w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{step.duration}</span>
                </div>
              </div>

              <p className="text-xs font-mono text-cyan-electric/90 mb-2">
                {step.tagline}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed mb-5">
                {step.description}
              </p>

              {/* Deliverables list */}
              <div className="pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider block mb-2">
                  Concrete Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {step.deliverables.map((del, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-void-deep/80 border border-white/5 text-xs text-text-secondary flex items-start gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
                      <span className="leading-snug text-[11px]">{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Process Interlinking Transition */}
      <div className="mt-16 p-6 rounded-2xl bg-void-surface/75 border border-cyan-electric/25 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-electric/15 border border-cyan-electric/30 flex items-center justify-center text-cyan-electric shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-white">Ready to Kick Off Step 1?</h3>
            <p className="text-xs text-text-secondary">Start with a 15-minute discovery call to map out technical bottlenecks before writing any code.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-electric text-void hover:opacity-90 transition-all flex items-center gap-1.5 shadow-cyan-glow"
          >
            <span>Book Discovery Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#engagement"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            <span>Engagement Models</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
          <a
            href="#about"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-text-secondary hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>About Founder</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
