import React from "react";
import type { Metadata } from "next";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import BatmanBanner from "@/components/product/BatmanBanner";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedItems from "@/components/product/RelatedItems";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const readableTitle = slug
    ? slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Batman vs Joker | Arkham City Edition";

  return {
    title: `${readableTitle} | Luuna Collectibles`,
    description:
      "Batman vs Joker - Arkham City Edition collectible figure. Captured in a dramatic mid-battle pose with intricate detailing. Free 7 days replacement and PAN India Delivery.",
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Formatted product details matching reference screenshot
  const productData = {
    name: "Batman vs Joker | Arkham City Edition",
    subtitle: "Gotham's Eternal Duel",
    rating: 4,
    reviewsCount: 150,
    inStock: true,
    originalPrice: 3500,
    discountedPrice: 2500,
    size: "10cm",
    brand: "PVC statues",
    description:
      "Bring the legendary clash of Gotham's eternal rivals to life with this Batman vs. Joker – Arkham City Edition Figure. Captured in a dramatic mid-battle pose, this collectible showcases Batman's unyielding strength as he confronts the Joker with raw intensity. The sculpt highlights intricate detailing—from Batman's armoured suit and flowing cape to the Joker's iconic purple coat and chaotic expression. The gritty, industrial base enhances the scene, making it a striking centerpiece for any DC or gaming fan's collection.",
  };

  return (
    <div className="min-h-screen bg-[#10051b] flex flex-col font-sans text-white">
      {/* 1. Header: Existing LoginOfferBar and Navbar */}
      <LoginOfferBar />
      <Navbar />

      {/* 2. Brand Banner: White background with BATMAN and silhouette */}
      <BatmanBanner />

      {/* 3. Main Product Section */}
      <main className="flex-1 w-full bg-[#10051b]">
        {/* Top Product Hero Details */}
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* Left Column: Product Gallery with Thumbnails & Main Image */}
            <div className="lg:col-span-7 w-full">
              <ProductGallery productName={productData.name} />
            </div>

            {/* Right Column: Product Metadata, Pricing, Actions, Info Badges */}
            <div className="lg:col-span-5 w-full">
              <ProductInfo product={productData} />
            </div>
          </div>
        </div>

        {/* 4. Reused Landing Page New Arrivals Design for Related Items & Accessories */}
        <RelatedItems />

        {/* 5. Product Reviews Section (Rating Breakdown, Customer Photos, Reviews Grid & Write a Review) */}
        <ProductReviews />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
