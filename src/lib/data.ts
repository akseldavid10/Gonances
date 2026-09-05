/**
 * Datos de demostración. El proyecto es solo frontend por ahora: estos
 * registros imitan la forma exacta que devolverá la API (`/transactions`,
 * `/categories`, `/analytics`) para poder cambiarlos por fetch más adelante
 * sin tocar las vistas.
 */

export type TxType = "INCOME" | "EXPENSE";

export type Category = {
  id: string;
  name: string;
  type: TxType;
  icon: string;
  color: string;
  isCustom: boolean;
};

export type Transaction = {
  id: string;
  amount: number;
  type: TxType;
  description: string;
  date: string; // yyyy-mm-dd
  categoryId: string;
};

export const categories: Category[] = [
  {
    id: "c-food",
    name: "Alimentación",
    type: "EXPENSE",
    icon: "ShoppingBasket",
    color: "#c4611a",
    isCustom: false,
  },
  {
    id: "c-transport",
    name: "Transporte",
    type: "EXPENSE",
    icon: "Bus",
    color: "#4fbfa8",
    isCustom: false,
  },
  {
    id: "c-services",
    name: "Servicios",
    type: "EXPENSE",
    icon: "Plug",
    color: "#8e2a5f",
    isCustom: false,
  },
  {
    id: "c-leisure",
    name: "Ocio",
    type: "EXPENSE",
    icon: "Ticket",
    color: "#d9a81e",
    isCustom: false,
  },
  {
    id: "c-health",
    name: "Salud",
    type: "EXPENSE",
    icon: "HeartPulse",
    color: "#e07a88",
    isCustom: false,
  },
  {
    id: "c-home",
    name: "Hogar",
    type: "EXPENSE",
    icon: "House",
    color: "#1f4e9c",
    isCustom: false,
  },
  {
    id: "c-salary",
    name: "Sueldo",
    type: "INCOME",
    icon: "Wallet",
    color: "#1f6b4a",
    isCustom: false,
  },
  {
    id: "c-other-income",
    name: "Otros ingresos",
    type: "INCOME",
    icon: "PiggyBank",
    color: "#4d7a5f",
    isCustom: false,
  },
  {
    id: "c-pets",
    name: "Mascotas",
    type: "EXPENSE",
    icon: "PawPrint",
    color: "#3c6b1c",
    isCustom: true,
  },
  {
    id: "c-subs",
    name: "Suscripciones",
    type: "EXPENSE",
    icon: "Repeat",
    color: "#a98ce8",
    isCustom: true,
  },
  {
    id: "c-freelance",
    name: "Freelance",
    type: "INCOME",
    icon: "Laptop",
    color: "#2f7d5c",
    isCustom: true,
  },
];

export const MAX_CUSTOM_CATEGORIES = 5;

export function categoryById(id: string): Category {
  return (
    categories.find((c) => c.id === id) ?? categories[categories.length - 1]
  );
}

const DESCRIPTIONS: Record<string, string[]> = {
  "c-food": [
    "Mercado del barrio",
    "Almuerzo con Sofía",
    "Panadería",
    "Verdulería",
    "Pedido a domicilio",
    "Café de la esquina",
  ],
  "c-transport": [
    "Recarga de tarjeta",
    "Taxi al aeropuerto",
    "Combustible",
    "Pasaje interurbano",
    "Estacionamiento",
  ],
  "c-services": ["Luz", "Agua", "Internet fibra", "Plan de celular", "Gas"],
  "c-leisure": [
    "Cine con amigos",
    "Concierto",
    "Libros",
    "Salida de fin de semana",
    "Partido de fútbol",
  ],
  "c-health": [
    "Farmacia",
    "Consulta dentista",
    "Vitaminas",
    "Sesión de kinesiología",
  ],
  "c-home": [
    "Alquiler",
    "Reparación del grifo",
    "Artículos de limpieza",
    "Lámpara nueva",
  ],
  "c-pets": ["Alimento para Nube", "Vacuna anual", "Arena sanitaria"],
  "c-subs": ["Streaming", "Almacenamiento en la nube", "Gimnasio"],
  "c-salary": ["Sueldo mensual"],
  "c-other-income": [
    "Venta de bicicleta",
    "Reintegro de gastos",
    "Regalo de cumpleaños",
  ],
  "c-freelance": ["Rediseño de web", "Sesión de fotos", "Consultoría"],
};

