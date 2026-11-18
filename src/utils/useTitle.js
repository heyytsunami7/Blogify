import { useEffect } from "react";

// Sets the browser tab title; just "Blogify" when no title is given.
export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Blogify` : "Blogify";
  }, [title]);
}
