import React, { useState } from 'react';
import { SITE_CONFIG } from '../../config/site.config';
import { ChevronDown, HelpCircle, ArrowRight, ArrowDown, MessageSquare, Sparkles } from 'lucide-react';
import { soundEngine } from '../ui/audio';

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']);

  const toggleItem = (id: string) => {
    soundEngine.playTone(550, 0.08);
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="relative z-20 py-24 px-4 sm:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-12 text-center items-center">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-electric uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-electric" />
          <span>Clarity & Terms // FAQ</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-text-secondary max-w-xl">
          Everything you need to know about timelines, code ownership, and how we work together.
        </p>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-3">
        {SITE_CONFIG.faqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);

          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-void-surface/90 border border-cyan-electric/25 overflow-hidden shadow-glass backdrop-blur-xl transition-colors hover:border-cyan-electric/50"
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display text-sm sm:text-base font-bold text-white hover:text-cyan-electric transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-electric"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-cyan-electric shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-pink-accent' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Interlinking Transition */}
      <div className="mt-14 p-6 rounded-2xl bg-void-surface/75 border border-cyan-electric/25 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-accent/15 border border-pink-accent/30 flex items-center justify-center text-pink-accent shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-white">Have a Unique Question or Requirement?</h3>
            <p className="text-xs text-text-secondary">Work directly with Aditya Tamta. Guaranteed reply within 24 hours.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 shrink-0">
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-electric text-void hover:opacity-90 transition-all flex items-center gap-1.5 shadow-cyan-glow"
          >
            <span>Send Project Inquiry</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
          <a
            href={SITE_CONFIG.contact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:text-void transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
