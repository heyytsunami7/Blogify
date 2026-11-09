import { Link } from "react-router-dom";
import { Container } from "../components";

function NotFound() {
  return (
    <Container>
      <div className="py-16 text-center">
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="mb-4">That page doesn't exist.</p>
        <Link to="/" className="text-blue-600 underline">
          Back to home
        </Link>
      </div>
    </Container>
  );
}

export default NotFound;