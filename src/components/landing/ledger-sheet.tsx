import { CategoryStamp } from "@/components/ui/category-icon";
import { money } from "@/lib/format";

type Entry = {
  day: string;
  concept: string;
  category: string;
  icon: string;
  color: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
};

const OPENING = 1180.4;

const entries: Entry[] = [
  {
    day: "lun 3",
    concept: "Alquiler",
    category: "Hogar",
    icon: "House",
    color: "#1f4e9c",
    amount: 780,
    type: "EXPENSE",
  },
  {
    day: "mié 5",
    concept: "Sueldo mensual",
    category: "Sueldo",
    icon: "Wallet",
    color: "#1f6b4a",
    amount: 2530,
    type: "INCOME",
  },
  {
    day: "jue 6",
    concept: "Mercado del barrio",
    category: "Alimentación",
    icon: "ShoppingBasket",
    color: "#c4611a",
    amount: 64.3,
    type: "EXPENSE",
  },
  {
    day: "sáb 8",
    concept: "Internet fibra",
    category: "Servicios",
    icon: "Plug",
    color: "#8e2a5f",
    amount: 38.9,
    type: "EXPENSE",
  },
  {
    day: "dom 9",
    concept: "Rediseño de web",
    category: "Freelance",
    icon: "Laptop",
    color: "#2f7d5c",
    amount: 540,
    type: "INCOME",
  },
  {
    day: "mar 11",
    concept: "Cine con amigos",
    category: "Ocio",
    icon: "Ticket",
    color: "#d9a81e",
    amount: 22,
    type: "EXPENSE",
  },
];

/**
 * El héroe de la portada: la hoja se escribe sola, renglón por renglón, y el
 * saldo de la derecha se rehace en cada línea. Es el único movimiento
 * automático de todo el sitio.
 */
export function LedgerSheet() {
  let running = OPENING;
  const rows = entries.map((e) => {
    running += e.type === "INCOME" ? e.amount : -e.amount;
    return { ...e, balance: running };
  });

  return (
    <figure className="m-0 overflow-hidden rounded-lg border border-ink/20 bg-sheet">
      <figcaption className="flex items-baseline justify-between gap-4 border-b border-rule px-4 py-3 sm:px-5">
        <span className="text-[13px] font-medium text-ink">
          Tu libro, esta semana
        </span>
        <span className="text-[12px] text-ink-faint">
          Saldo de apertura {money(OPENING)}
        </span>
      </figcaption>

      <div className="overflow-x-auto">
        <table className="w-full min-w-80 border-collapse text-left">
          <thead>
            <tr className="text-[11px] font-medium tracking-wide text-ink-faint">
              <th scope="col" className="px-4 py-2 font-medium sm:px-5">
                Fecha
              </th>
              <th scope="col" className="py-2 font-medium">
                Concepto
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Monto
              </th>
              <th
                scope="col"
                className="hidden px-4 py-2 text-right font-medium sm:table-cell sm:px-5"
              >
                Saldo
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.concept}
                className="border-t border-rule-soft opacity-0 even:bg-band/55"
                style={{
                  animation: `ledger-line 420ms ease-out ${260 + i * 300}ms both`,
                }}
              >
                <td className="px-4 py-2.5 align-middle text-[13px] whitespace-nowrap text-ink-faint sm:px-5">
                  {row.day}
                </td>
                <td className="py-2.5 align-middle">
                  <span className="flex items-center gap-2.5">
                    <CategoryStamp
                      icon={row.icon}
                      color={row.color}
                      size={24}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] leading-tight text-ink">
                        {row.concept}
                      </span>
                      <span className="block text-[12px] leading-tight text-ink-faint">
                        {row.category}
                      </span>
                    </span>
                  </span>
                </td>
                <td
                  className={`num py-2.5 pl-4 text-right align-middle text-[14px] whitespace-nowrap ${
                    row.type === "INCOME" ? "text-income" : "text-expense"
                  }`}
                >
                  {row.type === "INCOME" ? "+" : "−"}
                  {money(row.amount)}
                </td>
                <td className="engraved hidden px-4 py-2.5 text-right align-middle text-[16px] whitespace-nowrap text-ink sm:table-cell sm:px-5">
                  {money(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="flex items-baseline justify-between gap-4 border-t border-ink/70 px-4 py-4 opacity-0 sm:px-5"
        style={{ animation: "ledger-line 500ms ease-out 2060ms both" }}
      >
        <span className="text-[13px] text-ink-soft">Saldo al cierre</span>
        <span className="engraved border-b-[3px] border-double border-ink pb-1 text-[26px] text-ink">
          {money(running)}
        </span>
      </div>

      <style>{`@keyframes ledger-line{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`}</style>
    </figure>
  );
}
