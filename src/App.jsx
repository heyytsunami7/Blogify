import { useDispatch } from "react-redux";
import "./App.css";
import { useState, useEffect } from "react";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components/index";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login({ userData }));
        else dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // The logo star turns with the scroll position.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spin = () =>
      document.documentElement.style.setProperty("--star-rot", `${window.scrollY * 0.45}deg`);
    window.addEventListener("scroll", spin, { passive: true });
    return () => window.removeEventListener("scroll", spin);
  }, []);

  return !loading ? (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : null;
}

export default App;