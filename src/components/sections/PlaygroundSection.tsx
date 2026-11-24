import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Hash,
  Bot,
  Sparkles,
  Upload,
  Copy,
  Check,
  RotateCcw,
  CalendarCheck,
  FileCheck2,
  ArrowRight,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { soundEngine } from '../ui/audio';
import { GradientSkewCard } from '../ui/gradient-card-showcase';

interface AgentVerdict {
  name: string;
  score: number;
  critique: string;
}

function evaluateStartupIdea(rawIdea: string): {
  summary: string;
  agents: AgentVerdict[];
} {
  const idea = rawIdea.trim();
  const lower = idea.toLowerCase();

  const isAI = /\b(ai|llm|agent|gpt|ml|vision|voice|copilot|rag|automation)\b/.test(lower);
  const isB2B = /\b(b2b|saas|enterprise|team|clinic|agency|workflow|crm|hr|compliance|devops)\b/.test(lower);
  const isHardware = /\b(drone|hardware|iot|camera|cctv|robot|sensor|wearable)\b/.test(lower);
  const isPrivacy = /\b(local|privacy|client|browser|offline|encrypt|zero|security)\b/.test(lower);

  const marketScore = Math.min(96, 68 + (isB2B ? 14 : 6) + (isAI ? 8 : 3) + (idea.length > 24 ? 5 : 0));
  const techScore = Math.min(97, 88 - (isHardware ? 14 : 0) + (isPrivacy ? 5 : 2) + (isAI ? 3 : 4));
  const skepticScore = Math.min(90, 58 + (isB2B ? 12 : 4) + (isPrivacy ? 10 : 3) + (isHardware ? 7 : 0));

  const marketCritique = isB2B
    ? 'Strong B2B willingness-to-pay if anchored to measurable time or revenue recovery. Start with 3 design partners.'
    : 'Consumer distribution has high CAC; differentiate via a viral client-side utility or focused niche community.';

  const techCritique = isHardware
    ? 'Edge inference + hardware integration introduces deployment variance. Use OpenCV/ONNX on local compute nodes for <50ms latency.'
    : isAI
    ? 'Feasible with FastAPI + Groq/Gemini structured outputs and vector indexing. Cache deterministic prompts to control token cost.'
    : 'Cleanly buildable with React, TypeScript, and serverless/Supabase persistence within a 2–3 week MVP sprint.';

  const skepticCritique = isPrivacy
    ? 'Zero-upload architecture creates a real trust moat. Ensure clear offline/audit verification to prevent enterprise pushback.'
    : 'Watch out for thin wrapper risk—embed deeply into existing customer workflows and proprietary data early.';

  return {
    summary: `Evaluated "${idea.slice(0, 64)}${idea.length > 64 ? '…' : ''}"`,
    agents: [
      { name: 'Market Analyst', score: marketScore, critique: marketCritique },
      { name: 'Tech Auditor', score: techScore, critique: techCritique },
      { name: 'Skeptic Agent', score: skepticScore, critique: skepticCritique },
    ],
  };
}

