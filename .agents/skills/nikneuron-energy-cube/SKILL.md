---
name: nikneuron-energy-cube
description: Technical architecture, GLSL shaders, procedural CanvasTextures, and Three.js/React Three Fiber techniques used to create the central hovering 3D Energy Cube component in Nikneuron.
---

# Creating the Central 3D Energy Cube (Nikneuron)

This skill documents the complete architecture, mathematical foundations, custom GLSL shaders, procedural canvas texturing, and React Three Fiber (R3F) mechanics used to build the central **Hovering Glowing Energy Cube** in the Nikneuron futuristic design system.

---

## 1. Architectural Overview & Rendering Layers

The center cube is not a simple 3D mesh. To achieve the aesthetic of a **translucent energy cube with swirling electric-blue plasma trapped inside glass**, it is constructed as an ensemble of **5 concentric rendering layers** nested inside a single floating group.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Floating R3F Group                          │
│                                                                 │
│  Layer 1: Space Light Halo (Billboard Disc, z = -0.6)           │
│  Layer 2: Inner Plasma Core (GLSL Box + Simplex Wave Shader)    │
│  Layer 3: Inner Lattice (Additive Icosahedron Wireframe)        │
│  Layer 4: Outer Glass Shell (6-Material BoxGeometry)            │
│            └─ Dynamic 512x512 CanvasTextures with Neon Reticles │
│  Layer 5: Neon Wire Edges (EdgesGeometry + LineSegments)        │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Breakdown

| Layer | Geometry | Material / Technique | Purpose |
| :--- | :--- | :--- | :--- |
| **1. Space Halo** | `PlaneGeometry(6.5, 6.5)` | Radial gradient canvas texture + `AdditiveBlending` | Generates a soft zero-gravity back-glow tinting the deep space nebula |
| **2. Plasma Core** | `BoxGeometry(1.7, 1.7, 1.7)` | Custom `ShaderMaterial` (Fresnel + wave distortion) | Simulates turbulent plasma smoke / liquid energy trapped inside the glass |
| **3. Core Lattice** | `IcosahedronGeometry(1.1, 1)` | Pink `#ff5aa5` wireframe + `AdditiveBlending` | High-tech cybernetic kernel pulsing at the core of the plasma |
| **4. Glass Shell** | `BoxGeometry(2.4, 2.4, 2.4)` | Multi-material array (6 `MeshBasicMaterial`s) | Interactive outer container with procedural cyber HUD face textures |
| **5. Edge Lines** | `EdgesGeometry(2.4, 2.4, 2.4)` | `LineSegments` (`#4fd8ff`, width 2) | Ultra-crisp neon borders defining the cube's geometric silhouette |

---

## 2. Layer 2: The Custom GLSL Plasma Shader

The fluid, swirling liquid energy inside the cube is driven by a custom GLSL shader running on the GPU.

### Mathematical Formulation

1. **Fresnel Edge Glow:**  
   Computes the angle between the viewer's gaze vector and the surface normal:
   $$\text{fresnel} = (1.0 - \max(\vec{V} \cdot \vec{N}, 0.0))^{2.2}$$
   Surfaces glancing away from the camera glow with bright cyan/white, while the front-facing core remains semi-transparent.

2. **Multi-Harmonic Plasma Waves:**  
   Simulates 3D volumetric turbulence without heavy 3D noise textures:
   $$\text{wave}_1 = \sin(x \cdot 4.0 + t \cdot 2.5) \cdot \cos(y \cdot 4.0 + t \cdot 2.0)$$
   $$\text{wave} = \text{wave}_1 + 0.5 \cdot \sin(z \cdot 5.0 - t \cdot 3.0)$$

3. **Three-Tier Color Interpolation:**
   - **Deep Plasma:** `#0a3cff` (Cobalt blue)
   - **Rim Energy:** `#4fd8ff` (Electric cyan)
   - **White Core:** `#e8fbff` (White-hot energy)

### GLSL Implementation

