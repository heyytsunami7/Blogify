import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Button from "./Button";
import { fieldClass } from "./Input";
import { formatDate } from "../utils/post";

const MAX = 500;

export default function Comments({ postId, postAuthorId }) {
  const userData = useSelector((state) => state.auth.userData);
  const [comments, setComments] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    appwriteService
      .getComments(postId)
      .then((res) => setComments(res ? res.documents : []));
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setBusy(true);
    setError("");
    const created = await appwriteService.createComment({
      postId,
      postAuthorId,
      userId: userData.$id,
      authorName: userData.name || "Reader",
      body,
    });
    setBusy(false);
    if (created) {
      setComments([created, ...(comments || [])]);
      setText("");
    } else {
      setError("Could not post your comment. Try again.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    if (await appwriteService.deleteComment(id)) {
      setComments(comments.filter((c) => c.$id !== id));
    }
  };

  return (
    <section className="mt-14 border-t-2 border-fg pt-8">
      <h2 className="font-display text-2xl font-extrabold tracking-tight">
        Comments{comments ? ` (${comments.length})` : ""}
      </h2>

      {userData ? (
        <form onSubmit={submit} className="mt-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX}
            rows={3}
            aria-label="Write a comment"
            placeholder="Share your thoughts..."
            className={fieldClass}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-mute">{text.length}/{MAX}</span>
            <Button
              type="submit"
              size="sm"
              disabled={busy || !text.trim()}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Posting..." : "Post comment"}
            </Button>
          </div>
          {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
        </form>
      ) : (
        <p className="mt-5 text-fg2">
          <Link to="/login" className="border-b-[1.5px] border-current font-semibold hover:text-accent">
            Log in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      <ul className="mt-8 grid gap-4">
        {comments?.map((c) => (
          <li key={c.$id} className="rounded-2xl border border-line bg-card p-4">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-bold">{c.authorName}</span>
              <span className="text-mute">{formatDate(c.$createdAt)}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-normal">{c.body}</p>
            {userData && (userData.$id === c.userId || userData.$id === postAuthorId) && (
              <button
                onClick={() => remove(c.$id)}
                className="mt-2 cursor-pointer text-xs font-semibold text-mute transition hover:text-danger"
              >
                Delete
              </button>
            )}
          </li>
        ))}
        {comments?.length === 0 && <li className="text-mute">No comments yet. Be the first.</li>}
      </ul>
    </section>
  );
}