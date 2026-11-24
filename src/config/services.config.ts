import * as THREE from 'three';

export interface ServiceConfig {
  id: string;
  faceIndex: number;
  title: string;
  tagline: string;
  accentColor: string;
  colorGlow: string;
  thumbnailPath: string;
  demoVideo?: string;
  benefits: string[];
  useCases: string[];
  tags: string[];
  ctaLabel: string;
  ctaUrl: string;
  normal: [number, number, number];
  euler: [number, number, number];
  targetQuaternion: [number, number, number, number];
  projectIds?: string[];
}

export interface BundlePackage {
  id: string;
  name: string;
  tagline: string;
  included: string[];
  badge?: string;
  highlighted?: boolean;
  gradientFrom: string;
  gradientTo: string;
  ctaLabel: string;
}

function computeQuaternion(euler: [number, number, number]): [number, number, number, number] {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(euler[0], euler[1], euler[2], 'XYZ'));
  return [q.x, q.y, q.z, q.w];
}

const FACE_ORIENTATIONS: Record<
  number,
  { normal: [number, number, number]; euler: [number, number, number]; targetQuaternion: [number, number, number, number] }
> = {
  0: {
    normal: [1, 0, 0],
    euler: [0, -Math.PI / 2, 0],
    targetQuaternion: computeQuaternion([0, -Math.PI / 2, 0]),
  },
  1: {
    normal: [-1, 0, 0],
    euler: [0, Math.PI / 2, 0],
    targetQuaternion: computeQuaternion([0, Math.PI / 2, 0]),
  },
  2: {
    normal: [0, 1, 0],
    euler: [Math.PI / 2, 0, 0],
    targetQuaternion: computeQuaternion([Math.PI / 2, 0, 0]),
  },
  3: {
    normal: [0, -1, 0],
    euler: [-Math.PI / 2, 0, 0],
    targetQuaternion: computeQuaternion([-Math.PI / 2, 0, 0]),
  },
  4: {
    normal: [0, 0, 1],
    euler: [0, 0, 0],
    targetQuaternion: computeQuaternion([0, 0, 0]),
  },
  5: {
    normal: [0, 0, -1],
    euler: [0, Math.PI, 0],
    targetQuaternion: computeQuaternion([0, Math.PI, 0]),
  },
};

/**
 * 6 primary faces rendered on the 3D Energy Cube, mapped to Nikneuron's core service pillars.
 */
