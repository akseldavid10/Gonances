import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <Logo />
      <p className="engraved mt-10 text-[clamp(3rem,10vw,5rem)] leading-none text-ink">
        404
      </p>
      <h1 className="mt-4 font-display text-[26px] leading-tight text-ink">
        Esta página no está en el libro
      </h1>
      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
        El enlace puede estar mal escrito o la página ya no existe. Vuelve al
        inicio o abre tu panel.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Ir al inicio</ButtonLink>
        <ButtonLink href="/dashboard" variant="outline">
          Abrir mi panel
        </ButtonLink>
      </div>
      <Link
        href="/transactions"
        className="mt-8 text-[13px] text-ink-faint underline-offset-4 hover:text-ink hover:underline"
      >
        Ver mis transacciones
      </Link>
    </main>
  );
}
