// ─── TIPOS DE MINUTA SEMANAL ──────────────────────────────────────────────────

export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes";

export interface DiaMinuta {
  platos: string[];
  veganos: string[];
  agregados: string[];
  ensaladas: string[];
  postres: string[];
}

export interface MinutaSemanal {
  titulo: string;
  periodo: string;
  hipocaloricos: string[];
  dias: Record<DiaSemana, DiaMinuta>;
}

export const DIAS_LABELS: Record<DiaSemana, string> = {
  lunes: "LUNES",
  martes: "MARTES",
  miercoles: "MIÉRCOLES",
  jueves: "JUEVES",
  viernes: "VIERNES",
};

export const DIAS_ORDER: DiaSemana[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
];
