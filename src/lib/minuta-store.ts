import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MinutaSemanal } from "./minuta-types";

// ─── DATOS POR DEFECTO (basados en la minuta de la imagen) ───────────────────

export const DEFAULT_MINUTA: MinutaSemanal = {
  titulo: "MINUTA SEMANAL TINKU",
  periodo: "24 AL 28 DE AGOSTO",
  hipocaloricos: [
    "ENSALADA DE PASTA PAVO (mix de lechuga, cherry, cebolla morada, palta, choclo)",
    "SALPICÓN DE LOMITO AL AGUA O POLLO (base de lechuga, papas en cubo, lomitos de atún, huevo duro, zanahoria, tomate y salsa de la casa)",
    "ENSALADA GRIEGA (Mix de lechuga, queso fresco, tomate cherry, aceitunas y tostada con orégano y oliva)",
    "ENSALADA PASTA CESAR (MIX DE LECHUGA, ESPIRALES TRISABOR, CROTONES, POLLO EN CUBOS, QUESO PARMESANO + SALSA)",
    "ENSALADA CESAR TRADICIONAL (MIX de lechuga crotones, pollo en cubos, queso parmesano y salsa)",
    "VEGETALES CON LOMITOS AL AGUA O POLLO A LA PLANCHA",
  ],
  dias: {
    lunes: {
      platos: [
        "POLLO ASADO AL HORNO + AG",
        "RAVIOLES DE CARNE CON SALSA PESTO",
        "TORTILLA DE VERDURAS + AG",
        "LENTEJAS CON LONGANIZA",
      ],
      veganos: [
        "LENTEJAS CON QUINOA Y ESPINACA",
        "HAMBURGUESA SOYA",
        "CESAR CON GRISPY",
      ],
      agregados: ["ARROZ", "PAPA MAYO", "CORBATITAS"],
      ensaladas: ["MIXTA", "BETARRAGA", "CEBOLLA ESCABECHE"],
      postres: ["JALEA", "MACEDONIA"],
    },
    martes: {
      platos: [
        "PULPA AL HORNO + AG",
        "BUDÍN DE ZAPALLITO + AG",
        "CAZUELA DE VACUNO",
        "POROTOS CON RIENDA",
        "EMPANADA HOJA QUESO 2 UNI",
      ],
      veganos: [
        "ESPIRALES A LA BOLOÑESA CON CARNE SOYA",
        "HAMBURGUESA DE SOYA + AG",
        "CESAR CON CRISPY",
      ],
      agregados: ["ARROZ JARDINERA", "PAPA BRAVAS", "CORBATITAS"],
      ensaladas: ["MIXTA", "APIO", "CEBOLLA EN ESCABECHE"],
      postres: ["JALEA", "QUEQUE VAINILLA"],
    },
    miercoles: {
      platos: [
        "GUATITA A LA JARDINERA + AG",
        "CARNE AL JUGO + AG",
        "GUISO DE ACELGA + AG",
        "EMPANADA HOJA QUESO 2 UNI",
      ],
      veganos: [
        "GUISO DE ACELGA",
        "HAMBURGUESA SOYA + AGREG",
        "CESAR CON VEGAN BURGER",
      ],
      agregados: ["ARROZ", "TALLARINES", "PAPA COCIDA"],
      ensaladas: ["MIXTA", "APIO", "COLIFLOR"],
      postres: ["JALEA", "COLEGIAL"],
    },
    jueves: {
      platos: [
        "PESCADO FRITO + AG",
        "CHARQUICAN CON HUEVO FRITO",
        "PANTRUCAS CASERA",
        "POROTOS CON RIENDA Y LONGANÍA",
      ],
      veganos: [
        "CHARQUICAN CON CHAPIÑONES",
        "HAMBURGUESA DE SOYA + AG",
      ],
      agregados: ["ARROZ Y PAPA MAYO", "CORBATITAS"],
      ensaladas: ["MIXTA", "APIO", "BRÓCOLI"],
      postres: ["JALEA", "MACEDONIA"],
    },
    viernes: {
      platos: [
        "COSTILLAR ASADA + AG",
        "SANDWICH DE MECHADA ITALIANA + PAPA FRITA",
        "POROTOS CON RIENDA Y LONGANIZA",
        "EMPANADA HOJA QUESO",
      ],
      veganos: [
        "BISTEC DE SAITAN + AG",
        "HAMBURGUESA DE SOYA + AGRE",
        "CESAR",
      ],
      agregados: ["ARROZ", "ESPIRALES", "PURÉ"],
      ensaladas: ["MIXTA", "APIO", "CHILENA"],
      postres: ["JALEA", "PLÁTANO"],
    },
  },
};

// ─── STORE ZUSTAND CON PERSISTENCIA ──────────────────────────────────────────

interface MinutaStore {
  minuta: MinutaSemanal;
  setMinuta: (minuta: MinutaSemanal) => void;
  resetMinuta: () => void;
}

export const useMinutaStore = create<MinutaStore>()(
  persist(
    (set) => ({
      minuta: DEFAULT_MINUTA,
      setMinuta: (minuta) => set({ minuta }),
      resetMinuta: () => set({ minuta: DEFAULT_MINUTA }),
    }),
    {
      name: "tinku-minuta-storage",
    }
  )
);
