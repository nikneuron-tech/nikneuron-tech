import React from 'react';
import { SITE_CONFIG } from '../../config/site.config';
import { FileText, ArrowUpRight } from 'lucide-react';
import { soundEngine } from '../ui/audio';
import { useAppStore } from '../../store/useAppStore';

export const AboutSection: React.FC = () => {
  const { openResume } = useAppStore();

  return (
    <section id="about" className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8 sm:mb-12">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric shadow-cyan-glow" />
          <span>About the Engineer // Full Ownership</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Who Is Behind Nikneuron
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
          Direct 1-on-1 collaboration. When you hire Nikneuron, you work directly with the founder and architect.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-5 sm:p-10 lg:p-12 rounded-3xl bg-void-surface/90 border border-cyan-electric/30 shadow-glass backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left: Founder / Brand Emblem */}
        <div className="lg:col-span-4 flex flex-col items-center text-center">
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full p-1 bg-gradient-to-tr from-cyan-electric via-pink-accent to-cyan-electric shadow-cyan-glow mb-4">
            <img
              src="/logo-hd.png"
              alt="Nikneuron HD Logo"
              className="w-full h-full rounded-full object-cover bg-void-deep border border-white/10"
            />
          </div>
          <span className="font-display text-sm font-bold text-white tracking-wider">
            {SITE_CONFIG.founder.name}
          </span>
          <span className="text-[11px] font-mono text-cyan-electric/80 mt-0.5 mb-3">
            Founder & Architect
          </span>

          <button
            type="button"
            onClick={() => {
              soundEngine.playTone(650, 0.1);
              openResume();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-cyan-electric bg-cyan-electric/10 border border-cyan-electric/40 hover:bg-cyan-electric hover:text-void transition-all shadow-cyan-glow"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Full Resume</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Narrative Story & Motto */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Motto quote */}
          <div className="p-4 sm:p-5 rounded-2xl bg-void-deep/90 border border-pink-accent/30 shadow-pink-glow/20">
            <span className="text-[10px] font-mono text-pink-accent uppercase tracking-widest block mb-1">
              Guiding Principle
            </span>
            <blockquote className="font-display text-base sm:text-xl font-bold text-white tracking-wide">
              "{SITE_CONFIG.founder.motto}"
            </blockquote>
          </div>

          {/* Narrative Paragraphs */}
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
            {SITE_CONFIG.founder.story.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Competency tags */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 text-xs font-mono text-text-secondary">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-electric">
              Three.js & WebGL
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pink-accent">
              Multi-Agent AI (FastAPI / Groq)
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">
              Full-Stack TypeScript & Python
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300">
              Edge Computer Vision
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
