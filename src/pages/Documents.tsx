import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download } from "lucide-react";

type Doc = { id: string; title: string; description: string | null; file_url: string; category: string | null };

export default function Documents() {
  const [docs, setDocs] = useState<Doc[]>([]);
  useEffect(() => {
    supabase.from("school_documents").select("*").order("created_at", { ascending: false }).then(({ data }) => setDocs((data as Doc[]) ?? []));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Resources" title="Documents & Downloads" subtitle="Find application forms, school policies and informational documents." />
      <section className="mx-auto max-w-5xl px-6 py-16">
        {docs.length === 0 ? <p className="text-center text-[var(--muted-foreground)]">No documents available yet.</p> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {docs.map((d) => (
              <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--accent)] hover:shadow-md transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--secondary)]"><FileText className="h-6 w-6" /></div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-[var(--primary)]">{d.title}</h3>
                  {d.description && <p className="text-sm text-[var(--muted-foreground)]">{d.description}</p>}
                  {d.category && <p className="mt-1 text-xs uppercase tracking-widest text-[var(--muted-foreground)]">{d.category}</p>}
                </div>
                <Download className="h-5 w-5 text-[var(--secondary)] group-hover:translate-y-0.5 transition" />
              </a>
            ))}
          </div>
        )}
        <p className="mt-8 text-sm text-[var(--muted-foreground)] text-center">
          Need a document that's not listed? <a className="text-[var(--secondary)] font-semibold" href="/contact">Contact the office</a>.
        </p>
      </section>
    </>
  );
}
