import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: { heading: string; body: ReactNode }[];
}) {
  return (
    <article className="mx-auto max-w-290 px-5 py-14 sm:px-8 sm:py-20">
      <header className="max-w-[62ch]">
        <h1 className="font-display text-[clamp(2.1rem,4.6vw,3.1rem)] leading-tight tracking-[-0.015em] text-ink">
          {title}
        </h1>
        <p className="mt-3 text-[13px] text-ink-faint">
          Última actualización: {updated}
        </p>
        <p className="mt-6 text-[16px] leading-relaxed text-ink-soft">
          {intro}
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,62ch)] lg:gap-16">
        <nav
          aria-label="Contenido"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <h2 className="text-[13px] font-semibold text-ink">En esta página</h2>
          <ul className="mt-3 space-y-2 border-l border-rule pl-4">
            {sections.map((s) => (
              <li key={s.heading}>
                <a
                  href={`#${slug(s.heading)}`}
                  className="text-[14px] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="divide-y divide-rule">
          {sections.map((s) => (
            <section
              key={s.heading}
              id={slug(s.heading)}
              className="scroll-mt-24 py-8 first:pt-0 last:pb-0"
            >
              <h2 className="text-[19px] font-semibold text-ink">
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3 text-[16px] leading-relaxed text-ink-soft">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

function slug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
