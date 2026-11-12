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
} from 'lucide-react';
import {
  generateNikReply,
  NikAction,
  NikMessage,
} from '../../services/nikChatService';
import { useAppStore } from '../../store/useAppStore';
import { SITE_CONFIG } from '../../config/site.config';
import { soundEngine } from '../ui/audio';

const QUICK_PROMPTS = [
  'What services do you offer?',
  'Draft a WhatsApp follow-up',
  'Plan a website + AI setup',
  'Hinglish mein samjhao',
];

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_MESSAGE: NikMessage = {
  id: 'nik-welcome',
  role: 'assistant',
  text: "Hey, I'm Nik — your friendly, practical assistant. Ask me about Nikneuron services, or tell me if you need a message drafted, code written, or a project broken into steps.",
  time: 'Now',
};

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
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
      // Ignore clipboard failure in restricted contexts
    }
  };

  return (
    <div className="my-2 rounded-xl overflow-hidden border border-white/15 bg-black/50">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/10 text-[10px] font-mono text-text-dim">
        <span>{lang || 'text'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-cyan-electric hover:text-white transition-colors cursor-pointer"
          aria-label="Copy snippet"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 text-xs font-mono text-cyan-100 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const MessageBody: React.FC<{ text: string }> = ({ text }) => {
  const segments = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
      {segments.map((segment, i) => {
        if (segment.startsWith('```') && segment.endsWith('```')) {
          const inner = segment.slice(3, -3);
          const firstNewline = inner.indexOf('\n');
          const lang = firstNewline !== -1 ? inner.slice(0, firstNewline).trim() : '';
          const code = firstNewline !== -1 ? inner.slice(firstNewline + 1).trim() : inner.trim();
          return <CodeBlock key={i} code={code} lang={lang} />;
        }

        const lines = segment.split('\n');
        return (
          <div key={i} className="space-y-1">
            {lines.map((line, j) => {
              if (!line.trim()) return <div key={j} className="h-1" />;
              return (
                <p key={j} className="whitespace-pre-wrap break-words">
                  {renderInlineBold(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const NikChatbot: React.FC = () => {
  const { startInquiry, setActiveFace, setViewMode, viewMode } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<NikMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const listEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const t = window.setTimeout(() => inputRef.current?.focus(), 100);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, messages, isTyping]);

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
    } else if (action.type === 'whatsapp') {
      window.open(SITE_CONFIG.contact.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
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

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Expandable Chat Window */}
      {isOpen && (
        <section
          aria-label="Chat with Nik"
          className="w-[calc(100vw-2rem)] sm:w-[395px] h-[520px] max-h-[82vh] flex flex-col rounded-2xl bg-void-deep/95 border border-cyan-electric/35 shadow-glass backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-electric/25 to-blue-electric/25 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric">
                <Bot className="w-5 h-5" aria-hidden="true" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-void-deep" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold text-white leading-tight">
                  Nik
                </h2>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Friendly, practical assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat with Nik"
                className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-electric to-blue-electric text-void font-medium rounded-br-sm'
                        : 'bg-white/[0.06] border border-white/10 text-text-secondary rounded-bl-sm'
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

                  {/* Quick action chips on assistant replies */}
                  {!isUser && msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAction(action)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-electric/35 bg-cyan-electric/10 hover:bg-cyan-electric/20 text-[11px] font-medium text-cyan-electric transition-colors cursor-pointer"
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

                  <span className="text-[10px] text-text-dim mt-1 px-1">
                    {isUser ? 'You' : 'Nik'} · {msg.time}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start">
                <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/10 text-xs text-cyan-electric flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-bounce [animation-delay:120ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            )}

            <div ref={listEndRef} />
          </div>

          {/* Starter chips when conversation is fresh */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="shrink-0 px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.04] hover:border-cyan-electric/45 hover:text-white text-[11px] text-text-secondary transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 p-3 border-t border-white/10 bg-void/80"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nik in English or Hinglish..."
              aria-label="Message Nik"
              className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-white/[0.05] border border-white/15 focus:border-cyan-electric/60 focus:outline-none text-xs sm:text-sm text-white placeholder:text-text-dim"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="min-h-[40px] min-w-[40px] px-3 rounded-xl bg-gradient-to-r from-cyan-electric to-blue-electric text-void font-bold flex items-center justify-center disabled:opacity-40 hover:opacity-95 transition-opacity cursor-pointer"
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
        className="group flex items-center gap-2.5 pl-3.5 pr-4 py-3 rounded-full bg-void-deep/95 border border-cyan-electric/45 shadow-neon-cyan backdrop-blur-xl text-white hover:border-cyan-electric transition-all active:scale-95 cursor-pointer"
      >
        <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-electric to-blue-electric text-void">
          {isOpen ? (
            <X className="w-4 h-4" aria-hidden="true" />
          ) : (
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
          )}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-void-deep" />
          )}
        </span>
        <div className="text-left leading-tight">
          <span className="block font-display text-xs font-bold text-white">
            {isOpen ? 'Close Nik' : 'Ask Nik'}
          </span>
          {!isOpen && (
            <span className="block text-[10px] text-cyan-electric">
              AI Assistant
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default NikChatbot;

