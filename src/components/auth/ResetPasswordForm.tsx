"use client";

import React, { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

interface ResetPasswordInputs {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    console.log("Updating password with token:", token, data.password);

    // 🔔 Toast Message சேர்க்கப்பட்டுள்ளது
    toast.success("Password reset successful! Redirecting to login...");
    setIsSuccess(true);

    setTimeout(() => {
      router.push("/login");
    }, 2500);
  };

  const onError = () => {
    toast.error("Please fix the errors in the form.");
  };

  return (
    <div className="glass-card">
      {/* 🔔 Toast Notification Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="login-title">Set New Password</h1>
      <p className="subtitle">Please enter your new password below.</p>

      {isSuccess ? (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ fontSize: "0.85rem", color: "#4ade80", fontWeight: 600 }}>
            Password reset successful! Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)} className="form-body">
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={14} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="form-input"
                {...register("password", {
                  required: "Please enter your new password",
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

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={14} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="form-input"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-banner" style={{ textAlign: "left" }}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "0.5rem" }}
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}