async function computeSha256Hex(buffer: ArrayBuffer): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return 'crypto.subtle unavailable in this browser context';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const PlaygroundSection: React.FC = () => {
  // 1. Idea Stress-Tester State (TheConclusion Preview)
  const [ideaInput, setIdeaInput] = useState('');
  const [copiedVerdict, setCopiedVerdict] = useState(false);
  const [ideaVerdict, setIdeaVerdict] = useState<{
    status: 'idle' | 'running' | 'done';
    summary?: string;
    agents?: AgentVerdict[];
  }>({ status: 'idle' });

  const triggerIdeaAnalysis = (text: string) => {
    if (!text.trim()) return;
    soundEngine.playTone(700, 0.1);
    setIdeaVerdict({ status: 'running' });

    setTimeout(() => {
      soundEngine.playTone(850, 0.15);
      const result = evaluateStartupIdea(text);
      setIdeaVerdict({
        status: 'done',
        summary: result.summary,
        agents: result.agents,
      });
    }, 550);
  };

  const runIdeaTest = (e: React.FormEvent) => {
    e.preventDefault();
    triggerIdeaAnalysis(ideaInput);
  };

  const handleCopyVerdict = () => {
    if (!ideaVerdict.agents) return;
    const report = [
      `TheConclusion Audit — ${ideaVerdict.summary}`,
      ...ideaVerdict.agents.map((a) => `- ${a.name} (${a.score}/100): ${a.critique}`),
    ].join('\n');
    navigator.clipboard?.writeText(report);
    soundEngine.playTone(680, 0.08);
    setCopiedVerdict(true);
    setTimeout(() => setCopiedVerdict(false), 2000);
  };

  // 2. Client-side File & Real SHA-256 Hash Inspector State (FileCore preview)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = useState('Nikneuron Living Tesseract Engine');
  const [inspectedFile, setInspectedFile] = useState<{
    name: string;
    type: string;
    size: number;
  } | null>(null);
  const [sha256, setSha256] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  useEffect(() => {
    if (inspectedFile) return;
    let active = true;
    const encoded = new TextEncoder().encode(textInput);
    computeSha256Hex(encoded.buffer).then((hex) => {
      if (active) setSha256(hex);
    });
    return () => {
      active = false;
    };
  }, [textInput, inspectedFile]);

  const handleFileInspect = async (file: File) => {
    soundEngine.playSnapHolo();
    const buffer = await file.arrayBuffer();
    const hex = await computeSha256Hex(buffer);
    setInspectedFile({
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
    });
    setSha256(hex);
  };

  const handleCopyHash = () => {
    if (!sha256) return;
    navigator.clipboard?.writeText(sha256);
    soundEngine.playTone(700, 0.08);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // 3. AI Receptionist Stateful Dialogue Triage Mock
  const [receptionistStage, setReceptionistStage] = useState<
    'greeting' | 'awaiting_slot' | 'awaiting_name' | 'confirmed'
  >('greeting');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedName, setBookedName] = useState<string | null>(null);
  const [receptionistMessages, setReceptionistMessages] = useState<
    { sender: 'bot' | 'user'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Good day. Welcome to Apex Health Clinic. Would you like to book an appointment, check clinic hours, or reach urgent triage?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [receptionistInput, setReceptionistInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [receptionistMessages]);

  const pushReceptionistTurn = (userText: string) => {
    if (!userText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    soundEngine.playTone(600, 0.08);

    setReceptionistMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);

    setTimeout(() => {
      soundEngine.playTone(780, 0.1);
      const lower = userText.toLowerCase();
      let botReply = '';

      if (lower.includes('urgent') || lower.includes('emergency') || lower.includes('pain')) {
        botReply =
          'Priority triage activated: connecting you directly to our on-call nurse desk. If this is a medical emergency, please dial local emergency services immediately.';
      } else if (lower.includes('hour') || lower.includes('open') || lower.includes('time')) {
        botReply =
          'We are open Mon–Sat from 8:00 AM to 7:30 PM. Would you like me to check Dr. Vance’s next open slots?';
        setReceptionistStage('awaiting_slot');
      } else if (receptionistStage === 'awaiting_name') {
        setBookedName(userText.trim());
        setReceptionistStage('confirmed');
        botReply = `Confirmed, ${userText.trim()}! Your appointment with Dr. Vance is locked for tomorrow at ${selectedSlot}. A calendar confirmation has been queued.`;
      } else if (
        lower.includes('10:30') ||
        lower.includes('2:15') ||
        lower.includes('4:45') ||
        receptionistStage === 'awaiting_slot'
      ) {
        const matchedSlot = lower.includes('2:15')
          ? '2:15 PM'
          : lower.includes('4:45')
          ? '4:45 PM'
          : '10:30 AM';
        setSelectedSlot(matchedSlot);
        setReceptionistStage('awaiting_name');
        botReply = `Great — holding tomorrow at ${matchedSlot}. May I have your full name to finalize the booking?`;
      } else {
        setReceptionistStage('awaiting_slot');
        botReply =
          'I checked Dr. Vance’s live schedule. Tomorrow has openings at 10:30 AM, 2:15 PM, and 4:45 PM. Which time works best for you?';
      }

      setReceptionistMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 450);
  };

  const resetReceptionist = () => {
    soundEngine.playTone(500, 0.08);
    setReceptionistStage('greeting');
    setSelectedSlot(null);
    setBookedName(null);
    setReceptionistMessages([
      {
        sender: 'bot',
        text: 'Good day. Welcome to Apex Health Clinic. Would you like to book an appointment, check clinic hours, or reach urgent triage?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <section id="playground" className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 sm:mb-12">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-accent shadow-pink-glow" />
          <span>Interactive Sandboxes // Live Execution</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Client-Side Live Playgrounds
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
          Test interactive prototypes directly inside your browser. Zero signups, Web Crypto hashing in local RAM, and responsive stateful routing.
        </p>
      </div>

      {/* Grid of 3 Demos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 sm:gap-10 lg:gap-12">
        {/* Sandbox 1: Idea Stress-Tester (TheConclusion Preview) */}
        <GradientSkewCard
          id="playground-the-conclusion"
          gradientFrom="#ffbc00"
          gradientTo="#ff0058"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-cyan-electric uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-electric" />
                TheConclusion Preview
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Multi-Agent Engine
              </span>
            </div>

            <h3 className="font-display text-base font-bold text-white mb-2">
              Multi-Agent Idea Validator
            </h3>
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
              Enter any product concept or click a preset to run a keyword-aware multi-agent audit.
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['B2B AI Invoice Auditor', 'Local Privacy PDF Suite', 'CCTV Edge Alert Drone'].map(
                (preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setIdeaInput(preset);
                      triggerIdeaAnalysis(preset);
                    }}
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:border-cyan-electric hover:text-cyan-electric transition-colors"
                  >
                    {preset}
                  </button>
                )
              )}
            </div>

            <form onSubmit={runIdeaTest} className="flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="e.g., B2B SaaS compliance copilot..."
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-void-deep/90 border border-cyan-electric/30 text-white text-xs placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-cyan-electric"
              />
              <button
                type="submit"
                disabled={ideaVerdict.status === 'running'}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-cyan-electric text-void hover:opacity-90 transition-all disabled:opacity-50"
              >
                {ideaVerdict.status === 'running' ? 'Agents Deliberating...' : 'Run Agent Audit'}
              </button>
            </form>

            {ideaVerdict.status === 'done' && ideaVerdict.agents && (
              <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-white/10 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[10px] font-mono text-text-dim">
                  <span className="truncate max-w-[75%]">{ideaVerdict.summary}</span>
                  <button
                    type="button"
                    onClick={handleCopyVerdict}
                    className="text-cyan-electric hover:text-white flex items-center gap-1 shrink-0"
                  >
                    {copiedVerdict ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVerdict ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                {ideaVerdict.agents.map((ag) => (
                  <div
                    key={ag.name}
                    className="p-2.5 rounded-lg bg-void-deep/90 border border-white/5 text-[11px]"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">{ag.name}</span>
                      <span className="font-mono text-cyan-electric">{ag.score}/100</span>
                    </div>
                    <p className="text-text-secondary text-[10px] leading-snug">{ag.critique}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GradientSkewCard>

        {/* Sandbox 2: Real Web Crypto SHA-256 File & Text Inspector (FileCore Preview) */}
        <GradientSkewCard
          id="playground-file-core"
          gradientFrom="#03a9f4"
          gradientTo="#ff0058"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-pink-accent uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-pink-accent" />
                FileCore Preview
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                Web Crypto SHA-256
              </span>
            </div>

            <h3 className="font-display text-base font-bold text-white mb-2">
              Privacy File & SHA-256 Analyzer
            </h3>
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
              Drop any real file or edit text below to compute genuine SHA-256 checksums strictly in browser RAM.
            </p>

            {/* Dropzone / File Picker */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingFile(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileInspect(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`mb-3 p-3 rounded-xl border border-dashed cursor-pointer transition-all flex items-center justify-between gap-2 text-xs ${
                isDraggingFile
                  ? 'border-pink-accent bg-pink-accent/15 text-white'
                  : 'border-pink-accent/40 bg-void-deep/70 text-text-secondary hover:border-pink-accent'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileInspect(file);
                }}
              />
              <div className="flex items-center gap-2 truncate">
                {inspectedFile ? (
                  <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Upload className="w-4 h-4 text-pink-accent shrink-0" />
                )}
                <span className="truncate">
                  {inspectedFile ? inspectedFile.name : 'Drop any file or click to inspect locally'}
                </span>
              </div>
              {inspectedFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectedFile(null);
                  }}
                  className="text-[10px] font-mono text-pink-accent hover:underline shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            {!inspectedFile && (
              <textarea
                rows={3}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste text payload to hash..."
                className="w-full px-3 py-2 rounded-xl bg-void-deep/90 border border-pink-accent/30 text-white text-xs placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-pink-accent mb-3 font-mono"
              />
            )}

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-void-deep/90 border border-white/5">
                <span className="text-[10px] text-text-dim block">Payload Size:</span>
                <span className="font-bold text-white">
                  {inspectedFile
                    ? formatBytes(inspectedFile.size)
                    : formatBytes(new Blob([textInput]).size)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-void-deep/90 border border-white/5 truncate">
                <span className="text-[10px] text-text-dim block">
                  {inspectedFile ? 'MIME Type:' : 'Characters:'}
                </span>
                <span className="font-bold text-white truncate block">
                  {inspectedFile ? inspectedFile.type : `${textInput.length} chars`}
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-void-deep/90 border border-pink-accent/20 text-xs font-mono">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-pink-accent font-semibold">SHA-256 Checksum:</span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="text-[10px] text-cyan-electric hover:text-white flex items-center gap-1"
                >
                  {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <span className="text-white text-[10px] break-all leading-tight block">
                {sha256 || 'Computing...'}
              </span>
            </div>
          </div>
        </GradientSkewCard>

        {/* Sandbox 3: Stateful AI Receptionist Triage */}
        <GradientSkewCard
          id="playground-ai-receptionist"
          gradientFrom="#4dff03"
          gradientTo="#00d0ff"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-cyan-electric uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-electric" />
                AI Receptionist Preview
              </span>
              <button
                type="button"
                onClick={resetReceptionist}
                title="Reset dialogue"
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:border-emerald-400 flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>

            <h3 className="font-display text-base font-bold text-white mb-2">
              Autonomous Dialogue Triage
            </h3>
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
              Book a live slot, check hours, or trigger urgent triage in real time.
            </p>

            <div
              ref={chatScrollRef}
              className="h-44 overflow-y-auto p-3 rounded-xl bg-void-deep/90 border border-cyan-electric/20 flex flex-col gap-2 mb-2.5 text-xs"
            >
              {receptionistMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[85%] ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-cyan-electric/20 border border-cyan-electric/40 text-white'
                      : 'mr-auto bg-white/5 border border-white/10 text-text-secondary'
                  }`}
                >
                  <p className="text-[11px] leading-snug">{msg.text}</p>
                  <span className="text-[9px] text-text-dim block text-right mt-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              ))}

              {receptionistStage === 'confirmed' && selectedSlot && bookedName && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/50 text-[11px] flex items-center gap-2 text-emerald-200 mt-1">
                  <CalendarCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Booked: <strong>{bookedName}</strong> · Tomorrow {selectedSlot}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Reply Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {receptionistStage === 'greeting' && (
                <>
                  <button
                    type="button"
                    onClick={() => pushReceptionistTurn('Book an appointment')}
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-cyan-electric/10 border border-cyan-electric/30 text-cyan-electric hover:bg-cyan-electric hover:text-void transition-all"
                  >
                    Book appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => pushReceptionistTurn('What are your clinic hours?')}
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:border-cyan-electric hover:text-white transition-all"
                  >
                    Clinic hours
                  </button>
                </>
              )}
              {receptionistStage === 'awaiting_slot' && (
                <>
                  {['10:30 AM', '2:15 PM', '4:45 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => pushReceptionistTurn(slot)}
                      className="text-[10px] font-mono px-2 py-1 rounded-lg bg-cyan-electric/15 border border-cyan-electric/40 text-cyan-electric hover:bg-cyan-electric hover:text-void transition-all"
                    >
                      {slot}
                    </button>
                  ))}
                </>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const txt = receptionistInput;
                setReceptionistInput('');
                pushReceptionistTurn(txt);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder={
                  receptionistStage === 'awaiting_name'
                    ? 'Enter your full name...'
                    : 'Type a message to assistant...'
                }
                value={receptionistInput}
                onChange={(e) => setReceptionistInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-void-deep/90 border border-cyan-electric/30 text-white text-xs placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-cyan-electric"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="px-3 py-2 rounded-xl bg-cyan-electric text-void font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </GradientSkewCard>
      </div>

      {/* Playground Interlinking Transition */}
      <div className="mt-14 p-6 rounded-2xl bg-void-surface/75 border border-cyan-electric/25 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-accent/15 border border-pink-accent/30 flex items-center justify-center text-pink-accent shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-white">From Interactive Sandbox to Shipped Production</h3>
            <p className="text-xs text-text-secondary">See how we take proof-of-concepts through systematic milestones to full deployment.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="#process"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-electric text-void hover:opacity-90 transition-all flex items-center gap-1.5 shadow-cyan-glow"
          >
            <span>See 4-Step Process</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
          <a
            href="#services"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            <span>All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-pink-accent/20 border border-pink-accent/50 text-pink-accent hover:bg-pink-accent hover:text-void transition-all"
          >
            Commission System →
          </a>
        </div>
      </div>
    </section>
  );
};

export default PlaygroundSection;
