# Nikneuron — Website Summary & System Architecture

> **"Interfaces for the World That’s Coming"**  
> Nikneuron is a futuristic, interactive 3D portfolio and digital service showroom built around a living, cybernetic 3D Energy Cube floating in deep space.

---

## 1. Executive Summary

**Nikneuron** is a high-performance web experience blending futuristic spatial 3D graphics (WebGL / Three.js / React Three Fiber) with responsive UI/UX, accessibility compliance, and enterprise service presentations.

Rather than presenting a traditional flat corporate website, Nikneuron centers around a **Living Tesseract Energy Cube**. The cube acts as a spatial navigation hub where each of its 6 faces represents a core engineering and design vertical. Visitors can rotate the cube in real time, inspect service capabilities, compare solutions, test interactive UI demos, and receive personalized recommendations through an intelligent decision wizard.

---

## 2. Key Highlights & Features

### 🧊 1. The Central 3D Energy Cube & Living Tesseract
- **Living Cybernetic Core (`InnerMechanism.tsx`)**: A multi-layered kinetic engine comprising a rounded beveled plasma cube, a counter-rotating wireframe cage with 8 glowing vertex nodes, an energy nucleus, and a 35° tilted particle orbit ring.
- **Custom GLSL Shader**: Real-time simplex 3D noise, pulsing energy veins, and Fresnel rim glow with strict normal blending to eliminate visual blowout.
- **Procedural 1024×1024 Canvas Faces (`CubeFace.tsx`)**: High-density procedural textures rendering neon cyber reticles, service typography, holographic tags, and real-time status indicators directly onto the 3D cube mesh.
- **Smooth Quaternion Snapping**: Camera and cube smoothly interpolate and snap to any face via slerp kinematics with inertia damping.
- **Spatial Orientation Gizmo (`OrientationGizmo.tsx`)**: A mini-coordinate HUD in the bottom-left corner displaying real-time yaw, pitch, roll, and the active face normal.

### 💼 2. The 6 Core Service Verticals
Each cube face is mapped to an IT and design vertical:

| Face # | Normal | Service Title | Accent Color | Primary Focus & Value |
| :---: | :---: | :--- | :--- | :--- |
| **01** | `+X` (Right) | **Future UI/UX** | Hot Pink (`#ff5aa5`) | Next-gen spatial interfaces, WebGL 3D, and high-conversion design systems. |
| **02** | `-X` (Left) | **Batch Mail** | Cyber Violet (`#a78bfa`) | High-volume campaigns (5M+/hr), 99.8% inbox deliverability, AI warm-up IPs. |
| **03** | `+Y` (Top) | **Cloud Infrastructure** | Amber Gold (`#fbbf24`) | Multi-cloud Kubernetes failover, 99.999% uptime, and Terraform automation. |
| **04** | `-Y` (Bottom) | **Cyber Defense** | Emerald Neon (`#34d399`) | SOC 2 / HIPAA compliance, autonomous red-team testing, zero-day threat defense. |
| **05** | `+Z` (Front) | **AI Receptionist** | Electric Cyan (`#4fd8ff`) | 24/7 autonomous phone/chat assistant, zero missed calls, sub-500ms voice response. |
| **06** | `-Z` (Back) | **Data Intelligence** | Cobalt Sky (`#60a5fa`) | Predictive ML models, real-time event streaming, and executive KPI command dashboards. |

### 🧭 3. Decision Engine & Discovery Tools
- **"Help Me Choose" Wizard (`HelpMeChooseWizard.tsx`)**: A 3-step diagnostic questionnaire analyzing user pain points, business model, and urgency to algorithmically score and rank the top recommended services.
- **Side-by-Side Comparison Modal (`CompareModal.tsx`)**: Users can add multiple services to a comparison tray and view their deliverables, timelines, target audiences, and technical specs side-by-side.
- **Global Command Palette & Search (`CommandPalette.tsx` / `SearchBar.tsx`)**: Powered by Fuse.js fuzzy search. As the user types, the 3D cube dynamically auto-rotates toward the face matching the top result.

### 🌐 4. Dual-View Mode & Accessibility
- **3D Cube View vs. Accessible 2D List View (`ListViewFallback.tsx`)**: Users can toggle between the immersive 3D WebGL experience and an ultra-fast, high-contrast 2D card grid with live filtering by pressing <kbd>V</kbd>.
- **Accessibility First**: Full keyboard navigation, ARIA live region announcements (`aria-live="polite"`), WCAG AA contrast compliance, and full support for `prefers-reduced-motion` (disables space drift, shooting stars, and auto-rotation).

