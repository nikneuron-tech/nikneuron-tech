import React, { useEffect } from 'react';
import { X, Download, Printer, Mail, CheckCircle2, Code2, Cpu, Layers, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SITE_CONFIG } from '../../config/site.config';
import { ALL_SERVICES_CONFIG } from '../../config/services.config';
import { soundEngine } from '../ui/audio';

export const ResumeModal: React.FC = () => {
  const { isResumeOpen, closeResume, startInquiry } = useAppStore();

  useEffect(() => {
    if (!isResumeOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeResume();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResumeOpen, closeResume]);

  if (!isResumeOpen) return null;

  const handleDownloadMarkdown = () => {
    soundEngine.playTone(750, 0.1);
    const mdContent = [
      `# ${SITE_CONFIG.founder.name}`,
      `**${SITE_CONFIG.founder.role}** — ${SITE_CONFIG.brandName}`,
      `Email: ${SITE_CONFIG.contact.email} | WhatsApp: ${SITE_CONFIG.contact.phone}`,
      '',
      `> "${SITE_CONFIG.founder.motto}"`,
      '',
      '## Profile',
      ...SITE_CONFIG.founder.story,
      '',
      '## Core Technical Stack',
      '- **Frontend & Spatial 3D:** React 18/19, TypeScript, Three.js, React Three Fiber, GLSL Shaders, Tailwind CSS, Framer Motion',
      '- **Backend & AI Pipelines:** Python, FastAPI, Multi-Agent LLMs (Groq, Gemini API), Socket.io, WebSockets',
      '- **Data & Infrastructure:** PostgreSQL, Supabase (Vector Search), Docker, CI/CD, Linux',
      '- **Computer Vision & Edge:** OpenCV, YOLOv8, pyttsx3, Web Crypto API, Web Audio API',
      '',
      '## Core Services & Capabilities',
      ...ALL_SERVICES_CONFIG.map(
        (s) =>
          `### ${s.title}\n${s.tagline}\n${s.benefits.slice(0, 3).map((b) => `  - ${b}`).join('\n')}`
      ),
    ].join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Aditya_Tamta_Nikneuron_CV.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    soundEngine.playTone(650, 0.08);
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Founder Engineering Resume"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-void-deep/85 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={closeResume}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-void-surface/95 border border-cyan-electric/40 shadow-2xl backdrop-blur-2xl p-6 sm:p-10 flex flex-col gap-6 text-white"
      >
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-electric animate-pulse" />
            <span>Curriculum Vitae // Engineering Dossier</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-electric/15 border border-cyan-electric/40 text-cyan-electric hover:bg-cyan-electric hover:text-void transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/15 text-white hover:border-cyan-electric transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={closeResume}
              aria-label="Close resume modal"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-pink-accent hover:text-pink-accent transition-all text-text-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-void-deep/90 border border-cyan-electric/25">
          <div className="flex items-center gap-4">
            <img
              src="/logo-hd.png"
              alt="Nikneuron Emblem"
              className="w-16 h-16 rounded-2xl border border-cyan-electric/40 shadow-cyan-glow shrink-0 object-cover"
            />
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                {SITE_CONFIG.founder.name}
              </h2>
              <p className="text-xs font-mono text-cyan-electric mt-0.5">
                {SITE_CONFIG.founder.role} · {SITE_CONFIG.brandName}
              </p>
              <p className="text-[11px] text-text-dim mt-1">
                {SITE_CONFIG.contact.email} · WhatsApp {SITE_CONFIG.contact.phone}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playTone(700, 0.1);
              closeResume();
              startInquiry({
                serviceType: 'ui-ux-design',
                brief: 'Hi Aditya, I reviewed your engineering CV and would like to discuss a project.',
              });
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-electric text-void hover:opacity-90 shadow-cyan-glow transition-all shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Hire / Collaborate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Summary & Philosophy */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Executive Engineering Summary
          </h3>
          <div className="p-4 rounded-2xl bg-void-deep/75 border border-white/10 flex flex-col gap-2 text-xs text-text-secondary leading-relaxed">
            {SITE_CONFIG.founder.story.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Technical Stack Matrix */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Technical Stack & Capabilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-void-deep/80 border border-white/10">
              <span className="font-mono text-[10px] uppercase text-pink-accent block mb-1.5">
                Spatial Web & Frontend
              </span>
              <p className="text-text-secondary">
                React 18/19, TypeScript, Three.js, React Three Fiber, Custom GLSL Shaders, Tailwind CSS, Framer Motion, Zustand, Radix UI
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-void-deep/80 border border-white/10">
              <span className="font-mono text-[10px] uppercase text-cyan-electric block mb-1.5">
                AI Agents & Backend Systems
              </span>
              <p className="text-text-secondary">
                Python, FastAPI, Multi-Agent LLM Pipelines (Groq, Gemini API), Socket.io, REST/WebSocket APIs, PostgreSQL, Supabase Vector Search
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-void-deep/80 border border-white/10">
              <span className="font-mono text-[10px] uppercase text-emerald-300 block mb-1.5">
                Computer Vision & Client Security
              </span>
              <p className="text-text-secondary">
                OpenCV, YOLOv8, Real-Time CCTV Stream Alerting, Browser Web Crypto API, pdf-lib, Zero-Server Client Memory Pipelines
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-void-deep/80 border border-white/10">
              <span className="font-mono text-[10px] uppercase text-amber-300 block mb-1.5">
                DevOps & Architecture
              </span>
              <p className="text-text-secondary">
                Docker, CI/CD Workflows, GitHub Actions, Cloud Deployments (Vercel / AWS / GCP), Accessibility (WCAG AA), Lighthouse Optimization
              </p>
            </div>
          </div>
        </div>

        {/* Core Services */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-bold flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" />
            Core Engineering Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ALL_SERVICES_CONFIG.map((service) => (
              <div
                key={service.id}
                className="p-4 rounded-xl bg-void-deep/85 border border-white/10 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-white">
                    {service.title}
                  </span>
                  <span
                    className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      color: service.accentColor,
                      borderColor: `${service.accentColor}50`,
                      backgroundColor: `${service.accentColor}15`,
                    }}
                  >
                    Face 0{service.faceIndex + 1}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary leading-snug">
                  {service.tagline}
                </p>
                <ul className="flex flex-col gap-1 text-[10px] text-text-dim mt-1">
                  {service.benefits.slice(0, 2).map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-cyan-electric shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;

