# Nikneuron — Master Execution Plan & Engineering Roadmap (`task.md`)

> **Strategic Directive**: Transform Nikneuron from an interactive 3D hero cube into a comprehensive, high-trust portfolio and service agency platform. Retain the living 3D Energy Cube as the signature visual centerpiece that docks on scroll and guides visitors through tangible proof of work.

---

## 1. High-Level Architecture & Current Status

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Configs & Honesty Audit               [COMPLETED & VERIFIED]  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Layout Shell, Navbar & Docked Cube    [COMPLETED & VERIFIED]  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Trust Strip & Projects Showcase       [COMPLETED & VERIFIED]  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Proof Linking & Search Indexing       [COMPLETED & VERIFIED]  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 5: Live Playgrounds, Process & About     [COMPLETED & VERIFIED]  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 6: FAQ, Contact Form & Footer            [COMPLETED & VERIFIED]  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 7: Accessibility, Performance & SEO      [COMPLETED & VERIFIED]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase-by-Phase Roadmap: What Is Left to Build

### ✅ Phase 1: Config Files & Honesty Alignment (Completed)
- [x] Create `src/config/projects.config.ts` with typed schema for 6 featured projects (`the-conclusion`, `next-opportunity-find`, `file-core`, `clarify`, `atm-entry-monitor`, `ai-receptionist-cube`).
- [x] Create `src/config/site.config.ts` for trust stats, founder profile, process milestones, engagement options, FAQs, and contact links.
- [x] Remove exaggerated claims from `src/config/services.config.ts` (e.g., 5M emails/hr, 99.999% uptime, SOC 2 in weeks) and replace with verifiable engineering capabilities.
- [x] Add bidirectional `projectIds` linking services to concrete project proofs.
- [x] Align `src/services/recommendationService.ts` problem descriptions.
- [x] Production build validation (`npm run build` passed in 16s).

---

### ✅ Phase 2: Layout Shell, Sticky Navbar & Scroll-Linked Docked Cube (Completed)
- [x] **State Store Extension (`src/store/useAppStore.ts`)**:
  - Add `activeSection: string` (`'hero'`, `'trust'`, `'projects'`, `'services'`, `'playground'`, `'process'`, `'about'`, `'engagement'`, `'faq'`, `'contact'`).
  - Add `scrollProgress: number` (0 to 1).
  - Add `isCubeDocked: boolean` (triggered when hero scrolls past threshold).
  - Add `selectedProjectId: string | null` and modal actions.
- [x] **Sticky Glass Navbar (`src/components/layout/Navbar.tsx`)**:
  - Top glassmorphic bar that transitions smoothly from hero floating mode into a compact sticky navigation bar on scroll.
  - Section anchor links with active underline indicator.
  - Quick action buttons: "Book Call", "Help Me Choose" (Wizard), Sound Toggle, and View Mode Toggle (<kbd>V</kbd>).
  - Real-time scroll progress indicator line across top viewport edge.
- [x] **Page Scroll Container (`src/components/layout/PageContainer.tsx`)**:
  - Replaces current `overflow-hidden` container on the outer wrapper to enable native buttery scrolling while preserving fixed WebGL backgrounds.
  - Supports deep anchor linking (`#projects`, `#services`, `#contact`, etc.).
- [x] **Scroll-Linked Docked Cube Mechanism (`src/components/cube/DockedCubeCompanion.tsx`)**:
  - When scrolling beyond the hero section (e.g. `scrollY > 400px`), the 3D cube smoothly scales down (~220px desktop, ~140px mobile) and docks into the bottom-right corner as an interactive companion.
  - Tapping or clicking the docked cube re-centers or expands it back to hero mode.
  - **Scroll-to-Face Kinematics**: As different sections enter view (via `IntersectionObserver` or Framer Motion `useScroll`), the cube automatically triggers quaternion slerp rotations to orient toward that section's corresponding face (e.g. Services section rotates to Face 01/05).
  - **Manual Override Guard**: If the user is manually dragging or orbiting the cube, auto-rotation suspends for 3 seconds so we never hijack user intent.
- [x] **WebGL Performance Optimization**:
  - Throttle canvas frameloop when idle or out of viewport (`frameloop="demand"` when static).
  - Reduce pixel ratio (`dpr={Math.min(window.devicePixelRatio, 1.5)}`) to keep mobile 60 FPS.

---

### ✅ Phase 3: Trust Strip, Projects Showcase & Project Modal (Completed)
- [x] **Trust Strip (`src/components/sections/TrustStrip.tsx`)**:
  - Slim, high-contrast cyber telemetry banner directly below hero.
  - Reads directly from `SITE_CONFIG.trustStats`:
    - `6+` Projects Built (Interactive tools & AI systems).
    - `15+` Core Technologies (TypeScript, Python, Three.js, FastAPI, etc.).
    - `1-on-1` Direct Collaboration (Zero agency overhead).
    - `< 24h` Response Time Guaranteed.
  - Subtle neon divider line and micro-hover states.
