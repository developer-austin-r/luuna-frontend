import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientDashboard } from "@/components/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  let userEmail = "";
  let shouldRenderClient = false;

  if (accessToken) {
    try {
      const parts = accessToken.split(".");
      const payloadPart = parts[1];
      if (parts.length === 3 && payloadPart) {
        const payload = JSON.parse(
          Buffer.from(payloadPart, "base64").toString("utf-8"),
        );
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > currentTime) {
          const role = payload.role?.toLowerCase() || "";
          if (role === "admin") {
            redirect("/admin/dashboard");
          } else if (role === "billing user") {
            redirect("/admin/billing");
          } else {
            userEmail = payload.email || "Client User";
            shouldRenderClient = true;
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (shouldRenderClient) {
    return <ClientDashboard email={userEmail} />;
  }

  redirect("/login");
}
