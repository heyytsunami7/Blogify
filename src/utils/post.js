// Plain text of an HTML string (DOMParser does not run scripts).
export const plainText = (html) =>
  (new DOMParser().parseFromString(html || "", "text/html").body.textContent || "")
    .replace(/\s+/g, " ")
    .trim();

export const excerpt = (html, n = 110) => {
  const t = plainText(html);
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t;
};

export const readMinutes = (html) => Math.max(1, Math.round(plainText(html).split(" ").length / 200));

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });