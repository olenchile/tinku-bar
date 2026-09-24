import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GlassCard
 * Componente de tarjeta con efecto glassmorphism
 * consistente con el design system de Tinku Bar.
 */
export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-glass-border)]",
        "bg-[var(--color-glass)] backdrop-blur-xl",
        "shadow-[var(--shadow-card)]",
        "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
