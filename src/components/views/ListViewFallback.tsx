import React, { useState, useMemo } from 'react';
import { Search, Box, Check, ArrowRight, Filter, Sparkles, Calendar, Star, Columns } from 'lucide-react';
import { ALL_SERVICES_CONFIG, BUNDLE_PACKAGES, ServiceConfig, getServiceByIndex } from '../../config/services.config';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';
import { TrustStrip } from '../sections/TrustStrip';
import { ProjectsSection } from '../sections/ProjectsSection';
import { PlaygroundSection } from '../sections/PlaygroundSection';
import { ProcessSection } from '../sections/ProcessSection';
import { AboutSection } from '../sections/AboutSection';
import { EngagementSection } from '../sections/EngagementSection';
import { FAQSection } from '../sections/FAQSection';
import { ContactSection } from '../sections/ContactSection';
import { GradientSkewCard } from '../ui/gradient-card-showcase';

export const ListViewFallback: React.FC = () => {
  const {
    setViewMode,
    selectFaceItem,
    setLiveAnnouncement,
    favorites,
    toggleFavorite,
    compareList,
    toggleCompareItem,
    openCompare,
    startInquiry,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    ALL_SERVICES_CONFIG.forEach((svc) => {
      svc.tags.forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort();
  }, []);

  // Filtered services
  const filteredServices = useMemo(() => {
    return ALL_SERVICES_CONFIG.filter((svc) => {
      if (activeTag && !svc.tags.includes(activeTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = svc.title.toLowerCase().includes(q);
        const matchesTagline = svc.tagline.toLowerCase().includes(q);
        const matchesTags = svc.tags.some((t) => t.toLowerCase().includes(q));
        const matchesBenefits = svc.benefits.some((b) => b.toLowerCase().includes(q));
        return matchesTitle || matchesTagline || matchesTags || matchesBenefits;
      }
      return true;
    });
  }, [searchQuery, activeTag]);

  const handleInspectIn3D = (service: ServiceConfig) => {
    soundEngine.playSnapHolo();
    setViewMode('cube');
    selectFaceItem(service.faceIndex, service.id);
    setLiveAnnouncement(`Navigating to 3D cube view for ${getServiceByIndex(service.faceIndex).title}`);
  };

  return (
    <main
      id="services"
      role="main"
      className="relative w-full h-full overflow-y-auto px-4 md:px-12 py-24 bg-void text-white font-body selection:bg-pink-accent selection:text-void"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-32">
        {/* Header HUD */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyan-electric/20 pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-electric animate-pulse shadow-cyan-glow" />
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-electric font-bold">
                Accessible Service Directory // 2D Fallback
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-white">
              Nikneuron IT Services
            </h1>
            <p className="text-xs md:text-sm text-text-secondary max-w-xl font-light leading-relaxed">
              Explore our core technological capabilities, enterprise architectures, and digital transformation solutions. All services sync in real-time with the 3D Holographic Cube.
            </p>
          </div>

          {/* Quick Stats & 3D Return */}
          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={() => openCompare()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-pink-accent bg-pink-accent/15 border border-pink-accent shadow-pink-glow transition-all"
              >
                <Columns className="w-4 h-4" />
                <span>Compare ({compareList.length})</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.playSnapHolo();
                setViewMode('cube');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-display text-xs font-bold text-void bg-cyan-electric hover:bg-cyan-electric/90 shadow-cyan-glow transition-all"
            >
              <Box className="w-4 h-4 text-void" />
              <span>Back to 3D Cube</span>
            </button>
          </div>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-void-surface/50 border border-cyan-electric/20 backdrop-blur-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-electric pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword (e.g. calls, email, design, security)..."
              aria-label="Filter Nikneuron services"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-void-deep/90 border border-cyan-electric/25 text-white placeholder-text-dim outline-none focus:border-cyan-electric focus:ring-1 focus:ring-cyan-electric/30 transition-all font-sans"
            />
          </div>

          {/* Tags scroll row */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-electric" />
              <span>Tags:</span>
            </span>
            <button
              onClick={() => setActiveTag(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${activeTag === null
                ? 'bg-cyan-electric text-void font-bold shadow-cyan-glow'
                : 'bg-white/5 text-text-dim hover:text-white'
                }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${activeTag === tag
                  ? 'bg-pink-accent text-void font-bold shadow-pink-glow'
                  : 'bg-white/5 text-text-dim hover:text-white'
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {filteredServices.map((service) => {
            const isFavorite = favorites.includes(service.id);
            const isCompared = compareList.includes(service.id);

            return (
              <GradientSkewCard
                key={service.id}
                gradientFrom={service.accentColor}
                gradientTo="#4fd8ff"
                contentClassName="p-6 gap-6"
              >
                <div className="flex flex-col gap-4">
                  {/* Top Thumbnail & Badges */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-void p-1 flex items-center justify-center">
                    <img
                      src={service.thumbnailPath}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Face Index Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-void-deep/85 border border-white/20 text-[10px] font-mono font-bold text-white">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-ping"
                        style={{ backgroundColor: service.accentColor }}
                      />
                      <span>Face 0{service.faceIndex + 1}</span>
                    </div>

                    {/* Quick Favorite & Compare */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFavorite(service.id)}
                        title={isFavorite ? 'Remove from shortlist' : 'Add to shortlist'}
                        className={`p-1.5 rounded-full bg-void-deep/85 border transition-all ${isFavorite
                          ? 'border-pink-accent text-pink-accent shadow-pink-glow'
                          : 'border-white/20 text-text-dim hover:text-white'
                          }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-pink-accent' : ''}`} />
                      </button>

                      <button
                        onClick={() => toggleCompareItem(service.id)}
                        title={isCompared ? 'Remove from compare' : 'Add to compare'}
                        className={`p-1.5 rounded-full bg-void-deep/85 border transition-all ${isCompared
                          ? 'border-cyan-electric text-cyan-electric shadow-cyan-glow'
                          : 'border-white/20 text-text-dim hover:text-white'
                          }`}
                      >
                        <Columns className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="flex flex-col gap-1">
                    <h2 className="font-display text-lg font-bold text-white tracking-tight">
                      {service.title}
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Key Benefits List */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono text-cyan-electric uppercase tracking-wider font-bold">
                      Highlights:
                    </span>
                    <ul className="flex flex-col gap-1.5">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                          <Check
                            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                            style={{ color: service.accentColor }}
                          />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {service.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-text-dim"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleInspectIn3D(service)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-display text-xs font-bold text-void bg-cyan-electric hover:bg-cyan-electric/90 shadow-cyan-glow transition-all"
                  >
                    <span>Explore in 3D Cube</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTone(650, 0.1);
                      startInquiry({
                        serviceType: service.id,
                        brief: `Inquiring about ${service.title} (${service.tagline}).`,
                      });
                    }}
                    className="flex items-center justify-center p-2.5 rounded-xl text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-electric transition-all"
                    title="Book a demo / contact"
                  >
                    <Calendar className="w-4 h-4 text-cyan-electric" />
                  </button>
                </div>
              </GradientSkewCard>
            );
          })}
        </div>

        {/* Bundle Packages */}
        <div id="bundles" className="flex flex-col gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-widest text-pink-accent font-bold">
              Bundle Packages
            </span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">
              Ready-to-Launch Service Bundles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUNDLE_PACKAGES.map((bundle) => (
              <GradientSkewCard
                key={bundle.id}
                gradientFrom={bundle.gradientFrom}
                gradientTo={bundle.gradientTo}
                highlighted={bundle.highlighted}
                contentClassName="p-6"
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-1">{bundle.name}</h3>
                  <p className="text-xs text-text-secondary mb-4">{bundle.tagline}</p>
                  <ul className="flex flex-col gap-1.5 mb-5 text-xs text-white">
                    {bundle.included.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-electric shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTone(680, 0.1);
                    startInquiry({
                      serviceType: bundle.id,
                      brief: `Interested in the ${bundle.name} Bundle (${bundle.included.join(' + ')}).`,
                    });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-void hover:bg-[#ffcf4d] transition-all flex items-center justify-center gap-2"
                >
                  <span>{bundle.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </GradientSkewCard>
            ))}
          </div>
        </div>

        {/* 2D Mode Content Sections Parity */}
        <div className="flex flex-col gap-12 mt-8 pt-8 border-t border-white/10">
          <TrustStrip />
          <ProjectsSection />
          <PlaygroundSection />
          <ProcessSection />
          <AboutSection />
          <EngagementSection />
          <FAQSection />
          <ContactSection />
        </div>
      </div>
    </main>
  );
};
