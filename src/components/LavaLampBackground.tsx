import { useEffect, useRef } from 'preact/hooks';
import { JSX } from 'preact';

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
  u_color: WebGLUniformLocation;
}

function getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): UniformLocations {
  return {
    u_time:       gl.getUniformLocation(program, 'u_time')!,
    u_resolution: gl.getUniformLocation(program, 'u_resolution')!,
    u_color:      gl.getUniformLocation(program, 'u_color')!,
  };
}

function setUniforms(
  gl: WebGLRenderingContext,
  locations: UniformLocations,
  time: number,
  width: number,
  height: number,
  color: { r: number; g: number; b: number }
) {
  gl.uniform1f(locations.u_time, time);
  gl.uniform2f(locations.u_resolution, width, height);
  gl.uniform3f(locations.u_color, color.r, color.g, color.b);
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
uniform vec3 u_color;

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
    field += 0.012 / (dist * dist);
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

  if (surface <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // -------------------------------------------------------------------------
  // Pass 1: compute a cluster-weighted centroid
  //
  // For each blob i, we find its "cluster center" by averaging the positions
  // of all blobs j that are within CLUSTER_RADIUS of blob i, weighted by
  // how much each blob j contributes to the current pixel.
  //
  // Then we average all those per-blob cluster centers, weighted again by
  // each blob i's contribution to the current pixel.
  // This means blobs that barely reach this pixel have little influence on
  // where the highlight lands.
  // -------------------------------------------------------------------------

  // Precompute each blob's position and its contribution to this pixel
  vec2  centers[6];
  float contributions[6];
  float totalContribution = 0.0;

  for (int i = 0; i < BLOB_COUNT; i++) {
    centers[i] = blobPosition(i, time);
    float dist = distance(st, centers[i]);
    // Same falloff as the field — blobs close to this pixel contribute more
    contributions[i] = 0.012 / (dist * dist);
    totalContribution += contributions[i];
  }

  // For each blob, find its cluster centroid
  vec2 pixelClusterCenter = vec2(0.0);
  float clusterWeight = 0.0;

  for (int i = 0; i < BLOB_COUNT; i++) {
    // Find the weighted center of blob i's cluster
    vec2  clusterCentroid = vec2(0.0);
    float clusterMass     = 0.0;

    for (int j = 0; j < BLOB_COUNT; j++) {
      float separation = distance(centers[i], centers[j]);

      // Replace the hard if-check with a smooth weight that fades to zero
      // at CLUSTER_RADIUS. Blobs far away contribute almost nothing,
      // blobs close together contribute fully — no snapping.
      float clusterInfluence = 1.0 - smoothstep(0.0, CLUSTER_RADIUS, separation);

      clusterCentroid += centers[j] * contributions[j] * clusterInfluence;
      clusterMass     += contributions[j] * clusterInfluence;
    }

    clusterCentroid /= clusterMass;

    // Accumulate this blob's cluster centroid into the pixel's final centroid,
    // weighted by how much blob i itself contributes to this pixel
    pixelClusterCenter += clusterCentroid * contributions[i];
    clusterWeight      += contributions[i];
  }

  pixelClusterCenter /= clusterWeight;

  // -------------------------------------------------------------------------
  // Pass 2: shade based on distance from the cluster center
  //
  // Close to center  → bright highlight (glow fades outward)
  // Far from center  → slightly darker than base (subsurface shadow)
  // -------------------------------------------------------------------------

  float distFromCenter = distance(st, pixelClusterCenter);

  // Normalize distance — 0.0 at center, 1.0 at a "full blob radius" away.
  // 0.18 is the approximate radius in aspect-corrected UV space — tune this
  // if the highlight feels too wide or too tight.
  float normalizedDist = clamp(distFromCenter / 0.18, 0.0, 1.0);

  // Highlight: strong at center, fades with a smooth curve outward
  // smoothstep gives a more organic falloff than linear
  float highlight = 1.0 - smoothstep(0.0, 1.0, normalizedDist);
  highlight = pow(highlight, 1.8); // shape the falloff curve — higher = tighter

  // Shadow: slight darkening at the far edges
  // Only kicks in past the midpoint of the blob
  float shadow = smoothstep(0.4, 1.0, normalizedDist) * 0.25;

  vec3 baseColor      = u_color;
  vec3 highlightColor = mix(baseColor, vec3(1.0), 0.55); // brightened toward white
   vec3 shadowColor    = baseColor * 0.65;                 // darkened version of base

  // Blend: highlight in center, base in middle, shadow at edges
  vec3 finalColor = mix(baseColor, highlightColor, highlight);
  finalColor      = mix(finalColor, shadowColor, shadow);

  gl_FragColor = vec4(finalColor, surface);
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
    .lava-fallback-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.5;
  }
`;

interface CssFallbackProps {
  color: string;
}

function CssFallback({ color }: CssFallbackProps) {
  // Inject the keyframe styles once
  useEffect(() => {
    if (document.getElementById('lava-fallback-styles')) return;
    const style = document.createElement('style');
    style.id = 'lava-fallback-styles';
    style.textContent = FALLBACK_STYLE;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', background: '#FDFFFC' }}>
      <div class="lava-fallback-blob" style={{
        width: '60vw', height: '60vw',
        background: color,
        top: '10%', left: '20%',
        animation: 'lava-drift-1 14s ease-in-out infinite',
      }} />
      <div class="lava-fallback-blob" style={{
        width: '50vw', height: '50vw',
        background: color,
        top: '40%', left: '50%',
        animation: 'lava-drift-2 18s ease-in-out infinite',
      }} />
      <div class="lava-fallback-blob" style={{
        width: '40vw', height: '40vw',
        background: color,
        top: '60%', left: '10%',
        animation: 'lava-drift-3 12s ease-in-out infinite',
      }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface LavaLampBackgroundProps {
  color?: string;
  split?: boolean;
}

export function LavaLampBackground({ color = '#637561', split = false }: LavaLampBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const locationsRef = useRef<UniformLocations | null>(null);
  const startTimeRef = useRef<number>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const glRightRef = useRef<WebGLRenderingContext | null>(null);
  const webglSupportedRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Create canvas and attempt WebGL context ---
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });

    // If WebGL isn't available, mark it and bail out.
    // The render below will switch to CssFallback.
    if (!gl) {
      webglSupportedRef.current = false;
      container.removeChild(canvas);
      return;
    }

    glRef.current = gl;

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
    locationsRef.current = locations;

    startTimeRef.current = performance.now();

    // --- Animation loop ---
    function animate() {
      frameRef.current = requestAnimationFrame(animate);

      // Elapsed time in seconds, scaled way down for slow lava movement
      const time = (performance.now() - startTimeRef.current!) / 1000 * 0.18;
      const glColor = hexToGlColor(color);

      // @ts-ignore - gl is checked for null above
      gl.viewport(0, 0, canvas.width, canvas.height);
      // @ts-ignore - gl is checked for null above
      setUniforms(gl, locations, time, canvas.width, canvas.height, glColor);
      // @ts-ignore - gl is checked for null above
      draw(gl);
    }
    animate();

    // --- Resize handler ---
    function onResize() {
      // @ts-ignore - container is checked in closure
      canvas.width = container.clientWidth;
      // @ts-ignore - container is checked in closure
      canvas.height = container.clientHeight;
      // @ts-ignore - gl is checked for null above
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', onResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);
      if (container && canvas && container.contains(canvas)) container.removeChild(canvas);
    };
  }, [color]);

  // If WebGL failed, render the CSS fallback instead
  if (!webglSupportedRef.current) {
    return <CssFallback color={color} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden' }}
      aria-hidden="true"
    />
  );
}
