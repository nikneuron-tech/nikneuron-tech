import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Send,
  X,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Mic,
  MicOff,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  PhoneCall,
  Flame,
  Stethoscope,
  Briefcase,
  Cpu,
  Code2,
  User,
  ShieldCheck,
} from 'lucide-react';
import {
  generateNikReply,
  NikAction,
  NikMessage,
} from '../../services/nikChatService';
import { useAppStore } from '../../store/useAppStore';
import { SITE_CONFIG } from '../../config/site.config';
import { soundEngine } from '../ui/audio';

interface CategoryTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  prompts: string[];
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    id: 'popular',
    label: 'Popular',
    icon: Flame,
    prompts: [
      'What services do you offer?',
      'Explain AI Receptionist vs Chatbot',
      'What are your cloud hosting costs?',
      'Hinglish mein samjhao',
    ],
  },
  {
    id: 'verticals',
    label: 'Verticals',
    icon: Stethoscope,
    prompts: [
      'Healthcare clinic automation',
      'Mountain resort WhatsApp concierge',
      'Real estate lead qualification bot',
      'D2C abandoned cart recovery',
      'Coaching institute admission bot',
    ],
  },
  {
    id: 'pricing',
    label: 'Bundles & Pricing',
    icon: Briefcase,
    prompts: [
      'Show 3 turnkey bundle packages',
      'Growth Bundle scope & timeline',
      'Pilot Sprint engagement model',
      'Post-launch 30-day warranty policy',
    ],
  },
  {
    id: 'tech',
    label: 'Tech & AI',
    icon: Cpu,
    prompts: [
      'Hybrid RAG (BM25 + pgvector)',
      'Sub-600ms voice agent architecture',
      'Meta WhatsApp Cloud API guide',
      'Sub-second Core Web Vitals strategy',
      'Indian DPDP Act 2023 compliance',
    ],
  },
  {
    id: 'code',
    label: 'Code Recipes',
    icon: Code2,
    prompts: [
      'Show WhatsApp Cloud API code snippet',
      'Razorpay webhook signature verification',
      'In-memory sliding window rate limiter',
      'Indian 10-digit phone validator code',
    ],
  },
];

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_MESSAGE: NikMessage = {
  id: 'nik-welcome',
  role: 'assistant',
  text: `Hey! I'm **Nik** — your friendly, practical engineering assistant.

I can help you:
- Pick the right Nikneuron service or turnkey bundle
- Explore industry setups (Clinics, Mountain Resorts, Real Estate, D2C)
- Understand our technical architecture (Hybrid RAG, Voice AI, Web Vitals)
- Draft emails, social posts, or inspect production code snippets

Ask me anything in English or Hinglish!`,
  time: 'Now',
};

