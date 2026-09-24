"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { m, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import {
  CalendarCheck,
  Users,
  User,
  X,
  ChevronRight,
  ChevronLeft,
  Send,
} from "lucide-react";

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "Nombre demasiado largo"),
});

const step3Schema = z.object({
  personas: z
    .number()
    .min(1, "Mínimo 1 persona")
    .max(50, "Máximo 50 personas"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step3Data = z.infer<typeof step3Schema>;

interface ReservaData {
  nombre: string;
  fecha: Date;
  hora: string;
  personas: number;
}

// ─── HORAS DISPONIBLES ────────────────────────────────────────────────────────

const HORAS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00",
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatFecha(date: Date): string {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
}

// ─── ESTILOS INLINE PARA react-day-picker v10 ────────────────────────────────
// Tailwind no puede purgar clases dinámicas de librerías externas,
// por eso usamos classNames prop de DayPicker.

const calendarClassNames = {
  root: "w-full",
  months: "w-full",
  month: "w-full",
  month_caption: "flex justify-between items-center px-2 py-3",
  caption_label: "text-base font-bold text-stone-800 capitalize",
  nav: "flex items-center gap-1",
  button_previous:
    "p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors disabled:opacity-30",
  button_next:
    "p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors disabled:opacity-30",
  weeks: "w-full",
  weekdays: "grid grid-cols-7 mb-1",
  weekday: "text-center text-xs font-bold text-stone-400 py-1 uppercase",
  week: "grid grid-cols-7",
  day: "flex items-center justify-center",
  day_button:
    "w-9 h-9 rounded-xl text-sm font-semibold transition-all hover:bg-amber-100 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed",
  selected:
    "bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-bold",
  today: "text-amber-600 font-bold",
  outside: "opacity-30",
  disabled: "opacity-30 cursor-not-allowed",
  hidden: "invisible",
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

interface ReservaWizardProps {
  children: React.ReactNode;
}

export function ReservaWizard({ children }: ReservaWizardProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [reservaData, setReservaData] = useState<Partial<ReservaData>>({});
  const [direction, setDirection] = useState<1 | -1>(1);

  // Paso 2: estado local para fecha y hora
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHora, setSelectedHora] = useState<string>("");
  const [step2Error, setStep2Error] = useState<string>("");

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { nombre: reservaData.nombre ?? "" },
  });

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      personas: reservaData.personas ?? (undefined as unknown as number),
    },
  });

  const handleOpen = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setCurrentStep(1);
      setReservaData({});
      setSelectedDate(undefined);
      setSelectedHora("");
      setStep2Error("");
      form1.reset({ nombre: "" });
      form3.reset({ personas: undefined as unknown as number });
    }
  };

  const goNext = (data: Partial<ReservaData>) => {
    setDirection(1);
    setReservaData((prev) => ({ ...prev, ...data }));
    setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  // Validar paso 2 manualmente
  const handleStep2Submit = () => {
    if (!selectedDate) {
      setStep2Error("Selecciona una fecha");
      return;
    }
    if (!selectedHora) {
      setStep2Error("Selecciona una hora");
      return;
    }
    setStep2Error("");
    goNext({ fecha: selectedDate, hora: selectedHora });
  };

  const handleFinalSubmit = (personas: number) => {
    const final: ReservaData = {
      nombre: reservaData.nombre!,
      fecha: reservaData.fecha!,
      hora: reservaData.hora!,
      personas,
    };

    const fechaFormateada = formatFecha(final.fecha);
    const msg = encodeURIComponent(
      `¡Hola Restobar Tinku! 🍽️\n\nQuisiera hacer una *reserva*:\n\n` +
        `👤 *Titular:* ${final.nombre}\n` +
        `📅 *Fecha:* ${fechaFormateada}\n` +
        `🕐 *Hora:* ${final.hora} hrs\n` +
        `👥 *Personas:* ${final.personas}\n\n` +
        `¡Muchas gracias!`
    );

    window.open(`https://wa.me/56989058820?text=${msg}`, "_blank");
    handleOpen(false);
  };

  // ── Variantes de animación ──
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog.Root open={open} onOpenChange={handleOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <m.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#FDFBF7] rounded-t-3xl shadow-2xl max-w-md mx-auto px-6 pt-5 pb-10 outline-none max-h-[92vh] overflow-y-auto"
          >
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-xl">
                  <CalendarCheck size={22} className="text-amber-600" />
                </div>
                <div>
                  <Dialog.Title className="text-xl font-bold text-stone-900 font-serif">
                    Reservar Mesa
                  </Dialog.Title>
                  <p className="text-sm text-stone-500">
                    Paso {currentStep} de 3
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors">
                  <X size={22} />
                </button>
              </Dialog.Close>
            </div>

            {/* Progress bar */}
            <div className="flex gap-2 mb-7">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    s <= currentStep ? "bg-amber-500" : "bg-stone-200"
                  }`}
                />
              ))}
            </div>

            {/* Steps */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {/* ── PASO 1: Nombre ── */}
                {currentStep === 1 && (
                  <m.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                  >
                    <form
                      onSubmit={form1.handleSubmit((data) => goNext(data))}
                      className="space-y-6"
                    >
                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-stone-600 mb-3 uppercase tracking-wider">
                          <User size={16} className="text-amber-500" />
                          Nombre del titular
                        </label>
                        <input
                          {...form1.register("nombre")}
                          type="text"
                          placeholder="Ej: María González"
                          autoFocus
                          className="w-full bg-white border-2 border-stone-200 focus:border-amber-500 rounded-2xl px-5 py-4 text-xl font-medium text-stone-800 outline-none transition-colors placeholder:text-stone-300"
                        />
                        {form1.formState.errors.nombre && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {form1.formState.errors.nombre.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-5 rounded-2xl text-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
                      >
                        Continuar
                        <ChevronRight size={24} />
                      </button>
                    </form>
                  </m.div>
                )}

                {/* ── PASO 2: Calendario + Hora ── */}
                {currentStep === 2 && (
                  <m.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="space-y-5"
                  >
                    {/* Calendario visual */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-stone-600 mb-3 uppercase tracking-wider">
                        <CalendarCheck size={16} className="text-amber-500" />
                        Selecciona la fecha
                      </label>
                      <div className="bg-white border-2 border-stone-200 rounded-2xl p-3">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setStep2Error("");
                          }}
                          locale={es}
                          disabled={{ before: today }}
                          classNames={calendarClassNames}
                          modifiersClassNames={{
                            selected: "bg-amber-500 text-white rounded-xl font-bold",
                            today: "text-amber-600 font-bold",
                          }}
                        />
                      </div>
                      {selectedDate && (
                        <p className="text-sm text-amber-700 font-semibold mt-2 text-center">
                          📅 {formatFecha(selectedDate)}
                        </p>
                      )}
                    </div>

                    {/* Selector de hora */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-stone-600 mb-3 uppercase tracking-wider">
                        Hora
                      </label>
                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                        {HORAS.map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              setSelectedHora(h);
                              setStep2Error("");
                            }}
                            className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                              selectedHora === h
                                ? "bg-amber-500 border-amber-500 text-white"
                                : "bg-white border-stone-200 text-stone-700 hover:border-amber-300"
                            }`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>

                    {step2Error && (
                      <p className="text-red-500 text-sm font-medium text-center">
                        {step2Error}
                      </p>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={goBack}
                        className="flex-1 bg-stone-100 text-stone-700 font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
                      >
                        <ChevronLeft size={22} />
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={handleStep2Submit}
                        className="flex-[2] bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
                      >
                        Continuar
                        <ChevronRight size={22} />
                      </button>
                    </div>
                  </m.div>
                )}

                {/* ── PASO 3: Personas ── */}
                {currentStep === 3 && (
                  <m.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                  >
                    <form
                      onSubmit={form3.handleSubmit((data) =>
                        handleFinalSubmit(data.personas)
                      )}
                      className="space-y-6"
                    >
                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-stone-600 mb-3 uppercase tracking-wider">
                          <Users size={16} className="text-amber-500" />
                          ¿Cuántas personas?
                        </label>

                        {/* Selector rápido */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => {
                            const selected = form3.watch("personas") === n;
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() =>
                                  form3.setValue("personas", n, {
                                    shouldValidate: true,
                                  })
                                }
                                className={`py-3 rounded-xl text-lg font-bold border-2 transition-all ${
                                  selected
                                    ? "bg-amber-500 border-amber-500 text-white"
                                    : "bg-white border-stone-200 text-stone-700 hover:border-amber-300"
                                }`}
                              >
                                {n}
                              </button>
                            );
                          })}
                        </div>

                        <input
                          {...form3.register("personas", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          min={1}
                          max={50}
                          placeholder="Otro número..."
                          className="w-full bg-white border-2 border-stone-200 focus:border-amber-500 rounded-2xl px-5 py-3 text-lg font-medium text-stone-800 outline-none transition-colors placeholder:text-stone-300"
                        />
                        {form3.formState.errors.personas && (
                          <p className="text-red-500 text-sm mt-2 font-medium">
                            {form3.formState.errors.personas.message}
                          </p>
                        )}
                      </div>

                      {/* Resumen */}
                      {reservaData.nombre && reservaData.fecha && reservaData.hora && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 space-y-1">
                          <p>
                            <span className="font-bold">👤</span>{" "}
                            {reservaData.nombre}
                          </p>
                          <p>
                            <span className="font-bold">📅</span>{" "}
                            {formatFecha(reservaData.fecha)} —{" "}
                            {reservaData.hora} hrs
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex-1 bg-stone-100 text-stone-700 font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
                        >
                          <ChevronLeft size={22} />
                          Atrás
                        </button>
                        <button
                          type="submit"
                          className="flex-[2] bg-[#25D366] hover:bg-[#20c05c] text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(37,211,102,0.3)] transition-all active:scale-95"
                        >
                          <Send size={20} />
                          Enviar por WhatsApp
                        </button>
                      </div>
                    </form>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </m.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
