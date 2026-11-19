import Button from "./Button";
import Container from "./Container/Container";

export default function LoadError({ what = "stories" }) {
  return (
    <Container>
      <div className="py-20">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Could not load {what}.</h1>
        <p className="mb-6 mt-2 text-fg2">Check your connection and try again.</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    </Container>
  );
}