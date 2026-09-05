import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/recovery-forms";

export const metadata: Metadata = { title: "Cambiar contraseña" };

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Elige una contraseña nueva"
      intro="Después de guardarla vuelves a entrar con ella."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
