import type { ContentType } from "@repo/common/config";
import type { ContentWithTags } from "../../types/global";

export interface GraphNode {
  id: string;
  title: string;
  type: ContentType;
  tags: string[];
  createdAt: number;
  /** number of filaments touching this node */
  degree: number;
}

export interface GraphLink {
  source: string;
  target: string;
  /** how many tags the two memories share */
  shared: number;
}

const titleOf = (m: ContentWithTags) =>
  m.title?.trim() ||
  m.note?.contentData?.trim().slice(0, 60) ||
  m.link?.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] ||
  "Untitled";

/**
 * Turn memories into a network. Memories that share a tag are joined by a
 * filament. Per tag, members are chained in date order and each is also
 * joined to the tag's first memory, so big tags form a fan, not a clique.
 */
export function buildGraph(memories: ContentWithTags[]) {
  const nodes: GraphNode[] = memories.map((m) => ({
    id: m.id,
    title: titleOf(m),
    type: m.type,
    tags: m.contentTags.map((t) => t.tag.title),
    createdAt: new Date(m.createdAt).getTime(),
    degree: 0,
  }));

  const byTag = new Map<string, GraphNode[]>();
  for (const n of nodes) {
    for (const t of n.tags) {
      const list = byTag.get(t) ?? [];
      list.push(n);
      byTag.set(t, list);
    }
  }

  const links = new Map<string, GraphLink>();
  const join = (a: GraphNode, b: GraphNode) => {
    if (a.id === b.id) return;
    const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
    const existing = links.get(key);
    if (existing) {
      existing.shared += 1;
      return;
    }
    links.set(key, { source: a.id, target: b.id, shared: 1 });
    a.degree += 1;
    b.degree += 1;
  };

  for (const members of byTag.values()) {
    if (members.length < 2) continue;
    const sorted = [...members].sort((a, b) => a.createdAt - b.createdAt);
    const hub = sorted[0]!;
    sorted.forEach((n, i) => {
      if (i === 0) return;
      join(sorted[i - 1]!, n);
      if (i > 1 && sorted.length <= 30) join(hub, n);
    });
  }

  // Count tags so the sidebar can list the busiest ones.
  const tagCounts = [...byTag.entries()]
    .map(([tag, list]) => ({ tag, count: list.length }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  return { nodes, links: [...links.values()], tagCounts };
}
