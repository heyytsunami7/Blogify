import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { AuthShell, Input, Button } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");

  const create = async (data) => {
    setError("");
    try {
      const session = await authService.createAccount(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
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
      eyebrow="New here"
      title={<>Start your first <span className="text-accent">story.</span></>}
      perks={["Free for readers and writers", "A rich-text writing desk", "Publish whenever you're ready"]}
    >
      <h2 className="font-display text-[clamp(22px,2vw,28px)] font-extrabold tracking-[-0.04em]">Create account</h2>
      <p className="mb-6 mt-2 text-fg2">
        Already a member?{" "}
        <Link to="/login" className="border-b-2 border-accent font-semibold text-fg">Sign in</Link>.
      </p>
      {message && (
        <p role="alert" className="mb-5 rounded-[10px] border-l-4 border-danger bg-bg2 px-4 py-3 text-sm font-medium">{message}</p>
      )}
      <form onSubmit={handleSubmit(create)} className="space-y-5">
        <Input label="Full name" placeholder="Your full name" {...register("name", { required: true })} />
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
        <Input label="Password" placeholder="At least 8 characters" type="password" {...register("password", { required: true })} />
        <Button type="submit" className="w-full">Create account <span aria-hidden="true">→</span></Button>
      </form>
    </AuthShell>
  );
}

export default Signup;