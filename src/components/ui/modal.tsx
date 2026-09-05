"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef } from "react";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  width = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  width?: "sm" | "md";
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current
      ?.querySelector<HTMLElement>("input, select, textarea, button")
      ?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-scrim/45"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full ${
          width === "sm" ? "sm:max-w-105" : "sm:max-w-140"
        } max-h-[92dvh] overflow-y-auto rounded-t-lg border border-rule bg-sheet sm:rounded-lg`}
        style={{ animation: "modal-in 160ms ease-out" }}
      >
        <div className="flex items-start justify-between gap-6 border-b border-rule px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="font-display text-[22px] leading-tight">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[13px] text-ink-faint">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-1 rounded p-1.5 text-ink-faint hover:bg-band hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
      </div>
      <style>{`@keyframes modal-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
