import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import {
  Bot,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Mail,
  Download,
  CalendarCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneCall,
  Send,
  ArrowRight,
  PhoneForwarded,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SITE_CONFIG } from '../../config/site.config';
import { soundEngine } from '../ui/audio';
import { generateNikReply } from '../../services/nikChatService';

export interface OrientationGizmoProps {
  className?: string;
}

const APPOINTMENT_DAYS = [
  'Tomorrow',
  'In 2 Days',
  'This Friday',
  'Next Monday',
];

const TIME_SLOTS = [
  '10:30 AM IST',
  '01:00 PM IST',
  '03:30 PM IST',
  '05:00 PM IST',
  '07:00 PM IST',
];

const INTEREST_SERVICES = [
  { id: 'ai-receptionist', label: 'AI Receptionist & Voice' },
  { id: 'web-dev', label: 'Modern Web Dev' },
  { id: 'whatsapp-automation', label: 'WhatsApp Automation' },
  { id: 'custom-software', label: 'Custom Software & App' },
  { id: 'bundle-growth', label: 'Turnkey Growth Bundle' },
];

/**
 * High-Visibility Radiant 3D Core Cube.
 * Features glowing wireframe edges, 8 energy vertex nodes,
 * bright emissive plasma core, dual orbital rings, and zero background card.
 */
