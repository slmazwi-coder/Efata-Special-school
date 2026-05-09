import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Music, Trophy } from "lucide-react";

type Row = { id: string; category: "music" | "sport"; title: string; description: string | null; cover_image_url: string | null; youtube_url: string | null; event_date: string | null };

function ytEmbed(url: string | null) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default function Activities() {
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<"music" | "sport">("music");
  useEffect(() => {
    supabase.from("activities").select("*").order("event_date", { ascending: false, nullsFirst: false })
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  const list = rows.filter((r) => r.category === tab);

  return (
    <>
      <PageHeader eyebrow="School life" title="Activities" subtitle="Music and sport — where our learners shine beyond the classroom." />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto grid w-full max-w-md grid-cols-2 rounded-lg bg-[var(--muted)] p-1 mb-8">
          {(["music", "sport"] as const).map((cat) => (
            <button key={cat} onClick={() => setTab(cat)}
              className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${tab === cat ? "bg-[var(--background)] shadow text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}>
              {cat === "music" ? <Music className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
              {cat === "music" ? "Music" : "Sport"}
            </button>
          ))}
        </div>
        {list.length === 0 ? <p className="text-center text-[var(--muted-foreground)] py-12">Nothing posted yet.</p> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => {
              const embed = ytEmbed(r.youtube_url);
              return (
                <article key={r.id} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
                  {embed ? <div className="aspect-video w-full"><iframe src={embed} title={r.title} className="h-full w-full" allowFullScreen /></div>
                    : r.cover_image_url ? <img src={r.cover_image_url} alt={r.title} className="aspect-video w-full object-cover" /> : null}
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-[var(--primary)]">{r.title}</h3>
                    {r.event_date && <p className="text-xs uppercase tracking-widest text-[var(--secondary)] mt-1">{new Date(r.event_date).toLocaleDateString()}</p>}
                    {r.description && <p className="mt-2 text-sm text-[var(--muted-foreground)]">{r.description}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
