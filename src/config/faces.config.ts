import React from 'react';
import * as THREE from 'three';
import {
  FloatingPillNavbarDemo,
  SegmentedTabsDemo,
  HoloBreadcrumbsDemo,
  GlassDropdownDemo,
  CommandPaletteDemo,
  NeonButtonsDemo,
  BiometricFormDemo,
  QuantumToggleDemo,
  FluxSliderDemo,
  OrbitalSelectDemo,
  SynapticToastDemo,
  HoloBannerAlertDemo,
  PlasmaLoaderDemo,
  KineticProgressDemo,
  ZeroStateDemo,
  TelemetryCardDemo,
  QuantumTableDemo,
  BioChartDemo,
  GaugeClusterDemo,
  KineticFeedDemo,
  SynapticVoiceDemo,
  MicroKineticMeshDemo,
  VolumetricReticleDemo,
  AdaptiveLayoutDemo,
  ColorMatrixDemo,
  TypographyHierarchyDemo,
  QuantumSpacingDemo,
  ElasticMotionDemo,
  VectorGlyphsDemo,
} from '../demos';

export interface FaceItemConfig {
  id: string;
  name: string;
  description: string;
  rule: string;
  tags: string[];
  popularity: number; // 1-100 score for recommendation & sorting
  code: string;
  DemoComponent: React.ComponentType;
}

export interface FaceConfig {
  id: string;
  index: number;
  title: string;
  name: string;
  subtitle: string;
  eyebrow: string;
  description: string;
  desc: string;
  normal: [number, number, number]; // outward local normal vector [x, y, z]
  euler: [number, number, number]; // target euler in radians to face front (+Z)
  targetQuaternion: [number, number, number, number]; // [x, y, z, w]
  colorAccent: string; // Neon hex accent
  colorGlow: string; // CSS rgba glow
  items: FaceItemConfig[];
  components: FaceItemConfig[];
}

function computeQuaternion(euler: [number, number, number]): [number, number, number, number] {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(euler[0], euler[1], euler[2], 'XYZ'));
  return [q.x, q.y, q.z, q.w];
}

/* ==========================================================================
   FACE ITEMS DEFINITIONS
   ========================================================================== */

