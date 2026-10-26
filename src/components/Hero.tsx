import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useLayoutEffect, useRef, type MouseEvent } from 'react';
import SplitType from 'split-type';
import { useSceneSection } from '../hooks/useSceneSection';
import { gsap, scrollToId } from '../lib/motion';

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useSceneSection(root, { formation: 0, alpha: 1, offset: 0.2 });

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    let cancelled = false;
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let split: SplitType | null = null;
      document.fonts.ready.then(() => {
        if (cancelled || !title.current || !root.current) return;
        split = new SplitType(title.current, { types: 'lines,words' });
        split.lines?.forEach((line) => line.classList.add('split-line'));
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.set(root.current.querySelectorAll('.hero-in'), { visibility: 'visible' })
          .from(split.words ?? [], { yPercent: 118, duration: 1.6, stagger: 0.09 }, 0.1)
          .from(root.current.querySelectorAll('.hero-fade'), { y: 24, autoAlpha: 0, duration: 1.2, stagger: 0.08 }, 0.55)
          .add(() => split?.revert());
      });
      return () => split?.revert();
    });
    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <section id="inicio" ref={root} aria-labelledby="hero-title" className="relative flex min-h-svh flex-col">
      <div className="shell flex flex-1 flex-col justify-end pt-28 pb-10 md:pb-14">
        <p className="hero-in hero-fade label mb-6 flex items-center gap-3">
          <span className="pulse-dot size-2 rounded-full bg-amber" />
          Desenvolvedor full stack · Criador da Falkyria
        </p>

        <h1 id="hero-title" ref={title} className="hero-in display text-[clamp(3.6rem,13vw,12.5rem)]">
          Arthur Gaspare <em className="text-accent">Camzano</em>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="hero-in hero-fade max-w-xl text-lg leading-relaxed text-muted md:col-span-6 md:text-xl">
            Construo produtos de ponta a ponta: uma IA que roda no seu computador, um RPG da vida real, uma mesa
            virtual de Magic e um portal que joga luz sobre os gastos públicos.
          </p>
          <div className="hero-in hero-fade flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <a
              href="#falkyria"
              onClick={go('falkyria')}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
            >
              Conhecer a Falkyria
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
            </a>
            <a
              href="#projetos"
              onClick={go('projetos')}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm font-medium transition-colors hover:bg-ink/5"
            >
              Ver projetos
            </a>
          </div>
        </div>

        <div className="hero-in hero-fade mt-14 flex items-center justify-between border-t border-line pt-5">
          <a href="#sobre" onClick={go('sobre')} className="label flex items-center gap-3 hover:text-ink">
            <span className="relative block h-8 w-px overflow-hidden bg-line">
              <span className="scroll-cue absolute inset-0 bg-ink" />
            </span>
            Role para explorar
            <ArrowDown className="size-3.5 md:hidden" />
          </a>
          <span className="label hidden sm:block">Portfólio · 2026</span>
        </div>
      </div>
    </section>
  );
}
