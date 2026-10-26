import { useLayoutEffect, type RefObject } from 'react';
import SplitType from 'split-type';
import { gsap } from '../lib/motion';

/**
 * Scroll-in entrances for a section. `[data-reveal]` elements rise and fade;
 * `[data-split]` headings rise word by word from behind a line mask. Splits
 * are reverted once played, so text reflows normally on resize afterwards.
 * Nothing runs for reduced motion: content is simply there.
 */
export function useReveal(scope: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    let cancelled = false;

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'expo.out',
          delay: Number(el.dataset.reveal || 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      const splits: SplitType[] = [];
      // Line breaks depend on the final font, so split only once it is in.
      document.fonts.ready.then(() => {
        if (cancelled) return;
        root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          const split = new SplitType(el, { types: 'lines,words' });
          splits.push(split);
          split.lines?.forEach((line) => line.classList.add('split-line'));
          gsap.from(split.words ?? [], {
            yPercent: 115,
            duration: 1.25,
            ease: 'expo.out',
            stagger: 0.035,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onComplete: () => split.revert(),
          });
        });
      });
      return () => splits.forEach((s) => s.revert());
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [scope]);
}
