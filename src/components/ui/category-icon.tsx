import {
  Bus,
  HeartPulse,
  House,
  Laptop,
  PawPrint,
  PiggyBank,
  Plug,
  Repeat,
  ShoppingBasket,
  Ticket,
  Wallet,
} from "lucide-react";

const ICONS = {
  ShoppingBasket,
  Bus,
  Plug,
  Ticket,
  HeartPulse,
  House,
  Wallet,
  PiggyBank,
  PawPrint,
  Repeat,
  Laptop,
} as const;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/**
 * Sello de categoría: cuadro con la tinta de la categoría y su icono.
 * Es la única pieza de color fuerte en las tablas, por eso va pequeña.
 */
export function CategoryStamp({
  icon,
  color,
  size = 28,
}: {
  icon: string;
  color: string;
  size?: number;
}) {
  const Icon = ICONS[icon as IconName] ?? Wallet;
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-sm"
      style={{
        width: size,
        height: size,
        backgroundColor: `${color}26`,
        // Varias tintas de categoría son claras a propósito (separación para
        // daltonismo); el icono se oscurece para seguir legible sobre la hoja.
        color: `color-mix(in oklab, ${color} 76%, #1a2a22)`,
        boxShadow: `inset 0 0 0 1px ${color}59`,
      }}
    >
      <Icon size={Math.round(size * 0.55)} strokeWidth={1.75} />
    </span>
  );
}
