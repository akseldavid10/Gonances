import type { ComponentProps, ReactNode } from "react";

export const inputClass =
  "h-11 rounded border border-rule bg-sheet px-3 text-[15px] text-ink placeholder:text-ink-faint/70 focus:border-ink focus:outline-none";

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-ink-soft"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-[12px] text-ink-faint">{hint}</p> : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={["w-full", inputClass, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select
      className={[inputClass, "appearance-none pr-9", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundImage: "var(--select-chevron)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
