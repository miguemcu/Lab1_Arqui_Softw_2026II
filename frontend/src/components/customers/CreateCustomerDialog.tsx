import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCustomer } from "@/hooks/use-bank";

const emptyForm = { firstName: "", lastName: "", accountNumber: "", balance: "" };
type FormState = typeof emptyForm;
type Errors = Partial<Record<keyof FormState, string>>;

export function CreateCustomerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const createCustomer = useCreateCustomer();

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function validate(): boolean {
    const next: Errors = {};
    if (!form.firstName.trim()) next.firstName = "El nombre es obligatorio.";
    if (!form.lastName.trim()) next.lastName = "El apellido es obligatorio.";
    if (!form.accountNumber.trim()) next.accountNumber = "El número de cuenta es obligatorio.";
    const balance = Number(form.balance);
    if (form.balance.trim() === "" || Number.isNaN(balance)) {
      next.balance = "Ingresa un saldo inicial numérico.";
    } else if (balance < 0) {
      next.balance = "El saldo inicial no puede ser negativo.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    createCustomer.mutate(
      {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        accountNumber: form.accountNumber.trim(),
        balance: Number(form.balance),
      },
      {
        onSuccess: (customer) => {
          toast.success(`Cliente ${customer?.firstName ?? form.firstName} creado correctamente.`);
          setForm(emptyForm);
          setErrors({});
          onOpenChange(false);
        },
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "No fue posible crear el cliente."),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase text-brand">
            Nuevo cliente
          </DialogTitle>
          <DialogDescription>Registra un cliente y su cuenta en UdeA Bank.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="firstName"
              label="Nombre"
              value={form.firstName}
              onChange={set("firstName")}
              error={errors.firstName}
            />
            <Field
              id="lastName"
              label="Apellido"
              value={form.lastName}
              onChange={set("lastName")}
              error={errors.lastName}
            />
          </div>
          <Field
            id="accountNumber"
            label="Número de cuenta"
            value={form.accountNumber}
            onChange={set("accountNumber")}
            error={errors.accountNumber}
          />
          <Field
            id="balance"
            label="Saldo inicial"
            type="number"
            value={form.balance}
            onChange={set("balance")}
            error={errors.balance}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold" disabled={createCustomer.isPending}>
              {createCustomer.isPending ? <Loader2 className="animate-spin" /> : null}
              Crear cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
