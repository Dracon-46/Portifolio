/**
 * What the background scene should show. Sections write here as they scroll
 * into view; the render loop reads it every frame and eases toward it, so
 * no React render is involved in either direction.
 */
export type SceneTarget = {
  /** Formation index: 0 core, 1 Nicx, 2 Ascend, 3 AetherTable, 4 Lumen, 5 cosmos. */
  formation: number;
  /** Overall particle opacity, 0..1. */
  alpha: number;
  /** Horizontal offset as a fraction of the viewport width (desktop only). */
  offset: number;
};

export const sceneTarget: SceneTarget = { formation: 0, alpha: 1, offset: 0.2 };

export function setSceneTarget(next: Partial<SceneTarget>): void {
  Object.assign(sceneTarget, next);
  listeners.forEach((fn) => fn());
}

const listeners = new Set<() => void>();

/** Lets an on-demand render loop (reduced motion) know it must redraw. */
export function onSceneTargetChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
