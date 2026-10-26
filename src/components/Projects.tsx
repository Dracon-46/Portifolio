import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { projects } from '../content';
import { useReveal } from '../hooks/useReveal';
import SectionHead from './SectionHead';

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="projetos" ref={root} aria-labelledby="projetos-titulo" className="py-32 md:py-44">
      <div className="shell">
        <SectionHead
          index="03"
          label="Projetos"
          id="projetos-titulo"
          title="Outros projetos"
          lead="Hardware, dados, mobile e sistemas para empresas. Cada um resolveu um problema real, e o código está aberto."
        />

        <ol className="border-b border-line">
          {projects.map((p, i) => (
            <li key={p.name} data-reveal={(i % 3) * 0.04}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group relative grid gap-4 overflow-hidden border-t border-line py-8 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10"
              >
                {/* Hover wash sweeping in from the left. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-ink/[0.035] transition-transform duration-700 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="label relative tabular-nums md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                <span className="relative md:col-span-4">
                  <span className="display block text-4xl transition-transform duration-700 ease-out-expo group-hover:translate-x-3 md:text-5xl">
                    {p.name}
                  </span>
                </span>
                <span className="relative text-muted md:col-span-5">
                  {p.description}
                  <span className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="relative flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <span className="label">{p.year}</span>
                  <span className="grid size-11 place-items-center rounded-full border border-line-strong transition-all duration-500 ease-out-expo group-hover:border-transparent group-hover:bg-amber group-hover:text-[#0b0b0b]">
                    <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </span>
                </span>
                <span className="sr-only">(código no GitHub, abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
