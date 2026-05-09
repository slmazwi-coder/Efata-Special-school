import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import grad from "@/assets/efata-graduation.jpg";
import hall from "@/assets/efata-hall.jpg";
import freedom from "@/assets/efata-freedom.jpg";

type Slide = { image: string; eyebrow: string; title: string; desc: string; ctaLabel: string; ctaHref: string };

const fallback: Slide[] = [
  { image: grad, eyebrow: "Admissions 2026", title: "Start Your Journey With Us", desc: "Applications for the Class of 2026 are now open for both Blind and Deaf sections.", ctaLabel: "Begin Application", ctaHref: "/apply" },
  { image: hall, eyebrow: "School Life", title: "Inclusive Learning Environment", desc: "Explore our specialized programs and facilities for our learners.", ctaLabel: "View Programs", ctaHref: "/about" },
  { image: freedom, eyebrow: "Boarding & Residence", title: "A Home Away From Home", desc: "Learn more about our boarding facilities and student support services.", ctaLabel: "Boarding Info", ctaHref: "/about" },
];

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(fallback);
  const [i, setI] = useState(0);

  useEffect(() => {
    const fallbackImages = [grad, hall, freedom];
    supabase.from("hero_slides").select("*").eq("active", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setSlides(data.map((s: Record<string, unknown>, idx: number) => ({
          image: (s.image_url as string) || fallbackImages[idx % fallbackImages.length],
          eyebrow: "Latest",
          title: s.title as string,
          desc: (s.subtitle as string) ?? "",
          ctaLabel: (s.cta_label as string) || "Learn more",
          ctaHref: (s.cta_href as string) || "/apply",
        })));
      }
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const go = (d: number) => setI((p) => (p + d + slides.length) % slides.length);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {slides.map((s, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/85 via-[var(--primary)]/60 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
            <div className="max-w-2xl text-[var(--primary-foreground)]">
              <span className="inline-block rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent-foreground)]">{s.eyebrow}</span>
              <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold text-shadow-hero leading-tight">{s.title}</h1>
              <p className="mt-4 text-base md:text-lg text-[var(--primary-foreground)]/90 max-w-xl">{s.desc}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={s.ctaHref} className="inline-flex items-center rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] hover:brightness-95 transition">{s.ctaLabel}</Link>
                <Link to="/apply" className="inline-flex items-center rounded-md border border-[var(--primary-foreground)]/40 bg-[var(--primary-foreground)]/10 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-[var(--primary-foreground)]/20 transition">General Application</Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 p-2 text-white backdrop-blur"><ChevronLeft className="h-6 w-6" /></button>
      <button onClick={() => go(1)} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 p-2 text-white backdrop-blur"><ChevronRight className="h-6 w-6" /></button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-[var(--accent)]" : "w-2 bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}
