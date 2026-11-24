# Nikneuron Living Energy Core (v1) — Master Architecture & Technical Reference (`corev1.md`)

This document is the authoritative technical reference for the **Nikneuron Living Energy Core** (`InnerMechanism.tsx`), the cybernetic heart of the central 3D Energy Cube. It is designed so that any AI agent, engineer, or graphics developer can immediately understand its architecture, mathematical foundations, shader pipelines, state reactions, zero-allocation performance rules, and debugging tools.

---

## Table of Contents
1. [Core Executive Summary](#1-core-executive-summary)
2. [Evolutionary History: Why the Core is Built This Way](#2-evolutionary-history-why-the-core-is-built-this-way)
3. [Scene Hierarchy & concentric Layer Stack](#3-scene-hierarchy--concentric-layer-stack)
4. [Component Deep-Dive: `InnerMechanism.tsx`](#4-component-deep-dive-innermechanismtsx)
5. [The Custom GLSL Plasma & Vein Shader](#5-the-custom-glsl-plasma--vein-shader)
6. [Kinematics & Multi-Body Motion Dynamics](#6-kinematics--multi-body-motion-dynamics)
7. [Reactive Behaviors & State Synchronization](#7-reactive-behaviors--state-synchronization)
8. [Performance, Memory & Zero-Allocation Rules](#8-performance-memory--zero-allocation-rules)
9. [Configuration Dictionary & Live Debug Systems](#9-configuration-dictionary--live-debug-systems)
10. [Cheat Sheet for Future Agents: Do's and Don'ts](#10-cheat-sheet-for-future-agents-dos-and-donts)

---

## 1. Core Executive Summary

The **Energy Core** is an interactive, multi-layered cybernetic engine operating inside a 2.4-unit semi-translucent glass cube container. Rather than being a single 3D mesh or an imported static asset, it is an **active composite of 5 concentric sub-layers** executing in real time via Three.js and React Three Fiber (R3F).

```
                      ┌────────────────────────────────────────┐
                      │        Outer Glass Cube (2.4m)         │
                      │  ┌──────────────────────────────────┐  │
                      │  │   Counter-Rotating Wire Cage     │  │
                      │  │  ┌────────────────────────────┐  │  │
                      │  │  │    Plasma RoundedBox       │  │  │
                      │  │  │  ┌──────────────────────┐  │  │  │
                      │  │  │  │ Orbit Ring + Sparks  │  │  │  │
                      │  │  │  │  ┌────────────────┐  │  │  │  │
                      │  │  │  │  │ Nucleus Core   │  │  │  │  │
                      │  │  │  │  └────────────────┘  │  │  │  │
                      │  │  │  └──────────────────────┘  │  │  │
                      │  │  └────────────────────────────┘  │  │
                      │  └──────────────────────────────────┘  │
                      └────────────────────────────────────────┘
```

### Primary Code Locations
- **Core Component:** [`src/components/cube/InnerMechanism.tsx`](file:///f:/Nikneuron/src/components/cube/InnerMechanism.tsx)
- **Host Parent:** [`src/components/cube/EnergyCube.tsx`](file:///f:/Nikneuron/src/components/cube/EnergyCube.tsx)
- **Scene Canvas & Controls:** [`src/components/cube/CubeScene.tsx`](file:///f:/Nikneuron/src/components/cube/CubeScene.tsx)
- **Configuration Tunables:** [`src/config/cubeTheme.config.ts`](file:///f:/Nikneuron/src/config/cubeTheme.config.ts)
- **Global Reactive Store:** [`src/store/useAppStore.ts`](file:///f:/Nikneuron/src/store/useAppStore.ts)

---

## 2. Evolutionary History: Why the Core is Built This Way

Understanding previous iterations prevents re-introducing critical visual bugs.

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│           Version 1             │      │           Version 2             │      │       Version 3 (Current)       │
│     The Flat Box Prototype      │ ───> │       The Spherical Core        │ ───> │       The Living Tesseract      │
├─────────────────────────────────┤      ├─────────────────────────────────┤      ├─────────────────────────────────┤
│ • Flat BoxGeometry(1.7)         │      │ • Icosahedron sphere            │      │ • RoundedBox (r=0.08, bevels)   │
│ • Uniform face normals          │      │ • Continuously varying normals  │      │ • Smooth edge normals           │
│ • Additive Blending             │      │ • Fixed white blowout           │      │ • Counter-rotating wire cube    │
│ • BUG: Pure white blinding box  │      │ • PROBLEM: Lost "cube-in-cube"  │      │ • Clamped nucleus + orbit sparks│
└─────────────────────────────────┘      └─────────────────────────────────┘      └─────────────────────────────────┘
```

### The "White Blowout" Trap (Version 1)
- **Symptom:** The inner core turned into an opaque, solid-white rectangular silhouette that blew out the entire canvas and obscured the face HUD text.
- **Root Cause:** Standard `THREE.BoxGeometry` contains exactly 6 flat faces. All vertices and fragments on any single face share an identical normal vector perpendicular to that face ($\vec{N}$). Because $\vec{V} \cdot \vec{N}$ is constant across a flat plane, the Fresnel formula produced uniform values. Combined with `THREE.AdditiveBlending` and color channels exceeding `1.0`, the core immediately blew out into pure white.

### The Spherical Compromise (Version 2)
- Replacing the box with `IcosahedronGeometry(detail: 4)` fixed the normals (they curved smoothly from center to edge).
- However, user testing revealed that having a round ball inside a cube lost the high-tech **tesseract (hypercube)** aesthetic.

### The Current Living Tesseract (Current Core / v1 Master)
1. **Beveled Geometry:** Uses `@react-three/drei`'s `<RoundedBox args={[1.10, 1.10, 1.10]} radius={0.08} smoothness={4} />`. The curved edges produce smoothly changing normals along all 12 edges and 8 vertices while maintaining a crisp cubical shape.
2. **Shader Normal Blending:** Strict `THREE.NormalBlending` (NOT additive blending) on the plasma body.
3. **Hard Color Clamp:** In the GLSL fragment shader, color is clamped to `min(color, vec3(0.90))` (maximum 230/255 in 8-bit space).
4. **Counter-Rotating Outer Wireframe:** A 1.35-unit wireframe cube rotates opposite to the plasma cube with 8 instanced glowing vertex nodes, establishing immense spatial depth.

---

## 3. Scene Hierarchy & Concentric Layer Stack

All layers within the Energy Cube are assigned strict `renderOrder` and transparency settings to eliminate depth-fighting and alpha-sorting anomalies.

| `renderOrder` | Sub-Layer Name | Geometry / Entity | Blend Mode | Opacity | Function |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **0** | Space Light Halo | `PlaneGeometry(6.5, 6.5)` at $z = -0.6$ | Additive | 0.55 | Soft radial nebula back-glow |
| **1** | Nucleus Glow Sprite | Billboard `PlaneGeometry(1.2, 1.2)` | Additive | 0.22 | Soft procedural radial glow behind nucleus |
| **2** | Wireframe Cube Cage | `EdgesGeometry(Box 1.35)` | Additive | 0.65 | Outer counter-rotating cyber cage |
| **2** | 8 Vertex Corner Nodes | `InstancedMesh` of 8 spheres ($r=0.038$) | Additive | 0.85 | Glowing pinpoints at wireframe corners |
| **3** | Rounded Plasma Cube | `RoundedBox(1.10, r=0.08)` | **Normal** | 0.50 | 3D volumetric plasma & energy veins |
| **4** | Clamped Nucleus | `IcosahedronGeometry(0.26, 3)` | **Normal** | 0.92 | Glowing cybernetic power core |
| **4.5**| 35° Tilted Orbit Ring | `TorusGeometry(r=0.55, tube=0.01)` | Additive | 0.35 | Tilted quantum magnetic track |
| **4.5**| Orbiting Sparks | 4–6 `SphereGeometry(0.024)` | Additive | 0.85 | Traveling energy sparks riding the ring |
| **5** | Outer Glass Faces | `BoxGeometry(2.4, 2.4, 2.4)` Multi-mat | **Normal** | 0.60 | 1024x1024 2D Canvas HUD faces |
| **5.5**| Scanline Light Sweep | `PlaneGeometry(2.32, 0.035)` | Additive | 0.65 | Slow holographic scanning line |
| **6** | Neon Outer Edges | `LineSegments(Edges(Box 2.4))` | Non-transparent | 1.00 | Ultra-crisp `#4fd8ff` cube silhouette |

> **Critical Rule:** Every transparent mesh from layer 0 to 4.5 specifies `depthWrite: false`. This ensures the outer glass shell (Layer 5) renders transparently over the core without clipping or sorting pop.

---

## 4. Component Deep-Dive: `InnerMechanism.tsx`

The core is fully encapsulated in [InnerMechanism.tsx](file:///f:/Nikneuron/src/components/cube/InnerMechanism.tsx).

### Component Signature & Props
```typescript
export interface InnerConfigOverrides {
  INNER_PLASMA_SIZE?: number;   // default: 1.10
  INNER_WIRE_SIZE?: number;     // default: 1.35
  ROT_SPEED_PLASMA?: number;    // default: 0.35 rad/s
  ROT_SPEED_WIRE?: number;      // default: 0.25 rad/s
  PULSE_AMOUNT?: number;        // default: 0.03 (+/- 3%)
  PLASMA_INTENSITY?: number;    // default: 0.85
  PLASMA_ALPHA?: number;        // default: 0.50
  SPARK_COUNT?: number;         // default: 4 (max 6)
  HOVER_SPEEDUP?: number;       // default: 1.4x
  QUALITY?: 'low' | 'medium' | 'high';
}

export interface InnerMechanismProps {
  plasmaSize?: number;
  wireSize?: number;
  rotSpeedPlasma?: number;
  rotSpeedWire?: number;
  pulseAmount?: number;
  plasmaIntensity?: number;
  plasmaAlpha?: number;
  sparkCount?: number;
  hoverSpeedup?: number;
  quality?: 'low' | 'medium' | 'high';
  configOverrides?: InnerConfigOverrides;
  accentColor?: string;              // Current active service color (e.g. #4fd8ff or #ff5aa5)
  isHovered?: boolean;               // True when user hovers any face
  isDragging?: boolean;              // True when user is rotating the cube
  isDetailOpen?: boolean;            // True when a service modal/inspector is active
  prefersReducedMotion?: boolean;    // Accessibility flag
  onSelectionTrigger?: number;       // Incremented on service selection change to fire ripple
}
```

---

## 5. The Custom GLSL Plasma & Vein Shader

The plasma cube does not use standard Three.js materials (`MeshStandardMaterial` or `MeshPhysicalMaterial`). It runs a dedicated GPU program: `InnerPlasmaShader`.

### Uniforms Interface
```glsl
uniform float uTime;        // Time accumulator * effectiveSpeed
uniform float uIntensity;   // Brightness factor (0.85 normal, boosted 1.08x on hover)
uniform float uAlpha;       // Base opacity (0.50)
uniform vec3  uAccent;      // Interpolated hex tint of focused service
uniform float uRipple;      // Radial shockwave phase (0.0 to 1.0)
uniform float uQuality;     // 0.0 (low), 1.0 (med), 2.0 (high)
uniform vec3  uColorDeep;   // vec3(0.039, 0.235, 1.0)   -> #0a3cff (Deep Cobalt)
uniform vec3  uColorMid;    // vec3(0.121, 0.482, 1.0)   -> #1f7bff (Energy Blue)
uniform vec3  uColorCyan;   // vec3(0.310, 0.847, 1.0)   -> #4fd8ff (Electric Cyan)
uniform vec3  uColorHot;    // vec3(0.812, 0.937, 1.0)   -> #cfefff (Hot Pale Core)
```

### Vertex Shader Logic
Passes world coordinates, normalized camera-space normals, and UVs:
```glsl
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
```

### Fragment Shader Pipeline (Step-by-Step)
1. **Fresnel Term:**
   ```glsl
   vec3 viewDir = normalize(cameraPosition - vWorldPosition);
   vec3 normal = normalize(vNormal);
   float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);
   ```
   *Why power 2.8?* Produces a razor-thin rim along beveled borders while keeping the central face clear and legible.

2. **Domain-Warped 3D Fractional Brownian Motion (FBM):**
   ```glsl
   float domainWarp(vec3 p, float t) {
     vec3 q = vec3(
       fbm(p + vec3(t * 0.18, 0.0, 0.0)),
       fbm(p + vec3(3.7, t * 0.15, -1.2)),
       fbm(p + vec3(-2.1, 1.8, t * 0.12))
     );
     return fbm(p + 1.25 * q + vec3(t * 0.10, t * 0.16, 0.0));
   }
   ```
   This warps space coordinates non-linearly, giving the plasma an organic, fluid, swirling electric current behavior rather than simple static noise.

3. **Color Ramp Multi-Step Interpolation:**
   ```glsl
   float t = clamp(noiseVal * 0.5 + 0.5, 0.0, 1.0);
   vec3 color = mix(uColorDeep, uColorMid, smoothstep(0.12, 0.52, t));
   color = mix(color, uColorCyan, smoothstep(0.52, 0.88, t));
   ```

4. **Clamped Hot Spots:**
   ```glsl
   float hotSpot = smoothstep(0.92, 1.0, t);
   color = mix(color, uColorHot, hotSpot * 0.50);
   ```
   *Safety constraint:* High-intensity white-cyan points are restricted to the top 8% of the noise range.

5. **Internal "Energy Veins" (High/Medium Tier):**
   ```glsl
   vec3 veinP = vPosition * 3.4 + vec3(uTime * 0.18, -uTime * 0.12, uTime * 0.14);
   float ridged = 1.0 - abs(snoise(veinP));
   float vein = smoothstep(0.84, 0.96, ridged);
   color = mix(color, uColorHot, vein * 0.45);
   ```
   Creates thin, lightning-like filament veins pulsing through the 3D volume.

6. **Selection Ripple Wave:**
   ```glsl
   if (uRipple > 0.001) {
     float dist = length(vPosition);
     float wave = sin((dist * 5.0 - uRipple * 6.28)) * exp(-dist * 1.5);
     wave = clamp(wave, 0.0, 1.0);
     color = mix(color, uColorHot, wave * 0.35);
   }
   ```

7. **The Inviolable Hard-Clamp:**
   ```glsl
   color *= uIntensity;
   color = min(color, vec3(0.90)); // NEVER REMOVE THIS CLAMP
   float alpha = uAlpha * (0.60 + fresnel * 0.40);
   gl_FragColor = vec4(color, alpha);
   ```

---

## 6. Kinematics & Multi-Body Motion Dynamics

The core's mesmerizing depth is achieved by **counter-rotating bodies** moving across different axes at irrational speed ratios.

```
       [Wireframe Cube (1.35m)]
          ◄── Rotation Y (-0.25 rad/s)
          ──► Rotation X (+0.138 rad/s)
          ~~~ Z-Wobble (sin(t * 1.8) * 0.06)
          
                 [Plasma Cube (1.10m)]
                    ──► Rotation Y (+0.35 rad/s)
                    ──► Rotation X (+0.217 rad/s)
                    ((•)) Breathing Scale (1.0 +/- 0.03 at 2.5 rad/s)

                           [35° Tilted Orbit Ring]
                              ↻ Rotation Z (+0.45 rad/s)
                              * Sparks ride ring at 1.2 rad/s + z harmonic
```

### Mathematical Breakdown
1. **Plasma Cube Tumbling:**
   $$\Delta \theta_y = \Delta t \cdot 0.35 \cdot S_{\text{eff}}$$
   $$\Delta \theta_x = \Delta t \cdot (0.35 \times 0.62) \cdot S_{\text{eff}} = \Delta t \cdot 0.217 \cdot S_{\text{eff}}$$
   Scale breathing:
   $$\text{Scale}(t) = 1.0 + \sin(t \cdot 2.5) \cdot 0.03$$

2. **Wireframe Counter-Rotation:**
   $$\Delta \theta_y = -\Delta t \cdot 0.25 \cdot S_{\text{eff}}$$
   $$\Delta \theta_x = +\Delta t \cdot (0.25 \times 0.55) \cdot S_{\text{eff}} = +\Delta t \cdot 0.1375 \cdot S_{\text{eff}}$$
   Subtle Z-axis wobble:
   $$\theta_z(t) = \sin(t \cdot 1.8) \cdot 0.06$$

3. **Nucleus Heartbeat (2.2s Cycle):**
   $$T = 2.2\text{s}, \quad \phi(t) = \frac{t \cdot 2\pi}{2.2}$$
   $$\text{Scale}_{\text{nuc}}(t) = 1.0 + \sin(\phi(t)) \cdot 0.07$$

4. **Orbit Sparks Trajectory:**
   Sparks ride on a 35° tilted plane ($r = 0.55$). Each spark index $k \in [0..N-1]$ has base angular offset $\phi_k = \frac{k \cdot 2\pi}{N}$.
   $$x_k(t) = 0.55 \cdot \cos(\phi_k + t \cdot 1.2 \cdot S_{\text{eff}})$$
   $$y_k(t) = 0.55 \cdot \sin(\phi_k + t \cdot 1.2 \cdot S_{\text{eff}})$$
   $$z_k(t) = 0.04 \cdot \sin(2 \cdot (\phi_k + t \cdot 1.2 \cdot S_{\text{eff}}))$$
   The $z$ harmonic adds a delicate 3D wave wobble as sparks circumnavigate the nucleus.

---

## 7. Reactive Behaviors & State Synchronization

The Core is dynamically coupled to user interactions via props and zustand stores:

### 1. Parallax Drag Lag
When the user clicks and drags to rotate the outer cube (`isDragging = true`), the entire `rootGroupRef` shifts position:
- Target translation: $[0.12, 0.08, 0]$
- Uses `THREE.MathUtils.damp(current, target, 5, delta)`.
- *Visual Result:* Gives the impression that the core has physical mass floating inside a viscous liquid medium behind the glass.

### 2. Hover Speedup
- Hovering any cube face sets `isHovered = true`.
- Speed multiplier targets $1.4\times$ ($+40\%$ rotation velocity).
- Uniform `uIntensity` increases by $1.08\times$.
- The central nucleus brightens by $1.15\times$.
- Changes are damped via `THREE.MathUtils.damp(speedMult, target, 6, delta)` for smooth transitions.

### 3. Service Selection Ripple & Accent Tint
- Selecting a new service face triggers `onSelectionTrigger`.
- Starts an expanding shockwave ring in GLSL (`uRipple` from $0.0 \to 1.0$).
- Target accent color (`uAccent`) smoothly interpolates to the new service accent:
  - e.g., `#ff5aa5` for Batch Mail, `#4fd8ff` for Neuro-Symbolic AI, `#10b981` for Cognitive Search.
- Interpolation rate: `currentAccentColor.lerp(targetAccentColor, 0.08)`.

### 4. Reduced Motion & Modal States
- When a service inspector modal opens (`isDetailOpen = true`), effective motion scales down by $50\%$ (`0.50`) to minimize background distraction.
- When `prefersReducedMotion = true`:
  - Motion speed is clamped to $20\%$ (`0.20`).
  - Active tumbling of plasma and wire cubes is paused.
  - Heartbeat pulsing is flattened to $1.0\times$.

---

## 8. Performance, Memory & Zero-Allocation Rules

The Core runs continuously at 60–120 FPS. It is governed by strict allocation constraints:

### Zero-Allocation Contract in `useFrame`
No Three.js objects may be created inside the frame loop. Garbage collection spikes will cause micro-stutters.
```typescript
// PRE-ALLOCATED ONCE OUTSIDE THE FRAME LOOP:
const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
const tempVec = useMemo(() => new THREE.Vector3(), []);
const tempColor = useMemo(() => new THREE.Color(), []);
const currentAccentColor = useMemo(() => new THREE.Color('#4fd8ff'), []);
const targetAccentColor = useMemo(() => new THREE.Color('#4fd8ff'), []);
```

### Instancing the 8 Corner Nodes
Rather than rendering 8 distinct `<mesh>` components (which would trigger 8 separate draw calls), the 8 glowing vertex balls of the wireframe cage are bundled into a single `THREE.InstancedMesh`:
```typescript
<instancedMesh ref={cornerNodesRef} args={[undefined, undefined, 8]} renderOrder={2}>
  <sphereGeometry args={[0.038, 12, 12]} />
  <meshBasicMaterial color="#4fd8ff" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
</instancedMesh>
```
During mount, their coordinates are initialized using `tempMatrix.makeTranslation(...)` and uploaded to the GPU once.

### Quality Presets
| Feature | `low` | `medium` (Default) | `high` |
| :--- | :---: | :---: | :---: |
| Shader Complexity | Fast radial gradient fallback | 3-Octave FBM + Veins | 3-Octave FBM + Full Veins |
| Spark Count | 0 (Orbit ring disabled) | 4 Sparks | 6 Sparks |
| Instanced Nodes | Yes (8 nodes) | Yes (8 nodes) | Yes (8 nodes) |

### Off-Screen & Visibility Throttling
In `CubeScene.tsx`, listeners for `document.visibilitychange` and `IntersectionObserver` pause canvas updating whenever the browser tab is hidden or the component scrolls out of view.

---

## 9. Configuration Dictionary & Live Debug Systems

### `CUBE_THEME_CONFIG` Reference
Located in [src/config/cubeTheme.config.ts](file:///f:/Nikneuron/src/config/cubeTheme.config.ts):

```typescript
export const CUBE_THEME_CONFIG = {
  // Core plasma tunables
  CORE_INTENSITY: 0.85,       // Maximum intensity ceiling
  CORE_ALPHA: 0.55,           // Base transparency
  CORE_RADIUS: 0.85,          // Legacy radius
  CORE_PULSE: 0.04,           // Scale pulse amplitude

  // Inner Living Mechanism tunables
  INNER_PLASMA_SIZE: 1.10,    // Half-diagonal = 0.95 (guarantees zero clipping through 2.4 shell)
  INNER_WIRE_SIZE: 1.35,      // Half-diagonal = 1.169 (comfortably inside 1.20 glass plane)
  ROT_SPEED_PLASMA: 0.35,     // Plasma cube Y-tumbling speed (rad/s)
  ROT_SPEED_WIRE: 0.25,       // Wire cage Y-counter-rotation speed (rad/s)
  PULSE_AMOUNT: 0.03,         // Plasma breathing (+/- 3%)
  PLASMA_INTENSITY: 0.85,     // Fragment shader brightness scalar
  PLASMA_ALPHA: 0.50,         // Fragment shader base opacity
  SPARK_COUNT: 4,             // Orbit sparks count
  HOVER_SPEEDUP: 1.4,         // Hover rotation multiplier
  QUALITY: 'medium',          // Default performance tier
};
```

### Live Debugging Interfaces

#### 1. Inner Mechanism HUD (`?debug=inner`)
Append `?debug=inner` to the URL in development mode:
- Mounts an interactive floating GUI panel on top of the canvas.
- Exposes sliders for:
  - `INNER_PLASMA_SIZE` (0.80 to 1.30)
  - `INNER_WIRE_SIZE` (1.00 to 1.60)
  - `ROT_SPEED_PLASMA` & `ROT_SPEED_WIRE` (0.0 to 1.5)
  - `PLASMA_INTENSITY` & `PLASMA_ALPHA` (0.0 to 1.0)
  - `SPARK_COUNT` (0 to 6)
  - `HOVER_SPEEDUP` (1.0 to 3.0)
  - `QUALITY` dropdown (`low`, `medium`, `high`)
- Includes a toggle: `Show Outer Faces` (lets you isolate and view the core without the outer glass shell).

#### 2. Layer Isolation Hotkeys (`?debug=layers`)
Append `?debug=layers` to isolate specific rendering tiers via keyboard keys `1`–`6`:
- `Key 1`: Toggle Space Light Halo (Layer 0)
- `Key 2`: Toggle Soft Glow Sprite (Layer 1)
- `Key 3`: Toggle Plasma Core & Nucleus (Layers 3 & 4)
- `Key 4`: Toggle Counter-Rotating Wire Lattice & Sparks (Layers 2 & 4.5)
- `Key 5`: Toggle Outer 2D Canvas Glass Faces (Layer 5)
- `Key 6`: Toggle Neon Silhouette Wireframe Edges (Layer 6)

---

## 10. Cheat Sheet for Future Agents: Do's and Don'ts

### DO:
1. **Always preserve `min(color, vec3(0.90))` in GLSL.** Any edit removing this clamp will re-trigger the white blowout bug.
2. **Always keep `blending: THREE.NormalBlending` on the plasma cube.** Only the wireframe edges, glowing nodes, halo, and sparks should use `AdditiveBlending`.
3. **Keep `INNER_PLASMA_SIZE <= 1.15` and `INNER_WIRE_SIZE <= 1.38`.**
   - The outer glass shell is a cube of size $2.4$ (distance from center to face = $1.20$).
   - A box of size $S$ has a maximum corner distance of $r_{\text{max}} = \frac{\sqrt{3}}{2} \cdot S \approx 0.866 \cdot S$.
   - For `INNER_WIRE_SIZE = 1.35`, corner radius is $1.35 \times 0.866 = 1.169 < 1.200$.
   - If `INNER_WIRE_SIZE` exceeds $1.385$, its corner nodes will physically pierce through the outer glass faces during rotation!
4. **Use pre-allocated math objects.** Keep all updates inside `useFrame` garbage-free.
5. **Set `depthWrite: false` on any new internal transparent layer.** Otherwise, Three.js alpha sorting will cause back faces to vanish.

### DON'T:
1. **Do not replace `RoundedBox` with flat `BoxGeometry`.** Flat normals destroy the Fresnel edge definition and blow out the faces.
2. **Do not perform state updates (`setState`) inside `useFrame`.** Always mutate refs or uniforms directly.
3. **Do not instantiate materials inside render loops.** Memoize all geometries and materials with `useMemo`.
4. **Do not remove `renderOrder`.** Three.js requires explicit render order to cleanly layer the halo, inner nucleus, plasma, wireframe, and outer glass shell without z-fighting.
