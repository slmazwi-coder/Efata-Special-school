import { useEffect } from "react";
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Newspaper, Image, Users, FileText, Trophy, Activity, Inbox, LogOut, LayoutDashboard } from "lucide-react";
import { CrudManager } from "@/components/admin/CrudManager";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/hero", label: "Hero Slides", icon: Image },
  { to: "/admin/staff", label: "Staff", icon: Users },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  { to: "/admin/activities", label: "Activities", icon: Activity },
  { to: "/admin/applications", label: "Applications", icon: Inbox },
];

export function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isAdmin) && pathname !== "/admin/login") nav("/admin/login");
  }, [loading, user, isAdmin, nav, pathname]);

  if (pathname === "/admin/login") return <Outlet />;
  if (loading) return <div className="p-12 text-center text-[var(--muted-foreground)]">Loading…</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 h-fit lg:sticky lg:top-20">
        <nav className="flex flex-col gap-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.exact}
              className={({ isActive }) => `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold" : "hover:bg-[var(--muted)]"}`}>
              <it.icon className="h-4 w-4" /> {it.label}
            </NavLink>
          ))}
          <button onClick={() => signOut().then(() => nav("/"))}
            className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--destructive)] hover:bg-[var(--destructive)]/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      </aside>
      <section><Outlet /></section>
    </div>
  );
}

export function AdminLogin() {
  const { signIn, user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user && isAdmin) nav("/admin"); }, [loading, user, isAdmin, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setErr(error);
  };

  return (
    <>
      <PageHeader eyebrow="Restricted" title="Admin Login" />
      <section className="mx-auto max-w-md px-6 py-16">
        <form onSubmit={submit} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm space-y-4">
          <div className="flex justify-center"><Lock className="h-10 w-10 text-[var(--secondary)]" /></div>
          {err && <p className="rounded-md bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">{err}</p>}
          {user && !isAdmin && <p className="rounded-md bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">This account is not an admin.</p>}
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2" />
          </label>
          <button disabled={busy} className="w-full rounded-md bg-[var(--primary)] px-4 py-2 font-semibold text-[var(--primary-foreground)] disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </>
  );
}

const dashCards = [
  { table: "news_posts", label: "News posts", icon: Newspaper },
  { table: "hero_slides", label: "Hero slides", icon: Image },
  { table: "staff_members", label: "Staff", icon: Users },
  { table: "school_documents", label: "Documents", icon: FileText },
  { table: "achievements", label: "Achievements", icon: Trophy },
  { table: "activities", label: "Activities", icon: Activity },
  { table: "applications", label: "Applications", icon: Inbox },
] as const;

export function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    Promise.all(dashCards.map(async (c) => {
      const { count } = await supabase.from(c.table).select("*", { count: "exact", head: true });
      return [c.table, count ?? 0] as const;
    })).then((entries) => setCounts(Object.fromEntries(entries)));
  }, []);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-6">Welcome back</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashCards.map((c) => (
          <div key={c.table} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <c.icon className="h-6 w-6 text-[var(--secondary)]" />
            <div className="mt-3 text-3xl font-bold text-[var(--primary)]">{counts[c.table] ?? "—"}</div>
            <div className="text-sm text-[var(--muted-foreground)]">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminNews() {
  return <CrudManager table="news_posts" title="News & Updates" orderBy={{ column: "published_at", ascending: false }}
    defaults={{ published: true } as Record<string, unknown>}
    fields={[
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body", label: "Body", type: "textarea" },
      { name: "cover_image_url", label: "Cover image", type: "image" },
      { name: "published", label: "Published", type: "checkbox" },
    ]}
    renderRow={(r) => (
      <div className="flex gap-3">
        {r.cover_image_url ? <img src={r.cover_image_url as string} alt="" className="h-16 w-24 shrink-0 rounded object-cover" /> : null}
        <div>
          <div className="font-semibold text-[var(--primary)]">{r.title as string}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{r.published ? "Published" : "Draft"} · {new Date(r.published_at as string).toLocaleDateString()}</div>
          {r.excerpt ? <p className="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2">{r.excerpt as string}</p> : null}
        </div>
      </div>
    )}
  />;
}

