import { ALL_SERVICES_CONFIG, BUNDLE_PACKAGES } from '../config/services.config';
import { SITE_CONFIG } from '../config/site.config';
import { NIK_SITE_CONTEXT, NIK_SYSTEM_PROMPT } from '../config/nikPrompt';
import { searchKnowledgeBase } from '../config/nikKnowledgeBase';

export interface NikAction {
  type: 'inquire' | 'inspect_face' | 'whatsapp' | 'scroll_services' | 'open_project';
  label: string;
  serviceId?: string;
  faceIndex?: number;
  projectId?: string;
  brief?: string;
}

export interface NikMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  actions?: NikAction[];
}

export interface NikReply {
  text: string;
  actions?: NikAction[];
}

const HINGLISH_MARKERS =
  /\b(kya|kaise|kaisa|kaisi|hai|hain|hota|hoti|chahiye|batao|bataiye|banao|banwana|karna|karein|karo|bhai|yaar|aap|mera|meri|hamara|kitna|kitne|kaunsa|samjhao|madad|thik|theek|accha|achha|namaste|hinglish|mein|se|ko|ka|ki|ke|aur|nahi|nhi|haan|hn)\b/i;

function detectHinglish(text: string): boolean {
  if (/[\u0900-\u097F]/.test(text)) return true;
  const matches = text.match(new RegExp(HINGLISH_MARKERS.source, 'gi'));
  return (matches?.length ?? 0) >= 1;
}

function isUnsafeRequest(lower: string): boolean {
  return /\b(hack|phish|malware|ransomware|ddos|exploit|steal password|crack license|bypass paywall|sql injection attack|keylogger)\b/.test(
    lower
  );
}

function asksToBrowseOrRunCode(lower: string): boolean {
  return /\b(browse the web|search google|open this url|fetch this website|run this code|execute this script|check live stock|weather right now)\b/.test(
    lower
  );
}

function buildServiceMatchReply(lower: string, hinglish: boolean): NikReply | null {
  if (/\b(bundle|package|packages|starter|growth|complete|pricing|price|cost|quote|charges|fee|fees)\b/.test(lower)) {
    const starter = BUNDLE_PACKAGES[0];
    const growth = BUNDLE_PACKAGES[1];
    const complete = BUNDLE_PACKAGES[2];

    if (hinglish) {
      return {
        text: `Nikneuron ke 3 ready bundles hain (exact quote scope dekh kar milta hai — main guess nahi karunga):

- **${starter.name}**: ${starter.included.join(' + ')}
- **${growth.name}** (Most Popular): ${growth.included.join(' + ')}
- **${complete.name}**: ${complete.included.join(' + ')}

Aapka business kis stage pe hai? Chaho toh niche se seedha inquiry bhej do, 24 ghante mein reply mil jayega.`,
        actions: [
          {
            type: 'inquire',
            label: 'Get Bundle Quote',
            serviceId: 'bundle-growth',
            brief: 'Interested in Nikneuron bundle pricing and timeline.',
          },
          { type: 'whatsapp', label: 'Ask on WhatsApp' },
        ],
      };
    }

    return {
      text: `Pricing depends on scope, so I won't guess numbers—here are the 3 Nikneuron bundles to start from:

- **${starter.name}**: ${starter.included.join(' + ')}
- **${growth.name}** (Most Popular): ${growth.included.join(' + ')}
- **${complete.name}**: ${complete.included.join(' + ')}

Tell me what you're building and I can recommend the right fit, or send an inquiry for an exact quote.`,
      actions: [
        {
          type: 'inquire',
          label: 'Request Exact Quote',
          serviceId: 'bundle-growth',
          brief: 'Requesting quote for Nikneuron package.',
        },
        { type: 'whatsapp', label: 'Chat on WhatsApp' },
      ],
    };
  }

  const matched = ALL_SERVICES_CONFIG.find((service) => {
    const keywords = [
      service.title.toLowerCase(),
      ...service.tags.map((t) => t.toLowerCase()),
    ];
    return keywords.some((kw) => kw.length >= 3 && lower.includes(kw));
  });

  if (matched) {
    const bullets = matched.benefits.slice(0, 3).map((b) => `- ${b}`).join('\n');
    return {
      text: hinglish
        ? `**${matched.title}** aapke kaam ke liye sahi rahega — ${matched.tagline}.

Ismein yeh main cheezein include hoti hain:
${bullets}

Chaho toh iska 3D view dekhein ya seedha quote ke liye message bhejein.`
        : `**${matched.title}** covers ${matched.tagline.toLowerCase()}.

Key deliverables include:
${bullets}

Want me to help scope this for your business, or jump straight to an inquiry?`,
      actions: [
        {
          type: 'inquire',
          label: `Inquire: ${matched.title}`,
          serviceId: matched.id,
          brief: `Interested in ${matched.title}.`,
        },
        {
          type: 'inspect_face',
          label: 'Explore in 3D Cube',
          faceIndex: matched.faceIndex,
        },
      ],
    };
  }

  if (/\b(service|services|offer|what do you do|nikneuron|help my business|kaam|kya karte)\b/.test(lower)) {
    const list = ALL_SERVICES_CONFIG.map((s, i) => `${i + 1}. **${s.title}** — ${s.tagline}`).join('\n');
    return {
      text: hinglish
        ? `Nikneuron businesses ke liye yeh 8 services build karta hai:\n\n${list}\n\nAapko kaunsi problem solve karni hai — zyada leads, faster website, ya manual work automate karna?`
        : `Nikneuron builds 8 core systems for growing businesses:\n\n${list}\n\nWhich outcome matters most right now — booking more leads, launching a site, or automating manual work?`,
      actions: [
        { type: 'scroll_services', label: 'Browse All Services' },
        {
          type: 'inquire',
          label: 'Book Free Consultation',
          serviceId: 'ai-receptionist',
          brief: 'Looking for guidance on which Nikneuron service fits best.',
        },
      ],
    };
  }

  return null;
}