export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    id: 'ui-ux-web',
    faceIndex: 0, // Right Face (+X)
    title: 'UI/UX & Web',
    tagline: 'Mobile-first UI/UX design, Figma prototypes, business sites & UPI/Razorpay e-commerce',
    accentColor: '#ff5aa5', // Hot Pink
    colorGlow: 'rgba(255, 90, 165, 0.45)',
    thumbnailPath: '/services/future-ui-ux.svg',
    benefits: [
      'User research, wireframing, Figma prototypes & developer handoff',
      'Modern mobile-first UI/UX, design systems, branding & UX audits',
      'Business websites, landing pages & e-commerce stores with UPI/Razorpay',
      'Booking, membership & learning portals with SEO and speed optimization',
    ],
    useCases: [
      'High-converting business websites, landing pages & brand refreshes',
      'E-commerce storefronts with seamless UPI and Razorpay checkout',
      'Booking, membership, and online learning portals built for speed',
    ],
    tags: ['ui', 'ux', 'figma', 'web', 'ecommerce', 'razorpay', 'upi', 'seo', 'branding'],
    ctaLabel: 'Request Design or Web Quote',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[0],
    projectIds: ['file-core', 'ai-receptionist-cube', 'next-opportunity-find', 'the-conclusion'],
  },
  {
    id: 'batch-mail',
    faceIndex: 1, // Left Face (-X)
    title: 'Batch Mail & Marketing',
    tagline: 'Bulk email, WhatsApp & SMS campaigns, reusable templates & list verification',
    accentColor: '#a78bfa', // Cyber Violet
    colorGlow: 'rgba(167, 139, 250, 0.45)',
    thumbnailPath: '/services/batch-mail.svg',
    benefits: [
      'Bulk email campaigns with reusable branded email templates',
      'Bulk WhatsApp and SMS messaging for high-reach broadcasts',
      'Open, click, and bounce analytics for every campaign',
      'Email list cleaning and verification to protect sender reputation',
    ],
    useCases: [
      'Promotional launches, festive offers & customer reactivation broadcasts',
      'Multi-channel updates across Email, WhatsApp, and SMS',
      'Clean, verified mailing lists with measurable click and open rates',
    ],
    tags: ['email', 'mail', 'batch', 'campaigns', 'marketing', 'whatsapp', 'sms', 'analytics'],
    ctaLabel: 'Plan Marketing Automation',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[1],
    projectIds: ['next-opportunity-find'],
  },
  {
    id: 'custom-software',
    faceIndex: 2, // Top Face (+Y)
    title: 'Custom Software',
    tagline: 'ERP, CRM, SaaS platforms, Flutter/React Native apps & Tally/payment integrations',
    accentColor: '#fbbf24', // Amber Gold
    colorGlow: 'rgba(251, 191, 36, 0.45)',
    thumbnailPath: '/services/cloud-infrastructure.svg',
    benefits: [
      'Business management software (inventory, billing, attendance, payroll) & CRM',
      'Industry-specific systems (clinics, schools, hotels, restaurants, real estate)',
      'Web apps, SaaS platforms, and Android/iOS apps (Flutter / React Native)',
      'API integrations (payments, WhatsApp, Tally, Google Sheets) & legacy modernization',
    ],
    useCases: [
      'Clinics, schools, hotels, restaurants & real estate operations platforms',
      'Role-based SaaS dashboards and cross-platform mobile applications',
      'Connecting Tally, WhatsApp, Google Sheets & payment gateways via API',
    ],
    tags: ['software', 'erp', 'crm', 'saas', 'flutter', 'react-native', 'tally', 'api', 'billing'],
    ctaLabel: 'Scope Custom Software',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[2],
    projectIds: ['next-opportunity-find', 'clarify'],
  },
  {
    id: 'support-growth',
    faceIndex: 3, // Bottom Face (-Y)
    title: 'Support & Growth',
    tagline: 'Ongoing maintenance, KPI dashboards, Google review automation & team onboarding',
    accentColor: '#34d399', // Emerald Neon
    colorGlow: 'rgba(52, 211, 153, 0.45)',
    thumbnailPath: '/services/cyber-defense.svg',
    benefits: [
      'Ongoing maintenance and responsive technical support',
      'Analytics and reporting dashboards for clear business visibility',
      'Google review request automation to boost local search trust',
      'Structured training and onboarding for client teams',
    ],
    useCases: [
      'Monthly website & software upkeep with proactive monitoring',
      'Automated Google review follow-ups after completed bookings or orders',
      'Hands-on staff onboarding and custom operational dashboards',
    ],
    tags: ['support', 'maintenance', 'analytics', 'dashboards', 'reviews', 'training', 'growth'],
    ctaLabel: 'Explore Support Plans',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[3],
    projectIds: ['atm-entry-monitor'],
  },
  {
    id: 'ai-receptionist',
    faceIndex: 4, // Front Face (+Z) - Default front-facing hero service
    title: 'AI Receptionist',
    tagline: '24/7 call & chat answering, calendar sync, Hindi/Hinglish & outbound reminders',
    accentColor: '#4fd8ff', // Electric Cyan
    colorGlow: 'rgba(79, 216, 255, 0.45)',
    thumbnailPath: '/services/ai-receptionist.svg',
    benefits: [
      '24/7 call and chat answering with appointment booking & calendar sync',
      'Multilingual support (Hindi, Hinglish, regional languages)',
      'Call transcripts and summaries sent directly to the owner',
      'Outbound calls for follow-ups and appointment reminders',
    ],
    useCases: [
      'Clinics, salons & service businesses capturing after-hours bookings',
      'Multilingual customer reception in Hindi, Hinglish & regional languages',
      'Automated outbound reminder and lead follow-up calls',
    ],
    tags: ['ai', 'receptionist', 'calls', 'voice', 'hindi', 'hinglish', 'appointments', '24/7'],
    ctaLabel: 'Test AI Receptionist Demo',
    ctaUrl: '#playground',
    ...FACE_ORIENTATIONS[4],
    projectIds: ['ai-receptionist-cube', 'the-conclusion', 'clarify'],
  },
  {
    id: 'ai-automation',
    faceIndex: 5, // Back Face (-Z)
    title: 'AI & Chat Automation',
    tagline: 'WhatsApp/IG/Messenger bots, company-data AI, n8n/Zapier/Make & invoice extraction',
    accentColor: '#60a5fa', // Cobalt Sky
    colorGlow: 'rgba(96, 165, 250, 0.45)',
    thumbnailPath: '/services/data-intelligence.svg',
    benefits: [
      'WhatsApp business chatbots, catalogs, order updates & Instagram/Messenger sync',
      'Custom AI chatbots trained on company data & internal staff assistants',
      'Workflow automation (n8n, Zapier, Make) & lead capture/qualification',
      'Document and invoice data extraction & AI content generation',
    ],
    useCases: [
      'Automated WhatsApp catalogs, order status updates & social DM lead capture',
      'Connecting CRM, billing, and notifications with n8n, Zapier, or Make',
      'Extracting structured data from PDFs and invoices into sheets or ERPs',
    ],
    tags: ['whatsapp', 'chatbot', 'instagram', 'messenger', 'n8n', 'zapier', 'make', 'ai', 'automation'],
    ctaLabel: 'Automate Your Workflows',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[5],
    projectIds: ['the-conclusion', 'next-opportunity-find', 'clarify', 'atm-entry-monitor'],
  },
];

