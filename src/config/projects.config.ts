export type Project = {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  stack: string[];
  status: 'live' | 'prototype' | 'in-development';
  serviceIds: string[]; // links to services in services.config.ts
  links: {
    demo?: string;
    github?: string;
    video?: string;
  };
  media: {
    thumbnail?: string;
    screenshots?: string[];
  };
  architectureNodes: string[];
  terminalPreview: string[];
  highlights: string[]; // honest, concrete outcomes
  featured: boolean;
};

export const PROJECTS_CONFIG: Project[] = [
  {
    id: 'the-conclusion',
    title: 'TheConclusion',
    tagline: 'Multi-agent AI idea validator stress-testing startup concepts in seconds',
    problem: 'Founders and product builders spend weeks gathering fragmented feedback, leaving product viability and market risks unvalidated.',
    solution: 'Engineered an autonomous multi-agent validation pipeline where specialized LLM agents (market analyst, tech auditor, skeptic) interrogate startup ideas and produce actionable synthesis reports.',
    stack: ['FastAPI', 'Python', 'React', 'Groq', 'Gemini API', 'Tailwind CSS'],
    status: 'prototype',
    serviceIds: ['ai-receptionist', 'ai-automation', 'ui-ux-design'],
    links: {
      demo: '#playground-the-conclusion',
      github: 'https://github.com/adityatamta',
    },
    media: {
      thumbnail: '/projects/the-conclusion.png',
    },
    architectureNodes: ['Idea Prompt', 'FastAPI Orchestrator', 'Groq Llama-3 Agents', 'Gemini Rubric Scorer', 'Verdict Tree UI'],
    terminalPreview: [
      '$ POST /api/v1/validate { "idea": "B2B AI Invoice Auditor" }',
      '[MarketAgent] Evaluating TAM & buyer urgency... score=88/100',
      '[TechAuditor] Checking inference latency & stack fit... score=93/100',
      '[SkepticAgent] Probing defensibility & churn risks... score=74/100',
      '✓ Synthesis report streamed in 3.2s (HTTP 200)',
    ],
    highlights: [
      'Sub-4s multi-agent deliberation rounds using Groq high-speed inference',
      'Structured rubric scoring risk, moat, and market viability with Gemini API',
      'Interactive executive verdict dashboard with collapsible critique trees',
    ],
    featured: true,
  },
  {
    id: 'next-opportunity-find',
    title: 'NextOpportunityFind',
    tagline: 'India-focused job discovery, algorithmic matching & automated resume tailoring',
    problem: 'Job seekers in India face fragmented hiring boards, noisy listings, and repetitive manual resume tuning for every application.',
    solution: 'Architected an automated career discovery engine that parses job descriptions, evaluates candidate skill alignment, and dynamically refactors resumes for specific openings.',
    stack: ['FastAPI', 'Python', 'Supabase', 'PostgreSQL', 'React 18', 'Vite', 'Tailwind CSS'],
    status: 'in-development',
    serviceIds: ['ai-automation', 'web-development', 'custom-software'],
    links: {
      github: 'https://github.com/adityatamta',
    },
    media: {
      thumbnail: '/projects/next-opportunity-find.png',
    },
    architectureNodes: ['PDF Resume Parser', 'pgvector Embeddings', 'Job Feed Aggregator', 'Alignment Scorer', 'Tailored Export'],
    terminalPreview: [
      '$ python -m worker.match --candidate resume_v4.pdf',
      '[Parser] Extracted 18 technical skills & 3 project domains',
      '[Supabase] Queried pgvector cosine similarity across 1,420 active listings',
      '[Matcher] Top match: Full-Stack AI Engineer (0.91 similarity)',
      '✓ Tailored bullet points exported cleanly',
    ],
    highlights: [
      'Supabase vector similarity search matching candidate resumes to live openings',
      'Automated PDF resume parser extracting semantic skills and career trajectories',
      'Clean reactive web dashboard with fast filters and tailored application exports',
    ],
    featured: true,
  },
  {
    id: 'file-core',
    title: 'FileCore',
    tagline: 'Client-side cyberpunk file utility suite with radial Function Wheel UI',
    problem: 'Online document and media converters rely on sketchy servers that compromise privacy, show ads, or impose artificial size limits.',
    solution: 'Built a 100% in-browser, privacy-respecting file Swiss Army knife offering 11 distinct manipulation tools powered by WebAssembly and client-side memory pipelines.',
    stack: ['React 19', 'TypeScript', 'Vite', 'pdf-lib', 'Tailwind CSS', 'Web Audio API'],
    status: 'live',
    serviceIds: ['ui-ux-design', 'web-development'],
    links: {
      demo: '#playground-file-core',
      github: 'https://github.com/adityatamta',
    },
    media: {
      thumbnail: '/projects/file-core.png',
    },
    architectureNodes: ['File Dropzone', 'ArrayBuffer RAM', 'pdf-lib / Web Crypto', 'Radial Wheel HUD', 'Instant Local Blob'],
    terminalPreview: [
      '[FileCore] Loaded contract_draft.pdf (1.42 MB) in browser RAM',
      '[ZeroUpload] Network requests: 0 bytes outbound',
      '[WebCrypto] SHA-256: 9f86d081884c7d659a2feaa0c55ad015...',
      '[pdf-lib] Stripped metadata & merged 4 pages in 118ms',
      '✓ Ready for instant local download',
    ],
    highlights: [
      '11 client-side tools (PDF merge/split, image compress, metadata strip, hash verify)',
      'Innovative kinetic 360° radial "Function Wheel" navigation with haptic audio cues',
      'Zero server uploads — 100% of processing executes strictly inside client browser RAM',
    ],
    featured: true,
  },
  {
    id: 'clarify',
    title: 'Clarify',
    tagline: 'Classroom doubt-detection & engagement radar (SAARTHI\'26 Hackathon)',
    problem: 'Educators in large classrooms struggle to notice silent student confusion, leading to widening comprehension gaps before exam time.',
    solution: 'Created an intelligent doubt triage system developed during the SAARTHI\'26 hackathon that aggregates real-time classroom friction points and clusters recurring conceptual roadblocks for professors.',
    stack: ['Python', 'FastAPI', 'React', 'Groq', 'Tailwind CSS', 'Socket.io'],
    status: 'prototype',
    serviceIds: ['ai-automation', 'custom-software'],
    links: {
      github: 'https://github.com/adityatamta',
    },
    media: {
      thumbnail: '/projects/clarify.png',
    },
    architectureNodes: ['Anonymous Student Input', 'Socket.io Stream', 'Groq Semantic Clusterer', 'Friction Heat Score', 'Instructor Radar'],
    terminalPreview: [
      '[Socket.io] Room #CS302 active · 64 connected students',
      '[Clusterer] 14 new doubts grouped -> "Dynamic Programming Memoization"',
      '[Alert] Comprehension friction threshold exceeded (78%) on Slide 19',
      '✓ Pushed live pause cue to Instructor Radar',
    ],
    highlights: [
      'Built in 24 hours for the SAARTHI\'26 Hackathon',
      'Real-time semantic clustering grouping similar student questions without revealing names',
      'Instructor radar view flagging topics causing the highest cognitive friction',
    ],
    featured: true,
  },
  {
    id: 'atm-entry-monitor',
    title: 'ATM Entry Monitor',
    tagline: 'Computer vision security system with instant voice warnings for helmet, hat & crowd violations',
    problem: 'ATM vestibules face security risks when individuals conceal their faces or gather in unauthorized groups before entering.',
    solution: 'Developed an edge vision monitoring script connecting CCTV streams to OpenCV and audio synthesis, instantly vocalizing custom warning alerts when unpermitted headwear or overcrowding is detected.',
    stack: ['Python', 'OpenCV', 'YOLOv8', 'pyttsx3', 'NumPy'],
    status: 'prototype',
    serviceIds: ['ai-automation', 'support-growth'],
    links: {
      github: 'https://github.com/adityatamta',
    },
    media: {
      thumbnail: '/projects/atm-entry-monitor.png',
    },
    architectureNodes: ['RTSP CCTV Frame', 'YOLOv8 Inference', 'Headwear & ROI Rules', 'pyttsx3 Voice Engine', 'Vestibule Speaker'],
    terminalPreview: [
      '[Stream] Connected RTSP vestibule camera @ 30 FPS',
      '[YOLOv8] Detected: person=2, motorcycle_helmet=1 (conf=0.91)',
      '[Policy] Violation: HELMET_CONCEALMENT + CROWD_LIMIT',
      '[Audio] Broadcast: "Please remove your helmet before entering."',
      '✓ Incident frame archived locally',
    ],
    highlights: [
      'Real-time object & boundary detection running at 28+ FPS on consumer hardware',
      'Rule engine detecting motorcycle helmets, face-obscuring caps, and entry group size',
      'Sub-second directional text-to-speech speaker broadcast alerting violators',
    ],
    featured: true,
  },
  {
    id: 'ai-receptionist-cube',
    title: 'AI Receptionist Cube',
    tagline: 'Futuristic spatial 3D interface for autonomous voice & appointment concierge',
    problem: 'AI agent interfaces often look like generic chatbot chat-bubbles, failing to communicate reliability or enterprise distinction.',
    solution: 'Designed and engineered an interactive 3D spatial web application showcasing an autonomous AI receptionist system with real-time audio visualizers, conversational states, and calendar integrations.',
    stack: ['React 18', 'Three.js', 'React Three Fiber', 'Tailwind CSS', 'Web Audio API'],
    status: 'live',
    serviceIds: ['ai-receptionist', 'ui-ux-design'],
    links: {
      demo: '#playground-ai-receptionist',
      github: 'https://github.com/adityatamta',
    },
    media: {
      thumbnail: '/projects/ai-receptionist-cube.png',
    },
    architectureNodes: ['R3F 3D Tesseract', 'GLSL Plasma Core', 'Web Audio Synth', 'Intent Triage Machine', 'Calendar Slot Engine'],
    terminalPreview: [
      '[R3F] Mounted Living Tesseract shader (60 FPS · dpr<=1.5)',
      '[Audio] Web Audio synthesizer ready (zero external MP3s)',
      '[Triage] Intent=BOOK_APPOINTMENT -> Slots: [10:30, 14:15, 16:45]',
      '✓ Spatial concierge active in production',
    ],
    highlights: [
      'Interactive 3D energy cube serving as spatial brand focal point',
      'Integrated Web Audio synthesis for low-latency futuristic auditory feedback',
      'Multi-device responsive layout with accessible 2D fallback mode',
    ],
    featured: true,
  },
];

export function getAllProjects(): Project[] {
  return PROJECTS_CONFIG;
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS_CONFIG.filter((p) => p.featured);
}

export function getProjectById(id: string): Project | undefined {
  return PROJECTS_CONFIG.find((p) => p.id === id);
}

export function getProjectsByServiceId(serviceId: string): Project[] {
  return PROJECTS_CONFIG.filter((p) => p.serviceIds.includes(serviceId));
}

export default PROJECTS_CONFIG;
