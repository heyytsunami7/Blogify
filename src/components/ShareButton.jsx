import { useState } from "react";

// Phones get the native share sheet; desktops copy the link.
export default function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* share cancelled or clipboard blocked */
    }
  };

  return (
    <button
      onClick={share}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-fg px-5 py-2.5 text-sm font-bold transition hover:bg-fg hover:text-bg"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" />
      </svg>
      <span role="status">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}