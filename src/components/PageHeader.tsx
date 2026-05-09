export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="gradient-brand text-[var(--primary-foreground)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {eyebrow && <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">{eyebrow}</p>}
        <h1 className="font-display text-4xl md:text-5xl font-bold">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-[var(--primary-foreground)]/85">{subtitle}</p>}
      </div>
    </section>
  );
}
