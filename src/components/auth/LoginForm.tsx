"use client";

import { useActionState, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { authenticate, type FormState } from "@/app/actions/auth";
import { useToast } from "@/providers/toast-provider";

import { SocialButtons } from "./SocialButtons";
import { type AuthTabType, TabSwitcher } from "./TabSwitcher";

export function LoginForm() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab: AuthTabType =
    pathname === "/register" ? "register" : "login";

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState, payload) => {
      const result = await authenticate(prevState, payload);

      if (result?.error) {
        toastError(result.error);
      } else if (result?.success) {
        toastSuccess(result.success);
        if (activeTab === "register") {
          router.push("/login");
        }
      }
      return result;
    },
    {},
  );

  const handleTabChange = (tab: AuthTabType): void => {
    if (tab === "register") {
      router.push("/register");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="login-panel">
      <div className="auth-card-container">
        <h1 className="login-header-title">
          {isForgotPassword
            ? "Reset Password"
            : activeTab === "login"
              ? "Hello! Welcome Back"
              : "Create Account"}
        </h1>

        <div
          className={`glass-card ${activeTab === "register" ? "register-card" : ""}`}
        >
          {!isForgotPassword && (
            <TabSwitcher activeTab={activeTab} onTabSelect={handleTabChange} />
          )}

          <p className="subtitle">
            {isForgotPassword
              ? "Enter your email to receive password reset instructions"
              : activeTab === "login"
                ? "Enter your email and password to access your account"
                : "Fill in your details to create a new account"}
          </p>

          {state?.error && !isForgotPassword && (
            <div className="error-banner">{state.error}</div>
          )}

          {isForgotPassword && state?.success ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#4ade80",
                  marginBottom: "1rem",
                }}
              >
                {state.success}
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form action={formAction} className="form-body">
              <input
                type="hidden"
                name="mode"
                value={isForgotPassword ? "forgot" : activeTab}
              />

              {!isForgotPassword && activeTab === "register" && (
                <div className="name-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </div>

              {!isForgotPassword && (
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your Password"
                      className="form-input"
                      required
                      minLength={8}
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
              )}

              {!isForgotPassword && activeTab === "register" && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your Password"
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
              )}

              {!isForgotPassword && activeTab === "login" && (
                <div className="options-row">
                  <label className="remember-label">
                    <input type="checkbox" name="rememberMe" />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot Password ?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isPending}
              >
                {isPending
                  ? "Please wait..."
                  : isForgotPassword
                    ? "Send Reset Link"
                    : activeTab === "login"
                      ? "Sign In"
                      : "Create Account"}
              </button>

              {isForgotPassword && (
                <div className="card-footer" style={{ marginTop: "1rem" }}>
                  <button
                    type="button"
                    className="toggle-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={() => setIsForgotPassword(false)}
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </button>
                </div>
              )}

              {!isForgotPassword && (
                <>
                  <SocialButtons />
                  <div className="card-footer">
                    {activeTab === "login" ? (
                      <>
                        Don&apos;t Have An Account ?{" "}
                        <button
                          type="button"
                          className="toggle-link"
                          onClick={() => handleTabChange("register")}
                        >
                          Create Account
                        </button>
                      </>
                    ) : (
                      <>
                        Already Have An Account ?{" "}
                        <button
                          type="button"
                          className="toggle-link"
                          onClick={() => handleTabChange("login")}
                        >
                          Sign In
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
