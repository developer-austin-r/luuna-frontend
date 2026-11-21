import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, Shapes, SlidersHorizontal, Tag } from "lucide-react";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import {
  getCategoryCatalog,
  getProductImages,
} from "@/services/storefront-products";

const categories = {
  anime: "Anime",
  dc: "DC",
  marvel: "Marvel",
  kpop: "K-Pop",
  nostalgia: "Nostalgia",
  wheels: "Wheels",
};

const aliases: Record<string, string> = {
  kpop: "k-pop",
  "k-pop": "kpop",
  nostalgia: "nostalgic",
  nostalgic: "nostalgia",
};

const sorts = {
  latest: ["createdAt", "desc"],
  oldest: ["createdAt", "asc"],
  "price-low": ["finalPrice", "asc"],
  "price-high": ["finalPrice", "desc"],
} as const;

const price = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const control =
  "rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#140824]";

const countFont = localFont({
  src: "../../../assets/fonts/black-han-sans.ttf",
  display: "swap",
  preload: false,
});

const toolbarPill =
  "flex h-[30px] cursor-pointer list-none items-center gap-1.5 rounded-full bg-white px-3 text-sm leading-none text-[#140824] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-xl [&::-webkit-details-marker]:hidden";

const pillChevron =
  "ml-auto shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none";

function validPrice(value: string | string[] | undefined) {
  return typeof value === "string" && /^\d{1,10}(?:\.\d{1,2})?$/.test(value)
    ? value
    : "";
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const sort =
    typeof search.sort === "string" && Object.hasOwn(sorts, search.sort)
      ? (search.sort as keyof typeof sorts)
      : "latest";
  const requestedPage = Number(search.page);
  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage >= 1 &&
    requestedPage <= 100_000
      ? requestedPage
      : 1;
  const minPrice = validPrice(search.minPrice);
  const maxPrice = validPrice(search.maxPrice);
  const [sortBy, sortOrder] = sorts[sort];
  const query = new URLSearchParams({ page: String(page) });
  if (sortBy) query.set("sortBy", sortBy);
  if (sortOrder) query.set("sortOrder", sortOrder);
  if (minPrice) query.set("minPrice", minPrice);
  if (maxPrice) query.set("maxPrice", maxPrice);

  const catalog =
    (await getCategoryCatalog(slug, query)) ??
    (Object.hasOwn(aliases, slug)
      ? await getCategoryCatalog(aliases[slug]!, query)
      : null);
  const landingCategory = Object.hasOwn(categories, slug)
    ? categories[slug as keyof typeof categories]
    : undefined;
  const name = catalog?.category.name ?? landingCategory;
  if (!name) notFound();
  const path = `/categories/${encodeURIComponent(slug)}`;
  const image = catalog?.category.image;
  const products = catalog?.products ?? [];
  const meta = catalog?.meta;

  function pageHref(nextPage: number) {
    const params = new URLSearchParams({ sort, page: String(nextPage) });
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    return `${path}?${params}`;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#140824] text-white">
      <LoginOfferBar />
      <Navbar />
      <main className="flex-1">
        <div className="bg-white text-[#140824]">
          <div className="mx-auto flex min-h-24 max-w-[1440px] items-center justify-between gap-4 px-[8%] sm:min-h-32">
            <h1 className="break-words text-2xl font-black uppercase tracking-[0.16em] sm:text-4xl lg:text-5xl">
              {name}
            </h1>
            {image && (
              <div className="relative h-16 w-24 shrink-0 sm:h-24 sm:w-40 lg:w-52">
                <Image
                  src={image}
                  alt=""
                  fill
                  unoptimized
                  sizes="208px"
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-4 sm:px-[5.5%] sm:pb-28">
          <form
            action={path}
            className="relative mb-8 flex flex-wrap items-center gap-x-4 gap-y-3 text-xs sm:gap-x-6"
          >
            <details className="group relative">
              <summary
                className={`${toolbarPill} min-w-[105px] sm:min-w-[138px]`}
              >
                <SlidersHorizontal size={17} aria-hidden="true" />
                Filter
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className={pillChevron}
                />
              </summary>
              <div className="absolute left-0 top-full z-10 mt-2 grid w-48 gap-2 rounded-lg bg-white p-3 text-[#140824] shadow-lg">
                <label>
                  Min price{" "}
                  <input
                    className="w-full rounded border px-2 py-1"
                    name="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={minPrice}
                  />
                </label>
                <label>
                  Max price{" "}
                  <input
                    className="w-full rounded border px-2 py-1"
                    name="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={maxPrice}
                  />
                </label>
                <button
                  type="submit"
                  className="rounded bg-[#140824] py-1 text-white"
                >
                  Apply filters
                </button>
              </div>
            </details>
            <details className="group relative">
              <summary
                className={`${toolbarPill} min-w-[125px] sm:min-w-[170px]`}
              >
                <Shapes size={18} aria-hidden="true" />
                Category
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className={pillChevron}
                />
              </summary>
              <ul className="absolute left-0 top-full z-10 mt-2 min-w-32 rounded-lg bg-white p-2 text-[#140824] shadow-lg">
                {Object.entries(categories).map(([key, label]) => (
                  <li key={key}>
                    <Link
                      className="block rounded px-2 py-1 hover:bg-purple-100"
                      href={`/categories/${key}`}
                      aria-current={key === slug ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            <span
              className={`${countFont.className} mr-auto inline-flex items-center gap-1.5 whitespace-nowrap text-sm leading-none text-[#8c69a8] sm:text-xl`}
            >
              <Tag
                size={20}
                fill="currentColor"
                stroke="#140824"
                aria-hidden="true"
              />
              {meta?.total ?? 0} Products
            </span>
            <label className="flex items-center gap-2">
              Sort by
              <select className={control} name="sort" defaultValue={sort}>
                <option value="latest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
            <button type="submit" className={control}>
              Apply
            </button>
          </form>

          {products.length === 0 && (
            <p className="py-10 text-purple-100">
              No products found in {name}.
            </p>
          )}
          <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {products.map((product) => {
              const [productImage] = getProductImages(product);
              const original = Number(product.basePrice);
              const current = Number(product.finalPrice);
              const discount =
                original > current
                  ? Math.round((1 - current / original) * 100)
                  : 0;
              return (
                <li key={product.id} className="min-w-0">
                  <Link
                    href={`/products/${encodeURIComponent(product.id)}`}
                    prefetch={false}
                    className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-white/10">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt=""
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform group-hover:scale-[1.03] motion-reduce:transition-none"
                        />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center text-xs text-purple-100">
                          No image available
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#140824]">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <h2 className="break-words text-sm font-semibold">
                      {product.name}
                    </h2>
                    <p className="mt-1 flex flex-wrap gap-x-2 text-xs">
                      {discount > 0 && (
                        <s className="text-purple-200">
                          {price.format(original)}
                        </s>
                      )}
                      <span>{price.format(current)}</span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
          {(meta?.hasPreviousPage || meta?.hasNextPage) && (
            <nav
              aria-label="Category product pages"
              className="mt-8 flex gap-4"
            >
              {meta.hasPreviousPage && (
                <Link href={pageHref(page - 1)}>Previous page</Link>
              )}
              {meta.hasNextPage && (
                <Link href={pageHref(page + 1)}>Next page</Link>
              )}
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
