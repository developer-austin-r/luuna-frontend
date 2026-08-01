"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginThunk } from "@/redux/slices/auth-slice";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(
      loginThunk({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      }),
    );

    if (loginThunk.fulfilled.match(result)) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
      aria-label="Login form"
    >
      {/* Generic auth error — never reveals email vs password mismatch */}
      {error && (
        <div
          id="auth-error"
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-slide-in"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-email"
          className="text-xs font-semibold uppercase tracking-wider text-text-custom/70"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-custom/30" />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-text-custom placeholder-text-custom/30 transition-all duration-200 outline-none focus:ring-2 ${
              errors.email
                ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                : "border-border-custom bg-white focus:border-primary focus:ring-primary/10"
            }`}
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address.",
              },
            })}
          />
        </div>
        {errors.email && (
          <span id="email-error" role="alert" className="text-xs text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-password"
          className="text-xs font-semibold uppercase tracking-wider text-text-custom/70"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-custom/30" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full rounded-xl border py-2.5 pl-10 pr-11 text-sm text-text-custom placeholder-text-custom/30 transition-all duration-200 outline-none focus:ring-2 ${
              errors.password
                ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                : "border-border-custom bg-white focus:border-primary focus:ring-primary/10"
            }`}
            {...register("password", {
              required: "Password is required.",
            })}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-custom/30 hover:text-text-custom/60 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <span
            id="password-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input
            id="login-remember-me"
            type="checkbox"
            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-border-custom bg-white transition-all duration-200 checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("rememberMe")}
          />
          {/* Custom checkmark */}
          <svg
            className="pointer-events-none absolute left-0.5 top-0.5 hidden h-3 w-3 text-white peer-checked:block"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2 6 5 9 10 3" />
          </svg>
        </div>
        <label
          htmlFor="login-remember-me"
          className="cursor-pointer select-none text-sm text-text-custom/70"
        >
          Remember me for 7 days
        </label>
      </div>

      {/* Submit */}
      <button
        id="login-submit"
        type="submit"
        disabled={isLoading}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
