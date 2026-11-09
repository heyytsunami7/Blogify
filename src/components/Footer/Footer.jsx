import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Logo } from "../index";

function Footer() {
  const authStatus = useSelector((state) => state.auth.status);
  const links = authStatus
    ? [["Home", "/"], ["All posts", "/all-posts"], ["Add post", "/add-post"]]
    : [["Home", "/"], ["Login", "/login"], ["Sign up", "/signup"]];

  return (
    <footer className="bg-[#0b0b0e] pt-12 text-[#f4f1e9]">
      <Container>
        <div className="grid gap-9 md:grid-cols-[1.2fr_1fr]">
          <p className="font-display text-[clamp(24px,2.6vw,36px)] font-extrabold leading-[1.02] tracking-[-0.045em]">
            Stories, notes<br />&amp; ideas for people<br />who build things.
          </p>
          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#8f8b80]">Explore</h3>
            <ul className="space-y-2">
              {links.map(([name, to]) => (
                <li key={name}>
                  <Link to={to} className="text-[14.5px] font-medium hover:text-accent">{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-9 flex flex-wrap justify-between gap-2.5 border-t border-white/20 pt-3.5 text-[10.5px] font-semibold uppercase tracking-widest text-[#8f8b80]">
          <span>&copy; {new Date().getFullYear()} Blogify</span>
          <span>Built with React and Appwrite</span>
        </div>
        <div className="py-8">
          <Logo className="h-auto w-[clamp(220px,30vw,400px)]" />
        </div>
      </Container>
    </footer>
  );
}

export default Footer;