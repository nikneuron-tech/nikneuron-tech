import React, { useEffect, useRef, useState, memo } from 'react';
import { cn } from '@/lib/utils';

export interface AsmrBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  particleCount?: number;
  interactive?: boolean;
  galaxyIntensity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  angle: number;
  distFromCenter: number;
  isBand: boolean;
  isCore: boolean;
  isDust: boolean;
  isBright: boolean;
  size: number;
  color: [number, number, number];
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  depth: number;
  friction: number;
}

interface ShootingStarState {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  decay: number;
}

export const AsmrBackground: React.FC<AsmrBackgroundProps> = memo(({
  className,
  children,
  particleCount,
  interactive = true,
  galaxyIntensity = 0.8,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [hasFinePointer, setHasFinePointer] = useState<boolean>(false);

  useEffect(() => {
    // 1. Device and preference checks
    const finePointerMedia = window.matchMedia('(pointer: fine)');
    setHasFinePointer(finePointerMedia.matches);

    const onPointerMediaChange = (e: MediaQueryListEvent) => setHasFinePointer(e.matches);
    if (finePointerMedia.addEventListener) {
      finePointerMedia.addEventListener('change', onPointerMediaChange);
    }

    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReduced = reducedMotionMedia.matches;

    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // 2. Offscreen Canvas for Pre-rendered Nebula & Dust Lanes
    let offscreenCanvas = document.createElement('canvas');
    let offscreenCtx = offscreenCanvas.getContext('2d');

    // 3. Viewport and DPR initialization
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Dynamic particle count detection
    const isMobile = width < 768;
    const targetParticleCount = particleCount ?? (isMobile ? 600 : 1400);

    let particles: Particle[] = [];
    let animId: number = 0;
    let lastTime = performance.now();
    let galacticRotation = 0;
    const rotationSpeed = 0.002; // ~0.002 rad/sec

    // Interactive pointer state
    const pointer = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      isDown: false,
    };

    // Shooting star state
    const shootingStar: ShootingStarState = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      length: 0,
      life: 0,
      decay: 0.02,
    };
    let nextShootingStarTime = performance.now() + 8000 + Math.random() * 7000;

    // Adaptive Performance Monitor
    const frameTimes: number[] = [];
    let activeParticlesCount = targetParticleCount;

    // Pre-render Nebula and Galactic Dust Clouds onto Offscreen Canvas
    const preRenderNebula = (w: number, h: number) => {
      offscreenCanvas.width = Math.floor(w * dpr);
      offscreenCanvas.height = Math.floor(h * dpr);
      if (!offscreenCtx) return;

      offscreenCtx.save();
      offscreenCtx.scale(dpr, dpr);

      // Deep void space base
      offscreenCtx.fillStyle = '#05060d';
      offscreenCtx.fillRect(0, 0, w, h);

      // Faint radial vignette
      const diag = Math.sqrt(w * w + h * h);
      const vignette = offscreenCtx.createRadialGradient(w / 2, h / 2, diag * 0.1, w / 2, h / 2, diag * 0.65);
      vignette.addColorStop(0, 'rgba(5, 6, 13, 0)');
      vignette.addColorStop(0.7, 'rgba(3, 4, 9, 0.45)');
      vignette.addColorStop(1, 'rgba(2, 2, 6, 0.85)');
      offscreenCtx.fillStyle = vignette;
      offscreenCtx.fillRect(0, 0, w, h);

      // Galactic core glow & nebula clouds along -25 degree tilt
      const bandAngle = -25 * (Math.PI / 180);
      const cx = w / 2;
      const cy = h / 2;
      const intensity = Math.max(0.1, Math.min(1.0, galaxyIntensity));

      // Golden warm galactic core glow
      const coreGlow = offscreenCtx.createRadialGradient(cx, cy, 5, cx, cy, Math.min(w, h) * 0.35);
      coreGlow.addColorStop(0, `rgba(255, 230, 190, ${0.14 * intensity})`);
      coreGlow.addColorStop(0.3, `rgba(255, 200, 140, ${0.08 * intensity})`);
      coreGlow.addColorStop(0.65, `rgba(180, 140, 240, ${0.04 * intensity})`);
      coreGlow.addColorStop(1, 'rgba(10, 15, 30, 0)');
      offscreenCtx.fillStyle = coreGlow;
      offscreenCtx.fillRect(0, 0, w, h);

      // Layered clouds along the galactic spine
      const cosA = Math.cos(bandAngle);
      const sinA = Math.sin(bandAngle);
      const spineLength = diag * 0.95;
      const steps = 18;

      for (let i = 0; i < steps; i++) {
        const t = (i / (steps - 1) - 0.5) * spineLength;
        const px = cx + t * cosA + (Math.sin(i * 1.7) * 35);
        const py = cy + t * sinA + (Math.cos(i * 2.3) * 35);
        const radius = Math.min(w, h) * (0.18 + (Math.sin(i * 3.1) + 1) * 0.08);

        // Mix deep indigo, violet, and soft teal
        const colorType = i % 3;
        let c1 = `rgba(35, 20, 85, ${0.09 * intensity})`;
        let c2 = `rgba(18, 12, 50, ${0.04 * intensity})`;
        if (colorType === 1) {
          c1 = `rgba(60, 20, 95, ${0.08 * intensity})`;
          c2 = `rgba(30, 10, 60, ${0.03 * intensity})`;
        } else if (colorType === 2) {
          c1 = `rgba(15, 55, 75, ${0.07 * intensity})`;
          c2 = `rgba(8, 30, 48, ${0.03 * intensity})`;
        }

        const cloudGrad = offscreenCtx.createRadialGradient(px, py, 0, px, py, radius);
        cloudGrad.addColorStop(0, c1);
        cloudGrad.addColorStop(0.5, c2);
        cloudGrad.addColorStop(1, 'rgba(5, 6, 13, 0)');

        offscreenCtx.fillStyle = cloudGrad;
        offscreenCtx.beginPath();
        offscreenCtx.arc(px, py, radius, 0, Math.PI * 2);
        offscreenCtx.fill();
      }

      // Dark dust lanes (Great Rift silhouette carving through the band)
      offscreenCtx.save();
      for (let j = 0; j < 9; j++) {
        const t = (j / 8 - 0.5) * (spineLength * 0.7);
        // Slightly offset perpendicular to the band
        const perpX = -sinA * (22 + (j % 3) * 12);
        const perpY = cosA * (22 + (j % 3) * 12);
        const dx = cx + t * cosA + perpX;
        const dy = cy + t * sinA + perpY;
        const r = Math.min(w, h) * (0.08 + (j % 4) * 0.03);

        const dustGrad = offscreenCtx.createRadialGradient(dx, dy, 0, dx, dy, r);
        dustGrad.addColorStop(0, 'rgba(4, 4, 9, 0.45)');
        dustGrad.addColorStop(0.6, 'rgba(4, 4, 9, 0.2)');
        dustGrad.addColorStop(1, 'rgba(4, 4, 9, 0)');

        offscreenCtx.fillStyle = dustGrad;
        offscreenCtx.beginPath();
        offscreenCtx.arc(dx, dy, r, 0, Math.PI * 2);
        offscreenCtx.fill();
      }
      offscreenCtx.restore();

      offscreenCtx.restore();
    };

    // Color palettes
    const paletteBlueWhite: [number, number, number] = [200, 220, 255];
    const paletteWarmCream: [number, number, number] = [255, 240, 210];
    const paletteSoftViolet: [number, number, number] = [160, 130, 255];
    const paletteDustyRose: [number, number, number] = [255, 150, 200];
    const paletteCharcoal: [number, number, number] = [80, 80, 85];
    const paletteCoreWarm: [number, number, number] = [255, 230, 190];

    // Initialize Particles (Width & Height MUST be set first!)
    const initParticles = (w: number, h: number, count: number) => {
      particles = [];
      const cx = w / 2;
      const cy = h / 2;
      const bandAngle = -25 * (Math.PI / 180);
      const cosA = Math.cos(bandAngle);
      const sinA = Math.sin(bandAngle);
      const diag = Math.sqrt(w * w + h * h);
      const bandSpread = Math.min(w, h) * 0.13;

      for (let i = 0; i < count; i++) {
        // 65% in Galactic Band, 35% scattered background stars
        const isBand = i < count * 0.65;
        let px = 0;
        let py = 0;
        let isCore = false;
        let isDust = false;

        if (isBand) {
          // Box-Muller Gaussian distribution across the band
          const u1 = Math.max(1e-7, Math.random());
          const u2 = Math.random();
          const gaussian = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          const perpOffset = gaussian * bandSpread;

          // Longitudinal distance along band
          const s = (Math.random() + Math.random() - 1.0) * (diag * 0.55);

          px = cx + s * cosA - perpOffset * sinA;
          py = cy + s * sinA + perpOffset * cosA;

          // Core cluster detection
          if (Math.abs(s) < diag * 0.15 && Math.abs(perpOffset) < bandSpread * 0.7) {
            isCore = true;
          }

          // Interstellar charcoal dust grains (~4% of band)
          if (!isCore && Math.random() < 0.045) {
            isDust = true;
          }
        } else {
          // Scattered background stars
          px = Math.random() * w;
          py = Math.random() * h;
        }

        // Color selection according to galactic hierarchy
        let color: [number, number, number];
        if (isDust) {
          color = paletteCharcoal;
        } else if (isCore) {
          color = Math.random() > 0.4 ? paletteCoreWarm : paletteWarmCream;
        } else if (isBand) {
          const rand = Math.random();
          if (rand < 0.45) color = paletteBlueWhite;
          else if (rand < 0.75) color = paletteSoftViolet;
          else if (rand < 0.90) color = paletteWarmCream;
          else color = paletteDustyRose;
        } else {
          const rand = Math.random();
          if (rand < 0.5) color = paletteBlueWhite;
          else if (rand < 0.8) color = paletteWarmCream;
          else color = paletteSoftViolet;
        }

        // Depth assignment: 0.3 (distant, slow, faint) to 1.0 (foreground, sharp, reactive)
        const depth = 0.3 + Math.random() * 0.7;

        // Visual properties
        const isBright = !isDust && Math.random() < 0.03; // 3% bright stars with 4-point flare
        const baseSize = isDust ? 0.7 : isCore ? 1.1 + Math.random() * 1.5 : 0.6 + Math.random() * 1.3;
        const size = baseSize * depth * (isBright ? 1.4 : 1.0);

        const distFromCenter = Math.hypot(px - cx, py - cy);
        const angle = Math.atan2(py - cy, px - cx);

        particles.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 0.2 * depth,
          vy: (Math.random() - 0.5) * 0.2 * depth,
          baseX: px,
          baseY: py,
          angle,
          distFromCenter,
          isBand,
          isCore,
          isDust,
          isBright,
          size,
          color,
          baseAlpha: isDust ? 0.3 : 0.35 + Math.random() * 0.55 * depth,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.8 + Math.random() * 2.2,
          depth,
          friction: 0,
        });
      }
    };

    // Full screen canvas sizing
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      preRenderNebula(width, height);
      initParticles(width, height, targetParticleCount);
      activeParticlesCount = targetParticleCount;
    };

    // Run initial setup
    handleResize();

    // Debounced Resize Listener
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        handleResize();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    // Pointer coordinates & interaction tracking
    const updatePointerPos = (clientX: number, clientY: number) => {
      pointer.targetX = clientX;
      pointer.targetY = clientY;
      pointer.active = true;

      // Update sleek custom cursor directly through DOM ref
      if (cursor && finePointerMedia.matches) {
        cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        cursor.style.opacity = '1';
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      updatePointerPos(e.clientX, e.clientY);
    };

    const onMouseDown = () => {
      pointer.isDown = true;
    };

    const onMouseUp = () => {
      pointer.isDown = false;
    };

    const onMouseLeave = () => {
      pointer.active = false;
      if (cursor) {
        cursor.style.opacity = '0';
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      const t = e.touches[0];
      pointer.isDown = true;
      updatePointerPos(t.clientX, t.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      const t = e.touches[0];
      updatePointerPos(t.clientX, t.clientY);
    };

    const onTouchEnd = () => {
      pointer.active = false;
      pointer.isDown = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // Spawn an occasional shooting star every 8 to 15 seconds
    const triggerShootingStar = (now: number) => {
      shootingStar.active = true;
      shootingStar.x = Math.random() * width * 0.8 + width * 0.1;
      shootingStar.y = Math.random() * height * 0.35;
      const angle = (25 + Math.random() * 30) * (Math.PI / 180);
      const speed = 14 + Math.random() * 9;
      shootingStar.vx = Math.cos(angle) * speed;
      shootingStar.vy = Math.sin(angle) * speed;
      shootingStar.length = 100 + Math.random() * 65;
      shootingStar.life = 1.0;
      shootingStar.decay = 0.016 + Math.random() * 0.012;
      nextShootingStarTime = now + 8000 + Math.random() * 7000;
    };

    // Render single static frame for reduced motion preference
    const renderStaticFrame = () => {
      ctx.drawImage(offscreenCanvas, 0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.baseAlpha})`;
        ctx.fill();

        if (p.isBright) {
          ctx.strokeStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.baseAlpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - 4, p.y);
          ctx.lineTo(p.x + 4, p.y);
          ctx.moveTo(p.x, p.y - 4);
          ctx.lineTo(p.x, p.y + 4);
          ctx.stroke();
        }
      }
    };

    // Main 60 FPS Render Loop with Motion-Blur Trails, Shards & Magnetic Vortex
    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Adaptive Performance: monitor frame times
      frameTimes.push(delta * 1000);
      if (frameTimes.length > 30) {
        frameTimes.shift();
        const avgFrameMs = frameTimes.reduce((acc, v) => acc + v, 0) / frameTimes.length;
        if (avgFrameMs > 20 && activeParticlesCount > 400) {
          activeParticlesCount = Math.floor(activeParticlesCount * 0.9);
        }
      }

      // 1. Motion-blur fill: keeps atmospheric friction trails
      ctx.fillStyle = 'rgba(5, 6, 13, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw cached offscreen nebula and dust layer with low opacity blend
      ctx.globalAlpha = 0.85;
      ctx.drawImage(offscreenCanvas, 0, 0, width, height);
      ctx.globalAlpha = 1.0;

      // 3. Smooth pointer interpolation
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.18;
        pointer.y += (pointer.targetY - pointer.y) * 0.18;
      }

      // 4. Slow Galactic Rotation and Parallax Shift
      galacticRotation += rotationSpeed * delta;
      const cx = width / 2;
      const cy = height / 2;
      const parallaxFactorX = pointer.active ? (pointer.x - cx) * 0.025 : 0;
      const parallaxFactorY = pointer.active ? (pointer.y - cy) * 0.025 : 0;

      // 5. Update & Render Particles
      const vortexRadius = isMobile ? 220 : 310;
      const vortexStrength = pointer.isDown ? 1.6 : 1.0;

      for (let i = 0; i < activeParticlesCount; i++) {
        const p = particles[i];

        // Galactic rotation around center for band stars
        if (p.isBand) {
          p.angle += rotationSpeed * delta * (0.8 + p.depth * 0.4);
          p.baseX = cx + Math.cos(p.angle) * p.distFromCenter;
          p.baseY = cy + Math.sin(p.angle) * p.distFromCenter;
        }

        // Return force towards baseline galactic location
        const homeDx = p.baseX - p.x;
        const homeDy = p.baseY - p.y;
        p.vx += homeDx * 0.012;
        p.vy += homeDy * 0.012;

        // Magnetic Vortex Attraction & Tangential Swirl
        let dist = 99999;
        if (interactive && pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          dist = Math.hypot(dx, dy);

          if (dist < vortexRadius && dist > 5) {
            const pullForce = (1 - dist / vortexRadius) * 0.85 * vortexStrength * p.depth;
            const normX = dx / dist;
            const normY = dy / dist;

            // Inward gravitational pull
            p.vx += normX * pullForce * 1.8;
            p.vy += normY * pullForce * 1.8;

            // Tangential swirl force (vortex spin)
            const swirlX = -normY;
            const swirlY = normX;
            p.vx += swirlX * pullForce * 2.4;
            p.vy += swirlY * pullForce * 2.4;

            // Atmospheric friction heating
            p.friction = Math.min(1.0, p.friction + 0.12);
          } else {
            p.friction = Math.max(0, p.friction - 0.03);
          }
        } else {
          p.friction = Math.max(0, p.friction - 0.03);
        }

        // Apply damping / atmospheric resistance
        p.vx *= 0.93;
        p.vy *= 0.93;

        p.x += p.vx;
        p.y += p.vy;

        // Depth parallax offset (closer stars shift slightly opposite to mouse)
        const renderX = p.x - parallaxFactorX * (1 - p.depth);
        const renderY = p.y - parallaxFactorY * (1 - p.depth);

        // Sine-based twinkle pulse
        p.twinklePhase += p.twinkleSpeed * delta;
        const twinkleAlpha = p.baseAlpha * (0.7 + 0.35 * Math.sin(p.twinklePhase));

        // Speed magnitude for aerodynamic shard rendering
        const speed = Math.hypot(p.vx, p.vy);
        const isFast = speed > 1.2;

        // Color & friction glow
        let r = p.color[0];
        let g = p.color[1];
        let b = p.color[2];
        let alpha = twinkleAlpha;

        if (p.friction > 0.05) {
          // Friction heat shifts color toward electric cyan/white
          const f = p.friction;
          r = Math.round(r * (1 - f) + 215 * f);
          g = Math.round(g * (1 - f) + 245 * f);
          b = Math.round(b * (1 - f) + 255 * f);
          alpha = Math.min(1.0, alpha + f * 0.45);
        }

        // Fast particles render as directional shards
        if (isFast && !p.isDust) {
          const stretch = Math.min(speed * 2.8, 14);
          const dir = Math.atan2(p.vy, p.vx);
          const tailX = renderX - Math.cos(dir) * stretch;
          const tailY = renderY - Math.sin(dir) * stretch;

          // ShadowBlur ONLY for the rare particles above the friction threshold
          if (p.friction > 0.85) {
            ctx.shadowColor = 'rgba(79, 216, 255, 0.9)';
            ctx.shadowBlur = 10;
          }

          ctx.beginPath();
          ctx.moveTo(renderX, renderY);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = Math.max(1, p.size * 0.9);
          ctx.lineCap = 'round';
          ctx.stroke();

          if (p.friction > 0.85) {
            ctx.shadowBlur = 0;
          }
        } else {
          // Normal star dot
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();

          // 4-point cross flare for bright foreground stars
          if (p.isBright && alpha > 0.4) {
            const flareLen = p.size * 3.2;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(renderX - flareLen, renderY);
            ctx.lineTo(renderX + flareLen, renderY);
            ctx.moveTo(renderX, renderY - flareLen);
            ctx.lineTo(renderX, renderY + flareLen);
            ctx.stroke();
          }
        }
      }

      // 6. Occasional Shooting Star
      if (now > nextShootingStarTime && !shootingStar.active) {
        triggerShootingStar(now);
      }

      if (shootingStar.active) {
        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.life -= shootingStar.decay;

        const tailX = shootingStar.x - (shootingStar.vx / 16) * shootingStar.length;
        const tailY = shootingStar.y - (shootingStar.vy / 16) * shootingStar.length;

        const streakGrad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
        streakGrad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.life})`);
        streakGrad.addColorStop(0.3, `rgba(160, 220, 255, ${shootingStar.life * 0.8})`);
        streakGrad.addColorStop(1, 'rgba(120, 180, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        if (shootingStar.life <= 0) {
          shootingStar.active = false;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    // Tab Visibility Handler: pause when hidden, resume when active
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      } else {
        if (!animId && !prefersReduced) {
          lastTime = performance.now();
          animId = requestAnimationFrame(loop);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Reduced motion listener
    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
      if (prefersReduced) {
        if (animId) cancelAnimationFrame(animId);
        renderStaticFrame();
      } else {
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);
      }
    };
    if (reducedMotionMedia.addEventListener) {
      reducedMotionMedia.addEventListener('change', onMotionChange);
    }

    // Start Animation or Static Frame
    if (prefersReduced) {
      renderStaticFrame();
    } else {
      animId = requestAnimationFrame(loop);
    }

    // Cleanup
    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (finePointerMedia.removeEventListener) {
        finePointerMedia.removeEventListener('change', onPointerMediaChange);
      }
      if (reducedMotionMedia.removeEventListener) {
        reducedMotionMedia.removeEventListener('change', onMotionChange);
      }
    };
  }, [interactive, galaxyIntensity, particleCount]);

  return (
    <div
      ref={containerRef}
      className={cn(
        children ? 'relative w-full min-h-screen' : 'fixed inset-0 -z-10 pointer-events-none',
        hasFinePointer && interactive && 'cursor-none',
        className
      )}
    >
      {/* Background Canvas Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        />
      </div>

      {/* Atmospheric Vortex Custom Cursor (rendered only on fine pointer devices) */}
      {hasFinePointer && interactive && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_20px_rgba(79,216,255,0.45)] opacity-0 will-change-transform z-50 mix-blend-screen transition-opacity duration-300"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#4fd8ff]" />
        </div>
      )}

      {/* Page Content Rendered Above Background */}
      {children}
    </div>
  );
});

AsmrBackground.displayName = 'AsmrBackground';

export default AsmrBackground;
