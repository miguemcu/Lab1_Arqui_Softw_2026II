import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCustomer } from "@/hooks/use-bank";
import { formatCurrency, fullName } from "@/lib/format";
import { ErrorBlock, LoadingBlock } from "@/components/common/StateBlocks";

/** El backend responde con RuntimeException("Customer not found") cuando el id no existe. */
function isNotFound(error: unknown): boolean {
  return error instanceof Error && /customer not found/i.test(error.message);
}

export function CustomerDetailDialog({
  customerId,
  onClose,
}: {
  customerId: number | null;
  onClose: () => void;
}) {
  const { data, isLoading, error, refetch } = useCustomer(customerId);

  return (
    <Dialog open={customerId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase text-brand">
            Detalle del cliente
          </DialogTitle>
        </DialogHeader>

        {isLoading ? <LoadingBlock label="Consultando cliente…" /> : null}
        {error ? (
          isNotFound(error) ? (
            <p className="rounded-lg border border-border bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
              Cliente no encontrado. Verifica el identificador e inténtalo de nuevo.
            </p>
          ) : (
            <ErrorBlock error={error} onRetry={() => refetch()} />
          )
        ) : null}

        {data ? (
          <dl className="divide-y divide-border rounded-lg border border-border bg-card">
            <Row label="Identificador" value={`#${data.id}`} />
            <Row label="Nombre completo" value={fullName(data.firstName, data.lastName)} />
            <Row label="Número de cuenta" value={data.accountNumber} mono />
            <Row label="Saldo actual" value={formatCurrency(data.balance)} />
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
