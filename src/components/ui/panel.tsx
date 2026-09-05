import type { ReactNode } from "react";

export function Panel({
  title,
  aside,
  children,
  bodyClassName = "px-4 py-4 sm:px-5 sm:py-5",
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <section className="rounded-lg border border-rule bg-sheet">
      {title || aside ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-4 py-3.5 sm:px-5">
          {title ? (
            <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          ) : (
            <span />
          )}
          {aside}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  lead,
  actions,
}: {
  title: string;
  lead?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[clamp(1.8rem,3.4vw,2.35rem)] leading-tight tracking-[-0.015em] text-ink">
          {title}
        </h1>
        {lead ? (
          <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
            {lead}
          </p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
