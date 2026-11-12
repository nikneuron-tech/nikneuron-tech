import React, { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../../config/site.config';
import {
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  MessageSquare,
  Mail,
  Copy,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { soundEngine } from '../ui/audio';
import { useAppStore } from '../../store/useAppStore';
import { ALL_SERVICES_CONFIG, BUNDLE_PACKAGES } from '../../config/services.config';

const CALL_SLOTS = ['10:00 AM IST', '11:30 AM IST', '03:00 PM IST', '05:30 PM IST', '08:00 PM IST'];

export const ContactSection: React.FC = () => {
  const { preselectedInquiry, clearPreselectedInquiry, setLiveAnnouncement } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: 'ui-ux-design',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // Built-in 15-min call scheduler modal
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState(CALL_SLOTS[0]);
  const [callerEmail, setCallerEmail] = useState('');
  const [callBooked, setCallBooked] = useState(false);

  // Sync preselected inquiry from other CTAs across the site
  useEffect(() => {
    if (preselectedInquiry) {
      setFormData((prev) => ({
        ...prev,
        serviceType: preselectedInquiry.serviceType || prev.serviceType,
        message: preselectedInquiry.brief || prev.message,
      }));
      setSubmittedData(null);
      clearPreselectedInquiry();
    }
  }, [preselectedInquiry, clearPreselectedInquiry]);

  const buildMailtoHref = (data: typeof formData) => {
    const subject = encodeURIComponent(
      `[Nikneuron Inquiry] ${data.serviceType} — ${data.name || 'New Project'}`
    );
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.serviceType}\n\nProject Brief:\n${data.message}`
    );
    return `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    soundEngine.playTone(720, 0.12);

    const endpoint = SITE_CONFIG.contact.formspreeEndpoint;
    const isLiveEndpoint = endpoint && !endpoint.includes('placeholder');

    try {
      if (isLiveEndpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          throw new Error('Remote submission returned an error.');
        }
      } else {
        // Persist locally when Formspree webhook is not yet configured
        await new Promise((r) => setTimeout(r, 450));
        const history = JSON.parse(localStorage.getItem('nikneuron_inquiries') || '[]');
        history.push({ ...formData, createdAt: new Date().toISOString() });
        localStorage.setItem('nikneuron_inquiries', JSON.stringify(history));
      }

      soundEngine.playTone(880, 0.15);
      setSubmittedData({ ...formData });
      setLiveAnnouncement('Project inquiry prepared and saved');
    } catch {
      setSubmitError('Could not reach remote form endpoint. You can send directly via email below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyBrief = () => {
    if (!submittedData) return;
    const text = `Nikneuron Inquiry\nName: ${submittedData.name}\nEmail: ${submittedData.email}\nService: ${submittedData.serviceType}\nBrief: ${submittedData.message}`;
    navigator.clipboard?.writeText(text);
    soundEngine.playTone(680, 0.08);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const handleConfirmCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerEmail.trim()) return;
    soundEngine.playTone(860, 0.15);
    const bookings = JSON.parse(localStorage.getItem('nikneuron_call_bookings') || '[]');
    bookings.push({
      day: selectedDay,
      slot: selectedSlot,
      email: callerEmail,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('nikneuron_call_bookings', JSON.stringify(bookings));
    setCallBooked(true);
  };

  const hasLiveWhatsApp =
    SITE_CONFIG.contact.whatsappUrl && !SITE_CONFIG.contact.whatsappUrl.includes('XXXXXXXXXX');

  return (
    <section id="contact" className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8 sm:mb-12">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-accent shadow-pink-glow" />
          <span>Start a Project // Direct Communication</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Let’s Build Something Enduring
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
          Whether you need a high-conversion 3D web experience, an autonomous AI pipeline, or full-stack engineering support — reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Direct Call & Messaging Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Availability Status Badge */}
          <div className="p-5 rounded-2xl bg-void-surface/90 border border-emerald-500/40 shadow-glass backdrop-blur-xl flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Capacity Status</span>
              <span className="text-[11px] font-mono text-emerald-300">
                {SITE_CONFIG.contact.availabilityStatus}
              </span>
            </div>
          </div>

          {/* Guaranteed Response Time Badge */}
          <div className="p-5 rounded-2xl bg-void-surface/90 border border-cyan-electric/30 shadow-glass backdrop-blur-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-electric shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Response Guarantee</span>
              <span className="text-[11px] text-text-secondary">
                {SITE_CONFIG.contact.replyTimeCommitment}
              </span>
            </div>
          </div>

          {/* Quick Schedule Call (Interactive Built-in Scheduler) */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playTone(600, 0.1);
              setCallBooked(false);
              setIsSchedulerOpen(true);
            }}
            className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-cyan-electric/15 to-void-surface border border-cyan-electric/50 hover:border-cyan-electric shadow-cyan-glow backdrop-blur-xl flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-electric/20 border border-cyan-electric flex items-center justify-center text-cyan-electric">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white group-hover:text-cyan-electric transition-colors">
                  Book a 15-Minute Technical Call
                </span>
                <span className="text-[11px] font-mono text-text-dim">
                  Pick a live slot immediately
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-electric group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          {/* Direct WhatsApp Card */}
          {hasLiveWhatsApp && (
            <a
              href={SITE_CONFIG.contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundEngine.playTone(600, 0.1)}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-void-surface border border-emerald-500/40 hover:border-emerald-400 shadow-glass backdrop-blur-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    WhatsApp · {SITE_CONFIG.contact.phone}
                  </span>
                  <span className="text-[11px] font-mono text-text-dim">
                    Chat directly ({SITE_CONFIG.contact.whatsappNumber})
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          )}

          {/* Direct Email Card */}
          <a
            href={`mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent('Nikneuron Project Inquiry')}`}
            onClick={() => soundEngine.playTone(600, 0.1)}
            className="p-5 rounded-2xl bg-gradient-to-br from-pink-accent/15 to-void-surface border border-pink-accent/40 hover:border-pink-accent shadow-glass backdrop-blur-xl flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-accent/20 border border-pink-accent flex items-center justify-center text-pink-accent">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white group-hover:text-pink-accent transition-colors">
                  Email · {SITE_CONFIG.contact.email}
                </span>
                <span className="text-[11px] font-mono text-text-dim">
                  Direct inbox for briefs & proposals
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-pink-accent group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-void-surface/90 border border-cyan-electric/30 shadow-glass backdrop-blur-2xl">
          {submittedData ? (
            <div className="py-8 flex flex-col items-center text-center gap-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 mb-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Inquiry Ready & Logged
              </h3>
              <p className="text-xs text-text-secondary max-w-md">
                Thank you, <span className="text-white font-semibold">{submittedData.name}</span>. Your brief for{' '}
                <span className="text-cyan-electric font-mono">{submittedData.serviceType}</span> has been recorded. You can also send it directly via your email client right now.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <a
                  href={buildMailtoHref(submittedData)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-electric text-void hover:opacity-90 shadow-cyan-glow transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Email App</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/15 text-white hover:border-cyan-electric transition-all"
                >
                  {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBrief ? 'Copied!' : 'Copy Brief'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmittedData(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-text-secondary hover:text-white transition-all"
                >
                  Send Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {submitError && (
                <div className="p-3 rounded-xl bg-pink-accent/15 border border-pink-accent/40 text-xs text-pink-200 flex items-center justify-between gap-2">
                  <span>{submitError}</span>
                  <a
                    href={buildMailtoHref(formData)}
                    className="underline font-bold text-white shrink-0"
                  >
                    Send via Email →
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-cyan-electric tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-void-deep/90 border border-cyan-electric/30 text-white text-xs placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-cyan-electric"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-cyan-electric tracking-wider">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-void-deep/90 border border-cyan-electric/30 text-white text-xs placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-cyan-electric"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase text-cyan-electric tracking-wider">
                  Service Area of Interest
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-void-deep/90 border border-cyan-electric/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-electric"
                >
                  <optgroup label="Nikneuron Services">
                    {ALL_SERVICES_CONFIG.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Bundle Packages">
                    {BUNDLE_PACKAGES.map((bundle) => (
                      <option key={bundle.id} value={bundle.id}>
                        {bundle.name} Bundle ({bundle.included.join(' + ')})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Engagement Models">
                    <option value="pilot">Free Discovery Pilot</option>
                    <option value="fixed-project">Fixed-Scope Sprint</option>
                    <option value="retainer">Dedicated Engineering Retainer</option>
                  </optgroup>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono uppercase text-cyan-electric tracking-wider">
                  Project Brief & Objectives
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your product, timeline, or current technical bottleneck..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-void-deep/90 border border-cyan-electric/30 text-white text-xs placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-cyan-electric"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 py-3 px-6 rounded-xl font-display text-xs font-bold uppercase tracking-wider text-void bg-gradient-to-r from-cyan-electric via-pink-accent to-cyan-electric hover:opacity-90 shadow-cyan-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <span>Dispatch Project Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Interactive 15-Minute Technical Call Scheduler Modal */}
      {isSchedulerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Schedule 15-Minute Technical Call"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-deep/85 backdrop-blur-xl animate-in fade-in duration-150"
          onClick={() => setIsSchedulerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-void-surface/95 border border-cyan-electric/40 shadow-2xl p-6 flex flex-col gap-4 text-white"
          >
            <button
              type="button"
              onClick={() => setIsSchedulerOpen(false)}
              aria-label="Close scheduler"
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-pink-accent text-text-secondary hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>15-Min Discovery Call</span>
            </div>

            {callBooked ? (
              <div className="py-4 flex flex-col items-center text-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <h3 className="font-display text-lg font-bold">Slot Reserved</h3>
                <p className="text-xs text-text-secondary">
                  Reserved <span className="text-cyan-electric font-mono">{selectedDay} · {selectedSlot}</span> for{' '}
                  <span className="text-white">{callerEmail}</span>.
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent(`15-Min Call Request: ${selectedDay} ${selectedSlot}`)}&body=${encodeURIComponent(`Hi Aditya,\n\nI would like to confirm a 15-minute discovery call for ${selectedDay} at ${selectedSlot}.\n\nMy email: ${callerEmail}`)}`}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-electric text-void shadow-cyan-glow"
                >
                  Send Calendar Invite Email →
                </a>
              </div>
            ) : (
              <form onSubmit={handleConfirmCall} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-mono text-text-dim uppercase block mb-1.5">
                    Preferred Day
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Tomorrow', 'In 2 Days', 'Next Monday'].map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          selectedDay === day
                            ? 'bg-cyan-electric/20 border-cyan-electric text-cyan-electric'
                            : 'bg-void-deep border-white/10 text-text-secondary hover:border-white/30'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-text-dim uppercase block mb-1.5">
                    Select Time Slot
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CALL_SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-1.5 px-3 rounded-lg text-[11px] font-mono border transition-all ${
                          selectedSlot === slot
                            ? 'bg-pink-accent/20 border-pink-accent text-pink-accent font-bold'
                            : 'bg-void-deep border-white/10 text-text-secondary hover:border-white/30'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-text-dim uppercase block mb-1.5">
                    Your Email for Invite
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={callerEmail}
                    onChange={(e) => setCallerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-void-deep border border-cyan-electric/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-electric"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-electric text-void hover:opacity-90 shadow-cyan-glow transition-all"
                >
                  Confirm Time Slot
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;
