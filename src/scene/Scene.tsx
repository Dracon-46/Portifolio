import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { onSceneTargetChange, sceneTarget } from '../lib/sceneStore';
import { buildAttributes, buildFormations } from './formations';
import { fragmentShader, vertexShader } from './shaders';

// Core, Nicx, Ascend, AetherTable, Lumen, cosmos. Same hues as the chapters.
const DARK_COLORS = ['#9cc4f5', '#46e3f5', '#f5b733', '#b79cff', '#7ee0a1', '#c9d3e6'];
const LIGHT_COLORS = ['#1c5cab', '#0b7f95', '#a86f00', '#5b3fc4', '#1f7a45', '#3d4a63'];
// Idle drift per formation: the core breathes, the cards stay crisp.
const NOISE = [0.11, 0.05, 0.04, 0.015, 0.02, 0.18];
const MAX_DPR = 1.75;

/**
 * Watches frame times and steps the pixel ratio down while the GPU struggles
 * (and back up when it recovers). Pixel count is what this scene pays for.
 */
function AdaptiveResolution() {
  const setDpr = useThree((s) => s.setDpr);
  const window2s = useRef({ frames: 0, time: 0, dpr: Math.min(window.devicePixelRatio, MAX_DPR) });
  useFrame((_, delta) => {
    const w = window2s.current;
    w.frames += 1;
    w.time += delta;
    if (w.time < 2) return;
    const fps = w.frames / w.time;
    const next = fps < 45 ? Math.max(1, w.dpr - 0.25) : fps > 58 ? Math.min(Math.min(window.devicePixelRatio, MAX_DPR), w.dpr + 0.25) : w.dpr;
    if (next !== w.dpr) {
      w.dpr = next;
      setDpr(next);
    }
    w.frames = 0;
    w.time = 0;
  });
  return null;
}

type Props = { light: boolean; reducedMotion: boolean };

function Particles({ light, reducedMotion }: Props) {
  const { size, viewport, gl, invalidate } = useThree();
  const count = size.width < 768 ? 7000 : 15000;
  const group = useRef<THREE.Group>(null);
  const progress = useRef(sceneTarget.formation);
  const alpha = useRef(0);
  const offset = useRef(0);
  const mouse = useRef(new THREE.Vector2(99, 99));
  const mouseStrength = useRef(0);
  const mouseTarget = useRef(new THREE.Vector2());

  const geometry = useMemo(() => {
    const [f0, f1, f2, f3, f4, f5] = buildFormations(count);
    const { random, size: sizes } = buildAttributes(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(f0, 3));
    g.setAttribute('aF1', new THREE.BufferAttribute(f1, 3));
    g.setAttribute('aF2', new THREE.BufferAttribute(f2, 3));
    g.setAttribute('aF3', new THREE.BufferAttribute(f3, 3));
    g.setAttribute('aF4', new THREE.BufferAttribute(f4, 3));
    g.setAttribute('aF5', new THREE.BufferAttribute(f5, 3));
    g.setAttribute('aRandom', new THREE.BufferAttribute(random, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    // Morphing moves particles far outside any single shape's bounds.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: sceneTarget.formation },
          uSize: { value: 1 },
          uPixelRatio: { value: 1 },
          uAlpha: { value: 0 },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uMouseStrength: { value: 0 },
          uColors: { value: DARK_COLORS.map((c) => new THREE.Color(c)) },
          uNoise: { value: NOISE },
        },
      }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  // Additive light on the dark stage; plain ink on paper in the light theme.
  useEffect(() => {
    material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    material.uniforms.uColors.value = (light ? LIGHT_COLORS : DARK_COLORS).map((c) => new THREE.Color(c));
    material.uniforms.uSize.value = light ? 1.35 : 1;
    material.needsUpdate = true;
    invalidate();
  }, [light, material, invalidate]);

  useEffect(() => {
    if (!reducedMotion) return;
    return onSceneTargetChange(() => invalidate());
  }, [reducedMotion, invalidate]);

  // Pointer over the whole page, not just the canvas (which ignores events).
  useEffect(() => {
    if (reducedMotion) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      mouseStrength.current = 1;
    };
    const leave = () => (mouseStrength.current = 0);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [reducedMotion]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const dt = Math.min(delta, 1 / 20);
    const narrow = viewport.width < 7;
    const targetAlpha = sceneTarget.alpha * (narrow ? 0.55 : 1);
    const targetOffset = narrow ? 0 : sceneTarget.offset * viewport.width;

    if (reducedMotion) {
      progress.current = sceneTarget.formation;
      alpha.current = targetAlpha;
      offset.current = targetOffset;
    } else {
      // Exponential easing: frame-rate independent, never overshoots.
      progress.current += (sceneTarget.formation - progress.current) * (1 - Math.exp(-dt * 1.6));
      if (Math.abs(sceneTarget.formation - progress.current) < 0.0005) progress.current = sceneTarget.formation;
      alpha.current += (targetAlpha - alpha.current) * (1 - Math.exp(-dt * 2.5));
      offset.current += (targetOffset - offset.current) * (1 - Math.exp(-dt * 2.2));
      u.uTime.value = state.clock.elapsedTime;
    }

    u.uProgress.value = progress.current;
    u.uAlpha.value = alpha.current;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uMouseStrength.value += (mouseStrength.current - u.uMouseStrength.value) * (1 - Math.exp(-dt * 4));
    mouseTarget.current.set((mouse.current.x * viewport.width) / 2, (mouse.current.y * viewport.height) / 2);
    (u.uMouse.value as THREE.Vector2).lerp(
      mouseTarget.current,
      reducedMotion ? 1 : 1 - Math.exp(-dt * 8),
    );

    const g = group.current;
    if (g) {
      g.position.x = offset.current;
      g.scale.setScalar(narrow ? 0.72 : 1);
      if (!reducedMotion) {
        // Sway rather than spin: the slime's eyes and the cards face the viewer.
        g.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.4;
        // A gentle parallax tilt toward the cursor.
        g.rotation.x += (mouse.current.y * 0.08 * mouseStrength.current - g.rotation.x) * (1 - Math.exp(-dt * 2));
      }
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

export default function Scene() {
  const [light, setLight] = useState(() => document.documentElement.classList.contains('light'));
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const observer = new MutationObserver(() => setLight(document.documentElement.classList.contains('light')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio, MAX_DPR)}
      frameloop={reducedMotion ? 'demand' : 'always'}
      camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      {!reducedMotion && <AdaptiveResolution />}
      <Particles light={light} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
