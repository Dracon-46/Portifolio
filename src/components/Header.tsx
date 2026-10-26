import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import { nav } from '../content';
import { scrollToId } from '../lib/motion';

function useTheme() {
  const [light, setLight] = useState(() => document.documentElement.classList.contains('light'));
  const toggle = () => {
    const next = !light;
    document.documentElement.classList.toggle('light', next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#f4f3ef' : '#08090c');
    try {
      localStorage.setItem('agc-theme', next ? 'light' : 'dark');
    } catch {
      // Private mode or blocked storage: the choice just won't persist.
    }
    setLight(next);
  };
  return { light, toggle };
}

export default function Header() {
  const { light, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? 'border-b border-line bg-[var(--header-bg)] backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <a href="#inicio" onClick={go('inicio')} className="group flex items-baseline gap-1.5" aria-label="Início">
          <span className="display text-2xl italic">Arthur Gaspare</span>
          <span className="size-1.5 rounded-full bg-amber transition-transform duration-500 group-hover:scale-150" />
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={go(item.id)} className="link-underline pb-0.5 transition-colors hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
            aria-label={light ? 'Usar tema escuro' : 'Usar tema claro'}
          >
            {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-line text-muted md:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <nav id="menu-movel" aria-label="Menu" hidden={!open} className="md:hidden">
        <ul className="shell flex flex-col pb-6">
          {nav.map((item, i) => (
            <li key={item.id} className="border-t border-line">
              <a href={`#${item.id}`} onClick={go(item.id)} className="flex items-baseline justify-between py-4">
                <span className="display text-4xl">{item.label}</span>
                <span className="label">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