export function AdminHero() {
  return <CrudManager table="hero_slides" title="Hero Slides" orderBy={{ column: "sort_order", ascending: true }}
    defaults={{ active: true, sort_order: 0 } as Record<string, unknown>}
    fields={[
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle / description", type: "textarea" },
      { name: "image_url", label: "Background image", type: "image" },
      { name: "cta_label", label: "Button label", type: "text" },
      { name: "cta_href", label: "Button link (e.g. /apply)", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "active", label: "Active", type: "checkbox" },
    ]}
    renderRow={(r) => (
      <div className="flex gap-3">
        {r.image_url ? <img src={r.image_url as string} alt="" className="h-16 w-24 shrink-0 rounded object-cover" /> : null}
        <div>
          <div className="font-semibold text-[var(--primary)]">{r.title as string}</div>
          <div className="text-xs text-[var(--muted-foreground)]">Order {r.sort_order as number} · {r.active ? "Active" : "Hidden"}</div>
        </div>
      </div>
    )}
  />;
}

export function AdminStaff() {
  return <CrudManager table="staff_members" title="Staff" orderBy={{ column: "sort_order", ascending: true }}
    defaults={{ sort_order: 0 } as Record<string, unknown>}
    fields={[
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role / position", type: "text", required: true },
      { name: "section", label: "Section", type: "select", options: ["Leadership", "Blind Section", "Deaf Section", "Support"] },
      { name: "bio", label: "Short bio", type: "textarea" },
      { name: "photo_url", label: "Photo", type: "image" },
      { name: "email", label: "Email", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ]}
    renderRow={(r) => (
      <div className="flex gap-3">
        {r.photo_url ? <img src={r.photo_url as string} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" /> : null}
        <div>
          <div className="font-semibold text-[var(--primary)]">{r.name as string}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{r.role as string} · {(r.section as string) || "—"}</div>
        </div>
      </div>
    )}
  />;
}

export function AdminDocuments() {
  return <CrudManager table="school_documents" title="Documents" orderBy={{ column: "created_at", ascending: false }}
    fields={[
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "category", label: "Category", type: "select", options: ["Policy", "Form", "Newsletter", "Report", "Other"] },
      { name: "file_url", label: "File", type: "file", required: true },
    ]}
    renderRow={(r) => (
      <div>
        <div className="font-semibold text-[var(--primary)]">{r.title as string}</div>
        <div className="text-xs text-[var(--muted-foreground)]">{(r.category as string) || "—"}</div>
      </div>
    )}
  />;
}

export function AdminAchievements() {
  return <CrudManager table="achievements" title="Achievements" orderBy={{ column: "year", ascending: false }}
    defaults={{ year: new Date().getFullYear() } as Record<string, unknown>}
    fields={[
      { name: "year", label: "Year", type: "number", required: true },
      { name: "event", label: "Event / award", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: ["Academic", "Sport", "Music", "Arts", "Other"] },
      { name: "position", label: "Position / result", type: "text", placeholder: "e.g. 1st, Gold, Bachelor pass" },
      { name: "description", label: "Notes", type: "textarea" },
      { name: "image_url", label: "Image", type: "image" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ]}
    renderRow={(r) => (
      <div>
        <div className="font-semibold text-[var(--primary)]">{r.year as number} — {r.event as string}</div>
        <div className="text-xs text-[var(--muted-foreground)]">{(r.category as string) || "—"} · {(r.position as string) || "—"}</div>
      </div>
    )}
  />;
}

export function AdminActivities() {
  return <CrudManager table="activities" title="Activities (Music & Sport)" orderBy={{ column: "event_date", ascending: false }}
    defaults={{ category: "music" } as Record<string, unknown>}
    fields={[
      { name: "category", label: "Category", type: "select", options: ["music", "sport"], required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "cover_image_url", label: "Cover image", type: "image" },
      { name: "youtube_url", label: "YouTube URL", type: "text", placeholder: "https://youtube.com/watch?v=..." },
      { name: "event_date", label: "Event date", type: "date" },
    ]}
    renderRow={(r) => (
      <div className="flex gap-3">
        {r.cover_image_url ? <img src={r.cover_image_url as string} alt="" className="h-16 w-24 shrink-0 rounded object-cover" /> : null}
        <div>
          <div className="font-semibold text-[var(--primary)]">{r.title as string}</div>
          <div className="text-xs uppercase tracking-widest text-[var(--secondary)]">{r.category as string}</div>
          {r.event_date ? <div className="text-xs text-[var(--muted-foreground)]">{new Date(r.event_date as string).toLocaleDateString()}</div> : null}
        </div>
      </div>
    )}
  />;
}

interface App { id: string; learner_name: string; date_of_birth: string | null; section: string; grade: string; parent_name: string; phone: string; email: string | null; address: string | null; notes: string | null; status: string; created_at: string; relationship: string | null; gender: string | null; id_number: string | null; }

export function AdminApplications() {
  const [rows, setRows] = useState<App[]>([]);
  const [open, setOpen] = useState<App | null>(null);

  const load = async () => {
    const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    setRows((data as App[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete application?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); setOpen(null); }
  };

  const exportCsv = () => {
    const headers = ["Date","Learner","DOB","Section","Grade","Parent","Phone","Email","Status"];
    const csv = [headers.join(",")].concat(rows.map(r => [
      new Date(r.created_at).toLocaleDateString(), r.learner_name, r.date_of_birth ?? "", r.section, r.grade, r.parent_name, r.phone, r.email ?? "", r.status
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "applications.csv"; a.click();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-[var(--primary)]">Applications</h1>
        <button onClick={exportCsv} className="rounded-md border border-[var(--input)] px-4 py-2 text-sm">Export CSV</button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)]/50 text-left">
            <tr>
              <th className="px-3 py-2">Date</th><th className="px-3 py-2">Learner</th>
              <th className="px-3 py-2">Section</th><th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">Parent</th><th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-6 text-center text-[var(--muted-foreground)]">No applications yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)]/30 cursor-pointer" onClick={() => setOpen(r)}>
                <td className="px-3 py-2">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2 font-medium">{r.learner_name}</td>
                <td className="px-3 py-2">{r.section}</td>
                <td className="px-3 py-2">{r.grade}</td>
                <td className="px-3 py-2">{r.parent_name}</td>
                <td className="px-3 py-2">{r.phone}</td>
                <td className="px-3 py-2">
                  <select value={r.status} onClick={(e) => e.stopPropagation()} onChange={(e) => setStatus(r.id, e.target.value)}
                    className="rounded border border-[var(--input)] bg-[var(--background)] px-2 py-1 text-xs">
                    <option value="new">new</option><option value="reviewed">reviewed</option>
                    <option value="accepted">accepted</option><option value="rejected">rejected</option>
                  </select>
                </td>
                <td className="px-3 py-2"><button onClick={(e) => { e.stopPropagation(); remove(r.id); }} className="text-[var(--destructive)] p-1"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-[var(--background)] p-6 shadow-xl space-y-2 text-sm">
            <h2 className="font-display text-xl font-bold mb-2">{open.learner_name}</h2>
            <p><b>Section:</b> {open.section} · <b>Grade:</b> {open.grade}</p>
            <p><b>DOB:</b> {open.date_of_birth ?? "—"} · <b>Gender:</b> {open.gender ?? "—"}</p>
            <p><b>ID:</b> {open.id_number ?? "—"}</p>
            <hr className="my-2" />
            <p><b>Parent:</b> {open.parent_name} ({open.relationship ?? "—"})</p>
            <p><b>Phone:</b> {open.phone} · <b>Email:</b> {open.email ?? "—"}</p>
            <p><b>Address:</b> {open.address ?? "—"}</p>
            <p><b>Notes:</b> {open.notes ?? "—"}</p>
            <div className="pt-3 text-right"><button onClick={() => setOpen(null)} className="rounded-md border px-4 py-2">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
