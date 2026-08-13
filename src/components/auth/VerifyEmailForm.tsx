"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your email address...");
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    // Prevent double verification attempts in React strict mode
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
          setMessage(data.message || "Your email has been verified successfully!");
          toast.success("Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Email verification failed. The token may be invalid or expired.");
          toast.error(data.message || "Verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "An unexpected error occurred during verification.");
        toast.error("Network or server error.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", textAlign: "center", padding: "2.5rem" }}>
      <Toaster position="top-right" reverseOrder={false} />

      {status === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <Loader2 className="animate-spin" style={{ color: "#3b82f6", width: "4rem", height: "4rem" }} />
          <h1 className="login-title" style={{ margin: 0 }}>Verifying Your Account</h1>
          <p className="subtitle" style={{ margin: 0 }}>Please wait while we confirm your email address...</p>
        </div>
      )}

      {status === "success" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <CheckCircle2 style={{ color: "#10b981", width: "4rem", height: "4rem" }} />
          <h1 className="login-title" style={{ margin: 0 }}>Email Verified!</h1>
          <p className="subtitle" style={{ color: "#e2e8f0", margin: 0 }}>{message}</p>
          <a
            href="/login"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: 600
            }}
          >
            Continue to Sign In <ArrowRight size={16} />
          </a>
        </div>
      )}

      {status === "error" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <XCircle style={{ color: "#ef4444", width: "4rem", height: "4rem" }} />
          <h1 className="login-title" style={{ margin: 0 }}>Verification Failed</h1>
          <p className="subtitle" style={{ color: "#fca5a5", margin: 0 }}>{message}</p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <a
              href="/register"
              className="btn-primary"
              style={{
                display: "inline-block",
                textDecoration: "none",
                padding: "0.75rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              Back to Register
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