/** PRNG determinista: los datos deben ser idénticos en servidor y cliente. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EXPENSE_PLAN: { id: string; count: number; min: number; max: number }[] =
  [
    { id: "c-food", count: 6, min: 12, max: 95 },
    { id: "c-transport", count: 3, min: 8, max: 60 },
    { id: "c-services", count: 3, min: 25, max: 90 },
    { id: "c-leisure", count: 2, min: 15, max: 120 },
    { id: "c-health", count: 1, min: 18, max: 80 },
    { id: "c-home", count: 2, min: 40, max: 220 },
    { id: "c-pets", count: 1, min: 14, max: 70 },
    { id: "c-subs", count: 2, min: 6, max: 32 },
  ];

function iso(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function buildTransactions(): Transaction[] {
  const today = new Date();
  const anchorYear = today.getFullYear();
  const anchorMonth = today.getMonth();
  const list: Transaction[] = [];
  let n = 0;

  // Seis meses hacia atrás, incluyendo el mes en curso.
  for (let back = 5; back >= 0; back--) {
    const d = new Date(anchorYear, anchorMonth - back, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // El mes en curso solo llega hasta hoy, y con menos movimientos: un libro
    // a mitad de mes no puede tener el mismo volumen que uno cerrado.
    const lastDay = back === 0 ? today.getDate() : daysInMonth;
    const share = back === 0 ? lastDay / daysInMonth : 1;
    const rand = mulberry32(year * 100 + month);

    list.push({
      id: `t-${++n}`,
      amount: 2450 + Math.round(rand() * 180),
      type: "INCOME",
      description: "Sueldo mensual",
      date: iso(year, month, Math.min(5, lastDay)),
      categoryId: "c-salary",
    });

    if (rand() > 0.4) {
      const pool = DESCRIPTIONS["c-freelance"];
      list.push({
        id: `t-${++n}`,
        amount: 320 + Math.round(rand() * 540),
        type: "INCOME",
        description: pool[Math.floor(rand() * pool.length)],
        date: iso(year, month, 1 + Math.floor(rand() * lastDay)),
        categoryId: "c-freelance",
      });
    }

    if (rand() > 0.75) {
      const pool = DESCRIPTIONS["c-other-income"];
      list.push({
        id: `t-${++n}`,
        amount: 40 + Math.round(rand() * 220),
        type: "INCOME",
        description: pool[Math.floor(rand() * pool.length)],
        date: iso(year, month, 1 + Math.floor(rand() * lastDay)),
        categoryId: "c-other-income",
      });
    }

    for (const plan of EXPENSE_PLAN) {
      const pool = DESCRIPTIONS[plan.id];
      const count = Math.max(
        1,
        Math.round(plan.count * (0.6 + rand() * 0.8) * share),
      );
      for (let i = 0; i < count; i++) {
        const day = 1 + Math.floor(rand() * lastDay);
        const isRent = plan.id === "c-home" && i === 0;
        list.push({
          id: `t-${++n}`,
          amount: isRent
            ? 780
            : Math.round((plan.min + rand() * (plan.max - plan.min)) * 100) /
              100,
          type: "EXPENSE",
          description: isRent
            ? "Alquiler"
            : pool[Math.floor(rand() * pool.length)],
          date: isRent
            ? iso(year, month, Math.min(3, lastDay))
            : iso(year, month, day),
          categoryId: plan.id,
        });
      }
    }
  }

  return list.sort((a, b) =>
    a.date < b.date
      ? 1
      : a.date > b.date
        ? -1
        : Number(b.id.slice(2)) - Number(a.id.slice(2)),
  );
}

export const transactions: Transaction[] = buildTransactions();

export const currentUser = {
  name: "Aksel Rivas",
  firstName: "Aksel",
  email: "aksel@gonances.app",
  initials: "AR",
  memberSince: "2026-01-12",
  authMethod: "google" as "google" | "local",
};

/* ── Agregados que hoy calcula el cliente y mañana devolverá /analytics ── */

export function inMonth(tx: Transaction, year: number, month: number) {
  const d = new Date(`${tx.date}T12:00:00`);
  return d.getFullYear() === year && d.getMonth() === month;
}

/**
 * Resumen del mes hasta un día concreto. Comparar un mes a medias contra uno
 * cerrado siempre da un porcentaje falso, así que el panel compara la misma
 * altura de mes.
 */
export function summaryUpToDay(year: number, month: number, day: number) {
  const monthTx = transactions.filter(
    (t) => inMonth(t, year, month) && Number(t.date.slice(8, 10)) <= day,
  );
  return {
    incomes: monthTx
      .filter((t) => t.type === "INCOME")
      .reduce((s, t) => s + t.amount, 0),
    expenses: monthTx
      .filter((t) => t.type === "EXPENSE")
      .reduce((s, t) => s + t.amount, 0),
  };
}

export function summary(year: number, month: number) {
  const monthTx = transactions.filter((t) => inMonth(t, year, month));
  const incomes = monthTx
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);
  const balance = transactions.reduce(
    (s, t) => s + (t.type === "INCOME" ? t.amount : -t.amount),
    0,
  );
  return { balance, incomes, expenses, saved: incomes - expenses };
}

export function expensesByCategory(year: number, month: number) {
  const monthTx = transactions.filter(
    (t) => t.type === "EXPENSE" && inMonth(t, year, month),
  );
  const total = monthTx.reduce((s, t) => s + t.amount, 0) || 1;
  const grouped = new Map<string, number>();
  for (const t of monthTx) {
    grouped.set(t.categoryId, (grouped.get(t.categoryId) ?? 0) + t.amount);
  }
  return [...grouped.entries()]
    .map(([categoryId, amount]) => {
      const cat = categoryById(categoryId);
      return {
        categoryId,
        category: cat.name,
        color: cat.color,
        amount,
        percentage: Math.round((amount / total) * 1000) / 10,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function monthlyTrends(months = 6) {
  const today = new Date();
  const out: {
    key: string;
    label: string;
    year: number;
    month: number;
    incomes: number;
    expenses: number;
  }[] = [];
  const short = [
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
  for (let back = months - 1; back >= 0; back--) {
    const d = new Date(today.getFullYear(), today.getMonth() - back, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthTx = transactions.filter((t) => inMonth(t, year, month));
    out.push({
      key: `${year}-${month}`,
      label: short[month],
      year,
      month,
      incomes: monthTx
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0),
      expenses: monthTx
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0),
    });
  }
  return out;
}

export function currentPeriod() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function categoryIconFor(id: string) {
  return categoryById(id).icon;
}
