import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { useRef, useState } from 'react';
import { person } from '../content';
import { useReveal } from '../hooks/useReveal';

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  useReveal(root);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section id="contato" ref={root} aria-labelledby="contato-titulo" className="pt-32 md:pt-44">
      <div className="shell">
        <div className="mb-14 flex items-center gap-4">
          <span className="label">06 — Contato</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <h2 id="contato-titulo" data-split className="display text-[clamp(3.6rem,12vw,11rem)]">
          Vamos construir <em className="text-accent">algo?</em>
        </h2>

        <div className="mt-16 grid gap-14 md:grid-cols-12">
          <div data-reveal className="md:col-span-7">
            <p className="max-w-lg text-lg leading-relaxed text-muted">
              Uma vaga, um projeto, uma ideia que precisa sair do papel ou só uma boa conversa sobre IA e jogos: meu
              e-mail está sempre aberto.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${person.email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-bg transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
              >
                {person.email}
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
              </a>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3.5 text-sm transition-colors hover:bg-ink/5"
              >
                {copied ? <Check className="size-4 text-amber" /> : <Copy className="size-4" />}
                {copied ? 'Copiado' : 'Copiar e-mail'}
              </button>
              <span role="status" className="sr-only">
                {copied ? 'E-mail copiado para a área de transferência' : ''}
              </span>
            </div>
            <a href={person.phoneHref} className="link-underline mt-6 inline-block text-muted hover:text-ink">
              {person.phone}
            </a>
          </div>

          <ul data-reveal="0.08" className="md:col-span-4 md:col-start-9">
            {person.socials.map((s) => (
              <li key={s.label} className="border-t border-line last:border-b">
                <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-4">
                  <span>
                    <span className="block font-medium">{s.label}</span>
                    <span className="label normal-case tracking-normal">{s.handle}</span>
                  </span>
                  <ArrowUpRight className="size-5 text-muted transition-transform duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-ink" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="shell mt-32 flex flex-col gap-4 border-t border-line py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {person.name} · Falkyria</p>
        <p>Feito com React, Three.js e GSAP.</p>
      </footer>
    </section>
  );
}
