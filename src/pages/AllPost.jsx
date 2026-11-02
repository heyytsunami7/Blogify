import React, { useEffect } from "react";
import { Container, PostCard } from "../components/index";
import appwriteService from "../appwrite/config";

function AllPost() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {}, []);
  appwriteService.getPosts([]).then((post) => {
    if (posts) {
      setPosts(posts.documents);
    }
  });
  return (
    <div>
      <Container>
        {post.map((post) => (
          <PostCard key={post.$id} post={post} />
        ))}
      </Container>
    </div>
  );
}

export default AllPost;
