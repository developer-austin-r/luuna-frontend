"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

import {
  getProductReviews,
  type ProductReviewPage,
} from "@/services/product-reviews";

import ProductReviewForm from "./ProductReviewForm";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

export default function ProductReviews({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ProductReviewPage | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getProductReviews(productId, page, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) setResult(response);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [productId, page, retry]);

  function goToPage(nextPage: number) {
    setResult(null);
    setError(false);
    setPage(nextPage);
  }

  return (
    <section
      id="reviews"
      aria-labelledby="product-reviews-title"
      className="scroll-mt-6 bg-[#160b2a] py-8 sm:py-12"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <h2
          id="product-reviews-title"
          className="mb-6 text-2xl font-black uppercase text-white sm:text-3xl"
        >
          Reviews
        </h2>
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="grid min-w-0 gap-5 lg:col-span-8">
            {error && (
              <div
                role="alert"
                className="rounded-2xl bg-white p-5 text-gray-950"
              >
                Reviews couldn’t be loaded.{" "}
                <button
                  type="button"
                  className="font-semibold underline"
                  onClick={() => {
                    setError(false);
                    setRetry((value) => value + 1);
                  }}
                >
                  Try again
                </button>
              </div>
            )}
            {!error && !result && <p role="status">Loading reviews…</p>}
            {result && (
              <>
                <div className="grid gap-5 rounded-2xl bg-white p-5 text-gray-950 sm:grid-cols-[auto_1fr] sm:p-7">
                  {result.summary.count ? (
                    <>
                      <div className="min-w-32 text-center">
                        <div className="text-5xl font-black">
                          {result.summary.average.toFixed(1)}
                        </div>
                        <p className="mt-2 text-sm text-gray-700">
                          out of 5 · {result.summary.count}{" "}
                          {result.summary.count === 1 ? "review" : "reviews"}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {result.summary.breakdown.map(({ stars, count }) => (
                          <div
                            className="flex items-center gap-3 text-xs"
                            key={stars}
                          >
                            <span className="w-12">
                              {stars} {stars === 1 ? "star" : "stars"}
                            </span>
                            <progress
                              className="min-w-0 flex-1 accent-violet-700"
                              value={count}
                              max={result.summary.count}
                              aria-label={`${stars} star ratings`}
                            />
                            <span className="min-w-6 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="sm:col-span-2">
                      No reviews yet. Be the first to write one.
                    </p>
                  )}
                </div>
                {result.reviews.length > 0 && (
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {result.reviews.map((review) => (
                      <li
                        key={review.id}
                        className="min-w-0 rounded-2xl bg-white p-5 text-gray-950"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="font-semibold">{review.author}</span>
                          <time
                            className="text-gray-600"
                            dateTime={review.createdAt}
                          >
                            {dateFormatter.format(new Date(review.createdAt))}
                          </time>
                        </div>
                        <p className="my-2 flex items-center gap-1 text-sm font-semibold text-violet-800">
                          <Star
                            className="size-4 fill-current"
                            aria-hidden="true"
                          />{" "}
                          {review.starRate}/5
                        </p>
                        {review.title && (
                          <h3 className="break-words font-bold">
                            {review.title}
                          </h3>
                        )}
                        {review.review && (
                          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
                            {review.review}
                          </p>
                        )}
                        {review.images.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {review.images.map((image, index) => (
                              <a
                                key={image}
                                href={image}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open review photo ${index + 1} in a new tab`}
                                className="relative block size-16 overflow-hidden rounded-lg bg-gray-100"
                              >
                                <Image
                                  src={image}
                                  alt=""
                                  fill
                                  unoptimized
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {result.totalPages > 1 && (
                  <nav
                    aria-label="Review pages"
                    className="flex flex-wrap items-center gap-3 text-sm"
                  >
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => goToPage(page - 1)}
                      className="rounded-lg border border-white/40 px-3 py-2 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span>
                      Page {page} of {result.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= result.totalPages}
                      onClick={() => goToPage(page + 1)}
                      className="rounded-lg border border-white/40 px-3 py-2 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
          <div className="min-w-0 lg:col-span-4">
            <ProductReviewForm productId={productId} />
          </div>
        </div>
      </div>
    </section>
  );
}