function buildDraftReply(raw: string, lower: string, hinglish: boolean): NikReply | null {
  if (!/\b(draft|write|compose|message|email|reply|post|bio|caption|likh|likho|likhna|bhejna)\b/.test(lower)) {
    return null;
  }

  const isEmail = /\b(email|mail|subject)\b/.test(lower);
  const isPost = /\b(post|linkedin|instagram|caption)\b/.test(lower);

  if (isEmail) {
    return {
      text: hinglish
        ? `Yeh ek short, clear follow-up email draft hai (brackets mein apni details daal lena):

\`\`\`text
Subject: Quick follow-up on [Project / Proposal Name]

Hi [Name],

Hope your week is going well. Just checking in on our chat about [topic].

If it helps, we can keep the first phase simple: [1-line goal] in [timeline]. Let me know a good time for a quick 15-minute call this week.

Best,
[Your Name]
\`\`\`

Agar exact context batao (client ka business aur goal), toh main isko aur specific bana dunga.`
        : `Here's a crisp, direct email draft you can customize:

\`\`\`text
Subject: Next steps for [Project / Goal]

Hi [Name],

Thanks again for sharing what you're looking to build. Based on our discussion, starting with [Phase 1 deliverable] looks like the fastest win.

Would [Day] at [Time] work for a quick 15-minute call to finalize scope and timeline?

Best,
[Your Name]
\`\`\`

Share who it's for and the main ask if you want me to tailor it.`,
    };
  }

  if (isPost) {
    return {
      text: hinglish
        ? `Yeh ek clean, high-clarity LinkedIn/social post draft hai:

\`\`\`text
Most small teams don't lose leads because of a bad product.
They lose leads because nobody replies after 7 PM.

That's why we started setting up 24/7 AI receptionists + WhatsApp booking flows for local clinics, hotels, and service businesses.

Result: instant answers in English or Hinglish, appointments synced automatically, zero missed calls.

Curious how it would work for your business? Drop a comment or DM "DEMO".
\`\`\`

Agar kisi aur topic pe post chahiye toh topic batao.`
        : `Here's a direct, zero-fluff post draft:

\`\`\`text
Most growing businesses don't have a traffic problem. They have a follow-up problem.

When calls go unanswered after hours or WhatsApp leads wait 6 hours for a reply, customers move on.

Automating initial replies + calendar booking fixes the leak in days—without hiring extra staff.

If you'd like to see a quick breakdown of how to set this up, drop a comment below.
\`\`\`

Tell me the platform and audience if you'd like a tighter rewrite.`,
    };
  }

  // WhatsApp / general outreach draft
  const topicHint = raw.replace(/\b(draft|write|create|make|a|an|for|me|whatsapp|message|pls|please|likho)\b/gi, '').trim();
  const focus = topicHint.length > 4 ? topicHint : '[your service / offer]';

  return {
    text: hinglish
      ? `Yeh raha ek friendly, clear WhatsApp message draft:

\`\`\`text
Hi [Name], [Your Name] here from [Business Name].

Main aapko ${focus} ke baare mein message kar raha tha — hum businesses ko fast websites aur 24/7 WhatsApp/AI automation setup karne mein help karte hain taaki koi lead miss na ho.

Kya main 2-minute ka demo ya quick details share karoon?
\`\`\`

Details doge toh aur natural adjust kar dunga.`
      : `Here's a short WhatsApp/DM draft ready to send:

\`\`\`text
Hi [Name], this is [Your Name] from [Business Name].

I wanted to share a quick idea around ${focus} that could save your team manual follow-up time and capture leads 24/7.

Would you like a 2-minute overview or a quick call this week?
\`\`\`

Give me the recipient's business type and I'll sharpen it.`,
  };
}