- [x] **Projects Showcase Section (`src/components/sections/ProjectsSection.tsx`)**:
  - Pinned horizontal scroll container on desktop with fallback touch swipe carousel on mobile.
  - Render all 6 projects from `PROJECTS_CONFIG`:
    1. **TheConclusion** (Multi-agent AI idea validator).
    2. **NextOpportunityFind** (India-focused job discovery & resume tailoring).
    3. **FileCore** (Client-side cyberpunk file suite with radial UI).
    4. **Clarify** (Classroom doubt-detection radar, SAARTHI'26).
    5. **ATM Entry Monitor** (Computer vision CCTV security alerts).
    6. **AI Receptionist Cube** (Spatial 3D concierge interface).
- [x] **Project Card Component (`src/components/projects/ProjectCard.tsx`)**:
  - Status badge with pulse dot (`Live` [green], `Prototype` [cyan], `In Development` [amber]).
  - Tech stack pill chips with high-contrast borders.
  - Concise problem & solution summary.
  - Action buttons: "Live Demo", "GitHub", and "Inspect Architecture".
  - Lazy-loaded media slot with procedural fallback thumbnail.
- [x] **Project Detail & Video Modal (`src/components/projects/ProjectDetailModal.tsx`)**:
  - Full-screen glass modal displaying architecture diagrams, complete outcome highlights, video preview slot, and linked services.

---

### ✅ Phase 4: Proof Linking & Search Indexing (Completed)
- [x] **Services Section Backed by Proof (`src/components/sections/ServicesSection.tsx`)**:
  - Grid presentation of the 6 core services.
  - Each service card features a **"Built Proof"** drawer displaying the actual projects powering that service.
  - Clicking a project reveals which service competencies it demonstrates.
- [x] **FacePanel Proof Extension (`src/components/faces/FacePanel.tsx`)**:
  - When a face is inspected in the 3D cube, add a dedicated **"Proof in Production"** tab listing related project cards with one-click navigation to their showcase section.
- [x] **Search & Command Palette Indexing (`src/components/search/CommandPalette.tsx`)**:
  - Extend Fuse.js index to search across:
    - 6 Services & their tags.
    - 6 Projects, their stack keywords, and problems solved.
    - Site sections (About, Contact, Process, FAQ).
  - Selecting a project result smoothly scrolls to that project in the showcase and highlights the card with a cyber glow pulse.

---

### ✅ Phase 5: Live Playground, Process Timeline & About Founder (Completed)
- [x] **Live Interactive Playgrounds (`src/components/sections/PlaygroundSection.tsx`)**:
  - Three self-contained, 100% client-side interactive sandboxes:
    1. **Mini File Tool (FileCore preview)**: Client-side text/file checksum hasher & byte counter.
    2. **AI Receptionist Voice/Chat Mock**: Interactive simulated voice triage dialogue demonstrating sub-second prompt routing and appointment scheduling.
    3. **Idea Stress-Tester (TheConclusion preview)**: Quick input box where visitors type a product idea and receive instant simulated multi-agent verdicts (Market, Tech, Skeptic).
  - Explicitly labeled with badge: `Client-Side Interactive Demo`.
- [x] **How We Work Timeline (`src/components/sections/ProcessSection.tsx`)**:
  - 4-step vertical animated timeline:
    - `01 // Discover & Align` (2–4 Days).
    - `02 // Design & Prototype` (3–7 Days).
    - `03 // Build & Iterate` (1–3 Weeks).
    - `04 // Deploy & Support` (Ongoing).
  - Animated laser progress beam connecting the steps as the user scrolls.
- [x] **About the Founder (`src/components/sections/AboutSection.tsx`)**:
  - Feature **Aditya Tamta**, Founder & Full-Stack Creative Technologist.
  - Prominent quote: *"Technology is changing, so we have to change too."*
  - Photo frame with neon border styling and fallback initials avatar.
  - Narrative story highlighting engineering ethos, building real tools over hype.
  - Direct CTA button linking to resume (`SITE_CONFIG.founder.resumeUrl`).
- [x] **Engagement Models (`src/components/sections/EngagementSection.tsx`)**:
  - Three transparent cards:
    - **Free Discovery Pilot**: Zero risk technical audit or mini-wireframe milestone.
    - **Fixed-Scope Sprint**: Defined deliverables, milestones, and launch date.
    - **Dedicated Engineering Retainer**: Ongoing monthly velocity for fast-moving teams.
  - Clear deliverables breakdown without fabricated pricing.

---

### ✅ Phase 6: FAQ, Contact Form & Footer (Completed)
- [x] **FAQ Accordion (`src/components/sections/FAQSection.tsx`)**:
  - Built with Radix UI Accordion primitive with smooth height animations.
  - Answers core client concerns: deliverables ownership, direct collaboration vs outsourcing, milestone payments, codebase integration, and post-launch warranty.
- [x] **Contact Section (`src/components/sections/ContactSection.tsx`)**:
  - Formspree-ready contact form: Name, Email, Service Interest dropdown, Message, and Submit button.
  - Direct Action CTAs:
    - **WhatsApp Direct Message** button.
    - **Book a 15-Min Intro Call** (Cal.com / Calendly integration).
  - Prominent commitment badge: *"Replies guaranteed within 24 hours on business days"*.
  - Live status indicator: *"Currently accepting 1 new client project"*.
- [x] **Footer (`src/components/layout/Footer.tsx`)**:
  - Brand identity, mission tagline, section anchor directory.
  - GitHub, LinkedIn, Twitter/X, and Email social links.
  - Copyright and *"Built with React 18, Three.js & Tailwind"*.

---

### ✅ Phase 7: Accessibility, Parity, Performance & SEO (Completed)
- [x] **Accessible 2D Mode Parity (`src/components/views/ListViewFallback.tsx`)**:
  - Ensure pressing <kbd>V</kbd> renders the full page content (Projects, Proof, Timeline, About, Contact) in a high-contrast, zero-WebGL layout for low-end hardware and screen readers.
- [x] **Accessibility & Motion Preferences**:
  - Full `prefers-reduced-motion` implementation: disable camera parallax, space particle drift, and scroll auto-rotation; display static layouts.
  - Screen reader ARIA live region updates on section change.
  - Strict keyboard tab index and focus rings across all new inputs and buttons.
- [x] **Performance Engineering**:
  - Dynamic imports (`React.lazy` + `Suspense`) for heavy modals, video players, and 3D scenes.
  - Asset lazy loading and WebP/SVG format enforcement.
  - Target Lighthouse Performance score of 85+ on mobile.
- [x] **SEO & Metadata**:
  - Title tag: `Nikneuron | Interfaces for the World That’s Coming — Spatial Web & AI Engineering`
  - Meta description, OpenGraph tags, Twitter card tags in `index.html`.
  - JSON-LD structured data schema for `Organization` and `Person` (Aditya Tamta).

---

## 3. Senior Engineer Advice & Architectural Recommendations

### 💡 Advice 1: The "Dual-Canvas vs Fixed Viewport" Dilemma for the Docked Cube
- **The Challenge**: If you mount a second `<Canvas>` for the corner docked cube, Three.js will compile all shaders twice and consume double the GPU context memory. If you try to animate the hero canvas into a corner using CSS `position: fixed`, it can trigger layout re-calculations on scroll.
- **The Recommended Solution**: Keep a single Three.js Canvas with `position: fixed; inset: 0; pointer-events: none;`. In the Three.js render loop, dynamically interpolate the cube mesh's position and scale:
  - At Hero (`scrollY === 0`): `position = [0, 0, 0]`, `scale = 1.0`.
  - Scrolled down (`scrollY > 400px`): `position = [viewportWidth/2 - offset, -viewportHeight/2 + offset, 0]`, `scale = 0.35`.
  - This avoids duplicate canvas contexts, preserves shader compilation, and produces a seamless 60 FPS morph!

### 💡 Advice 2: Scroll-Driven Rotation vs User Orbit (The "Fighting Hands" Trap)
- **The Trap**: When a visitor scrolls, the website wants to rotate the cube to face the section's service. But if the visitor is trying to inspect or drag the cube with their mouse/touch, the scroll listener will violently yank it away.
- **The Solution**: Maintain an `interactionCooldownRef` in `useAppStore`. Whenever a user pointer-down occurs on the cube, disable scroll-driven rotations for 3.5 seconds. Only allow scroll-linked rotation when the user is explicitly scrolling the document body.

### 💡 Advice 3: Deterministic Client-Side Playgrounds
- **The Trap**: Connecting playground widgets to live third-party AI APIs (like Groq or Gemini) in a public portfolio risks rate-limiting, leaked API keys, or server timeouts.
- **The Solution**: Build the playground widgets as **client-side simulated state machines** with realistic delays (300ms–800ms) and procedural responses. For FileCore, use real in-browser WebAssembly (like MD5 hashing or character counting) that actually executes 100% locally in browser memory. This proves technical competence while remaining 100% reliable 24/7.

### 💡 Advice 4: Verifiable Social Proof
- Avoid fake testimonial carousels or generic Fortune 500 logos. Instead, use:
  - Direct links to GitHub commits and public repositories.
  - Video Loom/YouTube demos showing real terminal output and live apps.
  - Concrete problem-and-solution writeups with architecture diagrams.
  - Verifiable hackathon citations (e.g. SAARTHI'26 for Clarify).

---

## 4. Execution Plan & Next Steps

We recommend executing in strict sequence:
1. **Next Up: Phase 2** — Create Navbar, Page layout container, state extensions, and the scroll-linked docked cube companion.
2. **Phase 3** — Trust strip, Project cards, and Project modal.
3. **Phase 4** — Service-to-proof linking and search indexing.
4. **Phase 5** — Interactive playgrounds, Process timeline, and About founder.
5. **Phase 6** — FAQ, Contact form, and Footer.
6. **Phase 7** — Final accessibility pass, 2D fallback parity, and performance/SEO tuning.
