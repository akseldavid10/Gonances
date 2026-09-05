import Link from "next/link";

/**
 * En contabilidad la doble raya cierra un total. La marca la usa como firma:
 * "Gonances" es la línea final de tus cuentas.
 */
export function Logo({
  href = "/",
  tone = "ink",
  size = "md",
}: {
  href?: string;
  tone?: "ink" | "inverse";
  size?: "sm" | "md";
}) {
  const color = tone === "inverse" ? "text-inverse-ink" : "text-ink";
  const rule = tone === "inverse" ? "bg-inverse-ink/70" : "bg-ink/70";
  const text = size === "sm" ? "text-[19px]" : "text-[22px]";

  return (
    <Link
      href={href}
      className={`inline-block ${color}`}
      aria-label="Gonances, inicio"
    >
      <span
        className={`font-display ${text} font-medium leading-none tracking-[-0.01em]`}
      >
        Gonances
      </span>
      <span className="mt-1.25 block space-y-0.5" aria-hidden="true">
        <span className={`block h-px w-full ${rule}`} />
        <span className={`block h-px w-full ${rule}`} />
      </span>
    </Link>
  );
}
