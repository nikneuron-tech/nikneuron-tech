# Chatbot Nik — Advanced Knowledge Base & Interactive AI Architecture

Nik is the AI assistant built for Nikneuron. He is friendly, practical, and designed to help visitors get things done with zero fluff.

This document describes the structured knowledge base powering Nik's dual-engine architecture:
1. **Client-Side Instant Retrieval Engine** (`src/services/nikChatService.ts` via `searchKnowledgeBase`)
2. **Live LLM Context Injection** (`src/config/nikPrompt.ts` via `compileKnowledgeBasePrompt()`)
3. **Advanced Interactive UI** (`src/components/chat/NikChatbot.tsx`) featuring voice speech-to-text, markdown rendering, chat transcript export, copy buttons, and audio feedback controls.

---

## 1. System & Retrieval Architecture

```
User Query (English / Hinglish / Voice)
            │
            ▼
    [1. Safety & Tool Limit Checks]
            │
            ▼
    [2. Interactive Draft Matcher] (Emails, Social Posts, WhatsApp Outbound)
            │
            ▼
    [3. searchKnowledgeBase() Engine]
            ├── Title & Keyword Matching (weighted score)
            ├── Stop-word Filtering (English & Hinglish)
            ├── Summary & Details Matching
            └── Score Threshold (> 8)
            │
            ├─ Match Found ──► Formatted Direct Answer (EN / HI) + Action Chips
            │
            ▼
    [4. Fallback Rule Generators] (Concepts, Services list, Code Snippets, Roadmap, Contact)
            │
            ▼
    [5. Honest Clarifying Prompt with Navigation Chips]
```

---

## 2. Knowledge Base Categories & Entries

All items are maintained in [`src/config/nikKnowledgeBase.ts`](../src/config/nikKnowledgeBase.ts) with full English and Hinglish explanations and contextual action chips.

### 2.1 Company & Founder
- **Overview & Philosophy**: Founder Aditya Tamta, Almora (Uttarakhand), remote delivery across India, motto *"Built, not promised"*.
- **The Almora Advantage**: Why operating from Almora, Uttarakhand provides deep Himalayan engineering focus, zero metropolitan overhead, and direct founder collaboration.
- **Contact Channels**: Direct WhatsApp (`+91 9258032799`), email (`adityatamta59@gmail.com`), guaranteed reply within 24 hours.

### 2.2 Core Vertical Services (All 8 Services)
1. **UI/UX Design Systems** (Design tokens, Figma specs, accessibility)
2. **Modern Web Development** (Vite, React 19, Tailwind, SEO, <1s load times)
3. **AI Receptionist & Voice Agents** (24/7 call & WhatsApp answering, natural Hindi/Hinglish understanding, calendar sync)
4. **WhatsApp Business Automation** (Automated catalog, booking flows, webhook reminders)
5. **Batch Mail & Transactional Systems** (DKIM/SPF compliance, transactional receipts)
6. **Custom Software & Web Apps** (Client portals, ERPs, internal billing dashboards)
7. **AI Workflow Automation** (n8n/Make pipeline integration, zero manual copy-paste)
8. **Growth Retainers & Support** (SLA bug fixes, performance audits, feature sprints)

### 2.3 Industry-Specific Vertical Playbooks
- **Healthcare, Clinics & Dental**: 24/7 voice/WhatsApp appointment booking, automated 24h/2h reminders reducing no-shows by 45%, and strict DPDP Act medical privacy.
- **Hospitality & Mountain Resorts**: WhatsApp concierge for boutique hotels and Uttarakhand homestays: pre-arrival weather/route guidance, check-in instructions, local tour upselling, and zero-OTA commission direct bookings.
- **Real Estate Developers**: 3-question buyer qualification (budget, 2BHK/3BHK, timeline), instant PDF brochure dispatch, and site visit calendar booking.
- **E-Commerce & D2C Brands**: Automated WhatsApp abandoned cart recovery (65%+ open rate), COD verification to reduce RTO by 35%, and self-service photo return requests.
- **Coaching Institutes & EdTech**: Course syllabus dispatch, batch timetable alerts, and automated polite fee payment reminders via UPI.

### 2.4 Modern AI & Telephony Architecture
- **Production RAG (Hybrid BM25 + pgvector)**: Preserving exact keywords with BM25 while capturing semantic intent with vector embeddings, plus semantic caching to cut token costs by up to 60%.
- **Sub-600ms Conversational Voice Telephony**: WebRTC full-duplex streaming with Deepgram Nova-2 STT, fast inference LLMs, and Cartesia/ElevenLabs TTS with barge-in support.
- **Multi-Agent Consensus & Strict Tool Calling**: Schema-validated JSON outputs via Pydantic/Zod with dual-agent verification before database mutations.

