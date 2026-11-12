import React from 'react';
import {
  ALL_SERVICES_CONFIG,
  BUNDLE_PACKAGES,
  ServiceConfig,
} from '../../config/services.config';
import { ArrowRight, CheckCircle, Calendar, Package, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';
import { GradientSkewCard } from '../ui/gradient-card-showcase';

const SERVICE_SECONDARY_COLOR: Record<string, string> = {
  'ui-ux-design': '#4fd8ff',
  'web-development': '#a78bfa',
  'ai-receptionist': '#ff5aa5',
  'whatsapp-chat-automation': '#4fd8ff',
  'batch-mail': '#ff0058',
  'custom-software': '#ff5aa5',
  'ai-automation': '#a78bfa',
  'support-growth': '#00d0ff',
};

export const ServicesSection: React.FC = () => {
  const { selectFaceItem, rotateToFace, startInquiry } = useAppStore();

  const handleInspectService = (service: ServiceConfig) => {
    soundEngine.playSnapHolo();
    rotateToFace(service.faceIndex);
    selectFaceItem(service.faceIndex, service.id);
  };

  return (
    <section id="services" className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 sm:mb-14">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-cyan-electric uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric shadow-cyan-glow" />
          <span>Nikneuron Services // 8 Core Verticals</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Solutions Built for Production
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
          From UI/UX design and websites to AI receptionists, WhatsApp automation, and custom software — each service links directly to the 3D Living Tesseract.
        </p>
      </div>

      {/* Grid of 8 Services with Skewed Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 sm:gap-8">
        {ALL_SERVICES_CONFIG.map((service, index) => {
          const secondaryColor = SERVICE_SECONDARY_COLOR[service.id] || '#4fd8ff';
          const serviceNum = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

          return (
            <GradientSkewCard
              key={service.id}
              gradientFrom={service.accentColor}
              gradientTo={secondaryColor}
              contentClassName="p-5 sm:p-6"
            >
              <div>
                {/* Service number & linked cube face indicator */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-white/90">
                      {serviceNum}
                    </span>
                    <span className="text-[10px] font-mono text-text-dim">
                      // FACE 0{service.faceIndex + 1}
                    </span>
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: service.accentColor,
                      boxShadow: `0 0 8px ${service.accentColor}`,
                    }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-display text-base sm:text-lg font-bold transition-colors mb-2 leading-snug"
                  style={{ color: service.accentColor }}
                >
                  {service.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {service.tagline}
                </p>

                {/* Full Capabilities List */}
                <ul className="flex flex-col gap-2 mb-5 text-xs text-text-secondary">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
                      <span className="leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {service.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-text-dim border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => handleInspectService(service)}
                  className="flex-1 min-h-[40px] py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-white text-void hover:bg-[#ffcf4d] transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Inspect 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone(650, 0.1);
                    startInquiry({
                      serviceType: service.id,
                      brief: `Interested in ${service.title} (${service.tagline}).`,
                    });
                  }}
                  title={`Inquire about ${service.title}`}
                  className="min-h-[40px] py-2 px-3 rounded-xl text-xs font-bold bg-cyan-electric/15 border border-cyan-electric/45 text-cyan-electric hover:bg-cyan-electric hover:text-void transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Inquire</span>
                </button>
              </div>
            </GradientSkewCard>
          );
        })}
      </div>

      {/* Bundle Packages Subsection */}
      <div id="bundles" className="mt-16 sm:mt-20 pt-12 border-t border-white/10">
        <div className="flex flex-col gap-2 mb-8 sm:mb-10">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-pink-accent uppercase tracking-widest">
            <Package className="w-3.5 h-3.5 text-pink-accent" />
            <span>Bundle Packages // Turnkey Combinations</span>
          </div>
          <h3 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-white">
            Ready-to-Launch Service Bundles
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
            Combine our most requested capabilities into streamlined packages designed for fast deployment and measurable ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-10">
          {BUNDLE_PACKAGES.map((bundle) => (
            <GradientSkewCard
              key={bundle.id}
              gradientFrom={bundle.gradientFrom}
              gradientTo={bundle.gradientTo}
              highlighted={bundle.highlighted}
              contentClassName="p-6 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-text-dim">
                    <Layers className="w-3.5 h-3.5 text-cyan-electric" />
                    <span>Package</span>
                  </span>
                  {bundle.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        bundle.highlighted
                          ? 'bg-cyan-electric/20 border-cyan-electric text-cyan-electric'
                          : 'bg-pink-accent/20 border-pink-accent text-pink-accent'
                      }`}
                    >
                      {bundle.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-display text-xl font-bold text-white mb-2">
                  {bundle.name}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed mb-5">
                  {bundle.tagline}
                </p>

                <div className="p-3.5 rounded-xl bg-void/80 border border-white/10 mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-electric block mb-2.5">
                    Included Stack
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-white">
                    {bundle.included.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-electric shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(680, 0.1);
                  startInquiry({
                    serviceType: bundle.id,
                    brief: `Interested in the ${bundle.name} Bundle (${bundle.included.join(' + ')}).`,
                  });
                }}
                className={`w-full min-h-[42px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  bundle.highlighted
                    ? 'bg-cyan-electric text-void hover:opacity-90 shadow-cyan-glow'
                    : 'bg-white text-void hover:bg-[#ffcf4d] shadow-md'
                }`}
              >
                <span>{bundle.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </GradientSkewCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
