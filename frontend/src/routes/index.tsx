import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageSection } from "@/components/layout/PageSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomers } from "@/hooks/use-bank";
import { formatCurrency, fullName } from "@/lib/format";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/common/StateBlocks";
import { CustomerDetailDialog } from "@/components/customers/CustomerDetailDialog";
import { CreateCustomerDialog } from "@/components/customers/CreateCustomerDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clientes | UdeA Bank" },
      {
        name: "description",
        content: "Consulta el listado de clientes de UdeA Bank con su cuenta y saldo disponible.",
      },
      { property: "og:title", content: "Clientes | UdeA Bank" },
      {
        property: "og:description",
        content: "Listado de clientes del banco académico de la Universidad de Antioquia.",
      },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { data, isLoading, error, refetch } = useCustomers();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");

  const customers = (data ?? []).filter((c) => {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return (
      fullName(c.firstName, c.lastName).toLowerCase().includes(term) ||
      c.accountNumber?.toLowerCase().includes(term)
    );
  });

  return (
    <PageSection
      title="Consultar clientes"
      description="Clientes registrados en UdeA Bank con su número de cuenta y saldo."
      actions={
        <Button variant="gold" onClick={() => setCreateOpen(true)}>
          <Plus /> Nuevo cliente
        </Button>
      }
    >
      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 !size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o cuenta"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isLoading ? <LoadingBlock label="Cargando clientes…" /> : null}
      {error ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}

      {!isLoading && !error ? (
        customers.length === 0 ? (
          <EmptyBlock label="No hay clientes para mostrar." />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-institutional">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand text-brand-foreground">
                  <Th>Cliente</Th>
                  <Th>Número de cuenta</Th>
                  <Th className="text-right">Saldo</Th>
                  <Th className="text-right">Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t border-border hover:bg-accent/40">
                    <td className="px-4 py-3 font-medium">
                      {fullName(customer.firstName, customer.lastName)}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {customer.accountNumber}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-brand">
                      {formatCurrency(customer.balance)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="brandOutline"
                        onClick={() => setSelectedId(customer.id)}
                      >
                        Ver detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}

      <CustomerDetailDialog customerId={selectedId} onClose={() => setSelectedId(null)} />
      <CreateCustomerDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageSection>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
}
