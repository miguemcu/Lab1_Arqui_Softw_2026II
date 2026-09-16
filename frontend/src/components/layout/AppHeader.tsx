import { Link } from "@tanstack/react-router";
import escudoUdea from "@/assets/escudo-udea.png";

const navItems = [
  { to: "/", label: "Clientes", exact: true },
  { to: "/transferencias", label: "Transferencias", exact: false },
  { to: "/historico", label: "Histórico", exact: false },
] as const;

export function AppHeader() {
  return (
    <header>
      <div className="bg-brand text-brand-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm">
              <img
                src={escudoUdea}
                alt="Escudo de la Universidad de Antioquia"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-2xl font-bold uppercase tracking-wide">
                UdeA Bank
              </span>
              <span className="block text-xs uppercase tracking-[0.18em] text-brand-foreground/70">
                Universidad de Antioquia
              </span>
            </span>
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-brand-foreground/70 sm:text-right">
            Laboratorio de Arquitectura de Software · Sistema transaccional académico
          </p>
        </div>
      </div>

      <nav className="bg-brand-nav text-brand-nav-foreground">
        <div className="mx-auto flex max-w-6xl items-stretch gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-brand-nav-foreground/12 data-[status=active]:bg-brand-nav-foreground/18 data-[status=active]:shadow-[inset_0_-3px_0_0_var(--gold)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
