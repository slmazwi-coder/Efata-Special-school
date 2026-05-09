import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";

type Member = { id: string; name: string; role: string; section: string | null; bio: string | null; photo_url: string | null };

function Initials({ name }: { name: string }) {
  const init = name.split(" ").map((s) => s[0]).slice(0, 2).join("");
  return <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-brand text-[var(--primary-foreground)] font-display text-2xl font-bold">{init}</div>;
}

export default function Staff() {
  const [team, setTeam] = useState<Member[]>([]);
  useEffect(() => {
    supabase.from("staff_members").select("*").order("sort_order").then(({ data }) => setTeam((data as Member[]) ?? []));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Our team" title="Staff & Leadership" subtitle="A dedicated team of specialists, educators and support staff serving learners across both sections." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {team.length === 0 ? <p className="text-center text-[var(--muted-foreground)]">Staff list coming soon.</p> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center hover:border-[var(--accent)] transition">
                <div className="flex justify-center">
                  {m.photo_url ? <img src={m.photo_url} alt={m.name} className="h-20 w-20 rounded-full object-cover" /> : <Initials name={m.name} />}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-[var(--primary)]">{m.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{m.role}</p>
                {m.section && <span className="mt-3 inline-block rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--secondary)]">{m.section}</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
