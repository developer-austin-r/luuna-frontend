import React from "react";

import { LoginForm } from "@/components/auth";

import "./login.css";

export default function LoginPage(): React.JSX.Element {
  return (
    <main className="login-wrapper">
      <LoginForm />
    </main>
  );
}
