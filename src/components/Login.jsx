import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { AuthShell, Button, Input } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const message = error || errors.email?.message;

  return (
    <AuthShell
      eyebrow="Members"
      title={<>Welcome <span className="text-accent">back.</span></>}
      perks={["Read every story, free for members", "Publish from the writing desk", "Your drafts, saved and in order"]}
    >
      <h2 className="font-display text-[clamp(22px,2vw,28px)] font-extrabold tracking-[-0.04em]">Sign in</h2>
      <p className="mb-6 mt-2 text-fg2">
        No account yet?{" "}
        <Link to="/signup" className="border-b-2 border-accent font-semibold text-fg">Create one</Link>.
      </p>
      {message && (
        <p role="alert" className="mb-5 rounded-[10px] border-l-4 border-danger bg-bg2 px-4 py-3 text-sm font-medium">{message}</p>
      )}
      <form onSubmit={handleSubmit(login)} className="space-y-5">
        <Input
          label="Email"
          placeholder="you@example.com"
          type="email"
          {...register("email", {
            required: true,
            validate: {
              matchPatern: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address",
            },
          })}
        />
        <Input label="Password" type="password" placeholder="Your password" {...register("password", { required: true })} />
        <Button type="submit" className="w-full">Sign in <span aria-hidden="true">→</span></Button>
      </form>
    </AuthShell>
  );
}

export default Login;