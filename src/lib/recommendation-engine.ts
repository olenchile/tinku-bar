/**
 * Recommendation Engine v2 — Tinku Restobar
 * Scoring multidimensional con 5 ejes ponderados.
 *
 * Pesos:
 *   moment    × 0.28  — afinidad con el estado de ánimo seleccionado
 *   flavor    × 0.24  — coherencia del perfil de sabor
 *   pairing   × 0.22  — maridaje con lo ya seleccionado en el carrito
 *   popularity× 0.16  — popularidad base del ítem
 *   balance   × 0.10  — contribuye diversidad al pedido
 */

import { menuData } from "@/data/menu";
import type {
  AffinityScore,
  AffinityBadge,
  ExperienceCartItem,
  FlavorProfile,
  MoodAttribute,
  PairingTag,
  RichMenuItem,
  SensoryProfile,
} from "@/types/wizard";

/* ─── Base de perfiles sensoriales ──────────────────────────── */
const SENSORY_DB: Record<string, SensoryProfile> = {
  /* DESAYUNOS */
  "desayunos-PAILA HUEVO + CAFÉ O TÉ":           { intensity:2, temperature:"caliente", flavors:["umami","tostado"],       moments:["desayuno"],      pairings:["café","sin_alcohol"],        popularityScore:82 },
  "desayunos-WAFLES CON FRUTA + CAFÉ O TÉ":      { intensity:1, temperature:"caliente", flavors:["dulce","fresco"],        moments:["desayuno","tarde"],pairings:["café","sin_alcohol"],        popularityScore:90 },
  "desayunos-TOSTADAS CON PALTA + CAFÉ O TÉ":    { intensity:1, temperature:"caliente", flavors:["vegetal","fresco"],      moments:["desayuno"],      pairings:["café","sin_alcohol"],        popularityScore:88 },

  /* COLACION */
  "colacion-PLATO DEL DÍA + BEBIDA":             { intensity:3, temperature:"caliente", flavors:["umami","vegetal"],       moments:["colacion"],      pairings:["sin_alcohol","cerveza"],     popularityScore:94 },
  "colacion-CAZUELA DEL DÍA":                    { intensity:3, temperature:"caliente", flavors:["umami"],                 moments:["colacion"],      pairings:["sin_alcohol"],               popularityScore:87 },

  /* PLATOS CARTA */
  "platos_carta-CEVICHE A LO PERUANO":           { intensity:4, temperature:"fría",     flavors:["ácido","fresco","umami"],moments:["noche","compartir"],pairings:["pisco","vino_blanco"],    popularityScore:96 },
  "platos_carta-CEVICHE CHILENO":                { intensity:4, temperature:"fría",     flavors:["ácido","fresco","umami"],moments:["noche","compartir"],pairings:["pisco","vino_blanco"],    popularityScore:94 },
  "platos_carta-LOMO AL VINO CON SALSA DE CHAMPIÑON": { intensity:5, temperature:"caliente", flavors:["umami","espirituoso"], moments:["noche"],   pairings:["vino_tinto","pisco"],         popularityScore:91 },
  "platos_carta-CHORRILLANA INDIVIDUAL":         { intensity:4, temperature:"caliente", flavors:["umami"],                 moments:["noche","compartir"],pairings:["cerveza","vino_tinto"],   popularityScore:88 },
  "platos_carta-SALMON EN SALSA DE ALCAPARRA":   { intensity:4, temperature:"caliente", flavors:["umami","ácido"],         moments:["noche"],         pairings:["vino_blanco","pisco"],       popularityScore:92 },
  "platos_carta-RISOTO DE MARISCO":              { intensity:5, temperature:"caliente", flavors:["umami"],                 moments:["noche"],         pairings:["vino_blanco"],               popularityScore:89 },
  "platos_carta-LOMO VETADO A LO POBRE":         { intensity:5, temperature:"caliente", flavors:["umami"],                 moments:["noche"],         pairings:["vino_tinto","cerveza"],      popularityScore:93 },
  "platos_carta-POLLO A LO POBRE":               { intensity:3, temperature:"caliente", flavors:["umami"],                 moments:["colacion","noche"],pairings:["cerveza","vino_tinto"],    popularityScore:86 },

  /* TABLAS */
  "tablas-TABLA CALIENTE CARNE, POLLO Y PAPAS FRITAS": { intensity:4, temperature:"caliente", flavors:["umami"],          moments:["noche","compartir"],pairings:["cerveza","vino_tinto"],   popularityScore:90 },
  "tablas-TABLA FRIA ACEITUNAS, QUESO, SALAME, TOSTADAS, FRUTOS SECOS": { intensity:2, temperature:"fría", flavors:["umami","ácido"], moments:["noche","compartir"],pairings:["vino_tinto","cerveza","pisco"], popularityScore:87 },

  /* COMPARTIR */
  "compartir-CAMARON AL PILPIL":                 { intensity:4, temperature:"caliente", flavors:["umami","espirituoso"],   moments:["noche","compartir"],pairings:["vino_blanco","pisco"],    popularityScore:85 },
  "compartir-PAPAS FRITAS GRANDE":               { intensity:1, temperature:"caliente", flavors:["tostado"],              moments:["noche","compartir"],pairings:["cerveza","independiente"],popularityScore:92 },
  "compartir-AROS DE CEBOLLA (10 UNIDADES)":     { intensity:2, temperature:"caliente", flavors:["tostado"],              moments:["noche","compartir"],pairings:["cerveza"],                popularityScore:86 },

  /* PASTAS */
  "pastas-TALLARINES A LA BOLOÑESA + HUEVO FRITO": { intensity:3, temperature:"caliente", flavors:["umami","vegetal"],    moments:["colacion","noche"],pairings:["vino_tinto","sin_alcohol"], popularityScore:88 },
  "pastas-TALLARINES EN SALSA DE CAMARONES":     { intensity:4, temperature:"caliente", flavors:["umami"],                moments:["noche"],           pairings:["vino_blanco"],              popularityScore:83 },

  /* SANDWICH */
  "sandwich-MECHADA ITALIANA":                   { intensity:3, temperature:"caliente", flavors:["umami"],                moments:["colacion","tarde"],pairings:["cerveza","sin_alcohol"],    popularityScore:89 },
  "sandwich-CHURRASCO ITALIANO":                 { intensity:3, temperature:"caliente", flavors:["umami","fresco"],       moments:["colacion","tarde"],pairings:["cerveza","sin_alcohol"],    popularityScore:87 },

  /* TARDES / ONCE */
  "tardes_once-WAFLES CON FRUTA + CAFÉ O TÉ":    { intensity:1, temperature:"caliente", flavors:["dulce","fresco"],       moments:["tarde"],           pairings:["café","sin_alcohol"],       popularityScore:88 },

  /* POSTRES */
  "postres-TORTA TRES LECHE":                    { intensity:2, temperature:"fría",     flavors:["dulce"],                moments:["noche","tarde"],   pairings:["café","sin_alcohol","vino_blanco"], popularityScore:91 },
  "postres-TIRAMISU":                            { intensity:2, temperature:"fría",     flavors:["dulce","tostado","espirituoso"], moments:["noche"], pairings:["café"],                     popularityScore:90 },
  "postres-VOLCAN CON HELADO":                   { intensity:3, temperature:"caliente", flavors:["dulce","tostado"],       moments:["noche"],           pairings:["café","sin_alcohol"],       popularityScore:93 },
  "postres-FRAPPUCCINO GRANDE":                  { intensity:2, temperature:"fría",     flavors:["dulce","tostado"],       moments:["tarde"],           pairings:["independiente"],            popularityScore:87 },

  /* BAJATIVOS */
  "bajativos-MENTA FRAPPE":                      { intensity:1, temperature:"fría",     flavors:["vegetal","fresco"],     moments:["colacion","tarde","noche"], pairings:["independiente"], popularityScore:80 },
  "bajativos-MANZANILLA":                        { intensity:1, temperature:"caliente", flavors:["vegetal"],              moments:["colacion","tarde","noche"], pairings:["independiente"], popularityScore:78 },

  /* JUGOS Y BEBIDAS */
  "jugos_bebidas-LIMONADA CREMOSA":              { intensity:2, temperature:"fría",     flavors:["ácido","dulce","fresco"],moments:["colacion","tarde","noche"], pairings:["independiente"],popularityScore:90 },
  "jugos_bebidas-MANGO":                         { intensity:1, temperature:"fría",     flavors:["dulce","fresco"],       moments:["colacion","tarde"],pairings:["independiente"],            popularityScore:85 },

  /* CAFÉ */
  "cafe-CAPUCCINO":                              { intensity:3, temperature:"caliente", flavors:["tostado","dulce"],      moments:["desayuno","tarde"],pairings:["café","independiente"],     popularityScore:88 },
  "cafe-ESPRESSO DOBLE":                         { intensity:5, temperature:"caliente", flavors:["tostado"],              moments:["desayuno","tarde"],pairings:["café","independiente"],     popularityScore:82 },
  "cafe-LATTE":                                  { intensity:2, temperature:"caliente", flavors:["tostado","dulce"],      moments:["desayuno","tarde"],pairings:["café","independiente"],     popularityScore:86 },

  /* TRAGOS */
  "tragos-PISCO SOUR":                           { intensity:3, temperature:"fría",     flavors:["ácido","espirituoso"],  moments:["noche","compartir"],pairings:["pisco"],                  popularityScore:95 },
  "tragos-CATEDRAL":                             { intensity:4, temperature:"fría",     flavors:["espirituoso","ácido"],  moments:["noche","festivo","compartir"],pairings:["pisco"],         popularityScore:88 },
  "tragos-MOJITO":                               { intensity:3, temperature:"fría",     flavors:["espirituoso","fresco","ácido"],moments:["noche","festivo"],pairings:["independiente"],     popularityScore:87 },
  "tragos-SANGRIA DE 1 LITRO":                   { intensity:3, temperature:"fría",     flavors:["espirituoso","dulce","fresco"],moments:["noche","festivo","compartir"],pairings:["independiente"],popularityScore:84 },

  /* TRAGOS PROMO */
  "tragos_promo-2X CORTO DE PISCO MISTRAL 40°":  { intensity:5, temperature:"fría",    flavors:["espirituoso"],          moments:["noche","festivo"], pairings:["pisco"],                   popularityScore:86 },
  "tragos_promo-2X SHOP HEINEKEN":               { intensity:2, temperature:"fría",     flavors:["espirituoso"],          moments:["noche","festivo","compartir"],pairings:["cerveza"],      popularityScore:83 },

  /* VINOS */
  "vinos-CASILLERO DEL DIABLO (RESERVA) CARMENERE": { intensity:4, temperature:"templada", flavors:["espirituoso","umami"], moments:["noche","maridaje"], pairings:["vino_tinto"],          popularityScore:92 },
  "vinos-TERRUNYO CARMENERE SAUVIGNON 750 ML":   { intensity:5, temperature:"templada", flavors:["espirituoso","umami"],  moments:["noche","maridaje"], pairings:["vino_tinto"],            popularityScore:88 },
  "vinos-MISION DE RENGO":                       { intensity:3, temperature:"templada", flavors:["espirituoso"],          moments:["noche","maridaje"], pairings:["vino_tinto"],            popularityScore:85 },
};

