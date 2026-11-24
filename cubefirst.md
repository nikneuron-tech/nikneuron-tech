# Nikneuron 3D Energy Cube — Complete Architecture & Construction Guide (`cubefirst.md`)

This document is the master technical reference for the **Nikneuron Central 3D Energy Cube**. It details the history, evolution, mathematical foundations, custom GLSL shaders, procedural canvas graphics, touch interaction systems, and component architecture used to build the floating cybernetic energy mechanism.

---

## Table of Contents
1. [Visual Vision & Design Aesthetics](#1-visual-vision--design-aesthetics)
2. [Evolution: How the Previous Rotating Cube Evolved into the Living Tesseract](#2-evolution-how-the-previous-rotating-cube-evolved-into-the-living-tesseract)
3. [The Complete 6-Layer Rendering Architecture](#3-the-complete-6-layer-rendering-architecture)
4. [The Inner Rotating Mechanism (`InnerMechanism.tsx`)](#4-the-inner-rotating-mechanism-innermechanismtsx)
5. [The Custom GLSL Plasma Shader with Energy Veins](#5-the-custom-glsl-plasma-shader-with-energy-veins)
6. [Outer Glass Shell & 1024x1024 Procedural Canvas Faces (`CubeFace.tsx`)](#6-outer-glass-shell--1024x1024-procedural-canvas-faces-cubefacetsx)
7. [Quaternion Face Snapping, Inertia & Camera Rig](#7-quaternion-face-snapping-inertia--camera-rig)
8. [Touch Gesture Classifier & Selection Flow](#8-touch-gesture-classifier--selection-flow)
9. [Dynamic State Reactions (Hover, Drag, Ripple, Idle)](#9-dynamic-state-reactions-hover-drag-ripple-idle)
10. [Configuration Dictionary & Live Debug HUD (`?debug=inner`)](#10-configuration-dictionary--live-debug-hud-debuginner)
11. [Performance, Accessibility & Zero-Allocation Rules](#11-performance-accessibility--zero-allocation-rules)

---

## 1. Visual Vision & Design Aesthetics

The central Energy Cube is the focal centerpiece of the Nikneuron interface. Rather than a static textured 3D model, it is engineered as a **living cybernetic engine trapped inside a floating translucent glass shell**.

Looking through the semi-transparent glass faces, the user perceives continuous depth:
- A rounded plasma cube tumbling slowly on two axes.
- A counter-rotating wireframe cage with 8 glowing corner nodes turning in the opposite direction, creating a high-tech tesseract depth illusion.
- A brilliant clamped energy nucleus pulsing at the center.
- A 35° tilted orbit ring carrying glowing spark particles.
- Six interactive glass service faces presenting Nikneuron's offerings with neon reticles, crisp typography, and status indicators.

### Curated Color Palette
| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Electric Cyan** | `#4fd8ff` | Primary neon energy, edge lines, corner reticles, outer rim glow |
| **Hot Magenta / Pink** | `#ff5aa5` | Secondary cyber accent, complementary lighting, Batch Mail service |
| **Cobalt / Deep Blue** | `#0a3cff` | Deep plasma foundation, space nebula tint, grounding shadow |
| **Mid Energy Blue** | `#1f7bff` | Plasma transition gradient |
| **Hot Pale Cyan** | `#cfefff` | Clamped energy core highlights (strictly under 10% coverage) |
| **Deep Void** | `#050612` | Dark background scrims, canvas backdrops, modal surfaces |

---

## 2. Evolution: How the Previous Rotating Cube Evolved into the Living Tesseract

Understanding how the cube evolved explains every architectural decision in the current codebase.

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│       Version 1:        │     │       Version 2:        │     │  Version 3 (Current):   │
│   The Original Box      │     │   The Spherical Core    │     │ The Living Tesseract    │
├─────────────────────────┤     ├─────────────────────────┤     ├─────────────────────────┤
│ • Flat BoxGeometry(1.7) │ ──> │ • Icosahedron sphere    │ ──> │ • RoundedBox (r=0.08)   │
│ • Uniform face normals  │     │ • Smooth normals        │     │ • Smooth beveled normals│
│ • White blowout bug     │     │ • Lost the cube look    │     │ • Counter-rotating wire │
│ • Additive blending     │     │ • Pure sphere inside    │     │ • Clamped nucleus+sparks│
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

### The Original Version (Version 1)
- **Concept**: A 2.4-unit outer glass box with a 1.7-unit `BoxGeometry` inner plasma core running a wave distortion shader.
- **The Problem**: Because standard `BoxGeometry` has only 6 flat face normals (perpendicular to each face), the Fresnel equation produced a uniform scalar value across the entire face. Combined with additive blending and values exceeding 1.0, the inner cube rendered as a **flat, pure-white opaque square** that obscured the service face graphics.

### The Interim Fix (Version 2)
- Replaced the inner `BoxGeometry` with a spherical `IcosahedronGeometry(detail: 4)`.
- Solved the blowout because sphere normals vary smoothly from center to edge.
- **The Drawback**: It lost the distinct aesthetic of a **cube rotating inside another cube**.

### The Definitive Upgrade (Version 3 — Current Masterpiece)
- **Geometry Solution**: Uses `@react-three/drei`'s `<RoundedBox args={[1.10, 1.10, 1.10]} radius={0.08} smoothness={4} />`. The beveled edges provide continuously curving normals around all 12 edges and 8 vertices, completely eliminating flat-side glow.
- **Tesseract Depth**: Adds an outer wireframe cube (`size: 1.35`) rotating in the **opposite direction** with 8 instanced corner nodes.
- **Energy Nucleus & Orbit**: Adds a central clamped icosahedron with an additive billboard glow sprite and a 35° tilted orbit ring carrying sparks.
- **Shader Safety**: Concludes all color output with `color = min(color, vec3(0.90));` and enforces `THREE.NormalBlending` so pixel values never exceed 230/255.

---

## 3. The Complete 6-Layer Rendering Architecture

All layers are grouped under a single floating pivot in [EnergyCube.tsx](file:///f:/Nikneuron/src/components/cube/EnergyCube.tsx) and sorted using explicit `renderOrder`. Every transparent layer sets `depthWrite = false` to guarantee artifact-free alpha blending.

```
+Z (Toward Camera)
  ▲
  │   [Layer 6]   Glowing Neon Outer Edges (LineSegments, 2.4 Box, renderOrder: 6)
  │   [Layer 5.5] Holographic Scanline Sweep (PlaneGeometry, renderOrder: 5.5)
  │   [Layer 5]   Outer Glass Shell Faces (6-Material Box, renderOrder: 5, polygonOffset: true)
  │   [Layer 4.5] Tilted Orbit Ring & Sparks (Torus + Spheres, renderOrder: 4.5)
  │   [Layer 4]   Energy Nucleus (Icosahedron, renderOrder: 4)
  │   [Layer 3]   Rounded Plasma Cube (RoundedBox, renderOrder: 3)
  │   [Layer 2]   Wireframe Cube & 8 Corner Nodes (Edges + InstancedMesh, renderOrder: 2)
  │   [Layer 1]   Nucleus Soft Glow Billboard (CanvasTexture, renderOrder: 1)
  │   [Layer 0]   Space Light Halo (Billboard Disc, z = -0.6, renderOrder: 0)
  ▼
-Z (Away from Camera)
```

### Layer Specification Table

| Layer | Component / Primitive | Geometry & Dimensions | Material / Blending | `renderOrder` | Key Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0. Space Halo** | `<mesh>` | `PlaneGeometry(6.5, 6.5)` at $z = -0.6$ | `MeshBasicMaterial`, Additive, `opacity: 0.55` | `0` | Atmospheric deep-space backlight |
| **1. Glow Sprite** | `<mesh>` in `InnerMechanism` | `PlaneGeometry(1.2, 1.2)` at origin | Radial CanvasTexture, Additive, `opacity: 0.22` | `1` | Diffuse glow behind core |
| **2. Wire Cube + Nodes** | `<group>` in `InnerMechanism` | `EdgesGeometry(1.35)` + `InstancedMesh(8)` | Cyan `#4fd8ff`, Additive, `depthWrite: false` | `2` | Counter-rotating tesseract cage |
| **3. Plasma Cube** | `<RoundedBox>` in `InnerMechanism` | $1.10 \times 1.10 \times 1.10$, $r = 0.08$ | Custom GLSL, NormalBlending, `toneMapped: true` | `3` | Tumbling fluid energy cube |
| **4. Nucleus** | `<mesh>` in `InnerMechanism` | `IcosahedronGeometry(0.26, 3)` | Clamped cyan `#4fd8ff`, NormalBlending | `4` | Pulsing center energy seed |
| **4.5. Orbit Sparks** | `<group>` in `InnerMechanism` | `TorusGeometry(0.55, 0.01)` tilted 35° | Additive glow spheres (`#cfefff` / `#4fd8ff`) | `4.5` | Orbiting electrons/sparks |
| **5. Glass Shell** | `<mesh>` in `EnergyCube` | `BoxGeometry(2.4, 2.4, 2.4)` | 6x `MeshBasicMaterial` (1024px CanvasTextures) | `5` | Interactive glass service panes |
| **5.5. Scan Sweep** | `<mesh>` in `EnergyCube` | `PlaneGeometry(2.32, 0.035)` | Accent color, Additive, `opacity: 0.65` | `5.5` | Holographic scanning line |
| **6. Neon Edges** | `<lineSegments>` in `EnergyCube` | `EdgesGeometry(2.4, 2.4, 2.4)` | Cyan `#4fd8ff`, `linewidth: 2` | `6` | Crisp structural silhouette |

---

## 4. The Inner Rotating Mechanism (`InnerMechanism.tsx`)

The inner mechanism is encapsulated in [src/components/cube/InnerMechanism.tsx](file:///f:/Nikneuron/src/components/cube/InnerMechanism.tsx). It runs self-contained GPU shader updates, rotational physics, and interactive reactions.

### Geometry Sizing & Clearance Proof
To prevent any clipping through the glass faces:
- Outer glass shell half-size $= 1.20$ (the 6 faces reside on planes at $X, Y, Z = \pm 1.20$).
- The maximum distance from origin to any point on a rotating cube of size $S$ is its 3D diagonal half-length:
  $$R_{\text{max}} = \frac{S}{2} \sqrt{3}$$
- For the wireframe cube with $S = 1.35$:
  $$R_{\text{max}} = \frac{1.35}{2} \times 1.73205 = 0.675 \times 1.73205 \approx 1.1691 < 1.20$$
- For the plasma cube with $S = 1.10$:
  $$R_{\text{max}} = \frac{1.10}{2} \times 1.73205 \approx 0.9526 < 1.20$$

**Result**: At any tumbling angle in 3D space, neither the wireframe cube nor the plasma cube can ever pierce or intersect the outer glass faces.

### Motion Dynamics
1. **Plasma Cube**:
   - $\Delta \text{rot}_Y = \text{delta} \times \text{ROT\_SPEED\_PLASMA} \times \text{effectiveSpeed}$ (`~0.35 rad/s`)
   - $\Delta \text{rot}_X = \text{delta} \times (\text{ROT\_SPEED\_PLASMA} \times 0.62) \times \text{effectiveSpeed}$ (`~0.22 rad/s`)
   - Eased breathing scale pulse:
     $$\text{scale} = 1.0 + \sin(\text{time} \cdot 2.5) \cdot 0.03$$
2. **Wireframe Cube**:
   - Counter-rotates in the reverse direction:
     $$\Delta \text{rot}_Y = -\text{delta} \times \text{ROT\_SPEED\_WIRE} \times \text{effectiveSpeed} \quad (\sim -0.25 \text{ rad/s})$$
     $$\Delta \text{rot}_X = \text{delta} \times (\text{ROT\_SPEED\_WIRE} \times 0.55) \times \text{effectiveSpeed} \quad (\sim +0.14 \text{ rad/s})$$
   - Harmonic wobble on Z-axis:
     $$\text{rot}_Z = \sin(\text{time} \cdot 1.8) \cdot 0.06$$
3. **8 Corner Vertex Nodes**:
   - Instanced mesh of 8 spheres positioned at $(\pm \frac{S}{2}, \pm \frac{S}{2}, \pm \frac{S}{2})$. Rendered in a single draw call.
4. **Nucleus & Orbit Sparks**:
   - Central nucleus breathes on a 2.2-second period:
     $$\text{scale} = 1.0 + \sin\left(\text{time} \cdot \frac{2\pi}{2.2}\right) \cdot 0.07$$
   - 4 sparks ride a 35° tilted orbit ring at angle $\theta_i(t) = \frac{2\pi i}{N} + \omega t$.

---

## 5. The Custom GLSL Plasma Shader with Energy Veins

The plasma shader runs on GPU fragment units via `ShaderMaterial`.

### Complete GLSL Implementation
```glsl
uniform float uTime;
uniform float uIntensity;
uniform float uAlpha;
uniform vec3 uAccent;
uniform float uRipple;
uniform float uQuality;
uniform vec3 uColorDeep;  // #0a3cff
uniform vec3 uColorMid;   // #1f7bff
uniform vec3 uColorCyan;  // #4fd8ff
uniform vec3 uColorHot;   // #cfefff

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

// 3D Simplex noise generator
float snoise(vec3 v);

// 3-octave FBM
float fbm(vec3 p) {
  float f = 0.0;
  f += 0.5000 * snoise(p); p *= 2.02;
  f += 0.2500 * snoise(p); p *= 2.03;
  f += 0.1250 * snoise(p);
  return f;
}

// 2-axis domain warping
float domainWarp(vec3 p, float t) {
  vec3 q = vec3(
    fbm(p + vec3(t * 0.18, 0.0, 0.0)),
    fbm(p + vec3(3.7, t * 0.15, -1.2)),
    fbm(p + vec3(-2.1, 1.8, t * 0.12))
  );
  return fbm(p + 1.25 * q + vec3(t * 0.10, t * 0.16, 0.0));
}

void main() {
  // 1. Fresnel edge glow on smoothed beveled normals
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 normal = normalize(vNormal);
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);

  // 2. Animated domain-warped plasma
  float noiseVal = domainWarp(vPosition * 2.1, uTime * 0.70);
  float t = clamp(noiseVal * 0.5 + 0.5, 0.0, 1.0);

  // 3. Smooth color ramp: deep #0a3cff -> mid #1f7bff -> cyan #4fd8ff
  vec3 color = mix(uColorDeep, uColorMid, smoothstep(0.12, 0.52, t));
  color = mix(color, uColorCyan, smoothstep(0.52, 0.88, t));

  // 4. Clamped hot spots (< 10% coverage)
  float hotSpot = smoothstep(0.92, 1.0, t);
  color = mix(color, uColorHot, hotSpot * 0.50);

  // 5. Internal energy veins (ridged noise)
  if (uQuality >= 1.0) {
    vec3 veinP = vPosition * 3.4 + vec3(uTime * 0.18, -uTime * 0.12, uTime * 0.14);
    float ridged = 1.0 - abs(snoise(veinP));
    float vein = smoothstep(0.84, 0.96, ridged);
    color = mix(color, uColorHot, vein * 0.45);
  }

  // 6. Accent color integration
  color = mix(color, uAccent, 0.24);

  // 7. Energy ripple wave reaction from nucleus
  if (uRipple > 0.001) {
    float dist = length(vPosition);
    float wave = sin(dist * 5.0 - uRipple * 6.28) * exp(-dist * 1.5);
    color = mix(color, uColorHot, clamp(wave, 0.0, 1.0) * 0.35);
  }

  // 8. Fresnel rim brightening
  color = mix(color, uColorCyan, fresnel * 0.65);

  // 9. Scaled by intensity uniform
  color *= uIntensity;

  // 10. CRITICAL HARD-CLAMP: Never exceed 0.90 (230/255 in 8-bit)
  color = min(color, vec3(0.90));

  // 11. Controlled alpha
  float alpha = uAlpha * (0.60 + fresnel * 0.40);

  gl_FragColor = vec4(color, alpha);
}
```

---

## 6. Outer Glass Shell & 1024x1024 Procedural Canvas Faces (`CubeFace.tsx`)

Each of the 6 outer faces is generated procedurally in [CubeFace.tsx](file:///f:/Nikneuron/src/components/cube/CubeFace.tsx) on an offscreen HTML5 `<canvas>` (1024x1024) and wrapped as a `THREE.CanvasTexture`.

```
┌─────────────────────────────────────────────────────────────────┐
│ [0, 0]                                              [1024, 0]   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ TOP BAR: [SERVICE // 04]             [STATUS: ACTIVE ●]   │  │
│  │ (y: 56 - 112)                                             │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │                                                           │  │
│  │            FULL-BLEED 1024x1024 SERVICE ARTWORK           │  │
│  │            (Covering edge-to-edge behind glass)           │  │
│  │                                                           │  │
│  │          ALPHA VIGNETTE: Center = 0.30 (Core shines)      │  │
│  │                          Edges  = 0.70 (Solid glass)      │  │
│  │                                                           │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ DARK GRADIENT SCRIM (y: 620 - 1024)                       │  │
│  │                                                           │  │
│  │  AI RECEPTIONIST                      (Title, y: 800)     │  │
│  │  Voice & Chat Automation Core         (Tagline, y: 860)   │  │
│  │                                                           │  │
│  │  ┌───────────────────────────────┐                        │  │
│  │  │   [ CLICK TO INSPECT ➔ ]      │    (Pill, y: 930)      │  │
│  │  └───────────────────────────────┘                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│ [0, 1024]                                         [1024, 1024] │
└─────────────────────────────────────────────────────────────────┘
```

### The Alpha Vignette (Core Visibility + Text Legibility)
To ensure the inner rotating mechanism is clearly visible while keeping face text readable:
- **Radial Alpha Mask on Artwork**: The artwork layer uses a radial gradient mask with center alpha at `0.30` and edge alpha at `0.70`. The center forms a translucent window through which the inner plasma cube and counter-rotating wireframe are clearly visible.
- **Bottom Dark Scrim (`y: 620 - 1024`)**: A vertical gradient scrim transitions from transparent (`rgba(5, 6, 18, 0)`) to opaque void (`rgba(5, 6, 18, 0.95)`). This guarantees high contrast for titles and action pills regardless of core animation brightness.

---

## 7. Quaternion Face Snapping, Inertia & Camera Rig

Cube orientation is managed mathematically using Three.js Quaternions in [EnergyCube.tsx](file:///f:/Nikneuron/src/components/cube/EnergyCube.tsx) and [services.config.ts](file:///f:/Nikneuron/src/config/services.config.ts).

### Face Index & Quaternion Mapping
| Index | Service | Normal Vector | Target Euler (Y, X, Z) |
| :---: | :--- | :---: | :--- |
| `0` | AI Receptionist | `+X` | `[0, -Math.PI / 2, 0]` |
| `1` | Web Apps & Portals | `-X` | `[0, Math.PI / 2, 0]` |
| `2` | Automated Workflow | `+Y` | `[Math.PI / 2, 0, 0]` |
| `3` | Custom AI Agents | `-Y` | `[-Math.PI / 2, 0, 0]` |
| `4` | Future UI/UX Design | `+Z` | `[0, 0, 0]` |
| `5` | Batch Mail Outreach | `-Z` | `[0, Math.PI, 0]` |

### Orientation Smoothing Loop
When snapping or settling:
```ts
const dampFactor = prefersReduced ? 1 : 1 - Math.exp(-delta * 9);
currentQuaternion.slerp(targetQuaternion, dampFactor);
cubeGroup.quaternion.copy(currentQuaternion);
```

### Dynamic Camera Rig
In [CubeScene.tsx](file:///f:/Nikneuron/src/components/cube/CubeScene.tsx), the camera smoothly adjusts its vantage:
- **Idle / Free-view**: `position = [0, 0, 7.8]`, `fov = 45`.
- **Active Service Detail Open**: Zooms to `z = 5.8` and pans left to `x = -1.4` (on screens $> 900\text{px}$) to accommodate the right-hand slide-over detail panel.

---

## 8. Touch Gesture Classifier & Interaction System

On touchscreens, users frequently drag or scroll across the canvas, which standard Three.js `onClick` handlers misinterpret as click events.

```
PointerDown ──> Accumulate travel in pointermove
                     │
                     ▼
                 PointerUp
                     │
         ┌───────────┴───────────┐
         │                       │
 travel > 10px (or 6px touch)   travel <= threshold,
 or duration > 350ms,           duration <= 350ms,
 or speed > 0.35 px/ms          speed <= 0.35 px/ms
         │                       │
         ▼                       ▼
    [ ROTATE DRAG ]         [ DELIBERATE TAP ]
  (Snaps to nearest face)        │
                                 ▼
                     Within 400ms of drag end?
                     ──> YES: Ignore (cooldown)
                     ──> NO:  Execute 2-Step Selection
```

### Two-Step Confirmation Flow
1. **Off-Angle Tap**: If the tapped face is currently off-axis ($> 25^\circ$), it snaps to front-center and highlights in the Service Rail.
2. **Front-Face Tap**: If the tapped face is already facing forward ($\le 25^\circ$), it opens the comprehensive Service Detail Inspector.
3. **Dedicated Mobile Button**: A persistent, accessible button `[Open Service Detail]` in [App.tsx](file:///f:/Nikneuron/src/App.tsx) provides a 100% reliable tap target on mobile.

---

## 9. Dynamic State Reactions (Hover, Drag, Ripple, Idle)

The inner mechanism is deeply reactive to user input:

```
[ User Action ]                 [ Visual Reaction in InnerMechanism ]
Hover over Face      ───────>   Inner rotation accelerates 1.4x (damped)
                                Nucleus brightens +15%
Rotate-Drag Cube     ───────>   Inner mechanism group lags with parallax offset (0.12, 0.08)
Select Service       ───────>   Plasma tint & sparks lerp to active service accentColor
                                Nucleus triggers 0.8s expanding spherical energy ripple
Detail Panel Open    ───────>   Inner motion scale reduces by 50% to prevent distraction
Reduced Motion Mode  ───────>   Rotation drops to 20%, pulses and ripple waves disabled
```

---

## 10. Configuration Dictionary & Live Debug HUD (`?debug=inner`)

All visual tunables are centrally defined in [src/config/cubeTheme.config.ts](file:///f:/Nikneuron/src/config/cubeTheme.config.ts) and exposed via `CUBE_THEME_CONFIG`:

| Config Variable | Default | Tunable Range | Description |
| :--- | :---: | :---: | :--- |
| `INNER_PLASMA_SIZE` | `1.10` | $0.80 - 1.40$ | Dimension of the rounded inner plasma cube |
| `INNER_WIRE_SIZE` | `1.35` | $1.00 - 1.55$ | Dimension of the counter-rotating wireframe cube |
| `ROT_SPEED_PLASMA` | `0.35` | $0.00 - 1.20$ | Plasma cube rotation speed (rad/s) |
| `ROT_SPEED_WIRE` | `0.25` | $0.00 - 1.00$ | Wireframe cage counter-rotation speed (rad/s) |
| `PULSE_AMOUNT` | `0.03` | $0.00 - 0.08$ | Eased scale breathing pulse amplitude ($\pm 3\%$) |
| `PLASMA_INTENSITY` | `0.85` | $0.30 - 1.20$ | Plasma shader color multiplier (clamped $\le 0.90$) |
| `PLASMA_ALPHA` | `0.50` | $0.10 - 0.95$ | Plasma cube base opacity |
| `SPARK_COUNT` | `4` | $0 - 6$ | Number of glowing sparks riding the 35° orbit ring |
| `HOVER_SPEEDUP` | `1.4` | $1.0 - 2.5\times$ | Damped acceleration multiplier on face hover |
| `QUALITY` | `'medium'` | `low / med / high` | Toggles energy veins, sparks, and particle count |
| `FACE_OPACITY` | `0.60` | $0.20 - 0.90$ | Translucency of outer glass faces |
| `DIM_FACTOR` | `0.60` | $0.30 - 0.80$ | Dimming multiplier for unselected faces |

### Live Debug HUD (`?debug=inner`)
Navigate to `http://localhost:5174/?debug=inner` to inspect the inner mechanism:
- **Isolates the Mechanism**: Hides outer glass shell and neon edges by default.
- **Floating Glassmorphic Panel**: Interactive sliders for all 9 numeric parameters.
- **Interactive Controls**:
  - `[Show Outer Glass Shell]` checkbox to toggle outer panes in real time.
  - `[Quality Preset]` buttons (`low`, `medium`, `high`).
  - `[Reset Defaults]` button to restore baseline settings.

### Layer Debug Toggles (`?debug=layers`)
Navigate to `http://localhost:5174/?debug=layers` to toggle individual layers via keyboard keys:
- `1`: Space Light Halo
- `2`: Glow Sprite
- `3`: Inner Mechanism
- `4`: Pink Wireframe Lattice
- `5`: Glass Faces
- `6`: Neon Edges

---

## 11. Performance, Accessibility & Zero-Allocation Rules

1. **Zero Allocations per Frame**:
   - `useFrame` callbacks in `InnerMechanism.tsx`, `EnergyCube.tsx`, and `CubeScene.tsx` strictly reuse pre-allocated Three.js math objects (`THREE.Matrix4`, `THREE.Vector3`, `THREE.Quaternion`, `THREE.Color`). No objects or vectors are created inside the animation loop.
2. **Minimal Extra Draw Calls**:
   - The 8 corner nodes use a single `InstancedMesh`.
   - Entire inner mechanism adds under 4 draw calls total.
3. **Smart Canvas Pausing**:
   - An `IntersectionObserver` on the canvas wrapper pauses the animation loop when off-screen.
   - A `document.visibilitychange` listener switches `frameloop` to `"demand"` when the browser tab is hidden, eliminating battery and GPU drain.
4. **Accessibility (`prefers-reduced-motion`)**:
   - Respects user OS preferences via `useReducedMotion()`.
   - Slows all rotations to $20\%$ of baseline, disables scale pulsing, and removes camera sway.

---

*Nikneuron Energy Cube — Engineering Documentation.*
