"use client";

import { useActionState, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { authenticate, type FormState } from "@/app/actions/auth";

import { SocialButtons } from "./SocialButtons";
import { type AuthTabType, TabSwitcher } from "./TabSwitcher";

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<AuthTabType>("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState, payload) => {
      const result = await authenticate(prevState, payload);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.success);
        if (activeTab === "register") {
          setActiveTab("login");
        }
      }
      return result;
    },
    {},
  );

  const handleTabChange = (tab: AuthTabType): void => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`glass-card ${activeTab === "register" ? "register-card" : ""}`}
    >
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="login-title">
        {isForgotPassword
          ? "Reset Password"
          : activeTab === "login"
            ? "Hello! Welcome Back"
            : "Create Account"}
      </h1>

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

      {state?.error && activeTab === "login" && !isForgotPassword && (
        <div className="error-banner">{state.error}</div>
      )}

      {isForgotPassword && state?.success ? (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p
            style={{
              fontSize: "0.8rem",
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
                <div className="input-wrapper">
                  <User className="input-icon" size={14} />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={14} />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={14} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your Password"
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
          )}

          {!isForgotPassword && activeTab === "register" && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={14} />
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
            </div>
          )}

          {!isForgotPassword && activeTab === "login" && (
            <div className="options-row">
              <label className="remember-label">
                <input type="checkbox" name="rememberMe" />
                Remember me
              </label>
              <button
                type="button"
                className="forgot-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password ?
              </button>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending
              ? "Please wait..."
              : isForgotPassword
                ? "Send Reset Link"
                : activeTab === "login"
                  ? "Sign In"
                  : "Create Account"}
          </button>

          {isForgotPassword && (
            <div className="card-footer" style={{ marginTop: "0.8rem" }}>
              <button
                type="button"
                className="toggle-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onClick={() => setIsForgotPassword(false)}
              >
                <ArrowLeft size={12} /> Back to Sign In
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
                      Create Account !
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
                      Sign In !
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
