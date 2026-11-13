import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Query } from "appwrite";
import { Container, PostCard } from "../components/index";
import { fieldClass } from "../components/Input";
import appwriteService from "../appwrite/config";

const chipCls =
  "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition";

function AllPost() {
  const [posts, setPosts] = useState(null);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const tag = params.get("tag") || "";

  useEffect(() => {
    appwriteService
      .getPosts([Query.orderDesc("$createdAt"), Query.limit(100)])
      .then((res) => setPosts(res ? res.documents : []));
  }, []);

  // The 10 most used tags.
  const topTags = useMemo(() => {
    const counts = {};
    (posts || []).forEach((p) =>
      (p.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)),
    );
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t]) => t);
  }, [posts]);

  // Keep only the filters that have a value, so the URL stays clean.
  const update = (next) => {
    const merged = { q, tag, ...next };
    setParams(Object.fromEntries(Object.entries(merged).filter(([, v]) => v)), {
      replace: true,
    });
  };

   if (posts === null) {
    return <Container><div className="py-11"><PostSkeleton /></div></Container>;
  }

  // shortcut: filters run in the browser over the 100 newest posts; use Appwrite queries beyond that.
  const needle = q.trim().toLowerCase();
  const results = posts.filter(
    (p) =>
      (!tag || p.tags?.includes(tag)) &&
      (!needle ||
        [p.title, p.summary, p.authorName, ...(p.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(needle)),
  );
  const filtered = Boolean(needle || tag);

  return (
    <Container>
      <div className="flex flex-wrap items-end justify-between gap-6 pb-7 pt-11">
        <div>
          <span className="mb-2.5 inline-block text-[11.5px] font-semibold">
            <span className="text-accent">● </span>The archive
          </span>
          <h1 className="font-display text-[clamp(44px,6.4vw,92px)] font-extrabold leading-[0.96] tracking-[-0.06em]">
            All <span className="text-accent">stories</span>
          </h1>
        </div>
        <p className="text-fg2">
          {filtered ? `${results.length} of ${posts.length}` : posts.length}{" "}
          {posts.length === 1 ? "story" : "stories"}, newest first.
        </p>
      </div>

      <div className="border-y border-line py-4">
        <input
          type="search"
          value={q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Search by title, author or tag"
          aria-label="Search stories"
          className={`${fieldClass} max-w-md`}
        />
        {topTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => update({ tag: "" })}
              className={`${chipCls} ${!tag ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}
            >
              All
            </button>
            {topTags.map((t) => (
              <button
                key={t}
                onClick={() => update({ tag: tag === t ? "" : t })}
                className={`${chipCls} ${tag === t ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="py-12">
          <p className="text-xl font-bold">
            {filtered ? "No stories match that." : "No posts yet."}
          </p>
          {filtered && (
            <button
              onClick={() => setParams({}, { replace: true })}
              className="mt-3 cursor-pointer border-b-[1.5px] border-current pb-0.5 text-sm font-semibold hover:text-accent"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 py-8 pb-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <PostCard key={post.$id} {...post} />
          ))}
        </div>
      )}
    </Container>
  );
}

export default AllPost;
