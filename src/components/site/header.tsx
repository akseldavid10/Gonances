import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const links = [
  { href: "#caracteristicas", label: "Características" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#preguntas", label: "Preguntas frecuentes" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-[2px]">
      <div className="mx-auto flex h-16 max-w-290 items-center gap-8 px-5 sm:px-8">
        <Logo />
        <nav className="hidden flex-1 items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <ButtonLink href="/login" variant="quiet" size="sm">
            Iniciar sesión
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            Empezar gratis
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
