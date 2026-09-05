import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Las reglas de uso de Gonances, en lenguaje claro.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      updated="30 de agosto de 2026"
      intro="Estas son las reglas de uso de Gonances. Están escritas en lenguaje corriente a propósito: si algo no se entiende, escríbenos y lo aclaramos."
      sections={[
        {
          heading: "Qué es Gonances",
          body: (
            <p>
              Gonances es una herramienta para anotar tus ingresos y gastos y
              verlos resumidos. No es un banco, no mueve dinero, no da consejos
              de inversión y no reemplaza a un contador.
            </p>
          ),
        },
        {
          heading: "Tu cuenta",
          body: (
            <>
              <p>
                Necesitas una cuenta para usar el panel. Puedes crearla con tu
                correo o con tu cuenta de Google. Eres responsable de mantener
                tu contraseña en privado y de lo que se haga desde tu sesión.
              </p>
              <p>
                Para abrir una cuenta debes tener al menos 18 años, o la edad
                mínima legal en tu país para aceptar estos términos.
              </p>
            </>
          ),
        },
        {
          heading: "Uso aceptable",
          body: (
            <p>
              Puedes usar Gonances para llevar tus finanzas personales. No
              puedes usarlo para actividades ilegales, para intentar acceder a
              cuentas ajenas ni para sobrecargar el servicio de forma
              deliberada. Si eso ocurre, cerramos la cuenta.
            </p>
          ),
        },
        {
          heading: "Tus datos son tuyos",
          body: (
            <p>
              Los movimientos que anotas te pertenecen. Puedes borrarlos cuando
              quieras y puedes eliminar la cuenta completa desde{" "}
              <Link
                href="/settings"
                className="text-ink underline underline-offset-4"
              >
                Ajustes
              </Link>
              , lo que borra también todo tu historial. Cómo tratamos esos datos
              está en la{" "}
              <Link
                href="/privacy"
                className="text-ink underline underline-offset-4"
              >
                política de privacidad
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "El servicio se presta tal como está",
          body: (
            <p>
              Gonances está en beta y es un proyecto personal. Hacemos lo
              posible para que funcione y para no perder información, pero no
              podemos garantizar disponibilidad continua ni hacernos
              responsables de decisiones financieras tomadas a partir de lo que
              muestra la aplicación. Guarda una copia de lo que sea crítico para
              ti.
            </p>
          ),
        },
        {
          heading: "Cambios en estos términos",
          body: (
            <p>
              Si cambiamos algo importante, lo avisamos por correo o dentro de
              la aplicación antes de que entre en vigor. Seguir usando Gonances
              después de ese aviso significa que aceptas la versión nueva.
            </p>
          ),
        },
        {
          heading: "Contacto",
          body: (
            <p>
              Para cualquier consulta sobre estos términos, escribe a{" "}
              <a
                href="mailto:hola@gonances.app"
                className="text-ink underline underline-offset-4"
              >
                hola@gonances.app
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
