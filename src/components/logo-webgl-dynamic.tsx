"use client";

/**
 * Wrapper de carga dinámica para LogoWebGL.
 * Evita errores de SSR con Three.js / WebGL.
 */

import dynamic from "next/dynamic";

const LogoWebGL = dynamic(() => import("./logo-webgl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-emerald-900 border-2 border-amber-500/50 flex items-center justify-center shadow-2xl animate-pulse">
        <span className="font-serif text-5xl text-amber-50 font-bold">T</span>
      </div>
    </div>
  ),
});

export default LogoWebGL;
