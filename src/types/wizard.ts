/* ─── Dimensiones sensoriales del menú ─────────────────────── */

/** Intensidad de sabor: 1 = suave, 5 = intenso */
export type Intensity = 1 | 2 | 3 | 4 | 5;

/** Temperatura percibida del plato */
export type Temperature = "fría" | "templada" | "caliente";

/** Perfil de sabor dominante */
export type FlavorProfile =
  | "umami"      // carnes, mariscos
  | "fresco"     // ensaladas, ceviches
  | "dulce"      // postres, wafles
  | "ácido"      // cítricos, aliños
  | "tostado"    // café, carnes grill
  | "vegetal"    // pastas, colaciones
  | "espirituoso"; // tragos, vinos

/** Momento adecuado para el ítem */
export type MomentTag =
  | "desayuno"
  | "colacion"
  | "tarde"
  | "noche"
  | "maridaje"
  | "compartir"
  | "solo"
  | "festivo";

/** Perfil de maridaje */
export type PairingTag =
  | "vino_tinto"
  | "vino_blanco"
  | "cerveza"
  | "pisco"
  | "sin_alcohol"
  | "café"
  | "independiente";

/* ─── Metadatos sensoriales de un ítem de menú ─────────────── */
export interface SensoryProfile {
  intensity:    Intensity;
  temperature:  Temperature;
  flavors:      FlavorProfile[];
  moments:      MomentTag[];
  pairings:     PairingTag[];
  /** 0-100: % de satisfacción general según historial del engine */
  popularityScore: number;
}

/* ─── Ítem enriquecido (dato de menú + perfil sensorial) ───── */
export interface RichMenuItem {
  id:          string;
  sectionId:   string;
  name:        string;
  price:       number | null;
  description?: string;
  group:       "food" | "drinks";
  /** color de acento de la sección padre */
  accent:      string;
  sensory:     SensoryProfile;
}

/* ─── Score de afinidad multidimensional ────────────────────── */
export interface AffinityScore {
  itemId:      string;
  /** 0-100 score total ponderado */
  total:       number;
  /** Breakdowns por dimensión */
  dimensions: {
    moment:    number;  // afinidad con el momento elegido
    flavor:    number;  // coherencia de perfil de sabor
    pairing:   number;  // maridaje con lo ya seleccionado
    popularity:number;  // popularidad base
    balance:   number;  // balance/diversidad del pedido
  };
  /** Texto editorial generado por el engine */
  headline:   string;
  why:        string;
  badge:      AffinityBadge | null;
}

export type AffinityBadge =
  | { type: "perfect_match"; label: "Combinación perfecta";    color: "#c9a84c" }
  | { type: "sommelier";     label: "Elección del sommelier";  color: "#9a7a36" }
  | { type: "popular";       label: "El más pedido";           color: "#b8732a" }
  | { type: "hidden_gem";    label: "Joya escondida";          color: "#5a7a8a" }
  | { type: "pairing";       label: "Maridaje ideal";          color: "#5a1a38" };

/* ─── Selección del usuario en el canvas ───────────────────── */
export type MoodAttribute =
  | "intenso"
  | "suave"
  | "festivo"
  | "íntimo"
  | "rápido"
  | "para_compartir"
  | "solo"
  | "con_alcohol"
  | "sin_alcohol";

/* ─── Ítem en el carrito de experiencia ─────────────────────── */
export interface ExperienceCartItem {
  id:          string;
  sectionId:   string;
  name:        string;
  price:       number | null;
  qty:         number;
  group:       "food" | "drinks";
  affinityScore?: number;
  isRecommended: boolean;
}

/* ─── Estado global del canvas de experiencia ──────────────── */
export interface ExperienceState {
  /* Atributos de mood elegidos por el usuario (no lineales) */
  selectedMoods:    MoodAttribute[];

  /* Sección activa en el explorer */
  activeSection:    string | null;

  /* Carrito de experiencia */
  cart:             ExperienceCartItem[];

  /* Scores calculados */
  affinityMap:      Record<string, AffinityScore>;

  /* Panel actual */
  panel:            ExperiencePanel;

  /* Sidebar de resumen abierto */
  summaryOpen:      boolean;
}

export type ExperiencePanel =
  | "canvas"      // pantalla principal de exploración
  | "explorer"    // browser de sección específica
  | "summary";    // resumen final