### 🎬 5. Cinematic Intro & Cybernetic Sound Engine
- **Laser Beam Intro (`LaserIntro.tsx`)**: A center laser beam flares and splits the screen open like sliding vault doors, accompanied by letter-by-letter typographic reveals. Persisted via `sessionStorage` with a one-click skip and replay button.
- **Synthesized Web Audio Engine (`audio.ts`)**: Generates real-time procedural sci-fi sound effects (sine/sawtooth chimes, hums, clicks, and snaps) directly in the browser with zero external MP3/WAV dependencies. Includes a global mute/unmute toggle.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React 18, TypeScript, Vite | Fast HMR, type safety, modular component tree |
| **3D & WebGL** | Three.js, React Three Fiber (R3F), Drei | Custom GLSL shaders, camera rigs, canvas texturing |
| **Styling & Theme** | Tailwind CSS v3, Vanilla CSS, PostCSS | Custom cyber theme (void, electric cyan, hot pink) |
| **Motion & Physics** | Framer Motion | Smooth layout transitions, slide-in panels, laser intro |
| **State Management** | Zustand (`useAppStore.ts`) | Fast, non-re-rendering global state store |
| **Search Engine** | Fuse.js | Client-side weighted fuzzy search |
| **UI Primitives** | Radix UI | Accessible dialogs, sliders, switches, and tabs |
| **Icons & Typography** | Lucide React, Unbounded & Manrope fonts | Cybernetic aesthetics and clean legibility |
| **Sound** | Web Audio API | Zero-asset browser audio synthesis |

---

## 4. System & Directory Architecture

```
nikneuron/
├── public/
│   ├── nebula.jpg                   # Preloaded cosmic nebula backdrop
│   └── services/                    # Service vector illustrations
├── src/
│   ├── components/
│   │   ├── background/              # NebulaBackground, Stars, ShootingStar
│   │   ├── cube/                    # EnergyCube, InnerMechanism, CubeFace, CubeScene
│   │   ├── decision/                # CompareModal (side-by-side diff)
│   │   ├── faces/                   # ComponentCard, FacePanel (service inspector)
│   │   ├── intro/                   # LaserIntro (Framer Motion cinematic opening)
│   │   ├── navigation/              # FaceRail (bottom dock), OrientationGizmo (3D HUD)
│   │   ├── search/                  # SearchBar, CommandPalette, Suggestions
│   │   ├── ui/                      # audio.ts (procedural Web Audio synthesizer)
│   │   ├── views/                   # ListViewFallback (accessible 2D mode)
│   │   └── wizard/                  # HelpMeChooseWizard (recommendation engine)
│   ├── config/
│   │   ├── cubeTheme.config.ts      # Visual constants, geometry sizes, shader colors
│   │   ├── faces.config.ts          # Face component metadata and mock playgrounds
│   │   └── services.config.ts       # 6 services, quaternions, benefits, and tags
│   ├── hooks/
│   │   ├── useDeepLinks.ts          # URL hash routing (#service, #face)
│   │   ├── useKeyboardShortcuts.ts  # Shortcuts (/, Esc, V, 1-6, Space)
│   │   ├── useReducedMotion.ts      # OS accessibility motion preference detection
│   │   └── useSwipeGesture.ts       # Touch swipe classifier
│   ├── services/
│   │   └── recommendationService.ts # Tag & intent scoring algorithm for wizard
│   ├── store/
│   │   └── useAppStore.ts           # Central Zustand store (face, view, mute, wizard)
│   ├── App.tsx                      # Root shell & responsive layout coordinator
│   ├── main.tsx                     # Vite mounting point
│   └── index.css                    # Design tokens & typography definitions
├── package.json                     # Dependency manifests & scripts
├── tailwind.config.js               # Cyberpunk color tokens & glow drop shadows
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite bundler configuration
```

---

## 5. Keyboard Shortcuts & Gestures

| Key / Action | Functionality |
| :--- | :--- |
| <kbd>/</kbd> or <kbd>⌘K</kbd> | Open and focus global search / Command Palette |
| <kbd>1</kbd> – <kbd>6</kbd> | Directly target and snap to Faces 01 through 06 |
| <kbd>V</kbd> | Toggle between **3D Cube View** and **2D Accessible List View** |
| <kbd>Esc</kbd> | Close active face inspector, wizard, or compare modal |
| <kbd>&larr;</kbd> / <kbd>&rarr;</kbd> | Rotate cube to Previous / Next face |
| <kbd>Mouse Drag</kbd> | Free-orbit rotation with inertia damping |
| <kbd>Touch Swipe</kbd> | Directional flick detection to tumble cube faces |
| <kbd>Click Face / Button</kbd>| Snap face forward and open slide-out detail panel |

---

## 6. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build
npm run preview
```

- **Local Address**: `http://localhost:5173/`
- **Network Address**: Available on local subnet for multi-device testing.
