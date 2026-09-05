"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <Logo />
      <h1 className="mt-10 font-display text-[clamp(1.8rem,4vw,2.4rem)] leading-tight text-ink">
        Se cortó la cuenta a medio renglón
      </h1>
      <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-soft">
        Algo falló al cargar esta pantalla. Tus movimientos están a salvo:
        vuelve a intentarlo y, si sigue igual, escríbenos a hola@gonances.app.
      </p>
      {error.digest ? (
        <p className="num mt-3 text-[12px] text-ink-faint">
          Referencia {error.digest}
        </p>
      ) : null}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw size={16} />
          Reintentar
        </Button>
        <ButtonLink href="/dashboard" variant="outline">
          Volver al panel
        </ButtonLink>
      </div>
    </main>
  );
}
