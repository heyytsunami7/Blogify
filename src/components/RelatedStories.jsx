import { useEffect, useState } from "react";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config";
import PostCard from "./PostCard";

// Up to 3 other published posts that share the most tags with this one.
export default function RelatedStories({ post }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!post.tags?.length) return;
    appwriteService
      .getPosts([Query.equal("status", "published"), Query.orderDesc("$createdAt"), Query.limit(100)])
      .then((res) => {
        if (!res) return;
        const shared = (p) => p.tags?.filter((t) => post.tags.includes(t)).length || 0;
        setRelated(
          res.documents
            .filter((p) => p.$id !== post.$id && shared(p) > 0)
            .sort((a, b) => shared(b) - shared(a))
            .slice(0, 3),
        );
      });
  }, [post]);

  if (related.length === 0) return null;

  return (
    <section className="mt-14 border-t-2 border-fg pt-8">
      <h2 className="font-display text-2xl font-extrabold tracking-tight">Keep reading</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <PostCard key={p.$id} {...p} />
        ))}
      </div>
    </section>
  );
}