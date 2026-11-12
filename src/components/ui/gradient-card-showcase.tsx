import React from 'react';
import { cn } from '@/lib/utils';

export interface GradientSkewCardProps {
  children: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  contentClassName?: string;
  id?: string;
  highlighted?: boolean;
}

/**
 * Reusable skewed-gradient glass card inspired by the Gradient Card Showcase.
 * Renders dual-layer skewed gradient rails, ambient blur glow, and floating glass blobs
 * while preserving clean layout flow and dark cyber-glass legibility.
 */
export const GradientSkewCard: React.FC<GradientSkewCardProps> = ({
  children,
  gradientFrom = '#4fd8ff',
  gradientTo = '#ff5aa5',
  className,
  contentClassName,
  id,
  highlighted = false,
}) => {
  return (
    <div id={id} className={cn('group relative h-full transition-all duration-500', className)}>
      {/* Skewed gradient panel */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-0 left-6 sm:left-10 w-1/2 h-full rounded-2xl transform skew-x-[8deg] sm:skew-x-[12deg] transition-all duration-500 opacity-75',
          'group-hover:skew-x-0 group-hover:left-2.5 sm:group-hover:left-3 group-hover:w-[calc(100%-1.25rem)] sm:group-hover:w-[calc(100%-1.5rem)] group-hover:opacity-95',
          highlighted && 'skew-x-[5deg] opacity-90'
        )}
        style={{
          background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      {/* Blurred ambient glow layer */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-0 left-6 sm:left-10 w-1/2 h-full rounded-2xl transform skew-x-[8deg] sm:skew-x-[12deg] blur-[22px] sm:blur-[28px] transition-all duration-500 opacity-50 sm:opacity-55',
          'group-hover:skew-x-0 group-hover:left-2.5 sm:group-hover:left-3 group-hover:w-[calc(100%-1.25rem)] sm:group-hover:w-[calc(100%-1.5rem)] group-hover:opacity-80'
        )}
        style={{
          background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      {/* Animated floating glass blobs (desktop/tablet) */}
      <span aria-hidden="true" className="hidden sm:block pointer-events-none absolute inset-0 z-10 overflow-visible">
        <span className="absolute top-0 left-0 w-0 h-0 rounded-xl opacity-0 bg-white/10 backdrop-blur-[10px] border border-white/15 shadow-[0_5px_15px_rgba(0,0,0,0.2)] transition-all duration-300 animate-blob group-hover:-top-5 group-hover:left-6 group-hover:w-14 group-hover:h-14 group-hover:opacity-100" />
        <span className="absolute bottom-0 right-0 w-0 h-0 rounded-xl opacity-0 bg-white/10 backdrop-blur-[10px] border border-white/15 shadow-[0_5px_15px_rgba(0,0,0,0.2)] transition-all duration-500 animate-blob animation-delay-1000 group-hover:-bottom-5 group-hover:right-6 group-hover:w-14 group-hover:h-14 group-hover:opacity-100" />
      </span>

      {/* Glassmorphic foreground content panel */}
      <div
        className={cn(
          'relative z-20 h-full rounded-2xl bg-void-deep/90 border backdrop-blur-xl shadow-glass text-white p-5 sm:p-7 flex flex-col justify-between transition-all duration-500',
          'sm:group-hover:-translate-x-1.5',
          highlighted
            ? 'border-cyan-electric/80 shadow-cyan-glow'
            : 'border-white/15 group-hover:border-white/30',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

const defaultCards = [
  {
    title: 'Spatial 3D Interfaces',
    desc: 'Interactive WebGL & React Three Fiber experiences engineered for high conversion and zero frame drops.',
    gradientFrom: '#ffbc00',
    gradientTo: '#ff0058',
  },
  {
    title: 'Multi-Agent AI Pipelines',
    desc: 'Autonomous Groq & Gemini workflows with structured validation rubrics and sub-second voice triage.',
    gradientFrom: '#03a9f4',
    gradientTo: '#ff0058',
  },
  {
    title: 'Client-Side Privacy Suites',
    desc: 'Zero-upload WebAssembly and Web Crypto utilities executing strictly inside local browser memory.',
    gradientFrom: '#4dff03',
    gradientTo: '#00d0ff',
  },
];

export default function SkewCards() {
  return (
    <div className="flex justify-center items-stretch flex-wrap gap-10 py-10">
      {defaultCards.map(({ title, desc, gradientFrom, gradientTo }, idx) => (
        <GradientSkewCard
          key={idx}
          gradientFrom={gradientFrom}
          gradientTo={gradientTo}
          className="w-full max-w-[340px] min-h-[340px]"
        >
          <div>
            <h2 className="font-display text-xl font-bold mb-3 text-white">{title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">{desc}</p>
          </div>
          <a
            href="#contact"
            className="inline-block self-start text-xs font-display font-bold uppercase tracking-wider text-void bg-white px-4 py-2.5 rounded-xl hover:bg-cyan-electric transition-colors shadow-md"
          >
            Read More
          </a>
        </GradientSkewCard>
      ))}
    </div>
  );
}

