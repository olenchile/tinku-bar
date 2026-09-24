"use client";

/**
 * CategoryIcon — Twemoji SVG via CDN de jsDelivr.
 * Renderiza emojis de alta resolución como SVG (300dpi-equivalent).
 * Fallback: muestra el emoji texto nativo si el CDN falla.
 */

import { useState } from "react";

/* Convierte un emoji string al codepoint hex que usa Twemoji */
function toTwemojiCode(emoji: string): string {
  const codePoints: string[] = [];
  let i = 0;
  while (i < emoji.length) {
    const code = emoji.codePointAt(i)!;
    codePoints.push(code.toString(16));
    // Avanzar por surrogate pairs
    i += code > 0xffff ? 2 : 1;
  }
  // Twemoji ignora variantes U+FE0F (fe0f)
  return codePoints.filter((c) => c !== "fe0f").join("-");
}

const CDN = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg";

interface CategoryIconProps {
  emoji: string;       // p.ej. "🍳"
  size?: number;       // px, default 48
  className?: string;
  alt?: string;
}

export function CategoryIcon({ emoji, size = 48, className = "", alt = "" }: CategoryIconProps) {
  const [error, setError] = useState(false);
  const code = toTwemojiCode(emoji);
  const src  = `${CDN}/${code}.svg`;

  if (error) {
    return (
      <span
        className={className}
        style={{ fontSize: size * 0.75, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        aria-label={alt}
        role="img"
      >
        {emoji}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || emoji}
      width={size}
      height={size}
      className={className}
      draggable={false}
      onError={() => setError(true)}
    />
  );
}
