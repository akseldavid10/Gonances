import type { Metadata } from "next";
import Link from "next/link";
import {
  AuthShell,
  GoogleButton,
  OrDivider,
} from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Vuelve a tu libro"
      intro="Entra para seguir anotando y ver cómo va el mes."
      footer={
        <>
          ¿Todavía no tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-ink underline underline-offset-4"
          >
            Créala gratis
          </Link>
        </>
      }
    >
      <GoogleButton label="Continuar con Google" />
      <OrDivider />
      <LoginForm />
    </AuthShell>
  );
}
