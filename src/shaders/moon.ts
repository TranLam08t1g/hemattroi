export const moonVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const moonFragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

uniform sampler2D uTexture;
uniform vec3 uColor;
uniform float uTime;
uniform float uMoonType;
uniform float uEffectIntensity;

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
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p * freq);
    freq *= 2.0;
    amp *= 0.55;
  }
  return value;
}

void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  vec3 base = texColor.rgb;
  vec3 detail = vec3(0.0);

  /* ---- ROCKY moon: craters + surface noise ---- */
  if (uMoonType < 0.5) {
    float craters = fbm(vUv * 12.0);
    craters += fbm(vUv * 24.0) * 0.4;
    craters = craters * 0.5 + 0.5;
    detail = uColor * craters * uEffectIntensity;
    base = mix(texColor.rgb, texColor.rgb + detail * 0.4, 0.3);
  }

  /* ---- ICE moon: shimmer + crystalline highlight ---- */
  else {
    float shimmer = fbm(vUv * 8.0 + uTime * 0.02);
    shimmer += fbm(vUv * 16.0 - uTime * 0.015) * 0.5;
    shimmer = shimmer * 0.5 + 0.5;
    vec3 iceHighlight = mix(vec3(0.25, 0.45, 0.65), vec3(0.2, 0.55, 0.72), shimmer);
    base = texColor.rgb + iceHighlight * uEffectIntensity;
  }

  /* ---- Fresnel rim ---- */
  vec3 N = normalize(vNormal);
  float fresnel = pow(1.0 - abs(dot(N, normalize(vViewDir))), 3.5);
  base += uColor * fresnel * 0.18;

  gl_FragColor = vec4(base, 1.0);
}
`