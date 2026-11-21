import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  Shapes,
  SlidersHorizontal,
  Tag,
} from "lucide-react";

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

const sortLabels = {
  latest: "Newest",
  oldest: "Oldest",
  "price-low": "Price: low to high",
  "price-high": "Price: high to low",
} satisfies Record<keyof typeof sorts, string>;

const countFont = localFont({
  src: "../../../assets/fonts/black-han-sans.ttf",
  display: "swap",
  preload: false,
});

const toolbarPill =
  "flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full bg-white px-3.5 text-sm font-medium leading-tight text-[#140824] hover:bg-purple-50 group-open:bg-purple-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white [&::-webkit-details-marker]:hidden";

const pillChevron =
  "ml-auto shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none";

const dropdown =
  "absolute top-full z-20 mt-2 rounded-xl border border-purple-200 bg-white p-2 text-sm text-[#140824] shadow-xl";
const menuOption =
  "flex min-h-10 items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-purple-700";

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

  function pageHref(nextPage: number, nextSort = sort) {
    const params = new URLSearchParams({ sort: nextSort });
    if (nextPage > 1) params.set("page", String(nextPage));
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
          <div className="relative mb-8 flex flex-wrap items-center gap-3 border-b border-white/15 pb-4 sm:gap-4">
            <details name="category-toolbar" className="group relative">
              <summary className={`${toolbarPill} min-w-27`}>
                <SlidersHorizontal size={17} aria-hidden="true" />
                Filter
                {(minPrice || maxPrice) && (
                  <span className="rounded-full bg-purple-200 px-1.5 text-xs font-semibold">
                    <span className="sr-only">Active price limits: </span>
                    {Number(Boolean(minPrice)) + Number(Boolean(maxPrice))}
                  </span>
                )}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={pillChevron}
                />
              </summary>
              <form action={path} className={`${dropdown} left-0 w-64 p-4`}>
                <input type="hidden" name="sort" value={sort} />
                <fieldset>
                  <legend className="mb-3 font-semibold">Price range</legend>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs font-medium">
                      Min price (?)
                      <input
                        className="mt-1 block w-full rounded-lg border border-purple-200 px-2 py-2"
                        name="minPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={minPrice}
                      />
                    </label>
                    <label className="text-xs font-medium">
                      Max price (?)
                      <input
                        className="mt-1 block w-full rounded-lg border border-purple-200 px-2 py-2"
                        name="maxPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={maxPrice}
                      />
                    </label>
                  </div>
                </fieldset>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`${path}?sort=${sort}`}
                    className="rounded px-1 text-xs font-medium underline underline-offset-4"
                  >
                    Clear filters
                  </Link>
                  <button
                    type="submit"
                    className="rounded-full bg-[#140824] px-4 py-2 text-xs font-semibold text-white hover:bg-purple-950"
                  >
                    Apply filters
                  </button>
                </div>
              </form>
            </details>

            <details name="category-toolbar" className="group relative">
              <summary className={`${toolbarPill} min-w-32`}>
                <Shapes size={17} aria-hidden="true" />
                Category
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={pillChevron}
                />
              </summary>
              <ul className={`${dropdown} left-0 w-40`}>
                {Object.entries(categories).map(([key, label]) => {
                  const selected = key === slug || aliases[slug] === key;
                  return (
                    <li key={key}>
                      <Link
                        className={`${menuOption} ${selected ? "bg-purple-100 font-semibold" : ""}`}
                        href={`/categories/${key}`}
                        aria-current={selected ? "page" : undefined}
                      >
                        {label}
                        {selected && <Check size={16} aria-hidden="true" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>

            <span
              className={`${countFont.className} order-last inline-flex w-full items-center gap-1.5 text-sm text-[#b391ce] sm:order-none sm:mr-auto sm:w-auto`}
            >
              <Tag size={18} aria-hidden="true" />
              {meta?.total ?? 0} Products
            </span>

            <details
              name="category-toolbar"
              className="group sm:relative sm:ml-auto"
            >
              <summary className={toolbarPill}>
                <ArrowDownUp size={16} aria-hidden="true" />
                <span className="sr-only">Sort by:</span>
                {sortLabels[sort]}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={pillChevron}
                />
              </summary>
              <ul className={`${dropdown} right-0 w-48`}>
                {(Object.keys(sortLabels) as (keyof typeof sortLabels)[]).map(
                  (key) => (
                    <li key={key}>
                      <Link
                        className={`${menuOption} ${key === sort ? "bg-purple-100 font-semibold" : ""}`}
                        href={pageHref(1, key)}
                        aria-current={key === sort ? "true" : undefined}
                      >
                        {sortLabels[key]}
                        {key === sort && <Check size={16} aria-hidden="true" />}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </details>
          </div>

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
