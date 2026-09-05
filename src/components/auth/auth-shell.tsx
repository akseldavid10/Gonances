import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

export function AuthShell({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-12 sm:py-16">
      <Logo />
      <div className="mt-8 w-full max-w-105 rounded-lg border border-rule bg-sheet px-6 py-7 sm:px-8 sm:py-8">
        <h1 className="font-display text-[27px] leading-tight tracking-[-0.01em] text-ink">
          {title}
        </h1>
        {intro ? (
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            {intro}
          </p>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>
      {footer ? (
        <p className="mt-5 text-[14px] text-ink-soft">{footer}</p>
      ) : null}
      <Link
        href="/"
        className="mt-8 text-[13px] text-ink-faint underline-offset-4 hover:text-ink hover:underline"
      >
        Volver al inicio
      </Link>
    </main>
  );
}

export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded border border-ink/25 bg-sheet text-[15px] font-medium text-ink transition-colors hover:border-ink hover:bg-band/60"
    >
      <svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
        />
        <path
          fill="#FBBC05"
          d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.42 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
        />
      </svg>
      {label}
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-rule" />
      <span className="text-[13px] text-ink-faint">o</span>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}
