import type { Metadata } from "next";

import ErrorPage from "@/components/common/ErrorPage/ErrorPage";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Luuna",
  description:
    "The page you are looking for does not exist or may have been moved.",
};

export default function NotFound() {
  return (
    <ErrorPage
      statusCode={404}
      heading="Oops! Page Not Found"
      description="The page you're looking for doesn't exist or may have been moved."
    />
  );
}
