import type { ResolvedTheme } from "@/components/theme/theme-provider";

/**
 * Los mismos colores que los tokens --color-chart-* y las superficies de
 * globals.css, pero como valores JS.
 *
 * Recharts los escribe en atributos de presentación SVG (`fill`, `stroke`),
 * donde `var()` no resuelve, así que no se pueden leer del CSS. Si cambia la
 * paleta hay que cambiar los dos sitios a la vez.
 */
export type ChartPalette = {
  /** Tinta de las etiquetas de los ejes. */
  axis: string;
  /** Retícula horizontal. */
  grid: string;
  /** Filete del eje y línea del cursor. */
  rule: string;
  /** Hoja bajo el gráfico: separa porciones y rellena los puntos. */
  surface: string;
  /** Banda del cursor sobre las barras. */
  band: string;
  income: string;
  expense: string;
  other: string;
};

const palettes: Record<ResolvedTheme, ChartPalette> = {
  light: {
    axis: "#6d7c72",
    grid: "#d6dcc8",
    rule: "#c3cbb4",
    surface: "#f7f8f2",
    band: "#dce2ce",
    income: "#2f8f63",
    expense: "#a32438",
    other: "#6d7c72",
  },
  dark: {
    axis: "#8b978a",
    grid: "#2b372d",
    rule: "#3a4a3d",
    surface: "#1b241d",
    band: "#222d24",
    income: "#4fb984",
    expense: "#e0596f",
    other: "#8b978a",
  },
};

export function chartPalette(theme: ResolvedTheme): ChartPalette {
  return palettes[theme];
}
