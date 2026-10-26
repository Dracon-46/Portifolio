import { useEffect, type RefObject } from 'react';
import { ScrollTrigger } from '../lib/motion';
import { setSceneTarget, type SceneTarget } from '../lib/sceneStore';

/** While the section crosses the middle of the viewport, the scene shows `target`. */
export function useSceneSection(ref: RefObject<HTMLElement | null>, target: SceneTarget): void {
  const { formation, alpha, offset } = target;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) setSceneTarget({ formation, alpha, offset });
      },
    });
    return () => st.kill();
  }, [ref, formation, alpha, offset]);
}
