"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MinusIcon, PlusIcon, ScanIcon } from "lucide-react";
import type { ContentWithTags } from "../../types/global";
import { useAppStore } from "lib/store/store";
import { navItems } from "lib/constants/navBarItems";
import { buildGraph } from "lib/graph/buildGraph";
import { layoutGraph, type PlacedNode } from "lib/graph/layoutGraph";
import { TYPE_META } from "../TypeIcon";
import RecallPulse from "./RecallPulse";

type View = { k: number; x: number; y: number };
const IDENTITY: View = { k: 1, x: 0, y: 0 };
const MIN_K = 0.5;
const MAX_K = 4;

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** Pick the nearest node roughly in the arrow key's direction. */
function neighbour(from: PlacedNode, nodes: PlacedNode[], key: string) {
  const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[key];
  if (!dir) return null;
  let best: PlacedNode | null = null;
  let bestScore = Infinity;
  for (const n of nodes) {
    if (n.id === from.id) continue;
    const dx = n.x - from.x;
    const dy = n.y - from.y;
    const along = dx * dir[0]! + dy * dir[1]!;
    if (along <= 0) continue;
    const across = Math.abs(dx * dir[1]! - dy * dir[0]!);
    const score = along + across * 2;
    if (score < bestScore) {
      bestScore = score;
      best = n;
    }
  }
  return best;
}

