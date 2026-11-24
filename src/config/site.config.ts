export interface TrustStat {
  label: string;
  value: string;
  detail: string;
}

export interface FounderInfo {
  name: string;
  role: string;
  motto: string;
  story: string[];
  photo: string;
  resumeUrl: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export interface EngagementOption {
  id: string;
  title: string;
  badge?: string;
  tagline: string;
  description: string;
  idealFor: string;
  deliverables: string[];
  ctaLabel: string;
  ctaAction: string; // e.g. '#contact' or modal trigger
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'pricing' | 'process';
}

export interface ContactConfig {
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  calendarBookingUrl: string;
  formspreeEndpoint: string;
  replyTimeCommitment: string;
  availabilityStatus: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  subtagline: string;
  missionStatement: string;
  trustStats: TrustStat[];
  founder: FounderInfo;
  processSteps: ProcessStep[];
  engagementOptions: EngagementOption[];
  faqs: FAQItem[];
  contact: ContactConfig;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
  };
  navigation: {
    label: string;
    href: string;
  }[];
}

export const SITE_CONFIG: SiteConfig = {
  brandName: 'Nikneuron',
  tagline: 'Interfaces for the World That’s Coming',
  subtagline: 'Built, not promised. High-impact software, spatial web systems, and AI automation engineering.',
  missionStatement: 'We build production-ready digital products that blend spatial 3D graphics, low-latency AI pipelines, and rock-solid software architecture.',

  // 1. Honest, Verifiable Trust Stats (Never invent numbers)
  trustStats: [
    {
      label: 'Projects Built',
      value: '6+',
      detail: 'Interactive tools, AI pipelines & production web apps',
    },
    {
      label: 'Core Technologies',
      value: '15+',
      detail: 'TypeScript, React, Python, Three.js, FastAPI, Supabase',
    },
    {
      label: 'Direct Collaboration',
      value: '1-on-1',
      detail: 'Work directly with the engineer, zero middleman overhead',
    },
    {
      label: 'Response Time',
      value: '< 24 Hours',
      detail: 'Guaranteed email & message response on business days',
    },
  ],

  // 2. Founder Information
  founder: {
    name: 'Aditya Tamta',
    role: 'Founder & Full-Stack Creative Technologist',
    motto: 'Technology is changing, so we have to change too.',
    story: [
      'I am an engineer and creative technologist passionate about the intersection of real-time 3D graphics, autonomous multi-agent AI systems, and practical full-stack engineering.',
      'Instead of selling vague promises or template websites, I build bespoke, tangible software — whether that means engineering a 100% client-side privacy tool suite (FileCore), a real-time CCTV security warning system (ATM Entry Monitor), or multi-agent validation pipelines (TheConclusion).',
      'Nikneuron represents my design philosophy: high-precision engineering, honest communication, and digital experiences that leave a lasting impression.',
    ],
    photo: '/founder/aditya.jpg', // TODO: replace with your real photo in public/founder/aditya.jpg
    resumeUrl: 'https://read.cv/adityatamta', // TODO: replace with your resume or CV link
  },

  // 3. Process Steps (How we work)
  processSteps: [
    {
      step: '01',
      title: 'Discover & Align',
      duration: '2–4 Days',
      tagline: 'Pinpointing the exact bottleneck before writing a single line of code',
      description: 'We dive deep into your workflow, technical requirements, and core constraints to eliminate guesswork and define clear engineering deliverables.',
      deliverables: [
        'Detailed architectural roadmap & technical scope document',
        'Defined milestones with concrete time estimates',
        'Repository setup and tech stack selection',
      ],
    },
    {
      step: '02',
      title: 'Design & Prototype',
      duration: '3–7 Days',
      tagline: 'Interactive spatial prototypes and design tokens you can test immediately',
      description: 'We construct working wireframes, interactive component proofs, and theme systems in code or Figma so you experience the user flow before final integration.',
      deliverables: [
        'Interactive Figma prototype or rapid React sandbox demo',
        'Accessible color tokens, typography & component states',
        'API schema definition & database ERD diagram',
      ],
    },
    {
      step: '03',
      title: 'Build & Iterate',
      duration: '1–3 Weeks',
      tagline: 'High-velocity sprints with weekly live demo checkpoints',
      description: 'Continuous development with automated testing, clean modular code, responsive styling, and low-latency API connections.',
      deliverables: [
        'Private GitHub repository access with branch protections',
        'Staging environment deploys for live testing and feedback',
        'Performance & accessibility passes (WCAG AA contrast, lighthouse)',
      ],
    },
    {
      step: '04',
      title: 'Deploy & Support',
      duration: 'Ongoing',
      tagline: 'Zero-downtime launch, complete documentation, and post-launch stability',
      description: 'We handle production DNS, containerized builds, CI/CD pipelines, and provide hands-on support so you are never left stuck.',
      deliverables: [
        'Production release deployment on your cloud (AWS/Vercel/GCP)',
        'Comprehensive README, environment setup guide & video walkthrough',
        '14–30 days complimentary bug-fix & stability monitoring window',
      ],
    },
  ],

  // 4. Engagement Options (No fabricated pricing)
  engagementOptions: [
    {
      id: 'pilot',
      title: 'Free Discovery Pilot',
      badge: 'Zero Risk',
      tagline: 'Rapid architectural audit and small proof-of-concept milestone',
      description: 'Perfect for evaluating feasibility before committing budget. We tackle a single high-priority feature, wireframe, or tech audit together.',
      idealFor: 'Startups and teams exploring a new technical initiative or assessing developer fit.',
      deliverables: [
        '30-minute technical discovery session',
        'Feasibility report or mini-prototype demo',
        'No commitment or upfront payment required',
      ],
      ctaLabel: 'Request Free Pilot',
      ctaAction: '#contact',
    },
    {
      id: 'fixed-project',
      title: 'Fixed-Scope Sprint',
      badge: 'Most Popular',
      tagline: 'Clear deliverables, milestone-based payments, and a defined launch date',
      description: 'End-to-end delivery of defined projects — from interactive 3D landing experiences to full-stack web applications and AI agent integrations.',
      idealFor: 'Businesses with a clear scope looking for on-time, polished software execution.',
      deliverables: [
        'Guaranteed timeline and delivery milestone contract',
        'Full source code ownership and comprehensive documentation',
        'Weekly video check-ins and staging environment demos',
      ],
      ctaLabel: 'Discuss Your Project',
      ctaAction: '#contact',
    },
    {
      id: 'retainer',
      title: 'Dedicated Engineering Retainer',
      badge: 'Continuous Velocity',
      tagline: 'Embedded senior full-stack support on an ongoing monthly basis',
      description: 'Dedicated weekly hours for continuous product iteration, performance tuning, new feature releases, and infrastructure maintenance.',
      idealFor: 'Growing companies needing consistent creative technologist velocity without full-time hiring overhead.',
      deliverables: [
        'Priority Slack / WhatsApp communication channel',
        'Guaranteed dedicated capacity per month',
        'Flexible monthly rollover with pause-anytime terms',
      ],
      ctaLabel: 'Check Retainer Availability',
      ctaAction: '#contact',
    },
  ],

  // 5. Frequently Asked Questions (Accordion)
  faqs: [
    {
      id: 'faq-1',
      question: 'What types of projects do you specialize in?',
      answer: 'I specialize in interactive web applications, real-time 3D web experiences (Three.js / WebGL), multi-agent AI systems (FastAPI / Groq / Gemini), and modern full-stack web platforms built with React, TypeScript, and Python.',
      category: 'general',
    },
    {
      id: 'faq-2',
      question: 'Do you work directly on the codebase or through subcontractors?',
      answer: 'You work directly with me (Aditya Tamta). Every line of code, architectural decision, and design detail is executed by me, ensuring fast communication, high accountability, and zero agency markups.',
      category: 'general',
    },
    {
      id: 'faq-3',
      question: 'How do you handle project pricing and milestones?',
      answer: 'For fixed projects, we break work into clear milestone deliverables with split payments (e.g., 50% deposit, 50% on successful completion and sign-off). For exploratory research or ongoing iteration, monthly retainers provide dedicated weekly capacity.',
      category: 'pricing',
    },
    {
      id: 'faq-4',
      question: 'Can you work with our existing stack and repository?',
      answer: 'Yes. I integrate into existing Git workflows (GitHub/GitLab), adhere to your linting and styling conventions, and submit clean pull requests with detailed test notes.',
      category: 'technical',
    },
    {
      id: 'faq-5',
      question: 'What happens after the project launches?',
      answer: 'All fixed projects include a complimentary 14 to 30-day post-launch warranty window where any bugs related to the agreed scope are fixed immediately at no additional cost. Extended ongoing maintenance is also available.',
      category: 'process',
    },
  ],

  // 6. Contact & Scheduling Details
  contact: {
    email: 'nikneuron@gmail.com',
    phone: '+91 9258032799',
    whatsappNumber: '9258032799',
    whatsappUrl: 'https://wa.me/919258032799',
    calendarBookingUrl: 'https://cal.com/aditya-tamta', // TODO: replace with your Cal.com or Calendly link
    formspreeEndpoint: 'https://formspree.io/f/placeholder', // TODO: replace with your Formspree endpoint or backend webhook
    replyTimeCommitment: 'Replies guaranteed within 24 hours (Monday to Friday)',
    availabilityStatus: 'Currently accepting 1 new client project for this month',
  },

  // 7. Social Links
  socials: {
    github: 'https://github.com/adityatamta', // TODO: replace with your GitHub profile
    linkedin: 'https://linkedin.com/in/adityatamta', // TODO: replace with your LinkedIn profile
    twitter: 'https://x.com/adityatamta', // TODO: replace with your Twitter/X handle
    email: 'mailto:nikneuron@gmail.com',
  },

  // 8. Main Section Navigation Anchors
  navigation: [
    { label: 'Overview', href: '#hero' },
    { label: 'Services', href: '#services' },
    { label: 'Bundles', href: '#bundles' },
    { label: 'Projects', href: '#projects' },
    { label: 'Playground', href: '#playground' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Engagement', href: '#engagement' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
};

export default SITE_CONFIG;
