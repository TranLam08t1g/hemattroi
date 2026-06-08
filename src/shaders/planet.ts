export const planetVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocalPos;

void main() {
  vUv = uv;
  vLocalPos = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const planetFragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vLocalPos;

uniform sampler2D uTexture;
uniform vec3 uPlanetColor;
uniform float uTime;
uniform float uEffectIntensity;
uniform vec2 uAnimSpeed;
uniform float uPlanetType;
uniform float uClipEnabled;

/* -- noise functions -- */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    value += amp * noise(p * freq);
    freq *= 2.1;
    amp *= 0.5;
  }
  return value;
}

void main() {
  /* -- Cutaway clipping: discard 1/4 wedge -- */
  if (uClipEnabled > 0.5) {
    if (vLocalPos.x > 0.0 && vLocalPos.z > 0.0) {
      discard;
    }
  }

  vec4 texColor = texture2D(uTexture, vUv);
  vec3 base = texColor.rgb;
  vec3 detail = vec3(0.0);

  /* ---- ROCKY: crater-like surface noise (Mercury, Mars) ---- */
  if (uPlanetType < 0.5) {
    float n = fbm(vUv * 8.0 + uTime * uAnimSpeed.x * 0.05);
    n += fbm(vUv * 16.0 - uTime * uAnimSpeed.y * 0.03) * 0.6;
    n = n * 0.5 + 0.5;
    detail = uPlanetColor * n * uEffectIntensity;
    base = mix(texColor.rgb, texColor.rgb + detail * 0.45, 0.35);
  }

  /* ---- TERRAN: moving cloud layer (Earth) ---- */
  else if (uPlanetType < 1.5) {
    float clouds = fbm(vUv * 7.0 + vec2(uTime * uAnimSpeed.x, 0.0));
    clouds += fbm(vUv * 14.0 - vec2(uTime * uAnimSpeed.y, 0.0)) * 0.5;
    clouds = clouds * 0.5 + 0.5;
    vec3 cloudColor = mix(vec3(0.92), texColor.rgb, smoothstep(0.35, 0.7, clouds));
    base = mix(texColor.rgb, cloudColor, uEffectIntensity);
  }

  /* ---- GAS: dynamic horizontal bands (Venus, Jupiter, Saturn) ---- */
  else if (uPlanetType < 2.5) {
    float shift = sin(uTime * uAnimSpeed.x) * 0.04;
    float bandY = vUv.y + shift;
    float bands  = sin(bandY * 28.0) * 0.35;
    bands += cos(bandY * 45.0 + uTime * 0.04) * 0.25;
    bands += cos(bandY * 63.0 - uTime * 0.015) * 0.15;
    float turb = fbm(vec2(vUv.x * 10.0, bandY * 14.0 + uTime * uAnimSpeed.y)) * 0.4;
    bands += turb;
    bands = bands * 0.5 + 0.5;
    base = texColor.rgb * (0.55 + bands * 0.5);
  }

  /* ---- ICE: shimmer & crystalline highlight (Uranus, Neptune) ---- */
  else {
    float shimmer = fbm(vUv * 6.0 + uTime * uAnimSpeed.x) * 0.5 + 0.5;
    vec3 iceHighlight = mix(vec3(0.2, 0.4, 0.65), vec3(0.15, 0.55, 0.7), shimmer);
    base = texColor.rgb + iceHighlight * uEffectIntensity;
  }

  /* ---- Fresnel rim glow ---- */
  vec3 N = normalize(vNormal);
  float fresnel = pow(1.0 - abs(dot(N, normalize(vViewDir))), 3.2);
  base += uPlanetColor * fresnel * 0.22;

  gl_FragColor = vec4(base, 1.0);
}
`