/**
 * Full 8-service catalog for Nikneuron Services (Services section, 2D directory, Search, Contact).
 * Each service maps to its corresponding faceIndex (0-5) on the 3D Energy Cube.
 */
export const ALL_SERVICES_CONFIG: ServiceConfig[] = [
  {
    id: 'ui-ux-design',
    faceIndex: 0,
    title: 'UI/UX Design',
    tagline: 'User research, mobile-first interfaces, Figma handoff, UX audits & branding',
    accentColor: '#ff5aa5',
    colorGlow: 'rgba(255, 90, 165, 0.45)',
    thumbnailPath: '/services/future-ui-ux.svg',
    benefits: [
      'User research and wireframing',
      'Modern, mobile-first interface design',
      'Figma prototypes and developer handoff',
      'UX audits for existing websites and apps',
      'Design systems and branding',
    ],
    useCases: [
      'Product startups translating ideas into clickable Figma prototypes',
      'Existing websites & apps needing conversion-focused UX audits',
      'Brands establishing cohesive design systems and visual identity',
    ],
    tags: ['ui', 'ux', 'design', 'figma', 'wireframing', 'branding', 'audit', 'mobile-first'],
    ctaLabel: 'Request UX Audit',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[0],
    projectIds: ['file-core', 'ai-receptionist-cube'],
  },
  {
    id: 'web-development',
    faceIndex: 0,
    title: 'Web Development',
    tagline: 'Business websites, UPI/Razorpay e-commerce, portals, SEO & monthly maintenance',
    accentColor: '#4fd8ff',
    colorGlow: 'rgba(79, 216, 255, 0.45)',
    thumbnailPath: '/services/future-ui-ux.svg',
    benefits: [
      'Business websites and landing pages',
      'E-commerce stores with UPI/Razorpay payments',
      'Booking, membership, and learning portals',
      'SEO and speed optimization',
      'Monthly website maintenance plans',
    ],
    useCases: [
      'Growing businesses launching fast, SEO-ready websites & landing pages',
      'D2C stores accepting instant UPI, cards & Razorpay payments',
      'Academies, clinics & clubs running booking or membership portals',
    ],
    tags: ['web', 'website', 'ecommerce', 'upi', 'razorpay', 'booking', 'seo', 'maintenance'],
    ctaLabel: 'Build Your Website',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[0],
    projectIds: ['file-core', 'next-opportunity-find'],
  },
  {
    id: 'ai-receptionist',
    faceIndex: 4,
    title: 'AI Receptionist',
    tagline: '24/7 call & chat answering, calendar sync, Hindi/Hinglish & outbound follow-ups',
    accentColor: '#4fd8ff',
    colorGlow: 'rgba(79, 216, 255, 0.45)',
    thumbnailPath: '/services/ai-receptionist.svg',
    benefits: [
      '24/7 call and chat answering',
      'Appointment booking with calendar sync',
      'Multilingual support (Hindi, Hinglish, regional languages)',
      'Call transcripts and summaries sent to the owner',
      'Outbound calls for follow-ups and reminders',
    ],
    useCases: [
      'Clinics & diagnostic centers booking appointments round-the-clock',
      'Local & regional businesses serving callers in Hindi, Hinglish & more',
      'Owners receiving instant call summaries plus automated reminder calls',
    ],
    tags: ['ai', 'receptionist', 'calls', 'voice', 'hindi', 'hinglish', 'calendar', '24/7'],
    ctaLabel: 'Test AI Receptionist Demo',
    ctaUrl: '#playground',
    ...FACE_ORIENTATIONS[4],
    projectIds: ['ai-receptionist-cube', 'the-conclusion'],
  },
  {
    id: 'whatsapp-chat-automation',
    faceIndex: 5,
    title: 'WhatsApp and Chat Automation',
    tagline: 'WhatsApp business bots, catalogs, order updates, Instagram & Messenger sync',
    accentColor: '#34d399',
    colorGlow: 'rgba(52, 211, 153, 0.45)',
    thumbnailPath: '/services/data-intelligence.svg',
    benefits: [
      'WhatsApp business chatbot',
      'Automated replies, catalogs, and order updates',
      'Instagram and Messenger integration',
      'Lead capture and qualification',
    ],
    useCases: [
      'Retail & D2C stores sharing interactive catalogs and order tracking on WhatsApp',
      'Service brands qualifying leads automatically from Instagram & Messenger DMs',
      '24/7 instant FAQ replies without manual chat handling',
    ],
    tags: ['whatsapp', 'chatbot', 'instagram', 'messenger', 'catalog', 'leads', 'chat'],
    ctaLabel: 'Launch Chat Automation',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[5],
    projectIds: ['ai-receptionist-cube'],
  },
  {
    id: 'batch-mail',
    faceIndex: 1,
    title: 'Batch Mail and Marketing Automation',
    tagline: 'Bulk email, WhatsApp & SMS campaigns, branded templates & list verification',
    accentColor: '#a78bfa',
    colorGlow: 'rgba(167, 139, 250, 0.45)',
    thumbnailPath: '/services/batch-mail.svg',
    benefits: [
      'Bulk email campaigns',
      'Bulk WhatsApp and SMS messaging',
      'Reusable branded email templates',
      'Open, click, and bounce analytics',
      'Email list cleaning and verification',
    ],
    useCases: [
      'Consistent newsletters, product launches & seasonal promotions',
      'Omnichannel customer outreach across Email, WhatsApp & SMS',
      'Cleaning stale contact lists and tracking real engagement metrics',
    ],
    tags: ['email', 'mail', 'batch', 'marketing', 'bulk', 'whatsapp', 'sms', 'templates', 'analytics'],
    ctaLabel: 'Plan Campaign System',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[1],
    projectIds: ['next-opportunity-find'],
  },
  {
    id: 'custom-software',
    faceIndex: 2,
    title: 'Custom Software Development',
    tagline: 'Business ERP/CRM, industry software, SaaS, mobile apps & API integrations',
    accentColor: '#fbbf24',
    colorGlow: 'rgba(251, 191, 36, 0.45)',
    thumbnailPath: '/services/cloud-infrastructure.svg',
    benefits: [
      'Business management software (inventory, billing, attendance, payroll)',
      'CRM and lead management systems',
      'Industry-specific systems (clinics, schools, hotels, restaurants, real estate)',
      'Web apps and SaaS platforms with user roles and dashboards',
      'Android and iOS apps (Flutter / React Native)',
      'API and third-party integrations (payments, WhatsApp, Tally, Google Sheets)',
      'Legacy software modernization',
    ],
    useCases: [
      'Clinics, schools, hotels, restaurants & real estate teams replacing spreadsheets',
      'Cross-platform Android/iOS apps synced with Tally, WhatsApp & payments',
      'Multi-role SaaS portals and modernized legacy business tools',
    ],
    tags: ['software', 'crm', 'inventory', 'billing', 'payroll', 'saas', 'flutter', 'react-native', 'tally', 'api'],
    ctaLabel: 'Scope Custom Software',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[2],
    projectIds: ['next-opportunity-find', 'clarify'],
  },
  {
    id: 'ai-automation',
    faceIndex: 5,
    title: 'AI and Automation Solutions',
    tagline: 'Company-data AI bots, n8n/Zapier/Make workflows, document extraction & staff AI',
    accentColor: '#60a5fa',
    colorGlow: 'rgba(96, 165, 250, 0.45)',
    thumbnailPath: '/services/data-intelligence.svg',
    benefits: [
      'Custom AI chatbots trained on company data',
      'Workflow automation (n8n, Zapier, Make)',
      'Document and invoice data extraction',
      'AI content generation',
      'Internal AI assistants for staff',
    ],
    useCases: [
      'Automating repetitive ops across tools using n8n, Zapier & Make',
      'Parsing PDFs and supplier invoices straight into accounting or sheets',
      'Internal knowledge assistants trained on SOPs, catalogs & company docs',
    ],
    tags: ['ai', 'automation', 'n8n', 'zapier', 'make', 'chatbot', 'invoice', 'ocr', 'assistant'],
    ctaLabel: 'Automate Operations',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[5],
    projectIds: ['the-conclusion', 'clarify', 'atm-entry-monitor'],
  },
  {
    id: 'support-growth',
    faceIndex: 3,
    title: 'Support and Growth',
    tagline: 'Ongoing tech support, analytics dashboards, Google review automation & team training',
    accentColor: '#34d399',
    colorGlow: 'rgba(52, 211, 153, 0.45)',
    thumbnailPath: '/services/cyber-defense.svg',
    benefits: [
      'Ongoing maintenance and technical support',
      'Analytics and reporting dashboards',
      'Google review request automation',
      'Training and onboarding for client teams',
    ],
    useCases: [
      'Reliable post-launch maintenance, updates & fast technical support',
      'Automated Google review nudges driving higher local map rankings',
      'KPI reporting dashboards and hands-on training for your staff',
    ],
    tags: ['support', 'maintenance', 'analytics', 'reporting', 'google-reviews', 'training', 'onboarding'],
    ctaLabel: 'Get Ongoing Support',
    ctaUrl: '#contact',
    ...FACE_ORIENTATIONS[3],
    projectIds: ['atm-entry-monitor'],
  },
];