const RadiantCoreCube: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const speed = isHovered ? 2.0 : 0.95;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x += delta * (speed * 0.45);

    // Floating bob animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.6) * 0.1;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z -= delta * 1.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 1.2;
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4.2) * 0.14;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const edgesGeom = useMemo(() => {
    const box = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    return new THREE.EdgesGeometry(box);
  }, []);

  const cornerPositions = useMemo(() => {
    const d = 0.6;
    return [
      [-d, -d, -d],
      [d, -d, -d],
      [-d, d, -d],
      [d, d, -d],
      [-d, -d, d],
      [d, -d, d],
      [-d, d, d],
      [d, d, d],
    ] as [number, number, number][];
  }, []);

  return (
    <group ref={groupRef}>
      {/* 1. Neon Cyan Wireframe Lattice Edges */}
      <lineSegments geometry={edgesGeom}>
        <lineBasicMaterial
          color={isHovered ? '#ffffff' : '#00f0ff'}
          linewidth={2}
          transparent
          opacity={1.0}
        />
      </lineSegments>

      {/* 2. Glowing Corner Nodes */}
      {cornerPositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color={isHovered ? '#ffffff' : '#00f0ff'} />
        </mesh>
      ))}

      {/* 3. Translucent Holographic Glass Shell */}
      <RoundedBox args={[1.16, 1.16, 1.16]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color="#0055ff"
          emissive={isHovered ? '#00f0ff' : '#0066ff'}
          emissiveIntensity={isHovered ? 1.4 : 0.7}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.4}
        />
      </RoundedBox>

      {/* 4. Radiant Glowing Inner Core Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={isHovered ? '#00f0ff' : '#00c3ff'}
          emissiveIntensity={isHovered ? 3.8 : 2.5}
          roughness={0.1}
        />
      </mesh>

      {/* 5. Dual Holographic Orbital Energy Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.96, 0.022, 12, 48]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.9} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[1.06, 0.018, 12, 48]} />
        <meshBasicMaterial color="#cfefff" transparent opacity={0.75} />
      </mesh>

      {/* 6. Dynamic High-Intensity Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight color="#00f0ff" intensity={6.5} distance={4} />
      <pointLight color="#ffffff" intensity={3.5} distance={3} position={[1, 1, 2]} />
      <pointLight color="#0033ff" intensity={4.5} distance={3} position={[-1, -1, -1]} />
    </group>
  );
};

interface ReceptionistMessage {
  id: string;
  sender: 'maya' | 'user';
  text: string;
  time: string;
}

const MAYA_INITIAL_MESSAGE =
  "Namaste! I am Maya, the 24/7 AI Receptionist for Nikneuron Studio. How can I help you today? Would you like to check our pricing, discuss custom software, or schedule a 15-minute discovery call with our founder Aditya Tamta?";

export const OrientationGizmo: React.FC<OrientationGizmoProps> = ({ className }) => {
  const { startInquiry } = useAppStore();

  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'talk' | 'book'>('talk');

  // Voice & Talk State
  const [messages, setMessages] = useState<ReceptionistMessage[]>([
    {
      id: 'maya-init',
      sender: 'maya',
      text: MAYA_INITIAL_MESSAGE,
      time: 'Just now',
    },
  ]);
  const [talkInput, setTalkInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Form State
  const [selectedDay, setSelectedDay] = useState(APPOINTMENT_DAYS[0]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [selectedService, setSelectedService] = useState(INTEREST_SERVICES[0].label);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingToken, setBookingToken] = useState('');

  // Auto-scroll talk messages
  useEffect(() => {
    if (activeTab === 'talk') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Speech Synthesis helper
  const speakText = useCallback(
    (textToSpeak: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || isVoiceMuted) {
        return;
      }

      try {
        window.speechSynthesis.cancel();
        // Clean markdown symbols for cleaner speech
        const cleanText = textToSpeak
          .replace(/[*_#`[\]()]/g, '')
          .replace(/https?:\/\/\S+/g, 'link');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;

        // Try picking an Indian or natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find((v) => v.lang.includes('en-IN') || v.name.includes('India')) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    },
    [isVoiceMuted]
  );

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleOpenModal = (tab: 'talk' | 'book' = 'talk') => {
    soundEngine.playTone(760, 0.1);
    setActiveTab(tab);
    setBookingConfirmed(false);
    setIsModalOpen(true);

    if (tab === 'talk' && !isVoiceMuted && messages.length === 1) {
      setTimeout(() => speakText(MAYA_INITIAL_MESSAGE), 400);
    }
  };

  const handleCloseModal = () => {
    soundEngine.playTone(480, 0.08);
    stopSpeaking();
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsMicListening(false);
    }
    setIsModalOpen(false);
  };

  // Toggle voice speech output
  const toggleVoiceMute = () => {
    if (!isVoiceMuted) {
      stopSpeaking();
      setIsVoiceMuted(true);
    } else {
      setIsVoiceMuted(false);
      soundEngine.playTone(720, 0.08);
    }
  };

  // Voice Input Speech Recognition
  const toggleMicListening = () => {
    if (typeof window === 'undefined') return;

    if (isMicListening) {
      speechRecognitionRef.current?.stop();
      setIsMicListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsMicListening(true);
        soundEngine.playTone(880, 0.08);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setTalkInput(transcript);
        handleSendTalkMessage(transcript);
      };

      recognition.onerror = () => {
        setIsMicListening(false);
      };

      recognition.onend = () => {
        setIsMicListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsMicListening(false);
    }
  };

  // Send message in Talk mode
  const handleSendTalkMessage = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : talkInput).trim();
    if (!textToSend || isThinking) return;

    soundEngine.playTone(660, 0.08);
    stopSpeaking();

    const userMsg: ReceptionistMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: 'Just now',
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setTalkInput('');
    setIsThinking(true);

    // If user asked to book an appointment or call, provide swift response & prompt
    const lower = textToSend.toLowerCase();
    const isBookingIntent =
      lower.includes('book') ||
      lower.includes('appointment') ||
      lower.includes('schedule') ||
      lower.includes('call aditya') ||
      lower.includes('meet');

    try {
      const chatHistory = nextMessages.map((m) => ({
        id: m.id,
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        text: m.text,
        time: m.time,
      }));

      const reply = await generateNikReply(
        chatHistory,
        `[You are Maya, the 24/7 polite, knowledgeable AI Receptionist at Nikneuron Studio]. User message: "${textToSend}". Answer warmly in 2-3 concise sentences and offer to confirm their discovery call slot.`
      );

      const mayaMsg: ReceptionistMessage = {
        id: `maya-${Date.now()}`,
        sender: 'maya',
        text: reply.text,
        time: 'Just now',
      };

      setMessages((prev) => [...prev, mayaMsg]);
      speakText(reply.text);

      if (isBookingIntent) {
        soundEngine.playSnapHolo();
      }
    } catch {
      const fallback =
        "I'd love to help! You can book a 15-minute technical discovery call directly with our founder Aditya Tamta, or drop a quick WhatsApp message to +91 9258032799.";
      setMessages((prev) => [
        ...prev,
        {
          id: `maya-err-${Date.now()}`,
          sender: 'maya',
          text: fallback,
          time: 'Just now',
        },
      ]);
      speakText(fallback);
    } finally {
      setIsThinking(false);
    }
  };

  const handleConfirmAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!phone.trim() && !email.trim())) return;

    soundEngine.playTone(880, 0.15);
    const token = `NR-BOOK-${Date.now().toString().slice(-4)}`;
    setBookingToken(token);

    // Save to persistent localStorage
    try {
      const existing = JSON.parse(
        localStorage.getItem('nikneuron_call_bookings') || '[]'
      );
      existing.push({
        token,
        day: selectedDay,
        slot: selectedSlot,
        service: selectedService,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('nikneuron_call_bookings', JSON.stringify(existing));
    } catch {
      // Ignore
    }

    // Connect to central store inquiry
    startInquiry({
      serviceType: 'ai-receptionist',
      brief: `AI Receptionist Appointment [${token}]: ${selectedDay} at ${selectedSlot} for ${selectedService}. Client: ${name.trim()} (${phone.trim()} | ${email.trim()}). Notes: ${notes.trim() || 'None'}`,
    });

    setBookingConfirmed(true);

    // Add confirmation message to talk history
    setMessages((prev) => [
      ...prev,
      {
        id: `maya-book-ack-${Date.now()}`,
        sender: 'maya',
        text: `🎉 Wonderful, ${name.trim()}! Your discovery call is locked for **${selectedDay} at ${selectedSlot}** (Reference: \`${token}\`). Aditya has received this booking and will confirm your Google Meet link!`,
        time: 'Just now',
      },
    ]);
  };

  const handleDownloadIcs = () => {
    soundEngine.playTone(600, 0.08);
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nikneuron//AI Receptionist Booking//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Nikneuron Discovery Call: ${selectedService}`,
      `DESCRIPTION:Appointment confirmed with Aditya Tamta (Nikneuron Studio).\\nSlot: ${selectedDay} at ${selectedSlot}\\nReference Token: ${bookingToken}\\nClient: ${name}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nikneuron-booking-${bookingToken}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Nikneuron Discovery Call (${selectedService})`
  )}&details=${encodeURIComponent(
    `Appointment token: ${bookingToken}\nSlot: ${selectedDay} at ${selectedSlot}\nWith Aditya Tamta (Nikneuron Studio)\nClient: ${name} (${phone} | ${email})`
  )}`;

  const whatsappMessageUrl = `${SITE_CONFIG.contact.whatsappUrl}?text=${encodeURIComponent(
    `Hi Aditya, I've confirmed a 15-minute call via AI Receptionist (Token: ${bookingToken}) for ${selectedDay} at ${selectedSlot}. Service: ${selectedService}. My name: ${name}.`
  )}`;

  return (
    <>
      {/* ============================================================== */}
      {/* FLOATING MINIATURE 3D CUBE (PURE CORE ONLY, NO BULKY BACKGROUND) */}
      {/* ============================================================== */}
      <div
        className={`pointer-events-auto flex flex-col items-center select-none group ${
          className || ''
        }`}
        onMouseEnter={() => {
          setIsHovered(true);
          soundEngine.playTone(680, 0.05);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 3D Canvas with Click Overlay */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          {/* Subtle Cybernetic Floor Radar Ring */}
          <div className="absolute inset-x-2 bottom-2 h-7 rounded-full bg-cyan-electric/15 blur-md pointer-events-none animate-pulse" />

          <Canvas
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 3.0], fov: 42 }}
            style={{ background: 'transparent' }}
          >
            <RadiantCoreCube isHovered={isHovered} />
          </Canvas>

          {/* Guaranteed Direct Click Overlay Button across the entire cube area */}
          <button
            type="button"
            onClick={() => handleOpenModal('talk')}
            className="absolute inset-0 w-full h-full cursor-pointer z-10 bg-transparent border-0 focus:outline-none"
            aria-label="Talk with AI Receptionist & Book Appointment"
            title="Talk with AI Receptionist & Book Appointment"
          />
        </div>

        {/* High-Contrast Holographic Button Badge */}
        <div className="flex items-center gap-1.5 -mt-1 relative z-20">
          <button
            type="button"
            onClick={() => handleOpenModal('talk')}
            className="px-3 py-1.5 rounded-full bg-void-deep/95 border border-cyan-electric/80 shadow-cyan-glow text-white text-[11px] font-bold font-display uppercase tracking-wider flex items-center gap-2 hover:bg-cyan-electric hover:text-void transition-all active:scale-95 cursor-pointer shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>AI Receptionist</span>
            <span className="text-cyan-electric group-hover:text-void font-mono text-[10px]">
              · Talk & Book
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* AI RECEPTIONIST MODAL: TALK (VOICE/CHAT) & BOOK APPOINTMENT   */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Receptionist: Talk & Book Appointment"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-void-deep/85 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl bg-void-surface/95 border border-cyan-electric/40 shadow-glass flex flex-col text-white animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-hidden"
          >
            {/* Modal Header */}
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-void-surface via-cyan-electric/[0.05] to-void-surface">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-electric/30 to-blue-electric/20 border border-cyan-electric/50 flex items-center justify-center text-cyan-electric shadow-cyan-glow">
                  <Bot className="w-6 h-6 animate-pulse" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-void-deep flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-100 animate-ping" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base sm:text-lg font-bold text-white">
                      Maya · AI Receptionist
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-electric/15 border border-cyan-electric/35 text-[9px] font-mono text-cyan-electric font-bold flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Live 24/7
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Nikneuron Studio · Direct Founder Link to Aditya Tamta
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {activeTab === 'talk' && (
                  <button
                    type="button"
                    onClick={toggleVoiceMute}
                    title={isVoiceMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isVoiceMuted
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-cyan-electric/15 text-cyan-electric border-cyan-electric/40'
                    }`}
                  >
                    {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-electric text-text-secondary hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center border-b border-white/10 bg-black/40 px-5 py-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(600, 0.05);
                  setActiveTab('talk');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'talk'
                    ? 'bg-cyan-electric text-void shadow-cyan-glow font-display tracking-wide'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Talk with Receptionist</span>
                {isSpeaking && (
                  <span className="w-1.5 h-1.5 rounded-full bg-void animate-ping" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTone(640, 0.05);
                  stopSpeaking();
                  setActiveTab('book');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'book'
                    ? 'bg-cyan-electric text-void shadow-cyan-glow font-display tracking-wide'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment (15 Min)</span>
              </button>
            </div>

            {/* TAB 1: TALK WITH AI RECEPTIONIST (CONVERSATIONAL & VOICE) */}
            {activeTab === 'talk' && (
              <div className="flex flex-col flex-1 min-h-[380px] max-h-[500px]">
                {/* Voice Status & Holographic Wave Indicator */}
                <div className="px-5 py-2.5 bg-void-surface/60 border-b border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSpeaking
                          ? 'bg-cyan-electric animate-ping'
                          : isMicListening
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="font-mono text-[11px] text-text-secondary">
                      {isSpeaking
                        ? 'Maya is speaking...'
                        : isMicListening
                        ? 'Listening to your voice...'
                        : isThinking
                        ? 'Maya is thinking...'
                        : 'Voice Receptionist Ready'}
                    </span>
                  </div>

                  {/* Quick Action to switch to Book */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTone(640, 0.06);
                      setActiveTab('book');
                    }}
                    className="text-[11px] font-mono text-cyan-electric hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Instant Booking Form</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 no-scrollbar">
                  {messages.map((m) => {
                    const isMaya = m.sender === 'maya';
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-2.5 ${isMaya ? 'justify-start' : 'justify-end'}`}
                      >
                        {isMaya && (
                          <div className="w-7 h-7 rounded-xl bg-cyan-electric/20 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric shrink-0 mt-0.5">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                            isMaya
                              ? 'bg-white/[0.06] border border-white/10 text-white rounded-tl-sm'
                              : 'bg-cyan-electric text-void font-medium rounded-tr-sm shadow-cyan-glow'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                          <span
                            className={`block text-[9px] font-mono mt-1 ${
                              isMaya ? 'text-text-dim' : 'text-void/60'
                            }`}
                          >
                            {m.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {isThinking && (
                    <div className="flex items-center gap-2 text-text-secondary text-xs pl-2">
                      <Bot className="w-4 h-4 text-cyan-electric animate-spin" />
                      <span className="font-mono text-[11px]">Maya is preparing an answer...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Interactive Prompt Chips */}
                <div className="px-4 py-2 bg-black/30 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-mono text-text-dim shrink-0">Quick ask:</span>
                  {[
                    'Book a 15-min discovery call',
                    'What are your turnkey bundle prices?',
                    'Can you build an AI receptionist for my business?',
                    'How soon can we start a project?',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendTalkMessage(chip)}
                      className="shrink-0 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 hover:border-cyan-electric/50 text-[11px] text-text-secondary hover:text-white transition-all cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Talk Input Bar with Mic & Send */}
                <div className="p-3 sm:p-4 bg-void-surface/90 border-t border-white/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMicListening}
                    title={isMicListening ? 'Stop listening' : 'Speak via microphone'}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isMicListening
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg'
                        : 'bg-white/5 text-text-secondary hover:text-white border-white/10 hover:border-cyan-electric'
                    }`}
                  >
                    {isMicListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={talkInput}
                    onChange={(e) => setTalkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendTalkMessage();
                      }
                    }}
                    placeholder={
                      isMicListening
                        ? 'Listening to you now...'
                        : 'Ask Maya anything or type "Book appointment"...'
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl bg-void-deep border border-white/15 text-xs text-white placeholder:text-text-dim focus:border-cyan-electric focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => handleSendTalkMessage()}
                    disabled={!talkInput.trim() || isThinking}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-electric to-blue-electric text-void font-bold hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-cyan-glow"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: BOOK APPOINTMENT FORM */}
            {activeTab === 'book' && (
              <div className="p-5 overflow-y-auto max-h-[520px] no-scrollbar">
                {/* Confirmation View */}
                {bookingConfirmed ? (
                  <div className="py-4 flex flex-col items-center text-center gap-3.5 animate-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-bold text-white">
                        Appointment Confirmed!
                      </h4>
                      <p className="text-xs text-cyan-electric font-mono mt-0.5">
                        Reference Token: <span className="font-bold underline">{bookingToken}</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-text-secondary max-w-md text-left space-y-1">
                      <p>
                        <strong className="text-white">Slot:</strong> {selectedDay} · {selectedSlot}
                      </p>
                      <p>
                        <strong className="text-white">Service:</strong> {selectedService}
                      </p>
                      <p>
                        <strong className="text-white">Attendee:</strong> {name} ({phone || email})
                      </p>
                      <p className="text-[11px] text-emerald-400 pt-1">
                        ✓ Founder Aditya Tamta has received this booking. You are guaranteed a calendar link within 24h.
                      </p>
                    </div>

                    {/* Instant Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2 w-full">
                      <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-cyan-electric text-void shadow-cyan-glow hover:opacity-95 transition-all"
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>Google Calendar</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleDownloadIcs}
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/10 border border-white/20 text-white hover:border-cyan-electric transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download .ICS</span>
                      </button>

                      <a
                        href={whatsappMessageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500 hover:text-void transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp Aditya</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('talk')}
                      className="text-xs text-cyan-electric hover:underline pt-2 cursor-pointer"
                    >
                      ← Back to Talk with Maya
                    </button>
                  </div>
                ) : (
                  /* Booking Form */
                  <form onSubmit={handleConfirmAppointment} className="flex flex-col gap-4">
                    {/* 1. Select Day */}
                    <div>
                      <label className="text-[11px] font-mono text-cyan-electric uppercase tracking-wider block mb-1.5 font-semibold">
                        1. Preferred Day
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {APPOINTMENT_DAYS.map((day) => (
                          <button
                            type="button"
                            key={day}
                            onClick={() => {
                              soundEngine.playTone(600, 0.05);
                              setSelectedDay(day);
                            }}
                            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              selectedDay === day
                                ? 'bg-cyan-electric/25 border-cyan-electric text-cyan-electric shadow-cyan-glow'
                                : 'bg-void-deep border-white/10 text-text-secondary hover:border-white/25'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Select Time Slot */}
                    <div>
                      <label className="text-[11px] font-mono text-cyan-electric uppercase tracking-wider block mb-1.5 font-semibold">
                        2. Time Slot (15-Minute Technical Discovery)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => {
                              soundEngine.playTone(640, 0.05);
                              setSelectedSlot(slot);
                            }}
                            className={`py-2 px-2 rounded-xl text-[11px] font-mono border transition-all cursor-pointer ${
                              selectedSlot === slot
                                ? 'bg-cyan-electric text-void font-bold shadow-cyan-glow border-cyan-electric'
                                : 'bg-void-deep border-white/10 text-text-secondary hover:border-white/25'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Service of Interest */}
                    <div>
                      <label className="text-[11px] font-mono text-cyan-electric uppercase tracking-wider block mb-1.5 font-semibold">
                        3. Focus Area
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {INTEREST_SERVICES.map((s) => (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => {
                              soundEngine.playTone(680, 0.05);
                              setSelectedService(s.label);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                              selectedService === s.label
                                ? 'bg-white/20 border border-white text-white font-bold'
                                : 'bg-white/[0.04] border border-white/10 text-text-secondary hover:text-white'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Attendee Details */}
                    <div className="space-y-2 pt-1 border-t border-white/10">
                      <label className="text-[11px] font-mono text-cyan-electric uppercase tracking-wider block font-semibold">
                        4. Your Contact Details
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name *"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="px-3.5 py-2 rounded-xl bg-void-deep border border-white/15 text-xs text-white placeholder:text-text-dim focus:border-cyan-electric focus:outline-none"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp / Phone *"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="px-3.5 py-2 rounded-xl bg-void-deep border border-white/15 text-xs text-white placeholder:text-text-dim focus:border-cyan-electric focus:outline-none"
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address (for Google Meet calendar invite)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-void-deep border border-white/15 text-xs text-white placeholder:text-text-dim focus:border-cyan-electric focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Project note or question for Aditya (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-void-deep border border-white/15 text-xs text-white placeholder:text-text-dim focus:border-cyan-electric focus:outline-none"
                      />
                    </div>

                    {/* Confirmation Action Button */}
                    <button
                      type="submit"
                      disabled={!name.trim() || (!phone.trim() && !email.trim())}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-electric to-blue-electric text-void font-bold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer shadow-cyan-glow flex items-center justify-center gap-2 mt-1"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Lock 15-Min Slot with Founder Aditya →</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrientationGizmo;
