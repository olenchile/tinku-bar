"use client";

import React, { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  Coffee,
  Utensils,
  Wine,
  CakeSlice,
  ArrowLeft,
  CheckCircle2,
  Info,
  CalendarCheck,
  Star,
} from "lucide-react";
import { TinkuLogo } from "@/components/tinku-logo";
import { ReservaWizard } from "@/components/reserva-wizard";

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface MenuItem {
  name: string;
  description?: string;
  price: number | null;
}

interface Subcategory {
  name: string;
  items: MenuItem[];
}

interface MacroCategory {
  title: string;
  icon: React.ReactNode;
  subcategories: Subcategory[];
}

type MenuData = Record<string, MacroCategory>;

type Step = "cover" | "macro" | "sub" | "items" | "complement" | "cart";

// ─── DATOS DEL MENÚ ───────────────────────────────────────────────────────────

const menuData: MenuData = {
  comida: {
    title: "Para Comer",
    icon: <Utensils size={40} className="mb-2" />,
    subcategories: [
      {
        name: "Platos a la Carta",
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
      {
        name: "Sándwich Solo",
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
      {
        name: "Sándwich + Papas Fritas",
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
          {
            name: "SANDWICH VEGANO",
            description: "(seitan, haburguesa soya, vegan burger, crispy)",
            price: 6800,
          },
          { name: "COMPLETO ITALIANO + PAPAS FRITAS", price: 3800 },
        ],
      },
      {
        name: "Clásicos para Compartir",
        items: [
          { name: "EMPANADAS QUESO (8 UNIDADES)", price: 5800 },
          { name: "CAMARON AL PILPIL", price: 7800 },
          { name: "CHORRILLANA CLÁSICA", price: 14800 },
          {
            name: "PAPAS SUPRIME",
            description: "(Queso-orégano individual)",
            price: 4800,
          },
          { name: "AROS DE CEBOLLA (10 UNIDADES)", price: 2800 },
          { name: "MINI SOPAIPILLAS", price: 4500 },
          {
            name: "EMPANADAS",
            description:
              "(Mechada queso - champiñon - queso, napolitana queso - pino)",
            price: 3000,
          },
          { name: "PAPAS FRITAS CHICA", price: 4800 },
          { name: "PAPAS FRITAS GRANDE", price: 6000 },
        ],
      },
      {
        name: "Tablas para 2 Personas",
        items: [
          { name: "TABLA CALIENTE CARNE, POLLO Y PAPAS FRITAS", price: 14800 },
          {
            name: "TABLA FRIA ACEITUNAS, QUESO, SALAME, TOSTADAS, FRUTOS SECOS",
            price: 13800,
          },
          { name: "TABLA LOMO SALTADO + PAPAS FRITAS", price: 16800 },
        ],
      },
      {
        name: "Pastas",
        items: [
          { name: "TALLARINES A LA BOLOÑESA+ HUEVO FRITO", price: 8900 },
          { name: "TALLARINES AL PESTO", price: 8900 },
          { name: "TALLARINES ALFREDO", price: 8900 },
          { name: "TALLARINES CON MECHADA", price: 9500 },
          { name: "TALLARINES EN SALSA DE CAMARONES", price: 10800 },
          { name: "PASTA EN SALSA DE CHAMPIÑONES", price: null },
        ],
      },
    ],
  },
  bebidas: {
    title: "Para Beber",
    icon: <Wine size={40} className="mb-2" />,
    subcategories: [
      {
        name: "Jugos Naturales y Bebidas",
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
          { name: "BEBIDAS 1/4", price: 4800 },
          { name: "BEBIDAS EN LATA", price: 2000 },
          { name: "BEBIDAS EXPRESS", price: 1700 },
          { name: "RED BULL", price: 3000 },
          { name: "AGUA MINERAL", price: 1700 },
          { name: "AGUA MINERAL VIDRIO", price: 2000 },
          { name: "AGUA MINERAL POR VENIR", price: 2500 },
          { name: "AGUA PERRIER", price: 3500 },
          {
            name: "JUGO CON LECHE",
            description: "(sabor a elección)",
            price: 5800,
          },
        ],
      },
      {
        name: "Tragos",
        items: [
          { name: "PISCO SOUR", price: 4800 },
          { name: "PISCO SOUR 1 LITRO SOLO DELIVERY", price: 18900 },
          { name: "CATEDRAL", price: 7800 },
          { name: "MANGO SOU", price: 4800 },
          { name: "MARACUYA SOUR", price: 4800 },
          { name: "MOJITO", price: 6000 },
          { name: "VAINA", price: 5800 },
          { name: "AMARETTO SOUR", price: 4800 },
          {
            name: "CORTO DE PISCO MISTRAL 40°",
            description: "(sin bebida)",
            price: 6000,
          },
          {
            name: "CORTO DE MISTRAL 35°",
            description: "(sin bebida)",
            price: 5000,
          },
          {
            name: "CORTO RON HAVANA AÑEJO",
            description: "(sin bebida)",
            price: 5000,
          },
          { name: "CORTO VODKA", description: "(sin bebida)", price: 6000 },
          {
            name: "CERVEZAS INDIVIDUALES",
            description: "Royal - Heniken - Corona - Sol - Zero alcohol",
            price: 3800,
          },
          { name: "KUNSTMANN TOROBAYO", price: 5000 },
          { name: "AUTRAL CALAFATE", price: 5200 },
          { name: "SHOP STELLA", price: 4000 },
          { name: "SHOP HENIKEN", price: 4200 },
          { name: "SHOP KALAFATE", price: 5200 },
          { name: "CERVEZA DE 1 LITRO", price: 4800 },
          { name: "MICHELADA", price: 4800 },
          { name: "SANGRIA DE 1 LITRO", price: 15000 },
        ],
      },
      {
        name: "Tragos Promo",
        items: [
          { name: "2X CORTO DE PISCO MISTRAL 40°", price: 8000 },
          { name: "2X CORTO MISTRAL 35°", price: 7000 },
          { name: "2X CORTO RON HAVANA AÑEJO", price: 7000 },
          { name: "2X CORTO VODKA", price: 7000 },
          { name: "2X SHOP STELA", price: 7000 },
          { name: "2X SHOP HENIKEN", price: 7500 },
        ],
      },
      {
        name: "Carta de Vinos",
        items: [
          { name: "TERRUNYO CARMERE SAUVIGNON 750 ML", price: 30000 },
          { name: "CONCHA Y TORO (THE WINE) CARMENERE", price: 25000 },
          {
            name: "CONCHA Y TORO (THE WINE) CABERNET SAUVIGNON",
            price: 25000,
          },
          { name: "CONCHA Y TORO (THE WINE) MERLOT", price: 25000 },
          { name: "CONCHA Y TORO LATE HARVEST 375ML", price: 17000 },
          { name: "CASTILLO DE MOLINA 500ML", price: 16000 },
          { name: "MEDALLA REAL (RESERVA) CARMENERE", price: 22000 },
          { name: "MEDALLA REAL (RESERVA) CABERNET SAUVIGNON", price: 22000 },
          { name: "MEDALLA REAL (RESERVA) MERLOT", price: 22000 },
          { name: "CASILLERO DEL DIABLO(RESERVA) CARMENERE", price: 18000 },
          { name: "CASILLERO DEL DIABLO(RESERVA) CABERNET", price: 18000 },
          { name: "CASILLERO DEL DIABLO(RESERVA) MERLOT", price: 18000 },
          {
            name: "MISIONES DE RENGO (GRAN RESERVA) CARMENERE",
            description: "(MEDIUN SWEET)",
            price: 18000,
          },
          { name: "MISION RED BLEND", price: 18000 },
          { name: "MISIONES D RENGO CABERNET", price: 18000 },
          { name: "MISIONES D RENGO MERLOT", price: 18000 },
          { name: "MISION DE RENGO", price: 12000 },
          { name: "GRAN 120", price: 12000 },
          { name: "CARMEN CARMENERE (FRIDA KAHLO)", price: 15000 },
          { name: "MISION DE RENGO 375 ML", price: 6000 },
          { name: "MISION DE RENGO 187ML", price: 3800 },
          { name: "SANTA EMILIANA CABERNET SAUVIGNON 375 ML", price: 8000 },
          { name: "VINO INDIVIDUALES", price: 3500 },
          { name: "VINO MEDIANO", price: 5800 },
          { name: "VINO CARMENERE", price: 12000 },
          { name: "LATE HARVEST", price: 17000 },
          { name: "VINO CARMEN GRAN RESERVA", price: 21000 },
          { name: "VINO TERRUNYO CARMENERE", price: 30000 },
        ],
      },
    ],
  },
  desayuno: {
    title: "Desayuno y Once",
    icon: <Coffee size={40} className="mb-2" />,
    subcategories: [
      {
        name: "Carta Desayuno",
        items: [
          { name: "PAILA HUEVO+CAFÉ O TÉ", price: 4500 },
          { name: "OMELETTE + 1 AGREGADO+ CAFÉ O TÉ", price: 5500 },
          { name: "TORTA DEL DIA + CAFÉ O TÉ", price: 5500 },
          { name: "WAFLES CON FRUTA + CAFÉ O TÉ", price: 6500 },
          { name: "TOSTADAS CON PALTA+ CAFÉ O TÉ", price: 5500 },
          { name: "TOSTADAS CON MERMELADA + CAFÉ O TÉ", price: 4500 },
          {
            name: "PAILA QUESO+ CAFÉ O TÉ",
            description: "(5 lamina de queso)",
            price: 4500,
          },
          { name: "SANDWICH QUESO FRESCO", price: 3800 },
          {
            name: "EMPANADAS",
            description: "(consultar disponibilidad)",
            price: 3000,
          },
          { name: "ADICIONAL PALTA/JAMÓN/QUESO/TOCINO/HUEVO", price: 1800 },
        ],
      },
      {
        name: "Tardes de Once",
        items: [
          { name: "PAILA HUEVO+CAFE O TE", price: 4500 },
          { name: "OMELETTE + 1 AGREGADO+ CAFE O TE", price: 5500 },
          { name: "TORTA DEL DIA + CAFE O TE", price: 5500 },
          { name: "WAFLES CON FRUTA + CAFE O TE", price: 5800 },
          { name: "TOSTADAS CON PALTA+ CAFE O TE", price: 4800 },
          {
            name: "TOSTADAS CON MERMELADA Y MANTEQUILLA + CAFE O TE",
            price: 4500,
          },
          { name: "PAILA QUESO+ CAFE O TE", price: 4300 },
          { name: "SANDWICH QUESO FRESCO", price: 3500 },
          { name: "ADICIONAL PALTA/JAMÓN/QUESO/TOCINO/HUEVO", price: 1800 },
        ],
      },
      {
        name: "Café Grano Kimbo",
        items: [
          { name: "EPRESSO", price: 2200 },
          { name: "ESPRESSO DOBLE", price: 3200 },
          { name: "AMERICANO", price: 2900 },
          { name: "CAPUCCINO", price: 3200 },
          { name: "CORTADO", price: 2900 },
          { name: "CORTADO DOBLE", price: 3500 },
          { name: "CAFE CON LECHE", price: 3800 },
          { name: "LATTE", price: 3800 },
          { name: "MOCACCINO", price: 3800 },
          {
            name: "TETERA DE TE PARA DOS PERSONAS",
            description: "(Canela, Ceylan, Frutilla)",
            price: 4800,
          },
        ],
      },
    ],
  },
  postres: {
    title: "Postres y Bajativos",
    icon: <CakeSlice size={40} className="mb-2" />,
    subcategories: [
      {
        name: "Postres",
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
          { name: "COPA DE HELADO (2 sabores)", price: 2900 },
          {
            name: "COPA DE HELADO ESPECIAL",
            description:
              "(2 sabores, crema chantilly, salsa de chocolate o frambuesa)",
            price: 4500,
          },
          { name: "PANQUEQUE CON HELADO", price: 4500 },
          { name: "WAFLES CON FRUTA DE ESTACION", price: 6800 },
          {
            name: "CROISSANT DE CREMA DE CHOCOLATE Y AVELLANAS",
            price: 1990,
          },
          { name: "CROISSANT CURVO 2 X", price: 2500 },
          { name: "PORCION DE QUEQUE", price: 1500 },
          { name: "VOLCAN CON HELADO", price: 6000 },
        ],
      },
      {
        name: "Bajativos",
        items: [
          { name: "MANZANILLA", price: 1800 },
          { name: "MANZANILLA FRAPPE", price: 1800 },
          { name: "MENTA", price: 1800 },
          { name: "MENTA FRAPPE", price: 1800 },
          { name: "BITTER", price: 1800 },
          { name: "ARAUCANO", price: 1800 },
        ],
      },
    ],
  },
};

