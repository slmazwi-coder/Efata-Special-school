import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/efata-logo.jpg";

const nav = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About" },
  { to: "/staff", label: "Staff" },
  { to: "/achievements", label: "Achievements" },
  { to: "/activities", label: "Activities" },
  { to: "/documents", label: "Documents" },
  { to: "/apply", label: "Apply Online" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="Efata Special School crest" className="h-12 w-12 rounded-full object-contain bg-white ring-2 ring-[var(--accent)]" />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold text-[var(--primary)]">Efata Special School</div>
            <div className="text-[11px] uppercase tracking-widest text-[var(--secondary)]">Ndilindel' Ukhanyo</div>
          </div>
        </NavLink>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.exact}
              className={({ isActive }) => isActive
                ? "px-3 py-2 text-sm font-semibold rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "px-3 py-2 text-sm font-medium text-[var(--foreground)]/80 rounded-md hover:bg-[var(--muted)] hover:text-[var(--primary)] transition-colors"
              }
            >{n.label}</NavLink>
          ))}
        </nav>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--background)]">
          <nav className="flex flex-col p-4 gap-1">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.exact} onClick={() => setOpen(false)}
                className={({ isActive }) => isActive
                  ? "px-3 py-2 rounded-md text-sm font-semibold bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--muted)]"
                }
              >{n.label}</NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
