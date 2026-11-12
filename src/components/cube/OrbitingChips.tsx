import React, { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { FACES_CONFIG } from '../../config/faces.config';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../ui/audio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const OrbitingChips: React.FC = () => {
  const { activeFaceIndex, selectFaceItem, highlightedComponentId } = useAppStore();
  const prefersReduced = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !prefersReduced && activeFaceIndex !== null) {
      // Gentle harmonic oscillation around the front plane
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.08;
    }
  });

  if (activeFaceIndex === null || prefersReduced) return null;

  const currentFace = FACES_CONFIG[activeFaceIndex];
  const items = currentFace.items;
  const radius = 2.1;

  const handleChipClick = (e: ThreeEvent<MouseEvent>, itemId: string) => {
    e.stopPropagation();
    soundEngine.playTone(750, 0.1);
    selectFaceItem(activeFaceIndex, itemId);
  };

  return (
    <group ref={groupRef} position={[0, 0, 1.45]}>
      {items.map((item, idx) => {
        // Distribute nodes evenly in an orbit
        const total = items.length;
        const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isHighlighted = highlightedComponentId === item.id;

        return (
          <group key={item.id} position={[x, y, 0]}>
            {/* 3D Glowing sphere node */}
            <mesh
              onClick={(e) => handleChipClick(e, item.id)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial
                color={isHighlighted ? '#ff5aa5' : currentFace.colorAccent}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Glowing outer reticle ring */}
            <mesh>
              <ringGeometry args={[0.09, 0.11, 24]} />
              <meshBasicMaterial
                color={isHighlighted ? '#ffffff' : currentFace.colorAccent}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Micro HTML chip badge */}
            <Html
              position={[0, -0.15, 0]}
              center
              distanceFactor={8}
              className="pointer-events-auto"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playTone(750, 0.1);
                  selectFaceItem(activeFaceIndex, item.id);
                }}
                className={`px-2 py-0.5 rounded-full text-[9px] font-mono whitespace-nowrap backdrop-blur-md border transition-all ${
                  isHighlighted
                    ? 'bg-pink-accent text-void font-bold border-white shadow-pink-glow scale-110'
                    : 'bg-void-deep/85 text-text-secondary hover:text-white border-cyan-electric/30 hover:border-cyan-electric'
                }`}
              >
                {item.name}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
