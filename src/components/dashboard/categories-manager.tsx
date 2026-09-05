"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CategoryStamp,
  ICON_NAMES,
  type IconName,
} from "@/components/ui/category-icon";
import { Field, Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Panel } from "@/components/ui/panel";
import { useToast } from "@/components/ui/toast";
import { type Category, MAX_CUSTOM_CATEGORIES, type TxType } from "@/lib/data";

const SWATCHES = [
  "#c4611a",
  "#4fbfa8",
  "#8e2a5f",
  "#d9a81e",
  "#1f4e9c",
  "#e07a88",
  "#3c6b1c",
  "#a98ce8",
  "#1f6b4a",
  "#6d7c72",
];

export function CategoriesManager({ items }: { items: Category[] }) {
  const toast = useToast();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const system = items.filter((c) => !c.isCustom);
  const custom = items.filter((c) => c.isCustom);
  const left = MAX_CUSTOM_CATEGORIES - custom.length;

  return (
    <>
      <div className="grid gap-5">
        <Panel
          title="Categorías del sistema"
          aside={
            <span className="text-[13px] text-ink-faint">
              Vienen con Gonances y no se pueden borrar
            </span>
          }
        >
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {system.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded border border-rule-soft px-3 py-2.5"
              >
                <CategoryStamp icon={c.icon} color={c.color} size={30} />
                <span className="flex-1 text-[14px] text-ink">{c.name}</span>
                <TypeTag type={c.type} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Mis categorías"
          aside={
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-ink-faint">
                {custom.length} de {MAX_CUSTOM_CATEGORIES} usadas
              </span>
              <Button
                size="sm"
                onClick={() => setCreating(true)}
                disabled={left <= 0}
                title={left <= 0 ? "Llegaste al máximo de cinco" : undefined}
              >
                <Plus size={15} />
                Crear categoría
              </Button>
            </div>
          }
        >
          {custom.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[15px] text-ink">
                Todavía no creaste ninguna.
              </p>
              <p className="mx-auto mt-1.5 max-w-[48ch] text-[14px] text-ink-soft">
                Crea hasta cinco categorías propias para lo que no encaja en las
                de siempre: la mascota, el gimnasio, ese proyecto aparte.
              </p>
              <Button className="mt-5" onClick={() => setCreating(true)}>
                <Plus size={16} />
                Crear categoría
              </Button>
            </div>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {custom.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded border border-rule px-3 py-2.5"
                >
                  <CategoryStamp icon={c.icon} color={c.color} size={30} />
                  <span className="flex-1 text-[14px] text-ink">{c.name}</span>
                  <TypeTag type={c.type} />
                  <span className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setEditing(c)}
                      aria-label={`Editar ${c.name}`}
                      className="rounded p-1.5 text-ink-faint hover:bg-band hover:text-ink"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(c)}
                      aria-label={`Eliminar ${c.name}`}
                      className="rounded p-1.5 text-ink-faint hover:bg-expense-tint hover:text-expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <CategoryModal
        open={creating || editing !== null}
        editing={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={(name) => {
          toast(
            editing
              ? `Categoría ${name} actualizada`
              : `Categoría ${name} creada`,
          );
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="¿Eliminar esta categoría?"
        width="sm"
      >
        {deleting ? (
          <>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-ink">
                {deleting.name}
              </strong>{" "}
              desaparecerá de la lista. Si ya tiene movimientos anotados,
              primero tendrás que moverlos a otra categoría.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Conservar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  toast(`Categoría ${deleting.name} eliminada`);
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

function TypeTag({ type }: { type: TxType }) {
  return (
    <span
      className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[11px] ${
        type === "INCOME"
          ? "bg-income-tint/70 text-income"
          : "bg-expense-tint/60 text-expense"
      }`}
    >
      {type === "INCOME" ? "Ingreso" : "Gasto"}
    </span>
  );
}

function CategoryModal({
  open,
  editing,
  onClose,
  onSaved,
}: {
  open: boolean;
  editing: Category | null;
  onClose: () => void;
  onSaved: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<TxType>("EXPENSE");
  const [color, setColor] = useState(SWATCHES[0]);
  const [icon, setIcon] = useState<IconName>("ShoppingBasket");

  // Al abrir, el formulario toma los valores de la categoría en edición.
  const [lastOpened, setLastOpened] = useState(false);
  if (open !== lastOpened) {
    setLastOpened(open);
    if (open) {
      setName(editing?.name ?? "");
      setType(editing?.type ?? "EXPENSE");
      setColor(editing?.color ?? SWATCHES[0]);
      setIcon((editing?.icon as IconName) ?? "ShoppingBasket");
    }
  }

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    onSaved(name.trim());
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Editar categoría" : "Nueva categoría"}
      description="Ponle nombre, elige si es para ingresos o gastos y dale una tinta."
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field label="Nombre" htmlFor="cat-name">
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={24}
            placeholder="Gimnasio"
          />
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-ink-soft">
            Sirve para
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: "EXPENSE", label: "Gastos" },
                { value: "INCOME", label: "Ingresos" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className={`flex h-11 cursor-pointer items-center justify-center rounded border text-[15px] font-medium transition-colors ${
                  type === opt.value
                    ? "border-ink bg-band/60 text-ink"
                    : "border-rule bg-sheet text-ink-soft hover:border-ink/40"
                }`}
              >
                <input
                  type="radio"
                  name="cat-type"
                  value={opt.value}
                  checked={type === opt.value}
                  onChange={() => setType(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-ink-soft">
            Tinta
          </legend>
          <div className="flex flex-wrap gap-2">
            {SWATCHES.map((s) => (
              <label
                key={s}
                className={`flex size-9 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
                  color === s ? "border-ink" : "border-transparent"
                }`}
              >
                <input
                  type="radio"
                  name="cat-color"
                  value={s}
                  checked={color === s}
                  onChange={() => setColor(s)}
                  className="sr-only"
                />
                <span
                  className="size-6 rounded-sm"
                  style={{ backgroundColor: s }}
                  aria-hidden="true"
                />
                <span className="sr-only">Tinta {s}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-ink-soft">
            Icono
          </legend>
          <div className="flex flex-wrap gap-2">
            {ICON_NAMES.map((n) => (
              <label
                key={n}
                className={`cursor-pointer rounded border-2 p-0.5 transition-colors ${
                  icon === n ? "border-ink" : "border-transparent"
                }`}
              >
                <input
                  type="radio"
                  name="cat-icon"
                  value={n}
                  checked={icon === n}
                  onChange={() => setIcon(n)}
                  className="sr-only"
                />
                <CategoryStamp icon={n} color={color} size={32} />
                <span className="sr-only">{n}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {editing ? "Guardar cambios" : "Crear categoría"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
