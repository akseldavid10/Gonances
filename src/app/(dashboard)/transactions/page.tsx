import type { Metadata } from "next";
import { TransactionsBrowser } from "@/components/dashboard/transactions-browser";
import { PageHeader } from "@/components/ui/panel";
import { transactions } from "@/lib/data";

export const metadata: Metadata = { title: "Transacciones" };

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transacciones"
        lead="Todo lo que has anotado. Busca, filtra por tipo o por fecha, y corrige lo que haga falta."
      />
      <TransactionsBrowser items={transactions} />
    </>
  );
}
