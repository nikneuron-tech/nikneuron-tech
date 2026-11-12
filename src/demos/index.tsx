import React, { useState, useEffect } from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as Slider from '@radix-ui/react-slider';
import * as Tabs from '@radix-ui/react-tabs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { soundEngine } from '../components/ui/audio';
import { 
  Sparkles, 
  Terminal, 
  ChevronRight, 
  Volume2, 
  Layers, 
  Check, 
  Copy, 
  Activity, 
  Eye, 
  Compass, 
  Sliders, 
  Cpu
} from 'lucide-react';

/* ==========================================================================
   FACE 1: NAVIGATION DEMOS
   ========================================================================== */
export const FloatingPillNavbarDemo: React.FC = () => {
  const [active, setActive] = useState('Feed');
  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-full glass-panel border border-cyan-electric/30">
      <span className="font-display text-xs font-bold text-cyan-electric">NEXUS</span>
      <div className="flex gap-3 text-xs">
        {['Feed', 'Spatial', 'Nodes'].map((item) => (
          <button
            key={item}
            onClick={() => {
              setActive(item);
              soundEngine.playTone(600, 0.1);
            }}
            className={`transition-colors ${
              active === item ? 'text-white font-semibold text-glow-cyan' : 'text-text-secondary hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export const SegmentedTabsDemo: React.FC = () => {
  return (
    <Tabs.Root defaultValue="holo" className="w-full flex flex-col items-center">
      <Tabs.List className="flex p-1 rounded-full bg-void-surface border border-cyan-electric/25">
        <Tabs.Trigger
          value="flat"
          onClick={() => soundEngine.playTone(500, 0.1)}
          className="px-3 py-1 text-xs rounded-full text-text-secondary data-[state=active]:bg-cyan-electric data-[state=active]:text-void data-[state=active]:font-semibold transition-all"
        >
          2D Flat
        </Tabs.Trigger>
        <Tabs.Trigger
          value="holo"
          onClick={() => soundEngine.playTone(650, 0.1)}
          className="px-3 py-1 text-xs rounded-full text-text-secondary data-[state=active]:bg-cyan-electric data-[state=active]:text-void data-[state=active]:font-semibold transition-all"
        >
          Holo 3D
        </Tabs.Trigger>
        <Tabs.Trigger
          value="neural"
          onClick={() => soundEngine.playTone(800, 0.1)}
          className="px-3 py-1 text-xs rounded-full text-text-secondary data-[state=active]:bg-cyan-electric data-[state=active]:text-void data-[state=active]:font-semibold transition-all"
        >
          Neural
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export const HoloBreadcrumbsDemo: React.FC = () => {
  return (
    <nav className="flex items-center gap-2 text-xs">
      <span className="text-text-dim">Root</span>
      <ChevronRight className="w-3.5 h-3.5 text-cyan-electric" />
      <span className="text-text-secondary">Core</span>
      <ChevronRight className="w-3.5 h-3.5 text-cyan-electric" />
      <span className="text-white font-bold text-glow-cyan">Plasma Mesh</span>
    </nav>
  );
};

export const GlassDropdownDemo: React.FC = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          onClick={() => soundEngine.playTone(550, 0.1)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-void-surface border border-cyan-electric/30 text-white hover:border-cyan-electric transition-all shadow-cyan-glow"
        >
          Open Matrix Menu
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[140px] p-1.5 rounded-xl bg-void-deep/95 border border-cyan-electric/40 backdrop-blur-2xl shadow-glass z-[9999]">
          <DropdownMenu.Item
            onClick={() => soundEngine.playTone(700, 0.1)}
            className="flex items-center justify-between px-3 py-1.5 text-xs rounded-lg text-white hover:bg-cyan-electric/20 cursor-pointer outline-none"
          >
            <span>Inspect</span>
            <span className="text-cyan-electric text-[10px]">⌘I</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => soundEngine.playTone(750, 0.1)}
            className="flex items-center justify-between px-3 py-1.5 text-xs rounded-lg text-text-secondary hover:bg-cyan-electric/20 hover:text-white cursor-pointer outline-none"
          >
            <span>Calibrate</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export const CommandPaletteDemo: React.FC = () => {
  return (
    <div className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-void-surface border border-cyan-electric/30">
      <Terminal className="w-4 h-4 text-cyan-electric" />
      <input
        type="text"
        readOnly
        value="mesh:render-plasma --overclock"
        className="w-full bg-transparent text-xs text-white outline-none font-mono"
      />
      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-text-dim">ESC</span>
    </div>
  );
};

/* ==========================================================================
   FACE 2: INPUTS DEMOS
   ========================================================================== */
export const NeonButtonsDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => soundEngine.playTone(850, 0.15, 'sine', 0.1)}
        className="px-4 py-2 rounded-full font-display text-xs font-bold text-void bg-cyan-electric shadow-cyan-glow hover:bg-white hover:scale-105 active:scale-95 transition-all"
      >
        Engage Flux
      </button>
      <button
        onClick={() => soundEngine.playTone(600, 0.1)}
        className="px-4 py-2 rounded-full text-xs font-semibold text-white border border-cyan-electric/25 hover:border-pink-accent hover:text-pink-accent transition-all"
      >
        Standby
      </button>
    </div>
  );
};

export const BiometricFormDemo: React.FC = () => {
  const [val, setVal] = useState('synapse_087x');
  return (
    <div className="w-full flex flex-col gap-1.5">
      <label className="text-[10px] tracking-widest uppercase text-text-dim">Neural Identity</label>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full px-3 py-2 text-xs rounded-lg bg-void-surface border border-cyan-electric/25 text-white outline-none focus:border-cyan-electric focus:ring-1 focus:ring-cyan-electric transition-all"
      />
    </div>
  );
};

export const QuantumToggleDemo: React.FC = () => {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex items-center gap-3">
      <Switch.Root
        checked={checked}
        onCheckedChange={(c) => {
          setChecked(c);
          soundEngine.playTone(c ? 800 : 400, 0.12);
        }}
        className="w-12 h-6 rounded-full bg-white/10 data-[state=checked]:bg-cyan-electric/30 border border-cyan-electric/30 transition-all relative outline-none"
      >
        <Switch.Thumb className="block w-4 h-4 rounded-full bg-text-secondary data-[state=checked]:bg-cyan-electric data-[state=checked]:shadow-cyan-glow data-[state=checked]:translate-x-6 translate-x-1 transition-transform" />
      </Switch.Root>
      <span className="text-xs text-text-secondary">Plasma Overclock</span>
    </div>
  );
};

export const FluxSliderDemo: React.FC = () => {
  const [value, setValue] = useState([78]);
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">Frequency Density</span>
        <span className="font-display text-cyan-electric font-bold">{value[0]} GHz</span>
      </div>
      <Slider.Root
        value={value}
        onValueChange={(v) => {
          setValue(v);
        }}
        min={10}
        max={150}
        step={1}
        className="relative flex items-center select-none touch-none w-full h-5"
      >
        <Slider.Track className="bg-white/10 relative grow rounded-full h-1.5 overflow-hidden">
          <Slider.Range className="absolute bg-cyan-electric h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-cyan-electric rounded-full shadow-cyan-glow outline-none hover:scale-125 transition-transform" />
      </Slider.Root>
    </div>
  );
};

export const OrbitalSelectDemo: React.FC = () => {
  return (
    <select
      onChange={() => soundEngine.playTone(650, 0.1)}
      className="w-full px-3 py-2 text-xs rounded-lg bg-void-surface border border-cyan-electric/30 text-white outline-none focus:border-cyan-electric"
    >
      <option value="volumetric">Volumetric Spatial (Default)</option>
      <option value="acoustic">Acoustic Sub-vocal</option>
      <option value="retinal">Retinal Laser Projection</option>
    </select>
  );
};

/* ==========================================================================
   FACE 3: FEEDBACK DEMOS
   ========================================================================== */
export const SynapticToastDemo: React.FC = () => {
  const [triggered, setTriggered] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => {
          setTriggered(true);
          soundEngine.playTone(900, 0.2);
          setTimeout(() => setTriggered(false), 2400);
        }}
        className="px-4 py-2 rounded-full font-display text-xs font-bold text-void bg-cyan-electric shadow-cyan-glow hover:bg-white transition-all"
      >
        Emit Toast Event
      </button>
      {triggered && (
        <div className="absolute top-12 left-0 right-0 p-2.5 rounded-xl bg-void-deep/95 border border-cyan-electric text-xs text-white shadow-cyan-glow flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-electric shadow-cyan-glow" />
          <span>Core Telemetry Synced (0.02ms)</span>
        </div>
      )}
    </div>
  );
};

export const HoloBannerAlertDemo: React.FC = () => {
  return (
    <div className="w-full px-3 py-2 rounded-lg bg-pink-accent/10 border border-pink-accent/35 flex items-center gap-2.5">
      <div className="w-2 h-2 rounded-full bg-pink-accent shadow-pink-glow animate-pulse" />
      <span className="text-xs text-white">Core temperature nominal at 4.2 Kelvin</span>
    </div>
  );
};

export const PlasmaLoaderDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-electric/20 border-t-cyan-electric border-b-pink-accent animate-spin" />
      <span className="text-xs text-text-secondary tracking-wider">Synthesizing Geometry...</span>
    </div>
  );
};

export const KineticProgressDemo: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between text-[11px] text-text-dim">
        <span>PHASE 02 / 03</span>
        <span className="text-cyan-electric">68%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="w-[68%] h-full bg-gradient-to-r from-cyan-electric to-pink-accent shadow-cyan-glow" />
      </div>
    </div>
  );
};

export const ZeroStateDemo: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="w-6 h-6 rounded-md border border-dashed border-cyan-electric/50 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-cyan-electric" />
      </div>
      <h4 className="text-xs font-semibold text-white">No Disrupted Frequencies</h4>
      <p className="text-[11px] text-text-dim">All quantum channels clear</p>
    </div>
  );
};

/* ==========================================================================
   FACE 4: DATA DEMOS
   ========================================================================== */
export const TelemetryCardDemo: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase text-text-dim tracking-wider">Flux Density</span>
        <span className="font-display text-lg font-bold text-cyan-electric">99.8%</span>
      </div>
      <svg className="w-24 h-8" viewBox="0 0 120 38">
        <path d="M0,30 Q30,5 60,20 T120,8" fill="none" stroke="#4fd8ff" strokeWidth="2" />
        <circle cx="120" cy="8" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
};

export const QuantumTableDemo: React.FC = () => {
  return (
    <div className="w-full text-xs">
      <div className="flex justify-between pb-1 text-text-dim border-b border-white/10">
        <span>Node</span>
        <span>Bandwidth</span>
        <span>Status</span>
      </div>
      <div className="flex justify-between py-1 text-white">
        <span>0xN1</span>
        <span>1.4 TB/s</span>
        <span className="text-cyan-electric">Engaged</span>
      </div>
      <div className="flex justify-between py-1 text-white">
        <span>0xN2</span>
        <span>8.9 TB/s</span>
        <span className="text-pink-accent">Supercharged</span>
      </div>
    </div>
  );
};

export const BioChartDemo: React.FC = () => {
  return (
    <div className="w-full flex items-end gap-2 h-12">
      <div className="flex-1 h-[40%] bg-cyan-electric/40 rounded-t" />
      <div className="flex-1 h-[65%] bg-cyan-electric/70 rounded-t" />
      <div className="flex-1 h-[95%] bg-gradient-to-t from-cyan-electric to-pink-accent rounded-t shadow-pink-glow" />
      <div className="flex-1 h-[50%] bg-cyan-electric/50 rounded-t" />
      <div className="flex-1 h-[80%] bg-cyan-electric/80 rounded-t" />
    </div>
  );
};

export const GaugeClusterDemo: React.FC = () => {
  return (
    <div className="w-full flex justify-around text-center">
      <div>
        <span className="text-[10px] text-text-dim">LATENCY</span>
        <div className="font-display text-sm font-bold text-white">0.02ms</div>
      </div>
      <div>
        <span className="text-[10px] text-text-dim">ATTENTION</span>
        <div className="font-display text-sm font-bold text-cyan-electric">98.4%</div>
      </div>
    </div>
  );
};

export const KineticFeedDemo: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-electric shadow-cyan-glow" />
        <span className="text-white">Sub-vocal channel calibrated</span>
      </div>
      <span className="text-text-dim text-[11px]">12s ago</span>
    </div>
  );
};

/* ==========================================================================
   FACE 5: FUTURE INTERFACES DEMOS
   ========================================================================== */
export const SynapticVoiceDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 h-8">
        {[18, 32, 14, 28, 22].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}px` }}
            className="w-1 rounded-full bg-gradient-to-t from-cyan-electric to-pink-accent animate-pulse"
          />
        ))}
      </div>
      <span className="font-display text-xs text-cyan-electric">Listening Intent</span>
    </div>
  );
};