const navigationItems: FaceItemConfig[] = [
  {
    id: 'navbars',
    name: 'Floating Pill Navbar',
    description: 'Persistent top-level anchor for high-level domain transitions.',
    rule: 'Use as the persistent top-level anchor for high-level domain transitions.',
    tags: ['navigation', 'navbar', 'header', 'routing', 'spatial'],
    popularity: 96,
    code: `<nav className="flex items-center gap-4 px-4 py-2 rounded-full bg-[rgba(10,20,50,0.55)] border border-cyan-electric/30 backdrop-blur-xl">
  <span className="font-display text-xs font-bold text-cyan-electric">NEXUS</span>
  <div className="flex gap-3 text-xs">
    <a href="#feed" className="text-white font-semibold">Feed</a>
    <a href="#spatial" className="text-text-secondary">Spatial</a>
    <a href="#nodes" className="text-text-secondary">Nodes</a>
  </div>
</nav>`,
    DemoComponent: FloatingPillNavbarDemo,
  },
  {
    id: 'tabs',
    name: 'Segmented Sliding Tabs',
    description: 'Partition mutually exclusive sub-views within the same context.',
    rule: 'Use when partitioning mutually exclusive sub-views within the same context.',
    tags: ['navigation', 'tabs', 'segments', 'switcher', 'mobile'],
    popularity: 91,
    code: `<div className="flex p-1 rounded-full bg-void-surface border border-cyan-electric/25">
  <button className="px-3 py-1 text-xs rounded-full bg-cyan-electric text-void font-semibold">2D Flat</button>
  <button className="px-3 py-1 text-xs rounded-full text-text-secondary">Holo 3D</button>
</div>`,
    DemoComponent: SegmentedTabsDemo,
  },
  {
    id: 'breadcrumbs',
    name: 'Holographic Breadcrumbs',
    description: 'Deep multi-tier hierarchies that afford immediate parent jumping.',
    rule: 'Use in deep multi-tier hierarchies to afford immediate parent jumping.',
    tags: ['navigation', 'breadcrumbs', 'hierarchy', 'tree'],
    popularity: 82,
    code: `<nav className="flex items-center gap-2 text-xs">
  <span className="text-text-dim">Root</span>
  <span className="text-cyan-electric">&gt;</span>
  <span className="text-white font-bold">Plasma Mesh</span>
</nav>`,
    DemoComponent: HoloBreadcrumbsDemo,
  },
  {
    id: 'dropdowns-menu',
    name: 'Glass Contextual Menu',
    description: 'Progressive disclosure of secondary operations without visual clutter.',
    rule: 'Use for progressive disclosure of secondary operations without clutter.',
    tags: ['navigation', 'menu', 'dropdown', 'context', 'actions'],
    popularity: 88,
    code: `<div className="p-2 rounded-xl bg-void-deep/95 border border-cyan-electric/40 backdrop-blur-2xl">
  <div className="flex justify-between px-3 py-1.5 text-xs text-white hover:bg-cyan-electric/20 rounded-lg">
    <span>Inspect</span>
    <span className="text-cyan-electric">⌘I</span>
  </div>
</div>`,
    DemoComponent: GlassDropdownDemo,
  },
  {
    id: 'command-palette',
    name: 'Omni Command Palette',
    description: 'Power-user keyboard navigation across complex application actions.',
    rule: 'Use for power-user keyboard navigation across complex application actions.',
    tags: ['navigation', 'search', 'command', 'palette', 'keyboard', 'shortcuts'],
    popularity: 98,
    code: `<div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-void-surface border border-cyan-electric/30">
  <span className="text-cyan-electric font-mono">&gt;</span>
  <input type="text" placeholder="Type command..." className="bg-transparent text-xs text-white" />
  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">ESC</kbd>
</div>`,
    DemoComponent: CommandPaletteDemo,
  },
];

const inputItems: FaceItemConfig[] = [
  {
    id: 'buttons',
    name: 'Kinetic Neon Buttons',
    description: 'Decisive primary commitments with tangible energy feedback.',
    rule: 'Use for decisive primary commitments with tangible energy feedback.',
    tags: ['inputs', 'button', 'cta', 'kinetic', 'feedback'],
    popularity: 95,
    code: `<button className="px-4 py-2 rounded-full font-display text-xs font-bold text-void bg-cyan-electric shadow-cyan-glow hover:bg-white transition-all">
  Engage Flux
</button>`,
    DemoComponent: NeonButtonsDemo,
  },
  {
    id: 'forms',
    name: 'Biometric Input Field',
    description: 'Capturing structured textual or numerical data with active focus glow.',
    rule: 'Use for capturing structured textual or numerical data with active focus glow.',
    tags: ['inputs', 'input', 'field', 'form', 'text'],
    popularity: 89,
    code: `<div className="flex flex-col gap-1.5">
  <label className="text-[10px] uppercase text-text-dim">Neural Identity</label>
  <input type="text" className="px-3 py-2 text-xs rounded-lg bg-void-surface border border-cyan-electric/25 text-white outline-none focus:border-cyan-electric" />
</div>`,
    DemoComponent: BiometricFormDemo,
  },
  {
    id: 'toggles',
    name: 'Quantum Liquid Toggle',
    description: 'Instant binary states that take effect without a submit step.',
    rule: 'Use for instant binary states that take effect without a submit step.',
    tags: ['inputs', 'toggle', 'switch', 'binary', 'settings'],
    popularity: 92,
    code: `<Switch.Root className="w-12 h-6 rounded-full bg-white/10 data-[state=checked]:bg-cyan-electric/30 border border-cyan-electric/30">
  <Switch.Thumb className="block w-4 h-4 rounded-full bg-cyan-electric" />
</Switch.Root>`,
    DemoComponent: QuantumToggleDemo,
  },
  {
    id: 'sliders',
    name: 'Flux Gradient Slider',
    description: 'Continuous adjustment across a calibrated numerical spectrum.',
    rule: 'Use for continuous adjustment across a calibrated numerical spectrum.',
    tags: ['inputs', 'slider', 'range', 'numerical', 'gradient'],
    popularity: 84,
    code: `<Slider.Root min={10} max={150} className="w-full h-5 relative flex items-center">
  <Slider.Track className="bg-white/10 h-1.5 rounded-full grow">
    <Slider.Range className="bg-cyan-electric h-full" />
  </Slider.Track>
  <Slider.Thumb className="w-4 h-4 bg-cyan-electric rounded-full shadow-cyan-glow" />
</Slider.Root>`,
    DemoComponent: FluxSliderDemo,
  },
  {
    id: 'dropdowns',
    name: 'Orbital Select Menu',
    description: 'Selecting one option from a curated list of 5 or more options.',
    rule: 'Use when selecting one option from a curated list of 5 or more options.',
    tags: ['inputs', 'select', 'dropdown', 'choice', 'options'],
    popularity: 87,
    code: `<select className="px-3 py-2 text-xs rounded-lg bg-void-surface border border-cyan-electric/30 text-white">
  <option>Volumetric Spatial</option>
  <option>Acoustic Sub-vocal</option>
</select>`,
    DemoComponent: OrbitalSelectDemo,
  },
];

