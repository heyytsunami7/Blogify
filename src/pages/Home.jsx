import { useState , useEffect } from "react";
import appwriteServices from "../appwrite/config";
import { Container, PostCard } from "../components";


function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteServices.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);
  if (posts.length === 0) {
    return (
      <div>
        <Container>
          <h1>Login to read posts</h1>
        </Container>
      </div>
    );
  }
  return (
    <div>
        <Container>
            {posts.map((post)=>(
                <PostCard key={post.$id} {...post}/>
            ))}
        </Container>
    </div>
  )
}

export default Home;