function getSensory(sectionId: string, name: string): SensoryProfile {
  const key = `${sectionId}-${name}`;
  return SENSORY_DB[key] ?? {
    intensity: 3,
    temperature: "caliente",
    flavors: ["umami"],
    moments: ["noche", "colacion"],
    pairings: ["independiente"],
    popularityScore: 75,
  };
}

/* ─── Mapeo mood → dimensiones sensoriales ──────────────────── */
const MOOD_TO_FLAVOR: Record<string, FlavorProfile[]> = {
  intenso:       ["umami", "espirituoso", "tostado"],
  suave:         ["fresco", "vegetal", "dulce"],
  festivo:       ["espirituoso", "ácido"],
  íntimo:        ["umami", "espirituoso"],
  rápido:        ["vegetal", "fresco"],
  para_compartir:["umami", "tostado"],
  solo:          ["vegetal", "tostado"],
  con_alcohol:   ["espirituoso", "ácido"],
  sin_alcohol:   ["fresco", "vegetal", "dulce"],
};

const MOOD_TO_PAIRING: Record<string, PairingTag[]> = {
  intenso:       ["vino_tinto", "pisco"],
  suave:         ["café", "sin_alcohol"],
  festivo:       ["pisco", "cerveza"],
  íntimo:        ["vino_tinto", "vino_blanco"],
  rápido:        ["sin_alcohol"],
  para_compartir:["cerveza", "pisco"],
  solo:          ["café", "sin_alcohol"],
  con_alcohol:   ["pisco", "vino_tinto", "cerveza"],
  sin_alcohol:   ["sin_alcohol", "café"],
};