function parseFormattedInline(text: string): React.ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-electric font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const label = part.slice(1, part.indexOf(']('));
      const url = part.slice(part.indexOf('](') + 2, -1);
      return (
        <a
          key={idx}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-electric underline underline-offset-2 hover:text-white transition-colors inline-flex items-center gap-0.5"
        >
          <span>{label}</span>
          <ExternalLink className="w-2.5 h-2.5 inline" />
        </a>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

const CodeBlock: React.FC<{ code: string; lang: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="my-2.5 rounded-xl overflow-hidden border border-white/15 bg-black/70 shadow-inner">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/10 text-[10px] font-mono text-text-dim">
        <span className="uppercase tracking-wider text-cyan-electric/90 font-bold flex items-center gap-1.5">
          <Code2 className="w-3 h-3 text-cyan-electric" />
          {lang || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-cyan-electric hover:text-white transition-colors cursor-pointer"
          aria-label="Copy code snippet"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 text-xs font-mono text-cyan-100 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed select-all">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const MarkdownTable: React.FC<{ lines: string[] }> = ({ lines }) => {
  if (lines.length < 2) return null;
  const headerLine = lines[0];
  const rowLines = lines.slice(2);

  const headers = headerLine
    .split('|')
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const rows = rowLines.map((row) =>
    row
      .split('|')
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
  );

  return (
    <div className="my-2.5 overflow-x-auto rounded-xl border border-white/15 bg-black/50">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-white/10 text-cyan-electric font-mono text-[11px] border-b border-white/10">
            {headers.map((h, idx) => (
              <th key={idx} className="p-2 font-semibold">
                {parseFormattedInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-2 text-text-secondary">
                  {parseFormattedInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MessageBody: React.FC<{ text: string }> = ({ text }) => {
  const segments = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed">
      {segments.map((segment, i) => {
        if (segment.startsWith('```') && segment.endsWith('```')) {
          const inner = segment.slice(3, -3);
          const firstNewline = inner.indexOf('\n');
          const lang = firstNewline !== -1 ? inner.slice(0, firstNewline).trim() : '';
          const code = firstNewline !== -1 ? inner.slice(firstNewline + 1).trim() : inner.trim();
          return <CodeBlock key={i} code={code} lang={lang} />;
        }

        const rawLines = segment.split('\n');
        const elements: React.ReactNode[] = [];
        let tableBuffer: string[] = [];

        const flushTable = () => {
          if (tableBuffer.length >= 2) {
            elements.push(<MarkdownTable key={`tbl-${elements.length}`} lines={[...tableBuffer]} />);
          }
          tableBuffer = [];
        };

        for (let j = 0; j < rawLines.length; j++) {
          const line = rawLines[j];
          const trimmed = line.trim();

          // Table line detection
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            tableBuffer.push(trimmed);
            continue;
          } else if (tableBuffer.length > 0) {
            flushTable();
          }

          if (!trimmed) {
            elements.push(<div key={`sp-${j}`} className="h-1" />);
            continue;
          }

          // Blockquote callout
          if (line.startsWith('> ')) {
            elements.push(
              <div
                key={`bq-${j}`}
                className="border-l-2 border-cyan-electric pl-3 py-1.5 my-1.5 rounded-r-lg bg-cyan-electric/[0.08] text-cyan-100 text-xs italic"
              >
                {parseFormattedInline(line.slice(2))}
              </div>
            );
            continue;
          }

          // Bullet item
          if (line.startsWith('- ') || line.startsWith('* ')) {
            elements.push(
              <div key={`li-${j}`} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric mt-1.5 shrink-0 shadow-cyan-glow" />
                <span className="flex-1 whitespace-pre-wrap break-words">
                  {parseFormattedInline(line.slice(2))}
                </span>
              </div>
            );
            continue;
          }

          // Numbered item
          const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            elements.push(
              <div key={`num-${j}`} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-[11px] font-mono font-bold text-cyan-electric shrink-0 mt-0.5">
                  {numMatch[1]}.
                </span>
                <span className="flex-1 whitespace-pre-wrap break-words">
                  {parseFormattedInline(numMatch[2])}
                </span>
              </div>
            );
            continue;
          }

          // Standard paragraph
          elements.push(
            <p key={`p-${j}`} className="whitespace-pre-wrap break-words">
              {parseFormattedInline(line)}
            </p>
          );
        }

        if (tableBuffer.length > 0) {
          flushTable();
        }

        return <div key={i} className="space-y-1">{elements}</div>;
      })}
    </div>
  );
};

export const NikChatbot: React.FC = () => {
  const {
    startInquiry,
    setActiveFace,
    setViewMode,
    viewMode,
    setSelectedProjectId,
    isMuted,
    toggleMute,
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');
  const [messages, setMessages] = useState<NikMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});
  const [showQuickLead, setShowQuickLead] = useState(false);
  const [leadContact, setLeadContact] = useState('');
  const [leadNote, setLeadNote] = useState('');
  const [leadSent, setLeadSent] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const listEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechRef = useRef<any>(null);

  // Text-To-Speech for Nik replies
  const handleSpeakMessage = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*_#`[\]()]/g, '')
        .replace(/https?:\/\/\S+/g, 'link');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const selectedVoice =
        voices.find((v) => v.lang.includes('en-IN') || v.name.includes('India')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setSpeakingMsgId(msgId);
        soundEngine.playTone(720, 0.05);
      };
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);

      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeakingMsgId(null);
    }
  };

  // Auto-show teaser invite pill after 3.5s
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!isOpen) {
        setShowTeaser(true);
      }
    }, 3500);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const t = window.setTimeout(() => inputRef.current?.focus(), 100);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, messages, isTyping, showQuickLead]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleAction = (action: NikAction) => {
    soundEngine.playTone(720, 0.08);
    if (action.type === 'inquire') {
      startInquiry({
        serviceType: action.serviceId || 'ai-receptionist',
        brief: action.brief || '',
      });
      setIsOpen(false);
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action.type === 'inspect_face' && typeof action.faceIndex === 'number') {
      if (viewMode === 'list') setViewMode('cube');
      setActiveFace(action.faceIndex);
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'scroll_services') {
      setIsOpen(false);
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action.type === 'open_project') {
      setIsOpen(false);
      if (action.projectId) {
        setSelectedProjectId(action.projectId);
      } else {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action.type === 'whatsapp') {
      window.open(SITE_CONFIG.contact.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(msgId);
      soundEngine.playTone(880, 0.06);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Ignore
    }
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    soundEngine.playTone(type === 'up' ? 760 : 420, 0.08);
    setFeedbackState((prev) => ({ ...prev, [msgId]: type }));
  };

  const handleDownloadTranscript = () => {
    soundEngine.playTone(600, 0.08);
    const header = `# Nikneuron AI Chat Transcript\nExported: ${new Date().toLocaleString()}\nFounder: ${SITE_CONFIG.founder.name} (${SITE_CONFIG.contact.email} | WhatsApp: ${SITE_CONFIG.contact.phone})\nStudio: Almora, Uttarakhand & Remote\n\n---\n\n`;
    const transcript = messages
      .map(
        (m) =>
          `### ${m.role === 'user' ? '👤 You' : '🤖 Nik'} [${m.time}]\n\n${m.text}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([header + transcript], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nikneuron-chat-notes-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation is supported in Chrome, Edge, and modern browsers.');
      return;
    }

    if (isListening && speechRef.current) {
      speechRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        soundEngine.playTone(800, 0.08);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        soundEngine.playTone(500, 0.06);
      };

      speechRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleQuickLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadContact.trim()) return;

    soundEngine.playTone(880, 0.12);
    startInquiry({
      serviceType: 'ai-receptionist',
      brief: `Quick In-Chat Lead: Contact: ${leadContact.trim()} | Note: ${leadNote.trim() || 'No specific note'}`,
    });

    setLeadSent(true);
    setTimeout(() => {
      setShowQuickLead(false);
      setLeadSent(false);
      setLeadContact('');
      setLeadNote('');

      // Add confirmation reply in chat
      setMessages((prev) => [
        ...prev,
        {
          id: `lead-ack-${Date.now()}`,
          role: 'assistant',
          text: `✅ **Direct Handshake Sent!**\n\nAditya Tamta has received your note for \`${leadContact.trim()}\`. You are guaranteed a personal reply within 24 hours.\n\nNeed faster assistance? Reach us right now on WhatsApp (+91 9258032799).`,
          time: nowTime(),
          actions: [{ type: 'whatsapp', label: 'Chat on WhatsApp' }],
        },
      ]);
    }, 1200);
  };

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isTyping) return;

    soundEngine.playTone(680, 0.07);
    const userMsg: NikMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: nowTime(),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await generateNikReply(nextHistory, trimmed);
      soundEngine.playTone(840, 0.08);
      setMessages((prev) => [
        ...prev,
        {
          id: `n-${Date.now()}`,
          role: 'assistant',
          text: reply.text,
          time: nowTime(),
          actions: reply.actions,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `n-err-${Date.now()}`,
          role: 'assistant',
          text: "Something got interrupted. If this persists, send a quick message directly on WhatsApp (+91 9258032799) and we'll reply right away.",
          time: nowTime(),
          actions: [{ type: 'whatsapp', label: 'Message on WhatsApp' }],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    soundEngine.playTone(540, 0.08);
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `nik-reset-${Date.now()}`,
        time: nowTime(),
      },
    ]);
  };

  const activeCategory =
    CATEGORY_TABS.find((t) => t.id === activeTab) || CATEGORY_TABS[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 select-none">
      {/* Floating Teaser Greeting Bubble when chat is closed */}
      {!isOpen && showTeaser && (
        <aside
          aria-label="Nik invite"
          className="relative max-w-[280px] p-3 rounded-2xl bg-void-deep/95 border border-cyan-electric/50 shadow-glass backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-start gap-2.5 text-left"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-electric to-blue-electric flex items-center justify-center text-void shrink-0 mt-0.5 shadow-cyan-glow">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => setIsOpen(true)}>
            <p className="text-xs font-semibold text-white leading-snug">
              Have a question?
            </p>
            <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
              Ask Nik about services, pricing, or tech in English/Hinglish.
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
            title="Dismiss teaser"
            className="text-text-dim hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-void-deep rotate-45 border-r border-b border-cyan-electric/50" />
        </aside>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <section
          aria-label="Chat with Nik"
          className={`flex flex-col rounded-3xl bg-void-deep/95 border border-cyan-electric/45 shadow-glass backdrop-blur-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            isMaximized
              ? 'w-[calc(100vw-2rem)] sm:w-[720px] h-[780px] max-h-[92vh]'
              : 'w-[calc(100vw-2rem)] sm:w-[430px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Futuristic Cybernetic Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-void-surface/90 via-cyan-electric/[0.04] to-void-surface/90">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-electric/30 via-blue-electric/20 to-void border border-cyan-electric/50 flex items-center justify-center text-cyan-electric shadow-cyan-glow">
                <Bot className="w-5 h-5 animate-pulse" aria-hidden="true" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-void-deep flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-100 animate-ping" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-display text-sm font-bold text-white tracking-wide leading-tight">
                    Nik
                  </h2>
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-electric/15 border border-cyan-electric/35 text-[9px] font-mono text-cyan-electric flex items-center gap-0.5 font-bold">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI Core
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary leading-tight mt-0.5 flex items-center gap-1">
                  <span>Almora Studio</span>
                  <span>·</span>
                  <span className="text-emerald-400">Online</span>
                  <span>·</span>
                  <span className="text-text-dim">&lt;24h reply</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(640, 0.08);
                  setShowQuickLead((prev) => !prev);
                }}
                title={showQuickLead ? 'Close Quick Contact' : 'Direct Contact with Founder'}
                aria-label="Direct Contact Form"
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  showQuickLead
                    ? 'bg-cyan-electric text-void border-cyan-electric'
                    : 'text-text-secondary hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-electric" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(isMaximized ? 560 : 780, 0.08);
                  setIsMaximized((prev) => !prev);
                }}
                title={isMaximized ? 'Restore standard size' : 'Expand full view'}
                aria-label="Toggle window size"
                className="hidden sm:inline-flex p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isMaximized ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadTranscript}
                title="Download chat notes (.md)"
                aria-label="Download chat notes"
                className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat with Nik"
                className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Inline Quick Lead Capture Drawer */}
          {showQuickLead && (
            <div className="p-3.5 border-b border-cyan-electric/30 bg-gradient-to-br from-cyan-electric/[0.12] to-void-surface/90 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-electric" />
                  Direct Handshake with Founder Aditya Tamta
                </span>
                <span className="text-[10px] text-cyan-electric font-mono">
                  &lt;24h guaranteed reply
                </span>
              </div>
              <form onSubmit={handleQuickLeadSubmit} className="space-y-2">
                <input
                  type="text"
                  required
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                  placeholder="Your WhatsApp number or Email address"
                  className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder:text-text-dim focus:border-cyan-electric focus:outline-none"
                />
                <input
                  type="text"
                  value={leadNote}
                  onChange={(e) => setLeadNote(e.target.value)}
                  placeholder="What would you like to build? (Optional)"
                  className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder:text-text-dim focus:border-cyan-electric focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowQuickLead(false)}
                    className="px-2.5 py-1 text-xs text-text-dim hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!leadContact.trim() || leadSent}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-electric to-blue-electric text-void font-bold text-xs hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer shadow-cyan-glow flex items-center gap-1"
                  >
                    {leadSent ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{leadSent ? 'Sent to Aditya!' : 'Send Directly'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Interactive Exploration Tabs Bar */}
          <nav
            aria-label="Prompt categories"
            className="px-3 py-2 border-b border-white/5 bg-black/30 flex items-center gap-1 overflow-x-auto no-scrollbar"
          >
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playTone(600, 0.05);
                    setActiveTab(tab.id);
                  }}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-electric/20 border border-cyan-electric/50 text-cyan-electric shadow-cyan-glow'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Tab Prompt Pills */}
          <div className="px-3 py-1.5 border-b border-white/5 bg-void-surface/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {activeCategory.prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] hover:border-cyan-electric/50 hover:bg-cyan-electric/10 hover:text-white text-[11px] text-text-secondary transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isCopied = copiedId === msg.id;
              const feedback = feedbackState[msg.id];

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 group ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs mt-1 ${
                      isUser
                        ? 'bg-blue-electric/25 border border-blue-electric/40 text-blue-300'
                        : 'bg-cyan-electric/20 border border-cyan-electric/40 text-cyan-electric shadow-cyan-glow'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={`flex flex-col max-w-[85%] sm:max-w-[82%] ${
                      isUser ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="relative group/bubble">
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isUser
                            ? 'bg-gradient-to-r from-cyan-electric to-blue-electric text-void font-medium rounded-tr-sm shadow-md'
                            : 'bg-white/[0.06] border border-white/10 text-text-secondary rounded-tl-sm shadow-sm'
                        }`}
                      >
                        {isUser ? (
                          <p className="text-xs sm:text-[13px] whitespace-pre-wrap break-words leading-relaxed">
                            {msg.text}
                          </p>
                        ) : (
                          <MessageBody text={msg.text} />
                        )}
                      </div>

                      {/* Floating actions beside bubble: Speak & Copy */}
                      <div
                        className={`absolute top-2 ${
                          isUser ? '-left-16' : '-right-16'
                        } opacity-0 group-hover/bubble:opacity-100 flex items-center gap-1 transition-all`}
                      >
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            title={speakingMsgId === msg.id ? 'Stop speaking' : 'Listen to Nik'}
                            aria-label="Listen to message"
                            className={`p-1.5 rounded-lg bg-void-surface border transition-all cursor-pointer shadow ${
                              speakingMsgId === msg.id
                                ? 'bg-cyan-electric/25 border-cyan-electric text-cyan-electric animate-pulse'
                                : 'border-white/15 text-text-dim hover:text-cyan-electric'
                            }`}
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX className="w-3 h-3 text-cyan-electric" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          title="Copy message"
                          aria-label="Copy message text"
                          className="p-1.5 rounded-lg bg-void-surface border border-white/15 text-text-dim hover:text-cyan-electric transition-all cursor-pointer shadow"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Action Chips on assistant replies */}
                    {!isUser && msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-full">
                        {msg.actions.map((action, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAction(action)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-electric/40 bg-cyan-electric/10 hover:bg-cyan-electric/25 text-[11px] font-semibold text-cyan-electric transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <span>{action.label}</span>
                            {action.type === 'whatsapp' ? (
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            ) : (
                              <ArrowRight className="w-3 h-3" aria-hidden="true" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Footer bar below message: Time + Feedback */}
                    <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-text-dim">
                      <span>{msg.time}</span>
                      {!isUser && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, 'up')}
                              title="Helpful"
                              aria-label="Mark helpful"
                              className={`hover:text-cyan-electric cursor-pointer ${
                                feedback === 'up' ? 'text-cyan-electric' : ''
                              }`}
                            >
                              <ThumbsUp className="w-2.5 h-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, 'down')}
                              title="Not helpful"
                              aria-label="Mark not helpful"
                              className={`hover:text-rose-400 cursor-pointer ${
                                feedback === 'down' ? 'text-rose-400' : ''
                              }`}
                            >
                              <ThumbsDown className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Futuristic Thinking / Telemetry Pulse */}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-cyan-electric/20 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric shadow-cyan-glow">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/10 text-xs text-cyan-electric flex items-center gap-2 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-bounce [animation-delay:240ms]" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-200/80">
                    Nik is formulating response...
                  </span>
                </div>
              </div>
            )}

            <div ref={listEndRef} />
          </div>

          {/* Input & Voice Controls Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 p-3 border-t border-white/10 bg-void-surface/90"
          >
            {/* Input with Voice Equalizer */}
            <div className="relative flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening in Hindi or English... speak now'
                    : 'Ask Nik in English or Hinglish...'
                }
                aria-label="Message Nik"
                className={`w-full min-h-[42px] pl-3.5 pr-10 py-2 rounded-xl text-xs sm:text-sm text-white placeholder:text-text-dim transition-all ${
                  isListening
                    ? 'bg-rose-500/15 border border-rose-400 text-rose-100 placeholder:text-rose-200 shadow-md'
                    : 'bg-white/[0.05] border border-white/15 focus:border-cyan-electric/60 focus:outline-none'
                }`}
              />

              {/* Live Audio Equalizer Wave when voice listening */}
              {isListening && (
                <div className="absolute right-3 flex items-center gap-0.5 pointer-events-none">
                  <span className="w-1 h-3 bg-rose-400 rounded-full animate-pulse" />
                  <span className="w-1 h-5 bg-rose-400 rounded-full animate-bounce" />
                  <span className="w-1 h-2 bg-rose-400 rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-rose-400 rounded-full animate-bounce [animation-delay:100ms]" />
                </div>
              )}
            </div>

            {/* Voice Dictation (Microphone) */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Voice Dictation (Speech-to-text)'}
              aria-label={isListening ? 'Stop voice dictation' : 'Start voice dictation'}
              className={`min-h-[42px] min-w-[42px] rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-md'
                  : 'bg-white/[0.06] border-white/15 text-text-secondary hover:text-white hover:border-cyan-electric/50'
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="min-h-[42px] min-w-[42px] px-3.5 rounded-xl bg-gradient-to-r from-cyan-electric to-blue-electric text-void font-bold flex items-center justify-center disabled:opacity-30 hover:opacity-95 transition-all cursor-pointer shadow-cyan-glow active:scale-95"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => {
          soundEngine.playTone(isOpen ? 520 : 760, 0.08);
          setIsOpen((prev) => !prev);
        }}
        aria-label={isOpen ? 'Close chat with Nik' : 'Chat with Nik'}
        aria-expanded={isOpen}
        className="group relative flex items-center gap-3 pl-3.5 pr-4 py-3 rounded-full bg-void-deep/95 border border-cyan-electric/50 shadow-neon-cyan backdrop-blur-xl text-white hover:border-cyan-electric hover:shadow-cyan-glow transition-all active:scale-95 cursor-pointer"
      >
        <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-electric to-blue-electric text-void shadow-cyan-glow">
          {isOpen ? (
            <X className="w-4 h-4" aria-hidden="true" />
          ) : (
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
          )}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-void-deep animate-pulse" />
          )}
        </span>
        <div className="text-left leading-tight">
          <span className="block font-display text-xs font-bold text-white tracking-wide">
            {isOpen ? 'Close Nik' : 'Ask Nik'}
          </span>
          {!isOpen && (
            <span className="block text-[10px] text-cyan-electric flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              AI Assistant
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default NikChatbot;
