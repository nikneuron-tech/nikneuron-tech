import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Stars } from './Stars';
import { ShootingStar } from './ShootingStar';

export const NebulaBackground: React.FC = () => {
  const { activeFaceIndex } = useAppStore();
  const prefersReduced = useReducedMotion();
  const [imgError, setImgError] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const xRatio = e.clientX / window.innerWidth - 0.5;
      const yRatio = e.clientY / window.innerHeight - 0.5;
      setParallax({ x: xRatio * 18, y: yRatio * 18 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced]);

  const isDimmed = activeFaceIndex !== null;

  return (
    <div
      style={{
        transform: prefersReduced ? 'none' : `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        filter: isDimmed ? 'blur(6px) brightness(0.4)' : 'none',
      }}
      className="fixed inset-[-5%] w-[110%] h-[110%] pointer-events-none transition-[filter,transform] duration-500 ease-out z-0"
    >
      {/* 1. Nebula Image with Ken Burns drift & scale */}
      {!imgError ? (
        <div
          style={{ backgroundImage: `url('/nebula.jpg')` }}
          className={`absolute inset-0 bg-center bg-cover bg-no-repeat ${
            prefersReduced ? '' : 'animate-[nebulaDrift_60s_ease-in-out_infinite_alternate]'
          }`}
          onError={() => setImgError(true)}
        />
      ) : null}

      {/* 2. Fallback CSS Radial Gradient */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          imgError ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            radial-gradient(circle at 60% 40%, rgba(42, 16, 96, 0.75) 0%, transparent 55%),
            radial-gradient(circle at 35% 65%, rgba(10, 26, 92, 0.8) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, #0a1a5c 0%, #050612 85%)
          `,
        }}
      />

      {/* 3. Twinkling Stars */}
      <Stars />

      {/* 4. Ambient Glowing Cube Halo Tint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,216,255,0.28)_0%,rgba(10,60,255,0.14)_40%,transparent_70%)] blur-3xl mix-blend-screen animate-pulse-subtle" />

      {/* 5. Shooting Star */}
      <ShootingStar />

      {/* 6. Dark Overlay & Radial Vignette */}
      <div className="absolute inset-0 bg-[rgba(5,6,18,0.45)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(5,6,18,0.65)_70%,rgba(2,3,8,0.94)_100%)]" />

      <style>{`
        @keyframes nebulaDrift {
          0% { transform: scale(1.00) translate(0, 0); }
          50% { transform: scale(1.04) translate(-0.8%, 0.5%); }
          100% { transform: scale(1.08) translate(0.8%, -0.8%); }
        }
      `}</style>
    </div>
  );
};