const feedbackItems: FaceItemConfig[] = [
  {
    id: 'toasts',
    name: 'Synaptic Signal Toast',
    description: 'Transient status notices that do not require explicit human acknowledgment.',
    rule: 'Use for transient status notices that do not require explicit human acknowledgment.',
    tags: ['feedback', 'toast', 'notification', 'alert', 'transient'],
    popularity: 93,
    code: `<div className="p-3 rounded-xl bg-void-deep/95 border border-cyan-electric text-xs text-white shadow-cyan-glow">
  Core Telemetry Synced (0.02ms)
</div>`,
    DemoComponent: SynapticToastDemo,
  },
  {
    id: 'alerts',
    name: 'Holographic Banner Alert',
    description: 'Crucial system conditions requiring sustained attention before proceeding.',
    rule: 'Use when crucial system conditions require sustained attention before proceeding.',
    tags: ['feedback', 'banner', 'alert', 'warning', 'critical'],
    popularity: 88,
    code: `<div className="px-3 py-2 rounded-lg bg-pink-accent/10 border border-pink-accent/35 flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-pink-accent animate-pulse" />
  <span className="text-xs text-white">Core temperature nominal</span>
</div>`,
    DemoComponent: HoloBannerAlertDemo,
  },
  {
    id: 'loaders',
    name: 'Plasma Dual-Ring Loader',
    description: 'Indeterminate asynchronous telemetry or neural calibration cycles.',
    rule: 'Use during indeterminate asynchronous telemetry or neural calibration cycles.',
    tags: ['feedback', 'loader', 'spinner', 'async', 'progress'],
    popularity: 90,
    code: `<div className="w-8 h-8 rounded-full border-2 border-cyan-electric/20 border-t-cyan-electric border-b-pink-accent animate-spin" />`,
    DemoComponent: PlasmaLoaderDemo,
  },
  {
    id: 'progress',
    name: 'Kinetic Step Meter',
    description: 'Determinate multi-phase workflows with clear beginning and end states.',
    rule: 'Use for determinate multi-phase workflows with clear beginning and end states.',
    tags: ['feedback', 'progress', 'stepper', 'meter', 'phases'],
    popularity: 86,
    code: `<div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
  <div className="w-[68%] h-full bg-gradient-to-r from-cyan-electric to-pink-accent" />
</div>`,
    DemoComponent: KineticProgressDemo,
  },
  {
    id: 'empty-states',
    name: 'Zero-State Hologram',
    description: 'Query yields no entities, nudging user with restorative actions.',
    rule: 'Use when a query yields no entities, nudging the user with restorative options.',
    tags: ['feedback', 'empty', 'zero-state', 'placeholder', 'recovery'],
    popularity: 81,
    code: `<div className="flex flex-col items-center text-center">
  <h4 className="text-xs font-semibold text-white">No Disrupted Frequencies</h4>
  <p className="text-[11px] text-text-dim">All quantum channels clear</p>
</div>`,
    DemoComponent: ZeroStateDemo,
  },
];

