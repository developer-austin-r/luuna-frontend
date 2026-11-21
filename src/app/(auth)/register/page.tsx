import { Suspense } from "react";

import { LoginForm } from "@/components/auth";
import { AuthLoading } from "@/components/loading/AccountSkeletons";

import "../login/login.css";

export default function RegisterPage() {
  return (
    <main className="login-wrapper">
      <Suspense fallback={<AuthLoading />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
