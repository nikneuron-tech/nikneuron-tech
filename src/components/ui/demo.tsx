import React, { useState } from 'react';
import { AsmrBackground } from './asmr-background';
import { Sparkles, Compass, Eye, ShieldCheck, Zap } from 'lucide-react';

export const Demo: React.FC = () => {
  const [interactive, setInteractive] = useState<boolean>(true);
  const [galaxyIntensity, setGalaxyIntensity] = useState<number>(0.85);

  return (
    <AsmrBackground
      interactive={interactive}
      galaxyIntensity={galaxyIntensity}
      className="flex flex-col items-center justify-center p-6 text-white"
    >
      <main className="max-w-2xl w-full mx-auto my-auto backdrop-blur-md bg-void/60 border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center relative z-10 transition-all">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-electric/10 border border-cyan-electric/30 text-cyan-electric text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>MILKY WAY // ATMOSPHERIC FRICTION ASMR</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
          Atmospheric Friction Background
        </h1>

        <p className="text-sm sm:text-base text-gray-300 font-body mb-8 leading-relaxed">
          Move your cursor or swipe on touch screens to generate a magnetic atmospheric vortex.
          Notice how accelerating particles experience friction glow, stretching into aerodynamic shards
          along the diagonal Milky Way galactic band and interstellar dust lanes.
        </p>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-gray-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-electric" /> Magnetic Vortex
              </span>
              <button
                type="button"
                onClick={() => setInteractive(!interactive)}
                className={`text-xs px-2.5 py-1 rounded font-mono transition-colors ${
                  interactive
                    ? 'bg-cyan-electric text-void font-bold shadow-[0_0_10px_rgba(79,216,255,0.4)]'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {interactive ? 'Active' : 'Paused'}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              {interactive
                ? 'Cursor pulls and swirls nearby stars with friction heating.'
                : 'Free drift with slow galactic rotation.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-gray-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300" /> Galaxy Intensity
              </span>
              <span className="text-xs font-mono text-cyan-electric">
                {Math.round(galaxyIntensity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={galaxyIntensity}
              onChange={(e) => setGalaxyIntensity(parseFloat(e.target.value))}
              className="w-full accent-cyan-electric bg-white/10 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Feature telemetry tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/10 text-xs text-gray-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Offscreen Nebula
          </span>
          <span>•</span>
          <span>Gaussian Galactic Band</span>
          <span>•</span>
          <span>4-Point Cross Flares</span>
          <span>•</span>
          <span>Shooting Stars</span>
        </div>
      </main>
    </AsmrBackground>
  );
};

export default Demo;
