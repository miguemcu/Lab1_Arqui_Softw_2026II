import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

export function LoadingBlock({ label = "Cargando información…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-6 py-14 text-sm text-muted-foreground">
      <Loader2 className="animate-spin" />
      {label}
    </div>
  );
}

export function ErrorBlock({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
      <AlertTriangle className="mx-auto !size-6 text-destructive" />
      <p className="mt-3 text-sm font-medium text-destructive">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 cursor-pointer text-sm font-semibold text-brand underline underline-offset-4"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

export function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
      <Inbox className="mx-auto mb-3 !size-6 opacity-60" />
      {label}
    </div>
  );
}
