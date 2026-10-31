import { useEffect, useRef } from 'preact/hooks';

// ---------------------------------------------------------------------------
// WebGL Utilities
// ---------------------------------------------------------------------------

function hexToGlColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

function createFullscreenQuad(gl: WebGLRenderingContext, program: WebGLProgram) {
  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

interface UniformLocations {
  u_time: WebGLUniformLocation;
  u_resolution: WebGLUniformLocation;
  u_dpr: WebGLUniformLocation;
  u_colors: WebGLUniformLocation;
}

function getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): UniformLocations | null {
  const u_time = gl.getUniformLocation(program, 'u_time');
  const u_resolution = gl.getUniformLocation(program, 'u_resolution');
  const u_dpr = gl.getUniformLocation(program, 'u_dpr');
  const u_colors = gl.getUniformLocation(program, 'u_colors[0]');
  // a missing location means a uniform name drifted from the shader
  // source — bail instead of feeding nulls to the setters below
  if (!u_time || !u_resolution || !u_dpr || !u_colors) return null;
  return { u_time, u_resolution, u_dpr, u_colors };
}

function setUniforms(
  gl: WebGLRenderingContext,
  locations: UniformLocations,
  time: number,
  width: number,
  height: number,
  dpr: number,
  colors: Float32Array
) {
  gl.uniform1f(locations.u_time, time);
  gl.uniform2f(locations.u_resolution, width, height);
  gl.uniform1f(locations.u_dpr, dpr);
  gl.uniform3fv(locations.u_colors, colors);
}

