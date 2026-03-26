"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; z: number };
type Anchor = Point & { id: string; color: string };
const TAU = Math.PI * 2;
function surface(latitude: number, arc: number): Point {
  const fold = 1 + 0.045 * Math.sin(arc * 7 + latitude * 6)
    + 0.028 * Math.cos(arc * 13 - latitude * 5);
  const radius = Math.sin(latitude) * fold;
  return {
    x: Math.cos(arc) * radius * 1.06,
    y: Math.cos(latitude) * 0.94,
    z: Math.sin(arc) * radius * 0.9,
  };
}

const anchors: Anchor[] = [
  { id: "talk", latitude: 2.12, arc: 2.42, color: "#ff9d9d" },
  { id: "log", latitude: 1.16, arc: 2.04, color: "#ffd287" },
  { id: "focus", latitude: 1.01, arc: 2.65, color: "#8aaeff" },
  { id: "guide", latitude: 2.02, arc: 1.17, color: "#bd9cff" },
  { id: "paper", latitude: 1.38, arc: 0.68, color: "#a0ffd7" },
  { id: "cards", latitude: 0.79, arc: 1.32, color: "#ffd287" },
].map(({ id, latitude, arc, color }) => ({ ...surface(latitude, arc), id, color }));

function makeNetwork() {
  const points: Point[] = [];
  const edges: [number, number][] = [];
  const rings = 22;
  const segments = 72;

  for (let ring = 0; ring < rings; ring++) {
    const latitude = Math.PI * (ring + 0.5) / rings;
    const start = ring * segments;
    for (let segment = 0; segment < segments; segment++) {
      const arc = TAU * segment / segments + ring * 0.075;
      const index = start + segment;
      points.push(surface(latitude, arc));
      edges.push([index, start + (segment + 1) % segments]);
      if (ring > 0 && segment % 3 === 0) {
        edges.push([index, index - segments]);
      }
      if (ring % 2 === 1 && segment % 7 === 0) {
        edges.push([index, start - segments + (segment + 3) % segments]);
      }
    }
  }

  return { points, edges };
}

