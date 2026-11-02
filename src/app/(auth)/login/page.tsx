import { Suspense } from "react";

import { LoginForm } from "@/components/auth";

import "./login.css";

export default function LoginPage() {
  return (
    <main className="login-wrapper">
      <Suspense fallback={<div className="login-panel" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
