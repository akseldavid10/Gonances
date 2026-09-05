import type { Metadata } from "next";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";
import { PageHeader } from "@/components/ui/panel";

export const metadata: Metadata = { title: "Ajustes" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Ajustes"
        lead="Tus datos de cuenta y qué hacer si quieres irte."
      />
      <SettingsTabs />
    </>
  );
}
