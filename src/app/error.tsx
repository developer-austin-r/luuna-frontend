"use client";

import { useEffect } from "react";

import ErrorPage from "@/components/common/ErrorPage/ErrorPage";

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log unexpected client/server runtime error
    console.error("Luuna App Runtime Error:", error);
  }, [error]);

  return (
    <ErrorPage
      statusCode={500}
      heading="Oops! Something Went Wrong"
      description="Something unexpected happened. Please try again."
      reset={reset}
    />
  );
}