export const BUNDLE_PACKAGES: BundlePackage[] = [
  {
    id: 'bundle-starter',
    name: 'Starter',
    tagline: 'Launch your digital presence and capture leads automatically',
    included: ['Website', 'WhatsApp chatbot'],
    gradientFrom: '#34d399',
    gradientTo: '#4fd8ff',
    ctaLabel: 'Choose Starter Bundle',
  },
  {
    id: 'bundle-growth',
    name: 'Growth',
    tagline: 'Convert inbound calls, web traffic, and repeat customers on autopilot',
    included: ['Website', 'AI receptionist', 'Email campaigns'],
    badge: 'Most Popular',
    highlighted: true,
    gradientFrom: '#03a9f4',
    gradientTo: '#ff0058',
    ctaLabel: 'Choose Growth Bundle',
  },
  {
    id: 'bundle-complete',
    name: 'Complete',
    tagline: 'End-to-end custom software, AI voice & workflows with dedicated care',
    included: ['Custom software', 'AI receptionist', 'Automation', 'Maintenance'],
    badge: 'Full Stack',
    gradientFrom: '#ffbc00',
    gradientTo: '#ff0058',
    ctaLabel: 'Choose Complete Bundle',
  },
];

export default SERVICES_CONFIG;

export function getServiceById(id: string): ServiceConfig | undefined {
  return ALL_SERVICES_CONFIG.find((s) => s.id === id) || SERVICES_CONFIG.find((s) => s.id === id);
}

