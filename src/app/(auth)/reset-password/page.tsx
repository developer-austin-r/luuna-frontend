import React, { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth";

import "../login/login.css";

export default function ResetPasswordPage(): React.JSX.Element {
  return (
    <main className="login-wrapper">
      <Suspense fallback={<div className="glass-card">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
