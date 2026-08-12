"use server";

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

  if (mode === "forgot") {
    if (!email) return { error: "Please enter your email." };
    return { success: "Password reset link sent to your email!" };
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

    return { success: "Account created successfully! Please sign in." };
  }

  if (!email || !password) {
    return { error: "Please enter email and password." };
  }

  redirect("/dashboard");
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

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  redirect("/login");
}