const dataItems: FaceItemConfig[] = [
  {
    id: 'cards',
    name: 'Telemetry Insight Card',
    description: 'Discrete entity metrics with summary and actionable triggers.',
    rule: 'Use to encapsulate a discrete entity, summary metric, and actionable trigger.',
    tags: ['data', 'card', 'metrics', 'telemetry', 'kpi'],
    popularity: 94,
    code: `<div className="flex flex-col">
  <span className="text-[10px] text-text-dim">Flux Density</span>
  <span className="font-display text-lg font-bold text-cyan-electric">99.8%</span>
</div>`,
    DemoComponent: TelemetryCardDemo,
  },
  {
    id: 'tables',
    name: 'Quantum Matrix Grid',
    description: 'Cross-comparing multiple attributes across parallel live records.',
    rule: 'Use when users need to cross-compare multiple attributes across parallel records.',
    tags: ['data', 'table', 'grid', 'matrix', 'comparison'],
    popularity: 85,
    code: `<table className="w-full text-xs">
  <thead><tr><th>Node</th><th>Bandwidth</th></tr></thead>
  <tbody><tr><td>0xN1</td><td>1.4 TB/s</td></tr></tbody>
</table>`,
    DemoComponent: QuantumTableDemo,
  },
  {
    id: 'charts',
    name: 'Volumetric Bio-Chart',
    description: 'Temporal patterns, deviations, and trends across timeline axes.',
    rule: 'Use to reveal temporal patterns, deviations, and trends across timeline axes.',
    tags: ['data', 'chart', 'graph', 'temporal', 'analytics'],
    popularity: 92,
    code: `<div className="flex items-end gap-2 h-12">
  <div className="flex-1 h-[65%] bg-cyan-electric/70 rounded-t" />
  <div className="flex-1 h-[95%] bg-gradient-to-t from-cyan-electric to-pink-accent rounded-t" />
</div>`,
    DemoComponent: BioChartDemo,
  },
  {
    id: 'dashboards',
    name: 'Adaptive Gauge Cluster',
    description: 'Top-level command screens for rapid executive overview and situational awareness.',
    rule: 'Use at top-level command screens for rapid executive overview and situational awareness.',
    tags: ['data', 'gauge', 'dashboard', 'executive', 'overview'],
    popularity: 89,
    code: `<div className="flex justify-around text-center">
  <div><span className="text-[10px]">LATENCY</span><h4>0.02ms</h4></div>
</div>`,
    DemoComponent: GaugeClusterDemo,
  },
  {
    id: 'lists',
    name: 'Kinetic Feed List',
    description: 'Continuous chronologically ordered operational events stream.',
    rule: 'Use for continuous chronologically ordered operational events.',
    tags: ['data', 'feed', 'list', 'events', 'timeline'],
    popularity: 87,
    code: `<div className="flex items-center gap-2 text-xs">
  <span className="w-2 h-2 rounded-full bg-cyan-electric" />
  <span>Sub-vocal channel calibrated</span>
</div>`,
    DemoComponent: KineticFeedDemo,
  },
];