```glsl
// Vertex Shader
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader
uniform float uTime;
uniform vec3 uColorCore;
uniform vec3 uColorRim;
uniform vec3 uColorDeep;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  // 1. Fresnel rim glow
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

  // 2. Multi-axis turbulent plasma distortion
  float wave = sin(vPosition.x * 4.0 + uTime * 2.5) * cos(vPosition.y * 4.0 + uTime * 2.0);
  wave += sin(vPosition.z * 5.0 - uTime * 3.0) * 0.5;

  // 3. Chromatic color grading
  vec3 color = mix(uColorDeep, uColorRim, abs(wave));
  color = mix(color, uColorCore, fresnel * 0.85);

  gl_FragColor = vec4(color, 0.45 + fresnel * 0.4);
}
```

---

## 3. Layer 4: Procedural Canvas Face Textures

Rather than loading 6 static raster images, face textures are dynamically generated in memory at runtime on a $512 \times 512$ off-screen HTML5 Canvas.

### Advantages
- **Instant load time**: Zero network requests or image asset payload.
- **Dynamic reactivity**: Separate render passes for normal vs. hover states.
- **Resolution independence**: Crisp neon typography and vector corner reticles rendered directly to GPU memory via `THREE.CanvasTexture`.

### Procedural Drawing Pipeline (`CubeFace.tsx`)

```typescript
import * as THREE from 'three';

export function createFaceTexture(title: string, isHovered = false): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const g = c.getContext('2d')!;

  // 1. Radial Translucent Gradient
  const radGrad = g.createRadialGradient(256, 256, 40, 256, 256, 260);
  radGrad.addColorStop(0, isHovered ? 'rgba(79, 216, 255, 0.35)' : 'rgba(79, 216, 255, 0.18)');
  radGrad.addColorStop(0.7, 'rgba(10, 60, 255, 0.15)');
  radGrad.addColorStop(1, 'rgba(5, 6, 18, 0.45)');
  g.fillStyle = radGrad;
  g.fillRect(0, 0, 512, 512);

  // 2. 40px Cybernetic Grid Lines
  g.strokeStyle = isHovered ? 'rgba(79, 216, 255, 0.2)' : 'rgba(79, 216, 255, 0.08)';
  g.lineWidth = 1;
  for (let i = 40; i < 512; i += 40) {
    g.beginPath();
    g.moveTo(i, 0); g.lineTo(i, 512);
    g.moveTo(0, i); g.lineTo(512, i);
    g.stroke();
  }

  // 3. Glowing Neon Borders
  g.strokeStyle = isHovered ? '#ffffff' : '#4fd8ff';
  g.lineWidth = isHovered ? 10 : 6;
  g.shadowColor = isHovered ? '#ff5aa5' : '#4fd8ff';
  g.shadowBlur = isHovered ? 26 : 14;
  g.strokeRect(16, 16, 480, 480);

  // 4. Corner Targeting Reticles
  g.fillStyle = isHovered ? '#ffffff' : '#ff5aa5';
  const corners = [[20, 20], [484, 20], [20, 484], [484, 484]];
  corners.forEach(([cx, cy]) => {
    g.beginPath();
    g.arc(cx, cy, isHovered ? 8 : 6, 0, Math.PI * 2);
    g.fill();
  });

  // 5. Category Typography
  g.font = 'bold 36px Unbounded, sans-serif';
  g.fillStyle = '#ffffff';
  g.textAlign = 'center';
  g.shadowColor = isHovered ? '#ff5aa5' : '#4fd8ff';
  g.shadowBlur = isHovered ? 24 : 16;
  g.fillText(title.toUpperCase(), 256, 270);

  // 6. Subtitle / Instruction Callout
  g.font = '18px Manrope, sans-serif';
  g.fillStyle = isHovered ? '#4fd8ff' : '#8b99bd';
  g.shadowBlur = 0;
  g.fillText(isHovered ? 'EXPLORE ARCHITECTURE' : 'CLICK TO INSPECT', 256, 315);

  const texture = new THREE.CanvasTexture(c);
  texture.needsUpdate = true;
  return texture;
}
```

---

## 4. Interaction Physics, Inertia & Face-Snapping

### Multi-Material Face Mapping

In Three.js, a `BoxGeometry` has 6 sides corresponding to material indices 0 through 5:

