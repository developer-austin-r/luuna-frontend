import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import {
  getProductCatalog,
  getProductImages,
} from "@/services/storefront-products";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const requestedPage = Number((await searchParams).page);
  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0 &&
    requestedPage <= 100_000
      ? requestedPage
      : 1;
  const { data: products, meta } = await getProductCatalog(page);

  return (
    <div className="flex min-h-screen flex-col bg-[#10051b] text-white">
      <LoginOfferBar />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
        <h1 className="mb-6 text-3xl font-bold">Products</h1>
        {products.length === 0 && <p>No products found.</p>}
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const [image] = getProductImages(product);
            return (
              <li key={product.id}>
                <Link
                  href={`/products/${product.id}`}
                  className="block h-full rounded-xl border border-white/20 bg-[#160b2a] p-3 hover:border-white/60"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-white/5">
                    {image ? (
                      <Image
                        src={image}
                        alt=""
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain"
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-sm text-gray-300">
                        No image available
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold break-words">{product.name}</h2>
                  <p>{priceFormatter.format(Number(product.finalPrice))}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        {(meta.hasPreviousPage || meta.hasNextPage) && (
          <nav aria-label="Product pages" className="mt-8 flex gap-6">
            {meta.hasPreviousPage && (
              <Link href={`/products?page=${page - 1}`}>Previous page</Link>
            )}
            {meta.hasNextPage && (
              <Link href={`/products?page=${page + 1}`}>Next page</Link>
            )}
          </nav>
        )}
      </main>
      <Footer />
    </div>
  );
}