const futureItems: FaceItemConfig[] = [
  {
    id: 'voice',
    name: 'Synaptic Sub-Vocal Voice',
    description: 'Ambient acoustic command without requiring outward audible speech.',
    rule: 'Use for ambient acoustic command without requiring outward audible speech.',
    tags: ['future', 'voice', 'audio', 'acoustic', 'speech', 'ai'],
    popularity: 97,
    code: `<div className="flex items-center gap-3">
  <div className="flex items-center gap-1 h-8">
    <div className="w-1 h-6 rounded-full bg-cyan-electric animate-pulse" />
  </div>
  <span className="font-display text-xs text-cyan-electric">Listening Intent</span>
</div>`,
    DemoComponent: SynapticVoiceDemo,
  },
  {
    id: 'gesture',
    name: 'Micro-Kinetic Spatial Mesh',
    description: 'Sub-millimeter finger tracking in three-dimensional spatial volume.',
    rule: 'Use for sub-millimeter finger tracking in three-dimensional spatial volume.',
    tags: ['future', 'spatial', 'gesture', 'tracking', '3d'],
    popularity: 94,
    code: `<div className="w-12 h-12 rounded-full border border-dashed border-cyan-electric/50 flex items-center justify-center">
  <div className="w-3 h-3 rounded-full bg-pink-accent shadow-pink-glow" />
</div>`,
    DemoComponent: MicroKineticMeshDemo,
  },
  {
    id: 'spatial-ar',
    name: 'Volumetric Reticle HUD',
    description: 'Anchor interactive floating planes to physical real-world architecture.',
    rule: 'Use to anchor interactive floating planes to physical real-world architecture.',
    tags: ['future', 'reticle', 'hud', 'spatial', 'ar', 'targeting'],
    popularity: 93,
    code: `<div className="w-24 h-12 rounded-md border-2 border-cyan-electric flex items-center justify-center shadow-cyan-glow">
  <span className="font-display text-[10px] text-white">TARGET LOCK</span>
</div>`,
    DemoComponent: VolumetricReticleDemo,
  },
  {
    id: 'adaptive-layouts',
    name: 'Cognitive Load Adapter',
    description: 'Automatically simplify information density when user stress spikes.',
    rule: 'Use to automatically simplify information density when user stress spikes.',
    tags: ['future', 'adaptive', 'cognitive', 'responsive', 'ux'],
    popularity: 90,
    code: `<div className="px-3 py-2 rounded-lg bg-white/5 flex items-center justify-between text-xs">
  <span className="text-text-secondary">Density</span>
  <span className="font-bold text-cyan-electric">Adaptive (Auto)</span>
</div>`,
    DemoComponent: AdaptiveLayoutDemo,
  },
];

const foundationItems: FaceItemConfig[] = [
  {
    id: 'color',
    name: 'Spectra Color Tokens',
    description: 'Harmonic color tokens calibrated for dark void high-contrast aesthetics.',
    rule: 'Click any token swatch to copy its exact hex value to your system buffer.',
    tags: ['foundations', 'color', 'tokens', 'palette', 'theme'],
    popularity: 95,
    code: `:root {
  --void: #050612;
  --cyan: #4fd8ff;
  --pink: #ff5aa5;
}`,
    DemoComponent: ColorMatrixDemo,
  },
  {
    id: 'typography',
    name: 'Dual-Type Hierarchy',
    description: 'Unbounded for high-impact display moments; Manrope for fatigue-free reading.',
    rule: 'Unbounded for high-impact display moments; Manrope for fatigue-free body reading.',
    tags: ['foundations', 'typography', 'font', 'hierarchy', 'text'],
    popularity: 91,
    code: `h1, h2 { font-family: 'Unbounded', sans-serif; }
body { font-family: 'Manrope', sans-serif; }`,
    DemoComponent: TypographyHierarchyDemo,
  },
  {
    id: 'spacing',
    name: '8-Point Quantum Spacing',
    description: 'Strict exponential spacing grid ensuring proportional spatial rhythm.',
    rule: 'Strict exponential spacing grid ensuring proportional spatial rhythm.',
    tags: ['foundations', 'spacing', 'grid', 'layout', 'rhythm'],
    popularity: 83,
    code: `const spacing = { 1: '8px', 2: '16px', 3: '24px', 4: '32px' };`,
    DemoComponent: QuantumSpacingDemo,
  },
  {
    id: 'motion',
    name: 'Elastic Inertia Easing',
    description: 'Liquid momentum curves and soft landings for spatial transitions.',
    rule: 'cubic-bezier(0.16, 1, 0.3, 1) mimicking liquid momentum and soft landings.',
    tags: ['foundations', 'motion', 'animation', 'easing', 'physics'],
    popularity: 88,
    code: `transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);`,
    DemoComponent: ElasticMotionDemo,
  },
  {
    id: 'icons',
    name: 'Vector Monoline Glyphs',
    description: '2px stroke geometry with optical sizing aligned to the typographic em box.',
    rule: '2px stroke geometry with optical sizing aligned to the typographic em box.',
    tags: ['foundations', 'icons', 'glyphs', 'vectors', 'symbols'],
    popularity: 89,
    code: `<Compass className="w-5 h-5 text-cyan-electric" />`,
    DemoComponent: VectorGlyphsDemo,
  },
];

