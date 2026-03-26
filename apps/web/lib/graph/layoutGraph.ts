import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";
import type { ContentType } from "@repo/common/config";
import type { GraphLink, GraphNode } from "./buildGraph";

export interface PlacedNode extends GraphNode {
  x: number;
  y: number;
  r: number;
}

export const TYPE_ORDER: ContentType[] = ["youtube", "link", "note", "document", "tweet"];

export const nodeRadius = (degree: number) => Math.min(6 + Math.sqrt(degree) * 2.6, 15);

/**
 * Place nodes once. Each content type pulls toward its own anchor on an
 * ellipse so the brain has regions; shared-tag filaments pull across them.
 * Runs synchronously (no animation) so the layout is stable between renders.
 */
export function layoutGraph(nodes: GraphNode[], links: GraphLink[]) {
  const spread = 140 + Math.sqrt(nodes.length) * 34;
  const anchors = new Map<ContentType, { x: number; y: number }>();
  TYPE_ORDER.forEach((type, i) => {
    const a = -Math.PI / 2 + (i / TYPE_ORDER.length) * Math.PI * 2;
    anchors.set(type, { x: Math.cos(a) * spread * 1.35, y: Math.sin(a) * spread });
  });

  type SimNode = PlacedNode & SimulationNodeDatum;
  const sim: SimNode[] = nodes.map((n, i) => {
    const anchor = anchors.get(n.type)!;
    // deterministic start near the anchor, so layouts don't jump between reloads
    const angle = i * 2.399963;
    const dist = 12 + (i % 7) * 9;
    return {
      ...n,
      r: nodeRadius(n.degree),
      x: anchor.x + Math.cos(angle) * dist,
      y: anchor.y + Math.sin(angle) * dist,
    };
  });

  const simLinks = links.map((l) => ({ ...l }));

  forceSimulation<SimNode>(sim)
    .force(
      "link",
      forceLink<SimNode, (typeof simLinks)[number]>(simLinks)
        .id((d) => d.id)
        .distance((l) => 70 - Math.min(l.shared, 3) * 10)
        .strength((l) => 0.12 + Math.min(l.shared, 3) * 0.08)
    )
    .force("charge", forceManyBody<SimNode>().strength(-110))
    .force("collide", forceCollide<SimNode>().radius((d) => d.r + 10))
    .force("x", forceX<SimNode>((d) => anchors.get(d.type)!.x).strength(0.07))
    .force("y", forceY<SimNode>((d) => anchors.get(d.type)!.y).strength(0.07))
    .stop()
    .tick(320);

  const placed: PlacedNode[] = sim.map(({ id, title, type, tags, createdAt, degree, x, y, r }) => ({
    id,
    title,
    type,
    tags,
    createdAt,
    degree,
    x: x ?? 0,
    y: y ?? 0,
    r,
  }));

  // Label each region above its most central member (the medoid), so the label
  // sits on a node even when tag links stretch a type across the map.
  const regions = TYPE_ORDER.map((type) => {
    const members = placed.filter((n) => n.type === type);
    if (!members.length) return null;
    let best = members[0]!;
    let bestSum = Infinity;
    for (const m of members) {
      const sum = members.reduce((s, o) => s + Math.hypot(o.x - m.x, o.y - m.y), 0);
      if (sum < bestSum) {
        bestSum = sum;
        best = m;
      }
    }
    return { type, x: best.x, y: best.y - best.r - 16, count: members.length };
  }).filter((r): r is NonNullable<typeof r> => r !== null);

  const pad = 60;
  const xs = placed.map((n) => n.x);
  const ys = placed.map((n) => n.y);
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys, ...regions.map((r) => r.y)) - pad;
  const maxY = Math.max(...ys) + pad;

  return {
    nodes: placed,
    regions,
    bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
  };
}
