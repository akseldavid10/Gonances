import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos guarda Gonances, para qué y cómo borrarlos.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      updated="30 de agosto de 2026"
      intro="Gonances guarda lo mínimo para que tu libro funcione: quién eres y qué anotaste. Nada más, y nada se vende."
      sections={[
        {
          heading: "Qué guardamos",
          body: (
            <>
              <p>
                <strong className="font-semibold text-ink">
                  De tu cuenta:
                </strong>{" "}
                nombre, correo electrónico, foto de perfil si entras con Google
                y la fecha en que te registraste. Si usas correo y contraseña,
                guardamos la contraseña cifrada, nunca en texto plano.
              </p>
              <p>
                <strong className="font-semibold text-ink">De tu libro:</strong>{" "}
                los movimientos que anotas (monto, tipo, fecha, categoría y la
                descripción que escribas) y las categorías que crees.
              </p>
            </>
          ),
        },
        {
          heading: "Qué no guardamos",
          body: (
            <p>
              No pedimos ni almacenamos claves de banco, números de tarjeta ni
              accesos a tus cuentas bancarias. Gonances no se conecta con tu
              banco: todo lo que hay dentro lo escribiste tú.
            </p>
          ),
        },
        {
          heading: "Para qué lo usamos",
          body: (
            <p>
              Solo para mostrarte tu propio panel: calcular balances, agrupar
              gastos por categoría y dibujar los gráficos. No usamos tus
              movimientos para publicidad ni los compartimos con terceros con
              fines comerciales.
            </p>
          ),
        },
        {
          heading: "Entrar con Google",
          body: (
            <p>
              Si eliges iniciar sesión con Google, recibimos tu nombre, tu
              correo y tu foto de perfil para crear la cuenta. No recibimos tu
              contraseña de Google ni acceso a tu correo, tu agenda o tus
              archivos. Puedes revocar el permiso desde la configuración de tu
              cuenta de Google en cualquier momento.
            </p>
          ),
        },
        {
          heading: "Dónde viven los datos",
          body: (
            <p>
              La información se guarda en una base de datos PostgreSQL alojada
              en Neon y la aplicación corre en Vercel. Ambos proveedores actúan
              solo como infraestructura y están sujetos a sus propias medidas de
              seguridad. Las conexiones viajan cifradas por HTTPS.
            </p>
          ),
        },
        {
          heading: "Tus derechos",
          body: (
            <p>
              Puedes ver, corregir o borrar cualquier movimiento desde{" "}
              <Link
                href="/transactions"
                className="text-ink underline underline-offset-4"
              >
                Transacciones
              </Link>
              , y eliminar tu cuenta entera desde{" "}
              <Link
                href="/settings"
                className="text-ink underline underline-offset-4"
              >
                Ajustes
              </Link>
              . Al eliminar la cuenta se borran también todos tus movimientos y
              tus categorías personalizadas, sin copia de respaldo.
            </p>
          ),
        },
        {
          heading: "Cookies",
          body: (
            <p>
              Usamos una sola cookie técnica para mantener tu sesión abierta. No
              hay cookies de publicidad ni rastreadores de terceros.
            </p>
          ),
        },
        {
          heading: "Contacto",
          body: (
            <p>
              Para ejercer cualquiera de estos derechos o preguntar algo,
              escribe a{" "}
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
