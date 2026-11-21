import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import CommunityBar from "@/components/landing/CommunityBar/CommunityBar";
import CuratedForYou from "@/components/landing/CuratedForYou/CuratedForYou";
import Footer from "@/components/landing/Footer/Footer";
import Hero from "@/components/landing/Hero/Hero";
import LandingStorySections from "@/components/landing/LandingStorySections";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import LandingProductCarousel from "@/components/landing/NewArrivals/LandingProductCarousel";
import OfferBar from "@/components/landing/OfferBar/OfferBar";
import ServiceFeatures from "@/components/landing/ServiceFeatures/ServiceFeatures";
import Testimonials from "@/components/landing/Testimonials/Testmonials";
import TopPicks from "@/components/landing/TopPicks/TopPicks";

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
    <main className="min-h-screen bg-[#10051b]">
      <LoginOfferBar />
      <Navbar />
      <Hero />
      <OfferBar />
      <CommunityBar />
      <Suspense>
        <LandingProductCarousel section="new-arrivals" />
      </Suspense>
      <CuratedForYou />
      <LandingStorySections />
      <ServiceFeatures />
      <TopPicks />
      <Testimonials />
      <Footer />
    </main>
  );
}
