"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NewTransactionModal } from "@/components/dashboard/new-transaction-modal";
import { Button } from "@/components/ui/button";
import { CategoryStamp } from "@/components/ui/category-icon";
import { inputClass, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { categoryById, type Transaction, type TxType } from "@/lib/data";
import { longDate, money, shortDate, signedMoney } from "@/lib/format";

const PER_PAGE = 10;

type TypeFilter = "ALL" | TxType;
type RangeFilter = "month" | "last-month" | "quarter" | "all";

const ranges: { value: RangeFilter; label: string }[] = [
  { value: "month", label: "Este mes" },
  { value: "last-month", label: "Mes pasado" },
  { value: "quarter", label: "Últimos 3 meses" },
  { value: "all", label: "Todo el historial" },
];

function withinRange(date: string, range: RangeFilter) {
  if (range === "all") return true;
  const d = new Date(`${date}T12:00:00`);
  const now = new Date();
  if (range === "month") {
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }
  if (range === "last-month") {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return (
      d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth()
    );
  }
  const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  return d >= start;
}

export function TransactionsBrowser({ items }: { items: Transaction[] }) {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("ALL");
  const [range, setRange] = useState<RangeFilter>("month");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((t) => {
      if (type !== "ALL" && t.type !== type) return false;
      if (!withinRange(t.date, range)) return false;
      if (!q) return true;
      return (
        t.description.toLowerCase().includes(q) ||
        categoryById(t.categoryId).name.toLowerCase().includes(q)
      );
    });
  }, [items, query, type, range]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const total = filtered.reduce(
    (s, t) => s + (t.type === "INCOME" ? t.amount : -t.amount),
    0,
  );

  function reset<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <>
      {/* Barra de control: buscar, tipo y rango en una sola fila. */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-55 flex-1">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            placeholder="Buscar por concepto o categoría"
            aria-label="Buscar movimientos"
            className={`${inputClass} w-full pl-9`}
          />
        </div>

        <fieldset className="flex h-11 items-center rounded border border-rule bg-sheet p-1">
          <legend className="sr-only">Filtrar por tipo</legend>
          {(
            [
              { value: "ALL", label: "Todos" },
              { value: "INCOME", label: "Ingresos" },
              { value: "EXPENSE", label: "Gastos" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={type === opt.value}
              onClick={() => reset(setType)(opt.value)}
              className={`h-full rounded-sm px-3 text-[14px] transition-colors ${
                type === opt.value
                  ? "bg-ink text-sheet"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </fieldset>

        <Select
          aria-label="Filtrar por fecha"
          value={range}
          onChange={(e) => reset(setRange)(e.target.value as RangeFilter)}
          className="w-47.5 shrink-0"
        >
          {ranges.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>

        <Button onClick={() => setCreating(true)}>
          <Plus size={16} />
          Agregar movimiento
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-rule bg-sheet">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-left">
            <caption className="sr-only">
              Movimientos filtrados, del más reciente al más antiguo
            </caption>
            <thead>
              <tr className="border-b border-rule text-[12px] text-ink-faint">
                <th scope="col" className="px-4 py-3 font-medium sm:px-5">
                  Fecha
                </th>
                <th scope="col" className="py-3 font-medium">
                  Concepto
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Categoría
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Monto
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-medium sm:px-5"
                >
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => {
                const cat = categoryById(t.categoryId);
                return (
                  <tr
                    key={t.id}
                    className="border-t border-rule-soft transition-colors even:bg-band/45 hover:bg-band/80"
                  >
                    <td className="px-4 py-3 align-middle text-[13px] whitespace-nowrap text-ink-faint sm:px-5">
                      {shortDate(t.date)}
                    </td>
                    <td className="py-3 align-middle text-[14px] text-ink">
                      {t.description}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="flex items-center gap-2.5 whitespace-nowrap">
                        <CategoryStamp
                          icon={cat.icon}
                          color={cat.color}
                          size={24}
                        />
                        <span className="text-[14px] text-ink-soft">
                          {cat.name}
                        </span>
                      </span>
                    </td>
                    <td
                      className={`num px-4 py-3 text-right align-middle text-[14px] whitespace-nowrap ${
                        t.type === "INCOME" ? "text-income" : "text-expense"
                      }`}
                    >
                      {signedMoney(t.amount, t.type)}
                    </td>
                    <td className="px-4 py-3 text-right align-middle whitespace-nowrap sm:px-5">
                      <button
                        type="button"
                        onClick={() => setEditing(t)}
                        aria-label={`Editar ${t.description}`}
                        className="rounded p-1.5 text-ink-faint hover:bg-band hover:text-ink"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(t)}
                        aria-label={`Eliminar ${t.description}`}
                        className="ml-1 rounded p-1.5 text-ink-faint hover:bg-expense-tint hover:text-expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-[15px] text-ink">
              No hay movimientos con ese filtro.
            </p>
            <p className="mx-auto mt-1.5 max-w-[46ch] text-[14px] text-ink-soft">
              Prueba con otro rango de fechas o anota el primero de este mes.
            </p>
            <Button className="mt-5" onClick={() => setCreating(true)}>
              <Plus size={16} />
              Agregar movimiento
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-4 py-3 sm:px-5">
            <p className="text-[13px] text-ink-faint">
              {filtered.length} movimientos, saldo del filtro{" "}
              <span className="num text-ink">{money(total)}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                <ChevronLeft size={15} />
                Anterior
              </Button>
              <span className="num text-[13px] text-ink-soft">
                {current} de {pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                Siguiente
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <NewTransactionModal open={creating} onClose={() => setCreating(false)} />
      <NewTransactionModal
        open={editing !== null}
        editing={editing}
        onClose={() => setEditing(null)}
      />

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="¿Eliminar este movimiento?"
        width="sm"
      >
        {deleting ? (
          <>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Vas a borrar{" "}
              <strong className="font-semibold text-ink">
                {deleting.description}
              </strong>{" "}
              de {longDate(deleting.date)} por{" "}
              <span className="num text-ink">{money(deleting.amount)}</span>. No
              se puede deshacer.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Conservar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  toast("Movimiento eliminado");
                  setDeleting(null);
                }}
              >
                <Trash2 size={16} />
                Eliminar
              </Button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}
