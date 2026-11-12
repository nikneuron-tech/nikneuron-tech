import React, { useState } from 'react';
import { SITE_CONFIG } from '../../config/site.config';
import { ChevronDown, HelpCircle } from 'lucide-react';
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
    </section>
  );
};

export default FAQSection;
