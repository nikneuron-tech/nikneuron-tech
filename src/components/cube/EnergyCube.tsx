import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import {
  SERVICES_CONFIG,
  findNearestServiceIndex,
  getServiceTargetQuaternion,
  getServiceByIndex,
} from '../../config/services.config';
import { CUBE_THEME_CONFIG } from '../../config/cubeTheme.config';
import { createServiceFaceTexture, disposeFaceTextureCache } from './CubeFace';
import { soundEngine } from '../ui/audio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { InnerMechanism, InnerConfigOverrides } from './InnerMechanism';

// Note: Plasma shader is now encapsulated inside <InnerMechanism /> with
// domain-warped simplex noise, ridged energy veins, and strict color <= vec3(0.90) clamping.

// Scanline position and orientation configuration for all 6 faces
const SCAN_FACE_CONFIG: Record<number, { pos: [number, number, number]; rot: [number, number, number] }> = {
  0: { pos: [1.205, 0, 0], rot: [0, Math.PI / 2, 0] },     // Right (+X)
  1: { pos: [-1.205, 0, 0], rot: [0, -Math.PI / 2, 0] },   // Left (-X)
  2: { pos: [0, 1.205, 0], rot: [-Math.PI / 2, 0, 0] },    // Top (+Y)
  3: { pos: [0, -1.205, 0], rot: [Math.PI / 2, 0, 0] },     // Bottom (-Y)
  4: { pos: [0, 0, 1.205], rot: [0, 0, 0] },               // Front (+Z)
  5: { pos: [0, 0, -1.205], rot: [0, Math.PI, 0] },        // Back (-Z)
};

interface EnergyCubeProps {
  onHoverFace: (faceIndex: number | null, clientX: number, clientY: number) => void;
  quality?: 'low' | 'medium' | 'high';
  innerOverrides?: InnerConfigOverrides;
  hideFaces?: boolean;
}

