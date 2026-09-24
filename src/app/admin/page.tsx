"use client";

import React, { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  menuApi,
  pedidosApi,
  todayChile,
  type MenuDia,
  type Pedido,
} from "@/lib/api-client";
import { DEFAULT_MINUTA } from "@/lib/minuta-store";
import {
  Lock,
  Save,
  RotateCcw,
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

// ─── EDITOR MENÚ DEL DÍA ──────────────────────────────────────────────────────

function EditorMenu() {
  const [menu, setMenu] = useState<MenuDia>({
    fecha: todayChile(),
    platos: [],
    veganos: [],
    hipocaloricos: [],
    agregados: [],
    ensaladas: [],
    postres: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuApi.get();
      if (data.platos?.length > 0 || data.veganos?.length > 0) {
        setMenu(data);
      } else {
        // Cargar desde minuta default según día
        const dow = new Date().getDay();
        const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"] as const;
        const diaKey = dias[dow] as keyof typeof DEFAULT_MINUTA.dias;
        const diaData = DEFAULT_MINUTA.dias[diaKey as "lunes" | "martes" | "miercoles" | "jueves" | "viernes"];
        if (diaData) {
          setMenu({
            fecha: todayChile(),
            ...diaData,
            hipocaloricos: DEFAULT_MINUTA.hipocaloricos,
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await menuApi.save({ ...menu, fecha: todayChile() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert("Error al guardar el menú");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-8">
      <Loader2 size={32} className="animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden mb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <UtensilsCrossed size={20} className="text-amber-600" />
          <span className="font-bold text-stone-800">Menú del día — {todayChile()}</span>
        </div>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
            <div className="p-4 space-y-1">
              <ListEditor label="Platos del Día" items={menu.platos} onChange={(v) => setMenu((m) => ({ ...m, platos: v }))} colorClass="border-amber-200" />
              <ListEditor label="Opciones Veganas" items={menu.veganos} onChange={(v) => setMenu((m) => ({ ...m, veganos: v }))} colorClass="border-green-200" />
              <ListEditor label="Hipocalóricos" items={menu.hipocaloricos} onChange={(v) => setMenu((m) => ({ ...m, hipocaloricos: v }))} colorClass="border-teal-200" />
              <ListEditor label="Agregados" items={menu.agregados} onChange={(v) => setMenu((m) => ({ ...m, agregados: v }))} colorClass="border-red-200" />
              <ListEditor label="Ensaladas" items={menu.ensaladas} onChange={(v) => setMenu((m) => ({ ...m, ensaladas: v }))} colorClass="border-stone-200" />
              <ListEditor label="Postres" items={menu.postres} onChange={(v) => setMenu((m) => ({ ...m, postres: v }))} colorClass="border-pink-200" />

              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-base transition-all mt-2 ${
                  saved ? "bg-green-500 text-white" : "bg-amber-600 hover:bg-amber-500 text-white"
                }`}
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
                {saving ? "Guardando..." : saved ? "¡Guardado!" : "Publicar menú del día"}
              </button>
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
    const interval = setInterval(cargar, 30000); // refresh cada 30s
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

  // Estadísticas
  const stats = pedidos.reduce<Record<string, number>>((acc, p) => {
    acc[p.plato] = (acc[p.plato] || 0) + 1;
    return acc;
  }, {});
  const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      {/* Header stats */}
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

      {/* Resumen por plato */}
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

      {/* Lista de pedidos */}
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
            className={`w-full border-2 ${error ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-amber-500"} rounded-2xl px-5 py-4 text-xl font-bold text-center text-stone-800 outline-none transition-colors tracking-widest`}
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

  return (
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
          <UtensilsCrossed size={18} /> Menú del día
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-5 pb-20">
        <AnimatePresence mode="wait">
          {tab === "pedidos" && (
            <m.div key="pedidos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DashboardPedidos />
            </m.div>
          )}
          {tab === "menu" && (
            <m.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EditorMenu />
            </m.div>
          )}
        </AnimatePresence>
      </main>
    </div>
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
