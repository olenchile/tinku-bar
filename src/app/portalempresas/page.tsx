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
  User,
  ChevronRight,
  CheckCircle2,
  Loader2,
  UtensilsCrossed,
  Leaf,
  Salad,
  IceCream,
  Flame,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { TinkuLogo } from "@/components/tinku-logo";

// ─── TIPOS LOCALES ────────────────────────────────────────────────────────────

type AppStep = "identificacion" | "menu" | "confirmacion" | "exito";

interface Seleccion {
  plato: string;
  esVegano: boolean;
  agregado: string;
  ensalada: string;
  postre: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

// ─── COMPONENTE: BOTÓN SELECCIONABLE ─────────────────────────────────────────

function OpcionBtn({
  label,
  selected,
  onClick,
  color = "amber",
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  color?: "amber" | "green" | "red" | "stone" | "pink";
}) {
  const colors = {
    amber: selected
      ? "bg-amber-500 border-amber-500 text-white shadow-[0_4px_14px_rgb(245,158,11,0.4)]"
      : "bg-white border-stone-200 text-stone-700 hover:border-amber-300",
    green: selected
      ? "bg-green-500 border-green-500 text-white shadow-[0_4px_14px_rgb(34,197,94,0.4)]"
      : "bg-white border-stone-200 text-stone-700 hover:border-green-300",
    red: selected
      ? "bg-red-500 border-red-500 text-white shadow-[0_4px_14px_rgb(239,68,68,0.4)]"
      : "bg-white border-stone-200 text-stone-700 hover:border-red-300",
    stone: selected
      ? "bg-stone-700 border-stone-700 text-white"
      : "bg-white border-stone-200 text-stone-700 hover:border-stone-400",
    pink: selected
      ? "bg-pink-500 border-pink-500 text-white shadow-[0_4px_14px_rgb(236,72,153,0.4)]"
      : "bg-white border-stone-200 text-stone-700 hover:border-pink-300",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-4 rounded-2xl border-2 font-semibold text-base transition-all active:scale-[0.98] min-h-[56px] ${colors[color]}`}
    >
      {label}
    </button>
  );
}

// ─── SECCIÓN DE OPCIONES ──────────────────────────────────────────────────────

function SeccionOpciones({
  titulo,
  icon,
  items,
  selected,
  onSelect,
  color,
  required,
}: {
  titulo: string;
  icon: React.ReactNode;
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  color: "amber" | "green" | "red" | "stone" | "pink";
  required?: boolean;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-bold text-stone-800 text-lg">
          {titulo}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <OpcionBtn
            key={item}
            label={item}
            selected={selected === item}
            onClick={() => onSelect(selected === item ? "" : item)}
            color={color}
          />
        ))}
      </div>
    </div>
  );
}

// ─── PASO 1: IDENTIFICACIÓN ───────────────────────────────────────────────────

function PasoIdentificacion({
  onContinuar,
}: {
  onContinuar: (nombre: string, id: string) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim().length < 2) {
      setError("Ingresa tu nombre completo");
      return;
    }
    const id = rut.trim() || slugify(nombre.trim());
    onContinuar(nombre.trim(), id);
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-5 pt-4 pb-10"
    >
      <div className="text-center mb-8">
        <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-amber-600" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 font-serif">
          ¿Quién eres?
        </h2>
        <p className="text-stone-500 mt-1">
          Ingresa tus datos para pedir tu almuerzo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">
            Nombre completo *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setError(""); }}
            placeholder="Ej: María González"
            autoFocus
            className="w-full border-2 border-stone-200 focus:border-amber-500 rounded-2xl px-5 py-4 text-xl font-medium text-stone-800 outline-none transition-colors placeholder:text-stone-300"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">
            RUT (opcional)
          </label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="Ej: 12.345.678-9"
            className="w-full border-2 border-stone-200 focus:border-amber-500 rounded-2xl px-5 py-4 text-xl font-medium text-stone-800 outline-none transition-colors placeholder:text-stone-300"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-5 rounded-2xl text-xl flex items-center justify-center gap-2 transition-colors active:scale-95 mt-4"
        >
          Ver el menú de hoy
          <ChevronRight size={26} />
        </button>
      </form>
    </m.div>
  );
}

// ─── PASO 2: SELECCIÓN DE MENÚ ────────────────────────────────────────────────

function PasoMenu({
  menu,
  nombre,
  onConfirmar,
}: {
  menu: MenuDia;
  nombre: string;
  onConfirmar: (sel: Seleccion) => void;
}) {
  const [sel, setSel] = useState<Seleccion>({
    plato: "",
    esVegano: false,
    agregado: "",
    ensalada: "",
    postre: "",
  });
  const [error, setError] = useState("");

  const allPlatos = [
    ...menu.platos.map((p) => ({ label: p, vegano: false })),
    ...menu.veganos.map((v) => ({ label: v, vegano: true })),
  ];

  const handleConfirmar = () => {
    if (!sel.plato) {
      setError("Debes elegir un plato principal");
      return;
    }
    onConfirmar(sel);
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="px-5 pt-4 pb-32"
    >
      <div className="mb-6">
        <p className="text-stone-500 text-sm">Hola, <span className="font-bold text-stone-800">{nombre}</span></p>
        <h2 className="text-2xl font-black text-stone-900 font-serif mt-1">
          Menú de hoy
        </h2>
        <p className="text-amber-600 font-semibold text-sm mt-0.5">
          {new Date().toLocaleDateString("es-CL", {
            weekday: "long",
            day: "numeric",
            month: "long",
            timeZone: "America/Santiago",
          })}
        </p>
      </div>

      {/* Platos principales */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <UtensilsCrossed size={20} className="text-amber-600" />
          <h3 className="font-bold text-stone-800 text-lg">
            Plato Principal <span className="text-red-500">*</span>
          </h3>
        </div>
        <div className="space-y-2">
          {allPlatos.map(({ label, vegano }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setSel((s) => ({ ...s, plato: s.plato === label ? "" : label, esVegano: vegano }));
                setError("");
              }}
              className={`w-full text-left px-4 py-4 rounded-2xl border-2 font-semibold text-base transition-all active:scale-[0.98] min-h-[56px] flex items-center justify-between gap-3 ${
                sel.plato === label
                  ? vegano
                    ? "bg-green-500 border-green-500 text-white shadow-[0_4px_14px_rgb(34,197,94,0.4)]"
                    : "bg-amber-500 border-amber-500 text-white shadow-[0_4px_14px_rgb(245,158,11,0.4)]"
                  : "bg-white border-stone-200 text-stone-700 hover:border-amber-300"
              }`}
            >
              <span>{label}</span>
              {vegano && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${sel.plato === label ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>
                  🌱 Vegano
                </span>
              )}
            </button>
          ))}
        </div>
        {error && (
          <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>

      {/* Hipocalóricos */}
      {menu.hipocaloricos && menu.hipocaloricos.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={20} className="text-green-600" />
            <h3 className="font-bold text-stone-800 text-lg">Hipocalórico</h3>
          </div>
          <div className="space-y-2">
            {menu.hipocaloricos.map((item) => (
              <OpcionBtn
                key={item}
                label={item}
                selected={sel.plato === item}
                onClick={() => setSel((s) => ({ ...s, plato: s.plato === item ? "" : item, esVegano: false }))}
                color="green"
              />
            ))}
          </div>
        </div>
      )}

      {/* Agregados */}
      <SeccionOpciones
        titulo="Agregado"
        icon={<Flame size={20} className="text-red-500" />}
        items={menu.agregados}
        selected={sel.agregado}
        onSelect={(v) => setSel((s) => ({ ...s, agregado: v }))}
        color="red"
      />

      {/* Ensaladas */}
      <SeccionOpciones
        titulo="Ensalada"
        icon={<Salad size={20} className="text-stone-500" />}
        items={menu.ensaladas}
        selected={sel.ensalada}
        onSelect={(v) => setSel((s) => ({ ...s, ensalada: v }))}
        color="stone"
      />

      {/* Postres */}
      <SeccionOpciones
        titulo="Postre"
        icon={<IceCream size={20} className="text-pink-500" />}
        items={menu.postres}
        selected={sel.postre}
        onSelect={(v) => setSel((s) => ({ ...s, postre: v }))}
        color="pink"
      />

      {/* Botón confirmar fijo */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-stone-200 px-5 py-4 max-w-md mx-auto">
        <button
          onClick={handleConfirmar}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-5 rounded-2xl text-xl flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-[0_4px_20px_rgb(217,119,6,0.3)]"
        >
          Confirmar pedido
          <ChevronRight size={26} />
        </button>
      </div>
    </m.div>
  );
}

// ─── PASO 3: CONFIRMACIÓN ─────────────────────────────────────────────────────

function PasoConfirmacion({
  nombre,
  seleccion,
  loading,
  onEnviar,
  onVolver,
}: {
  nombre: string;
  seleccion: Seleccion;
  loading: boolean;
  onEnviar: () => void;
  onVolver: () => void;
}) {
  const items = [
    { label: "Plato", value: seleccion.plato },
    seleccion.esVegano ? { label: "Tipo", value: "🌱 Vegano" } : null,
    seleccion.agregado ? { label: "Agregado", value: seleccion.agregado } : null,
    seleccion.ensalada ? { label: "Ensalada", value: seleccion.ensalada } : null,
    seleccion.postre ? { label: "Postre", value: seleccion.postre } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <m.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="px-5 pt-6 pb-10"
    >
      <div className="text-center mb-8">
        <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed size={32} className="text-amber-600" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 font-serif">
          Confirma tu pedido
        </h2>
        <p className="text-stone-500 mt-1">{nombre}</p>
      </div>

      <div className="bg-white border-2 border-stone-100 rounded-2xl overflow-hidden mb-8">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex justify-between items-start px-5 py-4 ${i < items.length - 1 ? "border-b border-stone-100" : ""}`}
          >
            <span className="text-stone-500 font-medium text-sm">{item.label}</span>
            <span className="text-stone-900 font-bold text-sm text-right max-w-[60%] leading-snug">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={onEnviar}
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 text-white font-bold py-5 rounded-2xl text-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          {loading ? (
            <><Loader2 size={24} className="animate-spin" /> Enviando...</>
          ) : (
            <><CheckCircle2 size={24} /> Enviar pedido</>
          )}
        </button>
        <button
          onClick={onVolver}
          disabled={loading}
          className="w-full bg-stone-100 text-stone-700 font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <RotateCcw size={20} /> Modificar
        </button>
      </div>
    </m.div>
  );
}