export function getServiceByIndex(index: number): ServiceConfig {
  const normalized = ((index % SERVICES_CONFIG.length) + SERVICES_CONFIG.length) % SERVICES_CONFIG.length;
  return SERVICES_CONFIG[normalized];
}

export function getAllServices(): ServiceConfig[] {
  return ALL_SERVICES_CONFIG;
}

export function getServiceTargetQuaternion(faceIndex: number): THREE.Quaternion {
  const target = getServiceByIndex(faceIndex).targetQuaternion;
  return new THREE.Quaternion(target[0], target[1], target[2], target[3]);
}

/**
 * Given the current orientation quaternion of the cube group,
 * finds which service face is closest to pointing directly at the camera (+Z: [0, 0, 1]).
 */
export function findNearestServiceIndex(cubeQuaternion: THREE.Quaternion): number {
  let bestIndex = 4; // default front face (AI Receptionist)
  let maxDot = -Infinity;
  const tempNormal = new THREE.Vector3();

  for (let i = 0; i < SERVICES_CONFIG.length; i++) {
    const service = SERVICES_CONFIG[i];
    tempNormal.set(service.normal[0], service.normal[1], service.normal[2]);
    tempNormal.applyQuaternion(cubeQuaternion);
    const dot = tempNormal.z;
    if (dot > maxDot) {
      maxDot = dot;
      bestIndex = service.faceIndex;
    }
  }

  return bestIndex;
}
