"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) {
    return (
      <div className="grid gap-4">
        <p className="flex items-start gap-2.5 rounded border border-income/30 bg-income-tint/40 px-3.5 py-3 text-[14px] leading-relaxed text-ink">
          <MailCheck
            size={18}
            className="mt-0.5 shrink-0 text-income"
            aria-hidden="true"
          />
          <span>
            Te enviamos un enlace a{" "}
            <strong className="font-semibold">{sentTo}</strong>. Vence en una
            hora.
          </span>
        </p>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          ¿No llegó? Revisa la carpeta de spam o{" "}
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="text-ink underline underline-offset-4"
          >
            prueba con otro correo
          </button>
          .
        </p>
        <Link
          href="/login"
          className="text-[14px] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setSentTo(String(email || "tu correo"));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label="Correo de tu cuenta" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@correo.com"
        />
      </Field>
      <Button type="submit" size="lg" className="w-full">
        Enviar enlace
      </Button>
      <Link
        href="/login"
        className="text-center text-[14px] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
      >
        Volver a iniciar sesión
      </Link>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const short = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && confirm !== password;
  const ready = password.length >= 8 && confirm === password;

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready) return;
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field
        label="Contraseña nueva"
        htmlFor="password"
        hint={
          short ? (
            <span className="text-expense">Usa ocho caracteres o más.</span>
          ) : (
            "Ocho caracteres o más."
          )
        }
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={short}
          required
          placeholder="••••••••"
        />
      </Field>
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
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch}
          required
          placeholder="••••••••"
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={!ready}>
        Guardar contraseña
      </Button>
    </form>
  );
}
