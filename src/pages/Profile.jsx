import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Query } from "appwrite";
import { Container, PostCard, PostSkeleton } from "../components";
import appwriteService from "../appwrite/config";
import useTitle from "../utils/useTitle";

export default function Profile() {
  const { userId } = useParams();
  const [posts, setPosts] = useState(null);
  useTitle(posts?.[0]?.authorName || "Profile");

  useEffect(() => {
    appwriteService
      .getPosts([
        Query.equal("userId", userId),
        Query.equal("status", "published"),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ])
      .then((res) => setPosts(res ? res.documents : []));
  }, [userId]);

  if (posts === null) {
    return <Container><div className="py-11"><PostSkeleton /></div></Container>;
  }

  // The name is copied onto each post when it's written, so read it from the newest one.
  const name = posts[0]?.authorName || "Writer";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Container>
      <div className="flex items-center gap-5 border-b-2 border-fg pb-7 pt-11">
        <span className="grid size-16 shrink-0 place-items-center rounded-full border-[1.5px] border-fg bg-accent text-xl font-extrabold text-ink">
          {initials}
        </span>
        <div>
          <h1 className="font-display text-[clamp(32px,5vw,64px)] font-extrabold leading-none tracking-[-0.05em]">{name}</h1>
          <p className="mt-1 text-fg2">{posts.length} {posts.length === 1 ? "story" : "stories"}</p>
        </div>
      </div>
      {posts.length === 0 ? (
        <p className="py-12 text-xl font-bold">No published stories yet.</p>
      ) : (
        <div className="grid gap-4 py-8 pb-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <PostCard key={post.$id} {...post} />)}
        </div>
      )}
    </Container>
  );
}