// ─── PASO 4: ÉXITO ────────────────────────────────────────────────────────────

function PasoExito({ nombre, onNuevoPedido }: { nombre: string; onNuevoPedido: () => void }) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="px-5 pt-16 pb-10 text-center"
    >
      <m.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.1 }}
        className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 size={52} className="text-green-600" />
      </m.div>
      <h2 className="text-3xl font-black text-stone-900 font-serif mb-2">
        ¡Pedido enviado!
      </h2>
      <p className="text-stone-500 text-lg mb-2">
        Tu almuerzo está registrado, <span className="font-bold text-stone-700">{nombre}</span>.
      </p>
      <p className="text-stone-400 text-sm mb-10">
        Puedes modificar tu pedido hasta las 11:00 hrs.
      </p>
      <button
        onClick={onNuevoPedido}
        className="bg-stone-100 text-stone-700 font-bold py-4 px-8 rounded-2xl text-lg transition-colors active:scale-95"
      >
        Hacer otro pedido
      </button>
    </m.div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────

export default function PortalEmpresasPage() {
  const [step, setStep] = useState<AppStep>("identificacion");
  const [nombre, setNombre] = useState("");
  const [trabajadorId, setTrabajadorId] = useState("");
  const [menu, setMenu] = useState<MenuDia | null>(null);
  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(false);

  // Cargar menú del día
  const cargarMenu = useCallback(async () => {
    setMenuLoading(true);
    setMenuError(false);
    try {
      const data = await menuApi.get();
      // Si el menú está vacío, usar el default
      const tieneContenido = data.platos?.length > 0 || data.veganos?.length > 0;
      if (!tieneContenido) {
        const hoy = todayChile();
        const dow = new Date(hoy + "T12:00:00").getDay(); // 1=lun, 5=vie
        const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"] as const;
        const diaKey = dias[dow] as keyof typeof DEFAULT_MINUTA.dias;
        const diaData = DEFAULT_MINUTA.dias[diaKey as "lunes" | "martes" | "miercoles" | "jueves" | "viernes"];
        if (diaData) {
          setMenu({ ...diaData, fecha: hoy, hipocaloricos: DEFAULT_MINUTA.hipocaloricos });
        } else {
          setMenu(data);
        }
      } else {
        setMenu(data);
      }
    } catch {
      setMenuError(true);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarMenu();
  }, [cargarMenu]);

  const handleIdentificacion = (nom: string, id: string) => {
    setNombre(nom);
    setTrabajadorId(id);
    setStep("menu");
  };

  const handleSeleccion = (sel: Seleccion) => {
    setSeleccion(sel);
    setStep("confirmacion");
  };

  const handleEnviar = async () => {
    if (!seleccion) return;
    setLoading(true);
    try {
      await pedidosApi.create({
        fecha: todayChile(),
        trabajadorNombre: nombre,
        trabajadorId,
        empresaId: "tinku-default",
        plato: seleccion.plato,
        vegano: seleccion.esVegano,
        agregado: seleccion.agregado,
        ensalada: seleccion.ensalada,
        postre: seleccion.postre,
      });
      setStep("exito");
    } catch (err) {
      console.error(err);
      alert("Error al enviar el pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoPedido = () => {
    setNombre("");
    setTrabajadorId("");
    setSeleccion(null);
    setStep("identificacion");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      {/* Header */}
      <header className="bg-stone-900 px-5 py-4 flex items-center gap-3 shadow-lg">
        <TinkuLogo size={120} invert static />
        <div className="border-l border-stone-700 pl-3 ml-1">
          <p className="text-stone-300 text-xs font-bold uppercase tracking-widest">
            Portal Empresas
          </p>
          <p className="text-white font-black text-sm">Almuerzo del día</p>
        </div>
      </header>

      {/* Loading menú */}
      {menuLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-amber-500" />
        </div>
      )}

      {/* Error menú */}
      {menuError && !menuLoading && (
        <div className="px-5 py-10 text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-stone-600 font-medium mb-4">No se pudo cargar el menú</p>
          <button
            onClick={cargarMenu}
            className="bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* App steps */}
      {!menuLoading && !menuError && menu && (
        <main className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {step === "identificacion" && (
              <m.div key="id">
                <PasoIdentificacion onContinuar={handleIdentificacion} />
              </m.div>
            )}
            {step === "menu" && (
              <m.div key="menu">
                <PasoMenu
                  menu={menu}
                  nombre={nombre}
                  onConfirmar={handleSeleccion}
                />
              </m.div>
            )}
            {step === "confirmacion" && seleccion && (
              <m.div key="confirm">
                <PasoConfirmacion
                  nombre={nombre}
                  seleccion={seleccion}
                  loading={loading}
                  onEnviar={handleEnviar}
                  onVolver={() => setStep("menu")}
                />
              </m.div>
            )}
            {step === "exito" && (
              <m.div key="exito">
                <PasoExito nombre={nombre} onNuevoPedido={handleNuevoPedido} />
              </m.div>
            )}
          </AnimatePresence>
        </main>
      )}
    </div>
  );
}