function draw(gl: WebGLRenderingContext) {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// ---------------------------------------------------------------------------
// Shader source strings
// ---------------------------------------------------------------------------

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `

  precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dpr;
uniform vec3 u_colors[6]; // one tone per blob — the new-design ink set

const int BLOB_COUNT = 6;

// Distance threshold for two blobs to be considered in the same cluster.
// In aspect-corrected UV space.
const float CLUSTER_RADIUS = 0.35;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 blobPosition(int index, float time) {
  float fIndex = float(index);
  float aspect = u_resolution.x / u_resolution.y;

  float seedX     = rand(vec2(fIndex, 0.0));
  float seedY     = rand(vec2(fIndex, 1.0));
  float seedSpeed = rand(vec2(fIndex, 2.0));
  float seedPhase = rand(vec2(fIndex, 3.0));

  float speed = 0.4 + seedSpeed * 0.6;

  float x = (0.2 + 0.6 * (0.5 + 0.5 * sin(time * speed + seedX * 6.2831 + seedPhase * 6.2831))) * aspect;
  float y =  0.2 + 0.6 * (0.5 + 0.5 * cos(time * speed * 0.7 + seedY * 6.2831 + seedPhase * 6.2831));
  return vec2(x, y);
}

float metaballField(vec2 coord, float time) {
  float field = 0.0;
  for (int i = 0; i < BLOB_COUNT; i++) {
    vec2 center = blobPosition(i, time);
    float dist = distance(coord, center);
    field += 0.0085 / (dist * dist);
  }
  return field;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  st.x *= aspect;

  float time = u_time;
  float field = metaballField(st, time);
  float edge = 0.02;
  float surface = smoothstep(1.0 - edge, 1.0 + edge, field);

  // ─────────────────────────────────────────────────────────────────
  // THE GROUND: the 45deg hatch the site paints (a 1px line every
  // 28px, #E0E4D8 on #F2F5EB, solid) — computed here so the LIQUID
  // can WARP it: the metaball field's gradient is the warp vector.
  // The stripes' sample point is pulled radially toward each blob —
  // a lens whose strength rides the same field that shapes the
  // surface, so the lines bulge in around the liquid and straighten
  // at the field's halo before it begins.
  // ─────────────────────────────────────────────────────────────────
  float pitch = 28.0 * u_dpr;                 // the stripes' 28px css period
  float lw = u_dpr;                           // a 1px css line
  vec2 p = gl_FragCoord.xy;                   // device px
  float eps = 0.0015;
  float fX = metaballField(vec2(st.x + eps, st.y), time);
  float fY = metaballField(vec2(st.x, st.y + eps), time);
  vec2 gradUv = vec2(fX - field, fY - field) / eps;
  // uv gradient → device-px gradient (the y span is a resolution unit;
  // the x span rides the same span after aspect-scaling)
  vec2 gradPx = gradUv * abs(u_resolution.y);
  // ─────────────────────────────────────────────────────────────────
  // THE LENS (Eliot's correction): the hatch stays STRAIGHT wherever
  // the liquid isn't — the previous read warped a wide halo around
  // each blob (physical flowing-around). The deformation now rides
  // the SURFACE itself: the stripes refract only where the liquid
  // covers them (and through its soft rim band), like glass — the
  // outside read is the plain straight hatch.
  // ─────────────────────────────────────────────────────────────────
  vec2 warp = -gradPx * 220.0;
  float warpLen = length(warp) / u_dpr;
  if (warpLen > 26.0) warp *= 26.0 / warpLen;  // a 26 css px refraction cap
  warp *= surface;

  /* the hatch's axis matches the site's repeating-linear-gradient(45deg):
     stripes constant along t = (x − y)·cos45 — lines run "\"-wise at the
     28px css pitch */
  float t = (p.x - p.y + warp.x - warp.y) / 1.41421356;
  float s = mod(t, pitch);
  float line = step(s, lw);
  vec3 hatchPaint = mix(vec3(0.949, 0.961, 0.922), vec3(0.878, 0.894, 0.847), line);

  if (surface > 0.0) {
    // (the cluster/shading passes — unchanged — live inside the
    // surface branch so the hatch stays cheap where the liquid is not
    vec2  centers[6];
    vec3  tones[6];
    float contributions[6];
    float totalContribution = 0.0;

    for (int i = 0; i < BLOB_COUNT; i++) {
      centers[i] = blobPosition(i, time);
      tones[i] = u_colors[i];
      float dist = distance(st, centers[i]);
      contributions[i] = 0.0085 / (dist * dist);
      totalContribution += contributions[i];
    }

    vec2 pixelClusterCenter = vec2(0.0);
    float clusterWeight = 0.0;

    for (int i = 0; i < BLOB_COUNT; i++) {
      vec2  clusterCentroid = vec2(0.0);
      float clusterMass     = 0.0;

      for (int j = 0; j < BLOB_COUNT; j++) {
        float separation = distance(centers[i], centers[j]);
        float clusterInfluence = 1.0 - smoothstep(0.0, CLUSTER_RADIUS, separation);
        clusterCentroid += centers[j] * contributions[j] * clusterInfluence;
        clusterMass     += contributions[j] * clusterInfluence;
      }

      clusterCentroid /= clusterMass;
      pixelClusterCenter += clusterCentroid * contributions[i];
      clusterWeight      += contributions[i];
    }

    pixelClusterCenter /= clusterWeight;

    vec3 colorWeighted = vec3(0.0);
    for (int i = 0; i < BLOB_COUNT; i++) {
      colorWeighted += tones[i] * contributions[i];
    }
    colorWeighted /= totalContribution;

    float distFromCenter = distance(st, pixelClusterCenter);
    float normalizedDist = clamp(distFromCenter / 0.18, 0.0, 1.0);
    float highlight = 1.0 - smoothstep(0.0, 1.0, normalizedDist);
    highlight = pow(highlight, 1.8);
    float shadow = smoothstep(0.4, 1.0, normalizedDist) * 0.25;

    vec3 baseColor      = colorWeighted;
    vec3 paperColor     = vec3(0.949, 0.961, 0.922); // #F2F5EB
    vec3 highlightColor = mix(baseColor, paperColor, 0.55);
    vec3 shadowColor    = baseColor * 0.85;

    vec3 finalColor = mix(baseColor, highlightColor, highlight);
    finalColor      = mix(finalColor, shadowColor, shadow);

    // the liquid composites over the hatch with the print's ORIGINAL
    // softness (surface * 0.6 — the old alpha read): the refraction's
    // the point — the lines stay VISIBLE through the liquid, bent by
    // the lens, not buried under its fill
    gl_FragColor = vec4(mix(hatchPaint, finalColor, surface * 0.6), 1.0);
    return;
  }

  gl_FragColor = vec4(hatchPaint, 1.0);
}
`;


  // ---------------------------------------------------------------------------
  // CSS fallback — shown when WebGL is unavailable
  // Approximates the lava lamp look using CSS radial gradients and animation.
  // No GPU required — runs entirely on the CPU via the browser's compositor.
  // ---------------------------------------------------------------------------

  const FALLBACK_STYLE = `
    @keyframes lava-drift-1 {
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      33%       { transform: translate(15%, -20%) scale(1.1); }
      66%       { transform: translate(-10%, 15%) scale(0.95); }
    }
    @keyframes lava-drift-2 {
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      33%       { transform: translate(-20%, 10%) scale(0.9); }
      66%       { transform: translate(10%, -15%) scale(1.15); }
    }
    @keyframes lava-drift-3 {
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      50%       { transform: translate(20%, 20%) scale(1.05); }
    }
    /* PAINT-EXCEPTION (signed-off 2026-10-26): the lava blobs are the one
       sanctioned soft paint. Blur and alpha print the drifting colour field;
       every other layer stays solid. The WebGL path is unaffected by this
       fallback's blur — it paints its own canvas. */
    .lava-lamp-background__fallback-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.5;
  }
`;

interface CssFallbackProps {
  color?: string;
  palette?: string[];
}

function CssFallback({ color, palette }: CssFallbackProps) {
  // Inject the keyframe styles once
  useEffect(() => {
    if (document.getElementById('lava-fallback-styles')) return;
    const style = document.createElement('style');
    style.id = 'lava-fallback-styles';
    style.textContent = FALLBACK_STYLE;
    document.head.appendChild(style);
  }, []);

  const tones = palette ?? DESIGN_PALETTE;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', background: LINE_GROUND }}>
      {(color ? [color, color, color] : tones).slice(0, 6).map((hex, i) => (
        <div
          key={i}
          class="lava-lamp-background__fallback-blob"
          style={{
            width: `${55 - i * 5}vw`,
            height: `${55 - i * 5}vw`,
            background: hex,
            top: `${8 + (i % 3) * 30}%`,
            left: `${15 + (i * 17) % 65}%`,
            /* PAINT-EXCEPTION (signed-off 2026-10-26): the lava blobs are the
               one sanctioned soft paint. This opacity prints the drifting
               colour field; every other layer stays solid. The WebGL path is
               unaffected — this is the CSS fallback's blob map. */
            opacity: 0.55,
            animation: `lava-drift-${(i % 3) + 1} ${13 + i}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

// the new-design ink set — the blobs print in these (crimson carrying,
// the fluro/violet/ink as the other tones; judged against the mocks'
// plates so the lamp doesn't fight the teal/crimson bubbles)
const DESIGN_PALETTE = ['#A6022A', '#14F1C8', '#5A1FCC', '#0D0221', '#A6022A', '#14F1C8'];

// the ground also carries the 45deg hairline hatch (Eliot's repeating
// diagonal lines over the lamp's light — solid 1px paints both sides of
// the hard stop, no alpha). The paper tone fills the gaps so the lamp's
// blobs still read as prints ON this ground
const LINE_GROUND = `repeating-linear-gradient(45deg, #E0E4D8 0px, #E0E4D8 1px, #F2F5EB 1px, #F2F5EB 28px)`;

interface LavaLampBackgroundProps {
  color?: string;
  palette?: string[];
  /**
   * the lava blobs (the WebGL canvas layer). The component's two layers
   * split here: the line-hatch GROUND (LINE_GROUND) always paints
   * site-wide, but the blobs are opt-in per route — app.tsx wires them
   * on for /projects, /projects/:id and /chat. When false the canvas is
   * never created (no WebGL context, no loop, no GPU work).
   */
  lamp?: boolean;
}

export function LavaLampBackground({ color, palette, lamp = false }: LavaLampBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const locationsRef = useRef<UniformLocations | null>(null);
  const startTimeRef = useRef<number>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const webglSupportedRef = useRef(true);

  useEffect(() => {
    // the blobs are opt-in: off, no canvas is created and the loop never
    // runs — the fixed ground (the line hatch, painted below) is all
    // this layer needs
    if (!lamp) return;

    const container = containerRef.current;
    if (!container) return;

    // one tone per blob — the palette (or the legacy single `color`)
    const tones: string[] = (palette && palette.length >= 6 ? palette : DESIGN_PALETTE)
      .map((c) => (color ? color : c));
    const toneGl = new Float32Array(18);
    tones.forEach((hex, i) => {
      const gl3 = hexToGlColor(hex);
      toneGl[i * 3] = gl3.r;
      toneGl[i * 3 + 1] = gl3.g;
      toneGl[i * 3 + 2] = gl3.b;
    });

    // --- Create canvas and attempt WebGL context ---
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    // preserveDrawingBuffer: the frame keeps its pixels readable after
    // the pass (screenshots/pixel probes) — the paint never doubles
    // because the loop redraws every frame anyway
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true });

    // If WebGL isn't available, mark it and bail out.
    // The render below will switch to CssFallback.
    if (!gl) {
      webglSupportedRef.current = false;
      container.removeChild(canvas);
      return;
    }

    glRef.current = gl;

    // Narrow-once locals: the guard's narrowing doesn't survive into the
    // closures below, and these consts are the boundary (no casts, no
    // re-checks — typescript.md's "narrow once at the boundary")
    const glCtx = gl;
    const view = container;

    // Enable alpha blending so transparent fragments show the page behind
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // --- Compile and link shaders ---
    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = createProgram(gl, vertShader, fragShader);
    if (!program) return;

    gl.useProgram(program);

    createFullscreenQuad(gl, program);

    const locations = getUniformLocations(gl, program);
    if (!locations) return;
    // Narrow-once local, the same boundary as glCtx/view above: the
    // hoisted animate() closure sees the pre-guard type (typescript.md)
    const uniformLocations = locations;
    locationsRef.current = uniformLocations;

    startTimeRef.current = performance.now();

    // --- Animation loop ---
    function animate() {
      frameRef.current = requestAnimationFrame(animate);

      // Elapsed time in seconds, scaled way down for slow lava movement;
      // reduced motion freezes the liquid at its first pose (the clock
      // parks at zero — the loop still renders the static frame)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const startedAt = startTimeRef.current ?? performance.now();
      let time = ((performance.now() - startedAt) / 1000) * 0.18;
      if (reduced) time = 0;

      glCtx.viewport(0, 0, canvas.width, canvas.height);
      setUniforms(glCtx, uniformLocations, time, canvas.width, canvas.height, window.devicePixelRatio || 1, toneGl);
      draw(glCtx);
    }
    animate();

    // --- Resize handler ---
    function onResize() {
      canvas.width = view.clientWidth;
      canvas.height = view.clientHeight;
      glCtx.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', onResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);
      if (container && canvas && container.contains(canvas)) container.removeChild(canvas);
    };
  }, [color, palette, lamp]);

  // If WebGL failed, render the CSS fallback instead (blobs only — the
  // lamp layer; the ground keeps its paint either way)
  if (lamp && !webglSupportedRef.current) {
    return <CssFallback color={color} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', background: LINE_GROUND }}
      aria-hidden="true"
    />
  );
}
