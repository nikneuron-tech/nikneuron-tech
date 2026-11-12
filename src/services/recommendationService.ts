import { ALL_SERVICES_CONFIG, ServiceConfig, getServiceById } from '../config/services.config';

export interface WizardAnswers {
  problem: string;
  businessType: string;
  urgency: string;
  freeText?: string;
}

export interface RecommendationResult {
  service: ServiceConfig;
  score: number; // 0 - 100
  matchReason: string;
}

// Problem weights mapping to service IDs
const PROBLEM_MAPPING: Record<string, { primary: string; secondary: string; reason: string }> = {
  missed_calls: {
    primary: 'ai-receptionist',
    secondary: 'whatsapp-chat-automation',
    reason: 'Answers calls and chats 24/7 in Hindi, Hinglish & regional languages with calendar sync',
  },
  poor_ux: {
    primary: 'ui-ux-design',
    secondary: 'web-development',
    reason: 'Upgrades product conversion with mobile-first UI/UX, Figma prototypes, and UX audits',
  },
  website_ecommerce: {
    primary: 'web-development',
    secondary: 'ui-ux-design',
    reason: 'Launches high-speed business websites, UPI/Razorpay stores, and booking/learning portals',
  },
  whatsapp_leads: {
    primary: 'whatsapp-chat-automation',
    secondary: 'ai-receptionist',
    reason: 'Automates WhatsApp, Instagram & Messenger replies, product catalogs, and lead qualification',
  },
  deliverability_scale: {
    primary: 'batch-mail',
    secondary: 'whatsapp-chat-automation',
    reason: 'Runs bulk email, WhatsApp & SMS campaigns with branded templates, list cleaning & analytics',
  },
  custom_ops: {
    primary: 'custom-software',
    secondary: 'ai-automation',
    reason: 'Builds tailored CRM/ERP, SaaS platforms, Flutter/React Native apps, and Tally/payment integrations',
  },
  manual_workflows: {
    primary: 'ai-automation',
    secondary: 'custom-software',
    reason: 'Connects tools via n8n/Zapier/Make, extracts invoice data, and deploys company-trained AI bots',
  },
  ongoing_support: {
    primary: 'support-growth',
    secondary: 'web-development',
    reason: 'Provides ongoing tech support, KPI dashboards, Google review automation & team onboarding',
  },
};

// Business type affinity boosts
const BUSINESS_AFFINITIES: Record<string, string[]> = {
  clinic_legal: ['ai-receptionist', 'custom-software', 'support-growth'],
  ecommerce_b2c: ['web-development', 'whatsapp-chat-automation', 'batch-mail'],
  saas_fintech: ['ui-ux-design', 'custom-software', 'ai-automation'],
  enterprise_corp: ['custom-software', 'ai-automation', 'support-growth'],
};

/**
 * Rule-based tag and intent scorer mapping wizard answers to top-3 ranked services
 */
export function scoreServicesRuleBased(answers: WizardAnswers): RecommendationResult[] {
  const scores: Record<string, number> = {};
  const reasons: Record<string, string> = {};

  // Initialize all services
  ALL_SERVICES_CONFIG.forEach((svc) => {
    scores[svc.id] = 45; // baseline interest
    reasons[svc.id] = 'Core Nikneuron capability tailored for practical business growth';
  });

  // 1. Problem factor (Primary: +45, Secondary: +25)
  if (answers.problem && PROBLEM_MAPPING[answers.problem]) {
    const map = PROBLEM_MAPPING[answers.problem];
    scores[map.primary] = (scores[map.primary] || 0) + 45;
    reasons[map.primary] = map.reason;

    if (map.secondary && scores[map.secondary]) {
      scores[map.secondary] += 25;
    }
  }

  // 2. Business type affinity factor (+15)
  if (answers.businessType && BUSINESS_AFFINITIES[answers.businessType]) {
    BUSINESS_AFFINITIES[answers.businessType].forEach((svcId) => {
      if (scores[svcId]) {
        scores[svcId] += 15;
      }
    });
  }

  // 3. Urgency factor
  if (answers.urgency === 'immediate') {
    if (scores['ai-receptionist']) scores['ai-receptionist'] += 10;
    if (scores['whatsapp-chat-automation']) scores['whatsapp-chat-automation'] += 10;
    if (scores['batch-mail']) scores['batch-mail'] += 8;
  } else if (answers.urgency === 'sprint') {
    if (scores['web-development']) scores['web-development'] += 10;
    if (scores['ui-ux-design']) scores['ui-ux-design'] += 10;
  } else if (answers.urgency === 'roadmap') {
    if (scores['custom-software']) scores['custom-software'] += 10;
    if (scores['ai-automation']) scores['ai-automation'] += 8;
  }

  // 4. Free-text keywords matching
  if (answers.freeText && answers.freeText.trim().length > 0) {
    const rawFreeText = answers.freeText.trim();
    const text = rawFreeText.toLowerCase();

    ALL_SERVICES_CONFIG.forEach((svc) => {
      let textBonus = 0;
      svc.tags.forEach((tag) => {
        if (text.includes(tag)) textBonus += 12;
      });
      if (text.includes(svc.title.toLowerCase())) textBonus += 25;

      scores[svc.id] = (scores[svc.id] || 0) + textBonus;
      if (textBonus > 15) {
        reasons[svc.id] = `Direct semantic match for "${rawFreeText.slice(0, 32)}..."`;
      }
    });
  }

  // Sort and assemble top 3
  const results: RecommendationResult[] = Object.entries(scores)
    .map(([id, rawScore]) => {
      const service = getServiceById(id)!;
      const normalizedScore = Math.min(99, Math.max(55, Math.round(rawScore)));
      return {
        service,
        score: normalizedScore,
        matchReason: reasons[id] || `${service.title} delivers immediate business ROI`,
      };
    })
    .filter((r) => Boolean(r.service))
    .sort((a, b) => b.score - a.score);

  return results.slice(0, 3);
}