export default function MemoryMap({ memories }: { memories: ContentWithTags[] }) {
  const {
    memoryTypeSelectedView,
    activeTag,
    citedContentIds,
    selectedMemoryId,
    setSelectedMemoryId,
  } = useAppStore();

  const graph = useMemo(() => buildGraph(memories), [memories]);
  const layout = useMemo(() => layoutGraph(graph.nodes, graph.links), [graph]);
  const byId = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout]);
  const { bounds } = layout;

  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const [view, setView] = useState<View>(IDENTITY);
  const [fit, setFit] = useState(1); // screen px per world unit at k = 1
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playKey, setPlayKey] = useState(0);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  // Track how big the map is on screen, to keep labels and strokes a steady size.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setFit(Math.min(width / bounds.width, height / bounds.height) || 1);
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, [bounds.width, bounds.height]);

  const px = 1 / (view.k * fit); // one screen pixel, in world units

  // Filters dim instead of hide, so the shape of the brain stays.
  const viewType = navItems.find((n) => n.key === memoryTypeSelectedView)?.type ?? null;
  const cited = useMemo(() => new Set(citedContentIds), [citedContentIds]);
  const focusSet = useMemo(() => {
    if (cited.size) return cited;
    if (!viewType && !activeTag) return null;
    return new Set(
      layout.nodes
        .filter((n) => (!viewType || n.type === viewType) && (!activeTag || n.tags.includes(activeTag)))
        .map((n) => n.id)
    );
  }, [cited, viewType, activeTag, layout.nodes]);

  // A new answer: show the whole brain and replay the pulse.
  useEffect(() => {
    if (!citedContentIds.length) return;
    setView(IDENTITY);
    setPlayKey((k) => k + 1);
  }, [citedContentIds]);

  // --- pan & zoom -------------------------------------------------------
  const toWorld = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: 0, y: 0 };
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }, []);

  const zoomAt = useCallback((factor: number, at: { x: number; y: number }) => {
    setView((v) => {
      const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor));
      const qx = (at.x - v.x) / v.k;
      const qy = (at.y - v.y) / v.k;
      return { k, x: at.x - qx * k, y: at.y - qy * k };
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // Only zoom with Ctrl/⌘ (trackpad pinch sends ctrlKey), so the page still scrolls.
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomAt(Math.exp(-e.deltaY * 0.0025), toWorld(e.clientX, e.clientY));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomAt, toWorld]);

  const centre = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest("[data-node]")) return;
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    setView((v) => ({ ...v, x: d.vx + (e.clientX - d.x) / fit, y: d.vy + (e.clientY - d.y) / fit }));
  };
  const endDrag = () => {
    drag.current = null;
  };

  // --- keyboard ---------------------------------------------------------
  const rovingId = activeId ?? selectedMemoryId ?? layout.nodes[0]?.id ?? null;
  const onNodeKey = (e: React.KeyboardEvent, node: PlacedNode) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedMemoryId(node.id);
      return;
    }
    const next = neighbour(node, layout.nodes, e.key);
    if (next) {
      e.preventDefault();
      setActiveId(next.id);
      nodeRefs.current.get(next.id)?.focus();
    }
  };

  const showAllLabels = layout.nodes.length <= 14 || view.k >= 1.8;
  const labelSize = 12.5 * px;
  const origin = { x: centre.x, y: bounds.y + 8 };
  const recalled = citedContentIds.map((id) => byId.get(id)).filter((n): n is PlacedNode => !!n);

  return (
    <div className="relative h-[52vh] min-h-[320px] sm:min-h-[440px] rounded-[24px] border border-fold bg-tissue recall-map-field overflow-hidden">
      <svg
        ref={svgRef}
        viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
        className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
        role="group"
        aria-label={`Map of your ${layout.nodes.length} memories. Use arrow keys to move between memories and Enter to open one.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          {/* regions */}
          {layout.regions.map((r) => (
            <text
              key={r.type}
              x={r.x}
              y={r.y}
              textAnchor="middle"
              fontSize={13 * px}
              className="font-display font-semibold fill-dim"
              opacity={focusSet ? 0.4 : 0.8}
            >
              {TYPE_META[r.type].plural}
            </text>
          ))}

          {/* filaments */}
          {graph.links.map((l) => {
            const a = byId.get(l.source);
            const b = byId.get(l.target);
            if (!a || !b) return null;
            const lit = !focusSet || (focusSet.has(a.id) && focusSet.has(b.id));
            const touched = hovered === a.id || hovered === b.id;
            return (
              <line
                key={`${l.source}|${l.target}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={touched ? "var(--ink)" : "var(--fold)"}
                strokeWidth={1 + Math.min(l.shared, 3) * 0.6}
                vectorEffect="non-scaling-stroke"
                opacity={lit ? (touched ? 0.7 : 1) : 0.15}
              />
            );
          })}

          {/* recall */}
          {recalled.length > 0 && (
            <RecallPulse origin={origin} targets={recalled} playKey={playKey} />
          )}

          {/* memories */}
          {layout.nodes.map((n) => {
            const dim = focusSet ? !focusSet.has(n.id) : false;
            const isCited = cited.has(n.id);
            const isSelected = selectedMemoryId === n.id;
            const label =
              hovered === n.id || isSelected || isCited || (showAllLabels && !dim);
            return (
              <g
                key={n.id}
                data-node
                ref={(el) => {
                  if (el) nodeRefs.current.set(n.id, el);
                  else nodeRefs.current.delete(n.id);
                }}
                transform={`translate(${n.x} ${n.y})`}
                role="button"
                tabIndex={rovingId === n.id ? 0 : -1}
                aria-label={`${n.title}, ${TYPE_META[n.type].label}${isCited ? ", recalled" : ""}`}
                aria-current={isSelected ? "true" : undefined}
                className="cursor-pointer outline-none group"
                onClick={() => setSelectedMemoryId(n.id)}
                onKeyDown={(e) => onNodeKey(e, n)}
                onFocus={() => {
                  setActiveId(n.id);
                  setHovered(n.id);
                }}
                onBlur={() => setHovered(null)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* larger invisible hit area */}
                <circle r={n.r + 8} fill="transparent" />
                {isSelected && (
                  <circle r={n.r + 5} fill="none" stroke="var(--ink)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                )}
                <circle
                  r={n.r}
                  fill={`var(--type-${n.type})`}
                  fillOpacity={dim ? 0.22 : 1}
                  stroke="var(--tissue)"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
                {/* keyboard focus ring */}
                <circle
                  r={n.r + 5}
                  fill="none"
                  stroke="var(--recall)"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  className="opacity-0 group-focus-visible:opacity-100"
                />
                {label && (
                  <text
                    y={n.r + 16 * px}
                    textAnchor="middle"
                    fontSize={labelSize}
                    fontWeight={isCited || isSelected ? 700 : 500}
                    fill="var(--ink)"
                    stroke="var(--tissue)"
                    strokeWidth={4 * px}
                    paintOrder="stroke"
                    strokeLinejoin="round"
                    pointerEvents="none"
                  >
                    {clip(n.title, 30)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <p className="absolute left-4 bottom-3 text-[12px] text-dim pointer-events-none hidden sm:block">
        Drag to move around. Ctrl + scroll to zoom.
      </p>
      <div className="absolute right-3 bottom-3 flex flex-col gap-1 rounded-[14px] border border-fold bg-tissue p-1">
        {[
          { label: "Zoom in", icon: PlusIcon, act: () => zoomAt(1.3, centre) },
          { label: "Zoom out", icon: MinusIcon, act: () => zoomAt(1 / 1.3, centre) },
          { label: "Fit whole map", icon: ScanIcon, act: () => setView(IDENTITY) },
        ].map(({ label, icon: Icon, act }) => (
          <button
            key={label}
            type="button"
            onClick={act}
            aria-label={label}
            title={label}
            className="size-8 grid place-items-center rounded-[10px] text-dim hover:text-ink hover:bg-ink/[0.06] cursor-pointer"
          >
            <Icon className="size-4" strokeWidth={2} />
          </button>
        ))}
      </div>
    </div>
  );
}
