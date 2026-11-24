import React from 'react';
import { X, Check, ArrowRight, Trash2, Calendar, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { SERVICES_CONFIG, ServiceConfig, getServiceById } from '../../config/services.config';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';

export const CompareModal: React.FC = () => {
  const {
    isCompareOpen,
    closeCompare,
    compareList,
    toggleCompareItem,
    clearCompare,
    selectFaceItem,
    setViewMode,
    startInquiry,
  } = useAppStore();

  if (!isCompareOpen || compareList.length === 0) return null;

  const selectedServices = compareList
    .map((id) => getServiceById(id))
    .filter(Boolean) as ServiceConfig[];

  const handleInspectIn3D = (service: ServiceConfig) => {
    soundEngine.playSnapHolo();
    closeCompare();
    setViewMode('cube');
    selectFaceItem(service.faceIndex, service.id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-deep/85 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={() => closeCompare()}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-void-surface/95 border border-cyan-electric/40 shadow-glass flex flex-col p-6 md:p-8 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-cyan-electric/15">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-electric font-bold">
              Nikneuron Shortlist // Side-by-Side Comparison
            </span>
            <h2 id="compare-modal-title" className="font-display text-xl md:text-2xl font-extrabold text-white">
              Comparing {selectedServices.length} Selected Services
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              title="Clear all compared items"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-text-secondary hover:text-pink-accent hover:bg-pink-accent/10 border border-white/10 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={() => closeCompare()}
              aria-label="Close compare view"
              className="p-1.5 rounded-full bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-electric"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedServices.map((service) => {
              return (
                <div
                  key={service.id}
                  className="glass-panel rounded-2xl p-5 flex flex-col justify-between gap-5 border border-cyan-electric/25 bg-void-deep/80"
                  style={{
                    boxShadow: `0 8px 32px -8px ${service.colorGlow}`,
                  }}
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Row: Thumbnail + Face Badge + Remove */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-void p-1 flex items-center justify-center"
                          style={{ borderColor: service.accentColor }}
                        >
                          <img
                            src={service.thumbnailPath}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span
                          className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-white/10"
                          style={{ color: service.accentColor }}
                        >
                          Face {service.faceIndex + 1}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleCompareItem(service.id)}
                        className="text-text-dim hover:text-pink-accent transition-colors text-xs font-mono"
                        title="Remove from comparison"
                      >
                        ✕ Remove
                      </button>
                    </div>

                    {/* Title & Tagline */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-base font-bold text-white tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {service.tagline}
                      </p>
                    </div>

                    {/* Key Benefits */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono text-cyan-electric uppercase tracking-wider font-bold">
                        Key Capabilities:
                      </span>
                      <ul className="flex flex-col gap-1.5">
                        {service.benefits.slice(0, 3).map((benefit, idx) => (
                          <li
                            key={idx}
                            className="text-[11px] text-text-secondary flex items-start gap-2"
                          >
                            <Check
                              className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                              style={{ color: service.accentColor }}
                            />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ideal Use Cases */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono text-pink-accent uppercase tracking-wider font-bold">
                        Top Use Case:
                      </span>
                      <p className="text-[11px] text-text-dim leading-snug">
                        {service.useCases[0]}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Rotate & CTA */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleInspectIn3D(service)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-bold text-void bg-cyan-electric hover:bg-cyan-electric/90 shadow-cyan-glow transition-all"
                    >
                      <span>Rotate Cube to Face</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTone(650, 0.1);
                        startInquiry({
                          serviceType: service.id,
                          brief: `Inquiring about ${service.title} (${service.tagline}).`,
                        });
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-electric transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5 text-cyan-electric" />
                      <span>{service.ctaLabel}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
