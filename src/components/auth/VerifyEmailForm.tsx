"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";

import { useToast } from "@/providers/toast-provider";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const { success: toastSuccess, error: toastError } = useToast();
  const [message, setMessage] = useState<string>(
    "Verifying your email address...",
  );
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    // Prevent double verification attempts
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3001";

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          setStatus("success");
          setMessage(
            data.message || "Your email has been verified successfully!",
          );
          toastSuccess(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(
            data.message ||
              "Email verification failed. The token may be invalid or expired.",
          );
          toastError(data.message || "Verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.message || "An unexpected error occurred during verification.",
        );
        toastError(err.message || "Network or server error.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="login-panel">
      <div className="auth-card-container">
        <h1 className="login-header-title">
          {status === "loading"
            ? "Verifying Account"
            : status === "success"
              ? "Account Verified"
              : "Verification Failed"}
        </h1>

        <div
          className="glass-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "260px",
            textAlign: "center",
            padding: "2.25rem",
          }}
        >
          {status === "loading" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <Loader2
                className="animate-spin"
                style={{ color: "#825fa7", width: "3.5rem", height: "3.5rem" }}
              />
              <p className="subtitle" style={{ margin: 0 }}>
                Please wait while we confirm your email address...
              </p>
            </div>
          )}

          {status === "success" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <CheckCircle2
                style={{ color: "#4ade80", width: "3.5rem", height: "3.5rem" }}
              />
              <p className="subtitle" style={{ color: "#e2e8f0", margin: 0 }}>
                {message}
              </p>
              <a
                href="/login"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                  marginTop: "0.5rem",
                  width: "100%",
                }}
              >
                Continue to Sign In <ArrowRight size={16} />
              </a>
            </div>
          )}

          {status === "error" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <XCircle
                style={{ color: "#ef4444", width: "3.5rem", height: "3.5rem" }}
              />
              <p className="subtitle" style={{ color: "#fca5a5", margin: 0 }}>
                {message}
              </p>
              <a
                href="/register"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  marginTop: "0.5rem",
                  width: "100%",
                }}
              >
                Back to Register
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
