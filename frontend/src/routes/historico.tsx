import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageSection } from "@/components/layout/PageSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers, useTransactions } from "@/hooks/use-bank";
import { formatCurrency, formatDateTime, fullName } from "@/lib/format";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/common/StateBlocks";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de transacciones | UdeA Bank" },
      {
        name: "description",
        content: "Consulta las transacciones enviadas y recibidas por una cuenta de UdeA Bank.",
      },
      { property: "og:title", content: "Histórico de transacciones | UdeA Bank" },
      {
        property: "og:description",
        content: "Movimientos por número de cuenta en el banco académico UdeA.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [input, setInput] = useState("");
  const [account, setAccount] = useState<string | null>(null);
  const customersQuery = useCustomers();
  const { data, isLoading, error, refetch } = useTransactions(account);

  const transactions = [...(data ?? [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <PageSection
      title="Histórico de transacciones"
      description="Movimientos enviados y recibidos por una cuenta."
    >
      <form
        className="mb-6 flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-institutional sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) setAccount(input.trim());
        }}
      >
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="account" className="text-xs font-semibold uppercase tracking-wide">
            Número de cuenta
          </Label>
          <Input
            id="account"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej. 1001234567"
          />
        </div>

        <div className="w-full space-y-1.5 sm:w-64">
          <Label className="text-xs font-semibold uppercase tracking-wide">
            O selecciona un cliente
          </Label>
          <Select
            onValueChange={(value) => {
              setInput(value);
              setAccount(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Clientes registrados" />
            </SelectTrigger>
            <SelectContent>
              {(customersQuery.data ?? []).map((c) => (
                <SelectItem key={c.id} value={c.accountNumber}>
                  {fullName(c.firstName, c.lastName)} · {c.accountNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" variant="gold" disabled={!input.trim()}>
          <Search /> Consultar
        </Button>
      </form>

      {!account ? <EmptyBlock label="Ingresa un número de cuenta para ver sus movimientos." /> : null}
      {account && isLoading ? <LoadingBlock label="Consultando transacciones…" /> : null}
      {account && error ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}

      {account && !isLoading && !error ? (
        transactions.length === 0 ? (
          <EmptyBlock label={`La cuenta ${account} no registra transacciones.`} />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-institutional">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand text-brand-foreground">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Fecha y hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Cuenta origen
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Cuenta destino
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const sent = t.senderAccountNumber === account;
                  return (
                    <tr key={t.id} className="border-t border-border hover:bg-accent/40">
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDateTime(t.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-mono">{t.senderAccountNumber}</td>
                      <td className="px-4 py-3 font-mono">{t.receiverAccountNumber}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            sent
                              ? "bg-destructive/10 text-destructive"
                              : "bg-brand-nav/12 text-brand-nav"
                          }`}
                        >
                          {sent ? "Enviada" : "Recibida"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brand">
                        {sent ? "−" : "+"} {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </PageSection>
  );
}
