"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * El conmutador rápido del sitio público: alterna claro↔oscuro y fija la
 * elección (deja de seguir al sistema). Se guarda al momento, sin botón de
 * guardar; la preferencia con las tres opciones vive en Ajustes.
 *
 * El icono lo decide el CSS, no el estado de React, para que sea correcto
 * también en el HTML del servidor y antes de que hidrate el JS.
 */
export function ThemeToggle() {
  const { resolved, setPreference } = useTheme();
  const isDark = resolved === "dark";

  // El servidor no sabe qué tema toca, así que no puede emitir aria-pressed.
  // Anunciarlo solo tras montar evita que el render del cliente contradiga al
  // del servidor: con suppressHydrationWarning React se quedaría con el valor
  // del HTML y el botón mentiría sobre su estado en cada carga.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      aria-label="Modo oscuro"
      aria-pressed={mounted ? isDark : undefined}
      onClick={() => setPreference(isDark ? "light" : "dark")}
      className="flex size-8 items-center justify-center rounded text-ink-soft transition-colors hover:bg-band/70 hover:text-ink"
    >
      <Moon
        size={17}
        strokeWidth={1.75}
        aria-hidden="true"
        className="dark:hidden"
      />
      <Sun
        size={17}
        strokeWidth={1.75}
        aria-hidden="true"
        className="hidden dark:block"
      />
    </button>
  );
}
