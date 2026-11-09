const MONTHS = 12, W = 360, H = 92, TOP = 12, BOT = 4;

function monthly(posts) {
  const now = new Date();
  const buckets = Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
    return { key: d.getFullYear() * 12 + d.getMonth(), month: d.toLocaleString("en", { month: "short" }), v: 0 };
  });
  posts.forEach((p) => {
    const d = new Date(p.$createdAt);
    const b = buckets.find((x) => x.key === d.getFullYear() * 12 + d.getMonth());
    if (b) b.v++;
  });
  return buckets;
}

// Smooth curve through the points (Catmull-Rom converted to Bezier segments).
function curve(xs, ys) {
  const f = (v) => v.toFixed(1);
  const clamp = (y) => Math.min(H - BOT, Math.max(TOP - 4, y));
  const n = xs.length;
  let d = `M${f(xs[0])},${f(ys[0])}`;
  for (let i = 0; i < n - 1; i++) {
    const a = i ? i - 1 : i, b = i + 2 < n ? i + 2 : i + 1;
    d += ` C${f(xs[i] + (xs[i + 1] - xs[a]) / 6)},${f(clamp(ys[i] + (ys[i + 1] - ys[a]) / 6))} ${f(xs[i + 1] - (xs[b] - xs[i]) / 6)},${f(clamp(ys[i + 1] - (ys[b] - ys[i]) / 6))} ${f(xs[i + 1])},${f(ys[i + 1])}`;
  }
  return d;
}

function StoriesChart({ posts }) {
  const data = monthly(posts);
  const max = Math.max(1, ...data.map((b) => b.v));
  const step = W / data.length;
  const xs = data.map((_, i) => (i + 0.5) * step);
  const ys = data.map((b) => TOP + (1 - b.v / max) * (H - TOP - BOT));
  const line = curve(xs, ys);
  const last = data.length - 1;

  return (
    <div>
      <div className="border-b-2 border-ink">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label="Stories published per month over the last 12 months">
          {[0.25, 0.5, 0.75].map((t) => {
            const y = TOP + t * (H - TOP - BOT);
            return <line key={t} x1="0" x2={W} y1={y} y2={y} stroke="rgba(12,14,21,.16)" strokeDasharray="3 5" />;
          })}
          <path d={`${line} L${xs[last]},${H} L${xs[0]},${H} Z`} fill="rgba(12,14,21,.11)" />
          <path className="chart-line" d={line} pathLength="1" fill="none" stroke="#0c0e15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((b, i) => (
            <g key={b.key}>
              <title>{`${b.month}: ${b.v} ${b.v === 1 ? "story" : "stories"}`}</title>
              <circle cx={xs[i]} cy={ys[i]} r="11" fill="transparent" />
              <circle cx={xs[i]} cy={ys[i]} r={i === last ? 5 : 3} fill={i === last ? "var(--accent)" : "#0c0e15"} stroke={i === last ? "#0c0e15" : "none"} strokeWidth="2" />
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-1.5 flex">
        {data.map((b) => (
          <span key={b.key} className="flex-1 text-center text-[10.5px] font-semibold opacity-60">{b.month[0]}</span>
        ))}
      </div>
    </div>
  );
}

export default StoriesChart;