// ─── CARRUSEL DE PORTADA ──────────────────────────────────────────────────────

function CoverCarousel({ onStart }: { onStart: () => void }) {
  const images = [
    "/gallery/WhatsApp_Image_2026-07-25_at_7.22.48_PM.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.02_PM.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.02_PM_1.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.03_PM.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.03_PM_1.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.04_PM.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.04_PM_1.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.04_PM_2.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.05_PM.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.05_PM_1.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.05_PM_2.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.06_PM.jpeg",
    "/gallery/WhatsApp_Image_2026-07-25_at_7.23.06_PM_1.jpeg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-stone-900">
      <AnimatePresence mode="wait">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <m.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Restobar Tinku"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.5, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/50 to-transparent flex flex-col items-center justify-end pb-16 px-6">
        <m.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center w-full max-w-md"
        >
          <div className="mx-auto mb-2 flex justify-center">
            <TinkuLogo size={280} invert />
          </div>
          <p className="text-stone-300 text-lg mb-8 font-medium">
            Nueva Extremadura #4402
          </p>

          {/* Botón principal: Ver Nuestra Carta */}
          <button
            onClick={onStart}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white text-2xl font-bold py-6 rounded-2xl shadow-[0_8px_30px_rgb(217,119,6,0.3)] flex items-center justify-center space-x-3 transition-transform active:scale-95 mb-4"
          >
            <span>VER NUESTRA CARTA</span>
            <ChevronRight size={32} />
          </button>

          {/* Pirámide: dos botones secundarios */}
          <m.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            <ReservaWizard>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 w-full">
                <CalendarCheck size={26} className="text-amber-400" />
                <span className="text-base font-bold tracking-wide">RESERVAR</span>
              </button>
            </ReservaWizard>
            <a
              href="https://g.page/r/CXL3cIT1CTiyEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Star size={26} className="text-amber-400" />
              <span className="text-base font-bold tracking-wide">CALIFICANOS</span>
            </a>
          </m.div>
        </m.div>
      </div>
    </div>
  );
}

