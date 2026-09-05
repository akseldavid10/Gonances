import type { Metadata } from "next";
import {
  ExpenseTrendArea,
  IncomeExpenseBars,
  SeriesLegend,
} from "@/components/dashboard/charts";
import { PageHeader, Panel } from "@/components/ui/panel";
import {
  categoryById,
  currentPeriod,
  inMonth,
  monthlyTrends,
  transactions,
} from "@/lib/data";
import { money, monthLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Estadísticas" };

export default function AnalyticsPage() {
  const { year, month } = currentPeriod();
  const trends = monthlyTrends(6);

  // Gasto por categoría en los seis meses del período mostrado.
  const since = new Date(year, month - 5, 1);
  const window = transactions.filter(
    (t) => t.type === "EXPENSE" && new Date(`${t.date}T12:00:00`) >= since,
  );
  const byCategory = new Map<string, number>();
  for (const t of window) {
    byCategory.set(
      t.categoryId,
      (byCategory.get(t.categoryId) ?? 0) + t.amount,
    );
  }
  const ranking = [...byCategory.entries()]
    .map(([id, amount]) => ({ cat: categoryById(id), amount }))
    .sort((a, b) => b.amount - a.amount);
  const top = ranking[0];
  const max = ranking[0]?.amount ?? 1;

  const monthExpenses = transactions
    .filter((t) => t.type === "EXPENSE" && inMonth(t, year, month))
    .reduce((s, t) => s + t.amount, 0);
  const daysElapsed = new Date().getDate();
  const dailyAverage = monthExpenses / Math.max(1, daysElapsed);

  // El mes en curso va a medias, así que no compite por "el más caro".
  const closed = trends.slice(0, -1);
  const priciest = [...closed].sort((a, b) => b.expenses - a.expenses)[0];
  const saved = trends.reduce((s, m) => s + (m.incomes - m.expenses), 0);

  return (
    <>
      <PageHeader
        title="Estadísticas"
        lead="Los últimos seis meses de tu libro, leídos de corrido."
      />

      {/* Tres lecturas en una frase cada una: el número primero, la
          explicación después. */}
      <div className="grid divide-y divide-rule rounded-lg border border-rule bg-sheet sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Finding
          amount={money(dailyAverage)}
          text={`Es tu gasto promedio por día en ${monthLabel(year, month)}.`}
        />
        <Finding
          amount={money(priciest?.expenses ?? 0)}
          text={`Fue el mes cerrado más caro, en ${
            priciest ? monthLabel(priciest.year, priciest.month) : "—"
          }.`}
        />
        <Finding
          amount={money(saved)}
          text="Es lo que te quedó después de restar todos los gastos a todos los ingresos."
          tone={saved >= 0 ? "income" : "expense"}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel
          title="Cómo evolucionó tu gasto"
          aside={
            <SeriesLegend items={[{ label: "Gastos", series: "expense" }]} />
          }
        >
          <ExpenseTrendArea data={trends} height={268} />
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
          <IncomeExpenseBars data={trends} height={268} />
        </Panel>
      </div>

      <div className="mt-5">
        <Panel
          title="En qué gastas más"
          aside={
            <span className="text-[13px] text-ink-faint">
              Acumulado de los últimos seis meses
            </span>
          }
        >
          {top ? (
            <p className="mb-5 max-w-[68ch] text-[15px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-ink">{top.cat.name}</strong>{" "}
              se lleva la mayor parte: {money(top.amount)} en seis meses.
            </p>
          ) : null}

          <ul className="grid gap-3">
            {ranking.map((r) => (
              <li key={r.cat.id} className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px] text-ink">{r.cat.name}</span>
                  <span className="num text-[14px] text-ink-soft">
                    {money(r.amount)}
                  </span>
                </div>
                <div className="h-2.5 rounded-sm bg-band">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${Math.max(2, (r.amount / max) * 100)}%`,
                      backgroundColor: r.cat.color,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function Finding({
  amount,
  text,
  tone = "ink",
}: {
  amount: string;
  text: string;
  tone?: "ink" | "income" | "expense";
}) {
  const color =
    tone === "income"
      ? "text-income"
      : tone === "expense"
        ? "text-expense"
        : "text-ink";
  return (
    <div className="px-5 py-5">
      <p
        className={`engraved text-[clamp(1.7rem,3.2vw,2.2rem)] leading-none ${color}`}
      >
        {amount}
      </p>
      <p className="mt-2.5 max-w-[34ch] text-[14px] leading-relaxed text-ink-soft">
        {text}
      </p>
    </div>
  );
}
