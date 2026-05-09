import { PageHeader } from "@/components/PageHeader";
import grad from "@/assets/efata-graduation.jpg";

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Our story" title="About Efata Special School" subtitle="Ndilindel' Ukhanyo — 'I am waiting for the light.' Inclusive, dignified education for Blind and Deaf learners in the Eastern Cape." />
      <section className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={grad} alt="Efata graduates" className="rounded-xl shadow-lg" />
          <div>
            <h2 className="font-display text-3xl text-[var(--primary)] font-bold">Who we are</h2>
            <p className="mt-3 text-[var(--muted-foreground)]">Efata Special School is located on Queenstown R61 Road, Mthatha (OR Tambo Inland), Eastern Cape. The school serves learners with visual and hearing impairments through two dedicated sections — the Blind Section and the Deaf Section — under one supportive community.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-[var(--border)] p-6 bg-[var(--card)]">
            <h3 className="font-display text-2xl font-bold text-[var(--primary)]">Mission</h3>
            <p className="mt-2 text-[var(--muted-foreground)]">To deliver quality, specialised education that empowers Blind and Deaf learners to thrive academically, socially and economically.</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-6 bg-[var(--card)]">
            <h3 className="font-display text-2xl font-bold text-[var(--primary)]">Vision</h3>
            <p className="mt-2 text-[var(--muted-foreground)]">A community where every visually impaired and Deaf learner is seen, heard and prepared for a future of independence.</p>
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl text-[var(--primary)] font-bold">Specialised programs</h2>
          <ul className="mt-4 grid md:grid-cols-2 gap-3 text-[var(--muted-foreground)] list-disc list-inside">
            <li>Braille literacy and assistive technology</li>
            <li>Orientation & mobility training</li>
            <li>South African Sign Language (SASL) instruction</li>
            <li>Speech and audiology support</li>
            <li>Vocational and life-skills training</li>
            <li>Boarding and pastoral care</li>
          </ul>
        </div>
      </section>
    </>
  );
}
