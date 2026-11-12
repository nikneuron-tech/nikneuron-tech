import React from 'react';
import { Github, Linkedin, Twitter, Mail, ArrowUp, MessageSquare } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site.config';
import { soundEngine } from '../ui/audio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundEngine.playTone(600, 0.1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-cyan-electric/20 bg-void-deep/90 backdrop-blur-2xl text-white pt-16 pb-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/logo-hd.png"
                alt="Nikneuron HD Logo"
                className="w-12 h-12 rounded-full border border-cyan-electric/35 shadow-cyan-glow object-cover"
              />
              <span className="font-display text-xl font-bold tracking-tight">
                <span className="text-white">Nik</span>
                <span className="bg-gradient-to-r from-[#00e5ff] via-[#2979ff] to-[#651fff] bg-clip-text text-transparent">
                  neuron
                </span>
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-electric/90 tracking-wider uppercase">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md">
              {SITE_CONFIG.subtagline}
            </p>
            <p className="text-xs text-text-dim italic font-mono pt-2">
              "{SITE_CONFIG.founder.motto}"
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono uppercase text-cyan-electric tracking-wider font-semibold">
              Navigation
            </span>
            <div className="flex flex-col gap-1.5 text-xs text-text-secondary">
              {SITE_CONFIG.navigation.map((nav) => (
                <a
                  key={nav.href}
                  href={nav.href}
                  className="hover:text-cyan-electric transition-colors"
                >
                  {nav.label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect & Socials */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-cyan-electric tracking-wider font-semibold">
              Direct Contact
            </span>
            <p className="text-xs text-text-secondary leading-snug">
              Work directly with Aditya Tamta. Replies guaranteed within 24 hours.
            </p>
            <div className="flex flex-col gap-1 text-xs font-mono">
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-cyan-electric hover:text-white transition-colors"
              >
                {SITE_CONFIG.contact.email}
              </a>
              <a
                href={SITE_CONFIG.contact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-300 hover:text-white transition-colors"
              >
                WhatsApp: {SITE_CONFIG.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.socials.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                className="w-8 h-8 rounded-full border border-cyan-electric/30 flex items-center justify-center text-text-secondary hover:text-white hover:border-cyan-electric transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                className="w-8 h-8 rounded-full border border-cyan-electric/30 flex items-center justify-center text-text-secondary hover:text-white hover:border-cyan-electric transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.twitter}
                target="_blank"
                rel="noreferrer"
                title="Twitter / X"
                className="w-8 h-8 rounded-full border border-cyan-electric/30 flex items-center justify-center text-text-secondary hover:text-white hover:border-cyan-electric transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.contact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                title={`WhatsApp (${SITE_CONFIG.contact.phone})`}
                className="w-8 h-8 rounded-full border border-emerald-400/40 flex items-center justify-center text-emerald-300 hover:text-white hover:border-emerald-300 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.email}
                title={`Email (${SITE_CONFIG.contact.email})`}
                className="w-8 h-8 rounded-full border border-cyan-electric/30 flex items-center justify-center text-text-secondary hover:text-white hover:border-cyan-electric transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-dim font-mono">
          <span>
            © {new Date().getFullYear()} {SITE_CONFIG.brandName} · Engineered by {SITE_CONFIG.founder.name}. All rights reserved.
          </span>

          <div className="flex items-center gap-4">
            <span className="text-cyan-electric/70">React 18 · Three.js · TypeScript · Tailwind</span>
            <button
              onClick={scrollToTop}
              title="Return to top"
              className="flex items-center gap-1 text-cyan-electric hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
