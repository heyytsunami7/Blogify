const STAR5 = "M50 22l8.5 18.5 20 2.3-14.9 13.7 4.1 19.8L50 66.8 32.3 76.3l4.1-19.8L21.5 42.8l20-2.3z";

const stickers = {
  star: (c) => (
    <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#10121a" stroke="#fff" strokeWidth="7" /><path d={STAR5} fill={c} /></svg>
  ),
  chat: (c) => (
    <svg viewBox="0 0 100 100"><path d="M18 22h64a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8H52L34 88V72H18a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z" fill={c} stroke="#fff" strokeWidth="7" strokeLinejoin="round" /><g fill="#10121a"><circle cx="34" cy="47" r="5" /><circle cx="50" cy="47" r="5" /><circle cx="66" cy="47" r="5" /></g></svg>
  ),
  smile: (c) => (
    <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="41" fill={c} stroke="#fff" strokeWidth="7" /><circle cx="37" cy="41" r="5" fill="#10121a" /><circle cx="63" cy="41" r="5" fill="#10121a" /><path d="M30 58c6 14 34 14 40 0" fill="none" stroke="#10121a" strokeWidth="6" strokeLinecap="round" /></svg>
  ),
  quote: (c) => (
    <svg viewBox="0 0 100 100"><rect x="12" y="12" width="76" height="76" rx="22" fill={c} stroke="#fff" strokeWidth="7" /><path d="M33 62c0-12 4-22 14-28l3 5c-5 3-7 7-7 11h7v14H33zm22 0c0-12 4-22 14-28l3 5c-5 3-7 7-7 11h7v14H55z" fill="#10121a" /></svg>
  ),
  heart: (c) => (
    <svg viewBox="0 0 100 100"><path d="M50 84C20 62 12 46 12 34a20 20 0 0 1 38-9 20 20 0 0 1 38 9c0 12-8 28-38 50z" fill={c} stroke="#fff" strokeWidth="7" strokeLinejoin="round" /><path d="M70 28l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="#fff" /></svg>
  ),
};

// Static on purpose: these are design copy, not stored data.
const REVIEWS = [
  {
    title: "finally, clear.", quote: "The React Router post explained in ten minutes what three tutorials could not.",
    likes: ["Clear examples", "Fast to read", "Real code"], name: "Priya N.", role: "Frontend developer",
    sticker: stickers.star("#c4f04b"), stickerPos: "right-4 rotate-[9deg]",
    card: "bg-mint text-ink -rotate-4 z-[1] lg:mt-[22px] lg:pr-11", avatar: "bg-ink text-[#f4f1e9]",
  },
  {
    title: "so practical.", quote: "Short, opinionated and full of snippets I could paste straight into my project.",
    likes: ["Copy-paste ready", "No fluff"], name: "Marcus T.", role: "Full-stack developer",
    sticker: stickers.chat("#ffffff"), stickerPos: "left-[18px] -rotate-[8deg]",
    card: "bg-yellow text-ink rotate-3 z-[2] lg:mt-11 lg:pr-11", avatar: "bg-ink text-[#f4f1e9]",
  },
  {
    title: "my daily read.", quote: "I open Blogify before stand-up. There is always one good idea waiting.",
    likes: ["New posts weekly", "Great topics", "Friendly tone"], name: "Sofia L.", role: "Tech lead",
    sticker: stickers.smile("#c4f04b"), stickerPos: "left-1/2 -ml-7 -rotate-[5deg]",
    card: "bg-accent text-ink -rotate-[1.5deg] z-[5]", avatar: "bg-ink text-[#f4f1e9]",
  },
  {
    title: "writing is easy.", quote: "Publishing my first post took five minutes. The editor just works.",
    likes: ["Simple editor", "Instant publish"], name: "Dev K.", role: "Student",
    sticker: stickers.quote("#ff6a13"), stickerPos: "right-3.5 rotate-[7deg]",
    card: "bg-dark text-[#f4f1e9] rotate-3 z-[4] lg:mt-5 lg:pl-11", avatar: "bg-lime text-ink",
  },
  {
    title: "great community.", quote: "Honest takes, kind authors and zero fluff. Exactly what I was looking for.",
    likes: ["Kind authors", "Honest takes", "Many topics"], name: "Hana W.", role: "Designer",
    sticker: stickers.heart("#ff6a13"), stickerPos: "right-4 -rotate-[6deg]",
    card: "bg-lime text-ink -rotate-3 z-[3] lg:mt-[46px] lg:pl-11", avatar: "bg-ink text-[#f4f1e9]",
  },
];

const initials = (name) => name.split(" ").map((w) => w[0]).join("");

function Reviews() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-10 pb-8 pt-14 lg:flex-nowrap lg:items-start lg:gap-0">
      {REVIEWS.map((r) => (
        <article
          key={r.name}
          className={`relative flex min-h-[316px] w-full max-w-[260px] flex-col rounded-3xl px-[22px] pb-5 pt-14 shadow-[0_22px_32px_-22px_rgba(16,18,26,.55)] transition duration-300 hover:z-30 hover:-translate-y-3 hover:rotate-0 hover:scale-105 lg:w-[244px] lg:max-w-none lg:shrink-0 lg:[&:not(:first-child)]:-ml-[22px] ${r.card}`}
        >
          <span className={`absolute -top-[26px] size-14 ${r.stickerPos}`} aria-hidden="true">{r.sticker}</span>
          <h3 className="font-display text-[21px] font-extrabold leading-none tracking-[-0.04em]">{r.title}</h3>
          <hr className="my-3 border-0 border-t-2 border-current" />
          <p className="text-sm font-medium leading-[1.45]">“{r.quote}”</p>
          <ul className="mt-3 grid gap-[3px] text-[13px] font-medium">
            {r.likes.map((x) => <li key={x}><span aria-hidden="true" className="mr-2">✦</span>{x}</li>)}
          </ul>
          <div className="mt-auto flex items-center gap-2.5 pt-4">
            <span className={`grid size-9 place-items-center rounded-full border-2 border-white/75 text-xs font-bold ${r.avatar}`}>{initials(r.name)}</span>
            <span><b className="block text-[13px] leading-tight">{r.name}</b><small className="block text-[11.5px] opacity-70">{r.role}</small></span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Reviews;