import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { QualityPreset } from '../../config/cubeTheme.config';

// =====================================================================
// Custom GLSL 3D Simplex & Domain-Warped FBM Plasma Shader with Energy Veins
// Clamped strictly to vec3(0.90) to eliminate white blowout completely.
// =====================================================================
const InnerPlasmaShader = {
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 0.85 },
    uAlpha: { value: 0.50 },
    uAccent: { value: new THREE.Color('#4fd8ff') },
    uRipple: { value: 0.0 },
    uQuality: { value: 1.0 }, // 0: low, 1: medium, 2: high
    uColorDeep: { value: new THREE.Color('#0a3cff') },
    uColorMid: { value: new THREE.Color('#1f7bff') },
    uColorCyan: { value: new THREE.Color('#4fd8ff') },
    uColorHot: { value: new THREE.Color('#cfefff') },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uAlpha;
    uniform vec3 uAccent;
    uniform float uRipple;
    uniform float uQuality;
    uniform vec3 uColorDeep;
    uniform vec3 uColorMid;
    uniform vec3 uColorCyan;
    uniform vec3 uColorHot;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    // 3D Simplex Noise generator (Stefan Gustavson & Ian McEwan)
    vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    // 3-octave FBM for smooth volumetric plasma
    float fbm(vec3 p) {
      float f = 0.0;
      f += 0.5000 * snoise(p); p = p * 2.02;
      f += 0.2500 * snoise(p); p = p * 2.03;
      f += 0.1250 * snoise(p);
      return f;
    }

    // Domain-warped flow across two axes (X and Y/Z)
    float domainWarp(vec3 p, float t) {
      vec3 q = vec3(
        fbm(p + vec3(t * 0.18, 0.0, 0.0)),
        fbm(p + vec3(3.7, t * 0.15, -1.2)),
        fbm(p + vec3(-2.1, 1.8, t * 0.12))
      );
      return fbm(p + 1.25 * q + vec3(t * 0.10, t * 0.16, 0.0));
    }

    void main() {
      // 1. Fresnel edge glow on beveled/smoothed RoundedBox normals
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vNormal);
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);

      // Low quality fallback: smooth static radial gradient
      if (uQuality < 0.5) {
        float r = length(vPosition) * 1.4;
        vec3 col = mix(uColorDeep, uColorCyan, clamp(r, 0.0, 1.0));
        col = mix(col, uAccent, 0.25);
        col *= uIntensity;
        col = min(col, vec3(0.90));
        gl_FragColor = vec4(col, uAlpha * (0.6 + fresnel * 0.4));
        return;
      }

      // 2. Animated domain-warped plasma noise
      float noiseVal = domainWarp(vPosition * 2.1, uTime * 0.70);
      float t = clamp(noiseVal * 0.5 + 0.5, 0.0, 1.0);

      // 3. Color ramp: deep #0a3cff -> #1f7bff -> #4fd8ff
      vec3 color = mix(uColorDeep, uColorMid, smoothstep(0.12, 0.52, t));
      color = mix(color, uColorCyan, smoothstep(0.52, 0.88, t));

      // 4. Tiny hot spots of #cfefff (strictly under 10% coverage)
      float hotSpot = smoothstep(0.92, 1.0, t);
      color = mix(color, uColorHot, hotSpot * 0.50);

      // 5. Internal "energy veins": ridged noise thresholded to thin bright filaments
      if (uQuality >= 1.0) {
        vec3 veinP = vPosition * 3.4 + vec3(uTime * 0.18, -uTime * 0.12, uTime * 0.14);
        float ridged = 1.0 - abs(snoise(veinP));
        float vein = smoothstep(0.84, 0.96, ridged);
        color = mix(color, uColorHot, vein * 0.45);
      }

      // 6. Accent color integration (tint toward selected service)
      color = mix(color, uAccent, 0.24);

      // 7. Ripple wave reaction from nucleus pulse
      if (uRipple > 0.001) {
        float dist = length(vPosition);
        float wave = sin((dist * 5.0 - uRipple * 6.28)) * exp(-dist * 1.5);
        wave = clamp(wave, 0.0, 1.0);
        color = mix(color, uColorHot, wave * 0.35);
      }

      // 8. Fresnel rim brightening (scaled so only the outer rim brightens)
      color = mix(color, uColorCyan, fresnel * 0.65);

      // 9. Intensity scaling
      color *= uIntensity;

      // 10. CRITICAL HARD-CLAMP: Never allow any channel to exceed 0.90 (230/255 in 8-bit)
      color = min(color, vec3(0.90));

      // 11. Controlled alpha with silhouette enhancement
      float alpha = uAlpha * (0.60 + fresnel * 0.40);

      gl_FragColor = vec4(color, alpha);
    }
  `,
};

// Procedural soft circular glow texture generator for Nucleus glow sprite
function createNucleusGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(79, 216, 255, 0.95)');
    gradient.addColorStop(0.25, 'rgba(31, 123, 255, 0.55)');
    gradient.addColorStop(0.65, 'rgba(10, 60, 255, 0.18)');
    gradient.addColorStop(1, 'rgba(10, 60, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export interface InnerConfigOverrides {
  INNER_PLASMA_SIZE?: number;
  INNER_WIRE_SIZE?: number;
  ROT_SPEED_PLASMA?: number;
  ROT_SPEED_WIRE?: number;
  PULSE_AMOUNT?: number;
  PLASMA_INTENSITY?: number;
  PLASMA_ALPHA?: number;
  SPARK_COUNT?: number;
  HOVER_SPEEDUP?: number;
  QUALITY?: QualityPreset;
}

export interface InnerMechanismProps {
  plasmaSize?: number;
  wireSize?: number;
  rotSpeedPlasma?: number;
  rotSpeedWire?: number;
  pulseAmount?: number;
  plasmaIntensity?: number;
  plasmaAlpha?: number;
  sparkCount?: number;
  hoverSpeedup?: number;
  quality?: QualityPreset;
  configOverrides?: InnerConfigOverrides;
  accentColor?: string;
  isHovered?: boolean;
  isDragging?: boolean;
  isDetailOpen?: boolean;
  prefersReducedMotion?: boolean;
  onSelectionTrigger?: number; // timestamp or counter when active service changes
}

export const InnerMechanism: React.FC<InnerMechanismProps> = ({
  plasmaSize: propPlasmaSize,
  wireSize: propWireSize,
  rotSpeedPlasma: propRotSpeedPlasma,
  rotSpeedWire: propRotSpeedWire,
  pulseAmount: propPulseAmount,
  plasmaIntensity: propPlasmaIntensity,
  plasmaAlpha: propPlasmaAlpha,
  sparkCount: propSparkCount,
  hoverSpeedup: propHoverSpeedup,
  quality: propQuality = 'medium',
  configOverrides,
  accentColor = '#4fd8ff',
  isHovered = false,
  isDragging = false,
  isDetailOpen = false,
  prefersReducedMotion = false,
  onSelectionTrigger = 0,
}) => {
  const plasmaSize = configOverrides?.INNER_PLASMA_SIZE ?? propPlasmaSize ?? 1.10;
  const wireSize = configOverrides?.INNER_WIRE_SIZE ?? propWireSize ?? 1.35;
  const rotSpeedPlasma = configOverrides?.ROT_SPEED_PLASMA ?? propRotSpeedPlasma ?? 0.35;
  const rotSpeedWire = configOverrides?.ROT_SPEED_WIRE ?? propRotSpeedWire ?? 0.25;
  const pulseAmount = configOverrides?.PULSE_AMOUNT ?? propPulseAmount ?? 0.03;
  const plasmaIntensity = configOverrides?.PLASMA_INTENSITY ?? propPlasmaIntensity ?? 0.85;
  const plasmaAlpha = configOverrides?.PLASMA_ALPHA ?? propPlasmaAlpha ?? 0.50;
  const sparkCount = configOverrides?.SPARK_COUNT ?? propSparkCount ?? 4;
  const hoverSpeedup = configOverrides?.HOVER_SPEEDUP ?? propHoverSpeedup ?? 1.4;
  const quality = configOverrides?.QUALITY ?? propQuality;
  // Mechanism hierarchy refs
  const rootGroupRef = useRef<THREE.Group>(null);
  const plasmaMeshRef = useRef<THREE.Mesh>(null);
  const wireCubeRef = useRef<THREE.Group>(null);
  const cornerNodesRef = useRef<THREE.InstancedMesh>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const glowSpriteRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Group>(null);

  // Reusable math objects to guarantee ZERO per-frame allocations
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const currentAccentColor = useMemo(() => new THREE.Color('#4fd8ff'), []);
  const targetAccentColor = useMemo(() => new THREE.Color('#4fd8ff'), []);

  // Soft glow sprite texture memoized
  const glowTexture = useMemo(() => createNucleusGlowTexture(), []);

  // Ripple state tracking for service selection reaction
  const rippleProgressRef = useRef<number>(0);
  const prevTriggerRef = useRef<number>(onSelectionTrigger);

  // Speed multiplier damping
  const speedMultRef = useRef<number>(1.0);
  // Parallax drag lag damping
  const dragParallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom Plasma Shader Material memoized
  const plasmaShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(InnerPlasmaShader.uniforms),
      vertexShader: InnerPlasmaShader.vertexShader,
      fragmentShader: InnerPlasmaShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      toneMapped: true,
      blending: THREE.NormalBlending, // Strict: Normal blending, NO additive blowout
    });
  }, []);

  // Update quality uniform
  useEffect(() => {
    if (plasmaShaderMaterial) {
      plasmaShaderMaterial.uniforms.uQuality.value =
        quality === 'low' ? 0.0 : quality === 'medium' ? 1.0 : 2.0;
    }
  }, [quality, plasmaShaderMaterial]);

  // Update target accent color
  useEffect(() => {
    targetAccentColor.set(accentColor);
  }, [accentColor, targetAccentColor]);

  // Trigger ripple on selection change
  useEffect(() => {
    if (onSelectionTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = onSelectionTrigger;
      rippleProgressRef.current = 0.01; // start ripple
    }
  }, [onSelectionTrigger]);

  // Wireframe box edges geometry memoized
  const wireEdgesGeometry = useMemo(() => {
    const boxGeom = new THREE.BoxGeometry(wireSize, wireSize, wireSize);
    const edgesGeom = new THREE.EdgesGeometry(boxGeom);
    boxGeom.dispose();
    return edgesGeom;
  }, [wireSize]);

  // 8 corner vertex nodes positions memoized
  const cornerPositions = useMemo(() => {
    const h = wireSize / 2;
    return [
      [-h, -h, -h],
      [h, -h, -h],
      [-h, h, -h],
      [h, h, -h],
      [-h, -h, h],
      [h, -h, h],
      [-h, h, h],
      [h, h, h],
    ];
  }, [wireSize]);

  // Setup instanced mesh for the 8 corner nodes
  useEffect(() => {
    if (cornerNodesRef.current) {
      cornerPositions.forEach((pos, idx) => {
        tempMatrix.makeTranslation(pos[0], pos[1], pos[2]);
        cornerNodesRef.current!.setMatrixAt(idx, tempMatrix);
      });
      cornerNodesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [cornerPositions, tempMatrix]);

  // Spark particle elements
  const activeSparkCount = quality === 'low' ? 0 : Math.min(sparkCount, 6);
  const sparkOffsets = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => (i * (Math.PI * 2)) / 6);
  }, []);

  // =====================================================================
  // Animation Frame Loop (Strict frame-rate-independent delta, 0 allocations)
  // =====================================================================
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Damped hover speedup multiplier (~1.4x on hover)
    const targetSpeed = isHovered ? hoverSpeedup : 1.0;
    speedMultRef.current = THREE.MathUtils.damp(speedMultRef.current, targetSpeed, 6, delta);

    // 2. Reduce motion by 50% during open detail panel; reduce to 20% on prefers-reduced-motion
    const motionScale = prefersReducedMotion ? 0.2 : isDetailOpen ? 0.5 : 1.0;
    const effectiveSpeed = speedMultRef.current * motionScale;

    // 3. Smoothly lerp accent color uniform
    currentAccentColor.lerp(targetAccentColor, 0.08);

    // 4. Update Ripple wave progression
    if (rippleProgressRef.current > 0) {
      rippleProgressRef.current += delta * 1.25;
      if (rippleProgressRef.current > 1.0) {
        rippleProgressRef.current = 0;
      }
    }

    // 5. Update Plasma Shader Uniforms
    if (plasmaShaderMaterial) {
      plasmaShaderMaterial.uniforms.uTime.value = time * effectiveSpeed;
      plasmaShaderMaterial.uniforms.uIntensity.value = plasmaIntensity * (isHovered ? 1.08 : 1.0);
      plasmaShaderMaterial.uniforms.uAlpha.value = plasmaAlpha;
      plasmaShaderMaterial.uniforms.uAccent.value.copy(currentAccentColor);
      plasmaShaderMaterial.uniforms.uRipple.value = rippleProgressRef.current;
    }

    // 6. Dragging parallax lag: creates rich optical depth behind the shell
    const targetLagX = isDragging ? 0.12 : 0;
    const targetLagY = isDragging ? 0.08 : 0;
    dragParallaxRef.current.x = THREE.MathUtils.damp(dragParallaxRef.current.x, targetLagX, 5, delta);
    dragParallaxRef.current.y = THREE.MathUtils.damp(dragParallaxRef.current.y, targetLagY, 5, delta);

    if (rootGroupRef.current) {
      rootGroupRef.current.position.set(dragParallaxRef.current.x, dragParallaxRef.current.y, 0);
    }

    // 7. Plasma Cube Tumble & Eased Scale Pulse (+/- 3%)
    if (plasmaMeshRef.current) {
      if (!prefersReducedMotion) {
        plasmaMeshRef.current.rotation.y += delta * rotSpeedPlasma * effectiveSpeed;
        plasmaMeshRef.current.rotation.x += delta * (rotSpeedPlasma * 0.62) * effectiveSpeed;

        const pulse = 1.0 + Math.sin(time * 2.5) * pulseAmount;
        plasmaMeshRef.current.scale.set(pulse, pulse, pulse);
      }
    }

    // 8. Wireframe Cube Counter-Rotation & Z-Wobble
    if (wireCubeRef.current) {
      if (!prefersReducedMotion) {
        // Counter-rotates in opposite direction
        wireCubeRef.current.rotation.y -= delta * rotSpeedWire * effectiveSpeed;
        wireCubeRef.current.rotation.x += delta * (rotSpeedWire * 0.55) * effectiveSpeed;
        wireCubeRef.current.rotation.z = Math.sin(time * 1.8) * 0.06;
      }
    }

    // 9. Central Nucleus Breathing Pulse (2.2s period) & Glow Brightening
    if (nucleusRef.current) {
      const nucleusPeriod = 2.2;
      const pulseT = (time * (Math.PI * 2)) / nucleusPeriod;
      const nucleusScale = prefersReducedMotion ? 1.0 : 1.0 + Math.sin(pulseT) * 0.07;
      nucleusRef.current.scale.set(nucleusScale, nucleusScale, nucleusScale);

      // Nucleus material color reaction
      const nMat = nucleusRef.current.material as THREE.MeshBasicMaterial;
      if (nMat) {
        tempColor.copy(currentAccentColor).lerp(new THREE.Color('#cfefff'), 0.45);
        // Brighten slightly on hover or ripple
        const brightFactor = (isHovered ? 1.15 : 1.0) + rippleProgressRef.current * 0.35;
        nMat.color.copy(tempColor).multiplyScalar(Math.min(0.88, 0.75 * brightFactor));
      }
    }

    // 10. Nucleus Glow Sprite Pulse
    if (glowSpriteRef.current) {
      const spriteScale = prefersReducedMotion ? 1.0 : 1.0 + Math.sin(time * 2.0) * 0.06;
      glowSpriteRef.current.scale.set(spriteScale, spriteScale, 1.0);
    }

    // 11. Tilted Orbit Ring Rotation & Sparks Riding Along It
    if (orbitGroupRef.current && !prefersReducedMotion) {
      orbitGroupRef.current.rotation.z += delta * 0.45 * effectiveSpeed;
    }

    if (sparksRef.current && activeSparkCount > 0 && !prefersReducedMotion) {
      const ringRadius = 0.55;
      const sparkSpeed = 1.2 * effectiveSpeed;
      sparksRef.current.children.forEach((child, idx) => {
        const angle = sparkOffsets[idx] + time * sparkSpeed;
        child.position.set(
          Math.cos(angle) * ringRadius,
          Math.sin(angle) * ringRadius,
          Math.sin(angle * 2.0) * 0.04
        );
      });
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* 1. Nucleus Glow Sprite (RenderOrder 1) - Soft additive billboard glow */}
      <mesh ref={glowSpriteRef} renderOrder={1} position={[0, 0, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={glowTexture}
        />
      </mesh>

      {/* 2. Counter-Rotating Wireframe Cube (RenderOrder 2) */}
      <group ref={wireCubeRef}>
        <lineSegments geometry={wireEdgesGeometry} renderOrder={2}>
          <lineBasicMaterial
            color="#4fd8ff"
            linewidth={1.5}
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {/* 8 Glowing Vertex Corner Nodes (InstancedMesh - 1 extra draw call) */}
        <instancedMesh
          ref={cornerNodesRef}
          args={[undefined, undefined, 8]}
          renderOrder={2}
        >
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshBasicMaterial
            color="#4fd8ff"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </instancedMesh>
      </group>

      {/* 3. Plasma Cube with Beveled Edges (RenderOrder 3) */}
      <RoundedBox
        ref={plasmaMeshRef}
        args={[plasmaSize, plasmaSize, plasmaSize]}
        radius={0.08}
        smoothness={4}
        material={plasmaShaderMaterial}
        renderOrder={3}
      />

      {/* 4. Bright Clamped Nucleus (RenderOrder 4) */}
      <mesh ref={nucleusRef} renderOrder={4} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.26, 3]} />
        <meshBasicMaterial
          color="#4fd8ff"
          transparent
          opacity={0.92}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Tilted Orbit Ring (Tilted 35 degrees) & Sparks (RenderOrder 4.5) */}
      {quality !== 'low' && (
        <group rotation={[35 * (Math.PI / 180), 15 * (Math.PI / 180), 0]}>
          <group ref={orbitGroupRef}>
            {/* Thin Glowing Orbit Torus */}
            <mesh renderOrder={4.5}>
              <torusGeometry args={[0.55, 0.010, 12, 48]} />
              <meshBasicMaterial
                color="#4fd8ff"
                transparent
                opacity={0.35}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Orbiting Spark Particles */}
            <group ref={sparksRef}>
              {Array.from({ length: activeSparkCount }).map((_, idx) => (
                <mesh key={idx} renderOrder={4.5}>
                  <sphereGeometry args={[0.024, 8, 8]} />
                  <meshBasicMaterial
                    color={idx % 2 === 0 ? '#cfefff' : accentColor}
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      )}
    </group>
  );
};