const network = makeNetwork();
export const RECALL_DURATION = 2000;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function NeuralSculpture({
  sources,
  selected,
  started,
  still,
}: {
  sources: readonly string[];
  selected: string | null;
  started: number | null;
  still: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ sources, selected, started });
  const invalidate = useRef<(() => void) | null>(null);

  useEffect(() => {
    state.current = { sources, selected, started };
    invalidate.current?.();
  }, [sources, selected, started]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !window.ResizeObserver || !window.IntersectionObserver) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let width = 0;
    let height = 0;
    let scale = 1;
    let pointerX = 0;
    let pointerY = 0;
    let tiltX = 0;
    let tiltY = 0;

    function schedule() {
      if (visible && !document.hidden && !frame) frame = requestAnimationFrame(render);
    }

    function redraw() {
      schedule();
    }

    function render(time: number) {
      frame = 0;
      if (!context || !canvas || !width || !height || !visible || document.hidden) return;
      const calm = still || preference.matches;
      const { sources, selected, started } = state.current;
      const elapsed = calm || started === null ? RECALL_DURATION : time - started;
      const active = elapsed < RECALL_DURATION;
      tiltX += (pointerX - tiltX) * 0.075;
      tiltY += (pointerY - tiltY) * 0.075;
      const yaw = -0.22 + (calm ? 0 : tiltX * 0.24 + Math.sin(time / 4900) * 0.085);
      const pitch = 0.6 + (calm ? 0 : tiltY * 0.16);
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      const size = Math.min(width / 3.03, height / 2.36);
      const center = { x: width / 2, y: height * 0.49 };
      const project = (point: Point) => {
        const x = point.x * cosYaw + point.z * sinYaw;
        const depth = point.z * cosYaw - point.x * sinYaw;
        const y = point.y * cosPitch - depth * sinPitch;
        const z = point.y * sinPitch + depth * cosPitch;
        const perspective = 4.5 / (4.5 - z);
        return { x: center.x + x * size * perspective, y: center.y + y * size * perspective, z };
      };

      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, width, height);
      const projected = network.points.map(project);
      context.lineWidth = 0.65;
      for (let layer = 0; layer < 4; layer++) {
        context.beginPath();
        for (const [from, to] of network.edges) {
          const a = projected[from]!;
          const b = projected[to]!;
          const depth = Math.min(3, Math.floor(clamp((a.z + b.z + 2.4) / 4.8) * 4));
          if (depth !== layer) continue;
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
        }
        context.strokeStyle = `rgba(117,218,189,${0.075 + layer * 0.095})`;
        context.stroke();
      }

      for (const [index, point] of projected.entries()) {
        const light = clamp((point.z + 1) / 2);
        const shimmer = calm ? 0.7 : 0.65 + Math.sin(index * 1.7 + time / 850) * 0.32;
        context.fillStyle = `rgba(170,255,224,${(0.14 + light * 0.62) * shimmer})`;
        const radius = index % 17 === 0 ? 1.35 : 0.7;
        context.fillRect(point.x, point.y, radius, radius);
      }

      const input = { x: center.x, y: height * 0.05 };
      const output = { x: center.x, y: height * 0.9 };
      for (const anchor of anchors) {
        const point = project(anchor);
        const matches = sources.includes(anchor.id);
        const recalled = matches && elapsed >= 560;
        const focused = selected === anchor.id;

        if (recalled && !active) {
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.quadraticCurveTo(point.x, output.y, output.x, output.y);
          context.strokeStyle = anchor.color + (focused ? "ae" : "4d");
          context.lineWidth = focused ? 1.5 : 0.8;
          context.stroke();
        }

        if (matches && active && !calm) {
          const returning = elapsed >= 950;
          const from = returning ? point : input;
          const to = returning ? output : point;
          const progress = clamp(returning ? (elapsed - 950) / 690 : elapsed / 620);
          if (progress > 0 && progress < 1) {
            const x = from.x + (to.x - from.x) * progress;
            const y = from.y + (to.y - from.y) * progress;
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(x, y);
            context.strokeStyle = "#9efbd6af";
            context.lineWidth = 1.3;
            context.stroke();
            context.fillStyle = "#e1fff4";
            context.fillRect(x - 2, y - 2, 4, 4);
          }
        }

        const radius = focused ? 31 : recalled ? 21 : 10;
        const glow = context.createRadialGradient(point.x, point.y, 1, point.x, point.y, radius);
        glow.addColorStop(0, anchor.color + (recalled ? "b0" : "55"));
        glow.addColorStop(1, anchor.color + "00");
        context.fillStyle = glow;
        context.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
        context.beginPath();
        context.arc(point.x, point.y, focused ? 7 : recalled ? 4.5 : 2.5, 0, TAU);
        context.fillStyle = anchor.color;
        context.fill();
        if (recalled) {
          context.beginPath();
          context.arc(point.x, point.y, focused ? 15 : 10, 0, TAU);
          context.strokeStyle = anchor.color + "ae";
          context.lineWidth = 1;
          context.stroke();
        }
      }

      canvas.dataset.ready = "true";
      if (!calm || active) schedule();
    }

    const resize = new ResizeObserver(([entry]) => {
      if (!entry) return;
      ({ width, height } = entry.contentRect);
      scale = Math.min(window.devicePixelRatio || 1, 1.6, 1500 / Math.max(width, height, 1));
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      redraw();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) redraw();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || still || preference.matches) return;
      const box = canvas.getBoundingClientRect();
      pointerX = (event.clientX - box.left) / box.width - 0.5;
      pointerY = (event.clientY - box.top) / box.height - 0.5;
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };

    invalidate.current = redraw;
    resize.observe(canvas);
    intersection.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    preference.addEventListener("change", redraw);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      invalidate.current = null;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      preference.removeEventListener("change", redraw);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [still]);

  return (
    <div className="sculpture-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="sculpture-fallback">
        {anchors.map(({ id, x, y, color }) => (
          <i
            key={id}
            data-active={sources.includes(id) || undefined}
            data-selected={selected === id || undefined}
            style={{ left: `${50 + x * 27}%`, top: `${50 + y * 39}%`, color }}
          />
        ))}
      </div>
    </div>
  );
}
