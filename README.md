# Nikneuron — Interfaces for the World That’s Coming

A futuristic, interactive design system portfolio built around a hovering, glowing 3D energy cube floating in deep space.

---

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v3 (custom theme with void, electric cyan, ice white, deep blue, hot pink accents)
- **3D Graphics**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Search**: Fuse.js (fuzzy search across components, tags, and faces)
- **Primitives**: Radix UI (Switch, Slider, Tabs, DropdownMenu, Dialog, Toast)
- **Icons**: Lucide React
- **Typography**: `@fontsource/unbounded` (display) & `@fontsource/manrope` (body)

---

## Folder Structure

```
nikneuron/
├── public/
│   └── nebula.jpg                   # Preloaded cosmic nebula background
├── src/
│   ├── components/
│   │   ├── background/
│   │   │   ├── NebulaBackground.tsx # Ken Burns drift & scale, dark vignette, parallax
│   │   │   ├── Stars.tsx            # Twinkling star field canvas
│   │   │   └── ShootingStar.tsx     # Periodic shooting stars (every 15–25s)
│   │   ├── cube/
│   │   │   ├── CubeFace.tsx         # Face canvas texture generator
│   │   │   ├── EnergyCube.tsx       # Custom plasma shader, core glow & face snapping
│   │   │   └── CubeScene.tsx        # R3F Canvas with Float, Sparkles, OrbitControls
│   │   ├── faces/
│   │   │   ├── ComponentCard.tsx    # Working demo card with "Copy code"
│   │   │   └── FacePanel.tsx        # Glass inspector with counter ("2 / 6") & arrows
│   │   ├── intro/
│   │   │   └── LaserIntro.tsx       # Framer Motion 6s laser beam & sliding doors
│   │   ├── search/
│   │   │   ├── SearchBar.tsx        # Glowing search input (press /) & auto-rotation
│   │   │   └── Suggestions.tsx      # Fuse.js live suggestions & empty state chips
│   │   └── ui/
│   │       └── audio.ts             # Web Audio API synthesizer for sci-fi cues
│   ├── data/
│   │   └── faces.ts                 # 6 foundational faces, components metadata & code
│   ├── demos/
│   │   └── index.tsx                # Working mini-demos using Radix UI & Tailwind
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.ts  # Shortcut listener (/, Esc, Arrow keys)
│   │   └── useReducedMotion.ts      # Accessibility motion preference detection
│   ├── store/
│   │   └── useAppStore.ts           # Zustand global state store
│   ├── App.tsx                      # Root application layout
│   ├── main.tsx                     # Vite entry point
│   └── index.css                    # Global typography & Tailwind utilities
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to explore Nikneuron.

### 3. Build for Production
```bash
npm run build
```

---

## Core Features

1. **The Hero Energy Cube (R3F)**
   - Translucent liquid-light plasma cube with a custom GLSL shader (noise, Fresnel edge glow, cyan-white core).
   - Space halo disc with additive blending (zero floor reflection).
   - Orbit with drag, touch swipe, or arrow keys with gentle damping inertia.
   - Hovering over a face highlights its edges and displays a floating category label.
   - Clicking a face snaps the cube to squarely fill the view and opens the component inspector.

2. **The 6 Systematic Faces & Working Component Demos**
   - **01 // Navigation**: Floating Pill Navbar, Segmented Sliding Tabs, Holographic Breadcrumbs, Glass Contextual Menu, Omni Command Palette.
   - **02 // Inputs**: Kinetic Neon Buttons, Biometric Input Field, Quantum Liquid Toggle (Radix Switch), Flux Gradient Slider (Radix Slider), Orbital Select Menu.
   - **03 // Feedback**: Synaptic Signal Toast, Holographic Banner Alert, Plasma Dual-Ring Loader, Kinetic Step Meter, Zero-State Hologram.
   - **04 // Data**: Telemetry Insight Card, Quantum Matrix Grid, Volumetric Bio-Chart, Adaptive Gauge Cluster, Kinetic Feed List.
   - **05 // Future Interfaces**: Synaptic Sub-Vocal Voice, Micro-Kinetic Spatial Mesh, Volumetric Reticle HUD, Cognitive Load Adapter.
   - **06 // Foundations**: Spectra Color Tokens, Dual-Type Hierarchy, 8-Point Quantum Spacing, Elastic Inertia Easing, Vector Monoline Glyphs.
   - Every demo is interactive and includes a **"Copy code"** button.

3. **Glowing Fuzzy Search (Fuse.js)**
   - Press <kbd>/</kbd> anywhere to focus the search bar.
   - As you type, the cube smoothly auto-rotates toward the face containing the top match.
   - Suggestions display contextual breadcrumbs (e.g. `toggle → Inputs`).
   - Clicking a result snaps the cube, opens the face, and scrolls to & pulses the target component with a hot-pink beacon.
   - Friendly empty state with suggested search chips when no matches are found.

4. **Cinematic Opening Laser Intro (Framer Motion)**
   - A white-hot laser beam shoots down the exact center of the screen.
   - The beam flares and splits the screen open like sliding vault doors, revealing the nebula and igniting the energy cube.
   - **N-I-K-N-E-U-R-O-N** rises in letter by letter with a blur-to-sharp focus effect and tagline.
   - Plays once per session (`sessionStorage`), with a visible **"Skip intro"** button and on-demand replay button in the header.

5. **Accessibility & Performance**
   - Respects `prefers-reduced-motion` by disabling drift, parallax, shooting stars, and auto-rotation.
   - Keyboard accessible (<kbd>/</kbd> for search, <kbd>Esc</kbd> to return to cube, <kbd>&larr;</kbd> <kbd>&rarr;</kbd> to navigate faces).
   - WCAG AA text contrast on all glassmorphic panels.
   - Web Audio synthesizer with sound toggle in header (no external audio assets).