function buildPlanReply(lower: string, hinglish: boolean): NikReply | null {
  if (!/\b(plan|steps|roadmap|break down|breakdown|how to start|shuru|kaise karein|strategy|launch)\b/.test(lower)) {
    return null;
  }

  return {
    text: hinglish
      ? `Kisi bhi digital/AI project ko launch karne ka sabse practical 4-step plan:

1. **Goal lock karo (Day 1–2):** Sirf 1 main outcome choose karo (jaise missed calls rokna, online booking, ya billing automate karna).
2. **Simple prototype (Week 1):** Pehle core flow aur clean UI design approve karo — extra features baad mein.
3. **Build & Test (Week 2–3):** Real WhatsApp/payment/data ke saath test karo aur weekly preview dekho.
4. **Launch & Handover:** Live deploy, team training, aur complete code/account access.

Aapka exact project kya hai? Batao toh main custom checklist bana dunga.`
      : `Here's a practical 4-step way to take a software or automation project from idea to live:

1. **Lock one core goal (Days 1–2):** Pick the single highest-value problem first (e.g., instant lead replies, online booking, or internal billing).
2. **Design & approve flow (Week 1):** Map the screens, messages, and data fields before writing full backend code.
3. **Build in weekly milestones (Weeks 2–3):** Ship the core workflow with real integrations (WhatsApp, Razorpay, Calendar) and test early.
4. **Launch & train:** Go live with monitoring, analytics, and team handover.

Tell me what you're building and I'll break down Week 1 tasks specifically for you.`,
    actions: [
      {
        type: 'inquire',
        label: 'Plan This With Nikneuron',
        serviceId: 'custom-software',
        brief: 'Looking to break down scope and timeline for my project.',
      },
    ],
  };
}

function buildCodeReply(lower: string, hinglish: boolean): NikReply | null {
  if (!/\b(code|snippet|script|function|bug|debug|error|react|typescript|javascript|python|api|webhook|whatsapp link|wa\.me|validation)\b/.test(lower)) {
    return null;
  }

  if (/\b(wa\.me|whatsapp)\b/.test(lower)) {
    return {
      text: `${hinglish ? 'Yeh complete working TypeScript/JS helper hai prefilled WhatsApp link ke liye:' : 'Here is a clean, working TypeScript/JS helper to generate a prefilled WhatsApp link:'}

\`\`\`ts
export function buildWhatsAppLink(phoneWithCountryCode: string, message: string): string {
  const digits = phoneWithCountryCode.replace(/\\D/g, '');
  return \`https://wa.me/\${digits}?text=\${encodeURIComponent(message.trim())}\`;
}

// Example:
const url = buildWhatsAppLink('+91 9258032799', 'Hi Nikneuron, I want a demo!');
\`\`\``,
    };
  }

  if (/\b(phone|mobile|10-digit|form|validation|regex)\b/.test(lower)) {
    return {
      text: `${hinglish ? 'Indian 10-digit WhatsApp/phone validation ke liye working React + TypeScript snippet:' : 'Here is a complete Indian 10-digit phone validation helper for React/TypeScript:'}

\`\`\`ts
export function validateIndianPhone(input: string): { valid: boolean; cleaned: string; error?: string } {
  const digits = input.replace(/\\D/g, '').replace(/^91(?=[6-9]\\d{9}$)/, '');
  if (!/^[6-9]\\d{9}$/.test(digits)) {
    return { valid: false, cleaned: digits, error: 'Enter a valid 10-digit mobile number.' };
  }
  return { valid: true, cleaned: digits };
}
\`\`\``,
    };
  }

  return {
    text: hinglish
      ? `Sure — main working code likhne aur bugs fix karne mein help kar sakta hoon.

Apna error message ya code snippet paste karo aur batao:
1. Language/framework kya hai (React, Python, Node, Flutter)?
2. Expected output kya chahiye?`
      : `Happy to help write or debug code. Paste the snippet or exact error message and tell me what behavior you expect, and I'll give you a complete working fix.`,
  };
}

