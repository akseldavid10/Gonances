import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { IncomeExpenseBars, SeriesLegend } from "@/components/dashboard/charts";
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown";
import { CategoryStamp } from "@/components/ui/category-icon";
import { PageHeader, Panel } from "@/components/ui/panel";
import {
  categoryById,
  currentPeriod,
  expensesByCategory,
  inMonth,
  monthlyTrends,
  summary,
  summaryUpToDay,
  transactions,
} from "@/lib/data";
import { money, monthLabel, shortDate, signedMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Panel" };

export default function DashboardPage() {
  const { year, month } = currentPeriod();
  const today = new Date().getDate();
  const prev = new Date(year, month - 1, 1);
  const now = summary(year, month);
  // Mismo tramo del mes anterior: comparar 4 días contra 30 no dice nada.
  const before = summaryUpToDay(prev.getFullYear(), prev.getMonth(), today);
  const breakdown = expensesByCategory(year, month);
  const trends = monthlyTrends(6);
  const recent = transactions.slice(0, 8);
  const monthCount = transactions.filter((t) => inMonth(t, year, month)).length;

  return (
    <>
      <PageHeader
        title={`Tu ${monthLabel(year, month)}`}
        lead={`${monthCount} movimientos anotados en lo que va del mes.`}
      />

      {/* Los tres totales viven en una sola hoja, separados por filete:
          son partes de la misma cuenta, no tres tarjetas sueltas. */}
      <div className="grid divide-y divide-rule rounded-lg border border-rule bg-sheet sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Kpi
          label="Balance total"
          amount={now.balance}
          tone="ink"
          note="Todo lo anotado hasta hoy"
        />
        <Kpi
          label="Ingresos del mes"
          amount={now.incomes}
          tone="income"
          note={delta(now.incomes, before.incomes)}
        />
        <Kpi
          label="Gastos del mes"
          amount={now.expenses}
          tone="expense"
          note={delta(now.expenses, before.expenses)}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel
          title="En qué se fue el gasto"
          aside={
            <span className="text-[13px] text-ink-faint">
              {monthLabel(year, month)}
            </span>
          }
        >
          <ExpenseBreakdown rows={breakdown} height={236} />
        </Panel>

        <Panel
          title="Ingresos contra gastos"
          aside={
            <SeriesLegend
              items={[
                { label: "Ingresos", series: "income" },
                { label: "Gastos", series: "expense" },
              ]}
            />
          }
        >
          <IncomeExpenseBars data={trends} height={262} />
        </Panel>
      </div>

      <div className="mt-5">
        <Panel
          title="Últimos movimientos"
          aside={
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1.5 text-[14px] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              Ver todas las transacciones
              <ArrowRight size={15} />
            </Link>
          }
          bodyClassName=""
        >
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Los ocho movimientos más recientes de tu libro
            </caption>
            <thead>
              <tr className="text-[12px] text-ink-faint">
                <th scope="col" className="px-4 py-2 font-medium sm:px-5">
                  Fecha
                </th>
                <th scope="col" className="py-2 font-medium">
                  Concepto
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-right font-medium sm:px-5"
                >
                  Monto
                </th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => {
                const cat = categoryById(t.categoryId);
                return (
                  <tr
                    key={t.id}
                    className="border-t border-rule-soft even:bg-band/45"
                  >
                    <td className="px-4 py-3 align-middle text-[13px] whitespace-nowrap text-ink-faint sm:px-5">
                      {shortDate(t.date)}
                    </td>
                    <td className="py-3 align-middle">
                      <span className="flex items-center gap-3">
                        <CategoryStamp
                          icon={cat.icon}
                          color={cat.color}
                          size={26}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] leading-tight text-ink">
                            {t.description}
                          </span>
                          <span className="block text-[12px] leading-tight text-ink-faint">
                            {cat.name}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td
                      className={`num px-4 py-3 text-right align-middle text-[14px] whitespace-nowrap sm:px-5 ${
                        t.type === "INCOME" ? "text-income" : "text-expense"
                      }`}
                    >
                      {signedMoney(t.amount, t.type)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  );
}

function Kpi({
  label,
  amount,
  tone,
  note,
}: {
  label: string;
  amount: number;
  tone: "ink" | "income" | "expense";
  note: string;
}) {
  const color =
    tone === "income"
      ? "text-income"
      : tone === "expense"
        ? "text-expense"
        : "text-ink";
  return (
    <div className="px-5 py-5">
      <p className="text-[13px] text-ink-soft">{label}</p>
      <p
        className={`engraved mt-1.5 text-[clamp(1.9rem,3.6vw,2.5rem)] leading-none ${color}`}
      >
        {money(amount)}
      </p>
      <p className="mt-2.5 text-[13px] text-ink-faint">{note}</p>
    </div>
  );
}

function delta(current: number, previous: number): string {
  if (previous <= 0) return "Sin nada que comparar todavía";
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return "Igual que a esta altura del mes pasado";
  return pct > 0
    ? `${pct}% más que a esta altura del mes pasado`
    : `${Math.abs(pct)}% menos que a esta altura del mes pasado`;
}
