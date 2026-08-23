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

export default function Home() {
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