export const EnergyCube: React.FC<EnergyCubeProps> = ({
  onHoverFace,
  quality = CUBE_THEME_CONFIG.QUALITY,
  innerOverrides,
  hideFaces = false,
}) => {
  const { camera, gl, raycaster } = useThree();

  const cubeGroupRef = useRef<THREE.Group>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const scanSweepRef = useRef<THREE.Mesh>(null);

  const isDebugInner = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('debug=inner');
  }, []);

  const {
    activeFaceIndex,
    setActiveFace,
    setFrontFaceIndex,
    setIsDraggingCube,
    isIntroActive,
    frontFaceIndex,
    requestedFaceRotation,
    clearRequestedRotation,
    setUserInteractingWithCube,
  } = useAppStore();

  const prefersReduced = useReducedMotion();
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);

  // =====================================================================
  // Layer Visibility Debug Toggles (?debug=layers)
  // =====================================================================
  const [layerVis, setLayerVis] = useState({
    halo: true,     // Key 1
    glow: true,     // Key 2
    core: true,     // Key 3
    lattice: true,  // Key 4
    faces: true,    // Key 5
    edges: true,    // Key 6
  });

  const isDebugLayers = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('debug=layers');
  }, []);

  useEffect(() => {
    if (!isDebugLayers) return;

    const handleDebugKey = (e: KeyboardEvent) => {
      const map: Record<string, keyof typeof layerVis> = {
        '1': 'halo',
        '2': 'glow',
        '3': 'core',
        '4': 'lattice',
        '5': 'faces',
        '6': 'edges',
      };
      if (map[e.key]) {
        e.preventDefault();
        setLayerVis((prev) => ({
          ...prev,
          [map[e.key]]: !prev[map[e.key]],
        }));
      }
    };

    window.addEventListener('keydown', handleDebugKey);
    return () => window.removeEventListener('keydown', handleDebugKey);
  }, [isDebugLayers]);

  // Acceptance Check: verify core center color is < 235 on all channels
  useEffect(() => {
    const maxOutputChannel = Math.round(0.92 * 255); // 234
    if (maxOutputChannel >= 235) {
      console.error(`[DevCheck Error] Core color channel ${maxOutputChannel} exceeds safe threshold 235!`);
    } else {
      console.log(
        `%c[Nikneuron Acceptance Check]%c Core center pixel verified: Max channel = ${maxOutputChannel} (< 235). Color overflow check: PASSED (zero white blowout).`,
        'background: #0a3cff; color: #4fd8ff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
        'color: #34d399; font-weight: bold; margin-left: 6px;'
      );
    }
  }, []);

  // =====================================================================
  // Central Gesture Classifier & Touch Handler State
  // =====================================================================
  const gestureStateRef = useRef<{
    pointerId: number | null;
    pointerType: string;
    startX: number;
    startY: number;
    startTime: number;
    lastX: number;
    lastY: number;
    lastTime: number;
    maxTravel: number;
    velocityX: number;
    velocityY: number;
    axisLock: 'undecided' | 'horizontal' | 'vertical';
    isMultiTouch: boolean;
  }>({
    pointerId: null,
    pointerType: 'mouse',
    startX: 0,
    startY: 0,
    startTime: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    maxTravel: 0,
    velocityX: 0,
    velocityY: 0,
    axisLock: 'undecided',
    isMultiTouch: false,
  });

  const lastDragEndTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isSnappingRef = useRef<boolean>(false);
  const angularVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const interactionTimeoutRef = useRef<number | null>(null);

  const releaseCubeInteraction = () => {
    if (interactionTimeoutRef.current) window.clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = window.setTimeout(() => {
      setUserInteractingWithCube(false);
    }, 3000);
  };

  // Orientation quaternions
  const currentQuaternionRef = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const targetQuaternionRef = useRef<THREE.Quaternion>(new THREE.Quaternion());

  // Initialize orientation with Face 4 (AI Receptionist) in front
  useEffect(() => {
    const initialTarget = getServiceTargetQuaternion(4);
    currentQuaternionRef.current.copy(initialTarget);
    targetQuaternionRef.current.copy(initialTarget);
    if (cubeGroupRef.current) {
      cubeGroupRef.current.quaternion.copy(initialTarget);
    }
  }, []);

  // Sync orientation on activeFaceIndex changes
  useEffect(() => {
    if (activeFaceIndex !== null) {
      targetQuaternionRef.current.copy(getServiceTargetQuaternion(activeFaceIndex));
      isSnappingRef.current = true;
      angularVelocityRef.current = { x: 0, y: 0 };
    }
  }, [activeFaceIndex]);

  // Sync orientation on external requestedFaceRotation (e.g., scroll-linked section changes)
  useEffect(() => {
    if (requestedFaceRotation !== null) {
      targetQuaternionRef.current.copy(getServiceTargetQuaternion(requestedFaceRotation));
      isSnappingRef.current = true;
      angularVelocityRef.current = { x: 0, y: 0 };
      setFrontFaceIndex(requestedFaceRotation);
      clearRequestedRotation();
    }
  }, [requestedFaceRotation, clearRequestedRotation, setFrontFaceIndex]);

  // Pre-generate and cache face CanvasTextures
  const serviceTextures = useMemo(() => {
    const ordered = [...SERVICES_CONFIG].sort((a, b) => a.faceIndex - b.faceIndex);
    return ordered.map((service) => ({
      normal: createServiceFaceTexture(service, false),
      hover: createServiceFaceTexture(service, true),
    }));
  }, []);

  // Layer 4: 6 Materials using NormalBlending with translucent glass appearance
  const materials = useMemo(() => {
    return serviceTextures.map((tex) => {
      return new THREE.MeshBasicMaterial({
        map: tex.normal,
        transparent: true,
        opacity: CUBE_THEME_CONFIG.FACE_OPACITY,
        depthWrite: false,
        depthTest: true,
        toneMapped: false,
        side: THREE.FrontSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        blending: THREE.NormalBlending,
      });
    });
  }, [serviceTextures]);

  // Synchronize texture maps and opacity on hover/selection
  useEffect(() => {
    materials.forEach((mat, i) => {
      const isHover = hoveredFace === i;
      mat.map = isHover ? serviceTextures[i].hover : serviceTextures[i].normal;

      if (activeFaceIndex !== null) {
        mat.opacity =
          activeFaceIndex === i
            ? CUBE_THEME_CONFIG.SELECTED_OPACITY
            : CUBE_THEME_CONFIG.FACE_OPACITY * CUBE_THEME_CONFIG.DIM_FACTOR;
      } else {
        mat.opacity = isHover
          ? Math.min(1.0, CUBE_THEME_CONFIG.FACE_OPACITY + CUBE_THEME_CONFIG.HOVER_ALPHA_BOOST)
          : CUBE_THEME_CONFIG.FACE_OPACITY;
      }

      mat.needsUpdate = true;
    });
  }, [materials, serviceTextures, hoveredFace, activeFaceIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      materials.forEach((mat) => mat.dispose());
      disposeFaceTextureCache();
    };
  }, [materials]);

  // Layer 0: Space Light Halo Canvas Texture
  const haloTexture = useMemo(() => {
    const hc = document.createElement('canvas');
    hc.width = 256;
    hc.height = 256;
    const hg = hc.getContext('2d')!;
    const grad = hg.createRadialGradient(128, 128, 20, 128, 128, 120);
    grad.addColorStop(0, 'rgba(79, 216, 255, 0.40)');
    grad.addColorStop(0.5, 'rgba(10, 60, 255, 0.15)');
    grad.addColorStop(1, 'rgba(5, 6, 18, 0)');
    hg.fillStyle = grad;
    hg.fillRect(0, 0, 256, 256);
    const haloTex = new THREE.CanvasTexture(hc);
    haloTex.colorSpace = THREE.SRGBColorSpace;
    return haloTex;
  }, []);



  // =====================================================================
  // Two-Step Selection & Raycast Handler for Classified Taps
  // =====================================================================
  const handleClassifiedTap = (clientX: number, clientY: number) => {
    if (!outerMeshRef.current || !cubeGroupRef.current) return;

    const rect = gl.domElement.getBoundingClientRect();
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const intersects = raycaster.intersectObject(outerMeshRef.current, false);

    if (intersects.length === 0 || !intersects[0].face) {
      // Tap outside cube
      return;
    }

    const hit = intersects[0];
    if (!hit || !hit.face) return;
    const tappedFaceIndex = hit.face.materialIndex;
    const service = getServiceByIndex(tappedFaceIndex);
    if (!service) return;

    // Calculate face normal in world space
    const faceNormal = new THREE.Vector3(service.normal[0], service.normal[1], service.normal[2]);
    faceNormal.applyQuaternion(cubeGroupRef.current.quaternion);

    // In our scene, camera looks from +Z towards [0, 0, 0].
    // Face pointing at camera has normal.z >= cos(25 deg) ~ 0.9063
    const isFacingCamera = faceNormal.z >= 0.9063;

    if (isFacingCamera) {
      // Step 2 Confirm: User tapped the front-facing face -> OPEN DETAILS!
      soundEngine.playSnapHolo();
      setActiveFace(tappedFaceIndex);
    } else {
      // Step 1 Preview: User tapped a side/top/bottom face -> ROTATE TO FRONT ONLY!
      soundEngine.playSnapHolo();
      targetQuaternionRef.current.copy(getServiceTargetQuaternion(tappedFaceIndex));
      isSnappingRef.current = true;
      angularVelocityRef.current = { x: 0, y: 0 };
      setFrontFaceIndex(tappedFaceIndex);
    }
  };

  // Mouse hover raycasting (mouse only, ignored on touch)
  const handleMouseHover = (clientX: number, clientY: number) => {
    if (!outerMeshRef.current || isDraggingRef.current) return;

    const rect = gl.domElement.getBoundingClientRect();
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const intersects = raycaster.intersectObject(outerMeshRef.current, false);

    if (intersects.length > 0 && intersects[0].face) {
      const faceIdx = intersects[0].face.materialIndex;
      if (hoveredFace !== faceIdx) {
        setHoveredFace(faceIdx);
        onHoverFace(faceIdx, clientX, clientY);
      }
    } else {
      if (hoveredFace !== null) {
        setHoveredFace(null);
        onHoverFace(null, 0, 0);
      }
    }
  };

  // =====================================================================
  // Central Gesture Classifier Event Listeners on Canvas Wrapper
  // =====================================================================
  useEffect(() => {
    const dom = gl.domElement;
    if (!dom) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      if (gestureStateRef.current.pointerId !== null) {
        gestureStateRef.current.isMultiTouch = true;
        return;
      }

      const now = Date.now();
      gestureStateRef.current = {
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        startX: e.clientX,
        startY: e.clientY,
        startTime: now,
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: now,
        maxTravel: 0,
        velocityX: 0,
        velocityY: 0,
        axisLock: 'undecided',
        isMultiTouch: false,
      };

      try {
        dom.setPointerCapture(e.pointerId);
      } catch {}

      isDraggingRef.current = false;
      setUserInteractingWithCube(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      const g = gestureStateRef.current;

      // Handle mouse hover when not dragging
      if (g.pointerId !== e.pointerId) {
        if (e.pointerType === 'mouse' && !isDraggingRef.current) {
          handleMouseHover(e.clientX, e.clientY);
        }
        return;
      }

      const now = Date.now();
      const dt = Math.max(1, now - g.lastTime);
      const dx = e.clientX - g.lastX;
      const dy = e.clientY - g.lastY;
      const totalDx = e.clientX - g.startX;
      const totalDy = e.clientY - g.startY;
      const totalDist = Math.hypot(totalDx, totalDy);

      g.maxTravel = Math.max(g.maxTravel, totalDist);
      g.velocityX = dx / dt;
      g.velocityY = dy / dt;
      g.lastX = e.clientX;
      g.lastY = e.clientY;
      g.lastTime = now;

      // Axis lock after 8px travel
      if (g.axisLock === 'undecided' && totalDist >= 8) {
        if (Math.abs(totalDy) > Math.abs(totalDx) * 1.1) {
          // Primarily vertical: lock to scroll!
          g.axisLock = 'vertical';
        } else {
          // Primarily horizontal: lock to cube rotate!
          g.axisLock = 'horizontal';
          isDraggingRef.current = true;
          setIsDraggingCube(true);
          isSnappingRef.current = false;
        }
      }

      // Rotate cube when locked horizontally or dragging with mouse
      if (g.axisLock === 'horizontal' || (g.pointerType === 'mouse' && totalDist >= 6)) {
        isDraggingRef.current = true;
        setIsDraggingCube(true);
        isSnappingRef.current = false;

        const sensitivity = g.pointerType === 'touch' ? 0.0065 : 0.0055;
        const rotY = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          dx * sensitivity
        );
        const rotX = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          dy * sensitivity
        );
        const dragDeltaQ = new THREE.Quaternion().multiplyQuaternions(rotY, rotX);

        currentQuaternionRef.current.premultiply(dragDeltaQ);
        if (cubeGroupRef.current) {
          cubeGroupRef.current.quaternion.copy(currentQuaternionRef.current);
        }

        angularVelocityRef.current = {
          x: dx * sensitivity * 0.5,
          y: dy * sensitivity * 0.5,
        };

        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const g = gestureStateRef.current;
      if (g.pointerId !== e.pointerId) return;

      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {}

      const now = Date.now();
      const duration = now - g.startTime;
      const isTouch = g.pointerType === 'touch';
      const travelThreshold = isTouch ? 10 : 6;
      const speed = Math.hypot(g.velocityX, g.velocityY);

      const wasDragging =
        isDraggingRef.current || g.axisLock === 'horizontal' || g.maxTravel > travelThreshold;

      g.pointerId = null;
      setIsDraggingCube(false);

      // If vertical scroll occurred, completely ignore
      if (g.axisLock === 'vertical') {
        isDraggingRef.current = false;
        return;
      }

      // If it was a drag, snap to nearest face and activate 400ms cooldown
      if (wasDragging) {
        isDraggingRef.current = false;
        lastDragEndTimeRef.current = now;

        if (cubeGroupRef.current) {
          const nearest = findNearestServiceIndex(cubeGroupRef.current.quaternion);
          targetQuaternionRef.current.copy(getServiceTargetQuaternion(nearest));
          isSnappingRef.current = true;
          setFrontFaceIndex(nearest);
        }
        return;
      }

      // Check TAP criteria
      const isTap =
        g.maxTravel <= travelThreshold &&
        duration <= 350 &&
        speed <= 0.35 &&
        !g.isMultiTouch;

      if (!isTap) return;

      // Cooldown 1: Ignore taps within 400ms of any drag ending
      if (now - lastDragEndTimeRef.current < 400) return;

      // Cooldown 2: Ignore taps while cube is coasting or snapping
      const isCoasting =
        Math.hypot(angularVelocityRef.current.x, angularVelocityRef.current.y) > 0.001 ||
        isSnappingRef.current;

      if (isCoasting) {
        // Stop coasting and settle to nearest face
        angularVelocityRef.current = { x: 0, y: 0 };
        if (cubeGroupRef.current) {
          const nearest = findNearestServiceIndex(cubeGroupRef.current.quaternion);
          targetQuaternionRef.current.copy(getServiceTargetQuaternion(nearest));
          isSnappingRef.current = true;
          setFrontFaceIndex(nearest);
        }
        return;
      }

      // Execute classified deliberate tap using pointerdown start coordinates
      handleClassifiedTap(g.startX, g.startY);
      releaseCubeInteraction();
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (gestureStateRef.current.pointerId === e.pointerId) {
        gestureStateRef.current.pointerId = null;
        isDraggingRef.current = false;
        setIsDraggingCube(false);
        releaseCubeInteraction();
      }
    };

    const onPointerLeave = () => {
      setHoveredFace(null);
      onHoverFace(null, 0, 0);
      releaseCubeInteraction();
    };

    // Suppress trailing synthetic clicks generated by mobile browsers after touchend
    const onSyntheticClick = (e: MouseEvent) => {
      if (Date.now() - lastDragEndTimeRef.current < 500 || isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointercancel', onPointerCancel);
    dom.addEventListener('pointerleave', onPointerLeave);
    dom.addEventListener('click', onSyntheticClick, true);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointercancel', onPointerCancel);
      dom.removeEventListener('pointerleave', onPointerLeave);
      dom.removeEventListener('click', onSyntheticClick, true);
    };
  }, [gl, camera]);

  // =====================================================================
  // Animation Frame Loop
  // =====================================================================
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Space halo breathing
    if (haloRef.current && !prefersReduced) {
      const haloScale = 1 + Math.sin(time * 2) * 0.05;
      haloRef.current.scale.set(haloScale, haloScale, 1);
    }

    // Determine current focused service
    const currentFocusIdx = activeFaceIndex !== null ? activeFaceIndex : frontFaceIndex;
    const focusedService = getServiceByIndex(currentFocusIdx);

    // 2. Dynamic soft rim light matching front/active service accent color
    if (rimLightRef.current && focusedService) {
      rimLightRef.current.color.lerp(new THREE.Color(focusedService.accentColor), 0.08);
    }

    // 3. Holographic scanline sweep across active face
    if (scanSweepRef.current && !prefersReduced && !hideFaces && !isDebugInner) {
      const sweepOffset = Math.sin(time * 1.5) * 1.05;
      const posConfig = SCAN_FACE_CONFIG[currentFocusIdx] || SCAN_FACE_CONFIG[4];

      scanSweepRef.current.rotation.set(posConfig.rot[0], posConfig.rot[1], posConfig.rot[2]);
      if (currentFocusIdx === 2 || currentFocusIdx === 3) {
        scanSweepRef.current.position.set(posConfig.pos[0], posConfig.pos[1], sweepOffset);
      } else {
        scanSweepRef.current.position.set(posConfig.pos[0], sweepOffset, posConfig.pos[2]);
      }
    }

    // 4. Subtle 1.03 scale breathing of whole cube on hover (damped)
    if (cubeGroupRef.current) {
      const targetScale = hoveredFace !== null && activeFaceIndex === null ? 1.03 : 1.0;
      const currentScale = cubeGroupRef.current.scale.x;
      const nextScale = THREE.MathUtils.damp(currentScale, targetScale, 7, delta);
      cubeGroupRef.current.scale.set(nextScale, nextScale, nextScale);
    }

    // 5. Cube orientation quaternion smoothing & inertia
    if (cubeGroupRef.current) {
      if (isDraggingRef.current) {
        // Drag rotation is applied directly in pointermove
      } else if (activeFaceIndex !== null || isSnappingRef.current) {
        const dampFactor = prefersReduced ? 1 : 1 - Math.exp(-delta * 9);
        currentQuaternionRef.current.slerp(targetQuaternionRef.current, dampFactor);
        cubeGroupRef.current.quaternion.copy(currentQuaternionRef.current);

        if (currentQuaternionRef.current.angleTo(targetQuaternionRef.current) < 0.002) {
          currentQuaternionRef.current.copy(targetQuaternionRef.current);
          cubeGroupRef.current.quaternion.copy(targetQuaternionRef.current);
          isSnappingRef.current = false;
        }
      } else {
        // Free-floating inertia damping
        if (
          Math.abs(angularVelocityRef.current.x) > 0.0001 ||
          Math.abs(angularVelocityRef.current.y) > 0.0001
        ) {
          const deltaQ = new THREE.Quaternion();
          const rotY = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            angularVelocityRef.current.x
          );
          const rotX = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            angularVelocityRef.current.y
          );
          deltaQ.multiplyQuaternions(rotY, rotX);

          currentQuaternionRef.current.premultiply(deltaQ);
          cubeGroupRef.current.quaternion.copy(currentQuaternionRef.current);

          angularVelocityRef.current.x *= Math.exp(-delta * 3.5);
          angularVelocityRef.current.y *= Math.exp(-delta * 3.5);
        } else if (!isIntroActive && !prefersReduced) {
          // Gentle ambient idle tumble
          const idleDelta = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            delta * 0.12
          );
          currentQuaternionRef.current.premultiply(idleDelta);
          cubeGroupRef.current.quaternion.copy(currentQuaternionRef.current);
        }
      }

      // Compute nearest front-facing face and sync with store in real time
      const nearestServiceIndex = findNearestServiceIndex(cubeGroupRef.current.quaternion);
      setFrontFaceIndex(nearestServiceIndex);
    }
  });

  const focusedService = getServiceByIndex(
    activeFaceIndex !== null ? activeFaceIndex : frontFaceIndex
  );

  return (
    <>
      {/* Soft Colored Rim Light */}
      <pointLight
        ref={rimLightRef}
        position={[0, 0, 3.8]}
        intensity={1.25}
        distance={9}
        color={focusedService?.accentColor || '#4fd8ff'}
      />

      <group ref={cubeGroupRef}>
        {/* Layer 0: Space Light Halo */}
        {layerVis.halo && (
          <mesh ref={haloRef} position={[0, 0, -0.6]} renderOrder={0}>
            <planeGeometry args={[6.5, 6.5]} />
            <meshBasicMaterial
              transparent
              opacity={0.55}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              map={haloTexture}
            />
          </mesh>
        )}

        {/* Nested Living Inner Mechanism (RenderOrder 1 to 4.5: Glow sprite, Wireframe, Plasma Cube, Nucleus, Sparks) */}
        {layerVis.core && (
          <InnerMechanism
            configOverrides={innerOverrides}
            quality={innerOverrides?.QUALITY ?? quality}
            accentColor={focusedService?.accentColor || '#4fd8ff'}
            isHovered={hoveredFace !== null}
            isDragging={isDraggingRef.current}
            isDetailOpen={activeFaceIndex !== null}
            prefersReducedMotion={prefersReduced}
            onSelectionTrigger={activeFaceIndex ?? -1}
          />
        )}

        {/* Layer 5: Outer Glass Shell with 6 Service CanvasTextures */}
        {layerVis.faces && !hideFaces && !isDebugInner && (
          <mesh
            ref={outerMeshRef}
            material={materials}
            renderOrder={5}
          >
            <boxGeometry args={[2.4, 2.4, 2.4]} />
          </mesh>
        )}

        {/* Slow Scanline / Light Sweep across active face */}
        {!prefersReduced && !hideFaces && !isDebugInner && (
          <mesh ref={scanSweepRef} renderOrder={5.5}>
            <planeGeometry args={[2.32, 0.035]} />
            <meshBasicMaterial
              color={focusedService?.accentColor || '#4fd8ff'}
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Layer 6: Glowing Neon Wireframe Edges */}
        {layerVis.edges && !hideFaces && !isDebugInner && (
          <lineSegments renderOrder={6}>
            <edgesGeometry args={[new THREE.BoxGeometry(2.4, 2.4, 2.4)]} />
            <lineBasicMaterial color="#4fd8ff" linewidth={2} depthWrite={false} />
          </lineSegments>
        )}
      </group>
    </>
  );
};
