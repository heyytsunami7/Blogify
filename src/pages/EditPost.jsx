import React, { useEffect } from "react";
import { Container, PostForm } from "../components/index";
import appwriteService from "../appwrite/config"
import { useNavigate } from "react-router-dom";
function EditPost() {
  const [post, setPosts] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPosts(post);
        }
      }
    )
    }
    else{
        navigate("/")
    }
  },[slug, navigate]);
  return post ? (
    <div>
        <Container>
            <Postform post={post}/>
        </Container>
    </div>
  ) : null
}

export default EditPost;
