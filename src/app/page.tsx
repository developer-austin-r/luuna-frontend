import { redirect } from "next/navigation";

/**
 * Root page — redirect to the admin dashboard.
 * The middleware will intercept this and redirect unauthenticated users to /login.
 */
export default function Home() {
  redirect("/admin/dashboard");
}

