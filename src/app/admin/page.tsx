"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import {
  menuApi,
  pedidosApi,
  todayChile,
  type MenuDia,
  type Pedido,
} from "@/lib/api-client";
import { DEFAULT_MINUTA } from "@/lib/minuta-store";
import type { MinutaSemanal, DiaSemana } from "@/lib/minuta-types";
import { DIAS_ORDER, DIAS_LABELS } from "@/lib/minuta-types";
import MinutaPreview from "@/components/minuta-preview";
import {
  Lock,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  LogOut,
  Users,
  UtensilsCrossed,
  RefreshCw,
  Loader2,
  BarChart3,
  ClipboardList,
  X,
  FileDown,
  CalendarDays,
} from "lucide-react";
import { TinkuLogo } from "@/components/tinku-logo";

// ─── PIN ──────────────────────────────────────────────────────────────────────
const ADMIN_PIN = "1234";

// ─── EDITOR DE LISTA ──────────────────────────────────────────────────────────

function ListEditor({
  label,
  items,
  onChange,
  colorClass = "border-stone-200",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  colorClass?: string;
}) {
  return (
    <div className={`border-2 ${colorClass} rounded-2xl p-4 mb-3`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-stone-700 uppercase tracking-wider">
          {label}
        </span>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="flex items-center gap-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-bold transition-colors"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                onChange(next);
              }}
              placeholder={`${label} ${idx + 1}`}
              className="flex-1 bg-white border border-stone-200 focus:border-amber-400 rounded-xl px-3 py-2 text-sm text-stone-800 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-stone-400 italic text-center py-2">
            Sin items — toca &quot;Agregar&quot;
          </p>
        )}
      </div>
    </div>
  );
}

// ─── EDITOR MENÚ COMPLETO ─────────────────────────────────────────────────────

function EditorMenu({
  minuta,
  onMinutaChange,
}: {
  minuta: MinutaSemanal;
  onMinutaChange: (m: MinutaSemanal) => void;
}) {
  const [activeDia, setActiveDia] = useState<DiaSemana>("lunes");
  const [open, setOpen] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const diaData = minuta.dias[activeDia];

  // Auto-save con debounce de 1s al cambiar la minuta
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setAutoSaveStatus("saving");
    saveTimerRef.current = setTimeout(async () => {
      try {
        const payload: MenuDia = {
          fecha: todayChile(),
          platos: minuta.dias[activeDia].platos,
          veganos: minuta.dias[activeDia].veganos,
          hipocaloricos: minuta.hipocaloricos,
          agregados: minuta.dias[activeDia].agregados,
          ensaladas: minuta.dias[activeDia].ensaladas,
          postres: minuta.dias[activeDia].postres,
        };
        await menuApi.save(payload);
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } catch {
        setAutoSaveStatus("idle");
      }
    }, 1000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minuta]);

  // Actualiza un campo del día activo
  const updateDia = (field: keyof typeof diaData, value: string[]) => {
    onMinutaChange({
      ...minuta,
      dias: {
        ...minuta.dias,
        [activeDia]: { ...diaData, [field]: value },
      },
    });
  };

  return (
    <div className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden mb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <UtensilsCrossed size={20} className="text-amber-600" />
          <span className="font-bold text-stone-800">Modificar Minuta</span>
        </div>
        <div className="flex items-center gap-2">
          {autoSaveStatus === "saving" && (
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> Guardando…
            </span>
          )}
          {autoSaveStatus === "saved" && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 size={12} /> Guardado
            </span>
          )}
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {/* ── Selector de día ── */}
              <div className="flex gap-1 mb-4 bg-stone-100 rounded-xl p-1">
                {DIAS_ORDER.map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => setActiveDia(dia)}
                    className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
                      activeDia === dia
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    {DIAS_LABELS[dia].slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* ── Listas del día activo ── */}
              <AnimatePresence mode="wait">
                <m.div
                  key={activeDia}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <ListEditor
                    label="Platos del Día"
                    items={diaData.platos}
                    onChange={(v) => updateDia("platos", v)}
                    colorClass="border-amber-200"
                  />
                  <ListEditor
                    label="Opciones Veganas"
                    items={diaData.veganos}
                    onChange={(v) => updateDia("veganos", v)}
                    colorClass="border-green-200"
                  />
                  <ListEditor
                    label="Agregados"
                    items={diaData.agregados}
                    onChange={(v) => updateDia("agregados", v)}
                    colorClass="border-red-200"
                  />
                  <ListEditor
                    label="Ensaladas"
                    items={diaData.ensaladas}
                    onChange={(v) => updateDia("ensaladas", v)}
                    colorClass="border-stone-200"
                  />
                  <ListEditor
                    label="Postres"
                    items={diaData.postres}
                    onChange={(v) => updateDia("postres", v)}
                    colorClass="border-pink-200"
                  />
                  <ListEditor
                    label="Hipocalóricos (todos los días)"
                    items={minuta.hipocaloricos}
                    onChange={(v) => onMinutaChange({ ...minuta, hipocaloricos: v })}
                    colorClass="border-teal-200"
                  />
                </m.div>
              </AnimatePresence>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── DASHBOARD PEDIDOS ────────────────────────────────────────────────────────

function DashboardPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const cargar = useCallback(async () => {
    try {
      const data = await pedidosApi.getByFecha(todayChile());
      setPedidos(data);
      setLastUpdate(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    const interval = setInterval(cargar, 30000);
    return () => clearInterval(interval);
  }, [cargar]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este pedido?")) return;
    try {
      await pedidosApi.delete(id);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert("Error al eliminar");
      console.error(e);
    }
  };

  const stats = pedidos.reduce<Record<string, number>>((acc, p) => {
    acc[p.plato] = (acc[p.plato] || 0) + 1;
    return acc;
  }, {});
  const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-amber-700">{pedidos.length}</p>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Pedidos hoy</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-green-700">
            {pedidos.filter((p) => p.vegano).length}
          </p>
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider mt-1">Veganos</p>
        </div>
      </div>

      {sortedStats.length > 0 && (
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={18} className="text-amber-600" />
            <h3 className="font-bold text-stone-800">Resumen por plato</h3>
          </div>
          <div className="space-y-2">
            {sortedStats.map(([plato, count]) => (
              <div key={plato} className="flex items-center gap-3">
                <div
                  className="h-2 bg-amber-400 rounded-full"
                  style={{ width: `${(count / pedidos.length) * 100}%`, minWidth: "8px" }}
                />
                <span className="text-sm text-stone-700 flex-1 leading-tight">{plato}</span>
                <span className="text-sm font-black text-amber-700 shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-stone-600" />
            <h3 className="font-bold text-stone-800">Pedidos del día</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">
              {lastUpdate.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={cargar}
              className="p-1.5 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <RefreshCw size={16} className={`text-stone-500 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {loading && pedidos.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 size={28} className="animate-spin text-amber-500" />
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-10 text-stone-400">
            <Users size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Sin pedidos aún hoy</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {pedidos.map((pedido) => (
              <li key={pedido.id} className="px-4 py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-stone-900 text-sm truncate">
                      {pedido.trabajadorNombre}
                    </span>
                    {pedido.vegano && (
                      <span className="text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        🌱
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-snug">{pedido.plato}</p>
                  {(pedido.agregado || pedido.ensalada || pedido.postre) && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      {[pedido.agregado, pedido.ensalada, pedido.postre].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => pedido.id && handleDelete(pedido.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onLogin();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-6">
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#FDFBF7] rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center"
      >
        <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Lock size={32} className="text-amber-600" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 mb-1 font-serif">Panel Admin</h1>
        <p className="text-stone-500 text-sm mb-7">Restobar Tinku</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN de acceso"
            maxLength={8}
            autoFocus
            className={`w-full border-2 ${
              error
                ? "border-red-400 bg-red-50"
                : "border-stone-200 focus:border-amber-500"
            } rounded-2xl px-5 py-4 text-xl font-bold text-center text-stone-800 outline-none transition-colors tracking-widest`}
          />
          {error && <p className="text-red-500 text-sm font-medium">PIN incorrecto</p>}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl text-lg transition-colors active:scale-95"
          >
            Ingresar
          </button>
        </form>
      </m.div>
    </div>
  );
}

// ─── PANEL ADMIN ──────────────────────────────────────────────────────────────

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"pedidos" | "menu">("pedidos");

  // Estado completo de la minuta — inicializa con DEFAULT_MINUTA
  const [minuta, setMinuta] = useState<MinutaSemanal>(() => ({
    ...DEFAULT_MINUTA,
    dias: { ...DEFAULT_MINUTA.dias },
  }));

  // Rango de fechas para el período
  const [rangoFecha, setRangoFecha] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    window.print();
  };

  const MESES = ["", "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

  const fmtFecha = (d: Date) =>
    `${d.getDate()} DE ${MESES[d.getMonth() + 1]}`;

  const handleRangoChange = (range: DateRange | undefined) => {
    setRangoFecha(range);
    if (!range) return;
    const { from, to } = range;
    // Solo actualiza el período cuando ambas fechas están seleccionadas
    if (from && to) {
      setMinuta((m) => ({ ...m, periodo: `${fmtFecha(from)} AL ${fmtFecha(to)}` }));
    } else if (from) {
      // Muestra fecha inicio como indicador de que falta la fecha final
      setMinuta((m) => ({ ...m, periodo: `Desde ${fmtFecha(from)}…` }));
    }
  };

  return (
    <>
      {/* ── Estilos para print (solo imprime la minuta) ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #minuta-print-area,
          #minuta-print-area * { visibility: visible !important; }
          #minuta-print-area {
            position: fixed !important;
            inset: 0 !important;
            z-index: 9999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#FDFBF7] font-sans">
        <header className="sticky top-0 z-40 bg-stone-900 text-white px-5 py-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <TinkuLogo size={100} invert static />
            <div className="border-l border-stone-700 pl-3">
              <h1 className="font-black text-base uppercase tracking-wide leading-tight">Admin</h1>
              <p className="text-stone-400 text-xs">{todayChile()}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-xl transition-colors"
          >
            <LogOut size={20} />
          </button>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-white sticky top-[72px] z-30">
          <button
            onClick={() => setTab("pedidos")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${
              tab === "pedidos"
                ? "text-amber-600 border-b-2 border-amber-500"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <Users size={18} /> Pedidos del día
          </button>
          <button
            onClick={() => setTab("menu")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${
              tab === "menu"
                ? "text-amber-600 border-b-2 border-amber-500"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <UtensilsCrossed size={18} /> Minuta semanal
          </button>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-5 pb-20">
          <AnimatePresence mode="wait">
            {tab === "pedidos" && (
              <m.div
                key="pedidos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DashboardPedidos />
              </m.div>
            )}

            {tab === "menu" && (
              <m.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Editor con selector de día */}
                <EditorMenu minuta={minuta} onMinutaChange={setMinuta} />

                {/* ── MINUTA SEMANAL ── */}
                <div className="mt-6">
                  {/* Header sección */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                        Minuta Semanal
                      </span>
                      <div className="w-16 h-px bg-stone-200" />
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      <FileDown size={15} />
                      Descargar PDF
                    </button>
                  </div>

                  {/* ── Definir fecha ── */}
                  <div className="bg-white border-2 border-stone-200 rounded-2xl p-4 mb-4 relative">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CalendarDays size={14} className="text-amber-600" />
                      Definir fecha
                    </p>

                    {/* Botón para abrir/cerrar calendario */}
                    <button
                      type="button"
                      onClick={() => setCalendarOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-3 bg-stone-50 hover:bg-amber-50 border-2 border-stone-200 hover:border-amber-300 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-left flex-1 min-w-0">
                          {rangoFecha?.from ? (
                            <div>
                              <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Período seleccionado</p>
                              <p className="text-sm font-bold text-stone-800 truncate">
                                {rangoFecha.from.toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                                {rangoFecha.to
                                  ? ` → ${rangoFecha.to.toLocaleDateString("es-CL", { day: "numeric", month: "short" })}`
                                  : " → …"}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Período</p>
                              <p className="text-sm text-stone-400">Selecciona las fechas de la semana</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <CalendarDays size={18} className={`shrink-0 transition-colors ${calendarOpen ? "text-amber-600" : "text-stone-400"}`} />
                    </button>

                    {/* Calendario desplegable */}
                    <AnimatePresence>
                      {calendarOpen && (
                        <m.div
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          className="mt-3 bg-white border-2 border-stone-100 rounded-2xl shadow-xl overflow-hidden"
                          style={{
                            "--rdp-accent-color": "#d97706",
                            "--rdp-accent-background-color": "#fef3c7",
                          } as React.CSSProperties}
                        >
                          <DayPicker
                            mode="range"
                            selected={rangoFecha}
                            onSelect={handleRangoChange}
                            disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                            locale={undefined}
                            showOutsideDays
                            className="p-3"
                          />
                          {rangoFecha?.from && (
                            <div className="px-4 pb-3 flex justify-between items-center border-t border-stone-100 pt-3">
                              <button
                                type="button"
                                onClick={() => { setRangoFecha(undefined); setMinuta((m) => ({ ...m, periodo: DEFAULT_MINUTA.periodo })); }}
                                className="text-xs text-stone-400 hover:text-red-500 font-medium transition-colors"
                              >
                                Limpiar
                              </button>
                              {rangoFecha.to ? (
                                  <button
                                    type="button"
                                    onClick={() => setCalendarOpen(false)}
                                    className="text-xs bg-amber-600 text-white font-bold px-4 py-1.5 rounded-lg hover:bg-amber-500 transition-colors"
                                  >
                                    Confirmar
                                  </button>
                                ) : (
                                  <span className="text-xs text-amber-600 font-semibold animate-pulse">
                                    Selecciona la fecha final ↗
                                  </span>
                                )}
                            </div>
                          )}
                        </m.div>
                      )}
                    </AnimatePresence>

                    {minuta.periodo && (
                      <p className="text-xs text-amber-700 font-semibold mt-2 text-center tracking-wide">
                        {minuta.periodo}
                      </p>
                    )}
                  </div>

                  {/* Área imprimible */}
                  <div id="minuta-print-area" ref={previewRef}>
                    <div className="overflow-x-auto rounded-2xl shadow-sm">
                      <MinutaPreview minuta={minuta} />
                    </div>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

// ─── PÁGINA ───────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!authenticated ? (
        <m.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginScreen onLogin={() => setAuthenticated(true)} />
        </m.div>
      ) : (
        <m.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AdminPanel onLogout={() => setAuthenticated(false)} />
        </m.div>
      )}
    </AnimatePresence>
  );
}
