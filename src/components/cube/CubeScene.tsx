import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { EnergyCube } from './EnergyCube';
import { InnerConfigOverrides } from './InnerMechanism';
import { useAppStore } from '../../store/useAppStore';
import { getServiceByIndex } from '../../config/services.config';
import { CUBE_THEME_CONFIG, QualityPreset } from '../../config/cubeTheme.config';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function CameraRig() {
  const { activeFaceIndex } = useAppStore();
  const prefersReduced = useReducedMotion();

  useFrame((state, delta) => {
    // Zoom in and shift leftward when a service detail inspector is active
    const targetZ = activeFaceIndex !== null ? 5.8 : 7.8;
    const targetX = activeFaceIndex !== null && window.innerWidth > 900 ? -1.4 : 0;
    const targetY = 0;

    const factor = prefersReduced ? 1 : 1 - Math.exp(-delta * 7);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, factor);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, factor);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, factor);
    state.camera.lookAt(targetX * 0.35, 0, 0);
  });

  return null;
}

export const CubeScene: React.FC = () => {
  const { activeFaceIndex, setHasInteracted, isDraggingCube } = useAppStore();
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoverData, setHoverData] = useState<{
    faceIndex: number | null;
    x: number;
    y: number;
  }>({
    faceIndex: null,
    x: 0,
    y: 0,
  });

  // Inner Mechanism Debug State (?debug=inner)
  const isDebugInner = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('debug=inner');
  }, []);

  const [innerOverrides, setInnerOverrides] = useState<InnerConfigOverrides>({
    INNER_PLASMA_SIZE: CUBE_THEME_CONFIG.INNER_PLASMA_SIZE,
    INNER_WIRE_SIZE: CUBE_THEME_CONFIG.INNER_WIRE_SIZE,
    ROT_SPEED_PLASMA: CUBE_THEME_CONFIG.ROT_SPEED_PLASMA,
    ROT_SPEED_WIRE: CUBE_THEME_CONFIG.ROT_SPEED_WIRE,
    PULSE_AMOUNT: CUBE_THEME_CONFIG.PULSE_AMOUNT,
    PLASMA_INTENSITY: CUBE_THEME_CONFIG.PLASMA_INTENSITY,
    PLASMA_ALPHA: CUBE_THEME_CONFIG.PLASMA_ALPHA,
    SPARK_COUNT: CUBE_THEME_CONFIG.SPARK_COUNT,
    HOVER_SPEEDUP: CUBE_THEME_CONFIG.HOVER_SPEEDUP,
    QUALITY: CUBE_THEME_CONFIG.QUALITY,
  });

  const [showFacesInDebug, setShowFacesInDebug] = useState(false);

  // Performance optimization: Pause animation loop when off-screen or tab hidden
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isOnScreen, setIsOnScreen] = useState(true);

  useEffect(() => {
    const handleVis = () => {
      setIsTabVisible(document.visibilityState !== 'hidden');
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOnScreen(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isDebugLayers = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('debug=layers');
  }, []);

  // Detect touch devices to completely eliminate sticky hover tooltips on mobile
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none)').matches
    );
  }, []);

  const handleHoverFace = (faceIndex: number | null, clientX: number, clientY: number) => {
    // Suppress hover tracking entirely on touch devices
    if (isTouchDevice) return;
    setHoverData({ faceIndex, x: clientX, y: clientY });
  };

  const hoveredService = hoverData.faceIndex !== null ? getServiceByIndex(hoverData.faceIndex) : null;

  const cursorClass = isDraggingCube
    ? 'cursor-grabbing'
    : hoverData.faceIndex !== null && !isTouchDevice
    ? 'cursor-pointer'
    : 'cursor-grab';

  // Quality settings for sparkle count
  const effectiveQuality = innerOverrides.QUALITY ?? CUBE_THEME_CONFIG.QUALITY;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const sparkleCount = isMobile
    ? effectiveQuality === 'low'
      ? 0
      : 20
    : effectiveQuality === 'high'
    ? 80
    : effectiveQuality === 'medium'
    ? 45
    : 15;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      style={{ touchAction: 'pan-y' }} // Allows vertical browser scroll while gesture classifier locks horizontal rotation
    >
      {/* Debug Layers Legend banner when ?debug=layers is active */}
      {isDebugLayers && (
        <div className="fixed top-18 sm:top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-void-deep/95 border border-yellow-400 text-yellow-300 font-mono text-[11px] sm:text-xs shadow-2xl backdrop-blur-xl pointer-events-none">
          <span className="font-bold text-white">[DEBUG LAYERS (Keys 1-6)]:</span>
          <span>1:Halo</span>
          <span className="text-white/30">|</span>
          <span>2:Glow</span>
          <span className="text-white/30">|</span>
          <span>3:Core</span>
          <span className="text-white/30">|</span>
          <span>4:Lattice</span>
          <span className="text-white/30">|</span>
          <span>5:Faces</span>
          <span className="text-white/30">|</span>
          <span>6:Edges</span>
        </div>
      )}

      {/* Cyberpunk Floating Sliders HUD when ?debug=inner is active */}
      {isDebugInner && (
        <div className="fixed top-20 right-4 z-50 w-80 max-h-[85vh] overflow-y-auto p-4 rounded-2xl bg-void-deep/95 border border-cyan-electric/40 shadow-2xl backdrop-blur-2xl text-xs font-mono text-cyan-electric flex flex-col gap-3 select-text">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-electric/20">
            <span className="font-display font-bold text-white tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-electric animate-pulse" />
              INNER DEBUG HUD
            </span>
            <span className="text-[10px] text-text-dim px-2 py-0.5 rounded bg-white/5 border border-white/10">
              ?debug=inner
            </span>
          </div>

          {/* Toggle Faces Visibility */}
          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <span className="text-white font-sans text-xs">Show Outer Glass Shell:</span>
            <input
              type="checkbox"
              checked={showFacesInDebug}
              onChange={(e) => setShowFacesInDebug(e.target.checked)}
              className="accent-cyan-electric w-4 h-4 cursor-pointer"
            />
          </label>

          {/* Quality Presets */}
          <div className="flex flex-col gap-1">
            <span className="text-text-dim text-[10px] uppercase tracking-wider">Quality Preset:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['low', 'medium', 'high'] as QualityPreset[]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInnerOverrides((prev) => ({ ...prev, QUALITY: q }))}
                  className={`py-1 text-[11px] rounded uppercase font-bold transition-all ${
                    innerOverrides.QUALITY === q
                      ? 'bg-cyan-electric text-void-deep shadow-neon-cyan'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-2.5 pt-1">
            {/* Plasma Size */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">INNER_PLASMA_SIZE:</span>
                <span className="text-white font-bold">{innerOverrides.INNER_PLASMA_SIZE?.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.40"
                step="0.02"
                value={innerOverrides.INNER_PLASMA_SIZE ?? 1.10}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, INNER_PLASMA_SIZE: parseFloat(e.target.value) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Wire Size */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">INNER_WIRE_SIZE:</span>
                <span className="text-white font-bold">{innerOverrides.INNER_WIRE_SIZE?.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.00"
                max="1.55"
                step="0.02"
                value={innerOverrides.INNER_WIRE_SIZE ?? 1.35}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, INNER_WIRE_SIZE: parseFloat(e.target.value) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rot Speed Plasma */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">ROT_SPEED_PLASMA:</span>
                <span className="text-white font-bold">{innerOverrides.ROT_SPEED_PLASMA?.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.00"
                max="1.20"
                step="0.05"
                value={innerOverrides.ROT_SPEED_PLASMA ?? 0.35}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, ROT_SPEED_PLASMA: parseFloat(e.target.value) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rot Speed Wire */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">ROT_SPEED_WIRE:</span>
                <span className="text-white font-bold">{innerOverrides.ROT_SPEED_WIRE?.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.00"
                max="1.00"
                step="0.05"
                value={innerOverrides.ROT_SPEED_WIRE ?? 0.25}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, ROT_SPEED_WIRE: parseFloat(e.target.value) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Pulse Amount */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">PULSE_AMOUNT:</span>
                <span className="text-white font-bold">{innerOverrides.PULSE_AMOUNT?.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.000"
                max="0.080"
                step="0.005"
                value={innerOverrides.PULSE_AMOUNT ?? 0.03}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, PULSE_AMOUNT: parseFloat(e.target.value) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Plasma Intensity */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">PLASMA_INTENSITY:</span>
                <span className="text-white font-bold">{innerOverrides.PLASMA_INTENSITY?.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.30"
                max="1.20"
                step="0.05"
                value={innerOverrides.PLASMA_INTENSITY ?? 0.85}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, PLASMA_INTENSITY: parseFloat(e.target.value) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Plasma Alpha */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">PLASMA_ALPHA:</span>
                <span className="text-white font-bold">{innerOverrides.PLASMA_ALPHA?.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.95"
                step="0.05"
                value={innerOverrides.PLASMA_ALPHA ?? 0.50}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, PLASMA_ALPHA: parseFloat(e.target.value) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Spark Count */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">SPARK_COUNT:</span>
                <span className="text-white font-bold">{innerOverrides.SPARK_COUNT}</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={innerOverrides.SPARK_COUNT ?? 4}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, SPARK_COUNT: parseInt(e.target.value, 10) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Hover Speedup */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">HOVER_SPEEDUP:</span>
                <span className="text-white font-bold">{innerOverrides.HOVER_SPEEDUP?.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={innerOverrides.HOVER_SPEEDUP ?? 1.4}
                onChange={(e) => setInnerOverrides((p) => ({ ...p, HOVER_SPEEDUP: parseFloat(e.target.value) }))}
                className="accent-cyan-electric h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={() =>
              setInnerOverrides({
                INNER_PLASMA_SIZE: CUBE_THEME_CONFIG.INNER_PLASMA_SIZE,
                INNER_WIRE_SIZE: CUBE_THEME_CONFIG.INNER_WIRE_SIZE,
                ROT_SPEED_PLASMA: CUBE_THEME_CONFIG.ROT_SPEED_PLASMA,
                ROT_SPEED_WIRE: CUBE_THEME_CONFIG.ROT_SPEED_WIRE,
                PULSE_AMOUNT: CUBE_THEME_CONFIG.PULSE_AMOUNT,
                PLASMA_INTENSITY: CUBE_THEME_CONFIG.PLASMA_INTENSITY,
                PLASMA_ALPHA: CUBE_THEME_CONFIG.PLASMA_ALPHA,
                SPARK_COUNT: CUBE_THEME_CONFIG.SPARK_COUNT,
                HOVER_SPEEDUP: CUBE_THEME_CONFIG.HOVER_SPEEDUP,
                QUALITY: CUBE_THEME_CONFIG.QUALITY,
              })
            }
            className="w-full mt-2 py-1.5 rounded-lg border border-cyan-electric/40 bg-cyan-electric/10 text-cyan-electric font-semibold hover:bg-cyan-electric/20 transition-all text-center"
          >
            Reset Defaults
          </button>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={isTabVisible && isOnScreen ? 'always' : 'demand'}
        onPointerDown={() => setHasInteracted()}
        className={`w-full h-full ${cursorClass}`}
        style={{ touchAction: 'pan-y' }}
      >
        <CameraRig />

        {/* Ambient & Directed Cyber Lighting */}
        <ambientLight intensity={0.65} />
        <pointLight position={[10, 10, 10]} intensity={1.3} color="#4fd8ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.9} color="#ff5aa5" />
        <pointLight position={[0, -8, 6]} intensity={0.5} color="#0a3cff" />

        {/* Floating Sparks */}
        {!prefersReduced && sparkleCount > 0 && (
          <Sparkles
            count={sparkleCount}
            scale={7.5}
            size={2.5}
            speed={0.4}
            opacity={0.65}
            color="#4fd8ff"
          />
        )}

        {/* Floating Energy Cube Ensemble */}
        <Float
          speed={prefersReduced ? 0 : 1.6}
          rotationIntensity={prefersReduced || activeFaceIndex !== null ? 0 : 0.15}
          floatIntensity={prefersReduced || activeFaceIndex !== null ? 0 : 0.5}
        >
          <EnergyCube
            onHoverFace={handleHoverFace}
            quality={effectiveQuality}
            innerOverrides={innerOverrides}
            hideFaces={isDebugInner && !showFacesInDebug}
          />
        </Float>
      </Canvas>

      {/* Floating Hover Tooltip Card (Only on desktop mouse devices, never sticky on touch) */}
      {hoveredService && activeFaceIndex === null && !isTouchDevice && (
        <div
          style={{
            left: `${Math.min(window.innerWidth - 180, Math.max(160, hoverData.x))}px`,
            top: `${Math.max(80, hoverData.y - 80)}px`,
          }}
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-full px-4 py-3 rounded-2xl font-body text-xs text-white bg-void-deep/95 border border-cyan-electric/40 shadow-glass backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1.5 min-w-[260px] max-w-[300px]"
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="font-display text-xs font-bold uppercase tracking-wider"
              style={{ color: hoveredService.accentColor }}
            >
              {hoveredService.title}
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-cyan-electric border border-cyan-electric/30">
              Face 0{hoveredService.faceIndex + 1}
            </span>
          </div>

          <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
            {hoveredService.tagline}
          </p>

          <div className="flex flex-col gap-1 py-1 border-t border-white/10 text-[10px]">
            <span className="text-text-dim uppercase font-mono tracking-wider">Key Benefits:</span>
            {hoveredService.benefits.slice(0, 2).map((b, i) => (
              <span key={i} className="text-white truncate flex items-center gap-1.5">
                <span
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ backgroundColor: hoveredService.accentColor }}
                />
                <span className="truncate">{b}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pt-1 border-t border-white/10 text-[10px] text-text-dim">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-pulse" />
            <span>Click to explore or press [{hoveredService.faceIndex + 1}]</span>
          </div>
        </div>
      )}
    </div>
  );
};
