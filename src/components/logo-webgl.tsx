"use client";

/**
 * LogoWebGL — Animación WebGL tipo "liquid gold" para el logo de Restobar Tinku.
 *
 * Técnica:
 *  • Canvas R3F con fondo transparente (alpha: true)
 *  • Logo SVG como textura en un PlaneGeometry con ShaderMaterial custom
 *  • Shader de distorsión sinusoidal (wave warp) + chromatic aberration sutil
 *  • Sistema de partículas doradas (Points) que orbitan el logo
 *  • Reacción al hover: intensidad de onda aumenta con spring de Framer Motion
 *  • Totalmente SSR-safe: carga dinámica con next/dynamic
 */

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader, extend } from "@react-three/fiber";
import { Points, PointMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { m, useSpring, useTransform } from "framer-motion";

/* ─── Vertex Shader ─────────────────────────────────────────────────────────── */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Wave distortion
    float wave = sin(pos.x * 4.0 + uTime * 1.5) * 0.04 * uIntensity;
    wave      += cos(pos.y * 3.0 + uTime * 1.2) * 0.03 * uIntensity;
    pos.z     += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ─── Fragment Shader ───────────────────────────────────────────────────────── */
const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float     uTime;
  uniform float     uIntensity;
  varying vec2      vUv;

  void main() {
    // Chromatic aberration
    float aberration = 0.003 * uIntensity;
    float r = texture2D(uTexture, vUv + vec2( aberration, 0.0)).r;
    float g = texture2D(uTexture, vUv                         ).g;
    float b = texture2D(uTexture, vUv - vec2( aberration, 0.0)).b;
    float a = texture2D(uTexture, vUv).a;

    // Gold tint on the logo paths (dark pixels → gold shimmer)
    vec3 color = vec3(r, g, b);
    float lum  = dot(color, vec3(0.299, 0.587, 0.114));

    // Shimmer: animated gold highlight
    float shimmer = sin(vUv.x * 8.0 + uTime * 2.0) * 0.5 + 0.5;
    vec3  gold    = vec3(0.85, 0.65, 0.13);
    vec3  navy    = vec3(0.094, 0.125, 0.192);

    // Blend: dark areas → navy/gold, light areas → transparent
    vec3 finalColor = mix(gold * (0.7 + shimmer * 0.3), navy, lum);
    float finalAlpha = (1.0 - lum) * a;

    gl_FragColor = vec4(finalColor, finalAlpha * 1.0);
  }
`;

/* ─── Logo Mesh ─────────────────────────────────────────────────────────────── */
function LogoMesh({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.ShaderMaterial>(null);

  const texture = useTexture("/logos/tinku.svg");

  // Mantener aspect ratio 1536×1024 → 3:2
  const aspect = 1536 / 1024;
  const width  = 2.8;
  const height = width / aspect;

  const uniforms = useMemo(
    () => ({
      uTexture:   { value: texture },
      uTime:      { value: 0 },
      uIntensity: { value: 1 },
    }),
    [texture]
  );

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value      = clock.getElapsedTime();
    matRef.current.uniforms.uIntensity.value = intensity;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── Partículas Doradas ────────────────────────────────────────────────────── */
function GoldParticles({ count = 280 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const sz   = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribución elíptica alrededor del logo
      const angle  = Math.random() * Math.PI * 2;
      const radius = 1.4 + Math.random() * 1.2;
      pos[i * 3]     = Math.cos(angle) * radius * 1.5;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      sz[i]          = Math.random() * 0.015 + 0.004;
    }
    return [pos, sz];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.z = t * 0.04;
    // Pulso de escala
    const pulse = 1 + Math.sin(t * 0.8) * 0.04;
    pointsRef.current.scale.setScalar(pulse);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d4a017"
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Inner Glow Ring ───────────────────────────────────────────────────────── */
function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    ringRef.current.rotation.z = t * 0.15;
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(t * 1.2) * 0.04;
  });

  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[1.55, 1.65, 64]} />
      <meshBasicMaterial
        color="#c8960c"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─── Scene ─────────────────────────────────────────────────────────────────── */
function Scene({ intensity }: { intensity: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <GlowRing />
      <LogoMesh intensity={intensity} />
      <GoldParticles count={320} />
    </>
  );
}

/* ─── Export: LogoWebGL ─────────────────────────────────────────────────────── */
export default function LogoWebGL({
  className = "",
}: {
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  // Spring para la intensidad de la onda
  const rawIntensity = useSpring(1, { stiffness: 60, damping: 18 });

  useEffect(() => {
    rawIntensity.set(hovered ? 2.8 : 1);
  }, [hovered, rawIntensity]);

  // Convertir MotionValue a número para pasarlo al shader
  const [intensity, setIntensity] = useState(1);
  useEffect(() => {
    const unsub = rawIntensity.on("change", (v) => setIntensity(v));
    return unsub;
  }, [rawIntensity]);

  return (
    <m.div
      className={`relative cursor-pointer select-none ${className}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTapStart={() => setHovered(true)}
      onTap={() => setHovered(false)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Scene intensity={intensity} />
      </Canvas>
    </m.div>
  );
}
