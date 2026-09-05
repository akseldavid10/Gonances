"use client";

import { type SubmitEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { categories, type Transaction, type TxType } from "@/lib/data";

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function NewTransactionModal({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing?: Transaction | null;
}) {
  const toast = useToast();
  const [type, setType] = useState<TxType>("EXPENSE");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (!open) return;
    setType(editing?.type ?? "EXPENSE");
    setCategoryId(editing?.categoryId ?? "");
  }, [open, editing]);

  const options = categories.filter((c) => c.type === type);

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    // Sin backend: la demo confirma y cierra. Aquí irá POST/PUT /transactions.
    toast(editing ? "Movimiento actualizado" : "Movimiento guardado");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Editar movimiento" : "Nuevo movimiento"}
      description={
        editing
          ? "Corrige lo que haga falta y guarda."
          : "Cuatro campos y vuelve a tu libro."
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <fieldset className="grid gap-1.5">
          <legend className="mb-1.5 text-[13px] font-medium text-ink-soft">
            Tipo
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: "EXPENSE", label: "Gasto" },
                { value: "INCOME", label: "Ingreso" },
              ] as const
            ).map((opt) => {
              const active = type === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex h-11 cursor-pointer items-center justify-center rounded border text-[15px] font-medium transition-colors ${
                    active
                      ? opt.value === "INCOME"
                        ? "border-income bg-income-tint/60 text-income"
                        : "border-expense bg-expense-tint/50 text-expense"
                      : "border-rule bg-sheet text-ink-soft hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={opt.value}
                    checked={active}
                    onChange={() => {
                      setType(opt.value);
                      setCategoryId("");
                    }}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field label="Monto" htmlFor="amount">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[15px] text-ink-faint"
            >
              $
            </span>
            <Input
              id="amount"
              name="amount"
              inputMode="decimal"
              required
              defaultValue={editing ? String(editing.amount) : ""}
              placeholder="0,00"
              className="num pl-7 text-right"
            />
          </div>
        </Field>

        <Field label="Categoría" htmlFor="category">
          <Select
            className="w-full"
            id="category"
            name="category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="" disabled>
              Elige una categoría
            </option>
            {options.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.isCustom ? " (tuya)" : ""}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Fecha" htmlFor="date">
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={editing?.date ?? today()}
          />
        </Field>

        <Field label="Descripción" htmlFor="description" hint="Opcional.">
          <Input
            id="description"
            name="description"
            defaultValue={editing?.description ?? ""}
            placeholder="Mercado del barrio"
          />
        </Field>

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {editing ? "Guardar cambios" : "Guardar movimiento"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
