import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/recovery-forms";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recupera tu acceso"
      intro="Escribe el correo con el que abriste tu libro y te mandamos un enlace para cambiar la contraseña."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