function buildConceptReply(lower: string, hinglish: boolean): NikReply | null {
  if (/\b(difference|vs|what is|explain|how does|ai receptionist|rag|webhook|n8n|zapier|crm|seo)\b/.test(lower)) {
    if (/\b(ai receptionist|chatbot)\b/.test(lower)) {
      return {
        text: hinglish
          ? `**Normal chatbot** sirf basic buttons ya fixed FAQ dikhata hai.
**AI Receptionist** aapke business ke baare mein trained hota hai — yeh 24/7 calls aur WhatsApp/chat handle karta hai, Hindi/Hinglish samajhta hai, calendar check karke appointment book karta hai, aur owner ko call summary bhejta hai.`
          : `A **basic chatbot** only follows rigid button menus. An **AI Receptionist** understands natural questions in English, Hindi, or Hinglish, answers 24/7 on voice/chat, syncs appointments straight to your calendar, and sends call summaries to the owner.`,
      };
    }

    if (/\b(n8n|zapier|make|automation|workflow)\b/.test(lower)) {
      return {
        text: hinglish
          ? `**Workflow automation (n8n, Zapier, Make)** alag-alag apps ko aapas mein jodta hai bina manual copy-paste ke.

Example: Jab koi website form bhare -> data automatically Google Sheet/CRM mein jaaye -> customer ko WhatsApp welcome message mile -> aur team ko alert aa jaaye.`
          : `**Workflow automation (n8n, Zapier, Make)** connects your existing tools so repetitive work runs automatically.

For example: a new website lead automatically updates your Google Sheet or CRM, triggers a WhatsApp reply, and notifies your team—zero manual copy-paste.`,
      };
    }

    if (/\b(crm)\b/.test(lower)) {
      return {
        text: hinglish
          ? `**CRM (Customer Relationship Management)** ek system hai jahan har lead, follow-up date, WhatsApp status, aur payment ek jagah track hoti hai — taaki Excel sheets mein leads khona band ho jaaye.`
          : `A **CRM** keeps every lead, call note, follow-up reminder, and deal stage in one organized dashboard instead of scattered spreadsheets or chats.`,
      };
    }
  }

  return null;
}

