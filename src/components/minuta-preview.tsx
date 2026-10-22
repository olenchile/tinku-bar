"use client";

import type { MinutaSemanal } from "@/lib/minuta-types";
import { todayChile } from "@/lib/api-client";
import { DIAS_ORDER, DIAS_LABELS } from "@/lib/minuta-types";

// ─── COLORES ──────────────────────────────────────────────────────────────────

const C = {
  headerBg:    "#c4622d",
  headerText:  "#fff",
  headerBorder:"#a8501e",
  platosBg:    "#fff9f0",
  platosText:  "#1a1208",
  platosBorder:"#e8d5b0",
  veganoBg:    "#e8f5e9",
  veganoText:  "#1a3a1a",
  veganoBorder:"#a5d6a7",
  hipoBg:      "#e0f2f1",
  hipoText:    "#1a2e2d",
  hipoBorder:  "#80cbc4",
  agregBg:     "#fff8e1",
  agregText:   "#2a2015",
  agregBorder: "#ffe082",
  ensaBg:      "#fafafa",
  ensaText:    "#2a2015",
  ensaBorder:  "#e0e0e0",
  postrBg:     "#fce4ec",
  postrText:   "#3a0a1a",
  postrBorder: "#f48fb1",
  todayHeader: "#8b3a1a",
  bodyBg:      "#f5edd8",
  gold:        "#c8a96e",
  ornament:    "#b8860b",
};

// ─── FUENTE SERIF ─────────────────────────────────────────────────────────────
const SERIF = "'Playfair Display', 'Georgia', serif";
const SERIF2 = "'Cormorant Garamond', 'Georgia', serif";

// ─── PATRÓN ANDINO ────────────────────────────────────────────────────────────
const PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M0 0h4v4H0zm8 0h4v4H8zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zM4 4h4v4H4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zM0 8h4v4H0zm16 0h4v4h-4zm16 0h4v4h-4zM4 12h4v4H4zm8 0h4v4h-4zm16 0h4v4h-4zM0 16h4v4H0zm8 8h4v4H8zm16-8h4v4h-4zM4 20h4v4H4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zM0 24h4v4H0zm8 0h4v4H8zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zM4 28h4v4H4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zM0 32h4v4H0zm8 0h4v4H8zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zM4 36h4v4H4zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4z'/%3E%3C%2Fg%3E%3C%2Fsvg%3E")`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Items({ items, textColor }: { items: string[]; textColor: string }) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) {
    return (
      <div style={{ fontFamily: SERIF2, fontSize: 12, color: "#ccc", fontStyle: "italic", paddingLeft: 10 }}>
        —
      </div>
    );
  }
  return (
    <>
      {filtered.map((item, i) => (
        <div
          key={i}
          style={{
            fontFamily: SERIF2,
            fontSize: 12.5,
            color: textColor,
            lineHeight: 1.45,
            paddingLeft: 12,
            position: "relative",
            marginBottom: 1,
          }}
        >
          <span style={{ position: "absolute", left: 0, color: C.gold }}>–</span>
          {item}
        </div>
      ))}
    </>
  );
}

function Cell({
  items,
  bg,
  text,
  border,
  label,
  isToday,
}: {
  items: string[];
  bg: string;
  text: string;
  border: string;
  label?: string;
  isToday?: boolean;
}) {
  return (
    <td
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        padding: "5px 6px",
        verticalAlign: "top",
        boxShadow: isToday ? `inset 0 0 0 2px rgba(196,98,45,0.3)` : undefined,
      }}
    >
      {label && (
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 10, color: C.headerBg, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 3 }}>
          {label}:
        </div>
      )}
      <Items items={items} textColor={text} />
    </td>
  );
}

