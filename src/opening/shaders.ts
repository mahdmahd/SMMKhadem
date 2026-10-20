// uStage runs 0 → 2, driven by scroll after the intro:
// 0 starfield (behind the wordmark), 1 avatar halftone, 2 brain halftone.
// Each point blends between the two homes either side of uStage — position
// *and* look (size, alpha, colour) — leaving a little early or late
// (aDelay) and riding a travelling wave mid-flight.

export const pointsVertex = /* glsl */ `
  attribute vec3 aA;          // star
  attribute vec3 aC;          // avatar dot
  attribute vec3 aD;          // brain dot
  attribute float aTone;      // avatar cell brightness, 0 = unused point
  attribute float aBrainTone; // brain cell brightness, 0 = unused point
  attribute float aDelay;
  attribute vec3 aRand;
  attribute float aSize;

  uniform float uStage;
  uniform float uTime;
  uniform float uMotion;      // 0 when prefers-reduced-motion
  uniform float uFit;         // shrink avatar/brain on narrow screens
  uniform float uCell;        // halftone cell size (shared by avatar and brain)
  uniform float uPointScale;  // viewport height / (2 tan(fov/2))
  uniform mat4 uBrainMat;     // brain sway, shared with the link lines
  uniform vec3 uAvatarOffset;

  varying float vAlpha;
  varying vec3 vColor;

  const float SPREAD = 0.45;  // fraction of a transition spent staggering
  const float PI = 3.14159265;

  vec3 home(float i) {
    if (i < 0.5) return aA;
    if (i < 1.5) return (aC + uAvatarOffset) * uFit;
    return (uBrainMat * vec4(aD, 1.0)).xyz * uFit;
  }

  // One halftone dot: avatar and brain are made of exactly the same points.
  vec2 halftone(float tone) {
    return vec2(uCell * uFit * mix(0.3, 0.9, tone), step(0.001, tone) * mix(0.3, 0.95, tone));
  }
  vec3 white(float tone) {
    return mix(vec3(0.91, 0.89, 0.86), vec3(1.0), tone * 0.6);
  }

  // x = size (world units), y = alpha
  vec2 look(float i) {
    if (i < 0.5) {
      float star = step(aRand.y, 0.14);          // ~14% of points are visible stars
      return vec2(aSize * 0.45, star * (0.15 + aRand.z * 0.4));
    }
    return halftone(i < 1.5 ? aTone : aBrainTone);
  }

  vec3 tint(float i) {
    if (i < 0.5) return vec3(0.85, 0.88, 0.95);
    return white(i < 1.5 ? aTone : aBrainTone);
  }

  float easeInOut(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    float seg = min(floor(uStage), 1.0);
    float f = clamp(uStage - seg, 0.0, 1.0);
    float t = easeInOut(clamp((f - aDelay * SPREAD) / (1.0 - SPREAD), 0.0, 1.0));

    vec3 from = home(seg);
    vec3 to = home(seg + 1.0);
    vec3 p = mix(from, to, t);

    // Mid-flight the cloud becomes a wave: strongest at t = 0.5. Stars →
    // avatar is a free swarm; avatar → brain stays coherent (a gentle swell,
    // little scatter) so the face visibly reshapes into the brain.
    float flight = sin(t * PI) * uMotion * clamp(distance(from, to), 0.0, 1.0);
    float chaos = seg < 0.5 ? 1.0 : 0.2;
    float phase = p.x * 1.7 - uTime * 2.2 + aDelay * 5.0;
    p.y += sin(phase) * 0.35 * flight * mix(0.5, 1.0, chaos);
    p.z += cos(phase * 0.8) * 0.9 * flight * mix(0.6, 1.0, chaos);
    p += (aRand - 0.5) * 0.9 * flight * chaos;

    // Idle shimmer so a resting shape still breathes.
    p += sin(uTime * (0.6 + aRand * 0.8) + aRand * 6.28) * 0.01 * uMotion;

    vec2 lk = mix(look(seg), look(seg + 1.0), t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(lk.x * (1.0 + flight * 0.5 * chaos) * uPointScale / -mv.z, 1.0);

    vAlpha = lk.y;
    vColor = mix(mix(tint(seg), tint(seg + 1.0), t), vec3(0.62, 0.85, 1.0), flight * 0.6 * chaos);
  }
`

export const pointsFragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.2, d) * vAlpha);
  }
`
