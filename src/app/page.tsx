import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import CommunityBar from "@/components/landing/CommunityBar/CommunityBar";
import CuratedForYou from "@/components/landing/CuratedForYou/CuratedForYou";
import Footer from "@/components/landing/Footer/Footer";
import Hero from "@/components/landing/Hero/Hero";
import LandingStorySections from "@/components/landing/LandingStorySections";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import NewArrivals from "@/components/landing/NewArrivals/NewArrivals";
import OfferBar from "@/components/landing/OfferBar/OfferBar";
import Testimonials from "@/components/landing/Testimonials/Testmonials";

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

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
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <main>
      <LoginOfferBar />
      <Navbar />
      <Hero />
      <OfferBar />
      <CommunityBar />
      <NewArrivals />
      <CuratedForYou />
      <LandingStorySections />
      <Testimonials />
      <Footer />
    </main>
  );
}
