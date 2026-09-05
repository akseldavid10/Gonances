"use client";

import { Check, CircleAlert } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type Toast = { id: number; text: string; tone: "done" | "warn" };

const ToastContext = createContext<
  (text: string, tone?: Toast["tone"]) => void
>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);

  const push = useCallback((text: string, tone: Toast["tone"] = "done") => {
    const id = ++seq.current;
    setItems((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-60 flex flex-col items-center gap-2 px-4"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 rounded border border-inverse-ink/15 bg-inverse px-4 py-2.5 text-[13px] text-inverse-ink"
            style={{ animation: "toast-in 180ms ease-out" }}
          >
            {t.tone === "done" ? (
              <Check size={15} className="text-inverse-income" />
            ) : (
              <CircleAlert size={15} className="text-inverse-expense" />
            )}
            {t.text}
          </div>
        ))}
      </div>
      <style>{`@keyframes toast-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </ToastContext.Provider>
  );
}