| Index | Axis | Direction | Category | Target Euler Orientation |
| :---: | :---: | :---: | :--- | :--- |
| **0** | `+X` | Right | Navigation | `[0, Math.PI / 2, 0]` |
| **1** | `-X` | Left | Inputs & Controls | `[0, -Math.PI / 2, 0]` |
| **2** | `+Y` | Top | Feedback & Status | `[-Math.PI / 2, 0, 0]` |
| **3** | `-Y` | Bottom | Data Display | `[Math.PI / 2, 0, 0]` |
| **4** | `+Z` | Front | Interaction & Spatial | `[0, 0, 0]` |
| **5** | `-Z` | Back | Foundations & Design Tokens | `[0, Math.PI, 0]` |

### Smooth Face-Snapping Mechanics

When a visitor clicks any face, the cube executes a smooth animated rotation to bring that exact face directly perpendicular to the camera:

```typescript
useFrame((state, delta) => {
  const time = state.clock.getElapsedTime();

  // Pulse the inner plasma core
  if (innerCoreRef.current) {
    const pulse = 1 + Math.sin(time * 3) * 0.08;
    innerCoreRef.current.scale.set(pulse, pulse, pulse);
    innerCoreRef.current.rotation.y = -time * 0.6;
    innerCoreRef.current.rotation.x = time * 0.4;
  }

  // Smooth Euler interpolation toward the selected face's target angles
  if (cubeGroupRef.current) {
    if (activeFaceIndex !== null) {
      const targetEuler = FACES_DATA[activeFaceIndex].euler;
      cubeGroupRef.current.rotation.x = THREE.MathUtils.lerp(cubeGroupRef.current.rotation.x, targetEuler[0], 0.1);
      cubeGroupRef.current.rotation.y = THREE.MathUtils.lerp(cubeGroupRef.current.rotation.y, targetEuler[1], 0.1);
      cubeGroupRef.current.rotation.z = THREE.MathUtils.lerp(cubeGroupRef.current.rotation.z, targetEuler[2], 0.1);
    } else if (!isIntroActive) {
      // Gentle idle tumble when free-floating
      cubeGroupRef.current.rotation.y += delta * 0.15;
    }
  }
});
```

---

## 5. Scene Composition & Zero-Gravity Environment (`CubeScene.tsx`)

The cube floats seamlessly within a Three.js canvas configured for optimal performance and high-contrast space visuals:

### 1. Organic Bobbing with `<Float>`
Rather than rigid math equations, `@react-three/drei`'s `Float` component applies subtle harmonic displacement:
```tsx
<Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.6}>
  <EnergyCube onHoverFace={handleHoverFace} />
</Float>
```

### 2. Damped OrbitControls
Allows the user to drag and toss the cube with physical inertia:
```tsx
<OrbitControls
  ref={controlsRef}
  enablePan={false}
  enableZoom={false}
  enableDamping
  dampingFactor={0.06}
  rotateSpeed={0.8}
  enabled={activeFaceIndex === null} // Disabled during face inspection
/>
```

### 3. Dynamic Camera Zoom Rig
When a face is opened, `CameraRig` zooms closer and shifts the cube leftward to accommodate the sliding component panel:
```typescript
function CameraRig() {
  const { activeFaceIndex } = useAppStore();

  useFrame((state) => {
    const targetZ = activeFaceIndex !== null ? 5.8 : 7.8;
    const targetX = activeFaceIndex !== null && window.innerWidth > 900 ? -1.4 : 0;

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.08);
  });

  return null;
}
```

### 4. Floating Micro-Sparks
Zero-gravity particulate sparkles rendered around the cube:
```tsx
<Sparkles
  count={window.innerWidth < 768 ? 40 : 100}
  scale={7}
  size={2.5}
  speed={0.4}
  opacity={0.7}
  color="#4fd8ff"
/>
```

---

## 6. How to Replicate or Extend

To adapt this component for other 3D applications or web designs:

1. **Change Color Palette**: Modify the uniforms in `PlasmaShaderMaterial`:
   - `uColorCore`: Bright central energy
   - `uColorRim`: Silhouette rim glow
   - `uColorDeep`: Background interior depth
2. **Custom Face Layouts**: Edit `createFaceTexture` in `CubeFace.tsx` to display dynamic metrics, SVG icons, or biometric graphs instead of text.
3. **Change Geometry**: Replace `BoxGeometry` with `DodecahedronGeometry` or `TorusKnotGeometry`—the Fresnel shader automatically adapts to arbitrary surface normals.