/* ─── Scoring engine ─────────────────────────────────────────── */
const WEIGHTS = { moment: 0.28, flavor: 0.24, pairing: 0.22, popularity: 0.16, balance: 0.10 };

function scoreMoment(sensory: SensoryProfile, moods: string[]): number {
  if (!moods.length) return 50;
  const momentHits = sensory.moments.filter((m) =>
    moods.some((mood) => mood.toLowerCase().includes(m) || m.includes(mood))
  );
  return Math.min(100, 30 + momentHits.length * 35);
}

function scoreFlavor(sensory: SensoryProfile, moods: string[]): number {
  if (!moods.length) return 50;
  const wantedFlavors = moods.flatMap((m) => MOOD_TO_FLAVOR[m] ?? []);
  const matches = sensory.flavors.filter((f) => wantedFlavors.includes(f));
  const ratio = matches.length / Math.max(1, sensory.flavors.length);
  return Math.min(100, 20 + ratio * 80);
}

function scorePairing(sensory: SensoryProfile, cart: ExperienceCartItem[], moods: string[]): number {
  const wantedPairings = moods.flatMap((m) => MOOD_TO_PAIRING[m] ?? []);
  const cartPairings   = cart.flatMap((item) => {
    const s = getSensory(item.sectionId, item.name);
    return s.pairings;
  });
  const combined = [...new Set([...wantedPairings, ...cartPairings])];
  const hits = sensory.pairings.filter((p) => combined.includes(p) || p === "independiente");
  return Math.min(100, hits.length > 0 ? 45 + hits.length * 25 : 20);
}

