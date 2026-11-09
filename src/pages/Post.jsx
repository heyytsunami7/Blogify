import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { useSelector } from "react-redux";
import { formatDate, readMinutes } from "../utils/post";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        if (!window.confirm("Delete this post? This cannot be undone.")) return;
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <Container>
            <article className="mx-auto max-w-[880px] pb-6 pt-9">
                <Link to="/" className="mb-7 inline-block text-xs font-semibold uppercase tracking-widest text-mute transition hover:text-accent">
                    ← Back to stories
                </Link>
                <header>
                    {post.status === "draft" && (
                        <span className="mb-3 mr-2 inline-block rounded-full bg-fg px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-bg">Draft</span>
                    )}
                    {post.tags?.map((tag) => (
                        <span key={tag} className="mb-3 mr-2 inline-block rounded-full bg-yellow px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-ink">
                            {tag}
                        </span>
                    ))}
                    <h1 className="font-display text-[clamp(34px,4.4vw,60px)] font-extrabold leading-[0.96] tracking-[-0.045em]">{post.title}</h1>
                    <p className="mt-5 border-y border-fg py-3 text-xs font-semibold uppercase tracking-wider text-mute">
                        {formatDate(post.$createdAt)} · {readMinutes(post.content)} min read
                    </p>
                    {isAuthor && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-dashed border-fg px-4 py-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-mute">You wrote this story</span>
                            <div className="flex gap-2">
                                <Button to={`/edit-post/${post.$id}`} variant="outline" size="sm">Edit</Button>
                                <Button variant="danger" size="sm" onClick={deletePost}>Delete</Button>
                            </div>
                        </div>
                    )}
                </header>
                <figure className="my-8">
                    <img
                        src={appwriteService.getFileView(post.featuredImage)}
                        alt={post.title}
                        className="aspect-[16/8] w-full rounded-3xl object-cover"
                    />
                </figure>
                <div className="browser-css mx-auto max-w-[700px]">
                    {parse(DOMPurify.sanitize(post.content))}
                </div>
            </article>
        </Container>
    ) : null;
}