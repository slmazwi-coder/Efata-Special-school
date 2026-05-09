import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

type Row = { id: string; year: number; event: string; position: string | null; description: string | null; category: string | null; image_url: string | null };

export default function Achievements() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    supabase.from("achievements").select("*").order("year", { ascending: false }).order("sort_order")
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  const grouped = rows.reduce<Record<number, Row[]>>((acc, r) => { (acc[r.year] ??= []).push(r); return acc; }, {});
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <>
      <PageHeader eyebrow="Our pride" title="Achievements" subtitle="Results, awards and proud milestones from across the Blind and Deaf sections." />
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-12">
        {years.length === 0 && <p className="text-center text-[var(--muted-foreground)]">No achievements published yet.</p>}
        {years.map((y) => (
          <div key={y}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-[var(--secondary)]" /> {y}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--muted)]/50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Position / Result</th>
                    <th className="px-4 py-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[y].map((r) => (
                    <tr key={r.id} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3 font-medium text-[var(--primary)]">{r.event}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.category ?? "—"}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-[var(--secondary)]/15 px-2 py-1 text-xs font-semibold text-[var(--secondary)]">{r.position ?? "—"}</span></td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.description ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
