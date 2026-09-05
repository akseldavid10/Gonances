import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const columns = [
  {
    title: "Producto",
    links: [
      { href: "/#caracteristicas", label: "Características" },
      { href: "/#como-funciona", label: "Cómo funciona" },
      { href: "/dashboard", label: "Cuenta de ejemplo" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { href: "/register", label: "Crear cuenta" },
      { href: "/login", label: "Iniciar sesión" },
      { href: "/forgot-password", label: "Recuperar contraseña" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Términos y condiciones" },
      { href: "/privacy", label: "Política de privacidad" },
      { href: "mailto:hola@gonances.app", label: "hola@gonances.app" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-ink/70">
      <div className="mx-auto max-w-290 px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-ink-soft">
              Un libro de cuentas personal: anota lo que entra y lo que sale, y
              mira a dónde se fue el mes.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-[13px] font-semibold text-ink">
                {col.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 border-t border-rule pt-5 text-[13px] text-ink-faint">
          © {new Date().getFullYear()} Gonances. Proyecto personal de finanzas,
          hecho con Next.js.
        </p>
      </div>
    </footer>
  );
}
