"use client";

import React, { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginThunk } from "@/redux/slices/auth-slice";

import { SocialButtons } from "./SocialButtons";
import { type AuthTabType, TabSwitcher } from "./TabSwitcher";

interface LoginFormInputs {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  rememberMe?: boolean;
}

export function LoginForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<AuthTabType>("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [resetSent, setResetSent] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  // Watch password to compare with confirmPassword
  const passwordValue = watch("password");

  const handleTabChange = (tab: AuthTabType): void => {
    setActiveTab(tab);
    reset();
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    if (isForgotPassword) {
      toast.success("Password reset instructions sent to your email!");
      setResetSent(true);
      return;
    }

    if (activeTab === "login") {
      const result = await dispatch(
        loginThunk({
          email: data.email,
          password: data.password || "",
          rememberMe: !!data.rememberMe,
        }),
      );

      if (loginThunk.fulfilled.match(result)) {
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error((result.payload as string) || "Invalid email or password");
      }
    } else {
      toast.success("Account created successfully! Please sign in.");
      reset();
      setActiveTab("login");
    }
  };

  const onError = () => {
    toast.error("Please fill in all required fields correctly.");
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

      {error && activeTab === "login" && !isForgotPassword && (
        <div className="error-banner">{error}</div>
      )}

      {isForgotPassword && resetSent ? (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#4ade80",
              marginBottom: "1rem",
            }}
          >
            Password reset link has been sent to your email address!
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setIsForgotPassword(false);
              setResetSent(false);
              reset();
            }}
          >
            Back to Login
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="form-body"
        >
          {!isForgotPassword && activeTab === "register" && (
            <div className="name-row">
              <div className="form-group">
                <label>First Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={14} />
                  <input
                    type="text"
                    placeholder="First Name"
                    className="form-input"
                    {...register("firstName", {
                      required: "Please enter your first name",
                    })}
                  />
                </div>
                {errors.firstName && (
                  <span className="error-banner" style={{ textAlign: "left" }}>
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={14} />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="form-input"
                    {...register("lastName", {
                      required: "Please enter your last name",
                    })}
                  />
                </div>
                {errors.lastName && (
                  <span className="error-banner" style={{ textAlign: "left" }}>
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={14} />
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input"
                {...register("email", {
                  required: "Please enter your email",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="error-banner" style={{ textAlign: "left" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          {!isForgotPassword && (
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  className="form-input"
                  {...register("password", {
                    required: "Please enter your password",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-banner" style={{ textAlign: "left" }}>
                  {errors.password.message}
                </span>
              )}
            </div>
          )}

          {!isForgotPassword && activeTab === "register" && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={14} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your Password"
                  className="form-input"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
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
              {errors.confirmPassword && (
                <span className="error-banner" style={{ textAlign: "left" }}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          )}

          {!isForgotPassword && activeTab === "login" && (
            <div className="options-row">
              <label className="remember-label">
                <input type="checkbox" {...register("rememberMe")} />
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

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading
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
