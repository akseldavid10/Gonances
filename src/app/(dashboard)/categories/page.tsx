import type { Metadata } from "next";
import { CategoriesManager } from "@/components/dashboard/categories-manager";
import { PageHeader } from "@/components/ui/panel";
import { categories } from "@/lib/data";

export const metadata: Metadata = { title: "Categorías" };

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categorías"
        lead="Las que vienen con Gonances y las que creas tú. Cada una tiene su tinta y su icono para reconocerla de un vistazo en la tabla y en los gráficos."
      />
      <CategoriesManager items={categories} />
    </>
  );
}
