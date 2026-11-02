import React, { useState } from "react";
import appwriteServices from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useEffect } from "react";

function Home() {
  const [post, setPosts] = useState([]);

  useEffect(() => {
    appwriteServices.getPost().then((posts) => {
      if (posts) {
        setPosts(post.documents);
      }
    });
  }, []);
  if (post.length === 0) {
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
            {posts.map((post)=>{
                <PostCard {...post}/>
            })}
        </Container>
    </div>
  )
}

export default Home;
