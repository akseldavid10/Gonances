"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

/**
 * El tema tiene dos capas.
 *
 * La *preferencia* ("light" | "dark" | "system") es lo que el usuario eligió y
 * lo único que se guarda; sin backend todavía, vive en localStorage.
 *
 * El *tema resuelto* ("light" | "dark") es lo que se pinta. Va en `data-theme`
 * del <html> y nunca vale "system": la preferencia del sistema se resuelve
 * aquí y en el script de arranque. Así el CSS necesita un único bloque oscuro
 * en vez de duplicarlo bajo `prefers-color-scheme`.
 */
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "gonances.theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Corre síncrono en el <head>, mientras el navegador parsea el HTML y antes
 * del primer pintado: sin él, quien tenga el tema oscuro guardado vería un
 * flashazo de hoja blanca en cada carga. Va en texto plano porque no puede
 * esperar a que cargue React.
 */
export const themeBootstrapScript = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(p!=="light"&&p!=="dark"){p=window.matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches?"dark":"light"}document.documentElement.setAttribute("data-theme",p)}catch(e){}})()`;

function readStoredPreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    // Modo privado o almacenamiento bloqueado: se cae a la del sistema.
  }
  return "system";
}

function readSystemTheme(): ResolvedTheme {
  try {
    return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function resolve(
  preference: ThemePreference,
  system: ResolvedTheme,
): ResolvedTheme {
  return preference === "system" ? system : preference;
}

type ThemeContextValue = {
  /** La preferencia guardada, o la que se está previsualizando. */
  preference: ThemePreference;
  /** Solo lo guardado: sirve para saber si la vista previa está sin guardar. */
  storedPreference: ThemePreference;
  /** Lo que se está pintando ahora mismo. */
  resolved: ResolvedTheme;
  /** Aplica y guarda. Es lo que usa el conmutador del home. */
  setPreference: (next: ThemePreference) => void;
  /** Aplica sin guardar: la vista previa de la pestaña Apariencia. */
  previewPreference: (next: ThemePreference) => void;
  /** Descarta la vista previa y vuelve a lo guardado. */
  cancelPreview: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme necesita estar dentro de <ThemeProvider>");
  }
  return value;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // El primer render en el cliente tiene que ser idéntico al del servidor
  // (tema claro, preferencia "system") para que React pueda hidratar sin
  // avisos. Los valores reales (localStorage, matchMedia) se leen recién
  // en el efecto de abajo, ya montado: el <html> ya tiene el tema correcto
  // gracias al script de arranque, así que no hay flash visual, solo un
  // segundo render de React con el valor real.
  const [stored, setStored] = useState<ThemePreference>("system");
  const [system, setSystem] = useState<ResolvedTheme>("light");
  const [preview, setPreview] = useState<ThemePreference | null>(null);

  const preference = preview ?? stored;
  const resolvedTheme = resolve(preference, system);

  // Corre antes del pintado: si el tema real difiere del claro por defecto,
  // el usuario nunca ve el flash, solo React hidrata con el mismo HTML que
  // mandó el servidor y luego actualiza de inmediato.
  useLayoutEffect(() => {
    setStored(readStoredPreference());
  }, []);

  // Seguir al sistema solo mientras la preferencia lo pida.
  useLayoutEffect(() => {
    if (preference !== "system") return;
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => setSystem(readSystemTheme());
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [preference]);

  // Antes del pintado, no después: en efecto normal se vería el cambio. En
  // desarrollo, además, StrictMode remonta y React limpia los atributos del
  // <html> que no vienen del JSX, así que hay que reponerlo.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreview(null);
    setStored(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Si no se puede guardar, el tema igual se aplica en esta sesión.
    }
  }, []);

  const previewPreference = useCallback((next: ThemePreference) => {
    setPreview(next);
  }, []);

  const cancelPreview = useCallback(() => {
    setPreview(null);
  }, []);

  const value = useMemo(
    () => ({
      preference,
      storedPreference: stored,
      resolved: resolvedTheme,
      setPreference,
      previewPreference,
      cancelPreview,
    }),
    [
      preference,
      stored,
      resolvedTheme,
      setPreference,
      previewPreference,
      cancelPreview,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