async function callExternalNikAPI(
  history: NikMessage[],
  userText: string
): Promise<NikReply | null> {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const endpoint = metaEnv?.VITE_NIK_API_URL;
  const geminiKey = metaEnv?.VITE_GEMINI_API_KEY;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `${NIK_SYSTEM_PROMPT}\n\n${NIK_SITE_CONTEXT}`,
          messages: [
            ...history.map((m) => ({ role: m.role, content: m.text })),
            { role: 'user', content: userText },
          ],
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply?: string; text?: string };
        const text = (data.reply || data.text || '').trim();
        if (text) return { text };
      }
    } catch {
      // Fall back cleanly to built-in Nik assistant
    }
  }

  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        geminiKey
      )}`;
      const contents = [
        ...history.slice(-8).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }],
        })),
        { role: 'user', parts: [{ text: userText }] },
      ];
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: `${NIK_SYSTEM_PROMPT}\n\n${NIK_SITE_CONTEXT}` }],
          },
          contents,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 500,
          },
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return { text };
      }
    } catch {
      // Fall back cleanly to built-in Nik assistant
    }
  }

  return null;
}

export async function generateNikReply(
  history: NikMessage[],
  rawInput: string
): Promise<NikReply> {
  const input = rawInput.trim();
  const lower = input.toLowerCase();
  const hinglish = detectHinglish(input);

  // 1. Optional live backend / Gemini key if configured in .env
  const liveReply = await callExternalNikAPI(history, input);
  if (liveReply) return liveReply;

  // 2. Safety & honest tool-boundary limits
  if (isUnsafeRequest(lower)) {
    return {
      text: hinglish
        ? 'Main kisi bhi illegal ya harmful kaam mein help nahi kar sakta, lekin main safe software, security best practices, ya automation plan karne mein madad kar sakta hoon.'
        : "I can't help with anything illegal or harmful, but I can help you design secure software, write clean code, or plan safe workflows instead.",
    };
  }

  if (asksToBrowseOrRunCode(lower)) {
    return {
      text: hinglish
        ? 'Abhi mere paas live web browse karne ya code run karke test karne ka tool nahi hai, isliye main uska jhootha claim nahi karunga. Lekin agar aap code ya page text yahan paste karo, toh main usko review, debug, ya improve zaroor kar sakta hoon.'
        : "I can't browse the live web or execute code in this browser widget, so I won't pretend I did. If you paste the code or text here, I can debug, rewrite, or break it down for you.",
    };
  }

  // 3. Greetings
  if (/^(hi|hello|hey|hii+|namaste|hola|good morning|good evening|kya haal|kaise ho)[!.,?\s]*$/i.test(input)) {
    return {
      text: hinglish
        ? 'Hey! Main Nik hoon — aapka practical assistant. Bataiye aaj kya done karna hai: Nikneuron service chahiye, message draft karna hai, code help, ya project plan?'
        : "Hey! I'm Nik — ready to help you get things done. Want help choosing a Nikneuron service, drafting a message, debugging code, or planning next steps?",
    };
  }

  // 4. Core capabilities aligned with Nik's persona
  const draft = buildDraftReply(input, lower, hinglish);
  if (draft) return draft;

  // 5. Intelligent Knowledge Base Retrieval (Services, Bundles, Projects, Process, Engagement, FAQs, Code Recipes)
  const kbMatches = searchKnowledgeBase(input, 1);
  if (kbMatches.length > 0) {
    const match = kbMatches[0];
    return {
      text: hinglish ? match.detailsHi : match.detailsEn,
      actions: match.actions,
    };
  }

  const concept = buildConceptReply(lower, hinglish);
  if (concept) return concept;

  const serviceMatch = buildServiceMatchReply(lower, hinglish);
  if (serviceMatch) return serviceMatch;

  const code = buildCodeReply(lower, hinglish);
  if (code) return code;

  const plan = buildPlanReply(lower, hinglish);
  if (plan) return plan;

  // 5. Contact / founder / human handoff questions
  if (/\b(contact|call|whatsapp|phone|email|founder|aditya|talk to human|book|demo)\b/.test(lower)) {
    return {
      text: hinglish
        ? `Aap seedha **${SITE_CONFIG.founder.name}** se ${SITE_CONFIG.contact.whatsappNumber} (WhatsApp) ya **${SITE_CONFIG.contact.email}** par connect kar sakte hain. Reply time ${SITE_CONFIG.contact.replyTimeCommitment} hai.`
        : `You can reach **${SITE_CONFIG.founder.name}** directly on WhatsApp (${SITE_CONFIG.contact.whatsappNumber}) or via email at **${SITE_CONFIG.contact.email}**. Typical reply time is ${SITE_CONFIG.contact.replyTimeCommitment}.`,
      actions: [
        {
          type: 'inquire',
          label: 'Open Inquiry Form',
          serviceId: 'ai-receptionist',
          brief: 'Would like to schedule a quick call or demo.',
        },
        { type: 'whatsapp', label: 'Message on WhatsApp' },
      ],
    };
  }

  // 6. Honest clarifying response when intent is ambiguous
  return {
    text: hinglish
      ? 'Main poori tarah sure nahi hoon ki aapko kis cheez mein help chahiye. Ek line mein bataiye — kya aap **business ke liye Nikneuron service** dekh rahe hain, koi **message/email draft** karna hai, **code/bug** fix karna hai, ya **project plan** banana hai?'
      : "I want to give you a direct answer, so quick check: are you looking to **pick a Nikneuron service**, **draft an email/message**, **write or debug code**, or **break a project into steps**?",
    actions: [
      { type: 'scroll_services', label: 'Explore Services' },
      { type: 'whatsapp', label: 'Ask Team on WhatsApp' },
    ],
  };
}

