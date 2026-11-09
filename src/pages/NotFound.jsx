import { Button, Container } from "../components";

function NotFound() {
  return (
    <Container>
      <div className="py-24">
        <span className="font-display text-[clamp(90px,16vw,200px)] font-extrabold leading-[0.85] tracking-[-0.06em] text-accent">404</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">That page doesn't exist.</h1>
        <p className="mb-6 mt-2 text-fg2">The link may be broken, or the story was removed.</p>
        <Button to="/">Back to home <span aria-hidden="true">↗</span></Button>
      </div>
    </Container>
  );
}

export default NotFound;