"use client";

import * as React from "react";

/**
 * The Alchemy Core.
 *
 * A translucent sculptural object with several streams of colour moving
 * through it — coral, gold, mint, blue, violet, pink — under a glass shell.
 * The colour is *in* the material rather than applied to it, which is what
 * separates this from a tinted sphere: two slow noise fields drive where each
 * hue sits, a fresnel rim and a specular highlight sell the glass, and the
 * whole thing is desaturated toward white where the light hits so it reads as
 * a premium product rather than a rainbow.
 *
 * Written against raw WebGL rather than a 3D library: the entire scene is one
 * fragment shader, so it costs roughly four kilobytes instead of the several
 * hundred an engine would add above the fold.
 *
 * Strictly an enhancement. It declines to run on small viewports, under
 * reduced motion, on low-core devices, or when the GPU refuses a context, and
 * parks itself when scrolled away or backgrounded. The CSS core underneath is
 * the fallback and the layout is identical either way.
 */

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec2 vUv;
uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uPointer;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

// The brand accents, in the order colour travels through the object.
vec3 palette(float t) {
  vec3 coral     = vec3(1.000, 0.353, 0.212);
  vec3 tangerine = vec3(1.000, 0.541, 0.239);
  vec3 gold      = vec3(1.000, 0.820, 0.400);
  vec3 mint      = vec3(0.220, 0.780, 0.647);
  vec3 blue      = vec3(0.357, 0.549, 1.000);
  vec3 violet    = vec3(0.486, 0.424, 1.000);
  vec3 pink      = vec3(1.000, 0.435, 0.682);

  // Six equal bands, wrapping back to coral so the loop is seamless.
  float s = fract(t) * 6.0;
  if (s < 1.0) return mix(coral, tangerine, s);
  if (s < 2.0) return mix(tangerine, gold, s - 1.0);
  if (s < 3.0) return mix(gold, mint, s - 2.0);
  if (s < 4.0) return mix(mint, blue, s - 3.0);
  if (s < 5.0) return mix(blue, violet, s - 4.0);
  return mix(violet, pink, s - 5.0);
}

void main() {
  vec2 uv = (vUv * uResolution - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

  // The core drifts a few pixels toward the pointer — depth, not a follow.
  vec2 centre = uPointer * 0.04;
  vec2 p = uv - centre;
  float r = length(p);

  float t = uTime * 0.05;

  // Two slow fields: one moves the colour bands, one distorts them so the
  // streams fold through each other like liquid rather than sliding past.
  float flow = fbm(p * 2.2 + vec2(t, -t * 0.6));
  float warp = fbm(p * 3.4 - vec2(t * 0.8, t * 0.5));

  // Sphere normal, used for lighting and for pushing colour around the form.
  float z = sqrt(max(0.0, 0.42 * 0.42 - r * r)) / 0.42;
  vec3 normal = normalize(vec3(p / 0.42, z));

  // Colour position: mostly the flow field, nudged by height so the bands
  // wrap over the surface instead of lying flat across it.
  float band = flow * 0.85 + warp * 0.35 + normal.y * 0.18 + t * 0.35;
  vec3 colour = palette(band);

  // Interior depth — darken toward the silhouette so it has volume.
  float depth = smoothstep(0.0, 1.0, z);
  colour *= mix(0.55, 1.0, depth);

  // Studio key light, up and to the left.
  vec3 lightDir = normalize(vec3(-0.45, 0.6, 0.75));
  float diffuse = max(0.0, dot(normal, lightDir));
  float spec = pow(max(0.0, dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0))), 26.0);

  // Desaturate toward white where the light lands. This is what keeps a
  // six-colour object looking like glass rather than a beach ball.
  colour = mix(colour, vec3(1.0), diffuse * 0.30 + spec * 0.75);

  // Fresnel rim, the main cue that the shell is glass.
  float fresnel = pow(1.0 - depth, 2.2);
  colour += vec3(1.0) * fresnel * 0.30;

  // Body mask plus a very soft outer bloom.
  float body = smoothstep(0.45, 0.40, r);
  float halo = smoothstep(0.86, 0.42, r) * 0.10;

  float alpha = clamp(body * 0.95 + halo, 0.0, 1.0);
  gl_FragColor = vec4(colour, alpha);
}
`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function CoreCanvas({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 1023px)").matches;
    const weak =
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency > 0 &&
      navigator.hardwareConcurrency < 4;

    if (reduced || small || weak) return;
    setActive(true);
  }, []);

  React.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null) ?? null;

    if (!gl) {
      setActive(false);
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();

    if (!vertex || !fragment || !program) {
      setActive(false);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setActive(false);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uPointer = gl.getUniformLocation(program, "uPointer");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Soft, low-frequency imagery — rendering it at 3× buys nothing visible.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      const width = Math.max(1, Math.floor(clientWidth * dpr));
      const height = Math.max(1, Math.floor(clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const pointer = { x: 0, y: 0 };
    const targetPointer = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetPointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    let onScreen = true;
    let frame = 0;
    const start = performance.now();

    const intersection = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry?.isIntersecting ?? false;
      },
      { threshold: 0 },
    );
    intersection.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible || !onScreen) return;

      pointer.x += (targetPointer.x - pointer.x) * 0.05;
      pointer.y += (targetPointer.y - pointer.y) * 0.05;

      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
