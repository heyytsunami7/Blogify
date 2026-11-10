import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Logo, LogoutBtn } from "../index";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const [dark, setDark] = useState(document.documentElement.dataset.theme === "dark");

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("blogify-theme", next); } catch { /* storage blocked */ }
    setDark(!dark);
  };

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
  ].filter((item) => item.active);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-fg bg-bg">
      <Container>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5 md:h-[60px] md:py-0">
          <Link to="/" aria-label="Blogify home" className="mr-auto text-fg">
            <Logo className="h-8 w-auto md:h-10" />
          </Link>
          <ul className="order-3 flex w-full gap-5 md:order-none md:w-auto md:gap-6">
                        {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.slug}
                  end
                  className={({ isActive }) =>
                    `border-b-[2.5px] py-1 text-sm font-semibold ${isActive ? "border-accent" : "border-transparent hover:border-accent"}`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            aria-pressed={dark}
            className="grid size-[34px] cursor-pointer place-items-center rounded-[10px] border-[1.5px] border-fg text-fg transition hover:bg-fg hover:text-bg"
          >
            <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {dark ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </>
              ) : (
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              )}
            </svg>
          </button>
          {authStatus && <LogoutBtn />}
          <Button to={authStatus ? "/add-post" : "/signup"} size="sm">
            {authStatus ? "Add Post" : "Get started"} <span aria-hidden="true">↗</span>
          </Button>
        </nav>
      </Container>
    </header>
  );
}

export default Header;