/* ─── Tipos base ────────────────────────────────────────────── */
export interface MenuItem {
  name: string;
  price: number | null;
  description?: string;
}

export interface MenuSection {
  id: MenuSectionId;
  title: string;
  emoji: string;        // Twemoji source — e.g. "🍳"
  group: "food" | "drinks";
  accent: string;       // hex color
  items: MenuItem[];
}

export type MenuSectionId =
  | "desayunos"
  | "colacion"
  | "platos_carta"
  | "compartir"
  | "tablas"
  | "pastas"
  | "sandwich"
  | "sandwich_papas"
  | "tardes_once"
  | "postres"
  | "bajativos"
  | "jugos_bebidas"
  | "cafe"
  | "tragos"
  | "tragos_promo"
  | "vinos";

/* ─── Datos del menú completo ───────────────────────────────── */
export const menuData: Record<MenuSectionId, MenuSection> = {
  desayunos: {
    id: "desayunos",
    title: "Desayunos",
    emoji: "🍳",
    group: "food",
    accent: "#c8882a",
    items: [
      { name: "PAILA HUEVO + CAFÉ O TÉ", price: 4500 },
      { name: "OMELETTE + 1 AGREGADO + CAFÉ O TÉ", price: 5500 },
      { name: "TORTA DEL DIA + CAFÉ O TÉ", price: 5500 },
      { name: "WAFLES CON FRUTA + CAFÉ O TÉ", price: 6500 },
      { name: "TOSTADAS CON PALTA + CAFÉ O TÉ", price: 5500 },
      { name: "TOSTADAS CON MERMELADA + CAFÉ O TÉ", price: 4500 },
      { name: "PAILA QUESO + CAFÉ O TÉ", description: "(5 láminas de queso)", price: 4500 },
      { name: "SANDWICH QUESO FRESCO", price: 3800 },
      { name: "EMPANADAS", description: "(consultar disponibilidad)", price: 3000 },
    ],
  },

  colacion: {
    id: "colacion",
    title: "Colación",
    emoji: "🥗",
    group: "food",
    accent: "#4a6e3a",
    items: [
      { name: "PLATO DEL DÍA + BEBIDA", price: 5900 },
      { name: "SOPA + SEGUNDO + BEBIDA", price: 6900 },
      { name: "ENSALADA + SEGUNDO + BEBIDA", price: 6500 },
      { name: "MINUTA DEL DÍA", description: "(consultar disponibilidad)", price: 5500 },
      { name: "CAZUELA DEL DÍA", price: 5800 },
      { name: "POROTOS GRANADOS", price: 5200 },
      { name: "LENTEJAS CON LONGANIZA", price: 5200 },
      { name: "TALLARÍN CON SALSA DE CARNE", price: 5800 },
    ],
  },

  platos_carta: {
    id: "platos_carta",
    title: "A la Carta",
    emoji: "🍽️",
    group: "food",
    accent: "#b85c38",
    items: [
      { name: "CEVICHE A LO PERUANO", price: 14800 },
      { name: "CEVICHE CHILENO", price: 14800 },
      { name: "REINETA A LA MANTEQUILLA", price: 12000 },
      { name: "SALMON EN SALSA DE ALCAPARRA", price: 13800 },
      { name: "CHORRILLANA INDIVIDUAL", price: 13800 },
      { name: "LOMO AL VINO CON SALSA DE CHAMPIÑON", price: 12000 },
      { name: "CHORILLANA PARA 2 PERSONAS", price: 21000 },
      { name: "LOMO SALTADO", price: 13800 },
      { name: "ARROZ CHAUFA DE LOMO", price: 13800 },
      { name: "TALLARIN SALTADO DE CARNE O POLLO", price: 13500 },
      { name: "LOMO VETADO A LO POBRE", price: 14800 },
      { name: "POLLO A LO POBRE", price: 12800 },
      { name: "POLLO A LA PLANCHA + AGREGADO", price: 10000 },
      { name: "LOMO + AGREGADO", price: 12800 },
      { name: "COSTILLAR + AGREGADO", price: 10800 },
      { name: "CARNE MECHADA + AGREGADO", price: 9800 },
      { name: "CHULETA PARRILLERA + AGREGADO", price: 8800 },
      { name: "SALSA ALCAPARRA ADICIONAL", price: 2000 },
      { name: "REINETA A LO MACHO", price: 14800 },
      { name: "RISOTO DE MARISCO", price: 14800 },
      { name: "FILETE MAR Y TIERRA", price: 14800 },
    ],
  },

  compartir: {
    id: "compartir",
    title: "Para Compartir",
    emoji: "🤝",
    group: "food",
    accent: "#4a6e3a",
    items: [
      { name: "EMPANADAS QUESO (8 UNIDADES)", price: 5800 },
      { name: "CAMARON AL PILPIL", price: 7800 },
      { name: "CHORRILLANA CLÁSICA", price: 14800 },
      { name: "PAPAS SUPRIME", description: "(Queso-orégano individual)", price: 4800 },
      { name: "AROS DE CEBOLLA (10 UNIDADES)", price: 2800 },
      { name: "MINI SOPAIPILLAS", price: 4500 },
      { name: "EMPANADAS", description: "(Mechada queso - champiñón - queso, napolitana queso - pino)", price: 3000 },
      { name: "PAPAS FRITAS CHICA", price: 4800 },
      { name: "PAPAS FRITAS GRANDE", price: 6000 },
    ],
  },

  tablas: {
    id: "tablas",
    title: "Tablas para 2",
    emoji: "🪵",
    group: "food",
    accent: "#5a3a1a",
    items: [
      { name: "TABLA CALIENTE CARNE, POLLO Y PAPAS FRITAS", price: 14800 },
      { name: "TABLA FRIA ACEITUNAS, QUESO, SALAME, TOSTADAS, FRUTOS SECOS", price: 13800 },
      { name: "TABLA LOMO SALTADO + PAPAS FRITAS", price: 16800 },
    ],
  },

  pastas: {
    id: "pastas",
    title: "Pastas",
    emoji: "🍝",
    group: "food",
    accent: "#c8882a",
    items: [
      { name: "TALLARINES A LA BOLOÑESA + HUEVO FRITO", price: 8900 },
      { name: "TALLARINES AL PESTO", price: 8900 },
      { name: "TALLARINES ALFREDO", price: 8900 },
      { name: "TALLARINES CON MECHADA", price: 9500 },
      { name: "TALLARINES EN SALSA DE CAMARONES", price: 10800 },
      { name: "PASTA EN SALSA DE CHAMPIÑONES", price: null },
    ],
  },

  sandwich: {
    id: "sandwich",
    title: "Sandwich",
    emoji: "🥪",
    group: "food",
    accent: "#b85c38",
    items: [
      { name: "MECHADA ITALIANA", price: 6800 },
      { name: "CHURRASCO ITALIANO", price: 6800 },
      { name: "BARROS LUCO", price: 4800 },
      { name: "CHACARERO", price: 6000 },
      { name: "MECHADA TOMATE", price: 6000 },
      { name: "BARROS JARPA", price: 4800 },
      { name: "AVE MAYO", price: 4000 },
      { name: "CHURRASCO", price: 4800 },
      { name: "CHURRASCO PALTA MAYO", price: 5800 },
    ],
  },

  sandwich_papas: {
    id: "sandwich_papas",
    title: "Sandwich + Papas",
    emoji: "🍟",
    group: "food",
    accent: "#c87830",
    items: [
      { name: "MECHADA PALTA", price: 7000 },
      { name: "MECHADA TOMATE", price: 6800 },
      { name: "MECHADA ITALIANA", price: 7500 },
      { name: "CHURRASCO ITALIANO", price: 7500 },
      { name: "BARROS LUCO", price: 5200 },
      { name: "CHACARERO", price: 6800 },
      { name: "BARROS JARPA", price: 4800 },
      { name: "AVE MAYO", price: 4200 },
      { name: "CHURRASCO SOLO", price: 4800 },
      { name: "CHURRASCO PALTA MAYO", price: 6500 },
      { name: "SANDWICH VEGANO", description: "(seitan, hamburguesa soya, vegan burger, crispy)", price: 6800 },
      { name: "COMPLETO ITALIANO + PAPAS FRITAS", price: 3800 },
    ],
  },

  tardes_once: {
    id: "tardes_once",
    title: "Tardes de Once",
    emoji: "🫖",
    group: "food",
    accent: "#b05048",
    items: [
      { name: "PAILA HUEVO + CAFÉ O TÉ", price: 4500 },
      { name: "OMELETTE + 1 AGREGADO + CAFÉ O TÉ", price: 5500 },
      { name: "TORTA DEL DÍA + CAFÉ O TÉ", price: 5500 },
      { name: "WAFLES CON FRUTA + CAFÉ O TÉ", price: 5800 },
      { name: "TOSTADAS CON PALTA + CAFÉ O TÉ", price: 4800 },
      { name: "TOSTADAS CON MERMELADA Y MANTEQUILLA + CAFÉ O TÉ", price: 4500 },
      { name: "PAILA QUESO + CAFÉ O TÉ", price: 4300 },
      { name: "SANDWICH QUESO FRESCO", price: 3500 },
      { name: "ADICIONALES — PALTA/JAMÓN/QUESO/TOCINO/HUEVO", price: 1800 },
    ],
  },

  postres: {
    id: "postres",
    title: "Postres",
    emoji: "🍰",
    group: "food",
    accent: "#b05048",
    items: [
      { name: "TORTA TRES LECHE", price: 4000 },
      { name: "TIRAMISU", price: 4000 },
      { name: "CREMA VOLTEADA", price: 4000 },
      { name: "KUCHEN DE MANZANA", price: 4000 },
      { name: "KUCHEN DE FRAMBUESA", price: 4000 },
      { name: "KUCHEN DE NUEZ", price: 4000 },
      { name: "PIE DE MARACUYA", price: 4000 },
      { name: "RICOTA", price: 4000 },
      { name: "FRAPPUCCINO", price: 5500 },
      { name: "FRAPPUCCINO GRANDE", price: 7000 },
      { name: "CAFE HELADO", price: 5800 },
      { name: "VOLCAN", price: 5800 },
      { name: "VOLCAN CON HELADO", price: 6000 },
      { name: "COPA DE HELADO (2 SABORES)", price: 2900 },
      { name: "COPA DE HELADO", description: "(2 sabores, crema de chantilly, salsa de chocolate o frambuesa)", price: 4500 },
      { name: "PANQUEQUE CON HELADO", price: 4500 },
      { name: "WAFLES CON FRUTA DE ESTACION", price: 6800 },
      { name: "CROISSANT DE CREMA DE CHOCOLATE Y AVELLANAS", price: 1990 },
      { name: "CROISSANT CURVO 2X", price: 2500 },
      { name: "PORCION DE QUEQUE", price: 1500 },
    ],
  },

  bajativos: {
    id: "bajativos",
    title: "Bajativos",
    emoji: "🌿",
    group: "drinks",
    accent: "#4a6e3a",
    items: [
      { name: "MANZANILLA", price: 1800 },
      { name: "MANZANILLA FRAPPE", price: 1800 },
      { name: "MENTA", price: 1800 },
      { name: "MENTA FRAPPE", price: 1800 },
      { name: "BITTER", price: 1800 },
      { name: "ARAUCANO", price: 1800 },
    ],
  },

  jugos_bebidas: {
    id: "jugos_bebidas",
    title: "Jugos y Bebidas",
    emoji: "🧃",
    group: "drinks",
    accent: "#c87830",
    items: [
      { name: "MANGO", price: 4000 },
      { name: "FRAMBUESA", price: 4000 },
      { name: "PIÑA", price: 4000 },
      { name: "KIWI", price: 4000 },
      { name: "LIMONADA", price: 4000 },
      { name: "FRUTILLA", price: 4000 },
      { name: "MELON", price: 4000 },
      { name: "LUCUMA", price: 4000 },
      { name: "ARANDANOS", price: 4000 },
      { name: "PAPAYA PERUANA", price: 4000 },
      { name: "LIMONADA CREMOSA", price: 5000 },
      { name: "JUGO GUALLARAUCO", price: 4800 },
      { name: "JUGO CON LECHE", description: "(sabor a elección)", price: 5800 },
      { name: "BEBIDAS 1/4", price: 4800 },
      { name: "BEBIDAS EN LATA", price: 2000 },
      { name: "BEBIDAS EXPRESS", price: 1700 },
      { name: "RED BULL", price: 3000 },
      { name: "AGUA MINERAL", price: 1700 },
      { name: "AGUA MINERAL VIDRIO", price: 2000 },
      { name: "AGUA MINERAL POR VENIR", price: 2500 },
      { name: "AGUA PERRIER", price: 3500 },
    ],
  },

  cafe: {
    id: "cafe",
    title: "Café Kimbo",
    emoji: "☕",
    group: "drinks",
    accent: "#5a3a1a",
    items: [
      { name: "ESPRESSO", price: 2200 },
      { name: "ESPRESSO DOBLE", price: 3200 },
      { name: "AMERICANO", price: 2900 },
      { name: "CAPUCCINO", price: 3200 },
      { name: "CORTADO", price: 2900 },
      { name: "CORTADO DOBLE", price: 3500 },
      { name: "CAFE CON LECHE", price: 3800 },
      { name: "LATTE", price: 3800 },
      { name: "MOCACCINO", price: 3800 },
      { name: "TETERA DE TÉ PARA DOS PERSONAS", description: "(Canela, Ceylan, Frutilla)", price: 4800 },
    ],
  },

  tragos: {
    id: "tragos",
    title: "Tragos",
    emoji: "🍹",
    group: "drinks",
    accent: "#b85c38",
    items: [
      { name: "PISCO SOUR", price: 4800 },
      { name: "PISCO SOUR 1 LITRO SOLO DELIVERY", price: 18900 },
      { name: "CATEDRAL", price: 7800 },
      { name: "MANGO SOUR", price: 4800 },
      { name: "MARACUYA SOUR", price: 4800 },
      { name: "MOJITO", price: 6000 },
      { name: "VAINA", price: 5800 },
      { name: "AMARETTO SOUR", price: 4800 },
      { name: "CORTO DE PISCO MISTRAL 40°", description: "(sin bebida)", price: 6000 },
      { name: "CORTO DE MISTRAL 35°", description: "(sin bebida)", price: 5000 },
      { name: "CORTO RON HAVANA AÑEJO", description: "(sin bebida)", price: 5000 },
      { name: "CORTO VODKA", description: "(sin bebida)", price: 6000 },
      { name: "CERVEZAS INDIVIDUALES", description: "Royal - Heineken - Corona - Sol - Zero alcohol", price: 3800 },
      { name: "KUNSTMANN TOROBAYO", price: 5000 },
      { name: "AUSTRAL CALAFATE", price: 5200 },
      { name: "SHOP STELLA", price: 4000 },
      { name: "SHOP HEINEKEN", price: 4200 },
      { name: "SHOP KALAFATE", price: 5200 },
      { name: "CERVEZA DE 1 LITRO", price: 4800 },
      { name: "MICHELADA", price: 4800 },
      { name: "SANGRIA DE 1 LITRO", price: 15000 },
      { name: "VINO INDIVIDUAL", price: 3500 },
      { name: "VINO MEDIANO", price: 5800 },
      { name: "VINO CARMENERE", price: 12000 },
      { name: "LATE HARVEST", price: 17000 },
      { name: "VINO CARMEN GRAN RESERVA", price: 21000 },
      { name: "VINO TERRUNYO CARMENERE", price: 30000 },
    ],
  },

  tragos_promo: {
    id: "tragos_promo",
    title: "Promos 2x1",
    emoji: "🎉",
    group: "drinks",
    accent: "#c87830",
    items: [
      { name: "2X CORTO DE PISCO MISTRAL 40°", price: 8000 },
      { name: "2X CORTO MISTRAL 35°", price: 7000 },
      { name: "2X CORTO RON HAVANA AÑEJO", price: 7000 },
      { name: "2X CORTO VODKA", price: 7000 },
      { name: "2X SHOP STELLA", price: 7000 },
      { name: "2X SHOP HEINEKEN", price: 7500 },
    ],
  },

  vinos: {
    id: "vinos",
    title: "Carta de Vinos",
    emoji: "🍷",
    group: "drinks",
    accent: "#5a1a38",
    items: [
      { name: "TERRUNYO CARMENERE SAUVIGNON 750 ML", price: 30000 },
      { name: "CONCHA Y TORO (THE WINE) CARMENERE", price: 25000 },
      { name: "CONCHA Y TORO (THE WINE) CABERNET SAUVIGNON", price: 25000 },
      { name: "CONCHA Y TORO (THE WINE) MERLOT", price: 25000 },
      { name: "CONCHA Y TORO LATE HARVEST 375ML", price: 17000 },
      { name: "CASTILLO DE MOLINA 500ML", price: 16000 },
      { name: "MEDALLA REAL (RESERVA) CARMENERE", price: 22000 },
      { name: "MEDALLA REAL (RESERVA) CABERNET SAUVIGNON", price: 22000 },
      { name: "MEDALLA REAL (RESERVA) MERLOT", price: 22000 },
      { name: "CASILLERO DEL DIABLO (RESERVA) CARMENERE", price: 18000 },
      { name: "CASILLERO DEL DIABLO (RESERVA) CABERNET", price: 18000 },
      { name: "CASILLERO DEL DIABLO (RESERVA) MERLOT", price: 18000 },
      { name: "MISIONES DE RENGO (GRAN RESERVA) CARMENERE", description: "(MEDIUM SWEET)", price: 18000 },
      { name: "MISION RED BLEND", price: 18000 },
      { name: "MISIONES DE RENGO CABERNET", price: 18000 },
      { name: "MISIONES DE RENGO MERLOT", price: 18000 },
      { name: "MISION DE RENGO", price: 12000 },
      { name: "GRAN 120", price: 12000 },
      { name: "CARMEN CARMENERE (FRIDA KAHLO)", price: 15000 },
      { name: "MISION DE RENGO 375 ML", price: 6000 },
      { name: "MISION DE RENGO 187ML", price: 3800 },
      { name: "SANTA EMILIANA CABERNET SAUVIGNON 375 ML", price: 8000 },
    ],
  },
};

/* ─── Helpers ───────────────────────────────────────────────── */
export const FOOD_SECTIONS = Object.values(menuData).filter(
  (s) => s.group === "food"
) as MenuSection[];

export const DRINK_SECTIONS = Object.values(menuData).filter(
  (s) => s.group === "drinks"
) as MenuSection[];

export function formatPrice(price: number | null): string {
  if (price === null) return "Consultar";
  return `$${price.toLocaleString("es-CL")}`;
}
