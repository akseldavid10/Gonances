"use client";

import { ExpenseDonut, type SliceDatum } from "@/components/dashboard/charts";
import { useTheme } from "@/components/theme/theme-provider";
import { chartPalette } from "@/lib/chart-colors";
import { money } from "@/lib/format";

type Row = {
  categoryId: string;
  category: string;
  color: string;
  amount: number;
  percentage: number;
};

/**
 * Cinco categorías y una fila "Otras": más porciones que eso deja de leerse
 * y las tintas dejan de distinguirse. El detalle completo vive en /analytics.
 */
export function condense(
  rows: Row[],
  otherColor: string,
  max = 5,
): SliceDatum[] {
  if (rows.length <= max + 1) return rows;
  const head = rows.slice(0, max);
  const tail = rows.slice(max);
  return [
    ...head,
    {
      category: "Otras",
      color: otherColor,
      amount: tail.reduce((s, r) => s + r.amount, 0),
      percentage:
        Math.round(tail.reduce((s, r) => s + r.percentage, 0) * 10) / 10,
    },
  ];
}

export function ExpenseBreakdown({
  rows,
  height,
}: {
  rows: Row[];
  height?: number;
}) {
  const { resolved } = useTheme();
  const slices = condense(rows, chartPalette(resolved).other);
  const total = slices.reduce((s, r) => s + r.amount, 0);

  if (!slices.length) {
    return (
      <p className="py-10 text-center text-[14px] text-ink-faint">
        Todavía no hay gastos este mes. Anota el primero y aparecerá aquí.
      </p>
    );
  }

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <ExpenseDonut data={slices} total={total} height={height} />
      {/* Leyenda y tabla a la vez: nombre, monto y peso de cada categoría. */}
      <ul className="divide-y divide-rule-soft">
        {slices.map((s) => (
          <li key={s.category} className="flex items-center gap-3 py-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="min-w-0 flex-1 text-[14px] text-ink">
              {s.category}
            </span>
            <span className="num w-11 text-right text-[13px] text-ink-faint">
              {s.percentage}%
            </span>
            <span className="num w-22 text-right text-[14px] text-ink">
              {money(s.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
