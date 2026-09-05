"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/theme-provider";
import { chartPalette } from "@/lib/chart-colors";
import { money, moneyShort } from "@/lib/format";

/**
 * Recharts escribe los colores en atributos SVG, donde var() no resuelve, así
 * que la paleta tiene que llegar como valores y volver a leerse cuando cambia
 * el tema. Todos los gráficos son cliente, así que pueden pedirla al contexto.
 */
function useChartPalette() {
  const { resolved } = useTheme();
  return chartPalette(resolved);
}

type TooltipRow = { name: string; value: number; color: string };

function TooltipCard({ title, rows }: { title: string; rows: TooltipRow[] }) {
  return (
    <div className="rounded border border-rule bg-sheet px-3 py-2 text-[13px] shadow-none">
      <p className="mb-1 font-medium text-ink">{title}</p>
      <ul className="space-y-0.5">
        {rows.map((r) => (
          <li
            key={r.name}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: r.color }}
            />
            <span className="text-ink-soft">{r.name}</span>
            <span className="num ml-auto pl-3 text-ink">{money(r.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Reparto del gasto del mes ─────────────────────────────────────────── */

export type SliceDatum = {
  category: string;
  amount: number;
  percentage: number;
  color: string;
};

export function ExpenseDonut({
  data,
  total,
  height = 240,
}: {
  data: SliceDatum[];
  total: number;
  height?: number;
}) {
  const c = useChartPalette();

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius="62%"
            outerRadius="94%"
            startAngle={90}
            endAngle={-270}
            stroke={c.surface}
            strokeWidth={2}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.category} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            position={{ y: 0 }}
            wrapperStyle={{ zIndex: 10 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0];
              const datum = p.payload as SliceDatum;
              return (
                <TooltipCard
                  title={datum.category}
                  rows={[
                    {
                      name: `${datum.percentage}% del gasto`,
                      value: datum.amount,
                      color: datum.color,
                    },
                  ]}
                />
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[12px] text-ink-faint">Gastado</span>
        <span className="engraved text-[26px] leading-tight text-ink">
          {money(total)}
        </span>
      </div>
    </div>
  );
}

/* ── Ingresos contra gastos, mes a mes ─────────────────────────────────── */

export type TrendDatum = {
  key: string;
  label: string;
  incomes: number;
  expenses: number;
};

export function IncomeExpenseBars({
  data,
  height = 260,
}: {
  data: TrendDatum[];
  height?: number;
}) {
  const c = useChartPalette();
  const axisTick = { fill: c.axis, fontSize: 12 };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
          barGap={2}
          barCategoryGap="30%"
          accessibilityLayer
        >
          <CartesianGrid vertical={false} stroke={c.grid} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: c.rule }}
            tick={axisTick}
            dy={4}
          />
          <YAxis
            width={62}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            tickFormatter={(v: number) => moneyShort(v)}
          />
          <Tooltip
            cursor={{ fill: c.band, fillOpacity: 0.5 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as TrendDatum;
              return (
                <TooltipCard
                  title={String(label)}
                  rows={[
                    { name: "Ingresos", value: d.incomes, color: c.income },
                    { name: "Gastos", value: d.expenses, color: c.expense },
                  ]}
                />
              );
            }}
          />
          <Bar
            dataKey="incomes"
            name="Ingresos"
            fill={c.income}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="expenses"
            name="Gastos"
            fill={c.expense}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Tendencia del gasto ───────────────────────────────────────────────── */

export function ExpenseTrendArea({
  data,
  height = 260,
}: {
  data: TrendDatum[];
  height?: number;
}) {
  const c = useChartPalette();
  const axisTick = { fill: c.axis, fontSize: 12 };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} stroke={c.grid} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: c.rule }}
            tick={axisTick}
            dy={4}
          />
          <YAxis
            width={62}
            tickLine={false}
            axisLine={false}
            tick={axisTick}
            tickFormatter={(v: number) => moneyShort(v)}
          />
          <Tooltip
            cursor={{ stroke: c.rule, strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as TrendDatum;
              return (
                <TooltipCard
                  title={String(label)}
                  rows={[
                    { name: "Gastos", value: d.expenses, color: c.expense },
                  ]}
                />
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Gastos"
            stroke={c.expense}
            strokeWidth={2}
            fill={c.expense}
            fillOpacity={0.1}
            dot={{ r: 3, fill: c.surface, stroke: c.expense, strokeWidth: 2 }}
            activeDot={{
              r: 5,
              fill: c.surface,
              stroke: c.expense,
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Nombre de serie en vez de color: las páginas que montan la leyenda son
    componentes de servidor y no pueden leer el tema. */
export type ChartSeries = "income" | "expense" | "other";

const SERIES_SWATCH: Record<ChartSeries, string> = {
  income: "bg-chart-income",
  expense: "bg-chart-expense",
  other: "bg-chart-other",
};

/** Leyenda compartida: la identidad nunca depende solo del color. */
export function SeriesLegend({
  items,
}: {
  items: { label: string; series: ChartSeries }[];
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((i) => (
        <li
          key={i.label}
          className="flex items-center gap-2 text-[13px] text-ink-soft"
        >
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 rounded-sm ${SERIES_SWATCH[i.series]}`}
          />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
