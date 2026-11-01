"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { type FormState, resetPasswordAction } from "@/app/actions/auth";
import { useToast } from "@/providers/toast-provider";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState, payload) => {
      const result = await resetPasswordAction(prevState, payload);

      if (result?.error) {
        toastError(result.error);
      } else if (result?.success) {
        toastSuccess(result.success);
      }
      return result;
    },
    {},
  );

  return (
    <div className="login-panel">
      <div className="auth-card-container">
        <h1 className="login-header-title">Set New Password</h1>
        <div className="glass-card">
          <p className="subtitle">Please enter your new password below.</p>

          {state?.success ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#4ade80",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                {state.success}
              </p>
              <a
                href="/login"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  width: "100%",
                }}
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-wrapper">
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
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
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
      </div>
    </div>
  );
}
