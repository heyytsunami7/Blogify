import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { excerpt, formatDate, readMinutes } from "../utils/post";

function PostCard({
  $id,
  title,
  featuredImage,
  content,
  summary,
  authorName,
  tags,
  status,
  $createdAt,
}) {
  return (
    <Link
      to={`/post/${$id}`}
      className="group flex h-full flex-col rounded-3xl border border-line bg-card p-2.5 transition duration-300 hover:-translate-y-1 hover:border-fg"
    >
      <div className="relative aspect-video overflow-hidden rounded-[18px] bg-bg2">
        <img
          src={appwriteService.getFileView(featuredImage)}
          alt={title}
          className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
        {status === "draft" && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-fg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-bg">
            Draft
          </span>
        )}
      </div>
      <div className="flex-1 px-1.5 pt-3">
        {tags?.[0] && (
          <span className="mb-2 inline-block rounded-full bg-bg2 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-fg2">
            {tags[0]}
          </span>
        )}
        <h3 className="font-display text-[clamp(18px,1.6vw,22px)] font-extrabold leading-[1.08] tracking-[-0.035em] transition-colors group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-snug text-fg2">
          {summary || excerpt(content)}
        </p>
      </div>
      <div className="mt-3 border-t border-line px-1.5 pt-2.5 text-xs font-semibold text-mute">
        {authorName ? `${authorName} · ` : ""}
        {formatDate($createdAt)} · {readMinutes(content)} min read
      </div>
    </Link>
  );
}

export default PostCard;
