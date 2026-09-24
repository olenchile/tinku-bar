/* ─── Decoraciones botánicas SVG ────────────────────────────── */

/** Rama con hojas — decoración lateral */
export function BotanicalBranch({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 80 200"
      className={className}
      fill="none"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* Tallo principal */}
      <path
        d="M40 200 C38 160 36 120 40 80 C42 50 38 20 40 0"
        stroke="#4a6e3a"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Hojas grandes */}
      <ellipse cx="25" cy="140" rx="16" ry="8" fill="#4a6e3a" opacity="0.25" transform="rotate(-30 25 140)" />
      <ellipse cx="52" cy="115" rx="18" ry="9" fill="#2d4a2a" opacity="0.2" transform="rotate(25 52 115)" />
      <ellipse cx="22" cy="90" rx="14" ry="7" fill="#4a6e3a" opacity="0.22" transform="rotate(-35 22 90)" />
      <ellipse cx="55" cy="65" rx="16" ry="7" fill="#2d4a2a" opacity="0.18" transform="rotate(20 55 65)" />
      <ellipse cx="28" cy="45" rx="12" ry="6" fill="#4a6e3a" opacity="0.2" transform="rotate(-25 28 45)" />
      {/* Hojitas pequeñas */}
      <ellipse cx="48" cy="30" rx="8" ry="4" fill="#8aab6e" opacity="0.3" transform="rotate(15 48 30)" />
      <ellipse cx="32" cy="18" rx="7" ry="3.5" fill="#8aab6e" opacity="0.25" transform="rotate(-20 32 18)" />
      {/* Nervios de hojas */}
      <path d="M25 140 L15 134" stroke="#2d4a2a" strokeWidth="0.5" opacity="0.3" />
      <path d="M52 115 L66 110" stroke="#2d4a2a" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/** Separador botánico horizontal */
export function BotanicalDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 24" className={className} fill="none">
      {/* Línea central */}
      <line x1="0" y1="12" x2="300" y2="12" stroke="#4a6e3a" strokeWidth="0.75" opacity="0.35" />
      {/* Hoja central */}
      <ellipse cx="150" cy="12" rx="14" ry="5" fill="#4a6e3a" opacity="0.25" />
      <line x1="136" y1="12" x2="164" y2="12" stroke="#2d4a2a" strokeWidth="0.75" opacity="0.4" />
      {/* Ramitas laterales */}
      <path d="M110 12 C105 8 98 6 92 8" stroke="#4a6e3a" strokeWidth="0.75" opacity="0.3" />
      <ellipse cx="88" cy="9" rx="7" ry="3.5" fill="#4a6e3a" opacity="0.2" transform="rotate(-10 88 9)" />
      <path d="M190 12 C195 8 202 6 208 8" stroke="#4a6e3a" strokeWidth="0.75" opacity="0.3" />
      <ellipse cx="212" cy="9" rx="7" ry="3.5" fill="#4a6e3a" opacity="0.2" transform="rotate(10 212 9)" />
      {/* Puntos decorativos */}
      <circle cx="60" cy="12" r="2" fill="#c8882a" opacity="0.35" />
      <circle cx="240" cy="12" r="2" fill="#c8882a" opacity="0.35" />
      <circle cx="30" cy="12" r="1.5" fill="#b85c38" opacity="0.25" />
      <circle cx="270" cy="12" r="1.5" fill="#b85c38" opacity="0.25" />
    </svg>
  );
}

/** Corona floral ornamental para el header */
export function FloralCrown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" className={className} fill="none">
      {/* Arco central */}
      <path
        d="M20 50 Q100 5 180 50"
        stroke="#4a6e3a"
        strokeWidth="1.25"
        fill="none"
        opacity="0.4"
      />
      {/* Hojas a lo largo del arco */}
      {[
        { cx: 50, cy: 30, rx: 10, ry: 4.5, rot: -40 },
        { cx: 80, cy: 15, rx: 12, ry: 5, rot: -15 },
        { cx: 100, cy: 10, rx: 13, ry: 5, rot: 0 },
        { cx: 120, cy: 15, rx: 12, ry: 5, rot: 15 },
        { cx: 150, cy: 30, rx: 10, ry: 4.5, rot: 40 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          fill="#4a6e3a"
          opacity="0.22"
          transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
        />
      ))}
      {/* Flores pequeñas */}
      {[35, 100, 165].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={i === 1 ? 40 : 40} r="3" fill="#c8882a" opacity="0.4" />
          {[0, 72, 144, 216, 288].map((angle, j) => (
            <ellipse
              key={j}
              cx={x + 5.5 * Math.cos((angle * Math.PI) / 180)}
              cy={(i === 1 ? 40 : 40) + 5.5 * Math.sin((angle * Math.PI) / 180)}
              rx="2.5"
              ry="1.5"
              fill="#b85c38"
              opacity="0.25"
              transform={`rotate(${angle} ${x + 5.5 * Math.cos((angle * Math.PI) / 180)} ${(i === 1 ? 40 : 40) + 5.5 * Math.sin((angle * Math.PI) / 180)})`}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/** Esquina decorativa botánica */
export function CornerLeaf({
  className = "",
  position = "tl",
}: {
  className?: string;
  position?: "tl" | "tr" | "bl" | "br";
}) {
  const transforms = {
    tl: "",
    tr: "scale(-1, 1)",
    bl: "scale(1, -1)",
    br: "scale(-1, -1)",
  };
  return (
    <svg viewBox="0 0 50 50" className={className} fill="none" style={{ transform: transforms[position] }}>
      <path d="M2 48 C2 30 10 15 25 5" stroke="#4a6e3a" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <ellipse cx="15" cy="35" rx="10" ry="5" fill="#4a6e3a" opacity="0.2" transform="rotate(-45 15 35)" />
      <ellipse cx="28" cy="18" rx="9" ry="4.5" fill="#2d4a2a" opacity="0.18" transform="rotate(-20 28 18)" />
      <ellipse cx="8" cy="22" rx="7" ry="3.5" fill="#8aab6e" opacity="0.22" transform="rotate(-60 8 22)" />
      <circle cx="24" cy="7" r="2.5" fill="#c8882a" opacity="0.4" />
    </svg>
  );
}
