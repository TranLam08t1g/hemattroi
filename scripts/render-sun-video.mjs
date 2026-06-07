import createGL from 'gl'
import { PNG } from 'pngjs'
import { writeFileSync, mkdirSync, rmSync } from 'fs'
import { execSync } from 'child_process'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')

const W = 2048
const H = 1024
const FRAMES = 300
const FPS = 30
const DURATION_S = FRAMES / FPS // 10s
const CORONA_PERIOD_S = 8

const FRAMES_DIR = resolve(__dirname, '_frames')
const OUT_MP4 = resolve(PROJECT_ROOT, 'public/textures/sun-procedural.mp4')

// Inline shader (mirror of src/shaders/sun.ts) — embedded so script doesn't need TS transpile
const SNOISE_3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
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
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m*m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const VERTEX = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

// Equirectangular sphere unwrap — UVs map to a sphere surface
// We use snoise on UV space to simulate plasma flowing on sphere
const FRAGMENT = /* glsl */ `
precision highp float;
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform vec3 uRimHot;
uniform vec3 uRimCool;
uniform float uCMEIntensity;
uniform float uTime;
uniform float uCoronaPhase;
varying vec2 vUv;
${SNOISE_3D}

void main() {
  vec2 uv = vUv;
  
  // 1. Plasma FBM 6 octaves (spherical flow)
  float p = 0.0;
  float amp = 1.0;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    p += snoise(vec3(uv * freq * 4.0, uTime * 0.18 + float(i) * 0.7)) * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  p = p * 0.5 + 0.5;
  p = pow(clamp(p, 0.0, 1.0), 1.3);
  
  // 2. Texture base (procedural albedo from script)
  vec3 tex = texture2D(uTexture, uv).rgb;
  
  // 3. Mix: 45% texture + 55% plasma color
  vec3 plasmaColor = mix(uRimCool, uRimHot, p) * (0.4 + p * 1.8);
  vec3 base = mix(tex, plasmaColor, 0.55);
  
  // 4. Sunspots (dark convection cells)
  float spotMask = snoise(vec3(uv * 3.0, uTime * 0.05));
  float spot = smoothstep(-0.3, 0.2, spotMask);
  base *= 0.82 + spot * 0.3;
  
  // 5. Granulation (tiny bright cells)
  float gran = snoise(vec3(uv * 24.0, uTime * 0.3)) * 0.5 + 0.5;
  base += vec3(0.4, 0.15, 0.0) * gran * 0.18;
  
  // 6. CME — corona mass ejection loop (CORONA_PERIOD_S cycle)
  float cmePulse = sin(uCoronaPhase * 6.28318) * 0.5 + 0.5;
  cmePulse = pow(cmePulse, 5.0);
  float cmeBand = snoise(vec3(uv * 5.0, floor(uCoronaPhase * 3.0) * 0.5));
  vec3 cmeColor = vec3(1.8, 0.7, 0.15) * cmePulse * (0.3 + cmeBand) * uCMEIntensity;
  base += cmeColor * 0.6;
  
  // 7. Limb darkening (radial gradient on equirect)
  // Stronger in equirect edges (poles) — but for sun, we want slight polar darkening
  float lat = abs(uv.y - 0.5) * 2.0;
  base *= 1.0 - lat * 0.15;
  
  // 8. Boost saturation
  base = pow(base, vec3(0.92));
  base *= 1.2;
  
  // 9. Edge fade for seamless sphere (corners of equirect)
  // No fade needed if we use sphere UVs properly
  
  gl_FragColor = vec4(base, 1.0);
}
`

// Procedural albedo generator — granulation pattern for sphere surface
function generateProceduralAlbedo(W, H) {
  const data = new Uint8Array(W * H * 4)
  // Multi-octave pseudo-noise (value noise approximation)
  const hash = (x, y) => {
    let h = x * 374761393 + y * 668265263
    h = (h ^ (h >> 13)) * 1274126177
    return ((h ^ (h >> 16)) >>> 0) / 4294967295
  }
  const smoothNoise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y)
    const xf = x - xi, yf = y - yi
    const u = xf * xf * (3 - 2 * xf)
    const v = yf * yf * (3 - 2 * yf)
    const a = hash(xi, yi)
    const b = hash(xi + 1, yi)
    const c = hash(xi, yi + 1)
    const d = hash(xi + 1, yi + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
  const fbm = (x, y) => {
    let v = 0, amp = 1, freq = 1, max = 0
    for (let i = 0; i < 5; i++) {
      v += smoothNoise(x * freq, y * freq) * amp
      max += amp
      amp *= 0.5
      freq *= 2
    }
    return v / max
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H
      // Granulation cells
      const n1 = fbm(u * 32, v * 32)
      const n2 = fbm(u * 80, v * 80) * 0.4
      const n3 = fbm(u * 160, v * 160) * 0.2
      const base = 0.55 + n1 * 0.35 + n2 * 0.15 + n3 * 0.1
      // Hot spots (bright cells)
      const hot = Math.pow(Math.max(0, fbm(u * 24, v * 24) - 0.6) * 2.5, 1.5)
      // Equator brightening
      const latFactor = 1 - Math.abs(v - 0.5) * 2 * 0.2
      const r = Math.min(255, base * latFactor * 255 + hot * 60)
      const g = Math.min(255, base * latFactor * 180 + hot * 30)
      const b = Math.min(255, base * latFactor * 70)
      const idx = (y * W + x) * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }
  return data
}

