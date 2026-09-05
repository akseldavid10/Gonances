import type { Metadata } from "next";
import Link from "next/link";
import {
  AuthShell,
  GoogleButton,
  OrDivider,
} from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Abre tu libro"
      intro="Tarda menos de un minuto y no pedimos datos bancarios."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-ink underline underline-offset-4">
            Inicia sesión
          </Link>
        </>
      }
    >
      <GoogleButton label="Registrarme con Google" />
      <OrDivider />
      <RegisterForm />
    </AuthShell>
  );
}
