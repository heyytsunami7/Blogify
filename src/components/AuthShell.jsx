import { Container } from "./index";

// Two-column auth layout: pitch on the left, form card (children) on the right.
function AuthShell({ eyebrow, title, perks, children }) {
  return (
    <Container>
      <div className="grid items-center gap-[clamp(32px,5vw,72px)] py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="mb-2.5 inline-block text-[11.5px] font-semibold">
            <span className="text-accent">● </span>{eyebrow}
          </span>
          <h1 className="font-display text-[clamp(34px,4.4vw,60px)] font-extrabold leading-[0.96] tracking-[-0.045em]">{title}</h1>
          <ul className="mt-6 max-w-[520px]">
            {perks.map((perk, i) => (
              <li key={perk} className="grid grid-cols-[42px_1fr] border-t border-line py-3 text-[15px] last:border-b">
                <span className="text-xs font-semibold leading-6 text-accent">{String(i + 1).padStart(2, "0")}</span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border-2 border-fg bg-card p-7">{children}</div>
      </div>
    </Container>
  );
}

export default AuthShell;   