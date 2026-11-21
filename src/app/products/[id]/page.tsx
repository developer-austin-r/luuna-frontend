import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import {
  getProductById,
  getProductIdBySlug,
  getProductImages,
  isProductId,
} from "@/services/storefront-products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function loadProduct(reference: string) {
  if (!isProductId(reference)) {
    const product = await getProductIdBySlug(reference);
    if (!product) notFound();
    redirect(`/products/${product.id}`);
  }

  const product = await getProductById(reference);
  if (!product) notFound();
  return product;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await loadProduct((await params).id);
  return {
    title: product.name,
    description: product.shortDescription || product.description || undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await loadProduct((await params).id);

  return (
    <div className="min-h-screen bg-[#10051b] flex flex-col font-sans text-white">
      <LoginOfferBar />
      <Navbar />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
          <div className="lg:col-span-7 min-w-0">
            <ProductGallery
              key={product.id}
              productId={product.id}
              productName={product.name}
              images={getProductImages(product)}
            />
          </div>
          <div className="lg:col-span-5 min-w-0">
            <ProductInfo key={product.id} product={product} />
          </div>
        </div>
        <ProductReviews key={product.id} productId={product.id} />
      </main>
      <Footer />
    </div>
  );
}
