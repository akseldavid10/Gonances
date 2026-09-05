"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

const rules = [
  { label: "Ocho caracteres o más", test: (v: string) => v.length >= 8 },
  { label: "Al menos un número", test: (v: string) => /\d/.test(v) },
  {
    label: "Al menos una mayúscula",
    test: (v: string) => /[A-ZÁÉÍÓÚÑ]/.test(v),
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);

  const passed = rules.filter((r) => r.test(password)).length;
  const mismatch = confirm.length > 0 && confirm !== password;
  const ready = passed === rules.length && !mismatch && confirm.length > 0;

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready) return;
    setPending(true);
    // Sin backend todavía: la demo entra directo al panel de ejemplo.
    router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label="Nombre" htmlFor="name">
        <Input
          id="name"
          name="name"
          autoComplete="name"
          required
          placeholder="Aksel Rivas"
        />
      </Field>
      <Field label="Correo" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@correo.com"
        />
      </Field>
      <Field label="Contraseña" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          aria-describedby="password-rules"
        />
      </Field>

      <ul id="password-rules" className="-mt-1 grid gap-1">
        {rules.map((r) => {
          const ok = r.test(password);
          return (
            <li
              key={r.label}
              className={`flex items-center gap-2 text-[13px] ${
                ok ? "text-income" : "text-ink-faint"
              }`}
            >
              <Check
                size={14}
                strokeWidth={ok ? 2.5 : 1.5}
                aria-hidden="true"
              />
              {r.label}
              <span className="sr-only">
                {ok ? " (cumplido)" : " (pendiente)"}
              </span>
            </li>
          );
        })}
      </ul>

      <Field
        label="Repite la contraseña"
        htmlFor="confirm"
        hint={
          mismatch ? (
            <span className="text-expense">
              Las dos contraseñas no coinciden.
            </span>
          ) : undefined
        }
      >
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          aria-invalid={mismatch}
        />
      </Field>

      <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 size-4 accent-ink"
        />
        <span>
          Acepto los{" "}
          <Link href="/terms" className="text-ink underline underline-offset-4">
            términos y condiciones
          </Link>{" "}
          y la{" "}
          <Link
            href="/privacy"
            className="text-ink underline underline-offset-4"
          >
            política de privacidad
          </Link>
          .
        </span>
      </label>

      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={pending}
      >
        {pending ? "Creando tu libro…" : "Crear mi cuenta"}
      </Button>
    </form>
  );
}