// ─── LISTA PAGINADA ────────────────────────────────────────────────────────────

function PaginatedList({
  items,
  onSelect,
  title,
}: {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  title: string;
}) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));
  const prev = () => setPage((p) => Math.max(0, p - 1));

  useEffect(() => {
    setPage(0);
  }, [items]);

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto pt-6 pb-24">
      <h3 className="text-3xl font-serif font-bold text-emerald-950 mb-6 text-center px-4">
        {title}
      </h3>

      <div className="flex-1 space-y-4 px-4 min-h-[400px]">
        <AnimatePresence mode="wait">
          <m.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {currentItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(item)}
                className="w-full bg-white p-5 rounded-2xl shadow-sm border-2 border-stone-100 hover:border-amber-500 flex justify-between items-center text-left active:bg-stone-50 transition-all"
              >
                <div className="flex-1 pr-4">
                  <span className="text-xl font-bold text-stone-800 leading-tight block">
                    {item.name}
                  </span>
                  {item.description && (
                    <span className="text-sm text-stone-500 mt-1 block leading-snug">
                      {item.description}
                    </span>
                  )}
                </div>
                <span className="text-xl font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl shrink-0">
                  {item.price
                    ? `$${item.price.toLocaleString("es-CL")}`
                    : "Consultar"}
                </span>
              </button>
            ))}
          </m.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 mt-6">
          <button
            onClick={prev}
            disabled={page === 0}
            className={`p-5 rounded-2xl flex items-center justify-center transition-colors ${
              page === 0
                ? "bg-stone-200 text-stone-400"
                : "bg-emerald-900 text-white active:bg-emerald-800"
            }`}
          >
            <ChevronLeft size={36} />
          </button>

          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <div
                key={i}
                className={`h-3 rounded-full transition-all ${
                  i === page ? "w-8 bg-amber-500" : "w-3 bg-stone-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={page === totalPages - 1}
            className={`p-5 rounded-2xl flex items-center justify-center transition-colors ${
              page === totalPages - 1
                ? "bg-stone-200 text-stone-400"
                : "bg-emerald-900 text-white active:bg-emerald-800"
            }`}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────

export default function HomePage() {
  const [step, setStep] = useState<Step>("cover");
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [selectedMacro, setSelectedMacro] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subcategory | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
    if (selectedMacro === "comida") {
      setStep("complement");
    } else {
      setStep("cart");
    }
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const sendWhatsApp = () => {
    const total = cart.reduce((acc, item) => acc + (item.price ?? 0), 0);
    let text = `¡Hola Restobar Tinku! 👋%0AMe gustaría hacer un pedido desde la mesa:%0A%0A`;
    cart.forEach((item) => {
      const priceText = item.price
        ? `$${item.price.toLocaleString("es-CL")}`
        : "Consultar";
      text += `▪ ${item.name} (${priceText})%0A`;
    });
    text += `%0A*Total Aproximado: $${total.toLocaleString("es-CL")}*%0A%0A¡Muchas gracias!`;
    window.open(`https://wa.me/56989058820?text=${text}`, "_blank");
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.price ?? 0), 0);

  const viewVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: { duration: 0.2, ease: "easeIn" as const },
    },
  };

  const handleBack = () => {
    if (step === "sub") setStep("macro");
    if (step === "items") setStep("sub");
    if (step === "complement") setStep("cart");
    if (step === "cart") setStep("macro");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans overflow-x-hidden relative">
      {/* Botón flotante de Carrito */}
      {step !== "cover" && cart.length > 0 && step !== "cart" && (
        <m.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setStep("cart")}
          className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center animate-bounce border-4 border-[#FDFBF7]"
        >
          <ShoppingCart size={32} />
          <span className="absolute -top-3 -right-3 bg-emerald-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 border-[#FDFBF7]">
            {cart.length}
          </span>
        </m.button>
      )}

      {/* Header Fijo */}
      {step !== "cover" && (
        <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200 p-4 flex items-center justify-center h-20 shadow-sm">
          {step !== "macro" && (
            <button
              onClick={handleBack}
              className="absolute left-4 p-3 text-stone-600 hover:bg-stone-200 active:bg-stone-300 rounded-full transition-colors"
            >
              <ArrowLeft size={32} />
            </button>
          )}
          <h2 className="font-serif font-bold text-2xl text-emerald-950 tracking-widest uppercase">
            Restobar Tinku
          </h2>
        </header>
      )}

      <main className="w-full h-full pb-20">
        <AnimatePresence mode="wait">
          {/* PASO 0: PORTADA */}
          {step === "cover" && (
            <m.div
              key="cover"
              className="h-screen"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CoverCarousel onStart={() => setStep("macro")} />
            </m.div>
          )}

          {/* PASO 1: MACRO CATEGORÍA */}
          {step === "macro" && (
            <m.div
              key="macro"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center px-4 pt-8 max-w-md mx-auto"
            >
              <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-8 text-center leading-tight">
                ¿Qué se te antoja hoy?
              </h2>
              <div className="grid grid-cols-2 gap-4 w-full">
                {Object.entries(menuData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedMacro(key);
                      setStep("sub");
                    }}
                    className="bg-white aspect-square flex flex-col items-center justify-center p-6 rounded-[2rem] shadow-sm border-2 border-stone-100 hover:border-amber-500 hover:shadow-lg transition-all text-emerald-900 active:scale-95 active:bg-stone-50"
                  >
                    {data.icon}
                    <span className="font-bold text-2xl mt-3 text-center leading-tight font-serif">
                      {data.title}
                    </span>
                  </button>
                ))}
              </div>
            </m.div>
          )}

          {/* PASO 2: SUB-CATEGORÍAS */}
          {step === "sub" && selectedMacro && (
            <m.div
              key="sub"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col px-4 pt-8 max-w-md mx-auto w-full"
            >
              <h2 className="text-3xl font-serif font-bold text-emerald-950 mb-8 text-center">
                Toca para abrir
              </h2>
              <div className="space-y-4">
                {menuData[selectedMacro].subcategories.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSub(sub);
                      setStep("items");
                    }}
                    className="w-full bg-white p-6 rounded-2xl shadow-sm border-2 border-stone-100 hover:border-amber-500 flex justify-between items-center text-left active:bg-stone-50 active:scale-[0.98] transition-all"
                  >
                    <span className="text-2xl font-bold text-stone-800 leading-tight pr-4">
                      {sub.name}
                    </span>
                    <ChevronRight size={32} className="text-amber-600 shrink-0" />
                  </button>
                ))}
              </div>
            </m.div>
          )}

          {/* PASO 3: ITEMS */}
          {step === "items" && selectedSub && (
            <m.div
              key="items"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              <PaginatedList
                items={selectedSub.items}
                title={selectedSub.name}
                onSelect={addToCart}
              />
            </m.div>
          )}

          {/* PASO 4: CROSS-SELLING */}
          {step === "complement" && (
            <m.div
              key="complement"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center px-4 pt-10 max-w-md mx-auto"
            >
              <div className="bg-emerald-50 rounded-full p-4 mb-4 shadow-inner">
                <CheckCircle2 size={56} className="text-emerald-600" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-2 text-center">
                ¡Plato agregado!
              </h2>
              <p className="text-xl text-stone-600 mb-10 text-center font-medium">
                ¿Deseas acompañarlo con algo para beber?
              </p>

              <div className="space-y-4 w-full">
                <button
                  onClick={() =>
                    addToCart({ name: "LIMONADA CREMOSA", price: 5000 })
                  }
                  className="w-full bg-white p-5 rounded-2xl shadow-sm border-2 border-emerald-100 active:border-emerald-500 flex justify-between items-center"
                >
                  <span className="text-xl font-bold text-stone-800">
                    Limonada Cremosa
                  </span>
                  <span className="text-xl font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                    $5.000
                  </span>
                </button>
                <button
                  onClick={() => addToCart({ name: "PISCO SOUR", price: 4800 })}
                  className="w-full bg-white p-5 rounded-2xl shadow-sm border-2 border-emerald-100 active:border-emerald-500 flex justify-between items-center"
                >
                  <span className="text-xl font-bold text-stone-800">
                    Pisco Sour Clásico
                  </span>
                  <span className="text-xl font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                    $4.800
                  </span>
                </button>
                <button
                  onClick={() =>
                    addToCart({ name: "BEBIDA EN LATA", price: 2000 })
                  }
                  className="w-full bg-white p-5 rounded-2xl shadow-sm border-2 border-emerald-100 active:border-emerald-500 flex justify-between items-center"
                >
                  <span className="text-xl font-bold text-stone-800">
                    Bebida en Lata
                  </span>
                  <span className="text-xl font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                    $2.000
                  </span>
                </button>

                <button
                  onClick={() => setStep("cart")}
                  className="w-full p-6 mt-4 text-2xl font-bold text-stone-400 hover:text-stone-600 underline text-center"
                >
                  No gracias, ir a mi pedido
                </button>
              </div>
            </m.div>
          )}

          {/* PASO 5: CARRITO */}
          {step === "cart" && (
            <m.div
              key="cart"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col px-4 pt-8 max-w-md mx-auto w-full pb-10"
            >
              <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-8 text-center">
                Tu Pedido
              </h2>

              {cart.length === 0 ? (
                <div className="text-center text-stone-500 mt-10">
                  <ShoppingCart size={80} className="mx-auto mb-6 opacity-20" />
                  <p className="text-2xl font-medium">
                    La mesa aún no ha pedido nada.
                  </p>
                  <button
                    onClick={() => setStep("macro")}
                    className="mt-10 bg-emerald-900 text-white px-8 py-5 rounded-full text-2xl font-bold w-full shadow-lg active:scale-95 transition-transform"
                  >
                    Explorar la carta
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 overflow-hidden mb-8">
                    <ul className="divide-y divide-stone-100">
                      {cart.map((item, idx) => (
                        <li
                          key={idx}
                          className="p-5 flex justify-between items-center"
                        >
                          <span className="text-xl font-bold text-stone-800 pr-4 leading-tight">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xl font-bold text-stone-600">
                              {item.price
                                ? `$${item.price.toLocaleString("es-CL")}`
                                : "-"}
                            </span>
                            <button
                              onClick={() => removeFromCart(idx)}
                              className="text-red-500 bg-red-50 hover:bg-red-100 p-3 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                            >
                              <span className="sr-only">Eliminar</span>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-emerald-50 p-6 flex justify-between items-center border-t border-emerald-100">
                      <span className="text-2xl font-serif font-bold text-emerald-950">
                        TOTAL
                      </span>
                      <span className="text-3xl font-bold text-emerald-700">
                        ${totalCart.toLocaleString("es-CL")}
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-8 flex gap-3 text-amber-900">
                    <Info className="shrink-0" size={24} />
                    <p className="text-sm font-medium">
                      Al tocar &quot;Pedir al Mesero&quot;, se abrirá WhatsApp
                      con el detalle de tu orden para que nos lo envíes
                      directamente.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setStep("macro")}
                      className="w-full bg-stone-200 text-stone-800 text-2xl font-bold py-5 rounded-2xl flex items-center justify-center gap-2 active:bg-stone-300 transition-colors"
                    >
                      <span className="text-3xl leading-none">+</span>
                      <span>Agregar más cosas</span>
                    </button>
                    <button
                      onClick={sendWhatsApp}
                      className="w-full bg-[#25D366] text-white text-2xl font-bold py-6 rounded-2xl shadow-[0_8px_30px_rgb(37,211,102,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="36"
                        height="36"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                      </svg>
                      <span>Pedir al Mesero</span>
                    </button>
                  </div>
                </>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
