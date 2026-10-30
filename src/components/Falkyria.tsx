import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import logoDark from '../assets/falkyria/falkyria-branca.svg';
import logoLight from '../assets/falkyria/falkyria.svg';
import { falkyria, products, type Product } from '../content';
import { useReveal } from '../hooks/useReveal';
import { useSceneSection } from '../hooks/useSceneSection';
import { ScrollTrigger, scrollToId } from '../lib/motion';

function Chapter({ product, index, onActive }: { product: Product; index: number; onActive: (i: number) => void }) {
  const root = useRef<HTMLElement>(null);
  // Each chapter turns the field into its own shape, off to the right.
  useSceneSection(root, { formation: index + 1, alpha: 1, offset: 0.24 });
  useReveal(root);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && onActive(index),
    });
    return () => st.kill();
  }, [index, onActive]);

  return (
    <article
      id={product.id}
      ref={root}
      aria-labelledby={`${product.id}-nome`}
      className="flex min-h-svh items-center py-24"
      style={{ ['--chapter' as string]: product.accent }}
    >
      <div className="w-full max-w-xl md:w-5/12 md:max-w-none">
        <div data-reveal className="mb-8 flex items-center gap-4">
          <span className="label tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
          </span>
          <span className="h-px w-10 bg-[var(--chapter)]" />
          <span className="label">{product.kicker}</span>
        </div>

        <h3 id={`${product.id}-nome`} data-split className="display text-[clamp(4rem,9vw,8.5rem)]">
          {product.name}
        </h3>
        <p data-reveal className="mt-5 text-xl text-ink md:text-2xl">
          {product.tagline}
        </p>
        <p data-reveal="0.05" className="mt-5 text-lg leading-relaxed text-muted">
          {product.description}
        </p>

        <ul className="mt-10">
          {product.highlights.map((h, i) => (
            <li key={h.title} data-reveal={i * 0.06} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <span className="font-medium">{h.title}</span>
              <span className="text-muted">{h.text}</span>
            </li>
          ))}
        </ul>

        <ul data-reveal className="mt-8 flex flex-wrap gap-2" aria-label="Tecnologias">
          {product.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {product.links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={
                i === 0
                  ? 'group inline-flex items-center gap-2 rounded-full bg-[var(--chapter)] px-5 py-3 text-sm font-medium text-[#0b0b0b] transition-transform duration-500 ease-out-expo hover:-translate-y-0.5'
                  : 'group inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink'
              }
            >
              {l.label}
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          ))}
          <span className="label flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--chapter)]" />
            {product.status}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Falkyria() {
  const intro = useRef<HTMLDivElement>(null);
  const chapters = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  // Hide the index once the reader scrolls past (or back above) the chapters.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: chapters.current,
      start: 'top 55%',
      end: 'bottom 55%',
      onLeave: () => setActive(-1),
      onLeaveBack: () => setActive(-1),
    });
    return () => st.kill();
  }, []);
  useSceneSection(intro, { formation: 0, alpha: 0.6, offset: 0 });
  useReveal(intro);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <section id="falkyria" aria-labelledby="falkyria-titulo" className="relative">
      <div ref={intro} className="shell py-32 md:py-44">
        <div className="mb-14 flex items-center gap-4">
          <span className="label">02 — Falkyria</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <h2 id="falkyria-titulo" className="display flex items-end text-[clamp(4.5rem,17vw,16rem)]">
          {/* The eagle mark: white on the dark stage, ink on the light one. */}
          <img src={logoDark} alt="" aria-hidden="true" className="mr-[0.1em] mb-[0.12em] h-[0.78em] w-auto shrink-0 light:hidden" />
          <img src={logoLight} alt="" aria-hidden="true" className="mr-[0.1em] mb-[0.12em] hidden h-[0.78em] w-auto shrink-0 light:block" />
          <span data-split>Falkyria</span>
          <span className="mb-[0.16em] ml-[0.06em] inline-block size-[0.11em] shrink-0 rounded-full bg-amber" aria-hidden="true" />
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <p data-reveal className="text-xl leading-relaxed md:col-span-6 md:text-2xl">
            {falkyria.intro}
          </p>
          <ul className="md:col-span-5 md:col-start-8">
            {falkyria.principles.map((p, i) => (
              <li key={p.title} data-reveal={i * 0.07} className="border-t border-line py-5 last:border-b">
                <p className="font-medium">{p.title}</p>
                <p className="mt-1 text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div ref={chapters} className="shell relative">
        {/* Chapter index, beside the scene on wide screens while a chapter is on. */}
        <nav
          aria-label="Produtos da Falkyria"
          className={`fixed right-[clamp(1rem,4vw,3rem)] bottom-8 z-20 hidden transition-opacity duration-500 md:block ${
            active >= 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <ol className="flex gap-6">
            {products.map((p, i) => (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  onClick={go(p.id)}
                  tabIndex={active >= 0 ? undefined : -1}
                  aria-current={active === i ? 'true' : undefined}
                  className={`label flex items-center gap-2 transition-colors duration-500 hover:text-ink ${
                    active === i ? 'text-ink' : ''
                  }`}
                >
                  <span
                    className="h-px transition-all duration-700 ease-out-expo"
                    style={{ width: active === i ? '2rem' : '0.75rem', background: active === i ? p.accent : 'var(--line-strong)' }}
                  />
                  {p.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {products.map((p, i) => (
          <Chapter key={p.id} product={p} index={i} onActive={setActive} />
        ))}
      </div>
    </section>
  );
}
