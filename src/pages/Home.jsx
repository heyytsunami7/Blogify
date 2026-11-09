import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config";
import { Button, Container, PostCard, StoriesChart } from "../components";
import { excerpt, formatDate, readMinutes } from "../utils/post";

const labelCls = "text-[11px] font-semibold uppercase tracking-wider";

function SectionHead({ n, title, right }) {
  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-end gap-3.5 border-b-2 border-fg pb-3.5 sm:grid-cols-[56px_1fr_auto]">
      <span className={`${labelCls} pb-2 text-accent`}>({n})</span>
      <h2 className="font-display text-[clamp(32px,4.4vw,60px)] font-extrabold leading-[0.95] tracking-[-0.05em]">{title}</h2>
      <span className={`${labelCls} hidden pb-1.5 text-mute sm:block`}>{right}</span>
    </div>
  );
}

// The logo mark on its own, used as the hero artwork.
function Mark() {
  return (
    <svg viewBox="-6 -9 56 56" className="w-[74%] overflow-visible text-fg" role="img" aria-label="Blogify mark">
      <defs>
        <mask id="hero-mark" maskUnits="userSpaceOnUse" x="-10" y="-12" width="70" height="70">
          <rect x="-10" y="-12" width="70" height="70" fill="#fff" />
          <path d="M6 31C15 35 26 29 31 15" fill="none" stroke="#000" strokeWidth="10" strokeLinejoin="round" />
          <polygon points="37 3 22 7 33 18" fill="#000" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
        </mask>
      </defs>
      <circle cx="19" cy="21" r="11.5" fill="none" stroke="currentColor" strokeWidth="8" mask="url(#hero-mark)" />
      <path d="M6 31C15 35 26 29 31 15" fill="none" className="stroke-accent" strokeWidth="4.6" />
      <polygon points="37 3 22 7 33 18" className="fill-accent stroke-accent" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function Home() {
  const [posts, setPosts] = useState(null);
  const [shown, setShown] = useState(6);
  const authStatus = useSelector((state) => state.auth.status);
  const startTo = authStatus ? "/add-post" : "/signup";
  const startLabel = authStatus ? "Start writing" : "Get started";

  useEffect(() => {
    appwriteService
      .getPosts([Query.equal("status", "published"), Query.orderDesc("$createdAt"), Query.limit(100)])
      .then((res) => setPosts(res ? res.documents : []));
  }, []);

  if (posts === null) {
    return <Container><p className="py-16">Loading...</p></Container>;
  }

  if (posts.length === 0) {
    return (
      <Container>
        <div className="py-20">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">No stories yet.</h1>
          <p className="mb-6 mt-2 text-fg2">Be the first to publish one.</p>
          <Button to={startTo}>{startLabel} <span aria-hidden="true">↗</span></Button>
        </div>
      </Container>
    );
  }

  const [featured, ...rest] = posts;
  const writers = new Set(posts.map((p) => p.userId)).size;
  const topics = new Set(posts.flatMap((p) => p.tags || [])).size;
  const stats = [["Stories live", posts.length], ["Writers", writers], ["Topics", topics]];

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-fg">
        <div className="absolute -right-[4vw] top-[9%] aspect-square w-[clamp(200px,29vw,420px)] rounded-full bg-accent max-md:opacity-60" />
        <Container>
          <div className="relative grid items-center gap-8 py-8 md:grid-cols-[1.04fr_0.96fr] md:py-12">
            <div>
              <h1 className="font-display text-[clamp(46px,7.1vw,96px)] font-extrabold leading-[0.9] tracking-[-0.055em]">
                Stories<br />that build<br />things<span className="text-accent">.</span>
              </h1>
              <p className="mt-6 max-w-[400px] text-[clamp(16px,1.3vw,18px)] font-medium leading-snug">
                A home for developers who write. Read what the community is building, then add your own voice.
              </p>
              <div className="mt-5 flex items-center gap-5">
                <Button to={startTo}>{startLabel} <span aria-hidden="true">↗</span></Button>
                <Link to="/all-posts" className="border-b-[1.5px] border-current pb-0.5 text-sm font-semibold hover:text-accent">
                  Browse all posts
                </Link>
              </div>
              <dl className="mt-8 grid max-w-[540px] grid-cols-3 border-t-2 border-fg">
                {stats.map(([label, value]) => (
                  <div key={label} className="pr-3 pt-2.5">
                    <dt className={labelCls}>{label}</dt>
                    <dd className="font-display text-[clamp(34px,4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.05em]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mx-auto grid aspect-[1/0.96] w-full max-w-[520px] place-items-center rounded-[32px] border-2 border-fg bg-card shadow-[0_34px_44px_-34px_rgba(12,14,21,.6)] [background-image:radial-gradient(circle_at_50%_54%,color-mix(in_srgb,var(--accent)_16%,transparent)_0,transparent_56%)]">
              <Mark />
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <section className="pt-[clamp(48px,5.5vw,80px)]">
          <SectionHead n="01" title="Overview" right="At a glance" />
          <div className="mt-5 grid gap-3 lg:grid-cols-12">
            <Link
              to={`/post/${featured.$id}`}
              className="group flex flex-col rounded-3xl bg-dark p-2.5 text-[#f4f1e9] transition duration-300 hover:-translate-y-1 lg:col-span-7 lg:row-span-3"
            >
              <div className="aspect-video overflow-hidden rounded-[18px] bg-bg2">
                <img src={appwriteService.getFileView(featured.featuredImage)} alt={featured.title} className="size-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-2.5 px-2.5 pb-1.5 pt-4">
                <span className={`${labelCls} text-[#a9a69b]`}>Featured{featured.tags?.[0] ? ` · ${featured.tags[0]}` : ""}</span>
                <h3 className="font-display text-[clamp(24px,2.7vw,38px)] font-extrabold leading-none tracking-[-0.045em] transition-colors group-hover:text-lime">
                  {featured.title}
                </h3>
                <p className="max-w-[520px] text-[15px] leading-normal text-[#cfccc0]">{excerpt(featured.content, 150)}</p>
                <div className="mt-auto flex items-center justify-between border-t border-white/20 pt-3.5 text-xs font-semibold text-[#a9a69b]">
                  <span>{formatDate(featured.$createdAt)} · {readMinutes(featured.content)} min read</span>
                  <span className="grid size-[42px] place-items-center rounded-full bg-lime text-lg text-ink transition group-hover:rotate-45">↗</span>
                </div>
              </div>
            </Link>

            <div className="flex flex-col gap-2.5 rounded-3xl bg-mint px-5 py-[18px] text-ink lg:col-span-5">
              <span className={`${labelCls} opacity-60`}>(A) Stories per month</span>
              <div className="font-display text-[clamp(44px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.06em]">
                {posts.length}<small className="ml-2.5 font-sans text-[13px] font-semibold tracking-normal opacity-70">stories live</small>
              </div>
              <StoriesChart posts={posts} />
            </div>

            <div className="flex flex-col justify-between gap-3 rounded-3xl bg-accent px-5 py-[18px] text-ink lg:col-span-5">
              <span className={`${labelCls} opacity-60`}>(B) Promo</span>
              <h3 className="font-display text-[clamp(20px,1.9vw,26px)] font-extrabold leading-[1.05] tracking-[-0.04em]">Write your first story in five minutes.</h3>
              <Button to={startTo} className="self-start hover:!border-white hover:!bg-white hover:!text-ink">{startLabel} <span aria-hidden="true">↗</span></Button>
            </div>

            <div className="flex flex-col justify-between gap-3 rounded-3xl bg-yellow px-5 py-[18px] text-ink lg:col-span-5">
              <span className={`${labelCls} opacity-60`}>(C) Community</span>
              <h3 className="font-display text-[clamp(20px,1.9vw,26px)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                {writers} {writers === 1 ? "writer" : "writers"} and counting.
              </h3>
              <Button to={startTo} className="self-start hover:!border-white hover:!bg-white hover:!text-ink">Join the writers <span aria-hidden="true">↗</span></Button>
            </div>
          </div>
        </section>

        {rest.length > 0 && (
          <section className="pt-[clamp(48px,5.5vw,80px)]">
            <SectionHead n="02" title="Latest stories" right={`Showing ${Math.min(shown, rest.length)} of ${rest.length}`} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, shown).map((post) => (
                <PostCard key={post.$id} {...post} />
              ))}
            </div>
            {shown < rest.length && (
              <button
                onClick={() => setShown(shown + 3)}
                className="mt-4 flex w-full cursor-pointer items-center justify-between rounded-3xl border-2 border-fg px-6 py-3.5 font-display text-[clamp(18px,1.9vw,26px)] font-extrabold tracking-[-0.04em] transition hover:border-accent hover:bg-accent hover:text-ink"
              >
                <span>Show more <small className="font-sans text-[0.55em] font-semibold opacity-70">(+{Math.min(3, rest.length - shown)})</small></span>
                <span aria-hidden="true">↓</span>
              </button>
            )}
          </section>
        )}
      </Container>

      <section className="mt-[clamp(52px,6vw,88px)] bg-accent py-6 text-ink">
        <Container>
          <h2 className="pb-[0.12em] font-display text-[clamp(52px,9.6vw,136px)] font-extrabold leading-[0.86] tracking-[-0.06em]">Start writing.</h2>
          <div className="flex flex-wrap items-end justify-between gap-5 border-t-2 border-ink pt-4">
            <p className="max-w-[380px] text-[clamp(15px,1.2vw,17px)] font-medium leading-snug">
              Open the writing desk, pick a cover and publish in minutes. Free for every member.
            </p>
            <Button to={startTo} className="hover:!border-white hover:!bg-white hover:!text-ink">{startLabel} <span aria-hidden="true">↗</span></Button>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Home;