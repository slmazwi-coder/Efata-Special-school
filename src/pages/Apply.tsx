import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function Field({ label, name, type = "text", required, textarea, full }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean; full?: boolean }) {
  const cls = `w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)] ${full ? "sm:col-span-2" : ""}`;
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block font-medium text-[var(--foreground)]">{label}</span>
      {textarea ? <textarea name={name} required={required} rows={4} className={cls} /> : <input name={name} type={type} required={required} className={cls} />}
    </label>
  );
}

function SelectField({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-[var(--foreground)]">{label}</span>
      <select name={name} required={required} className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]">
        <option value="">Select…</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

export default function Apply() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <>
      <PageHeader eyebrow="Application" title="Application received" />
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--secondary)]" />
        <p className="mt-4 text-[var(--muted-foreground)]">Thank you. Our admissions office will be in touch shortly to confirm next steps.</p>
      </section>
    </>
  );

  return (
    <>
      <PageHeader eyebrow="Admissions" title="Online Application" subtitle="Complete the form below to apply for admission. Required fields are marked with *." />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const payload = {
            learner_name: String(f.get("name") || ""),
            date_of_birth: (f.get("dob") as string) || null,
            id_number: (f.get("id") as string) || null,
            gender: (f.get("gender") as string) || null,
            section: String(f.get("section") || ""),
            grade: String(f.get("grade") || ""),
            parent_name: String(f.get("parent") || ""),
            relationship: (f.get("relationship") as string) || null,
            phone: String(f.get("phone") || ""),
            email: (f.get("email") as string) || null,
            address: (f.get("address") as string) || null,
            notes: (f.get("notes") as string) || null,
          };
          const { error } = await supabase.from("applications").insert(payload);
          if (error) { toast.error(error.message); return; }
          setSubmitted(true);
        }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Learner's full name *" name="name" required />
            <Field label="Date of birth *" name="dob" type="date" required />
            <Field label="ID / Birth certificate no." name="id" />
            <Field label="Gender" name="gender" />
            <SelectField label="Section applied for *" name="section" options={["Blind Section", "Deaf Section"]} required />
            <SelectField label="Grade applied for *" name="grade" options={["Grade R","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"]} required />
          </div>
          <h3 className="font-display text-xl font-bold text-[var(--primary)] pt-4">Parent / Guardian</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Parent / Guardian name *" name="parent" required />
            <Field label="Relationship" name="relationship" />
            <Field label="Phone *" name="phone" type="tel" required />
            <Field label="Email" name="email" type="email" />
            <Field label="Home address" name="address" full />
          </div>
          <Field label="Tell us about the learner (medical, support needs)" name="notes" textarea full />
          <div className="flex justify-end">
            <button type="submit" className="rounded-md bg-[var(--secondary)] px-8 py-3 font-semibold text-[var(--secondary-foreground)] hover:brightness-95">Submit application</button>
          </div>
        </form>
      </section>
    </>
  );
}
