# Nikneuron Complete UI/UX, Content & Architecture Master Summary (`Allsummary.md`)

> **Application Overview**: Nikneuron is a production-grade, founder-led software engineering and autonomous AI studio website engineered directly by **Aditya Tamta** from Almora, Uttarakhand, India.  
> **Brand Motto**: *"Technology is changing, so we have to change too."*  
> **Tagline**: *"Interfaces for the World That’s Coming · Built, Not Promised"*  
> **Aesthetic Identity**: Deep Void Cyber-Futurism, Zero-Gravity Translucent Glassmorphism, 3D Spatial Navigation, and Real-Time Web Audio Telemetry.

---

## Master Table of Contents
1. [Visual Identity & Design Tokens System](#1-visual-identity--design-tokens-system)
2. [Top Header & Sticky Glass Navigation ("The Head")](#2-top-header--sticky-glass-navigation-the-head)
3. [Hero Section & 3D Spatial Navigation](#3-hero-section--3d-spatial-navigation)
4. [Centerpiece 3D Energy Cube Engineering Architecture](#4-centerpiece-3d-energy-cube-engineering-architecture)
5. [Hero Quick Rail Navigation (`FaceRail`)](#5-hero-quick-rail-navigation-facerail)
6. [Persistent Floating AI Gizmos](#6-persistent-floating-ai-gizmos)
   - [6.1 3D AI Receptionist Core (`OrientationGizmo`)](#61-3d-ai-receptionist-core-orientationgizmo)
   - [6.2 Nik AI Engineering Assistant (`NikChatbot`)](#62-nik-ai-engineering-assistant-nikchatbot)
7. [Comprehensive Content Stream (Sections 1 through 9)](#7-comprehensive-content-stream-sections-1-through-9)
   - [Section 1: 8 Core Services Showcase (`#services`)](#section-1-8-core-services-showcase-services)
   - [Section 2: Trust Telemetry Strip (`#trust`)](#section-2-trust-telemetry-strip-trust)
   - [Section 3: Real Systems & Battle-Tested Case Studies (`#projects`)](#section-3-real-systems--battle-tested-case-studies-projects)
   - [Section 4: In-Browser Live Playgrounds (`#playground`)](#section-4-in-browser-live-playgrounds-playground)
   - [Section 5: 4-Step Velocity Process & Timeline (`#process`)](#section-5-4-step-velocity-process--timeline-process)
   - [Section 6: About Founder Aditya Tamta (`#about`)](#section-6-about-founder-aditya-tamta-about)
   - [Section 7: Engagement Options & Turnkey Bundles (`#bundles`)](#section-7-engagement-options--turnkey-bundles-bundles)
   - [Section 8: Frequently Asked Questions (`#faq`)](#section-8-frequently-asked-questions-faq)
   - [Section 9: Direct Contact Suite & Almora Studio Coordinates (`#contact`)](#section-9-direct-contact-suite--almora-studio-coordinates-contact)
8. [Overlays, Diagnostic Wizards & Slide-In Drawers](#8-overlays-diagnostic-wizards--slide-in-drawers)
9. [Bottom Footer & Telemetry Strip ("The Footer")](#9-bottom-footer--telemetry-strip-the-footer)
10. [Web Audio Synthesizer Engine & Acoustic Haptics](#10-web-audio-synthesizer-engine--acoustic-haptics)
11. [Performance Budgets & Accessibility Conformance](#11-performance-budgets--accessibility-conformance)

---

## 1. Visual Identity & Design Tokens System

### 1.1 Core Color Tokens
* **Void Deep (`#020308`)**: The deepest foundational layer. Used for backdrop overlays, modal backdrops, and low-light canvas backing.
* **Void Base (`#050612`)**: The primary body and viewport background. A subtle dark obsidian tinted with deep indigo that prevents optical eye fatigue while amplifying neon contrast.
* **Void Surface (`rgba(10, 20, 50, 0.45)`)**: The glassmorphic card fill. Provides translucency, letting cosmic particles drift visibly beneath content.
* **Void Hover (`rgba(16, 28, 68, 0.65)`)**: The elevated interactive state for hovered cards and active buttons.
* **Electric Cyan (`#4fd8ff`)**: Primary neon brand hue. Used for key action CTAs, active indicators, glowing borders, and technical telemetry. Contrast on `#050612` is 11.2:1 (WCAG AAA).
* **Hot Pink Accent (`#ff5aa5`)**: Secondary high-energy accent. Used for selection highlights, UI/UX indicators, and warning pulses. Contrast on `#050612` is 6.8:1 (WCAG AA).
* **White Ice (`#e8fbff`)**: High-intensity white-hot core plasma highlights and specular lighting points.

### 1.2 Vertical Category Signature Accents
Each service category dynamically controls card border glows, pulse beacons, and 3D face edge colors:
* **UI/UX & Web Dev**: Hot Pink (`#ff5aa5` / `rgba(255, 90, 165, 0.45)`)
* **Batch Mail & Marketing**: Cyber Purple (`#a78bfa` / `rgba(167, 139, 250, 0.45)`)
* **Custom Software & ERP**: Solar Amber (`#fbbf24` / `rgba(251, 191, 36, 0.45)`)
* **Support & Growth**: Neon Emerald (`#34d399` / `rgba(52, 211, 153, 0.45)`)
* **AI Receptionist & Voice**: Electric Cyan (`#4fd8ff` / `rgba(79, 216, 255, 0.45)`)
* **AI & Chat Automation**: Sky Blue (`#60a5fa` / `rgba(96, 165, 250, 0.45)`)

### 1.3 Typography Stack
* **Display Headings (`font-display`)**: `Unbounded` (Geometric, wide, modern cyber-technical uppercase display font with `-0.02em` tracking).
* **Body & Prose (`font-body`)**: `Manrope` (Clean, sub-pixel legible, highly scannable sans-serif with `1.625` line-height).
* **Telemetry & Data (`font-mono`)**: `ui-monospace` / SFMono-Regular / Menlo / Monaco / Consolas (Uppercase, `+0.18em` tracking, bold weight for coordinates, timers, and badges).

### 1.4 Atmospheric Cosmic Galaxy Canvas (`AsmrBackground.tsx`)
* **FPS & Physics**: 60 FPS requestAnimationFrame canvas rendering 1,400 particles on Desktop and 600 particles on Mobile devices.
* **Structure**: Logarithmic spiral galactic distribution rotating at `0.002 rad/sec`, deep cosmic dust absorption lanes (`baseAlpha: 0.15`), bright twinkling foreground stars, and stochastic shooting stars with trailing alpha decay.
* **Pointer Gravitational Interaction**: On fine pointer devices, moving the cursor creates a 180px repulsive gravity well that dynamically pushes particles away with spring restitution.

---

## 2. Top Header & Sticky Glass Navigation ("The Head")

### 2.1 Top 2px Real-Time Scroll Progress Indicator
* **Position**: Sticky along the top viewport edge (`h-[2px] z-50`).
* **Visual**: Neon gradient bar (`#4fd8ff` → `#ff5aa5` → `#4fd8ff`) dynamically scaling from `width: 0%` to `100%` based on `window.scrollY / (scrollHeight - innerHeight)`.

### 2.2 Primary Navigation Bar (`Navbar.tsx`)
* **Scroll Morphing**:
  * *Hero Zone (`scrollY < 380px`)*: Transparent padding (`py-4 sm:py-5`), seamless integration into the 3D space.
  * *Docked Zone (`scrollY >= 380px`)*: High-elevation aerospace glass (`py-2.5 bg-void-deep/90 border-b border-cyan-electric/20 backdrop-blur-2xl shadow-glass`).
* **Left - Brand Emblem & Wordmark**:
  * High-res circular Nikneuron logo (`/logo-hd.png`) with cyan glow border.
  * Wordmark: Pure white `"Nik"` + gradient `"neuron"` (`#00e5ff` → `#2979ff` → `#651fff`).
  * Telemetry Badge: Pulsing emerald dot + `"ALMORA STUDIO"`.
* **Center - Navigation Anchors**:
  * Horizontal link group: `Services`, `Bundles`, `Projects`, `Playground`, `Process`, `About`, `FAQ`, `Contact`.
  * Active section indicator: Animated neon cyan pill following user scroll position.
* **Right - Control Suite**:
  * **Command Palette Button**: Quick pill displaying `⌘K` or `/` to trigger the global fuzzy search overlay.
  * **Sound Engine Toggle**: Mute/Unmute audio button (`Volume2` / `VolumeX`) controlling acoustic feedback.
  * **3D / 2D Viewport Switcher**: Toggle button switching between interactive 3D Cube mode and accessible 2D semantic list mode.
  * **Direct Contact CTA**: High-contrast neon pill `"Get in Touch →"` smoothly jumping to `#contact`.
  * **Mobile Hamburger Menu**: Expands into a slide-over mobile drawer with keyboard navigation and quick contact links.

---

## 3. Hero Section & 3D Spatial Navigation

### 3.1 Hero Left Column (Unobstructed Studio Manifesto)
* **Position**: Top-left of Hero (`z-20`, max width 440px), positioned carefully so the central 3D cube remains 100% visible and unobstructed.
* **Live Telemetry Pill**: Glowing emerald beacon dot + `"Nikneuron Studio · Built, Not Promised"`.
* **Main Heading (H1)**: *"Software & Autonomous AI Systems"*.
* **Lead Copy**: *"We engineer 24/7 AI receptionists, sub-second websites, and automated business workflows with direct founder engineering from Almora, Uttarakhand."*
* **Inline Quick Search Bar**: Direct input filter allowing immediate keyword discovery across all services, projects, and tech stacks.

### 3.2 3D WebGL Viewport (`CubeScene.tsx`)
* Fullscreen Three.js WebGL canvas (`z-10`) positioned behind UI content.
* **Interaction**:
  * Drag with mouse or swipe on touch screens with rotational inertia and friction.
  * Automatic quaternion slerp snapping to the nearest face when released.
  * Number keys `[1–6]` immediately spin the cube to the selected service face.
* **Interactive Hero Hint**: Floating pill `"Drag cube to rotate · Tap face to open · Keys 1–6"`, which auto-hides once the user interacts with the cube.

---

## 4. Centerpiece 3D Energy Cube Engineering Architecture

The 3D Energy Cube consists of **5 concentric rendering layers** nested in a single Three.js group:

1. **Layer 1: Space Light Halo**:
   * Geometry: `PlaneGeometry(6.5, 6.5)` positioned at `z = -0.6`.
   * Material: Radial gradient canvas texture fading from `#4fd8ff` (20% alpha) to transparent using `THREE.AdditiveBlending`. Provides ambient depth behind the cube.
2. **Layer 2: Volumetric GLSL Plasma Core**:
   * Geometry: `BoxGeometry(1.7, 1.7, 1.7)`.
   * Material: Custom GPU `ShaderMaterial` running real-time Fresnel rim lighting and multi-axis harmonic turbulent sine waves.
   * Shader Colors: Deep Cobalt (`#0a3cff`), Electric Cyan Rim (`#4fd8ff`), and White Ice Core (`#e8fbff`).
3. **Layer 3: Core Cybernetic Lattice**:
   * Geometry: `IcosahedronGeometry(1.1, 1)`.
   * Material: Hot-pink (`#ff5aa5`) wireframe spinning independently on Y/Z axes with additive blending.
4. **Layer 4: Outer Translucent Glass Shell**:
   * Geometry: `BoxGeometry(2.4, 2.4, 2.4)`.
   * Materials: Multi-material array of 6 `MeshBasicMaterial` faces textured with dynamically generated 512x512 HTML5 Canvas HUD reticles, crosshairs, corner calipers, and titles.
5. **Layer 5: Neon Outer Edge Lattice**:
   * Geometry: `EdgesGeometry(2.4, 2.4, 2.4)` with `LineSegments`.
   * Material: 2px line material in Electric Cyan (`#4fd8ff`).

### 4.1 Face Orientations & Normal Mapping

| Face Index | Service Pillar | Normal Vector | Euler Angle (XYZ) | Quaternion Target |
| :---: | :--- | :---: | :--- | :--- |
| **0** | UI/UX & Web Dev | `[+1, 0, 0]` | `[0, -π/2, 0]` | Face Right (+X) |
| **1** | Batch Mail & Marketing | `[-1, 0, 0]` | `[0, +π/2, 0]` | Face Left (-X) |
| **2** | Custom Software & ERP | `[0, +1, 0]` | `[+π/2, 0, 0]` | Face Top (+Y) |
| **3** | Support & Growth | `[0, -1, 0]` | `[-π/2, 0, 0]` | Face Bottom (-Y) |
| **4** | AI Receptionist & Voice | `[0, 0, +1]` | `[0, 0, 0]` | Face Front (+Z) |
| **5** | AI & Chat Automation | `[0, 0, -1]` | `[0, π, 0]` | Face Rear (-Z) |

---

## 5. Hero Quick Rail Navigation (`FaceRail.tsx`)

* **Position**: Centered at the bottom of the Hero section (`z-20`).
* **6 Service Pills**:
  * Pill 1: `UI/UX & Web` (`#ff5aa5`)
  * Pill 2: `Batch Mail & Marketing` (`#a78bfa`)
  * Pill 3: `Custom Software` (`#fbbf24`)
  * Pill 4: `Support & Growth` (`#34d399`)
  * Pill 5: `AI Receptionist` (`#4fd8ff`)
  * Pill 6: `AI & Chat Automation` (`#60a5fa`)
* **UX Mechanics**:
  * **Single Click**: Smoothly rotates the 3D cube to that face with acoustic tone feedback (`soundEngine`).
  * **Second Click / `[Explore ↗]` badge**: Slides open the technical specification drawer (`FacePanel`).
  * **Hover Floating Micro-Card**: Displays a glass tooltip preview card above the hovered pill with service tagline, deliverable checkmarks, and keyboard shortcut cue (`Key 1-6`).
  * **Horizontal Auto-Centering**: Uses container-only `container.scrollTo({ left, behavior: 'smooth' })` to keep the active service centered without hijacking window scroll.
  * **Mouse Wheel Support**: Converts vertical mouse wheel events to horizontal scrolling across the rail.
* **Bottom Scroll Cue**:
  * Bouncing arrow cue button jumping down to explore sections (`#services`, `#bundles`, `#projects`).
  * Fast-jump tags: `Bundles`, `Projects`, `Get in Touch →`.

---

## 6. Persistent Floating AI Gizmos

### 6.1 3D AI Receptionist Core (`OrientationGizmo.tsx`)
* **Position**: Fixed at `bottom-5 left-4 sm:left-6 z-40`.
* **Visual**: Miniature glowing 3D wireframe cube with 8 vertex nodes, radiant plasma sphere, and dual rotating energy rings (zero bulky card background).
* **Badge**: High-contrast pill button displaying emerald beacon dot + `"AI Receptionist · Talk & Book Call"`.
* **Dual-Mode Interactive Dialog**:
  1. **🎙️ Talk with Receptionist (Maya)**:
     * **Voice Synthesis (TTS)**: Maya reads greeting and answers aloud in natural English/Hinglish via Web Speech API (`window.speechSynthesis`).
     * **Voice Input (STT)**: Microphone button allowing speech recognition (`SpeechRecognition`) with an animated holographic audio wave equalizer.
     * **Interactive Discovery**: Answers questions regarding custom pricing, architecture, and timeline, with direct buttons to switch to the booking form.
  2. **📅 Book 15-Minute Technical Discovery Call**:
     * **Day Selection**: Tomorrow, In 2 Days, This Friday, Next Monday.
     * **Time Slot Selection**: 10:30 AM IST, 1:00 PM IST, 3:30 PM IST, 5:00 PM IST, 7:00 PM IST.
     * **Focus Area Selection**: AI Receptionist, Modern Web Dev, WhatsApp Automation, Custom Software, Turnkey Growth Bundle.
     * **Instant Confirmation Screen**:
       * Generates reference token (`NR-BOOK-XXXX`).
       * **Google Calendar Link**: One-click add to Google Calendar.
       * **Download `.ICS` Button**: Generates and downloads RFC-5545 `.ics` calendar invite.
       * **WhatsApp Aditya**: One-click handshake sending pre-filled booking details to WhatsApp (+91 9258032799).

### 6.2 Nik AI Engineering Assistant (`NikChatbot.tsx`)
* **Position**: Fixed at `bottom-5 right-5 z-50`.
* **Visual**: Cybernetic glass chat window with smooth minimize/maximize toggle (expands to 720px width).
* **Teaser Bubble**: Auto-shows an invite pill after 3.5 seconds: *"Have a question? Ask Nik about services, pricing, or tech in English/Hinglish."*
* **Features**:
  * **5 Categorized Exploration Tabs**:
    * *Popular*: General questions, capabilities, studio overview.
    * *Verticals*: Clinic automation, resort concierge, real estate bot, D2C recovery.
    * *Bundles & Pricing*: 3 turnkey packages, scope, 30-day bug warranty.
    * *Tech & AI*: Hybrid RAG (BM25 + pgvector), sub-600ms voice AI, Core Web Vitals, DPDP Act 2023.
    * *Code Recipes*: WhatsApp Cloud API webhook, Razorpay verification, sliding window rate limiter.
  * **Founder Direct Handshake Drawer**: In-chat form to send contact & notes directly to founder Aditya Tamta (`<24h guaranteed reply`).
  * **Voice Dictation**: Microphone speech-to-text input with live visual equalizer.
  * **Text-to-Speech (TTS)**: Speaker button on assistant bubbles to hear Nik read answers aloud.
  * **Markdown & Code Rendering**: Formatted tables, callout blocks, and syntax-highlighted code blocks with a one-click copy button.
  * **Transcript Export**: One-click download of the complete chat history in Markdown (`.md`).

---

## 7. Comprehensive Content Stream (Sections 1 through 9)

### Section 1: 8 Core Services Showcase (`#services`)
* **Header**: `"Nikneuron Services // 8 Core Verticals"` with cyan beacon dot.
* **8 Vertical Cards (2-Column Grid)**:
  1. **UI/UX & Web**: Mobile-first UI/UX, Figma prototypes, business sites & UPI/Razorpay e-commerce (`#ff5aa5`).
  2. **Batch Mail & Marketing**: Bulk email, WhatsApp & SMS campaigns, reusable templates & list verification (`#a78bfa`).
  3. **Custom Software**: ERP, CRM, SaaS platforms, Flutter/React Native apps & Tally integrations (`#fbbf24`).
  4. **Support & Growth**: Ongoing maintenance, KPI dashboards, Google review automation & team onboarding (`#34d399`).
  5. **AI Receptionist**: 24/7 call & chat answering, calendar sync, Hindi/Hinglish & outbound reminders (`#4fd8ff`).
  6. **AI & Chat Automation**: WhatsApp/IG bots, company-data AI, n8n/Zapier/Make workflows & invoice extraction (`#60a5fa`).
  7. **Cloud Infrastructure**: AWS/GCP setups, Docker containers, zero-downtime CI/CD pipelines & PostgreSQL clusters.
  8. **Cyber Defense & Security**: API hardening, penetration testing, authentication audits & DPDP 2023 compliance.
* **Card Anatomy**:
  * Distinct signature neon border and icon.
  * Benefit checkmarks and deliverable tags.
  * Associated case study quick-link.
  * **"Explore in 3D" Button**: Holographic button with 3D wireframe box icon, shimmer sweep, and dynamic color glow (rotates 3D cube + opens specs drawer).
  * **"Inquire" Button**: Direct trigger pre-filling inquiry form.
* **Transition Banner**: Callout banner highlighting the **Turnkey Growth Bundles**.

### Section 2: Trust Telemetry Strip (`#trust`)
* 4 live telemetry metrics:
  * **`100/100`**: Google Lighthouse performance score on core production builds.
  * **`<600ms`**: Real-time voice & chatbot response latency across automated pipelines.
  * **`30-Day`**: Complimentary post-launch bug warranty on all deployments.
  * **`0%`**: Zero platform lock-in (clients receive 100% code ownership & direct cloud credentials).

### Section 3: Real Systems & Battle-Tested Case Studies (`#projects`)
* **Battle-Tested Projects**:
  1. **TheConclusion**: Multi-agent AI idea validator stress-testing startup concepts in seconds (FastAPI, Python, React, Groq, Gemini API, Tailwind CSS).
  2. **NextOpportunityFind**: India-focused job discovery, algorithmic matching & automated resume tailoring (FastAPI, Python, Supabase, PostgreSQL, React 18, Vite, Tailwind CSS).
  3. **FileCore**: 100% client-side privacy file utility suite with radial Function Wheel UI (React 19, TypeScript, Vite, pdf-lib, Tailwind CSS, Web Audio API).
* **Card Layout**: Problem/Solution breakdown, architecture nodes schema, terminal log simulation, live demo link, GitHub link, and **"View Architecture & Specs"** deep-dive trigger.

### Section 4: In-Browser Live Playgrounds (`#playground`)
* Interactive sandboxes proving technical engineering capabilities:
  1. **Real SHA-256 Web Crypto Hash Inspector**: Drag & drop any file or type text to inspect real-time cryptographic hashes locally without server uploads.
  2. **Dynamic ROI & Time-Saved Calculator**: Interactive sliders adjusting business leads and support volume to calculate estimated monthly hours and costs saved through AI automation.

### Section 5: 4-Step Velocity Process & Timeline (`#process`)
* **Step 01: Discover & Align (2–4 Days)**: Pinpointing bottlenecks before writing code; architectural roadmap, technical scope, and milestone estimates.
* **Step 02: Design & Prototype (3–7 Days)**: Interactive Figma prototypes, component proofs, design tokens, API schema, and database ERD.
* **Step 03: Build & Iterate (1–3 Weeks)**: High-velocity sprints with weekly live demo checkpoints, branch protections, and performance audits.
* **Step 04: Deploy & Support (Ongoing)**: Zero-downtime cloud release (AWS/Vercel/GCP), CI/CD pipelines, documentation, and a **14–30 day complimentary warranty**.

### Section 6: About Founder Aditya Tamta (`#about`)
* **Founder Identity**: Aditya Tamta — Creative Technologist & Full-Stack Engineer based in Almora, Uttarakhand.
* **Engineering Philosophy**: Direct collaboration (no account executives or middle managers), transparent git commits, honest communication, and digital experiences that leave a lasting impression.
* **Founder Motto**: *"Technology is changing, so we have to change too."*
* **Interactive Actions**: View CV / Resume Modal trigger, GitHub profile link, LinkedIn profile link.

### Section 7: Engagement Options & Turnkey Bundles (`#bundles`)
* 3 transparent engagement tiers:
  1. **Free Discovery Pilot (Zero Risk)**: Rapid architectural audit and small proof-of-concept milestone for evaluating feasibility before committing budget.
  2. **Fixed-Scope Sprint (Most Popular)**: Defined deliverables, milestone-based split payments, guaranteed launch date, and full source code ownership.
  3. **Dedicated Engineering Retainer (Continuous Velocity)**: Embedded senior full-stack support on an ongoing monthly basis with flexible rollover terms.

### Section 8: Frequently Asked Questions (`#faq`)
* Filterable accordions answering realistic client questions across 4 categories:
  * *General*: Specializations, direct founder communication, subcontracting policy.
  * *Technical*: Stack compatibility, repository integration, cloud deployment.
  * *Pricing*: Milestone payment structures, fixed pricing, retainer terms.
  * *Process*: Post-launch warranty, bug fixes, maintenance handovers.

### Section 9: Direct Contact Suite & Almora Studio Coordinates (`#contact`)
* **Direct Contact Suite**:
  * Interactive inquiry form with service interest selector and message validation.
  * Direct WhatsApp link (+91 9258032799) with pre-filled message templates.
  * Direct email link (`nikneuron@gmail.com`).
  * Direct Google Calendar scheduling link (`https://cal.com/aditya-tamta`).
  * Interactive Almora Studio coordinates card highlighting Himalayan creative roots and remote global availability.

---

## 8. Overlays, Diagnostic Wizards & Slide-In Drawers

* **Slide-In 3D Face Component Inspector (`FacePanel.tsx`)**:
  * Opens from the right when any cube face or service is inspected.
  * Displays service icon, category badge, tagline, key benefits, realistic use case scenarios, associated case studies, and discovery tags.
  * Bottom quick navigation to browse all services, view bundles, or jump to contact.
* **Global Command Palette (`CommandPalette.tsx`)**:
  * Triggered via `⌘K` or `/` key hotkey.
  * Fast fuzzy search filtering across all 8 services, 3 bundles, real case studies, and live playgrounds.
* **Help Me Choose Wizard (`HelpMeChooseWizard.tsx`)**:
  * 4-step diagnostic questionnaire asking business goals, target platforms, timelines, and budgets to recommend tailored solutions.
* **Side-by-Side Compare Modal (`CompareModal.tsx`)**:
  * Multi-column comparison matrix evaluating services or packages side-by-side with feature checkmarks.
* **Project Architecture Modal (`ProjectDetailModal.tsx`)**:
  * Full-screen technical deep dive displaying system architecture diagrams, data flow pipelines, stack specifications, and terminal logs.

---

## 9. Bottom Footer & Telemetry Strip ("The Footer")

### 9.1 Top 5-Column Grid
* **Columns 1–2 (Brand & Studio Info)**:
  * HD Logo with glowing border + `"Nikneuron"` wordmark.
  * Studio Tagline: *"Built, Not Promised · Ultra-Fast Web & AI Systems"*.
  * Description of founder-led software engineering from Almora, Uttarakhand.
  * Founder Motto: *"Technology is changing, so we have to change too."*
* **Column 3 (Solutions Links)**:
  * Quick links to `8 Core Services`, `Turnkey Bundles`, `3D Living Tesseract`, `Live Interactive Demos`, `Request Free Quote →`.
* **Column 4 (Engineering & Terms Links)**:
  * Quick links to `Case Studies & Stacks`, `4-Step Velocity Process`, `About Aditya Tamta`, `Engagement Frameworks`, `Frequently Asked Questions`.
* **Column 5 (Direct Founder Contact & Socials)**:
  * Direct callout: *"Work directly with Aditya Tamta. Replies guaranteed within 24 hours."*
  * Book 15-Min Call link, direct Email link, WhatsApp link.
  * Circular neon social icons: **GitHub**, **LinkedIn**, **Twitter/X**, **WhatsApp**, **Mail**.

### 9.2 Bottom Bar & Telemetry
* **Copyright**: `© 2026 Nikneuron · Engineered by Aditya Tamta. All rights reserved.`
* **Tech Stack Telemetry**: `React 18 · Three.js · TypeScript · Tailwind`.
* **Smooth Return to Top**: Interactive `"Back to Top ↑"` trigger with sound haptic feedback.

---

## 10. Web Audio Synthesizer Engine & Acoustic Haptics

Nikneuron synthesizes all acoustic feedback on the fly using native Web Audio API oscillators (`audio.ts`), requiring zero downloaded MP3 or WAV files:
* **UI Tick / Tone**: `playTone(600, 0.08, 'sine', 0.06)` — Triggered on hover and pill taps.
* **Holographic Snap**: `playSnapHolo()` (520Hz sine ramping to 780Hz) — Triggered on 3D face lock and drawer slide-in.
* **Laser Sweep**: `playLaserShoot()` (Sawtooth wave 80Hz ramping to 1400Hz) — Triggered on primary action confirmations.
* **Audio Mute Support**: Global state toggle persisted in memory.

---

## 11. Performance Budgets & Accessibility Conformance

* **Performance Metrics**:
  * Sub-second First Contentful Paint (<0.6s).
  * 60 FPS WebGL rendering with GPU power-preference prioritization.
  * Dynamic DPR clamping: `Math.min(window.devicePixelRatio || 1, 2)`.
  * Pre-rendered canvas caching for static nebula clusters.
* **Accessibility (WCAG AAA)**:
  * Full keyboard navigation: `[1–6]` for cube faces, `[←] [→]` for rails, `⌘K` for search, `Escape` to close drawers.
  * High-contrast focus rings (`outline: 2px solid #4fd8ff`).
  * Automatic `prefers-reduced-motion` detection (pauses particle animations and disables 3D rotations).
  * Screen-reader ARIA live region (`role="status"`) announcing face rotations and section navigations.
  * Accessible 2D Semantic List View Mode toggle.