/* ==========================================================================
   FACES_CONFIG EXPORT (STATICALLY TYPED, DIRECT EXPORT)
   ========================================================================== */

export const FACES_CONFIG: FaceConfig[] = [
  {
    id: 'navigation',
    index: 0,
    title: 'Navigation',
    name: 'Navigation',
    subtitle: 'Orientation & Routing',
    eyebrow: 'Face 01 // Orientation',
    description: 'Spatial and contextual routing components that anchor the human mental model across infinite state planes.',
    desc: 'Spatial and contextual routing components that anchor the human mental model across infinite state planes.',
    normal: [1, 0, 0],
    euler: [0, -Math.PI / 2, 0],
    targetQuaternion: computeQuaternion([0, -Math.PI / 2, 0]),
    colorAccent: '#4fd8ff', // Electric Cyan
    colorGlow: 'rgba(79, 216, 255, 0.4)',
    items: navigationItems,
    components: navigationItems,
  },
  {
    id: 'inputs',
    index: 1,
    title: 'Inputs',
    name: 'Inputs',
    subtitle: 'Intention & Controls',
    eyebrow: 'Face 02 // Intention',
    description: 'Direct interaction primitives allowing humans to inject parameters, decisions, and commands into the machine.',
    desc: 'Direct interaction primitives allowing humans to inject parameters, decisions, and commands into the machine.',
    normal: [-1, 0, 0],
    euler: [0, Math.PI / 2, 0],
    targetQuaternion: computeQuaternion([0, Math.PI / 2, 0]),
    colorAccent: '#ff5aa5', // Hot Pink
    colorGlow: 'rgba(255, 90, 165, 0.4)',
    items: inputItems,
    components: inputItems,
  },
  {
    id: 'feedback',
    index: 2,
    title: 'Feedback',
    name: 'Feedback',
    subtitle: 'Perception & Status',
    eyebrow: 'Face 03 // Perception',
    description: 'Signals, vibrations, and visual affirmations verifying system state changes and computational health.',
    desc: 'Signals, vibrations, and visual affirmations verifying system state changes and computational health.',
    normal: [0, 1, 0],
    euler: [Math.PI / 2, 0, 0],
    targetQuaternion: computeQuaternion([Math.PI / 2, 0, 0]),
    colorAccent: '#a78bfa', // Cyber Violet
    colorGlow: 'rgba(167, 139, 250, 0.4)',
    items: feedbackItems,
    components: feedbackItems,
  },
  {
    id: 'data',
    index: 3,
    title: 'Data Display',
    name: 'Data',
    subtitle: 'Cognition & Telemetry',
    eyebrow: 'Face 04 // Cognition',
    description: 'Information densities, telemetry gauges, and volumetric matrices distilling complexity into clarity.',
    desc: 'Information densities, telemetry gauges, and volumetric matrices distilling complexity into clarity.',
    normal: [0, -1, 0],
    euler: [-Math.PI / 2, 0, 0],
    targetQuaternion: computeQuaternion([-Math.PI / 2, 0, 0]),
    colorAccent: '#fbbf24', // Amber Gold
    colorGlow: 'rgba(251, 191, 36, 0.4)',
    items: dataItems,
    components: dataItems,
  },
  {
    id: 'future-interfaces',
    index: 4,
    title: 'Future Interfaces',
    name: 'Future Interfaces',
    subtitle: 'Post-Screen Modalities',
    eyebrow: 'Face 05 // Post-Screen',
    description: 'Novel paradigms operating beyond glass: sub-vocal acoustic resonance, spatial coordinates, and living layouts.',
    desc: 'Novel paradigms operating beyond glass: sub-vocal acoustic resonance, spatial coordinates, and living layouts.',
    normal: [0, 0, 1],
    euler: [0, 0, 0],
    targetQuaternion: computeQuaternion([0, 0, 0]),
    colorAccent: '#34d399', // Emerald Neon
    colorGlow: 'rgba(52, 211, 153, 0.4)',
    items: futureItems,
    components: futureItems,
  },
  {
    id: 'foundations',
    index: 5,
    title: 'Foundations',
    name: 'Foundations',
    subtitle: 'Atomic Substrate & Tokens',
    eyebrow: 'Face 06 // Atomic Substrate',
    description: 'Core rules of physics, color harmony, typography scales, and motion tokens supporting the Nikneuron universe.',
    desc: 'Core rules of physics, color harmony, typography scales, and motion tokens supporting the Nikneuron universe.',
    normal: [0, 0, -1],
    euler: [0, Math.PI, 0],
    targetQuaternion: computeQuaternion([0, Math.PI, 0]),
    colorAccent: '#60a5fa', // Cobalt Sky
    colorGlow: 'rgba(96, 165, 250, 0.4)',
    items: foundationItems,
    components: foundationItems,
  },
];

