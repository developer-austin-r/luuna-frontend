"use client";

import { useActionState, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

import { type FormState, resetPasswordAction } from "@/app/actions/auth";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState, payload) => {
      const result = await resetPasswordAction(prevState, payload);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.success);
      }
      return result;
    },
    {},
  );

  return (
    <div className="glass-card">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="login-title">Set New Password</h1>
      <p className="subtitle">Please enter your new password below.</p>

      {state?.success ? (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ fontSize: "0.85rem", color: "#4ade80", fontWeight: 600, marginBottom: "1rem" }}>
            {state.success}
          </p>
          <a
            href="/login"
            className="btn-primary"
            style={{ display: "inline-block", textDecoration: "none", width: "auto", padding: "0.5rem 1rem" }}
          >
            Go to Sign In
          </a>
        </div>
      ) : (
        <form action={formAction} className="form-body">
          <input type="hidden" name="token" value={token} />

          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={14} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                className="form-input"
                required
                minLength={6}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={14} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm new password"
                className="form-input"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "0.5rem" }}
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}
