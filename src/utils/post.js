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

// Slug is the Appwrite document ID: a-z 0-9 - _ ., max 36 chars, no leading special char.
export const slugTransform = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z\d]+/g, "-")
    .slice(0, 36)
    .replace(/^-+|-+$/g, "");

// "React, appwrite ,react" -> ["react", "appwrite"]; max 5 tags of 30 chars (matches the column size).
export const parseTags = (value) => [
  ...new Set(
    value
      .split(",")
      .map((tag) => tag.trim().toLowerCase().slice(0, 30))
      .filter(Boolean),
  ),
].slice(0, 5);