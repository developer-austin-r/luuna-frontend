import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Category from "@/components/landing/Category/Category";
import CommunityBar from "@/components/landing/CommunityBar/CommunityBar";
import CuratedForYou from "@/components/landing/CuratedForYou/CuratedForYou";
import Footer from "@/components/landing/Footer/Footer";
import Hero from "@/components/landing/Hero/Hero";
import Navbar from "@/components/landing/Navbar/Navbar";
import NewArrivals from "@/components/landing/NewArrivals/NewArrivals";
import OfferBar from "@/components/landing/OfferBar/OfferBar";
import ProductShowcase from "@/components/landing/ProductShowcase/ProductShowcase";
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
          const isAdminRole = role === "admin" || role === "billing user";
          if (isAdminRole) {
            redirect("/admin/dashboard");
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <main>
      <Navbar />
      <Hero />
      <ServiceFeatures />
      <OfferBar />
      <CommunityBar />
      <NewArrivals />
      <CuratedForYou />
      <Category />
      <TopPicks />
      <Testimonials />
      <ProductShowcase />
      <Footer />
    </main>
  );
}
