import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "../appwrite/config";

export default function UpvoteButton({ postId }) {
  const userId = useSelector((state) => state.auth.userData?.$id);
  const navigate = useNavigate();
  const [votes, setVotes] = useState(null); // { total, mine }
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    appwriteService.getVotes(postId, userId).then(setVotes);
  }, [postId, userId]);

  const toggle = async () => {
    if (!userId) return navigate("/login");
    if (busy || !votes) return;
    setBusy(true);
    if (votes.mine) {
      if (await appwriteService.removeVote(votes.mine)) setVotes({ total: votes.total - 1, mine: null });
    } else {
      const vote = await appwriteService.addVote(postId, userId);
      if (vote) setVotes({ total: votes.total + 1, mine: vote.$id });
    }
    setBusy(false);
  };

  const active = Boolean(votes?.mine);
  return (
    <button
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? "Remove your upvote" : "Upvote this story"}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
        active ? "border-accent bg-accent text-ink" : "border-fg hover:bg-fg hover:text-bg"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      {votes ? votes.total : "–"}
      <span className="font-semibold">{active ? "Upvoted" : "Upvote"}</span>
    </button>
  );
}