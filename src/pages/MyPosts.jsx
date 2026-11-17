import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Query } from "appwrite";
import { Button, Container, PostCard, PostSkeleton } from "../components";
import appwriteService from "../appwrite/config";

const TABS = [["all", "All"], ["published", "Published"], ["draft", "Drafts"]];

export default function MyPosts() {
  const userId = useSelector((state) => state.auth.userData.$id);
  const [posts, setPosts] = useState(null);
  const [tab, setTab] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    appwriteService
      .getPosts([Query.equal("userId", userId), Query.orderDesc("$createdAt"), Query.limit(100)])
      .then((res) => setPosts(res ? res.documents : []));
  }, [userId]);

  const remove = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setError("");
    if (await appwriteService.removePost(post)) setPosts(posts.filter((p) => p.$id !== post.$id));
    else setError("Could not delete that post. Try again.");
  };

  if (posts === null) {
    return <Container><div className="py-11"><PostSkeleton /></div></Container>;
  }

  const shown = tab === "all" ? posts : posts.filter((p) => p.status === tab);
  const count = (key) => (key === "all" ? posts.length : posts.filter((p) => p.status === key).length);

  return (
    <Container>
      <div className="flex flex-wrap items-end justify-between gap-6 pb-7 pt-11">
        <h1 className="font-display text-[clamp(44px,6.4vw,92px)] font-extrabold leading-[0.96] tracking-[-0.06em]">
          My <span className="text-accent">posts</span>
        </h1>
        <Button to="/add-post">Write a story <span aria-hidden="true">↗</span></Button>
      </div>

      <div className="flex flex-wrap gap-2 border-y border-line py-4">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              tab === key ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
            }`}
          >
            {label} ({count(key)})
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}

      {shown.length === 0 ? (
        <p className="py-12 text-xl font-bold">
          {posts.length === 0 ? "You haven't written anything yet." : "Nothing in this tab."}
        </p>
      ) : (
        <div className="grid gap-4 py-8 pb-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((post) => (
            <div key={post.$id} className="flex flex-col gap-2">
              <div className="flex-1">
                <PostCard {...post} />
              </div>
              <div className="flex gap-2">
                <Button to={`/edit-post/${post.$id}`} variant="outline" size="sm">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => remove(post)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}