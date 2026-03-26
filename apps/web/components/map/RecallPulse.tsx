/**
 * The recall moment, drawn inside an SVG: a line travels from `origin`
 * (where the question was asked) to each recalled node, then the node blooms.
 * Change `playKey` to replay. Reduced motion shows the end state (globals.css).
 */
export default function RecallPulse({
  origin,
  targets,
  playKey,
  scale = 1,
}: {
  origin: { x: number; y: number };
  targets: { id: string; x: number; y: number; r: number }[];
  playKey: string | number;
  /** keep stroke widths steady when the map is zoomed */
  scale?: number;
}) {
  return (
    <g key={playKey} aria-hidden pointerEvents="none">
      {targets.map((t, i) => {
        // a gentle curve, bowed sideways, like an axon rather than a ruler line
        const mx = (origin.x + t.x) / 2 + (t.x > origin.x ? -1 : 1) * 40;
        const my = (origin.y + t.y) / 2;
        const delay = i * 180;
        return (
          <g key={t.id}>
            <path
              d={`M${origin.x},${origin.y} Q${mx},${my} ${t.x},${t.y}`}
              pathLength={1}
              className="pulse-path"
              strokeWidth={2.2 / scale}
              opacity={0.85}
              style={{ "--len": 1, "--delay": `${delay}ms` } as React.CSSProperties}
            />
            <circle
              cx={t.x}
              cy={t.y}
              r={t.r + 9}
              fill="var(--recall)"
              opacity={0.18}
              className="node-bloom"
              style={{ "--delay": `${delay + 750}ms` } as React.CSSProperties}
            />
            <circle
              cx={t.x}
              cy={t.y}
              r={t.r + 4}
              fill="none"
              stroke="var(--recall)"
              strokeWidth={2 / scale}
              className="node-bloom"
              style={{ "--delay": `${delay + 750}ms` } as React.CSSProperties}
            />
          </g>
        );
      })}
    </g>
  );
}
