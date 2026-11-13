function Card() {
  return (
    <div className="rounded-3xl border border-line bg-card p-2.5" aria-hidden="true">
      <div className="aspect-video rounded-[18px] bg-bg2" />
      <div className="space-y-2.5 px-1.5 pb-3 pt-4">
        <div className="h-3 w-16 rounded-full bg-bg2" />
        <div className="h-5 w-4/5 rounded-md bg-bg2" />
        <div className="h-3 w-full rounded-md bg-bg2" />
        <div className="h-3 w-2/3 rounded-md bg-bg2" />
      </div>
    </div>
  );
}

export default function PostSkeleton({ count = 6 }) {
  return (
    <div role="status" aria-label="Loading stories" className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => <Card key={i} />)}
    </div>
  );
}