### 2.5 WhatsApp Platform Ecosystem
- **Official Meta WhatsApp Cloud API vs Unofficial Bots**: Zero phone number ban risk, 24-hour service conversation windows, interactive Quick-Reply and Call-to-Action buttons, and verified Green Tick eligibility.

### 2.6 Full-Stack Performance & Databases
- **Sub-Second Web Performance**: Sub-800ms LCP, INP < 100ms, zero layout shifts, Cloudflare edge caching, and GPU-optimized Three.js loops.
- **Database Selection Blueprint**: PostgreSQL (Supabase/Neon) for ACID transactions and vector storage, Redis for sliding-window rate limiters, and SQLite for edge apps.
- **Legacy Systems Modernization**: Connecting modern AI and WhatsApp to Tally ERP, Google Sheets, Excel, and on-premise MySQL without rebuilding existing software.
- **Security & DPDP Compliance**: Compliant with Indian DPDP Act 2023, AES-256 encryption at rest, secure HTTP-only JWTs, and full NDA protection.

### 2.7 Turnkey Bundles
- **Starter Bundle**: Web Dev + UI/UX Design System.
- **Growth Bundle** *(Most Popular)*: Web Dev + AI Receptionist + WhatsApp Automation.
- **Complete Suite**: Web Dev + AI Receptionist + WhatsApp + Custom Software + Retainer.

### 2.8 Verified Production Case Studies
- **The Conclusion**: AI verification pipeline with multi-agent consensus.
- **Next Opportunity Find**: Enterprise job matching platform with fast resume indexing.
- **FileCore**: Encrypted cloud storage engine with client-side chunked encryption.
- **Clarify**: RAG research assistant for multi-source knowledge synthesis.
- **ATM Entry Monitor**: Edge computer-vision model for real-time security telemetry.
- **AI Receptionist 3D Cube**: Interactive WebGL 3D showcase running at 60 FPS.

### 2.9 Production Code Recipes
- **WhatsApp Cloud API Sender**: Complete TypeScript helper dispatching template messages via Meta Cloud API using native `fetch`.
- **Razorpay Webhook Verification**: Node/TypeScript crypto snippet verifying payment signatures using `crypto.timingSafeEqual` and HMAC-SHA256.
- **Sliding-Window Rate Limiter**: Zero-dependency TypeScript sliding-window rate limiter for protecting API routes.
- **Reciprocal Rank Fusion (RRF)**: Python snippet for combining BM25 keyword rankings and vector similarity rankings.
- **Prefilled WhatsApp Link Generator**: TypeScript helper for `wa.me` links with proper URL encoding.
- **Indian 10-Digit Mobile Validator**: Strict regex validation stripping country codes and invalid prefixes.
- **FastAPI Webhook Receiver**: Asynchronous Python snippet verifying signatures and handling incoming events.

### 2.10 Commercial Policies & Infrastructure Transparency
- **Transparent Cloud Hosting Bills**: Breakdown of Vercel/Railway (\$0–\$20/mo), Supabase free/starter tier, and Meta WhatsApp per-conversation pricing (first 1,000 service conversations free).
- **Traffic Spike Resilience**: Cloudflare edge caching, PgBouncer database connection pooling, and stateless microservices scaling to 50,000+ concurrent visitors.
- **30-Day Bug Warranty & SLA**: 30-day zero-cost bug warranty on all production handovers, followed by optional monthly retainers with 4-hour SLA response times.

---

## 3. Advanced Chatbot UI Features

- **Voice Dictation (Speech-to-Text)**: Native Web Speech API integration (`SpeechRecognition` / `webkitSpeechRecognition`) supporting English and Hindi/Indian accents.
- **Markdown & Code Highlighting**: Full support for code blocks with 1-click copy, inline code pills, bold text, clickable external links, and structured bullet/numbered lists.
- **Transcript Export**: 1-click download of the complete formatted chat history in Markdown format (`.md`) for client recordkeeping.
- **Audio Feedback Toggle**: Seamless mute/unmute control synchronized with the site-wide sound engine.
- **Interactive Action Chips**:
  - `inquire`: Opens the contact form pre-filled with the service ID and brief.
  - `inspect_face`: Smoothly rotates the 3D Energy Cube to that service's face index.
  - `open_project`: Opens the detailed technical case study modal.
  - `scroll_services`: Scrolls the viewport down to the Services showcase.
  - `whatsapp`: Launches a direct WhatsApp chat with the founder.
