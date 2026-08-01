import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Luuna admin account.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-secondary px-4 py-12">
      {/* Subtle gradient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-2xl"
      />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {/* Icon mark */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 fill-none stroke-white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-custom">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-text-custom/55">
              Sign in to your Luuna admin panel
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border-custom bg-white px-8 py-8 shadow-xl shadow-text-custom/5">
          <LoginForm />
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-text-custom/40">
          Protected by secure token authentication.
          <br />
          Cookies are used to store your session.
        </p>
      </div>
    </div>
  );
}
