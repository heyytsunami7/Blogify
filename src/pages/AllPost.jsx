import { useEffect, useState } from "react";
import { Container, PostCard } from "../components/index";
import appwriteService from "../appwrite/config";

function AllPost() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  return (
    <div>
      <Container>
        {posts.map((post) => (
          <PostCard key={post.$id} {...post} />
        ))}
      </Container>
    </div>
  );
}

export default AllPost;