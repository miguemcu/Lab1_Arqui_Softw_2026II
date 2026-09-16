import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { PageSection } from "@/components/layout/PageSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransfer } from "@/hooks/use-bank";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ErrorBlock } from "@/components/common/StateBlocks";
import type { TransactionDTO } from "@/lib/api/types";

export const Route = createFileRoute("/transferencias")({
  head: () => ({
    meta: [
      { title: "Transferencias | UdeA Bank" },
      {
        name: "description",
        content: "Realiza transferencias de dinero entre cuentas registradas en UdeA Bank.",
      },
      { property: "og:title", content: "Transferencias | UdeA Bank" },
      {
        property: "og:description",
        content: "Formulario de transferencia entre cuentas del banco académico UdeA.",
      },
    ],
  }),
  component: TransferPage,
});

const emptyForm = { senderAccountNumber: "", receiverAccountNumber: "", amount: "" };
type Errors = Partial<Record<keyof typeof emptyForm, string>>;

function TransferPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<TransactionDTO | null>(null);
  const transfer = useTransfer();

  function validate(): boolean {
    const next: Errors = {};
    if (!form.senderAccountNumber.trim()) next.senderAccountNumber = "Indica la cuenta origen.";
    if (!form.receiverAccountNumber.trim()) next.receiverAccountNumber = "Indica la cuenta destino.";
    if (
      form.senderAccountNumber.trim() &&
      form.senderAccountNumber.trim() === form.receiverAccountNumber.trim()
    ) {
      next.receiverAccountNumber = "La cuenta destino debe ser distinta a la de origen.";
    }
    const amount = Number(form.amount);
    if (form.amount.trim() === "" || Number.isNaN(amount)) {
      next.amount = "Ingresa un monto numérico.";
    } else if (amount <= 0) {
      next.amount = "El monto debe ser mayor a cero.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setResult(null);
    if (!validate()) return;
    transfer.mutate(
      {
        senderAccountNumber: form.senderAccountNumber.trim(),
        receiverAccountNumber: form.receiverAccountNumber.trim(),
        amount: Number(form.amount),
      },
      {
        onSuccess: (transaction) => {
          setResult(transaction ?? null);
          setForm(emptyForm);
        },
      },
    );
  }

  return (
    <PageSection
      title="Transferencia de dinero"
      description="Envía fondos entre cuentas registradas en el banco."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-lg border border-border bg-card p-6 shadow-institutional"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="sender"
              label="Cuenta origen"
              value={form.senderAccountNumber}
              onChange={(v) => setForm((p) => ({ ...p, senderAccountNumber: v }))}
              error={errors.senderAccountNumber}
            />
            <Field
              id="receiver"
              label="Cuenta destino"
              value={form.receiverAccountNumber}
              onChange={(v) => setForm((p) => ({ ...p, receiverAccountNumber: v }))}
              error={errors.receiverAccountNumber}
            />
          </div>
          <div className="mt-5 max-w-xs">
            <Field
              id="amount"
              label="Monto"
              type="number"
              value={form.amount}
              onChange={(v) => setForm((p) => ({ ...p, amount: v }))}
              error={errors.amount}
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="mt-6"
            disabled={transfer.isPending}
          >
            {transfer.isPending ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            {transfer.isPending ? "Procesando…" : "Transferir"}
          </Button>

          {transfer.error ? (
            <div className="mt-5">
              <ErrorBlock error={transfer.error} />
            </div>
          ) : null}

          {result || transfer.isSuccess ? (
            <div className="mt-5 rounded-lg border border-brand-nav/30 bg-brand-nav/8 px-5 py-4">
              <p className="flex items-center gap-2 font-semibold text-brand">
                <CheckCircle2 className="!size-5" /> Transferencia realizada con éxito
              </p>
              {result ? (
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li>
                    Origen: <span className="font-mono">{result.senderAccountNumber}</span>
                  </li>
                  <li>
                    Destino: <span className="font-mono">{result.receiverAccountNumber}</span>
                  </li>
                  <li>Monto: {formatCurrency(result.amount)}</li>
                  <li>Fecha: {formatDateTime(result.timestamp)}</li>
                </ul>
              ) : null}
            </div>
          ) : null}
        </form>

        <aside className="rounded-lg border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-lg uppercase text-brand">Antes de transferir</h2>
          <ul className="mt-3 list-disc space-y-2 pl-4">
            <li>Verifica que ambas cuentas existan en el banco.</li>
            <li>La cuenta origen debe tener saldo suficiente.</li>
            <li>El monto debe ser un valor positivo.</li>
          </ul>
        </aside>
      </div>
    </PageSection>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  type?: string | undefined;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        step={type === "number" ? "0.01" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
