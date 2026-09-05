"use client";

import {
  ChartColumn,
  ChartPie,
  CreditCard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Tags,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { NewTransactionModal } from "@/components/dashboard/new-transaction-modal";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ToastProvider } from "@/components/ui/toast";
import { currentUser } from "@/lib/data";

const nav = [
  { href: "/dashboard", label: "Panel", icon: ChartPie },
  { href: "/transactions", label: "Transacciones", icon: CreditCard },
  { href: "/categories", label: "Categorías", icon: Tags },
  { href: "/analytics", label: "Estadísticas", icon: ChartColumn },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function DashboardChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // El menú móvil se cierra al cambiar de pantalla.
  // biome-ignore lint/correctness/useExhaustiveDependencies: la ruta es el único disparador
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <ToastProvider>
      <div className="flex min-h-full flex-1">
        <Sidebar
          pathname={pathname}
          drawerOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-rule bg-paper/95 px-4 backdrop-blur-[2px] sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="-ml-1 rounded p-2 text-ink hover:bg-band lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>

            <p className="hidden text-[15px] text-ink sm:block">
              Hola, {currentUser.firstName}
            </p>

            <div className="ml-auto flex items-center gap-3">
              <Button onClick={() => setModalOpen(true)}>
                <Plus size={16} />
                Nueva transacción
              </Button>
              <Link
                href="/settings"
                className="flex size-9 items-center justify-center rounded-full border border-rule bg-sheet text-[13px] font-semibold text-ink"
                aria-label="Tu perfil"
                title={currentUser.name}
              >
                {currentUser.initials}
              </Link>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      <NewTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </ToastProvider>
  );
}

function Sidebar({
  pathname,
  drawerOpen,
  onClose,
}: {
  pathname: string;
  drawerOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {drawerOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-scrim/45 lg:hidden"
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-inverse transition-transform duration-200 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo href="/dashboard" tone="inverse" size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded p-1.5 text-inverse-ink/70 hover:bg-inverse-ink/10 hover:text-inverse-ink lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-4 flex-1 px-3" aria-label="Secciones">
          <ul className="space-y-0.5">
            {nav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded border-l-2 px-3 py-2.5 text-[14px] transition-colors ${
                      active
                        ? "border-inverse-ink bg-inverse-ink/10 text-inverse-ink"
                        : "border-transparent text-inverse-ink/65 hover:bg-inverse-ink/5 hover:text-inverse-ink"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.75} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-inverse-ink/15 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded px-3 py-2.5 text-[14px] text-inverse-ink/65 transition-colors hover:bg-inverse-ink/5 hover:text-inverse-ink"
          >
            <LogOut size={17} strokeWidth={1.75} />
            Cerrar sesión
          </Link>
        </div>
      </div>
    </>
  );
}