function scoreBalance(sensory: SensoryProfile, cart: ExperienceCartItem[]): number {
  if (!cart.length) return 60;
  const cartGroups = new Set(cart.map((c) => c.group));
  const cartFlavors = new Set(cart.flatMap((c) => getSensory(c.sectionId, c.name).flavors));
  const addsDiversity = sensory.flavors.some((f) => !cartFlavors.has(f));
  const addsGroup     = !cartGroups.has(sensory.flavors[0] === "espirituoso" ? "drinks" : "food");
  return addsDiversity ? (addsGroup ? 90 : 65) : 40;
}

function buildHeadline(score: number, sensory: SensoryProfile, moods: string[]): { headline: string; why: string } {
  if (score >= 88) return {
    headline: "Hecho para este momento",
    why: `Su perfil ${sensory.flavors[0]} armoniza perfectamente con tu elección`,
  };
  if (score >= 75) return {
    headline: "Una elección memorable",
    why: `Temperatura ${sensory.temperature}, intensidad ${sensory.intensity}/5`,
  };
  if (score >= 60) return {
    headline: "Vale la pena explorar",
    why: moods.length ? `Complementa bien tu estado de ánimo` : `Opción sólida y versátil`,
  };
  return {
    headline: "Para los aventureros",
    why: `Contraste interesante con lo que llevas`,
  };
}

function buildBadge(score: number, sensory: SensoryProfile, moods: string[]): AffinityBadge | null {
  if (score >= 92) return { type: "perfect_match", label: "Combinación perfecta",   color: "#c9a84c" };
  if (sensory.flavors.includes("espirituoso") && moods.includes("íntimo"))
                   return { type: "sommelier",     label: "Elección del sommelier",  color: "#9a7a36" };
  if (sensory.popularityScore >= 90)
                   return { type: "popular",       label: "El más pedido",           color: "#b8732a" };
  if (score >= 78 && sensory.popularityScore < 85)
                   return { type: "hidden_gem",    label: "Joya escondida",          color: "#5a7a8a" };
  const pairingMoods = ["con_alcohol", "íntimo", "noche"];
  if (moods.some((m) => pairingMoods.includes(m)) && sensory.flavors.includes("espirituoso"))
                   return { type: "pairing",       label: "Maridaje ideal",          color: "#5a1a38" };
  return null;
}

/* ─── API pública ────────────────────────────────────────────── */
export function computeAffinityMap(
  moods: string[],
  cart:  ExperienceCartItem[],
): Record<string, AffinityScore> {
  const result: Record<string, AffinityScore> = {};

  for (const section of Object.values(menuData)) {
    for (const item of section.items) {
      const id      = `${section.id}-${item.name}`;
      const sensory = getSensory(section.id, item.name);

      const m  = scoreMoment(sensory, moods);
      const fl = scoreFlavor(sensory, moods);
      const pa = scorePairing(sensory, cart, moods);
      const po = sensory.popularityScore;
      const ba = scoreBalance(sensory, cart);

      const total = Math.round(
        m  * WEIGHTS.moment    +
        fl * WEIGHTS.flavor    +
        pa * WEIGHTS.pairing   +
        po * WEIGHTS.popularity +
        ba * WEIGHTS.balance
      );

      const { headline, why } = buildHeadline(total, sensory, moods);
      const badge             = buildBadge(total, sensory, moods);

      result[id] = { itemId: id, total, dimensions: { moment: m, flavor: fl, pairing: pa, popularity: po, balance: ba }, headline, why, badge };
    }
  }

  return result;
}

/** Top N ítems por score total, excluyendo los ya en el carrito */
export function getTopRecommendations(
  affinityMap: Record<string, AffinityScore>,
  cart:        ExperienceCartItem[],
  limit        = 6,
): AffinityScore[] {
  const cartIds = new Set(cart.map((c) => c.id));
  return Object.values(affinityMap)
    .filter((s) => !cartIds.has(s.itemId) && s.total >= 55)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

/** Enriquece un ítem del menú con datos sensoriales */
export function toRichMenuItem(sectionId: string, name: string, price: number | null, description?: string, group: "food" | "drinks" = "food", accent = "#c9a84c"): RichMenuItem {
  return {
    id: `${sectionId}-${name}`, sectionId, name, price, description, group, accent,
    sensory: getSensory(sectionId, name),
  };
}
