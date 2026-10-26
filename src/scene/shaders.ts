/**
 * One draw call for the whole field. Each particle carries its position in
 * all six formations; uProgress (0..5) picks the pair to blend, with a
 * per-particle delay so shapes dissolve and re-form instead of sliding.
 */

// Ashima Arts / Stefan Gustavson 3D simplex noise (MIT).
const noise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uSize;
uniform float uPixelRatio;
uniform float uAlpha;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform vec3 uColors[6];
uniform float uNoise[6];

attribute vec3 aF1;
attribute vec3 aF2;
attribute vec3 aF3;
attribute vec3 aF4;
attribute vec3 aF5;
attribute float aRandom;
attribute float aSize;

varying vec3 vColor;
varying float vAlpha;

${noise}

float w(float index, float k) { return 1.0 - step(0.5, abs(index - k)); }

vec3 shape(float k) {
  return position * w(0.0, k) + aF1 * w(1.0, k) + aF2 * w(2.0, k)
       + aF3 * w(3.0, k) + aF4 * w(4.0, k) + aF5 * w(5.0, k);
}

vec3 tint(float k) {
  return uColors[0] * w(0.0, k) + uColors[1] * w(1.0, k) + uColors[2] * w(2.0, k)
       + uColors[3] * w(3.0, k) + uColors[4] * w(4.0, k) + uColors[5] * w(5.0, k);
}

float flow(float k) {
  return uNoise[0] * w(0.0, k) + uNoise[1] * w(1.0, k) + uNoise[2] * w(2.0, k)
       + uNoise[3] * w(3.0, k) + uNoise[4] * w(4.0, k) + uNoise[5] * w(5.0, k);
}

void main() {
  float i0 = floor(uProgress);
  float i1 = min(i0 + 1.0, 5.0);
  float f = uProgress - i0;
  // Staggered morph: each particle leaves at its own moment.
  float t = smoothstep(0.0, 1.0, clamp((f - aRandom * 0.4) / 0.6, 0.0, 1.0));

  vec3 p = mix(shape(i0), shape(i1), t);
  float swirl = sin(t * 3.14159265);
  float amp = mix(flow(i0), flow(i1), t) + swirl * 0.85;
  vec3 q = p * 0.55 + vec3(0.0, uTime * 0.11, aRandom * 0.2);
  p += vec3(snoise(q), snoise(q + 31.7), snoise(q + 57.3)) * amp;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  // The cursor parts the field like a hand through dust.
  vec2 d = mv.xy - uMouse;
  float dist = length(d);
  float push = smoothstep(1.3, 0.0, dist) * uMouseStrength;
  mv.xy += (d / max(dist, 0.0001)) * push * 0.55;

  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aSize * uPixelRatio * (24.0 / -mv.z);

  vec3 color = mix(tint(i0), tint(i1), t);
  // Lumen's scanning light sweeps across the columns.
  float lumen = mix(w(4.0, i0), w(4.0, i1), t);
  float scan = smoothstep(0.18, 0.0, abs(fract(p.x * 0.22 - uTime * 0.09) - 0.5));
  color += lumen * scan * 0.55;

  float twinkle = 0.78 + 0.22 * sin(uTime * 1.7 + aRandom * 43.0);
  vColor = color * twinkle;
  vAlpha = uAlpha * (0.45 + 0.55 * aRandom) * (0.55 + push * 0.6);
}
`;

export const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.7);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha);
  #include <colorspace_fragment>
}
`;
