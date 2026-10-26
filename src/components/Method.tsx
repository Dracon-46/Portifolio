import { useRef } from 'react';
import { method } from '../content';
import { useReveal } from '../hooks/useReveal';
import SectionHead from './SectionHead';

export default function Method() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="metodo" ref={root} aria-labelledby="metodo-titulo" className="py-32 md:py-44">
      <div className="shell">
        <SectionHead
          index="05"
          label="Método"
          id="metodo-titulo"
          title="Como eu construo"
          lead="Quatro hábitos que se repetem em todos os produtos da Falkyria, com a prova em cada repositório."
        />

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
          {method.map((m, i) => (
            <li key={m.title} className="bg-bg">
              <div data-reveal={(i % 2) * 0.08} className="flex h-full flex-col p-8 md:p-12">
              <span className="display text-6xl text-amber">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-8 text-2xl font-medium">{m.title}</h3>
              <p className="mt-3 flex-1 text-lg leading-relaxed text-muted">{m.text}</p>
              <p className="label mt-8 border-t border-line pt-4 normal-case tracking-normal">{m.evidence}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