export const MicroKineticMeshDemo: React.FC = () => {
  return (
    <div className="relative w-12 h-12 rounded-full border border-dashed border-cyan-electric/50 flex items-center justify-center animate-spin-slow">
      <div className="w-3 h-3 rounded-full bg-pink-accent shadow-pink-glow" />
    </div>
  );
};

export const VolumetricReticleDemo: React.FC = () => {
  return (
    <div className="w-24 h-12 rounded-md border-2 border-cyan-electric flex items-center justify-center shadow-cyan-glow">
      <span className="font-display text-[10px] text-white">TARGET LOCK</span>
    </div>
  );
};

export const AdaptiveLayoutDemo: React.FC = () => {
  return (
    <div className="w-full px-3 py-2 rounded-lg bg-white/5 flex items-center justify-between text-xs">
      <span className="text-text-secondary">Density</span>
      <span className="font-bold text-cyan-electric">Adaptive (Auto)</span>
    </div>
  );
};

/* ==========================================================================
   FACE 6: FOUNDATIONS DEMOS
   ========================================================================== */
export const ColorMatrixDemo: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const colors = [
    { hex: '#050612', name: 'void' },
    { hex: '#4fd8ff', name: 'cyan' },
    { hex: '#ff5aa5', name: 'pink' },
  ];
  return (
    <div className="flex gap-2">
      {colors.map((c) => (
        <button
          key={c.hex}
          onClick={() => {
            navigator.clipboard.writeText(c.hex);
            setCopied(c.hex);
            soundEngine.playTone(700, 0.1);
            setTimeout(() => setCopied(null), 1500);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-cyan-electric/20 text-xs hover:border-white transition-all"
        >
          <span style={{ backgroundColor: c.hex }} className="w-2.5 h-2.5 rounded-full" />
          <span>{copied === c.hex ? 'Copied!' : c.hex}</span>
        </button>
      ))}
    </div>
  );
};

export const TypographyHierarchyDemo: React.FC = () => {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-display text-xs font-bold text-white tracking-wider">UNBOUNDED 800</span>
      <span className="font-body text-xs text-text-secondary">Manrope Regular 400</span>
    </div>
  );
};

export const QuantumSpacingDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-4 bg-cyan-electric/30" />
      <div className="w-4 h-4 bg-cyan-electric/60" />
      <div className="w-6 h-4 bg-cyan-electric/90" />
      <div className="w-8 h-4 bg-cyan-electric shadow-cyan-glow" />
    </div>
  );
};

export const ElasticMotionDemo: React.FC = () => {
  return (
    <div className="w-full h-2 rounded-full bg-white/10 relative overflow-hidden">
      <div className="w-3 h-3 rounded-full bg-cyan-electric shadow-cyan-glow absolute -top-0.5 animate-[pulseSubtle_2s_infinite_alternate]" />
    </div>
  );
};

export const VectorGlyphsDemo: React.FC = () => {
  return (
    <div className="flex gap-4 text-cyan-electric">
      <Compass className="w-5 h-5 hover:text-pink-accent transition-colors" />
      <Sliders className="w-5 h-5 hover:text-pink-accent transition-colors" />
      <Cpu className="w-5 h-5 hover:text-pink-accent transition-colors" />
    </div>
  );
};
