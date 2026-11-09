import { useEffect, useState } from "react";
import { Query } from "appwrite";
import { Container, PostCard } from "../components/index";
import appwriteService from "../appwrite/config";

function AllPost() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    appwriteService
      .getPosts([Query.orderDesc("$createdAt"), Query.limit(100)])
      .then((res) => setPosts(res ? res.documents : []));
  }, []);

  if (posts === null) {
    return <Container><p className="py-16">Loading...</p></Container>;
  }

  return (
    <Container>
      <div className="flex flex-wrap items-end justify-between gap-6 pb-7 pt-11">
        <div>
          <span className="mb-2.5 inline-block text-[11.5px] font-semibold"><span className="text-accent">● </span>The archive</span>
          <h1 className="font-display text-[clamp(44px,6.4vw,92px)] font-extrabold leading-[0.96] tracking-[-0.06em]">
            All <span className="text-accent">posts</span>
          </h1>
        </div>
        <p className="text-fg2">{posts.length} {posts.length === 1 ? "story" : "stories"}, newest first.</p>
      </div>
      {posts.length === 0 ? (
        <p className="py-10 text-xl font-bold">No posts yet.</p>
      ) : (
        <div className="grid gap-4 pb-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.$id} {...post} />
          ))}
        </div>
      )}
    </Container>
  );
}

export default AllPost;