function compileShader(gl, type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    throw new Error(`Shader compile failed:\n${log}\n--- source ---\n${src}`)
  }
  return shader
}

function main() {
  console.log('=== Sun Procedural Video Renderer ===')
  console.log(`Resolution: ${W}x${H}`)
  console.log(`Frames: ${FRAMES} @ ${FPS}fps (${DURATION_S}s)`)
  console.log(`CME loop: ${CORONA_PERIOD_S}s`)
  console.log(`Output: ${OUT_MP4}`)
  console.log('')

  // Cleanup frames dir
  rmSync(FRAMES_DIR, { recursive: true, force: true })
  mkdirSync(FRAMES_DIR, { recursive: true })

  const gl = createGL(W, H, { preserveDrawingBuffer: true })
  if (!gl) {
    throw new Error('Failed to create WebGL context')
  }
  console.log(`GL version: ${gl.getParameter(gl.VERSION)}`)

  // Compile program
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`)
  }
  gl.useProgram(program)

  // Fullscreen quad
  const verts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
  const posLoc = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  // Generate procedural albedo
  console.log('Generating procedural albedo texture...')
  const albedoData = generateProceduralAlbedo(W, H)
  const albedoTex = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, albedoTex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, albedoData)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0)

  // Constant uniforms
  gl.uniform3f(gl.getUniformLocation(program, 'uColor'), 1.0, 0.42, 0.0)      // #FF6B00
  gl.uniform3f(gl.getUniformLocation(program, 'uRimHot'), 1.0, 0.84, 0.0)     // #FFD700
  gl.uniform3f(gl.getUniformLocation(program, 'uRimCool'), 1.0, 0.27, 0.0)    // #FF4500

  // Get uniform locations once
  const uTimeLoc = gl.getUniformLocation(program, 'uTime')
  const uCoronaLoc = gl.getUniformLocation(program, 'uCoronaPhase')
  const uCMELoc = gl.getUniformLocation(program, 'uCMEIntensity')

  gl.viewport(0, 0, W, H)

  const startTime = Date.now()
  console.log('Rendering frames...')
  for (let i = 0; i < FRAMES; i++) {
    const t = (i / FRAMES) * DURATION_S
    const coronaPhase = (t % CORONA_PERIOD_S) / CORONA_PERIOD_S

    gl.uniform1f(uTimeLoc, t)
    gl.uniform1f(uCoronaLoc, coronaPhase)
    gl.uniform1f(uCMELoc, 0.6) // baseline CME

    gl.drawArrays(gl.TRIANGLES, 0, 6)

    const pixels = new Uint8Array(W * H * 4)
    gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    // Flip Y and pack into PNG (with alpha=255)
    const png = new PNG({ width: W, height: H })
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const srcIdx = ((H - 1 - y) * W + x) * 4
        const dstIdx = (y * W + x) * 4
        png.data[dstIdx] = pixels[srcIdx]
        png.data[dstIdx + 1] = pixels[srcIdx + 1]
        png.data[dstIdx + 2] = pixels[srcIdx + 2]
        png.data[dstIdx + 3] = 255
      }
    }

    const path = resolve(FRAMES_DIR, `frame_${String(i).padStart(4, '0')}.png`)
    writeFileSync(path, PNG.sync.write(png))

    if (i % 30 === 0 || i === FRAMES - 1) {
      const pct = ((i / FRAMES) * 100).toFixed(0)
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      console.log(`  [${pct}%] frame ${i}/${FRAMES} (${elapsed}s)`)
    }
  }

  // Encode MP4
  console.log('')
  console.log('Encoding MP4 with ffmpeg...')
  const ffmpegArgs = [
    '-y',
    '-framerate', String(FPS),
    '-i', resolve(FRAMES_DIR, 'frame_%04d.png'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'slow',
    '-movflags', '+faststart',
    OUT_MP4,
  ]
  execSync(`ffmpeg ${ffmpegArgs.join(' ')}`, { stdio: 'inherit' })

  // Cleanup frames
  console.log('Cleaning up frames...')
  rmSync(FRAMES_DIR, { recursive: true, force: true })

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log('')
  console.log(`✓ Done in ${totalTime}s: ${OUT_MP4}`)
}

main()
