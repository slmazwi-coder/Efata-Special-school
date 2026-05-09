import { Link } from "react-router-dom";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Eye, Ear, GraduationCap, Heart, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type News = { id: string; title: string; excerpt: string | null; published_at: string; cover_image_url: string | null };

const fallbackNews: News[] = [
  { id: "1", title: "Freedom Day Celebration", excerpt: "Our learners marked Freedom Day with songs, sign and Braille readings.", published_at: new Date("2026-04-27").toISOString(), cover_image_url: null },
  { id: "2", title: "Matric Mid-Year Results", excerpt: "Strong improvements across the Blind and Deaf sections — well done!", published_at: new Date("2026-04-12").toISOString(), cover_image_url: null },
  { id: "3", title: "New Braille Library Books", excerpt: "We received a new donation of Braille textbooks for grades 8–12.", published_at: new Date("2026-04-03").toISOString(), cover_image_url: null },
];

export default function Home() {
  const [news, setNews] = useState<News[]>(fallbackNews);
  useEffect(() => {
    supabase.from("news_posts").select("*").eq("published", true).order("published_at", { ascending: false }).limit(3)
      .then(({ data }) => { if (data && data.length > 0) setNews(data as News[]); });
  }, []);

  return (
    <>
      <HeroCarousel />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">Two sections, one family</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-[var(--primary)]">One school, two specialised paths</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Eye, title: "Blind Section", text: "Specialised teaching in Braille, orientation & mobility, assistive technology and audio learning for visually impaired learners." },
            { icon: Ear, title: "Deaf Section", text: "Instruction in South African Sign Language (SASL), visual learning, speech support and a fully Deaf-friendly classroom culture." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm hover:shadow-lg transition">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-brand text-[var(--primary-foreground)]"><Icon className="h-6 w-6" /></div>
              <h3 className="font-display text-2xl font-bold text-[var(--primary)]">{title}</h3>
              <p className="mt-2 text-[var(--muted-foreground)]">{text}</p>
              <Link to="/about" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--secondary)] group-hover:gap-2 transition-all">Learn more <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--muted)]/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">Latest</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-[var(--primary)]">News & Updates</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((n) => (
              <article key={n.id} className="rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] transition overflow-hidden">
                {n.cover_image_url && <img src={n.cover_image_url} alt={n.title} className="aspect-video w-full object-cover" />}
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)]">{new Date(n.published_at).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-[var(--primary)]">{n.title}</h3>
                  {n.excerpt && <p className="mt-2 text-sm text-[var(--muted-foreground)]">{n.excerpt}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 grid gap-8 md:grid-cols-3 text-center">
        {[
          { icon: GraduationCap, num: "60+", label: "Years of service" },
          { icon: Heart, num: "300+", label: "Learners supported" },
          { icon: Eye, num: "2", label: "Specialised sections" },
        ].map(({ icon: Icon, num, label }) => (
          <div key={label} className="rounded-xl border border-[var(--border)] p-8">
            <Icon className="mx-auto h-8 w-8 text-[var(--secondary)]" />
            <div className="mt-3 font-display text-4xl font-bold text-[var(--primary)]">{num}</div>
            <div className="text-sm uppercase tracking-widest text-[var(--muted-foreground)]">{label}</div>
          </div>
        ))}
      </section>

      <section className="gradient-brand text-[var(--primary-foreground)]">
        <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to apply?</h2>
            <p className="mt-2 text-[var(--primary-foreground)]/85">Submit an online application for the Blind or Deaf section.</p>
          </div>
          <Link to="/apply" className="rounded-md bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-foreground)] hover:brightness-95">Start application</Link>
        </div>
      </section>
    </>
  );
}
