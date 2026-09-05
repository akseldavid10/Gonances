import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Sans } from "next/font/google";
import {
  ThemeProvider,
  themeBootstrapScript,
} from "@/components/theme/theme-provider";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Gonances · Tu libro de cuentas personal",
    template: "%s · Gonances",
  },
  description:
    "Anota lo que entra y lo que sale, y mira a dónde se va tu dinero cada mes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      // El script de arranque cambia este atributo antes de que React hidrate.
      data-theme="light"
      suppressHydrationWarning
      className={`${bodoni.variable} ${plex.variable} h-full antialiased`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: script propio, sin datos del usuario, que debe correr antes del primer pintado */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
