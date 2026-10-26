import { lazy, Suspense, useEffect, useState } from 'react';
import { supportsWebGL } from '../lib/webgl';

const Scene = lazy(() => import('../scene/Scene'));

/**
 * The fixed WebGL backdrop. three.js loads after the page is interactive, and
 * browsers without WebGL2 keep a static gradient in the same palette.
 */
export default function BackgroundScene() {
  const [mode, setMode] = useState<'pending' | 'webgl' | 'fallback'>('pending');

  useEffect(() => {
    if (!supportsWebGL()) {
      setMode('fallback');
      return;
    }
    const start = () => setMode('webgl');
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {mode === 'fallback' && <div className="scene-fallback absolute inset-0" />}
      {mode === 'webgl' && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}
    </div>
  );
}
