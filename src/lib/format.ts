const nf = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  // es-ES deja "5114" sin punto; en una columna de montos eso rompe la lectura.
  useGrouping: true,
});

const nfCompact = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

/** Monto con separadores y dos decimales: 1.240,50 */
export function money(amount: number): string {
  return `$${nf.format(Math.abs(amount))}`;
}

/** Monto con signo explícito para movimientos: +$1.240,50 / −$320,00 */
export function signedMoney(amount: number, type: "INCOME" | "EXPENSE") {
  return `${type === "INCOME" ? "+" : "−"}${money(amount)}`;
}

/** Monto redondeado para ejes de gráficos: $1.240 */
export function moneyShort(amount: number): string {
  return `$${nfCompact.format(Math.round(amount))}`;
}

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

/** 14 mar */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** 14 de marzo de 2026 */
export function longDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

/** marzo 2026 */
export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

export function monthShort(month: number): string {
  return MONTHS_SHORT[month];
}
