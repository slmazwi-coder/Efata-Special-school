import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-[var(--primary)] text-[var(--primary-foreground)]">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl mb-2">Efata Special School</h3>
          <p className="text-sm text-[var(--primary-foreground)]/80">A school for the Blind and Deaf located on Queenstown R61 Road, Mthatha — OR Tambo Inland, Eastern Cape.</p>
          <p className="mt-4 text-xs uppercase tracking-widest text-[var(--accent)]">Ndilindel' Ukhanyo</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[var(--primary-foreground)]/85">
            {[["About the School","/about"],["Our Staff","/staff"],["Documents","/documents"],["Online Application","/apply"],["Achievements","/achievements"],["Activities","/activities"],["Contact Us","/contact"]].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-[var(--accent)]">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Get in touch</h4>
          <ul className="space-y-2 text-sm text-[var(--primary-foreground)]/85">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[var(--accent)]" /><span>Queenstown R61 Road, Mthatha, 5099</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-[var(--accent)]" /><span>047 536 0527 · 082 776 1513</span></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-[var(--accent)]" /><span>efatablinddeaf@gmail.com</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--primary-foreground)]/10 py-4 text-center text-xs text-[var(--primary-foreground)]/60">
        © {new Date().getFullYear()} Efata Special School for the Blind and Deaf. All rights reserved.
      </div>
    </footer>
  );
}
