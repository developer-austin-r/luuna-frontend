import { Suspense } from "react";

import { LoginForm } from "@/components/auth";
import { AuthLoading } from "@/components/loading/AccountSkeletons";

import "./login.css";

export default function LoginPage() {
  return (
    <main className="login-wrapper">
      <Suspense fallback={<AuthLoading />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
