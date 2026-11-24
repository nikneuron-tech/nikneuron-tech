import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { soundEngine } from '../ui/audio';

export const LaserIntro: React.FC = () => {
  const { isIntroActive, skipIntro } = useAppStore();
  const prefersReduced = useReducedMotion();

  const [step, setStep] = useState<'laser' | 'split' | 'brand' | 'done'>('laser');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isIntroActive || prefersReduced) {
      if (prefersReduced) skipIntro();
      return;
    }

    setStep('laser');
    setProgress(0);

    // Laser charging sound
    soundEngine.playLaserShoot();

    // Progress circle timer (6 seconds total)
    const startTime = performance.now();
    const duration = 6000;
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 50);

    // Timeline
    // 1.5s: laser hits bottom & burst
    const t1 = setTimeout(() => {
      soundEngine.playLaserBurst();
      setStep('split');
    }, 1500);

    // 2.2s: brand reveals behind sliding doors
    const t2 = setTimeout(() => {
      setStep('brand');
    }, 2200);

    // 6.2s: complete intro
    const t3 = setTimeout(() => {
      skipIntro();
    }, 6200);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isIntroActive, prefersReduced, skipIntro]);

  if (!isIntroActive || prefersReduced) return null;

  const brandLetters = 'NIKNEURON'.split('');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center pointer-events-auto"
      >
        {/* Skip Intro Button */}
        <button
          onClick={skipIntro}
          className="absolute top-6 right-8 z-[1000] flex items-center gap-2.5 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold text-text-secondary bg-void-surface/75 border border-cyan-electric/30 hover:border-cyan-electric hover:text-white shadow-cyan-glow backdrop-blur-xl transition-all"
        >
          <span>Skip Intro</span>
          <svg className="w-3.5 h-3.5 -rotate-90">
            <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
            <circle
              cx="7"
              cy="7"
              r="5"
              stroke="#4fd8ff"
              strokeWidth="2"
              fill="none"
              strokeDasharray="31.4"
              strokeDashoffset={31.4 - (31.4 * progress) / 100}
            />
          </svg>
        </button>

        {/* Laser Beam shooting down exact center */}
        {step === 'laser' && (
          <div className="absolute inset-0 pointer-events-none z-50 flex justify-center">
            <motion.div
              initial={{ height: '0%' }}
              animate={{ height: '100%' }}
              transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="w-[3px] bg-white shadow-[0_0_14px_#4fd8ff,0_0_35px_#4fd8ff,0_0_65px_#0a3cff]"
            />
            <motion.div
              initial={{ top: '0%', opacity: 1 }}
              animate={{ top: '100%', opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_25px_10px_#ffffff,0_0_60px_25px_#4fd8ff,0_0_100px_50px_#0a3cff]"
            />
          </div>
        )}

        {/* Screen Flash upon laser flare */}
        {step === 'split' && (
          <motion.div
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.95)_0%,rgba(79,216,255,0.6)_35%,transparent_75%)] pointer-events-none"
          />
        )}

        {/* Sliding Vault Doors that split open revealing the nebula */}
        <motion.div
          animate={{ x: step === 'split' || step === 'brand' ? '-101%' : '0%' }}
          transition={{ duration: 1.3, ease: [0.86, 0, 0.07, 1] }}
          className="absolute top-0 bottom-0 left-0 w-[50.2%] bg-void-deep border-r border-cyan-electric/25 shadow-2xl z-30"
        />
        <motion.div
          animate={{ x: step === 'split' || step === 'brand' ? '101%' : '0%' }}
          transition={{ duration: 1.3, ease: [0.86, 0, 0.07, 1] }}
          className="absolute top-0 bottom-0 right-0 w-[50.2%] bg-void-deep border-l border-cyan-electric/25 shadow-2xl z-30"
        />

        {/* Behind Doors: HD Nikneuron Logo Ignites & Brand Letter Stagger */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-6">
          {/* HD Logo Badge ignites from a point of light */}
          <motion.div
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{
              scale: step === 'brand' ? 1 : 0.1,
              opacity: step === 'brand' ? 1 : 0,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-28 h-28 md:w-32 md:h-32 mb-6 relative flex items-center justify-center rounded-full border border-cyan-electric/45 shadow-cyan-lg overflow-hidden bg-void-deep"
          >
            <img
              src="/logo-hd.png"
              alt="Nikneuron Emblem"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* N-I-K-N-E-U-R-O-N rises in letter by letter */}
          <div className="flex justify-center font-display text-4xl md:text-6xl font-extrabold tracking-[0.35em] ml-[0.35em] text-white text-glow-cyan mb-4">
            {brandLetters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 35, filter: 'blur(16px)' }}
                animate={{
                  opacity: step === 'brand' ? 1 : 0,
                  y: step === 'brand' ? 0 : 35,
                  filter: step === 'brand' ? 'blur(0px)' : 'blur(16px)',
                }}
                transition={{
                  duration: 0.7,
                  delay: step === 'brand' ? 0.3 + i * 0.12 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{
              opacity: step === 'brand' ? 1 : 0,
              y: step === 'brand' ? 0 : 18,
            }}
            transition={{ duration: 0.9, delay: step === 'brand' ? 1.5 : 0 }}
            className="font-body text-xs md:text-sm tracking-[0.22em] uppercase text-cyan-electric text-glow-cyan font-light"
          >
            Interfaces for the world that's coming
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
