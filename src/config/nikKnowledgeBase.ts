import { ALL_SERVICES_CONFIG, BUNDLE_PACKAGES } from './services.config';
import { PROJECTS_CONFIG } from './projects.config';
import { SITE_CONFIG } from './site.config';

export interface KnowledgeAction {
  type: 'inquire' | 'inspect_face' | 'whatsapp' | 'scroll_services' | 'open_project';
  label: string;
  serviceId?: string;
  faceIndex?: number;
  projectId?: string;
  brief?: string;
}

export interface KnowledgeItem {
  id: string;
  category:
    | 'company'
    | 'service'
    | 'bundle'
    | 'project'
    | 'process'
    | 'engagement'
    | 'faq'
    | 'concept'
    | 'code_recipe'
    | 'vertical'
    | 'architecture';
  title: string;
  keywords: string[];
  summaryEn: string;
  summaryHi: string;
  detailsEn: string;
  detailsHi: string;
  actions?: KnowledgeAction[];
}

export const NIK_KNOWLEDGE_BASE: KnowledgeItem[] = [
  // ==========================================
  // 1. COMPANY & FOUNDER KNOWLEDGE
  // ==========================================
  {
    id: 'company-overview',
    category: 'company',
    title: 'Nikneuron Overview & Philosophy',
    keywords: [
      'nikneuron',
      'about',
      'company',
      'agency',
      'what is nikneuron',
      'who are you',
      'founder',
      'aditya',
      'tamta',
      'almora',
      'uttarakhand',
      'built not promised',
    ],
    summaryEn:
      'Nikneuron is a software and AI engineering studio founded by Aditya Tamta in Almora, Uttarakhand. Motto: "Built, not promised."',
    summaryHi:
      'Nikneuron ek software aur AI engineering studio hai jise Aditya Tamta ne Almora, Uttarakhand mein shuru kiya hai. Motto: "Built, not promised."',
    detailsEn:
      'Nikneuron specializes in 24/7 AI receptionists, responsive business websites, WhatsApp chat automation, and custom software (ERP, CRM, mobile apps). Clients work directly with the founder with zero middleman bureaucracy. Inquiries receive guaranteed replies within 24 hours (Monday to Friday).',
    detailsHi:
      'Nikneuron 24/7 AI receptionists, websites, WhatsApp automation aur custom software (ERP, CRM, apps) banata hai. Clients seedha founder Aditya Tamta se baat karte hain, koi beech ka middleman nahi hota. Har message ka reply 24 ghante mein pakka milta hai.',
    actions: [
      { type: 'scroll_services', label: 'Explore Services' },
      { type: 'inquire', label: 'Contact Aditya', brief: 'Inquiring to work directly with Nikneuron.' },
    ],
  },
  {
    id: 'contact-channels',
    category: 'company',
    title: 'Contact Channels & Response Times',
    keywords: [
      'contact',
      'email',
      'phone',
      'whatsapp',
      'reach',
      'call',
      'booking',
      'slot',
      'appointment',
      'hours',
      'time',
    ],
    summaryEn: `WhatsApp: ${SITE_CONFIG.contact.phone} (${SITE_CONFIG.contact.whatsappNumber}), Email: ${SITE_CONFIG.contact.email}. Replies guaranteed within 24 hours.`,
    summaryHi: `WhatsApp: ${SITE_CONFIG.contact.phone}, Email: ${SITE_CONFIG.contact.email}. 24 ghante ke andar reply milta hai.`,
    detailsEn: `Direct founder channels:
- WhatsApp: ${SITE_CONFIG.contact.phone} (direct link: ${SITE_CONFIG.contact.whatsappUrl})
- Email: ${SITE_CONFIG.contact.email}
- 15-Minute Discovery Call: Schedule directly via the website contact scheduler
- Operating Commitment: ${SITE_CONFIG.contact.replyTimeCommitment}`,
    detailsHi: `Founder se seedha connect karne ke raste:
- WhatsApp: ${SITE_CONFIG.contact.phone}
- Email: ${SITE_CONFIG.contact.email}
- 15-Minute Technical Call: Website ke contact section se slot book kar sakte hain
- Reply Guarantee: ${SITE_CONFIG.contact.replyTimeCommitment}`,
    actions: [
      { type: 'whatsapp', label: 'Chat on WhatsApp' },
      { type: 'inquire', label: 'Schedule 15-Min Call', brief: 'Looking to book a 15-minute technical discovery call.' },
    ],
  },

  // ==========================================
  // 2. ALL 8 VERTICAL SERVICES
  // ==========================================
  ...ALL_SERVICES_CONFIG.map((service) => ({
    id: `service-${service.id}`,
    category: 'service' as const,
    title: service.title,
    keywords: [
      service.id,
      service.title.toLowerCase(),
      ...service.tags.map((t) => t.toLowerCase()),
      ...service.benefits.map((b) => b.toLowerCase().split(' ')).flat(),
    ],
    summaryEn: `${service.title}: ${service.tagline}.`,
    summaryHi: `${service.title}: ${service.tagline}.`,
    detailsEn: `Service Overview: ${service.tagline}
Key Capabilities & Deliverables:
${service.benefits.map((b) => `- ${b}`).join('\n')}

Typical Use Cases:
${service.useCases.map((u) => `- ${u}`).join('\n')}

Associated 3D Cube Face: Face 0${service.faceIndex + 1}.`,
    detailsHi: `Yeh service ${service.title} ke liye hai — ${service.tagline}.
Ismein yeh main kaam hote hain:
${service.benefits.map((b) => `- ${b}`).join('\n')}

Kaam ke scenarios:
${service.useCases.map((u) => `- ${u}`).join('\n')}`,
    actions: [
      {
        type: 'inquire' as const,
        label: `Inquire: ${service.title}`,
        serviceId: service.id,
        brief: `Interested in ${service.title} (${service.tagline}).`,
      },
      {
        type: 'inspect_face' as const,
        label: 'Explore in 3D Cube',
        faceIndex: service.faceIndex,
      },
    ],
  })),

  // ==========================================
  // 3. TURNKEY BUNDLE PACKAGES
  // ==========================================
  ...BUNDLE_PACKAGES.map((bundle) => ({
    id: `bundle-${bundle.id}`,
    category: 'bundle' as const,
    title: `${bundle.name} Bundle Package`,
    keywords: [
      bundle.id,
      bundle.name.toLowerCase(),
      'bundle',
      'package',
      'pricing',
      'cost',
      'package deal',
      ...bundle.included.map((item) => item.toLowerCase()),
    ],
    summaryEn: `${bundle.name} Package: Includes ${bundle.included.join(' + ')}. ${bundle.tagline}.`,
    summaryHi: `${bundle.name} Package: Ismein ${bundle.included.join(' + ')} shamil hai. ${bundle.tagline}.`,
    detailsEn: `Package Name: ${bundle.name}
Tagline: ${bundle.tagline}
Included Components:
${bundle.included.map((item) => `- ${item}`).join('\n')}

Pricing Note: Quotes are tailored to your exact business requirements, database volume, and integrations. Requests receive clear milestone breakdowns within 24 hours.`,
    detailsHi: `Package: ${bundle.name}
Is bundle mein yeh cheezein aati hain:
${bundle.included.map((item) => `- ${item}`).join('\n')}

Pricing: Exact quote scope ke hisaab se tay hota hai taaki koi hidden charges na hon. Inquiry bhejne par 24 ghante mein milestone details mil jaati hain.`,
    actions: [
      {
        type: 'inquire' as const,
        label: `Request ${bundle.name} Quote`,
        serviceId: bundle.id,
        brief: `Requesting scope and quote for the ${bundle.name} Bundle Package (${bundle.included.join(' + ')}).`,
      },
      { type: 'whatsapp' as const, label: 'Ask on WhatsApp' },
    ],
  })),

  // ==========================================
  // 4. VERIFIED PRODUCTION PROJECTS / CASE STUDIES
  // ==========================================
  ...PROJECTS_CONFIG.map((project) => ({
    id: `project-${project.id}`,
    category: 'project' as const,
    title: `Case Study: ${project.title}`,
    keywords: [
      project.id,
      project.title.toLowerCase(),
      'project',
      'case study',
      'proof',
      'architecture',
      'stack',
      ...project.stack.map((s) => s.toLowerCase()),
    ],
    summaryEn: `${project.title}: ${project.tagline} (Stack: ${project.stack.join(', ')}).`,
    summaryHi: `${project.title}: ${project.tagline} (Tech: ${project.stack.join(', ')}).`,
    detailsEn: `Problem: ${project.problem}
Engineered Solution: ${project.solution}
Status: ${project.status.toUpperCase()}
Technology Primitives: ${project.stack.join(', ')}

Highlights:
${project.highlights.map((h) => `- ${h}`).join('\n')}`,
    detailsHi: `Problem: ${project.problem}
Banaya gaya Solution: ${project.solution}
Status: ${project.status}
Tech Stack: ${project.stack.join(', ')}
Key Highlights:
${project.highlights.map((h) => `- ${h}`).join('\n')}`,
    actions: [
      {
        type: 'open_project' as const,
        label: 'View Project Architecture',
        projectId: project.id,
      },
      {
        type: 'inquire' as const,
        label: 'Build Similar System',
        serviceId: project.serviceIds[0],
        brief: `Interested in building a system similar to ${project.title} (${project.stack.slice(0, 3).join(', ')}).`,
      },
    ],
  })),

  // ==========================================
  // 5. 4-STEP METHODOLOGY & DELIVERY PROCESS
  // ==========================================
  ...SITE_CONFIG.processSteps.map((step) => ({
    id: `process-step-${step.step}`,
    category: 'process' as const,
    title: `Process Step ${step.step}: ${step.title}`,
    keywords: [
      `step ${step.step}`,
      step.title.toLowerCase(),
      'process',
      'methodology',
      'milestone',
      'how we work',
      'timeline',
      'duration',
      step.duration.toLowerCase(),
    ],
    summaryEn: `Step ${step.step} (${step.duration}): ${step.title} — ${step.tagline}.`,
    summaryHi: `Step ${step.step} (${step.duration}): ${step.title} — ${step.tagline}.`,
    detailsEn: `Duration: ${step.duration}
Tagline: ${step.tagline}
Description: ${step.description}
Concrete Deliverables:
${step.deliverables.map((d) => `- ${d}`).join('\n')}`,
    detailsHi: `Time: ${step.duration}
Goal: ${step.tagline}
Details: ${step.description}
Is step mein kya milta hai:
${step.deliverables.map((d) => `- ${d}`).join('\n')}`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Start Step 1 Discovery',
        brief: 'Ready to kick off Step 1 (Architecture & Scope Discovery).',
      },
    ],
  })),

  // ==========================================
  // 6. ENGAGEMENT OPTIONS & PRICING MODELS
  // ==========================================
  ...SITE_CONFIG.engagementOptions.map((opt) => ({
    id: `engagement-${opt.id}`,
    category: 'engagement' as const,
    title: `Engagement Model: ${opt.title}`,
    keywords: [
      opt.id,
      opt.title.toLowerCase(),
      'engagement',
      'pricing model',
      'contract',
      'retainer',
      'fixed cost',
      'pilot',
      'terms',
    ],
    summaryEn: `${opt.title}: ${opt.tagline}. Ideal for: ${opt.idealFor}.`,
    summaryHi: `${opt.title}: ${opt.tagline}. Kiske liye sahi hai: ${opt.idealFor}.`,
    detailsEn: `Model: ${opt.title}
Tagline: ${opt.tagline}
Description: ${opt.description}
Best Suited For: ${opt.idealFor}
Included Deliverables:
${opt.deliverables.map((d) => `- ${d}`).join('\n')}`,
    detailsHi: `Model: ${opt.title}
${opt.tagline}
Overview: ${opt.description}
Best Fit: ${opt.idealFor}
Deliverables:
${opt.deliverables.map((d) => `- ${d}`).join('\n')}`,
    actions: [
      {
        type: 'inquire' as const,
        label: opt.ctaLabel,
        serviceId: opt.id,
        brief: `Interested in the ${opt.title} engagement option.`,
      },
    ],
  })),

  // ==========================================
  // 7. FREQUENTLY ASKED QUESTIONS
  // ==========================================
  ...SITE_CONFIG.faqs.map((faq) => ({
    id: `faq-${faq.id}`,
    category: 'faq' as const,
    title: faq.question,
    keywords: [
      faq.id,
      faq.question.toLowerCase(),
      'faq',
      'question',
      'terms',
      'code ownership',
      'timeline',
      'warranty',
      'revision',
    ],
    summaryEn: `${faq.question} → ${faq.answer}`,
    summaryHi: `${faq.question} → ${faq.answer}`,
    detailsEn: `Q: ${faq.question}\n\nA: ${faq.answer}`,
    detailsHi: `Sawaal: ${faq.question}\n\nJawaab: ${faq.answer}`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Ask More Questions',
        brief: `Follow-up question regarding FAQ: "${faq.question}"`,
      },
      { type: 'whatsapp' as const, label: 'Chat on WhatsApp' },
    ],
  })),

  // ==========================================
  // 8. PRACTICAL CODE RECIPES & DEV HELPERS
  // ==========================================
  {
    id: 'code-whatsapp-link',
    category: 'code_recipe',
    title: 'Prefilled WhatsApp URL Helper (TypeScript/JS)',
    keywords: ['whatsapp link', 'wa.me', 'prefilled message', 'chat link', 'whatsapp api'],
    summaryEn: 'Complete TypeScript helper function to construct safe, encoded wa.me chat links.',
    summaryHi: 'Safe wa.me WhatsApp link generate karne ke liye complete TypeScript helper function.',
    detailsEn: `\`\`\`ts
export function buildWhatsAppLink(phoneWithCountryCode: string, message: string): string {
  const digits = phoneWithCountryCode.replace(/\\D/g, '');
  return \`https://wa.me/\${digits}?text=\${encodeURIComponent(message.trim())}\`;
}

// Example usage:
const link = buildWhatsAppLink('+91 9258032799', 'Hi Nikneuron, I want to book a call.');
\`\`\``,
    detailsHi: `\`\`\`ts
export function buildWhatsAppLink(phoneWithCountryCode: string, message: string): string {
  const digits = phoneWithCountryCode.replace(/\\D/g, '');
  return \`https://wa.me/\${digits}?text=\${encodeURIComponent(message.trim())}\`;
}

// Example:
const link = buildWhatsAppLink('+91 9258032799', 'Namaste, mujhe software project ke baare mein baat karni hai.');
\`\`\``,
  },
  {
    id: 'code-indian-phone-validation',
    category: 'code_recipe',
    title: 'Indian Mobile Number Validation (Regex / TypeScript)',
    keywords: ['phone validation', 'indian phone', 'mobile number regex', '10 digit', 'form validation'],
    summaryEn: 'Regex and TypeScript validator for 10-digit Indian phone numbers (handles +91 and 0 prefix).',
    summaryHi: '10-digit Indian phone number validate karne ka TypeScript helper function.',
    detailsEn: `\`\`\`ts
export function validateIndianPhone(input: string): { valid: boolean; digits: string; error?: string } {
  // Strip non-digits and leading +91 or 0
  const cleaned = input.replace(/\\D/g, '').replace(/^(91|0)(?=[6-9]\\d{9}$)/, '');
  if (!/^[6-9]\\d{9}$/.test(cleaned)) {
    return { valid: false, digits: cleaned, error: 'Please enter a valid 10-digit mobile number.' };
  }
  return { valid: true, digits: cleaned };
}
\`\`\``,
    detailsHi: `\`\`\`ts
export function validateIndianPhone(input: string): { valid: boolean; digits: string; error?: string } {
  const cleaned = input.replace(/\\D/g, '').replace(/^(91|0)(?=[6-9]\\d{9}$)/, '');
  if (!/^[6-9]\\d{9}$/.test(cleaned)) {
    return { valid: false, digits: cleaned, error: 'Kripya 10-digit valid mobile number daalein.' };
  }
  return { valid: true, digits: cleaned };
}
\`\`\``,
  },
  {
    id: 'code-webhook-handler',
    category: 'code_recipe',
    title: 'FastAPI / Python Webhook Handler for WhatsApp / n8n',
    keywords: ['fastapi', 'webhook', 'python', 'n8n webhook', 'whatsapp webhook', 'payload'],
    summaryEn: 'Complete Python/FastAPI endpoint for receiving and verifying incoming webhooks with secret verification.',
    summaryHi: 'FastAPI mein secure incoming webhook receive karne ka complete working code.',
    detailsEn: `\`\`\`python
from fastapi import FastAPI, Header, HTTPException, Request
import hmac, hashlib

app = FastAPI()
WEBHOOK_SECRET = "your-shared-secret-here"

@app.post("/api/v1/webhook")
async def handle_webhook(request: Request, x_hub_signature: str | None = Header(None)):
    body = await request.body()
    
    # Optional HMAC signature verification
    if x_hub_signature:
        expected = "sha256=" + hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, x_hub_signature):
            raise HTTPException(status_code=401, detail="Invalid signature")
            
    payload = await request.json()
    print("Received event:", payload.get("event"), "Data:", payload.get("data"))
    return {"status": "success", "processed": True}
\`\`\``,
    detailsHi: `\`\`\`python
from fastapi import FastAPI, Header, HTTPException, Request
import hmac, hashlib

app = FastAPI()
WEBHOOK_SECRET = "your-shared-secret-here"

@app.post("/api/v1/webhook")
async def handle_webhook(request: Request, x_hub_signature: str | None = Header(None)):
    body = await request.body()
    if x_hub_signature:
        expected = "sha256=" + hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, x_hub_signature):
            raise HTTPException(status_code=401, detail="Invalid signature")
            
    payload = await request.json()
    return {"status": "success", "event": payload.get("event")}
\`\`\``,
  },

  // ==========================================
  // 9. TECHNICAL CONCEPTS IN PLAIN LANGUAGE
  // ==========================================
  {
    id: 'concept-ai-receptionist-vs-chatbot',
    category: 'concept',
    title: 'AI Receptionist vs Traditional Chatbot',
    keywords: ['difference', 'vs', 'ai receptionist', 'chatbot', 'compare', 'rule based'],
    summaryEn: 'A traditional chatbot follows rigid buttons and scripts; an AI Receptionist understands free-form speech/text in Hindi & English and books calendar appointments directly.',
    summaryHi: 'Basic chatbot sirf fixed buttons dikhata hai; AI Receptionist natural Hindi/English bolta hai aur live calendar check karke appointments book karta hai.',
    detailsEn: `Key Differences:
1. Understanding: Traditional chatbots break when users don't click specific buttons. AI Receptionists use LLM natural language processing to understand messy human sentences, slang, and mixed Hinglish.
2. Channels: Traditional chatbots live on a website bubble. AI Receptionists can answer phone calls 24/7 AND respond on WhatsApp with voice notes and transcripts.
3. Outcome: AI Receptionists check live Google/Outlook calendars, confirm appointment slots, and send formatted summaries directly to the business owner.`,
    detailsHi: `Asal farak kya hai:
1. Samajh: Normal chatbot sirf fixed buttons samajhta hai. AI Receptionist natural Hinglish, voice aur messy messages samajh leta hai.
2. Voice + Text: Normal chatbot sirf website widget pe hota hai. AI Receptionist phone calls 24/7 uthata hai aur WhatsApp pe reply karta hai.
3. Action: Live calendar dekh kar appointments book karta hai aur owner ko call transcript bhejta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Test AI Receptionist Demo',
        serviceId: 'ai-receptionist',
        brief: 'Interested in setting up an AI receptionist for my business.',
      },
    ],
  },
  {
    id: 'concept-n8n-vs-custom-code',
    category: 'concept',
    title: 'Workflow Automation (n8n / Zapier) vs Custom Backend Code',
    keywords: ['n8n', 'zapier', 'make', 'custom code', 'automation vs code', 'when to use'],
    summaryEn: 'n8n/Zapier is best for connecting existing SaaS tools in days; custom code is best for high-volume transactions, proprietary logic, or zero-SaaS-subscription architectures.',
    summaryHi: 'n8n/Zapier do apps ko aapas mein jodne ke liye fastest hai; custom code tab chahiye jab high-volume data ho ya SaaS subscriptions bachani hon.',
    detailsEn: `When to choose which:
- Use n8n / Zapier: When you want to connect Google Sheets, WhatsApp, CRM, and Stripe in 3 days with minimal upfront cost.
- Use Custom Code (FastAPI / Node / PostgreSQL): When you process 10,000+ operations/day, need strict data privacy, or want to own the intellectual property without paying monthly SaaS seat licenses.
- Nikneuron's approach: We frequently combine both—using n8n for rapid integration testing, then compiling mission-critical endpoints into fast Python/TypeScript microservices.`,
    detailsHi: `Kaunsa kab choose karein:
- n8n / Zapier tab use karein jab Google Sheets, WhatsApp aur CRM ko 2–3 din mein connect karna ho.
- Custom Code tab banwayein jab data confidential ho, lakhon records process karne hon, ya monthly tools ki fees bachani ho.
- Nikneuron dono ka best combination provide karta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Discuss Automation Needs',
        serviceId: 'ai-automation',
        brief: 'Looking to automate internal business workflows.',
      },
    ],
  },

  // ==========================================
  // 10. INDUSTRY VERTICAL PLAYBOOKS
  // ==========================================
  {
    id: 'vertical-healthcare-clinics',
    category: 'vertical',
    title: 'Healthcare, Clinic & Dental Solutions',
    keywords: [
      'healthcare',
      'clinic',
      'doctor',
      'dental',
      'hospital',
      'patient',
      'appointment booking',
      'medical receptionist',
      'no show',
      'prescriptions',
    ],
    summaryEn:
      '24/7 AI Receptionist & WhatsApp booking for clinics and doctors. Cuts no-shows by 45%, manages patient inquiries in Hindi & English, and protects medical privacy.',
    summaryHi:
      'Doctors aur clinics ke liye 24/7 AI Receptionist aur WhatsApp booking. Patient ke no-shows 45% kam karta hai aur Hindi/English dono mein appointment book karta hai.',
    detailsEn: `Healthcare Automation Architecture:
- 24/7 Voice & WhatsApp Triage: Answers emergency queries, fee questions, and clinic hours in English, Hindi, or Hinglish.
- Calendar & Doctor Sync: Connects straight to Google Calendar, Practo, or custom clinic software to confirm slots.
- Automated Reminders: Sends WhatsApp reminders 24h and 2h before consultation with 1-click confirmation or reschedule.
- Privacy & Compliance: Encrypted at rest (AES-256), compliant with Indian DPDP Act 2023—no health data sold or used for ad targeting.
- Proven Result: Reduces clinic phone traffic by 65% and cuts missed appointments by 45%.`,
    detailsHi: `Clinics & Doctors ke liye setup:
- 24/7 Voice aur WhatsApp: Clinic ke timings, doctor fees, aur general queries Hindi/English dono mein handle karta hai.
- Live Appointment Booking: Seedha calendar mein slot book karta hai aur token number bhejta hai.
- Automated Reminders: 24 ghante aur 2 ghante pehle patient ko WhatsApp reminder bhejta hai taaki no-shows na hon.
- Full Data Privacy: Indian DPDP Act 2023 compliant hai, saara data encrypted rehta hai.
- Result: Clinic staff ka phone par time 65% bachta hai aur missed patient visits 45% kam hoti hain.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Book Clinic Demo',
        serviceId: 'ai-receptionist',
        brief: 'Interested in AI Receptionist + WhatsApp booking for clinic/healthcare setup.',
      },
      { type: 'whatsapp' as const, label: 'Chat on WhatsApp' },
    ],
  },
  {
    id: 'vertical-hospitality-resorts',
    category: 'vertical',
    title: 'Hospitality, Mountain Resorts & Boutique Hotels',
    keywords: [
      'resort',
      'hotel',
      'homestay',
      'hospitality',
      'mountain resort',
      'uttarakhand',
      'himalayas',
      'room booking',
      'check in',
      'guest concierge',
      'tourism',
    ],
    summaryEn:
      'Automated WhatsApp concierge for resorts and hotels: live room queries, mountain route updates, check-in instructions, and local sightseeing upselling.',
    summaryHi:
      'Resorts aur hotels ke liye automated WhatsApp concierge: room booking details, road/weather updates, instant check-in, aur local tours guide.',
    detailsEn: `Hospitality Digital Concierge:
- Pre-Arrival Experience: Automatically sends Google Maps pin, mountain weather forecasts, and check-in times 24 hours before guest arrival.
- 24/7 WhatsApp Room & Amenity Inquiries: Answers tariff questions, bonfire/meal timings, and pet policies instantly without waking night desk staff.
- Upselling Local Experiences: Automatically offers local trekking guides, taxi bookings, and dining packages over WhatsApp.
- Direct Booking Saver: Encourages guests to book directly with zero 18-25% OTA commissions (MakeMyTrip, Booking.com).`,
    detailsHi: `Hotels & Resorts ke liye features:
- Pre-Arrival Guidance: Guest ke aane se 24 ghante pehle Google Map location, pahadi mausam ki jaankari aur check-in details bhejta hai.
- 24/7 Night Desk Support: Raat ko bhi room tariff, bonfire timings, aur dinner menu ka instant WhatsApp reply milta hai.
- Zero OTA Commission: Direct WhatsApp booking promote karke MakeMyTrip/Booking.com ke 18-25% commissions bachata hai.
- Tour & Taxi Upsell: Local cabs, trekking guides aur safari bookings WhatsApp se automate ho jaati hain.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Get Resort Setup Plan',
        serviceId: 'whatsapp-automation',
        brief: 'Looking to set up an automated WhatsApp concierge for a resort/hotel.',
      },
      { type: 'whatsapp' as const, label: 'Discuss on WhatsApp' },
    ],
  },
  {
    id: 'vertical-real-estate',
    category: 'vertical',
    title: 'Real Estate & Property Developers',
    keywords: [
      'real estate',
      'property',
      'builder',
      'broker',
      'flats',
      'apartments',
      'site visit',
      'bhk',
      'leads qualification',
      'brochures',
    ],
    summaryEn:
      'WhatsApp lead qualification for builders & brokers: captures budget and BHK preferences, sends PDF brochures instantly, and books physical site visits.',
    summaryHi:
      'Real estate builders aur brokers ke liye WhatsApp bot: budget aur BHK preference qualify karta hai, PDF brochure bhejta hai aur site visit schedule karta hai.',
    detailsEn: `Real Estate Lead Engine:
- Instant Lead Capture: Triggered immediately when visitors click Facebook/Instagram or Google Ads.
- Automated Qualification: Asks 3 crisp questions: Budget range, BHK preference (2/3/4 BHK), and Possession timeline (Ready vs Under Construction).
- Media Delivery: Automatically dispatches verified PDF brochures, layout floor plans, and video walkthrough links.
- Calendar Site Visit Booking: Syncs with sales agents' calendars so interested buyers select an exact site visit time slot.
- CRM Integration: Syncs data into HubSpot, LeadSquared, or Google Sheets with verified phone numbers.`,
    detailsHi: `Real Estate leads qualify karne ka system:
- Instant Ad Reply: Meta ya Google Ads se aane wale customer ko 5 second ke andar WhatsApp pe welcome message aur brochure milta hai.
- 3-Question Qualification: Customer ka budget, 2BHK/3BHK requirement, aur kab shift hona hai qualify karta hai.
- PDF Brochure & Videos: Verified floor plans aur project video walkthrough seedha chat mein bhejta hai.
- Site Visit Booking: Sales executive ke calendar ke hisaab se physical site visit ka time lock karta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Setup Real Estate Flow',
        serviceId: 'ai-automation',
        brief: 'Interested in WhatsApp lead qualification and brochure bot for real estate.',
      },
    ],
  },
  {
    id: 'vertical-ecommerce-d2c',
    category: 'vertical',
    title: 'E-Commerce & D2C Brands',
    keywords: [
      'ecommerce',
      'd2c',
      'shopify',
      'abandoned cart',
      'order tracking',
      'returns',
      'cod verification',
      'rto reduction',
      'shopping',
    ],
    summaryEn:
      'WhatsApp automation for D2C brands: 65%+ open rate abandoned cart recovery, automated COD order verification, and 1-click return/exchange management.',
    summaryHi:
      'D2C brands ke liye WhatsApp automation: abandoned cart recovery, COD orders verification taaki RTO kam ho, aur live order tracking.',
    detailsEn: `D2C E-Commerce Conversion Suite:
- Abandoned Cart Recovery: WhatsApp messages triggered 30 minutes after checkout drop-off with 1-click checkout links (delivering 3x higher recovery than email).
- COD Verification & RTO Reduction: Sends interactive WhatsApp buttons to confirm Cash on Delivery orders before shipping, slashing fake orders and Return-To-Origin (RTO) costs by up to 35%.
- Real-Time Shipping Updates: Dispatches live tracking links when packages are dispatched, out for delivery, and delivered via Shiprocket, Delhivery, or Bluedart webhooks.
- Self-Service Returns: Customers initiate returns or size exchanges directly on WhatsApp by uploading a defect photo, reducing support ticket volume.`,
    detailsHi: `D2C E-Commerce ke liye solution:
- Cart Recovery: Checkout chhodne ke 30 minute baad WhatsApp reminder bhejta hai (email se 3x zyada orders wapas aate hain).
- COD Order Confirm: Order ship hone se pehle WhatsApp pe "Confirm / Cancel" button bhejta hai jisse fake orders aur RTO ka loss 35% kam hota hai.
- Live Tracking: Shiprocket/Delhivery webhooks se connect hokar dispatch aur delivery ke real-time updates bhejta hai.
- Easy Returns: Customer chat mein photo bhej kar size exchange ya return request generate kar sakta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Explore D2C Automation',
        serviceId: 'whatsapp-automation',
        brief: 'Looking to set up WhatsApp cart recovery, COD verification, and order tracking for my D2C brand.',
      },
    ],
  },
  {
    id: 'vertical-education-coaching',
    category: 'vertical',
    title: 'Coaching Institutes, Academies & EdTech',
    keywords: [
      'coaching',
      'institute',
      'academy',
      'edtech',
      'students',
      'admissions',
      'syllabus',
      'fees',
      'batch timings',
      'test results',
    ],
    summaryEn:
      'Automated student inquiry & admission bot: answers batch timings and fee structures, sends syllabus PDFs, and triggers automated fee payment reminders.',
    summaryHi:
      'Coaching institutes ke liye admission bot: batch timings, fees, syllabus PDF instant bhejta hai aur parents ko fee reminders deliver karta hai.',
    detailsEn: `Education Operations Engine:
- Admission Inquiries: Answers course syllabus, faculty info, batch timings, and fee structures in Hindi and English.
- Automated Syllabus Dispatch: Sends verified course outline PDFs and demo class links in under 5 seconds.
- Fee Due Reminders: Automated, polite WhatsApp reminders with Razorpay/UPI payment links sent to parents.
- Exam & Schedule Alerts: Broadcasts weekly test scores, holiday alerts, and timetable changes to student batches.`,
    detailsHi: `Coaching Institutes ke liye system:
- Admission Inquiries: Fees, course duration aur batch timings ka 24/7 instant WhatsApp jawab.
- Syllabus PDF: Course brochure aur demo class link seedha chat mein bhejta hai.
- Fee Reminders: Parents ko UPI/payment link ke saath polite payment reminders automate karta hai.
- Batch Broadcasts: Class timings aur weekly test results ek click mein saare students ko deliver hote hain.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Automate Institute Workflows',
        serviceId: 'ai-receptionist',
        brief: 'Interested in automating student admissions, syllabus dispatch, and fee reminders.',
      },
    ],
  },

  // ==========================================
  // 11. ADVANCED AI & SYSTEM ARCHITECTURE
  // ==========================================
  {
    id: 'architecture-rag-hybrid-search',
    category: 'architecture',
    title: 'Production RAG Architecture (Hybrid BM25 + Vector Embeddings)',
    keywords: [
      'rag',
      'retrieval augmented generation',
      'vector db',
      'embeddings',
      'pgvector',
      'pinecone',
      'chroma',
      'semantic search',
      'chunking',
      'token cost',
    ],
    summaryEn:
      'Enterprise RAG pipeline: fuses sparse BM25 keyword matching with dense pgvector semantic embeddings, plus semantic caching to slash LLM token costs by up to 60%.',
    summaryHi:
      'Production RAG architecture: exact keyword match (BM25) aur vector search (pgvector) ko milata hai, aur semantic cache se API token bill 60% tak kam karta hai.',
    detailsEn: `Nikneuron Production RAG Pipeline:
1. Intelligent Chunking: Text is segmented into 300-500 token windows with a 50-token overlap, preserving header hierarchy.
2. Hybrid Retrieval:
   - Dense Vector: Generates embeddings via text-embedding-3-small or multilingual E5 stored in PostgreSQL (pgvector).
   - Sparse Keyword (BM25): Catches exact product codes, SKUs, phone numbers, and technical terms vectors often overlook.
   - Reciprocal Rank Fusion (RRF): Combines and re-scores both result sets.
3. Semantic Caching: Checks incoming questions against a high-similarity cache threshold (>0.94); identical inquiries return cached answers in <50ms with zero LLM API charge.
4. Hallucination Guardrails: Prompts enforce strict citation of retrieved chunks; if confidence is low, the system honestly admits lack of data rather than fabricating facts.`,
    detailsHi: `RAG System kaise kaam karta hai:
1. Smart Chunking: Documents ko 300-500 tokens ke tukdon mein baanta jaata hai context retain karte hue.
2. Hybrid Search: Exact model number ya phone number ke liye BM25 keyword search, aur meaning samajhne ke liye pgvector embeddings dono ka combination.
3. Semantic Cache: Agar koi pehle se poochha sawaal dobara aata hai, toh 50ms mein cached answer milta hai bina extra API bill ke.
4. Zero Hallucination: Model ko strictly verified documents se quote karne ka rule diya jaata hai, bina andaza lagaye.`,
    actions: [
      {
        type: 'open_project' as const,
        label: 'View Clarify Case Study',
        projectId: 'project-clarify',
      },
      {
        type: 'inquire' as const,
        label: 'Build Custom RAG Pipeline',
        serviceId: 'custom-software',
        brief: 'Interested in building a production RAG system with hybrid search.',
      },
    ],
  },
  {
    id: 'architecture-voice-agents-latency',
    category: 'architecture',
    title: 'Ultra-Low Latency Voice Agent Architecture (Sub-600ms)',
    keywords: [
      'voice agent',
      'latency',
      'webrtc',
      'deepgram',
      'elevenlabs',
      'cartesia',
      'voice bot',
      'hindi voice',
      'phone calling',
      'telephony',
    ],
    summaryEn:
      'Real-time voice telephony pipeline: WebRTC full-duplex audio, Deepgram Nova-2 STT, streaming LLM, and Cartesia/ElevenLabs TTS delivering sub-600ms natural conversational latency.',
    summaryHi:
      'Sub-600ms ultra-low latency voice bot: WebRTC audio, streaming LLM aur natural Hindi/English voice jo phone par real human jaisi baat karta hai.',
    detailsEn: `How Nikneuron achieves natural conversational phone flow:
- Pipeline: User speech -> Deepgram Nova-2 streaming STT (150ms) -> Groq / Gemini 2.5 Flash streaming inference (180ms) -> Cartesia / ElevenLabs streaming TTS (180ms). Total roundtrip: 510–650ms.
- Full-Duplex WebRTC: Both parties can speak simultaneously; the bot immediately pauses speaking (barge-in detection) when the user interrupts.
- Acoustic Models: Trained on Indian English and northern Hindi accents to handle everyday colloquial speech without awkward pauses.
- Telephony Bridges: Plugs into Twilio, Exotel, or Tata Teleservices SIP trunks to answer real phone numbers 24/7.`,
    detailsHi: `Voice bot itna fast kaise chalta hai:
- Streaming Pipeline: Deepgram (STT 150ms) -> Fast LLM (180ms) -> Cartesia (TTS 180ms). Total response time sirf 550ms hota hai.
- Barge-in Support: Agar customer bolte hue beech mein tok de, toh bot turant chup hokar sunne lagta hai.
- Indian Accent: Hindi aur Indian English accent samajhne ke liye tuned models use hote hain.
- Telephony: Exotel, Twilio ya local SIP se direct connection milta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Deploy Voice Agent',
        serviceId: 'ai-receptionist',
        brief: 'Looking to deploy a sub-600ms conversational voice bot on phone lines.',
      },
    ],
  },
  {
    id: 'architecture-function-calling-verification',
    category: 'architecture',
    title: 'Multi-Agent Consensus & Strict Function Calling',
    keywords: [
      'function calling',
      'multi agent',
      'verification',
      'hallucination',
      'structured json',
      'pydantic',
      'zod',
      'safe ai',
    ],
    summaryEn:
      'Zero-hallucination pipelines using Pydantic/Zod schema-enforced function calling, combined with a secondary validator agent that checks SQL and API mutations before execution.',
    summaryHi:
      'Zero-hallucination architecture: Strict schema validation aur secondary checker agent jo database mein write karne se pehle data verify karta hai.',
    detailsEn: `Safe AI Execution Architecture:
- Schema Enforcement: Every LLM tool call adheres strictly to JSON schemas validated via Zod (TypeScript) or Pydantic (Python).
- Dual-Agent Consensus: When executing financial, booking, or database modifications, an independent Validator Agent inspects parameters against business constraints.
- Rollback Transactions: All database writes run inside transactional blocks (ACID); if verification fails, the transaction rolls back cleanly.
- Audit Logging: Every prompt, tool input, and tool output is logged with cryptographic hashes for complete transparency.`,
    detailsHi: `Safe AI Automation kaise ensure hoti hai:
- Strict Schema: LLM se output hamesha fixed JSON format mein aata hai (Pydantic/Zod validated).
- Dual-Agent Check: Payment ya database change se pehle dusra validator agent check karta hai ki rules follow hue ya nahi.
- Database Safety: Agar koi bhi error aati hai toh transaction turant rollback ho jaata hai.
- Audit Log: Har action ka complete record rehta hai taaki complete transparency ho.`,
    actions: [
      {
        type: 'open_project' as const,
        label: 'Inspect The Conclusion Pipeline',
        projectId: 'project-the-conclusion',
      },
    ],
  },

  // ==========================================
  // 12. WHATSAPP BUSINESS PLATFORM ECOSYSTEM
  // ==========================================
  {
    id: 'tech-whatsapp-cloud-api-guide',
    category: 'architecture',
    title: 'Official Meta WhatsApp Cloud API vs Unofficial Bots',
    keywords: [
      'whatsapp cloud api',
      'meta api',
      'green tick',
      'template message',
      '24 hour window',
      'waba',
      'unofficial bot',
      'ban risk',
      'messaging rates',
    ],
    summaryEn:
      'Why Nikneuron builds exclusively on the official Meta WhatsApp Cloud API: zero phone number ban risk, verified Green Tick eligibility, high throughput, and 24-hour service conversation windows.',
    summaryHi:
      'Nikneuron sirf official Meta WhatsApp Cloud API use karta hai taaki number ban hone ka koi risk na ho, Green Tick mile aur 24-ghante ka customer support window chale.',
    detailsEn: `Meta Cloud API Standards & Pricing:
- Zero Ban Guarantee: Unofficial scrapers (Baileys, Selenium) get numbers permanently banned by WhatsApp anti-spam algorithms. Meta Cloud API is 100% sanctioned.
- 24-Hour Service Window: When a customer messages your business, you get a 24-hour open window to send free-form replies, voice notes, and media.
- Interactive Templates: Outside 24h, you can send pre-approved templates featuring interactive Quick-Reply and Call-To-Action URL buttons.
- Tiered Throughput: Scales from 1,000 to 10,000 to unlimited conversations/day as your quality rating stays green.
- Green Tick Verification: We assist clients with Meta Business Manager verification to secure the official green badge beside their brand name.`,
    detailsHi: `Official Meta Cloud API ke fayde:
- Zero Ban Risk: Third-party unofficial bots ban ho jaate hain. Meta Cloud API 100% legal aur safe hai.
- 24-Hour Customer Window: Customer ka message aane ke baad 24 ghante tak koi template restriction nahi hoti.
- Interactive Buttons: WhatsApp chat mein Quick-Reply aur link buttons show hote hain jo response rate 4x badhate hain.
- High Volume: Daily 1,000 se lekar 1,00,000+ messages bina kisi rukawat ke handle hote hain.
- Green Tick: Company profile par official verified Green Tick lagwane mein hum support karte hain.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Set Up Meta WhatsApp API',
        serviceId: 'whatsapp-automation',
        brief: 'Interested in official Meta WhatsApp Cloud API integration and green tick setup.',
      },
    ],
  },

  // ==========================================
  // 13. PERFORMANCE, DATABASES & INTEGRATIONS
  // ==========================================
  {
    id: 'tech-core-web-vitals',
    category: 'architecture',
    title: 'Sub-Second Web Performance & Core Web Vitals',
    keywords: [
      'core web vitals',
      'speed',
      'performance',
      'lcp',
      'inp',
      'cls',
      'cloudflare',
      'seo ranking',
      'fast loading',
      '60fps',
    ],
    summaryEn:
      'Sub-800ms LCP, INP < 100ms, and zero layout shift. Engineered with Vite, critical CSS inlining, WebGL GPU optimization, and global Cloudflare edge caching.',
    summaryHi:
      '1 second se kam load time: Sub-800ms LCP, zero layout shift, aur Cloudflare edge caching taaki website Google ranking aur customer speed mein top rahe.',
    detailsEn: `How Nikneuron achieves top-percentile web speeds:
- Largest Contentful Paint (LCP < 0.8s): Preloads hero assets, inlines critical styling, and uses WebP/AVIF images on global CDN edges.
- Interaction to Next Paint (INP < 100ms): Keeps main thread clean by offloading heavy computational logic to Web Workers or lightweight requestAnimationFrame loops.
- 3D Holographic Rendering: Nikneuron's Three.js canvas dynamically scales pixel ratios (DPR cap at 1.5) and pauses rendering loops when out of view, ensuring zero laptop battery drain.
- SEO Impact: Google directly ranks sub-second Core Web Vitals websites higher in search results, driving lower customer acquisition costs.`,
    detailsHi: `Websites itni fast kaise chalti hain:
- Superfast Loading (LCP < 0.8s): Images AVIF format mein hoti hain aur Cloudflare CDN se aati hain.
- Smooth Scrolling (INP < 100ms): Main thread par koi heavy code nahi atak ta, scrolling 60 FPS par rehti hai.
- Three.js 3D Optimization: 3D Cube scroll hone par GPU memory automatically save karta hai taaki battery drain na ho.
- Google Ranking: Fast websites ko Google search automatically top par rank karta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Audit My Website Speed',
        serviceId: 'web-dev',
        brief: 'Want a Core Web Vitals audit and performance optimization for my website.',
      },
    ],
  },
  {
    id: 'tech-database-selection',
    category: 'architecture',
    title: 'Database Architecture: PostgreSQL (Supabase) vs Redis vs SQLite',
    keywords: [
      'database',
      'postgres',
      'postgresql',
      'supabase',
      'redis',
      'sqlite',
      'sql vs nosql',
      'vector database',
      'schema',
    ],
    summaryEn:
      'Nikneuron database blueprint: PostgreSQL (Supabase/Neon) for transactional integrity and vector search; Redis for token bucket rate-limiting; SQLite for edge deployments.',
    summaryHi:
      'Nikneuron database blueprint: PostgreSQL relational data aur vector search ke liye, Redis sliding-window rate limit ke liye, aur SQLite lightweight edge setups ke liye.',
    detailsEn: `Database Selection Framework:
- PostgreSQL (via Supabase / Neon): Default choice for 90% of business applications. Provides robust ACID compliance, JSONB support for flexible documents, and the pgvector extension for AI embeddings in one unified database.
- Redis (via Upstash): In-memory key-value store for session caching, sliding-window rate limiters, and WhatsApp webhook queue workers.
- SQLite (via Turso/LibSQL): Ultra-fast serverless edge database for localized embedded apps with microsecond read latencies.
- Anti-Pattern Avoided: We avoid scattered NoSQL architectures that cause silent data corruption when relational constraints (like orders, invoices, and users) are required.`,
    detailsHi: `Kaunsa database kahan use hota hai:
- PostgreSQL (Supabase / Neon): 90% projects ke liye best — data safe rehta hai, orders aur invoices connect hote hain, aur pgvector se AI search bhi ek hi database mein hoti hai.
- Redis: Session cache aur WhatsApp webhooks ko fast process karne ke liye in-memory store.
- SQLite: Chhote apps aur fast edge deployments ke liye zero-config database.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Consult on DB Architecture',
        serviceId: 'custom-software',
        brief: 'Looking for advice on database design and architecture for my project.',
      },
    ],
  },
  {
    id: 'tech-legacy-system-connectors',
    category: 'architecture',
    title: 'Connecting AI & WhatsApp to Legacy ERPs, Tally & Excel',
    keywords: [
      'legacy',
      'tally',
      'excel',
      'google sheets',
      'erp integration',
      'mysql',
      'old software',
      'connectors',
      'sync',
    ],
    summaryEn:
      'Modernize existing operations without ripping out legacy systems. Connects modern AI bots and WhatsApp alerts to Tally ERP, Google Sheets, Excel, and custom MySQL databases.',
    summaryHi:
      'Purane systems ko badle bina naya AI connect karein: Tally, Excel sheets, Google Sheets aur purane MySQL databases se seedha WhatsApp aur AI connect hota hai.',
    detailsEn: `Legacy Modernization Blueprint:
- No Disruption: You don't have to discard software your team has used for 10 years (e.g. Tally Prime, desktop ERPs, Excel trackers).
- Tally XML / ODBC Gateway: Automatically listens for new invoices or outstanding ledgers in Tally and sends payment reminders over WhatsApp.
- Google Sheets Two-Way Sync: Form inquiries or WhatsApp leads instantly append as new rows; editing a status in Sheets triggers a customer notification.
- Read-Replica Connectors: Safely connects to on-premise MySQL/MSSQL databases via read-replicas to prevent any lockups on production systems.`,
    detailsHi: `Purane software ke saath integration:
- Purana system badalne ki zaroorat nahi: Jo software team pichhle 10 saal se chala rahi hai (Tally, Excel, purana ERP), usi ke upar automation layer lagti hai.
- Tally WhatsApp Alerts: Tally mein bill bante hi customer ko WhatsApp par PDF invoice aur payment link chala jaata hai.
- Google Sheets 2-Way Sync: Har nayi lead Sheet mein aati hai, aur Sheet mein update karte hi customer ko WhatsApp message chala jaata hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Connect My Legacy Software',
        serviceId: 'ai-automation',
        brief: 'Want to connect WhatsApp/AI to our existing Tally / Excel / ERP software.',
      },
    ],
  },
  {
    id: 'tech-security-compliance-dpdp',
    category: 'architecture',
    title: 'Security, Data Privacy & Indian DPDP Act 2023 Compliance',
    keywords: [
      'security',
      'privacy',
      'dpdp',
      'compliance',
      'gdpr',
      'encryption',
      'aes 256',
      'jwt',
      'api key',
      'data residency',
    ],
    summaryEn:
      'Built strictly compliant with Indian DPDP Act 2023: AES-256 encryption at rest, TLS 1.3 in transit, logged customer consent, and zero data leakage to third-party ad networks.',
    summaryHi:
      'Indian DPDP Act 2023 compliant architecture: AES-256 encryption, secure credentials, aur customer data ki 100% privacy jisse data kabhi leak na ho.',
    detailsEn: `Security & Compliance Guarantees:
- Indian DPDP Act 2023 Readiness: Consent timestamps logged for every WhatsApp opt-in; users can text "STOP" to automatically purge contact records.
- Secret Management: Zero API keys or database credentials committed to git; all secrets injected at runtime via environment variables with AES-256 encryption.
- Authentication: Secure HTTP-only cookies and cryptographic JWTs (RS256) with short expiration windows and token rotation.
- Data Ownership: Nikneuron signs strict Non-Disclosure Agreements (NDAs); you retain 100% intellectual property and database ownership.`,
    detailsHi: `Security & Privacy ke rules:
- DPDP Act Compliance: WhatsApp opt-in ka record rehta hai, aur customer "STOP" bhej kar data delete karwa sakta hai.
- Encrypted Secrets: Saari API keys aur passwords encrypted rehte hain, kabhi open code mein nahi jaate.
- Full IP Ownership: Nikneuron NDA sign karta hai aur saara code aur data 100% aapki ownership mein rehta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Review Security & Compliance',
        brief: 'Have questions regarding security, NDAs, and DPDP Act compliance.',
      },
    ],
  },

  // ==========================================
  // 14. EXPANDED PRODUCTION CODE RECIPES
  // ==========================================
  {
    id: 'code-whatsapp-cloud-api-sender',
    category: 'code_recipe',
    title: 'Meta WhatsApp Cloud API Message Sender (TypeScript)',
    keywords: [
      'whatsapp code',
      'send whatsapp',
      'cloud api snippet',
      'meta api code',
      'typescript whatsapp',
      'template message code',
    ],
    summaryEn:
      'Production-ready TypeScript helper function to dispatch interactive template messages using the official Meta WhatsApp Cloud API via native fetch.',
    summaryHi:
      'Official Meta WhatsApp Cloud API se interactive template message bhejne ke liye complete working TypeScript snippet.',
    detailsEn: `Working TypeScript function using native fetch (zero external npm dependencies required):

\`\`\`ts
export async function sendWhatsAppTemplate(opts: {
  phoneNumberId: string;
  accessToken: string;
  recipientPhone: string; // E.164 format, e.g. "919258032799"
  templateName: string;
  languageCode?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const url = \`https://graph.facebook.com/v21.0/\${opts.phoneNumberId}/messages\`;
  const cleanPhone = opts.recipientPhone.replace(/\\D/g, '');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${opts.accessToken}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: opts.templateName,
          language: { code: opts.languageCode || 'en' },
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data?.error?.message || 'Failed to send' };
    }
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
\`\`\``,
    detailsHi: `Yeh complete TypeScript helper function hai Meta WhatsApp Cloud API se template bhejne ke liye:

\`\`\`ts
export async function sendWhatsAppTemplate(opts: {
  phoneNumberId: string;
  accessToken: string;
  recipientPhone: string;
  templateName: string;
  languageCode?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const url = \`https://graph.facebook.com/v21.0/\${opts.phoneNumberId}/messages\`;
  const cleanPhone = opts.recipientPhone.replace(/\\D/g, '');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${opts.accessToken}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: cleanPhone,
      type: 'template',
      template: {
        name: opts.templateName,
        language: { code: opts.languageCode || 'en' },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) return { success: false, error: data?.error?.message };
  return { success: true, messageId: data.messages?.[0]?.id };
}
\`\`\``,
  },
  {
    id: 'code-razorpay-webhook-verification',
    category: 'code_recipe',
    title: 'Razorpay Payment Webhook Verification (Node / TypeScript)',
    keywords: [
      'razorpay code',
      'razorpay webhook',
      'payment verification',
      'hmac sha256',
      'crypto snippet',
      'payment signature',
    ],
    summaryEn:
      'Cryptographic signature validation helper for incoming Razorpay webhooks in Node.js using native crypto HMAC-SHA256.',
    summaryHi:
      'Node.js mein Razorpay payment webhook signature verify karne ke liye complete HMAC-SHA256 crypto snippet.',
    detailsEn: `Complete Node/TypeScript webhook verification snippet:

\`\`\`ts
import crypto from 'node:crypto';

export function verifyRazorpaySignature(
  rawBodyPayload: string,
  receivedSignature: string,
  webhookSecret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBodyPayload)
    .digest('hex');

  // Use timingSafeEqual to guard against timing side-channel attacks
  const expectedBuf = Buffer.from(expectedSignature, 'utf8');
  const receivedBuf = Buffer.from(receivedSignature, 'utf8');

  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}
\`\`\``,
    detailsHi: `Razorpay signature verify karne ka working snippet:

\`\`\`ts
import crypto from 'node:crypto';

export function verifyRazorpaySignature(
  rawBodyPayload: string,
  receivedSignature: string,
  webhookSecret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBodyPayload)
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSignature, 'utf8');
  const receivedBuf = Buffer.from(receivedSignature, 'utf8');

  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}
\`\`\``,
  },
  {
    id: 'code-sliding-window-rate-limiter',
    category: 'code_recipe',
    title: 'In-Memory Sliding-Window API Rate Limiter (TypeScript)',
    keywords: [
      'rate limiter code',
      'ddos protection snippet',
      'api rate limit',
      'sliding window code',
      'protect api',
    ],
    summaryEn:
      'Zero-dependency in-memory sliding window rate limiter to protect Next.js, Express, or Vite endpoints from abusive spam.',
    summaryHi:
      'API endpoints ko spam se bachane ke liye zero-dependency in-memory sliding window rate limiter snippet.',
    detailsEn: `Working in-memory rate limiter snippet:

\`\`\`ts
export class SlidingWindowRateLimiter {
  private requests = new Map<string, number[]>();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  public isAllowed(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const timestamps = (this.requests.get(key) || []).filter(
      (ts) => now - ts < this.windowMs
    );

    if (timestamps.length >= this.maxRequests) {
      this.requests.set(key, timestamps);
      return { allowed: false, remaining: 0 };
    }

    timestamps.push(now);
    this.requests.set(key, timestamps);
    return { allowed: true, remaining: this.maxRequests - timestamps.length };
  }
}

// Example usage: 10 requests allowed per 60 seconds per IP
const apiLimiter = new SlidingWindowRateLimiter(10, 60_000);
\`\`\``,
    detailsHi: `Sliding-window rate limiter snippet:

\`\`\`ts
export class SlidingWindowRateLimiter {
  private requests = new Map<string, number[]>();

  constructor(private maxRequests: number, private windowMs: number) {}

  public isAllowed(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const timestamps = (this.requests.get(key) || []).filter(
      (ts) => now - ts < this.windowMs
    );

    if (timestamps.length >= this.maxRequests) {
      this.requests.set(key, timestamps);
      return { allowed: false, remaining: 0 };
    }

    timestamps.push(now);
    this.requests.set(key, timestamps);
    return { allowed: true, remaining: this.maxRequests - timestamps.length };
  }
}
\`\`\``,
  },
  {
    id: 'code-rrf-hybrid-search',
    category: 'code_recipe',
    title: 'Reciprocal Rank Fusion (RRF) for Hybrid Search (Python)',
    keywords: [
      'rrf code',
      'reciprocal rank fusion',
      'hybrid search snippet',
      'rag search code',
      'combine bm25 and vector',
    ],
    summaryEn:
      'Clean Python snippet implementing Reciprocal Rank Fusion (RRF) to combine keyword ranks (BM25) and dense vector ranks for RAG search.',
    summaryHi:
      'Keyword search aur vector search ke results ko combine karne ke liye Reciprocal Rank Fusion (RRF) ka Python snippet.',
    detailsEn: `Python snippet for combining keyword and vector ranks:

\`\`\`python
from typing import List, Dict

def reciprocal_rank_fusion(
    bm25_doc_ids: List[str],
    vector_doc_ids: List[str],
    k: int = 60
) -> List[tuple[str, float]]:
    """Combines BM25 and vector results via standard RRF scoring."""
    scores: Dict[str, float] = {}

    for rank, doc_id in enumerate(bm25_doc_ids):
        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))

    for rank, doc_id in enumerate(vector_doc_ids):
        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))

    # Sort descending by fused score
    return sorted(scores.items(), key=lambda item: item[1], reverse=True)
\`\`\``,
    detailsHi: `Python RRF hybrid search algorithm:

\`\`\`python
def reciprocal_rank_fusion(bm25_doc_ids, vector_doc_ids, k=60):
    scores = {}
    for rank, doc_id in enumerate(bm25_doc_ids):
        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
    for rank, doc_id in enumerate(vector_doc_ids):
        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
\`\`\``,
  },

  // ==========================================
  // 15. STUDIO PHILOSOPHY & COMMERCIAL TRANSPARENCY
  // ==========================================
  {
    id: 'company-almora-studio',
    category: 'company',
    title: 'The Almora Advantage: Engineering Density & Zero Overhead',
    keywords: [
      'why almora',
      'himalayan studio',
      'location',
      'remote engineering',
      'cost advantage',
      'uttarakhand team',
      'why hire nikneuron',
    ],
    summaryEn:
      'Nikneuron operates from Almora, Uttarakhand. Serene Himalayan focus, ultra-lean operations with zero metropolitan overhead, passing 100% of the cost efficiency to clients.',
    summaryHi:
      'Nikneuron Almora, Uttarakhand se operate karta hai. Pahadon ki quiet focus, metro shehron ka zero unnecessary kharcha, aur client ko best quality at honest pricing.',
    detailsEn: `Why clients choose Nikneuron over metro agencies:
- Zero Agency Fluff: Large agencies in Delhi, Bangalore, or Mumbai charge \$15,000+ to cover expensive office leases, account managers, and pitch decks. You end up speaking to an intern.
- Direct Founder Collaboration: At Nikneuron, you work directly with founder Aditya Tamta and core engineers. Zero game of telephone, zero bureaucracy.
- Deep Work Environment: Operating from the peaceful hills of Almora enables long blocks of uninterrupted engineering focus, shipping clean, bug-free software faster.
- Transparent Pricing: You pay for production code and architectural deliverables, not our office coffee or sales commissions.`,
    detailsHi: `Clients Nikneuron ko kyu chunte hain:
- No Middlemen: Delhi/Bangalore ki agencies ke lambe choudhe kharche nahi hote. Aap seedha founder Aditya Tamta aur core engineers se baat karte hain.
- Focus: Pahadon ke shant mahaul mein code quality aur deep focus milta hai, bina kisi deadline ke chhootne ke.
- Honest Pricing: Har rupee sirf solid code aur live results par kharch hota hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Connect With Aditya',
        brief: 'Would love to discuss a project directly with the founder.',
      },
    ],
  },
  {
    id: 'faq-hosting-cloud-costs',
    category: 'faq',
    title: 'Cloud Hosting & Ongoing Infrastructure Bills Transparency',
    keywords: [
      'hosting cost',
      'cloud bill',
      'server cost',
      'vercel pricing',
      'supabase cost',
      'whatsapp api charges',
      'monthly expenses',
      'maintenance fees',
    ],
    summaryEn:
      'Transparent cloud billing: Vercel/Railway hosting (\$0–\$20/mo), Supabase database (\$0–\$25/mo), and Meta WhatsApp rates (fractions of a cent per conversation).',
    summaryHi:
      'Transparent cloud kharcha: Website hosting (\$0–\$20/mahina), database (\$0–\$25/mahina), aur WhatsApp official charges jo fractions of a paisa hote hain.',
    detailsEn: `Typical monthly cloud infrastructure breakdown for clients:
1. Web Hosting (Vercel / Cloudflare Pages / Railway):
   - \$0/month (Free Tier) covers up to 100,000 monthly visitors easily.
   - \$20/month if advanced team collaboration is required.
2. Database & Vector Storage (Supabase / Neon):
   - \$0/month for up to 500MB data and 50,000 monthly active users.
   - \$25/month for automated daily backups and 8GB storage.
3. Meta WhatsApp Cloud API:
   - First 1,000 service conversations every month are 100% free from Meta.
   - Additional customer-initiated conversations in India are only ~₹0.30 to ₹0.40 per 24h window.
4. Voice & LLM APIs (Gemini / Deepgram):
   - Typically \$5 to \$25/month depending on call volume.
- Summary: A typical small-to-midsize business runs on under ₹1,500 to ₹3,500/month in total cloud bills.`,
    detailsHi: `Mahine ka hosting kharcha kitna aata hai:
1. Website Hosting (Vercel/Cloudflare): Pehle 1 lakh visitors ke liye ₹0 (free tier) kaafi hota hai.
2. Database (Supabase): Chhote businesses ke liye ₹0, scale hone par ~₹2,000/month.
3. WhatsApp Official API: Pehli 1,000 conversations har mahine Meta ki taraf se FREE hoti hain. Baad mein sirf ~₹0.35 per conversation lagti hai.
4. Total: Zyadatar businesses ka monthly cloud kharcha sirf ₹1,500 se ₹3,000 ke beech rehta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Request Infrastructure Estimate',
        brief: 'Want a tailored estimate of monthly cloud and hosting costs for my proposed system.',
      },
    ],
  },
  {
    id: 'faq-traffic-spike-resilience',
    category: 'faq',
    title: 'What Happens During Traffic Spikes or Viral Surges?',
    keywords: [
      'traffic spike',
      'scalability',
      'heavy load',
      'server down',
      'high traffic',
      'crash',
      'black friday',
      'viral surge',
    ],
    summaryEn:
      'Systems built with Cloudflare edge caching, PgBouncer database connection pooling, and stateless microservices scale effortlessly from 10 to 50,000 concurrent visitors.',
    summaryHi:
      'Cloudflare edge caching, connection pooling aur stateless architecture ke saath website bina crash hue 50,000+ live visitors handle karti hai.',
    detailsEn: `How Nikneuron architectures absorb massive traffic spikes:
- Edge Cache Offloading: Static assets, blog posts, and landing pages are served directly from 300+ global Cloudflare edge data centers, absorbing 95% of traffic before it touches your server.
- PgBouncer Connection Pooling: Prevents database crashes by pooling active connections, so 10,000 simultaneous users don't exhaust PostgreSQL connection limits.
- Background Queue Workers: Heavy tasks (WhatsApp batch messages, invoice generation, image rendering) run in asynchronous queues, keeping user-facing endpoints lightning fast.`,
    detailsHi: `Traffic badhne par system kaise sambhalta hai:
- Cloudflare CDN: 95% traffic website server tak pahunchne se pehle hi edge cache handle kar leta hai.
- Connection Pooling: Database par achanak load aane par PgBouncer connections queue karta hai taaki server down na ho.
- Background Queues: WhatsApp messages aur invoice rendering background mein chalte hain taaki website ki speed slow na ho.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Discuss Scalability Needs',
        serviceId: 'custom-software',
        brief: 'Need a high-concurrency architecture that handles sudden traffic spikes.',
      },
    ],
  },
  {
    id: 'faq-bug-warranty-sla',
    category: 'faq',
    title: 'Post-Launch Bug Warranty & Service Level Agreement (SLA)',
    keywords: [
      'warranty',
      'bug fix',
      'post launch',
      'maintenance',
      'amc',
      'guarantee',
      'sla',
      'after support',
    ],
    summaryEn:
      'Every production handover includes a 30-day zero-cost bug fix warranty. Followed by flexible monthly retainers with guaranteed 4-hour response SLAs.',
    summaryHi:
      'Har project ke launch ke baad 30 din ka free bug fix warranty milta hai, jiske baad optional monthly retainers mein 4 ghante ka response SLA rehta hai.',
    detailsEn: `Post-Handover Warranty & Support Policy:
- 30-Day Launch Warranty: If any bug or deviation from agreed scope arises within 30 days of production go-live, we patch it immediately with zero extra billing.
- Code Handover Guarantee: You receive the complete GitHub repository, environment documentation, and admin ownership of all accounts.
- Optional Growth Retainer: For continuous feature additions and 24/7 server monitoring, retainers provide guaranteed 4-hour SLA response times.`,
    detailsHi: `Handover ke baad support policy:
- 30 Din Free Warranty: Launch hone ke 30 din ke andar koi bhi bug aane par hum turant fix karte hain bina kisi extra charge ke.
- Complete Handover: Complete GitHub code access, deployment keys aur admin credentials aapke handover kiye jaate hain.
- Monthly Retainers: Regular updates aur monitoring ke liye optional monthly retainer chalta hai jismein 4 ghante ka guaranteed reply milta hai.`,
    actions: [
      {
        type: 'inquire' as const,
        label: 'Ask About Support Plans',
        serviceId: 'growth-retainer',
        brief: 'Inquiring about 30-day warranty and monthly maintenance retainers.',
      },
    ],
  },
];

const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'of', 'to', 'for', 'with', 'by',
  'what', 'how', 'who', 'when', 'where', 'why', 'can', 'you', 'your', 'my', 'me', 'we', 'our', 'it', 'its',
  'kya', 'hai', 'hain', 'kaise', 'kaisa', 'kaisi', 'hoti', 'hota', 'mein', 'se', 'ko', 'ka', 'ki', 'ke', 'aur', 'karo', 'karein',
  'batao', 'bataiye', 'chahiye', 'bhai', 'yaar', 'aap', 'tell', 'show', 'give'
]);

/**
 * Intelligent Keyword & Semantic Scoring Search Engine for Chatbot Nik.
 * Returns the highest ranking KnowledgeItems for any user query.
 */
export function searchKnowledgeBase(query: string, maxResults = 3): KnowledgeItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const rawTokens = q.split(/[\s,?.!/\\-]+/).filter((t) => t.length >= 2);
  if (rawTokens.length === 0) return [];

  const meaningfulTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));
  const tokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  const scored: Array<{ item: KnowledgeItem; score: number }> = [];

  for (const item of NIK_KNOWLEDGE_BASE) {
    let score = 0;

    // Direct title match
    const titleLower = item.title.toLowerCase();
    if (titleLower.includes(q)) {
      score += 50;
    }

    // Token matches against title
    for (const t of tokens) {
      if (titleLower.includes(t)) {
        score += 15;
      }
    }

    // Keyword matches
    for (const kw of item.keywords) {
      if (kw === q) {
        score += 35;
      } else if (kw.includes(q) || q.includes(kw)) {
        score += 20;
      } else {
        for (const t of tokens) {
          if (t.length >= 3 && kw.includes(t)) {
            score += 6;
          }
        }
      }
    }

    // Summary matches
    const sumEn = item.summaryEn.toLowerCase();
    const sumHi = item.summaryHi.toLowerCase();
    for (const t of tokens) {
      if (t.length >= 4) {
        if (sumEn.includes(t)) score += 3;
        if (sumHi.includes(t)) score += 3;
      }
    }

    if (score > 8) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults).map((s) => s.item);
}

/**
 * Compiles the entire knowledge base into a concise, token-efficient reference string
 * for LLM system prompts (e.g. Gemini, OpenAI, Claude).
 */
export function compileKnowledgeBasePrompt(): string {
  const sections: string[] = [
    `=== NIKNEURON VERIFIED KNOWLEDGE BASE ===`,
    `Founder: ${SITE_CONFIG.founder.name} (${SITE_CONFIG.founder.role}) | Motto: "${SITE_CONFIG.founder.motto}"`,
    `Contact: WhatsApp ${SITE_CONFIG.contact.phone} | Email: ${SITE_CONFIG.contact.email} | Reply: ${SITE_CONFIG.contact.replyTimeCommitment}`,
    `Location: Almora, Uttarakhand & Remote India | Policy: 100% source code handover, zero middleman bureaucracy.`,
    ``,
    `--- 8 CORE SERVICES ---`,
    ...ALL_SERVICES_CONFIG.map(
      (s, i) =>
        `${i + 1}. ${s.title} (${s.id}): ${s.tagline}. Key capabilities: ${s.benefits.slice(0, 3).join('; ')}.`
    ),
    ``,
    `--- 3 READY BUNDLE PACKAGES ---`,
    ...BUNDLE_PACKAGES.map(
      (b) => `- ${b.name} (${b.id}): ${b.tagline}. Includes: ${b.included.join(' + ')}.`
    ),
    ``,
    `--- 6 PRODUCTION CASE STUDIES ---`,
    ...PROJECTS_CONFIG.map(
      (p) =>
        `- ${p.title} [${p.status}]: ${p.tagline}. Solved: "${p.problem}" via "${p.solution}". Tech: ${p.stack.join(', ')}.`
    ),
    ``,
    `--- 4-STEP METHODOLOGY ---`,
    ...SITE_CONFIG.processSteps.map(
      (step) =>
        `Step ${step.step} [${step.duration}]: ${step.title} — Deliverables: ${step.deliverables.slice(0, 3).join(', ')}.`
    ),
    ``,
    `--- ENGAGEMENT & PRICING MODELS ---`,
    ...SITE_CONFIG.engagementOptions.map(
      (opt) => `- ${opt.title} (${opt.id}): ${opt.tagline}. Suited for: ${opt.idealFor}.`
    ),
    ``,
    `--- CORE FAQS ---`,
    ...SITE_CONFIG.faqs.map((f) => `Q: ${f.question} | A: ${f.answer}`),
    ``,
    `--- VERTICAL INDUSTRY SOLUTIONS & TECHNICAL BLUEPRINTS ---`,
    ...NIK_KNOWLEDGE_BASE.filter((k) =>
      ['vertical', 'architecture', 'concept'].includes(k.category)
    ).map((k) => `- ${k.title}: ${k.summaryEn}`),
    ``,
    `--- COMMERCIAL POLICIES & INFRASTRUCTURE TRANSPARENCY ---`,
    ...NIK_KNOWLEDGE_BASE.filter((k) =>
      [
        'company-almora-studio',
        'faq-hosting-cloud-costs',
        'faq-traffic-spike-resilience',
        'faq-bug-warranty-sla',
      ].includes(k.id)
    ).map((k) => `- ${k.title}: ${k.summaryEn}`),
  ];

  return sections.join('\n');
}
