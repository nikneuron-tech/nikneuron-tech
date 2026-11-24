# Milky Way "Atmospheric Friction" ASMR Particle Background (`background.md`)

> **Component Location**: [`src/components/ui/asmr-background.tsx`](file:///f:/Nikneuron/src/components/ui/asmr-background.tsx)  
> **Interactive Demo**: [`src/components/ui/demo.tsx`](file:///f:/Nikneuron/src/components/ui/demo.tsx) & [`src/demo.tsx`](file:///f:/Nikneuron/src/demo.tsx)  
> **Root Integration**: [`src/App.tsx`](file:///f:/Nikneuron/src/App.tsx)  
> **Utility Core**: [`src/lib/utils.ts`](file:///f:/Nikneuron/src/lib/utils.ts)

---

## 1. Executive Summary & Aesthetic Philosophy

The **Atmospheric Friction Milky Way ASMR Background** is a high-performance, GPU-friendly HTML5 Canvas visual engine designed specifically for modern spatial web platforms and agency portfolios. It fuses:

1. **A Procedural Milky Way Galaxy**: A continuous diagonal galactic arm (-25° tilt) mapped using Box-Muller Gaussian density, a radiant warm galactic core, deep indigo/violet/teal nebular gas clouds, dark molecular interstellar dust lanes (the "Great Rift"), and subtle 4-point cross diffraction flares.
2. **Atmospheric Friction Physics**: Interactive magnetic vortex that draws stars toward the cursor or touch point, accelerating them into aerodynamic shards. High-velocity particles heat up through friction, glowing into intense electric blue-white trails with motion blur.
3. **ASMR Kinematics**: Smooth sine-wave twinkling, multi-layer depth parallax, slow cosmic rotation (0.002 rad/sec), and occasional shooting stars every 8–15 seconds.

---

## 2. Component API & Props Specification

```tsx
import { AsmrBackground } from '@/components/ui/asmr-background';
// or default import:
import AsmrBackground from '@/components/ui/asmr-background';
```

### TypeScript Interface

```typescript
export interface AsmrBackgroundProps {
  /** Optional additional CSS classes applied to the outer container */
  className?: string;

  /** Content rendered directly above the canvas */
  children?: React.ReactNode;

  /** Total particle count. When omitted, automatically adapts to viewport width (1400 desktop, 600 mobile) */
  particleCount?: number;

  /** Enables or disables the magnetic vortex, cursor glow, and touch swirling. Defaults to true */
  interactive?: boolean;

  /** Multiplier for the offscreen nebula gas clouds and core luminance (0.0 to 1.0). Defaults to 0.85 */
  galaxyIntensity?: number;
}
```

---

## 3. Mathematical & Physical Principles

### 3.1. Galactic Band & Gaussian Distribution
To replicate the natural density of the Milky Way, approximately **65% of all particles** are distributed across a diagonal galactic band tilted at $\theta = -25^\circ$:

$$\vec{u}_{\text{spine}} = (\cos\theta, \sin\theta), \quad \vec{n}_{\text{perp}} = (-\sin\theta, \cos\theta)$$

The perpendicular offset from the central spine is calculated using the **Box-Muller Transform** to achieve a natural Gaussian distribution ($\mu=0, \sigma=\text{bandSpread}$):

$$z = \sqrt{-2 \ln(u_1)} \cdot \cos(2\pi u_2), \quad \text{offset} = z \cdot \sigma$$

Where:
- $u_1, u_2 \sim \text{Uniform}(0, 1)$
- $\sigma = \min(\text{width}, \text{height}) \times 0.13$
- Longitudinal position $s \sim \text{Triangular}(-L_{\text{diag}} \cdot 0.55, L_{\text{diag}} \cdot 0.55)$

The remaining **35% of particles** are distributed uniformly across the entire screen as background and deep-field stars.

### 3.2. Magnetic Vortex & Tangential Swirl
When the user hovers or drags across the screen, a magnetic vortex field is projected within radius $R_{\text{vortex}}$ ($310\text{px}$ on desktop, $220\text{px}$ on mobile):

$$\vec{d} = \vec{p}_{\text{pointer}} - \vec{p}_{\text{particle}}, \quad r = \|\vec{d}\|$$

When $5 < r < R_{\text{vortex}}$:

1. **Centripetal Inward Pull**:
   $$\vec{F}_{\text{pull}} = \hat{d} \cdot \left(1 - \frac{r}{R_{\text{vortex}}}\right) \cdot 1.8 \cdot \kappa \cdot \text{depth}$$
2. **Tangential Swirl (Vortex Rotation)**:
   $$\vec{F}_{\text{swirl}} = (-\hat{d}_y, \hat{d}_x) \cdot \left(1 - \frac{r}{R_{\text{vortex}}}\right) \cdot 2.4 \cdot \kappa \cdot \text{depth}$$
3. **Atmospheric Friction**:
   $$\Delta \text{friction} = +0.12, \quad \text{decay} = -0.03/\text{frame}$$

Where $\kappa = 1.6$ when mouse is pressed down, and $1.0$ on hover.

### 3.3. Aerodynamic Velocity Shards
Particles traveling above threshold velocity ($v > 1.2\text{px/frame}$) morph from spherical points into directional shards aligned with their velocity angle:

$$\theta_{\text{dir}} = \text{atan2}(v_y, v_x), \quad L_{\text{shard}} = \min(v \times 2.8, 14\text{px})$$

The tail is drawn towards:

$$x_{\text{tail}} = x - \cos(\theta_{\text{dir}}) \cdot L_{\text{shard}}, \quad y_{\text{tail}} = y - \sin(\theta_{\text{dir}}) \cdot L_{\text{shard}}$$

### 3.4. Multi-Layer Depth & Parallax
Each star is assigned a normalized depth value $\delta \in [0.3, 1.0]$:
- **Distant stars** ($\delta \approx 0.3$): Smaller size ($0.4–0.8\text{px}$), lower base opacity ($0.2–0.4$), minimal response to mouse pull.
- **Foreground stars** ($\delta \approx 1.0$): Sharper size ($1.2–2.5\text{px}$), high opacity ($0.7–0.95$), vigorous response to vortex forces.
- **Parallax Shift**:
  $$x_{\text{rendered}} = x - (x_{\text{pointer}} - c_x) \times 0.025 \times (1 - \delta)$$
  $$y_{\text{rendered}} = y - (y_{\text{pointer}} - c_y) \times 0.025 \times (1 - \delta)$$

---

## 4. Offscreen Canvas & Performance Engineering

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ONE-TIME / RESIZE ONLY                          │
├────────────────────────────────────────────────────────────────────────┤
│  Offscreen Canvas:                                                     │
│   1. #05060d Void Base + Radial Vignette                               │
│   2. Golden Amber Galactic Core Glow (255, 230, 190)                   │
│   3. 18 Layered Radial Clouds (Indigo, Violet, Teal) along -25°        │
│   4. 9 Dark Molecular Dust Lanes (The Great Rift Silhouette)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Cached Bitmapped Image
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         EVERY FRAME (60 FPS)                           │
├────────────────────────────────────────────────────────────────────────┤
│  Main Viewport Canvas:                                                 │
│   1. Motion-blur fill: ctx.fillStyle = 'rgba(5,6,13,0.18)'             │
│   2. Blit Cached Nebula: ctx.drawImage(offscreenCanvas, 0, 0)          │
│   3. Integrate Physics & Magnetic Vortex Kinematics                    │
│   4. Draw Shards & Stars (shadowBlur restricted ONLY to friction>0.85) │
│   5. Render Shooting Star Streak (if triggered)                        │
└────────────────────────────────────────────────────────────────────────┘
```

### High-Performance Optimizations:
1. **Zero Per-Frame Radial Gradient Creation**: Gradients are generated only inside `preRenderNebula()` on initialization and debounced window resize.
2. **Selective `shadowBlur`**: HTML5 canvas `shadowBlur` is notoriously heavy. It is **disabled by default (`shadowBlur = 0`)** and only activated for the 5–15 particles actively undergoing extreme atmospheric friction (`friction > 0.85`).
3. **Adaptive Framerate Scaler**: Moving average of frame render time is measured over 30 frames. If the average duration exceeds $20\text{ms}$ (< 50 FPS), particle count is dynamically throttled down to ensure 60 FPS fluidity.
4. **Motion Blur Without Clearing**: Replacing `ctx.clearRect` with `ctx.fillStyle = 'rgba(5, 6, 13, 0.18)'; ctx.fillRect(...)` creates natural particle decay trails without allocating memory for historical path arrays.

---

## 5. Color Palette Reference

| Celestial Region | RGB Values | Visual Character |
|:---|:---|:---|
| **Galactic Core** | `rgb(255, 230, 190)` & `rgb(255, 240, 210)` | Radiant warm cream and soft amber |
| **Galactic Arms** | `rgb(200, 220, 255)` & `rgb(160, 130, 255)` | Cool blue-white and ethereal violet |
| **Star Clusters** | `rgb(255, 150, 200)` | Subtle dusty rose accents |
| **Dust Grains** | `rgb(80, 80, 85)` | Non-luminous charcoal interstellar dust |
| **Friction Glow** | `rgb(215, 245, 255)` | Hot electric cyan-white upon vortex acceleration |
| **Base Void** | `#05060d` | Deep space obsidian void with radial vignette |

---

## 6. Implementation & Integration Guide

### 6.1. Full-Page Background Wrapper (Recommended)

Wrap your top-level layout or page container inside [`src/App.tsx`](file:///f:/Nikneuron/src/App.tsx):

```tsx
import React from 'react';
import { AsmrBackground } from '@/components/ui/asmr-background';

export const App: React.FC = () => {
  return (
    <AsmrBackground galaxyIntensity={0.85}>
      <div className="relative w-full min-h-screen bg-transparent font-body text-white">
        {/* All your components, 3D Canvas, navigation, and sections sit here */}
        <Navbar />
        <main>
          <HeroSection />
          <ProjectsSection />
        </main>
        <Footer />
      </div>
    </AsmrBackground>
  );
};
```

### 6.2. Standalone Background Component

If you prefer placing it as a self-contained sibling:

```tsx
import { AsmrBackground } from '@/components/ui/asmr-background';

export const Hero: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen">
      {/* Renders fixed inset-0 -z-10 automatically */}
      <AsmrBackground galaxyIntensity={0.9} />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-5xl font-bold">Spatial Interfaces</h1>
      </div>
    </div>
  );
};
```

---

## 7. Tuning & Customization Reference

All primary visual knobs can be tuned directly in [`src/components/ui/asmr-background.tsx`](file:///f:/Nikneuron/src/components/ui/asmr-background.tsx):

| Variable | Line Location | Default Value | Description |
|:---|:---|:---|:---|
| `targetParticleCount` | Lines 77–78 | `1400` (desktop) / `600` (mobile) | Total particle count |
| `bandAngle` | Lines 105, 187 | `-25 * (Math.PI / 180)` | Milky Way band tilt angle |
| `rotationSpeed` | Line 84 | `0.002` rad/sec | Slow galactic drift velocity |
| `vortexRadius` | Line 400 | `310px` (desktop) / `220px` (mobile) | Radius of magnetic vortex influence |
| `vortexStrength` | Line 401 | `1.6` (click) / `1.0` (hover) | Inward attraction and swirl multiplier |
| `nextShootingStarTime` | Lines 100, 319 | `8000 + Math.random() * 7000` | Frequency between shooting star streaks (8–15s) |
| Motion-blur alpha | Line 378 | `0.18` in `'rgba(5, 6, 13, 0.18)'` | Higher value = shorter trails; lower = longer trails |

---

## 8. Accessibility & Responsiveness

1. **`prefers-reduced-motion`**:
   - Monitored via `window.matchMedia('(prefers-reduced-motion: reduce)')`.
   - When detected, animations and vortex listeners are halted, and a single high-fidelity static frame of the Milky Way is rendered.
2. **Tab Visibility (`document.visibilitychange`)**:
   - The `requestAnimationFrame` loop automatically pauses when the browser tab loses focus to conserve CPU and GPU power, resuming seamlessly when the user switches back.
3. **Cursor Hiding**:
   - `cursor-none` and the glowing ring are **only** active on fine-pointer devices (`(pointer: fine)`).
   - Mobile and tablet users retain default touch gestures, with touch positions mapped to vortex swirls.
4. **Non-blocking Input**:
   - Canvas has `pointer-events-none`.
   - Custom cursor has `pointer-events-none`.
   - All underlying page inputs, buttons, and links receive 100% of native pointer events without interference.
