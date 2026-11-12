import React from 'react';
import { PROJECTS_CONFIG } from '../../config/projects.config';
import { ExternalLink, Github, CheckCircle2, Info } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';
import { GradientSkewCard } from '../ui/gradient-card-showcase';

const PROJECT_GRADIENTS = [
  { from: '#ffbc00', to: '#ff0058' },
  { from: '#03a9f4', to: '#ff0058' },
  { from: '#4dff03', to: '#00d0ff' },
  { from: '#a78bfa', to: '#ff5aa5' },
  { from: '#34d399', to: '#0a3cff' },
  { from: '#4fd8ff', to: '#ff5aa5' },
];

export const ProjectsSection: React.FC = () => {
  const { setSelectedProjectId } = useAppStore();

  return (
    <section id="projects" className="relative z-20 py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col gap-2 mb-14">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-accent shadow-pink-glow" />
          <span>Proof of Work // Built, Not Promised</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Real Systems in Production & Research
        </h2>
        <p className="text-sm text-text-secondary max-w-2xl">
          Every capability we advertise is backed by tangible software — ranging from multi-agent AI verification pipelines to edge computer vision security scripts.
        </p>
      </div>

      {/* Projects Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
        {PROJECTS_CONFIG.map((project, idx) => {
          const palette = PROJECT_GRADIENTS[idx % PROJECT_GRADIENTS.length];
          return (
            <GradientSkewCard
              key={project.id}
              gradientFrom={palette.from}
              gradientTo={palette.to}
            >
              <article className="flex flex-col justify-between h-full">
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        project.status === 'live'
                          ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                          : project.status === 'prototype'
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                          : 'bg-amber-500/15 border-amber-400 text-amber-300'
                      }`}
                    >
                      ● {project.status}
                    </span>

                    <span className="text-[11px] font-mono text-text-dim">
                      {project.stack[0]}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-electric transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    {project.tagline}
                  </p>

                  {/* Problem & Solution */}
                  <div className="p-3 rounded-xl bg-void/80 border border-white/10 mb-4 text-xs text-text-dim leading-snug">
                    <span className="text-cyan-electric font-semibold block mb-1">What was built:</span>
                    {project.solution}
                  </div>

                  {/* Concrete Highlights */}
                  <ul className="flex flex-col gap-1.5 mb-5 text-[11px] text-text-secondary">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-electric shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-text-secondary border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    {project.links.demo &&
                      (project.links.demo.startsWith('#') ? (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playTone(600, 0.08);
                            const target = document.querySelector(project.links.demo!);
                            target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="flex items-center gap-1 text-cyan-electric hover:text-white transition-colors"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => soundEngine.playTone(600, 0.08)}
                          className="flex items-center gap-1 text-cyan-electric hover:text-white transition-colors"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => soundEngine.playTone(550, 0.08)}
                        className="flex items-center gap-1 text-text-secondary hover:text-white transition-colors"
                      >
                        <Github className="w-3 h-3" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTone(650, 0.1);
                      setSelectedProjectId(project.id);
                    }}
                    className="flex items-center gap-1 text-[11px] font-mono font-bold text-void bg-white hover:bg-[#ffcf4d] px-3 py-1.5 rounded-lg transition-all shadow-sm"
                  >
                    <Info className="w-3 h-3" />
                    <span>Architecture</span>
                  </button>
                </div>
              </article>
            </GradientSkewCard>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection;
