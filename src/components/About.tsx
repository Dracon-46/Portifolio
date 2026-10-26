import { useLayoutEffect, useRef } from 'react';
import SplitType from 'split-type';
import { about } from '../content';
import { useReveal } from '../hooks/useReveal';
import { useSceneSection } from '../hooks/useSceneSection';
import { gsap } from '../lib/motion';

export default function About() {
  const root = useRef<HTMLElement>(null);
  const manifesto = useRef<HTMLParagraphElement>(null);
  useSceneSection(root, { formation: 0, alpha: 0.28, offset: 0.3 });
  useReveal(root);

  // The manifesto lights up word by word as it scrolls through the viewport.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (!manifesto.current) return;
      const split = new SplitType(manifesto.current, { types: 'words' });
      gsap.fromTo(
        split.words ?? [],
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: manifesto.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
        },
      );
      return () => split.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="sobre" ref={root} aria-labelledby="sobre-titulo" className="relative py-32 md:py-48">
      <div className="shell">
        <div className="mb-14 flex items-center gap-4">
          <span className="label">01 — Sobre</span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <h2 id="sobre-titulo" className="sr-only">
          Sobre mim
        </h2>

        <p ref={manifesto} className="display max-w-6xl text-[clamp(2.1rem,5.2vw,4.9rem)] leading-[1.05]">
          {about.manifesto}
        </p>

        <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-12">
          <div className="space-y-6 text-lg leading-relaxed text-muted md:col-span-6 md:col-start-1">
            {about.paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>

          <dl className="md:col-span-5 md:col-start-8">
            {about.facts.map((f, i) => (
              <div
                key={f.label}
                data-reveal={i * 0.06}
                className="flex items-baseline justify-between gap-6 border-t border-line py-4 last:border-b"
              >
                <dt className="label shrink-0">{f.label}</dt>
                <dd className="text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure data-reveal className="mt-24 max-w-3xl md:mt-32 md:ml-[calc(100%/12)]">
          <blockquote className="display text-3xl italic leading-tight md:text-4xl">“{about.quote.text}”</blockquote>
          <figcaption className="label mt-5">— {about.quote.author}</figcaption>
        </figure>
      </div>
    </section>
  );
}
