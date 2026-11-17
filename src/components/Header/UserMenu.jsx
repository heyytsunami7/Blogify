import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

const itemCls = "block w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-bg2";

export default function UserMenu() {
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = user?.name || user?.email || "Account";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="grid size-[34px] cursor-pointer place-items-center rounded-full border-[1.5px] border-fg bg-accent text-xs font-extrabold text-ink transition hover:scale-105"
      >
        {initials}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border-[1.5px] border-fg bg-card shadow-lg">
          <p className="border-b border-line px-4 py-3">
            <b className="block truncate text-sm">{name}</b>
            <span className="block truncate text-xs text-mute">{user?.email}</span>
          </p>
          <Link to="/add-post" role="menuitem" onClick={close} className={itemCls}>Add post</Link>
          <Link to="/my-posts" role="menuitem" onClick={close} className={itemCls}>My posts</Link>
          <Link to={`/author/${user?.$id}`} role="menuitem" onClick={close} className={itemCls}>My profile</Link>
          <button
            role="menuitem"
            onClick={() => authService.logout().then(() => dispatch(logout()))}
            className={`${itemCls} border-t border-line text-danger`}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}