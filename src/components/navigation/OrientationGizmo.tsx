import React from 'react';
import { Compass } from 'lucide-react';
import { SERVICES_CONFIG, getServiceByIndex } from '../../config/services.config';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';

export interface OrientationGizmoProps {
  className?: string;
}

export const OrientationGizmo: React.FC<OrientationGizmoProps> = ({ className }) => {
  const {
    frontFaceIndex,
    setActiveFace,
  } = useAppStore();

  const currentService = getServiceByIndex(frontFaceIndex);

  const handleFaceClick = (index: number) => {
    soundEngine.playSnapHolo();
    setActiveFace(index);
  };

  // 6 faces layout in unfolded cube / isometric spatial map:
  //              [Top: 2 (Custom Software)]
  // [Left: 1 (Batch Mail)] [Front: 4 (AI Receptionist)] [Right: 0 (UI/UX & Web)] [Back: 5 (AI & Chat)]
  //              [Bottom: 3 (Support & Growth)]
  const topSvc = getServiceByIndex(2);
  const leftSvc = getServiceByIndex(1);
  const frontSvc = getServiceByIndex(4);
  const rightSvc = getServiceByIndex(0);
  const backSvc = getServiceByIndex(5);
  const bottomSvc = getServiceByIndex(3);

  return (
    <aside
      aria-label="Cube Spatial Orientation Gizmo"
      className={`pointer-events-auto hidden sm:flex flex-col gap-2 p-3 rounded-2xl bg-void-deep/85 border border-cyan-electric/25 backdrop-blur-xl shadow-glass ${className || ''}`}
    >
      {/* Header HUD */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-cyan-electric text-[10px] font-mono font-bold tracking-wider uppercase">
          <Compass className="w-3.5 h-3.5 text-cyan-electric animate-spin-slow" />
          <span>GIZMO // {currentService.title}</span>
        </div>
        <span
          className="w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: currentService.accentColor }}
        />
      </div>

      {/* Mini Unfolded Cube Face Matrix */}
      <div className="grid grid-cols-4 grid-rows-3 gap-1 w-28 h-20 items-center justify-center p-1">
        {/* Row 1: Top (+Y, Face 2) */}
        <div className="col-start-2 row-start-1 flex justify-center">
          <button
            onClick={() => handleFaceClick(2)}
            title={`Top Face: ${topSvc.title} (+Y)`}
            aria-label={`Rotate to Top Face: ${topSvc.title}`}
            className={`w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
              frontFaceIndex === 2
                ? 'bg-cyan-electric text-void shadow-cyan-glow scale-110 font-black'
                : 'bg-white/10 text-text-dim hover:text-white hover:bg-white/20'
            }`}
          >
            TOP
          </button>
        </div>

        {/* Row 2: Left (-X, Face 1), Front (+Z, Face 4), Right (+X, Face 0), Back (-Z, Face 5) */}
        <div className="col-start-1 row-start-2 flex justify-center">
          <button
            onClick={() => handleFaceClick(1)}
            title={`Left Face: ${leftSvc.title} (-X)`}
            aria-label={`Rotate to Left Face: ${leftSvc.title}`}
            className={`w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
              frontFaceIndex === 1
                ? 'bg-cyan-electric text-void shadow-cyan-glow scale-110 font-black'
                : 'bg-white/10 text-text-dim hover:text-white hover:bg-white/20'
            }`}
          >
            LFT
          </button>
        </div>

        <div className="col-start-2 row-start-2 flex justify-center">
          <button
            onClick={() => handleFaceClick(4)}
            title={`Front Face: ${frontSvc.title} (+Z)`}
            aria-label={`Rotate to Front Face: ${frontSvc.title}`}
            className={`w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
              frontFaceIndex === 4
                ? 'bg-cyan-electric text-void shadow-cyan-glow scale-110 font-black ring-1 ring-white'
                : 'bg-white/10 text-text-dim hover:text-white hover:bg-white/20'
            }`}
          >
            FWD
          </button>
        </div>

        <div className="col-start-3 row-start-2 flex justify-center">
          <button
            onClick={() => handleFaceClick(0)}
            title={`Right Face: ${rightSvc.title} (+X)`}
            aria-label={`Rotate to Right Face: ${rightSvc.title}`}
            className={`w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
              frontFaceIndex === 0
                ? 'bg-cyan-electric text-void shadow-cyan-glow scale-110 font-black'
                : 'bg-white/10 text-text-dim hover:text-white hover:bg-white/20'
            }`}
          >
            RGT
          </button>
        </div>

        <div className="col-start-4 row-start-2 flex justify-center">
          <button
            onClick={() => handleFaceClick(5)}
            title={`Back Face: ${backSvc.title} (-Z)`}
            aria-label={`Rotate to Back Face: ${backSvc.title}`}
            className={`w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
              frontFaceIndex === 5
                ? 'bg-cyan-electric text-void shadow-cyan-glow scale-110 font-black'
                : 'bg-white/10 text-text-dim hover:text-white hover:bg-white/20'
            }`}
          >
            BCK
          </button>
        </div>

        {/* Row 3: Bottom (-Y, Face 3) */}
        <div className="col-start-2 row-start-3 flex justify-center">
          <button
            onClick={() => handleFaceClick(3)}
            title={`Bottom Face: ${bottomSvc.title} (-Y)`}
            aria-label={`Rotate to Bottom Face: ${bottomSvc.title}`}
            className={`w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
              frontFaceIndex === 3
                ? 'bg-cyan-electric text-void shadow-cyan-glow scale-110 font-black'
                : 'bg-white/10 text-text-dim hover:text-white hover:bg-white/20'
            }`}
          >
            BTM
          </button>
        </div>
      </div>

      <div className="text-[9px] font-mono text-text-dim text-center">
        Click a face to align
      </div>
    </aside>
  );
};
