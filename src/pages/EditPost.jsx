import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, PostForm } from "../components/index";
import appwriteService from "../appwrite/config";
import useTitle from "../utils/useTitle";

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  useTitle("Edit story");

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

    return post ? (
    <div>
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : (
    <Container>
      <p className="py-16">Loading...</p>
    </Container>
  );
}

export default EditPost;