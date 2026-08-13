"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface FormState {
  error?: string;
  success?: string;
}

export async function authenticate(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const mode = formData.get("mode") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3001";

  if (mode === "forgot") {
    if (!email) return { error: "Please enter your email." };
    try {
      const forgotResponse = await fetch(`${apiBaseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!forgotResponse.ok) {
        const errorData = await forgotResponse.json().catch(() => ({}));
        return { error: errorData.message || "Failed to send reset email." };
      }
      return { success: "If the account exists, a reset link has been sent." };
    } catch (err: any) {
      return {
        error: err.message || "An unexpected error occurred.",
      };
    }
  }

  if (mode === "register") {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!firstName || !lastName || !email || !password) {
      return { error: "All fields are required." };
    }
    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    const name = `${firstName} ${lastName}`.trim();

    try {
      const signupResponse = await fetch(`${apiBaseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json().catch(() => ({}));
        return { error: errorData.message || "Registration failed." };
      }
    } catch (err: any) {
      return {
        error:
          err.message || "An unexpected error occurred during registration.",
      };
    }
  }

  if (!email || !password) {
    return { error: "Please enter email and password." };
  }

  const rememberMe = formData.get("rememberMe") === "on";
  let redirectUrl = "";

  try {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Invalid email or password." };
    }

    const setCookieHeaders = response.headers.getSetCookie();
    const cookieStore = await cookies();

    for (const cookieStr of setCookieHeaders) {
      const parts = cookieStr.split(";").map((p) => p.trim());
      const nameValue = parts[0];
      if (!nameValue) continue;

      const attributes = parts.slice(1);
      const equalsIdx = nameValue.indexOf("=");
      if (equalsIdx !== -1) {
        const name = nameValue.substring(0, equalsIdx);
        const value = nameValue.substring(equalsIdx + 1);

        const options: any = {};
        for (const attr of attributes) {
          const lower = attr.toLowerCase();
          if (lower === "httponly") {
            options.httpOnly = true;
          } else if (lower === "secure") {
            options.secure = true;
          } else if (lower.startsWith("samesite=")) {
            const val = attr.substring(9).toLowerCase();
            options.sameSite =
              val === "lax" || val === "strict" || val === "none"
                ? val
                : undefined;
          } else if (lower.startsWith("path=")) {
            options.path = attr.substring(5);
          } else if (lower.startsWith("max-age=")) {
            options.maxAge = parseInt(attr.substring(8), 10);
          } else if (lower.startsWith("domain=")) {
            options.domain = attr.substring(7) || undefined;
          }
        }
        cookieStore.set(name, value, options);
      }
    }

    let role = "";
    const accessToken = cookieStore.get("access_token")?.value;
    if (accessToken) {
      try {
        const parts = accessToken.split(".");
        const payloadPart = parts[1];
        if (parts.length === 3 && payloadPart) {
          const payload = JSON.parse(
            Buffer.from(payloadPart, "base64").toString("utf-8"),
          );
          role = payload.role?.toLowerCase() || "";
        }
      } catch (e) {
        // ignore
      }
    }

    if (role === "admin") {
      redirectUrl = "/admin/dashboard";
    } else {
      redirectUrl = "/";
    }
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return {};
}

export async function resetPasswordAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3001";

  try {
    const response = await fetch(`${apiBaseUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Failed to reset password." };
    }
    
    return { success: "Password reset successful! You can now log in." };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}
