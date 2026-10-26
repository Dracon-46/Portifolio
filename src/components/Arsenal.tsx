import { useRef } from 'react';
import { arsenal } from '../content';
import { useReveal } from '../hooks/useReveal';
import SectionHead from './SectionHead';

const all = arsenal.flatMap((g) => g.items);

export default function Arsenal() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} aria-labelledby="arsenal-titulo" className="py-32 md:py-44">
      <div className="shell">
        <SectionHead
          index="04"
          label="Arsenal"
          id="arsenal-titulo"
          title="Ferramentas que eu uso de verdade"
          lead="As linguagens e ferramentas com que eu trabalho no dia a dia."
        />
      </div>

      {/* Decorative ticker; the grouped list below carries the content. */}
      <div aria-hidden="true" className="mb-20 overflow-hidden border-y border-line py-6 md:mb-28">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {all.map((item) => (
                <span key={item} className="display flex items-center whitespace-nowrap px-6 text-4xl italic text-muted md:text-6xl">
                  {item}
                  <span className="ml-12 size-1.5 rounded-full bg-amber" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="shell grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {arsenal.map((g, i) => (
          <div key={g.group} data-reveal={(i % 3) * 0.06}>
            <h3 className="label mb-4 border-b border-line pb-3">{g.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li key={item} className="chip text-[0.8rem] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
