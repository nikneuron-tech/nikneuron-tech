import React, { useEffect, useState } from 'react';
import {
  X,
  ExternalLink,
  Github,
  Terminal,
  CheckCircle2,
  Layers,
  Cpu,
  Play,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getProjectById } from '../../config/projects.config';
import { getServiceById } from '../../config/services.config';
import { soundEngine } from '../ui/audio';

export const ProjectDetailModal: React.FC = () => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    rotateToFace,
    setActiveFace,
    startInquiry,
  } = useAppStore();

  const project = selectedProjectId ? getProjectById(selectedProjectId) : null;
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (!project) return;
    setVisibleLines(project.terminalPreview.length);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProjectId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, setSelectedProjectId]);

  if (!project) return null;

  const handleClose = () => {
    soundEngine.playTone(500, 0.08);
    setSelectedProjectId(null);
  };

  const handleJumpToService = (serviceId: string) => {
    const svc = getServiceById(serviceId);
    if (svc) {
      soundEngine.playSnapHolo();
      setSelectedProjectId(null);
      rotateToFace(svc.faceIndex);
      setActiveFace(svc.faceIndex);
    }
  };

  const handleReplayTerminal = () => {
    soundEngine.playTone(700, 0.1);
    setVisibleLines(0);
    project.terminalPreview.forEach((_, idx) => {
      setTimeout(() => {
        soundEngine.playTone(520 + idx * 60, 0.04);
        setVisibleLines(idx + 1);
      }, (idx + 1) * 280);
    });
  };

  const handleLaunchDemo = () => {
    if (!project.links.demo) return;
    soundEngine.playSnapHolo();
    if (project.links.demo.startsWith('#')) {
      const targetId = project.links.demo;
      setSelectedProjectId(null);
      setTimeout(() => {
        const el = document.querySelector(targetId);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
    } else {
      window.open(project.links.demo, '_blank', 'noreferrer');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Project Details`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-void-deep/80 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-void-surface/95 border border-cyan-electric/40 shadow-2xl backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-6 text-white"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 hover:border-pink-accent hover:text-pink-accent transition-all text-text-secondary"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-2 pr-8">
          <div className="flex items-center gap-3">
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
            <span className="text-xs font-mono text-cyan-electric">
              Proof of Architecture
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {project.title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Problem vs Solution Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-void-deep/90 border border-white/10 text-xs">
            <span className="font-mono text-[10px] uppercase text-pink-accent tracking-wider font-semibold block mb-1">
              Core Problem Addressed
            </span>
            <p className="text-text-secondary leading-relaxed">{project.problem}</p>
          </div>

          <div className="p-4 rounded-2xl bg-void-deep/90 border border-cyan-electric/25 text-xs">
            <span className="font-mono text-[10px] uppercase text-cyan-electric tracking-wider font-semibold block mb-1">
              Engineered Solution
            </span>
            <p className="text-text-secondary leading-relaxed">{project.solution}</p>
          </div>
        </div>

        {/* Visual Architecture Flow */}
        <div className="p-4 rounded-2xl bg-void-deep/90 border border-cyan-electric/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-bold flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              System Dataflow Pipeline
            </span>
            <span className="text-[10px] font-mono text-text-dim">End-to-End Flow</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {project.architectureNodes.map((node, i) => (
              <React.Fragment key={node}>
                <div className="px-3 py-1.5 rounded-xl bg-void-surface border border-cyan-electric/35 text-[11px] font-mono text-white shadow-sm">
                  {node}
                </div>
                {i < project.architectureNodes.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-pink-accent shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Interactive Terminal Walkthrough Log */}
        <div className="p-4 rounded-2xl bg-[#03040b] border border-white/15 flex flex-col gap-3 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 text-xs text-cyan-electric">
              <Terminal className="w-3.5 h-3.5" />
              <span>runtime-trace.log</span>
            </div>
            <button
              type="button"
              onClick={handleReplayTerminal}
              className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-cyan-electric/15 border border-cyan-electric/40 text-cyan-electric hover:bg-cyan-electric hover:text-void transition-all"
            >
              <Play className="w-2.5 h-2.5" />
              <span>Replay Trace</span>
            </button>
          </div>
          <div className="flex flex-col gap-1.5 text-[11px] min-h-[96px]">
            {project.terminalPreview.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className={
                  line.startsWith('✓')
                    ? 'text-emerald-400 font-semibold'
                    : line.startsWith('$')
                    ? 'text-cyan-electric'
                    : 'text-text-secondary'
                }
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Measurable Highlights */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-electric" />
            Verified Technical Outcomes
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-void-deep/80 border border-white/5 text-xs text-text-secondary leading-snug"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-text-dim flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-electric" />
            Technology Primitives
          </span>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/90"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Services Supported by this Project */}
        <div className="p-4 rounded-2xl bg-cyan-electric/5 border border-cyan-electric/25 flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-electric font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Proves Competencies For Services:
          </span>
          <div className="flex flex-wrap gap-2">
            {project.serviceIds.map((svcId) => {
              const svc = getServiceById(svcId);
              return (
                <button
                  key={svcId}
                  onClick={() => handleJumpToService(svcId)}
                  className="px-3 py-1.5 rounded-xl bg-void-deep border border-cyan-electric/40 hover:bg-cyan-electric hover:text-void text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>{svc ? svc.title : svcId}</span>
                  <span className="text-[10px] font-mono text-cyan-electric/80">→</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {project.links.demo && (
              <button
                type="button"
                onClick={handleLaunchDemo}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-electric text-void hover:opacity-90 transition-all flex items-center gap-1.5 shadow-cyan-glow"
              >
                <span>Launch Interactive Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>View GitHub</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTone(700, 0.1);
                startInquiry({
                  serviceType: project.serviceIds[0] || 'ui-ux-design',
                  brief: `Interested in building a system similar to ${project.title} (${project.stack.slice(0, 4).join(', ')}).`,
                });
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-pink-accent/20 border border-pink-accent/50 text-pink-accent hover:bg-pink-accent hover:text-void transition-all"
            >
              Build Similar System →
            </button>
          </div>

          <button
            onClick={handleClose}
            className="text-xs font-mono text-text-dim hover:text-white transition-colors"
          >
            Dismiss [Esc]
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
