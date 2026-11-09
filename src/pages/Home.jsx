import { useState, useEffect } from "react";
import appwriteServices from "../appwrite/config";
import { Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    appwriteServices
      .getPosts()
      .then((res) => setPosts(res ? res.documents : []));
  }, []);

  if (posts === null) {
    return (
      <Container>
        <p className="py-8">Loading...</p>
      </Container>
    );
  }

  if (posts.length === 0) {
    return (
      <Container>
        <h1 className="py-8 text-xl font-bold">No posts yet.</h1>
      </Container>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.$id} {...post} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;