export default FACES_CONFIG;

// Helper utilities for effortless access and querying
export function getFaceById(id: string): FaceConfig | undefined {
  return FACES_CONFIG.find((f) => f.id === id);
}

export function getFaceByIndex(index: number): FaceConfig {
  return FACES_CONFIG[(index % FACES_CONFIG.length + FACES_CONFIG.length) % FACES_CONFIG.length];
}

export function getAllFaces(): FaceConfig[] {
  return FACES_CONFIG;
}

export function getAllItems(): (FaceItemConfig & { faceId: string; faceIndex: number; faceTitle: string; faceColor: string })[] {
  const result: (FaceItemConfig & { faceId: string; faceIndex: number; faceTitle: string; faceColor: string })[] = [];
  FACES_CONFIG.forEach((face) => {
    face.items.forEach((item) => {
      result.push({
        ...item,
        faceId: face.id,
        faceIndex: face.index,
        faceTitle: face.title,
        faceColor: face.colorAccent,
      });
    });
  });
  return result;
}

export function getFaceTargetQuaternion(faceIndex: number): THREE.Quaternion {
  const target = getFaceByIndex(faceIndex).targetQuaternion;
  return new THREE.Quaternion(target[0], target[1], target[2], target[3]);
}

/**
 * Given the current orientation quaternion of the cube group,
 * finds which face is closest to pointing directly at the camera (+Z: [0, 0, 1]).
 */
export function findNearestFaceIndex(cubeQuaternion: THREE.Quaternion): number {
  let bestIndex = 0;
  let maxDot = -Infinity;
  const tempNormal = new THREE.Vector3();

  for (let i = 0; i < FACES_CONFIG.length; i++) {
    const face = FACES_CONFIG[i];
    tempNormal.set(face.normal[0], face.normal[1], face.normal[2]);
    tempNormal.applyQuaternion(cubeQuaternion);
    // Camera is along +Z, looking at (0, 0, 0). Outward face normal pointing towards camera has high Z.
    const dot = tempNormal.z;
    if (dot > maxDot) {
      maxDot = dot;
      bestIndex = i;
    }
  }

  return bestIndex;
}
