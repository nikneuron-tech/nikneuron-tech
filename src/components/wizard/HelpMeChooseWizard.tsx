import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  PhoneCall,
  Mail,
  Palette,
  Cloud,
  Shield,
  BarChart3,
  Building2,
  Clock,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react';
import { scoreServicesRuleBased, WizardAnswers, RecommendationResult } from '../../services/recommendationService';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';

export const HelpMeChooseWizard: React.FC = () => {
  const { isWizardOpen, closeWizard, selectFaceItem, setViewMode, startInquiry } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<WizardAnswers>({
    problem: 'missed_calls',
    businessType: 'clinic_legal',
    urgency: 'immediate',
    freeText: '',
  });

  const [recommendations, setRecommendations] = useState<RecommendationResult[] | null>(null);

  if (!isWizardOpen) return null;

  const handleProblemSelect = (problem: string) => {
    soundEngine.playTone(600, 0.05);
    setAnswers((prev) => ({ ...prev, problem }));
    setStep(2);
  };

  const handleBusinessTypeSelect = (businessType: string) => {
    soundEngine.playTone(650, 0.05);
    setAnswers((prev) => ({ ...prev, businessType }));
    setStep(3);
  };

  const handleUrgencySelect = (urgency: string) => {
    soundEngine.playTone(700, 0.05);
    const updated = { ...answers, urgency };
    setAnswers(updated);
    runRecommendation(updated);
  };

  const handleFreeTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.freeText?.trim()) return;
    soundEngine.playTone(750, 0.08);
    runRecommendation(answers);
  };

  const runRecommendation = (finalAnswers: WizardAnswers) => {
    const results = scoreServicesRuleBased(finalAnswers);
    setRecommendations(results);
    soundEngine.playSnapHolo();
  };

  const handleApplyRecommendation = (rec: RecommendationResult) => {
    soundEngine.playSnapHolo();
    closeWizard();
    setViewMode('cube');
    selectFaceItem(rec.service.faceIndex, rec.service.id);
  };

  const handleReset = () => {
    soundEngine.playTone(500, 0.05);
    setStep(1);
    setRecommendations(null);
    setAnswers({
      problem: 'missed_calls',
      businessType: 'clinic_legal',
      urgency: 'immediate',
      freeText: '',
    });
  };

  const problems = [
    {
      id: 'missed_calls',
      title: 'Missed calls & lost customer bookings',
      subtitle: 'Need 24/7 AI receptionist in Hindi/Hinglish & calendar sync',
      icon: PhoneCall,
      color: '#4fd8ff',
    },
    {
      id: 'website_ecommerce',
      title: 'Need a high-converting website or store',
      subtitle: 'Business website, UPI/Razorpay e-commerce or booking portal',
      icon: Zap,
      color: '#4fd8ff',
    },
    {
      id: 'whatsapp_leads',
      title: 'Manual WhatsApp, IG & Messenger replies',
      subtitle: 'Need WhatsApp business bot, catalogs & lead qualification',
      icon: Sparkles,
      color: '#34d399',
    },
    {
      id: 'poor_ux',
      title: 'Outdated UI/UX or weak brand design',
      subtitle: 'Need mobile-first UI/UX, Figma prototypes & UX audits',
      icon: Palette,
      color: '#ff5aa5',
    },
    {
      id: 'deliverability_scale',
      title: 'Bulk email, WhatsApp & SMS outreach',
      subtitle: 'Need reusable templates, list cleaning & open/click analytics',
      icon: Mail,
      color: '#a78bfa',
    },
    {
      id: 'custom_ops',
      title: 'Outgrown spreadsheets & generic tools',
      subtitle: 'Need custom CRM/ERP, Flutter app or Tally/payment integration',
      icon: Cloud,
      color: '#fbbf24',
    },
    {
      id: 'manual_workflows',
      title: 'Repetitive admin, PDFs & manual workflows',
      subtitle: 'Need n8n/Zapier/Make automation, invoice OCR & company AI bots',
      icon: BarChart3,
      color: '#60a5fa',
    },
    {
      id: 'ongoing_support',
      title: 'Need maintenance, reviews & KPI reporting',
      subtitle: 'Ongoing tech support, Google review automation & team training',
      icon: Shield,
      color: '#34d399',
    },
  ];

  const businessTypes = [
    {
      id: 'clinic_legal',
      title: 'Clinic / Medical / Legal Practice',
      desc: 'High phone intake volume, strict appointment scheduling & compliance',
    },
    {
      id: 'ecommerce_b2c',
      title: 'E-Commerce / Direct-to-Consumer',
      desc: 'High transaction frequency, retention email marketing & responsive web UI',
    },
    {
      id: 'saas_fintech',
      title: 'B2B SaaS / Fintech / Tech Startup',
      desc: 'Demands cutting-edge spatial UX, enterprise security & continuous deployment',
    },
    {
      id: 'enterprise_corp',
      title: 'Enterprise / Multi-Team Organization',
      desc: 'Multi-cloud architecture, complex data warehouses & strict compliance',
    },
  ];

  const urgencies = [
    {
      id: 'immediate',
      title: 'Immediate (Within 48 Hours)',
      desc: 'Ready-to-deploy turnkey capabilities with rapid onboarding',
    },
    {
      id: 'sprint',
      title: 'Sprint Kickoff (2–4 Weeks)',
      desc: 'Tailored architecture sprint with dedicated engineering team',
    },
    {
      id: 'roadmap',
      title: 'Strategic Planning (Next Quarter)',
      desc: 'Comprehensive multi-phase roadmap and infrastructure assessment',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-deep/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => closeWizard()}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-void-surface/95 border border-cyan-electric/40 shadow-glass overflow-hidden flex flex-col p-6 md:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-cyan-electric/15">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-accent animate-ping shadow-pink-glow" />
              <span className="font-mono text-xs uppercase tracking-widest text-pink-accent font-bold flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                <span>Nikneuron Decision Wizard</span>
              </span>
            </div>
            <h2 id="wizard-modal-title" className="font-display text-xl md:text-2xl font-extrabold text-white">
              {recommendations ? 'Top Ranked Service Matches' : 'What Do You Need?'}
            </h2>
          </div>

          <button
            onClick={() => closeWizard()}
            aria-label="Close decision wizard"
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-electric"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Content Body */}
        <div className="py-6 flex flex-col gap-6">
          {!recommendations ? (
            <>
              {/* Stepper Progress */}
              <div className="flex items-center justify-between gap-2 px-1">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex flex-col gap-1">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s <= step
                          ? 'bg-gradient-to-r from-cyan-electric to-pink-accent shadow-cyan-glow'
                          : 'bg-white/10'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-text-dim text-center">
                      Step 0{s}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Problem */}
              {step === 1 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-display text-base font-bold text-white">
                      1. What primary challenge are you solving?
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Select the bottleneck that needs the fastest turnaround.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto pr-1">
                    {problems.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleProblemSelect(p.id)}
                          className="flex items-start gap-3 p-3 rounded-xl border border-white/10 hover:border-cyan-electric/50 bg-white/5 hover:bg-cyan-electric/10 transition-all text-left group"
                        >
                          <div
                            className="p-2 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: `${p.color}20`, color: p.color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-display text-xs font-bold text-white group-hover:text-cyan-electric transition-colors">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-text-dim leading-snug">
                              {p.subtitle}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Business Type */}
              {step === 2 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-display text-base font-bold text-white">
                      2. What describes your organization best?
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Helps match our compliance and integration profiles.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {businessTypes.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleBusinessTypeSelect(b.id)}
                        className="flex flex-col gap-1 p-3.5 rounded-xl border border-white/10 hover:border-pink-accent/50 bg-white/5 hover:bg-pink-accent/10 transition-all text-left group"
                      >
                        <span className="font-display text-xs font-bold text-white group-hover:text-pink-accent transition-colors flex items-center justify-between">
                          <span>{b.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-text-dim group-hover:text-pink-accent" />
                        </span>
                        <span className="text-[11px] text-text-dim leading-snug">
                          {b.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Urgency & Free Text */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-display text-base font-bold text-white">
                      3. What is your implementation timeline?
                    </h3>
                    <p className="text-xs text-text-secondary">
                      We match delivery velocity with your roadmap.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {urgencies.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleUrgencySelect(u.id)}
                        className="flex flex-col gap-1 p-3 rounded-xl border border-white/10 hover:border-cyan-electric/50 bg-white/5 hover:bg-cyan-electric/10 transition-all text-left group"
                      >
                        <span className="font-display text-xs font-bold text-white group-hover:text-cyan-electric transition-colors flex items-center justify-between">
                          <span>{u.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-text-dim group-hover:text-cyan-electric" />
                        </span>
                        <span className="text-[10px] text-text-dim leading-snug">
                          {u.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Free-text option */}
                  <form onSubmit={handleFreeTextSubmit} className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <label className="text-[11px] font-mono text-cyan-electric font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-electric" />
                      <span>Or describe your specific requirement in plain text:</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={answers.freeText || ''}
                        onChange={(e) => setAnswers({ ...answers, freeText: e.target.value })}
                        placeholder="e.g., We need an AI to answer clinic calls and sync appointments..."
                        className="flex-1 px-3 py-2 rounded-xl bg-void-deep border border-cyan-electric/30 text-xs text-white placeholder-text-dim outline-none focus:border-cyan-electric transition-colors"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-void bg-cyan-electric hover:opacity-90 shadow-cyan-glow transition-all whitespace-nowrap"
                      >
                        Analyze
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            /* Recommendations Screen */
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  Based on your requirements, here are your top 3 matches:
                </span>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-electric hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Start over</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {recommendations.map((rec, index) => {
                  const service = rec.service;

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleApplyRecommendation(rec)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 group ${
                        index === 0
                          ? 'bg-cyan-electric/10 border-cyan-electric shadow-cyan-glow'
                          : 'bg-white/5 border-white/10 hover:border-cyan-electric/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 bg-void flex items-center justify-center p-1"
                            style={{ borderColor: service.accentColor }}
                          >
                            <img
                              src={service.thumbnailPath}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-sm font-extrabold text-white group-hover:text-cyan-electric transition-colors">
                                {service.title}
                              </span>
                              <span
                                className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-bold"
                                style={{
                                  backgroundColor: `${service.accentColor}25`,
                                  color: service.accentColor,
                                }}
                              >
                                Face {service.faceIndex + 1}
                              </span>
                            </div>
                            <span className="text-xs text-text-secondary">
                              {service.tagline}
                            </span>
                          </div>
                        </div>

                        {/* Match score */}
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span
                            className="font-mono text-xs font-black px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${service.accentColor}25`,
                              color: service.accentColor,
                              border: `1px solid ${service.accentColor}50`,
                            }}
                          >
                            {rec.score}% MATCH
                          </span>
                        </div>
                      </div>

                      {/* Match rationale */}
                      <p className="text-[11px] text-text-dim flex items-center gap-1.5 pt-1 border-t border-white/5">
                        <Zap className="w-3 h-3 text-cyan-electric flex-shrink-0" />
                        <span>{rec.matchReason}</span>
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex gap-1">
                          {service.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-text-dim"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-cyan-electric flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Rotate & Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {recommendations[0] && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone(720, 0.12);
                    const top = recommendations[0].service;
                    startInquiry({
                      serviceType: top.id,
                      brief: `Wizard Recommendation (${recommendations[0].score}% match): ${top.title}. Context: ${answers.problem}, business type: ${answers.businessType}, timeline: ${answers.urgency}.`,
                    });
                  }}
                  className="w-full py-3 px-4 rounded-xl text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-electric to-pink-accent text-void hover:opacity-90 shadow-cyan-glow transition-all flex items-center justify-center gap-2"
                >
                  <span>Request Proposal for {recommendations[0].service.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
