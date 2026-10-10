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
      const url = `${apiBaseUrl.replace(/\/$/, '')}/auth/forgot-password`;
      const bodyStr = JSON.stringify({ email });
      console.log('API URL:', url);
      console.log('Request body:', bodyStr);

      const forgotResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyStr,
      });

      console.log('Response status:', forgotResponse.status);
      const resData = await forgotResponse.json().catch(() => ({}));
      console.log('Response data:', resData);

      if (!forgotResponse.ok) {
        const err = resData.error || resData.message;
        return { error: (Array.isArray(err) ? err.join(", ") : err) || "Failed to send reset email." };
      }
      
      return { success: resData.message || "If the account exists, a reset link has been sent." };
    } catch (err: any) {
      console.error('Fetch error:', err);
      return {
        error: `Fetch failed: ${err.message || "An unexpected error occurred."}`,
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
      const url = `${apiBaseUrl.replace(/\/$/, '')}/auth/signup`;
      const bodyStr = JSON.stringify({ name, email, password, confirmPassword });
      console.log('API URL:', url);
      console.log('Request body:', bodyStr);

      const signupResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyStr,
      });

      console.log('Response status:', signupResponse.status);
      const resData = await signupResponse.json().catch(() => ({}));
      console.log('Response data:', resData);

      if (!signupResponse.ok) {
        const err = resData.error || resData.message;
        return { error: (Array.isArray(err) ? err.join(", ") : err) || "Registration failed." };
      }

      return { success: resData.message || "Registration successful." };

    } catch (err: any) {
      console.error('Fetch error:', err);
      return {
        error: `Fetch failed: ${err.message || "An unexpected error occurred during registration."}`,
      };
    }
  }

  if (!email || !password) {
    return { error: "Please enter email and password." };
  }

  const rememberMe = formData.get("rememberMe") === "on";
  let redirectUrl = "";

  try {
    const url = `${apiBaseUrl.replace(/\/$/, '')}/auth/login`;
    const bodyStr = JSON.stringify({ email, password, rememberMe });
    console.log('API URL:', url);
    console.log('Request body:', bodyStr);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyStr,
    });

    console.log('Response status:', response.status);
    const resData = await response.clone().json().catch(() => ({}));
    console.log('Response data:', resData);

    if (!response.ok) {
      const err = resData.error || resData.message;
      return { error: (Array.isArray(err) ? err.join(", ") : err) || "Invalid email or password." };
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
    } else if (role === "billing user") {
      redirectUrl = "/admin/billing";
    } else {
      redirectUrl = "/";
    }
  } catch (err: any) {
    console.error('Fetch error:', err);
    return { error: `Fetch failed: ${err.message || "An unexpected error occurred."}` };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return { success: "Login successful!" };
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
    const url = `${apiBaseUrl.replace(/\/$/, '')}/auth/reset-password`;
    const bodyStr = JSON.stringify({ token, password, confirmPassword });
    console.log('API URL:', url);
    console.log('Request body:', bodyStr);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyStr,
    });

    console.log('Response status:', response.status);
    const resData = await response.json().catch(() => ({}));
    console.log('Response data:', resData);

    if (!response.ok) {
      const err = resData.error || resData.message;
      return { error: (Array.isArray(err) ? err.join(", ") : err) || "Failed to reset password." };
    }

    return { success: resData.message || "Password reset successful! You can now log in." };
  } catch (err: any) {
    console.error('Fetch error:', err);
    return { error: `Fetch failed: ${err.message || "An unexpected error occurred."}` };
  }
}
