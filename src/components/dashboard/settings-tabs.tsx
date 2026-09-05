"use client";

import { Trash2 } from "lucide-react";
import { type SubmitEvent, useEffect, useState } from "react";
import {
  type ThemePreference,
  useTheme,
} from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Panel } from "@/components/ui/panel";
import { useToast } from "@/components/ui/toast";
import { currentUser } from "@/lib/data";
import { longDate } from "@/lib/format";

const tabs = [
  { id: "perfil", label: "Perfil" },
  { id: "seguridad", label: "Seguridad" },
  { id: "datos", label: "Datos" },
  { id: "apariencia", label: "Apariencia" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function SettingsTabs() {
  const [tab, setTab] = useState<TabId>("perfil");

  return (
    <>
      <div
        role="tablist"
        aria-label="Ajustes de la cuenta"
        className="mb-5 flex gap-1 border-b border-rule"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-3 py-2.5 text-[14px] transition-colors ${
                active
                  ? "border-ink font-medium text-ink"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "perfil" ? <ProfilePanel /> : null}
      {tab === "seguridad" ? <SecurityPanel /> : null}
      {tab === "datos" ? <DataPanel /> : null}
      {tab === "apariencia" ? <AppearancePanel /> : null}
    </>
  );
}

function ProfilePanel() {
  const toast = useToast();

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    toast("Perfil actualizado");
  }

  return (
    <div role="tabpanel" id="panel-perfil" aria-labelledby="tab-perfil">
      <Panel title="Tu perfil">
        <form onSubmit={onSubmit} className="grid max-w-110 gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full border border-rule bg-band text-[17px] font-semibold text-ink">
              {currentUser.initials}
            </span>
            <div>
              <Button variant="outline" size="sm">
                Cambiar foto
              </Button>
              <p className="mt-1.5 text-[12px] text-ink-faint">
                JPG o PNG, hasta 2 MB.
              </p>
            </div>
          </div>

          <Field label="Nombre completo" htmlFor="full-name">
            <Input id="full-name" defaultValue={currentUser.name} required />
          </Field>

          <Field
            label="Correo"
            htmlFor="account-email"
            hint="Es el correo con el que entras, no se puede cambiar."
          >
            <Input
              id="account-email"
              type="email"
              defaultValue={currentUser.email}
              readOnly
              className="bg-band/60 text-ink-soft"
            />
          </Field>

          <p className="text-[13px] text-ink-faint">
            Tu libro está abierto desde el {longDate(currentUser.memberSince)}.
          </p>

          <div className="mt-1">
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

function SecurityPanel() {
  const toast = useToast();
  const isGoogle = currentUser.authMethod === "google";

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    toast("Contraseña modificada");
  }

  return (
    <div role="tabpanel" id="panel-seguridad" aria-labelledby="tab-seguridad">
      <Panel title="Contraseña">
        {isGoogle ? (
          <div className="max-w-[62ch]">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Entras con tu cuenta de Google, así que Gonances no guarda ninguna
              contraseña tuya. Para cambiarla, hazlo desde tu cuenta de Google.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Si prefieres entrar con correo y contraseña, escríbenos y lo
              cambiamos.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid max-w-110 gap-4">
            <Field label="Contraseña actual" htmlFor="current-password">
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>
            <Field
              label="Contraseña nueva"
              htmlFor="new-password"
              hint="Ocho caracteres o más."
            >
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
              />
            </Field>
            <div className="mt-1">
              <Button type="submit">Cambiar contraseña</Button>
            </div>
          </form>
        )}
      </Panel>
    </div>
  );
}

const themeOptions: {
  id: ThemePreference;
  label: string;
  hint: string;
}[] = [
  { id: "light", label: "Claro", hint: "La hoja contable de siempre." },
  {
    id: "dark",
    label: "Oscuro",
    hint: "El mismo libro a la luz de una lámpara.",
  },
  {
    id: "system",
    label: "Seguir el sistema",
    hint: "Cambia solo cuando cambia la configuración de tu equipo.",
  },
];

/**
 * El tema se ve al momento de marcarlo, pero solo se guarda al pulsar Guardar.
 * Si sales de la pestaña sin guardar, vuelve a lo que tenías: un botón de
 * guardar que no guarda nada sería mentira, y elegir un tema a ciegas, peor.
 */
function AppearancePanel() {
  const toast = useToast();
  const { storedPreference, previewPreference, setPreference, cancelPreview } =
    useTheme();
  const [draft, setDraft] = useState<ThemePreference>(storedPreference);
  const unsaved = draft !== storedPreference;

  // biome-ignore lint/correctness/useExhaustiveDependencies: solo descarta la vista previa al desmontar
  useEffect(() => cancelPreview, []);

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPreference(draft);
    toast("Apariencia guardada");
  }

  return (
    <div role="tabpanel" id="panel-apariencia" aria-labelledby="tab-apariencia">
      <Panel title="Tema">
        <form onSubmit={onSubmit} className="grid max-w-110 gap-4">
          <fieldset className="grid gap-2">
            <legend className="sr-only">Tema de la interfaz</legend>
            {themeOptions.map((o) => {
              const checked = draft === o.id;
              return (
                <label
                  key={o.id}
                  className={`flex cursor-pointer items-start gap-3 rounded border px-3.5 py-3 transition-colors ${
                    checked
                      ? "border-ink bg-band/60"
                      : "border-rule hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={o.id}
                    checked={checked}
                    onChange={() => {
                      setDraft(o.id);
                      previewPreference(o.id);
                    }}
                    className="mt-0.5 size-4 accent-ink"
                  />
                  <span>
                    <span className="block text-[15px] text-ink">
                      {o.label}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-ink-faint">
                      {o.hint}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <p aria-live="polite" className="text-[13px] text-ink-faint">
            {unsaved
              ? "Lo estás viendo en vista previa. Guarda para conservarlo."
              : "Se guarda en este navegador, no en tu cuenta."}
          </p>

          <div className="mt-1">
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

function DataPanel() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const ready = confirm.trim().toUpperCase() === "ELIMINAR";

  return (
    <div role="tabpanel" id="panel-datos" aria-labelledby="tab-datos">
      <Panel title="Eliminar la cuenta">
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
          Al eliminar la cuenta se borran tu perfil, todos tus movimientos y las
          categorías que creaste. No guardamos copia, así que no hay vuelta
          atrás.
        </p>
        <Button variant="danger" className="mt-5" onClick={() => setOpen(true)}>
          <Trash2 size={16} />
          Eliminar mi cuenta
        </Button>
      </Panel>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setConfirm("");
        }}
        title="Esto borra tu libro entero"
        description="Se eliminan tu perfil, tus movimientos y tus categorías."
        width="sm"
      >
        <Field label="Escribe ELIMINAR para confirmar" htmlFor="confirm-delete">
          <Input
            id="confirm-delete"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="off"
            placeholder="ELIMINAR"
          />
        </Field>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setConfirm("");
            }}
          >
            Conservar mi cuenta
          </Button>
          <Button
            variant="danger"
            disabled={!ready}
            onClick={() => {
              toast("Cuenta eliminada", "warn");
              setOpen(false);
              setConfirm("");
            }}
          >
            <Trash2 size={16} />
            Eliminar definitivamente
          </Button>
        </div>
      </Modal>
    </div>
  );
}
