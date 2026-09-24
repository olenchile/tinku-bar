"use client";

import { useEffect, useRef } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import Lenis from "lenis";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers
 * Envuelve la app con:
 * - LazyMotion (Framer Motion, bundle reducido vía domAnimation)
 * - Lenis smooth scroll sincronizado con requestAnimationFrame
 */
export function Providers({ children }: ProvidersProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