function RowLabel({ label, color }: { label: string; color: string }) {
  return (
    <td
      style={{
        backgroundColor: color,
        writingMode: "vertical-rl" as const,
        transform: "rotate(180deg)",
        textAlign: "center" as const,
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#fff",
        padding: "4px 3px",
        border: "1px solid rgba(0,0,0,0.15)",
        whiteSpace: "nowrap" as const,
        width: 22,
      }}
    >
      {label}
    </td>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function MinutaPreview({ minuta }: { minuta: MinutaSemanal }) {
  const todayStr = todayChile();
  const todayDow = new Date(todayStr + "T12:00:00").getDay();
  const dowMap: Record<number, string> = { 1: "lunes", 2: "martes", 3: "miercoles", 4: "jueves", 5: "viernes" };
  const todayKey = dowMap[todayDow] ?? null;

  const cols = DIAS_ORDER.map((k) => ({
    key: k,
    label: DIAS_LABELS[k],
    isToday: k === todayKey,
    d: minuta.dias[k],
  }));

  return (
    <div
      id="minuta-preview"
      style={{
        position: "relative",
        backgroundColor: C.bodyBg,
        backgroundImage: PATTERN,
        padding: "14px 16px 12px",
        borderRadius: 12,
        fontFamily: SERIF2,
        minWidth: 780,
        boxSizing: "border-box" as const,
      }}
    >
      {/* Bordes dorados */}
      <div style={{ position: "absolute", inset: 5, border: `1px solid ${C.gold}`, borderRadius: 8, pointerEvents: "none" as const, zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 8, border: `0.5px solid #dfc090`, borderRadius: 6, pointerEvents: "none" as const, zIndex: 1 }} />

      {/* Ornamentos esquinas */}
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8 },
        { bottom: 8, left: 8 },
        { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, zIndex: 2 }}>
          <svg viewBox="0 0 32 32" width={18} height={18} fill={C.ornament} style={{ opacity: 0.4, transform: i % 2 === 1 ? "scaleX(-1)" : undefined }}>
            <circle cx="16" cy="16" r="3" />
            <ellipse cx="16" cy="8"  rx="2.5" ry="5" />
            <ellipse cx="16" cy="24" rx="2.5" ry="5" />
            <ellipse cx="8"  cy="16" rx="5"   ry="2.5" />
            <ellipse cx="24" cy="16" rx="5"   ry="2.5" />
            <ellipse cx="10" cy="10" rx="2"   ry="4"   transform="rotate(-45 10 10)" />
            <ellipse cx="22" cy="10" rx="2"   ry="4"   transform="rotate(45 22 10)"  />
            <ellipse cx="10" cy="22" rx="2"   ry="4"   transform="rotate(45 10 22)"  />
            <ellipse cx="22" cy="22" rx="2"   ry="4"   transform="rotate(-45 22 22)" />
          </svg>
        </div>
      ))}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8, paddingBottom: 8, borderBottom: `0.5px solid ${C.gold}`, position: "relative", zIndex: 2 }}>
        {/* Logo izq */}
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1.5px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 3, flexShrink: 0, backgroundColor: "rgba(255,255,255,0.2)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/tinku.svg" alt="Tinku" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0.15) sepia(1) hue-rotate(10deg) saturate(3)" }} />
        </div>
        {/* Nombre */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 700, color: "#2a2015", letterSpacing: "0.2em", lineHeight: 1 }}>TINKU</div>
          <div style={{ fontFamily: SERIF2, fontSize: 10, color: "#8a7a5a", letterSpacing: "0.2em", fontStyle: "italic" }}>Restobar</div>
        </div>
        {/* Centro */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: C.headerBg, letterSpacing: "0.15em", textTransform: "uppercase" }}>{minuta.titulo}</div>
          <div style={{ fontFamily: SERIF2, fontSize: 10, color: "#8a7a5a", fontStyle: "italic", marginTop: 2, letterSpacing: "0.08em" }}>{minuta.periodo}</div>
        </div>
        {/* Logo der */}
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1.5px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 3, flexShrink: 0, backgroundColor: "rgba(255,255,255,0.2)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/tinku.svg" alt="Tinku" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0.15) sepia(1) hue-rotate(10deg) saturate(3)" }} />
        </div>
      </div>

      {/* Tabla */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 22 }} />
            {cols.map((_, i) => <col key={i} />)}
          </colgroup>
          <thead>
            <tr style={{ height: 28 }}>
              <th style={{ backgroundColor: "#2a2015", border: "1px solid #1a1208" }} />
              {cols.map(({ key, label, isToday }) => (
                <th
                  key={key}
                  style={{
                    backgroundColor: isToday ? C.todayHeader : C.headerBg,
                    color: C.headerText,
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "6px 4px",
                    textAlign: "center",
                    border: `1px solid ${C.headerBorder}`,
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Platos */}
            <tr>
              <RowLabel label="Platos" color="#c4622d" />
              {cols.map(({ key, isToday, d }) => (
                <Cell key={key} items={d.platos} bg={C.platosBg} text={C.platosText} border={C.platosBorder} isToday={isToday} />
              ))}
            </tr>
            {/* Vegano */}
            <tr>
              <RowLabel label="Vegano" color="#3d7a72" />
              {cols.map(({ key, isToday, d }) => (
                <Cell key={key} items={d.veganos} bg={C.veganoBg} text={C.veganoText} border={C.veganoBorder} label="Veganos" isToday={isToday} />
              ))}
            </tr>
            {/* Hipocalóricos */}
            <tr>
              <td
                colSpan={cols.length + 1}
                style={{ backgroundColor: C.hipoBg, border: `1px solid ${C.hipoBorder}`, padding: "5px 10px" }}
              >
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 9, color: "#2d5e58", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, textAlign: "center" }}>
                  ✦ PLATOS HIPOCALÓRICOS DISPONIBLES TODOS LOS DÍAS ✦
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 20px" }}>
                  {minuta.hipocaloricos.filter(Boolean).map((e, i) => (
                    <div key={i} style={{ fontFamily: SERIF2, fontSize: 10, color: C.hipoText, lineHeight: 1.35, paddingLeft: 12, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#3d7a72" }}>–</span>
                      {e}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
            {/* Agregados */}
            <tr>
              <RowLabel label="Agreg." color="#b8860b" />
              {cols.map(({ key, isToday, d }) => (
                <Cell key={key} items={d.agregados} bg={C.agregBg} text={C.agregText} border={C.agregBorder} label="Agregados" isToday={isToday} />
              ))}
            </tr>
            {/* Ensaladas */}
            <tr>
              <RowLabel label="Ensalad." color="#5a7a5a" />
              {cols.map(({ key, isToday, d }) => (
                <Cell key={key} items={d.ensaladas} bg={C.ensaBg} text={C.ensaText} border={C.ensaBorder} isToday={isToday} />
              ))}
            </tr>
            {/* Postres */}
            <tr>
              <RowLabel label="Postres" color="#9b2d7a" />
              {cols.map(({ key, isToday, d }) => (
                <Cell key={key} items={d.postres} bg={C.postrBg} text={C.postrText} border={C.postrBorder} isToday={isToday} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, position: "relative", zIndex: 2 }}>
        <div style={{ flex: 1, height: 0.5, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
        <div style={{ fontFamily: SERIF2, fontSize: 9, color: "#8a7a5a", fontStyle: "italic", letterSpacing: "0.1em" }}>
          +56 9 8905 8820 · Nueva Extremadura #4402, Quinta Normal · tinkubar.cl
        </div>
        <div style={{ flex: 1, height: 0.5, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
      </div>
    </div>
  );
}
