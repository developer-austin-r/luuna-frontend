"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

import { ApiRequestError } from "@/services/api-client";
import { submitProductReview } from "@/services/product-reviews";
import { getProfileApi } from "@/services/profile";

const maxPhotos = 3;
const maxPhotoSize = 5 * 1024 * 1024;
const photoTypes = ["image/jpeg", "image/png", "image/webp"];

export default function ProductReviewForm({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();
  const [session, setSession] = useState<
    "loading" | "guest" | "signed-in" | "error"
  >("loading");
  const [sessionRetry, setSessionRetry] = useState(0);
  const [rating, setRating] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const [status, setStatus] = useState<"ready" | "submitting" | "submitted">(
    "ready",
  );
  const [error, setError] = useState("");
  const loginUrl = `/login?redirect=${encodeURIComponent(`/products/${productId}#reviews`)}`;

  useEffect(() => {
    const controller = new AbortController();
    getProfileApi({ signal: controller.signal, cache: "no-store" })
      .then(() => setSession("signed-in"))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setSession(
            error instanceof ApiRequestError && error.status === 401
              ? "guest"
              : "error",
          );
        }
      });
    return () => controller.abort();
  }, [sessionRetry]);

  function selectPhotos(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.currentTarget.files ?? []);
    setError("");
    if (
      selected.length > maxPhotos ||
      selected.some(
        (photo) =>
          photo.size > maxPhotoSize || !photoTypes.includes(photo.type),
      )
    ) {
      setError(
        "Choose up to 3 JPEG, PNG, or WebP photos, each 5 MB or smaller.",
      );
      event.currentTarget.value = "";
      setPhotos([]);
      return;
    }
    setPhotos(selected);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (session === "guest") {
      router.push(loginUrl);
      return;
    }
    if (session !== "signed-in" || submitting.current) return;
    if (!rating) {
      setError("Choose a star rating before submitting.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const review = String(form.get("review") ?? "").trim();
    if (!review) {
      setError("Enter your review before submitting.");
      return;
    }

    form.set("review", review);
    submitting.current = true;
    setError("");
    setStatus("submitting");

    try {
      await submitProductReview(productId, rating, form, photos);
      setStatus("submitted");
    } catch (error) {
      setStatus("ready");
      if (error instanceof ApiRequestError && error.status === 401) {
        router.push(loginUrl);
        return;
      }
      setError(
        error instanceof Error
          ? error.message
          : "Could not submit your review. Try again.",
      );
    } finally {
      submitting.current = false;
    }
  }

  return (
    <section
      aria-labelledby="write-a-review"
      className="min-w-0 rounded-2xl bg-white p-5 text-gray-950 shadow-sm sm:p-7"
    >
      <h3 id="write-a-review" className="mb-4 text-xl font-bold">
        Write a Review
      </h3>
      {session === "loading" && <p role="status">Checking sign-in…</p>}
      {session === "guest" && (
        <Link
          href={loginUrl}
          className="inline-block rounded-lg bg-[#140824] px-4 py-3 font-semibold text-white"
        >
          Sign in to write a review
        </Link>
      )}
      {session === "error" && (
        <div>
          <p>We couldn’t check your sign-in.</p>
          <button
            type="button"
            className="mt-2 font-semibold underline"
            onClick={() => {
              setSession("loading");
              setSessionRetry((value) => value + 1);
            }}
          >
            Try again
          </button>
        </div>
      )}
      {status === "submitted" && (
        <p
          role="status"
          className="rounded-lg bg-violet-50 p-4 text-violet-950"
        >
          Review submitted. It will appear on this page after an admin approves
          it.
        </p>
      )}
      {session === "signed-in" && status !== "submitted" && (
        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={status === "submitting"}
            className="grid min-w-0 gap-4"
          >
            <div
              role="radiogroup"
              aria-label="Star rating"
              className="flex flex-wrap gap-1"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <label
                  key={star}
                  className="cursor-pointer rounded p-1 focus-within:ring-2 focus-within:ring-violet-600"
                >
                  <input
                    className="sr-only"
                    type="radio"
                    value={star}
                    name="rating"
                    checked={rating === star}
                    onChange={() => setRating(star)}
                    aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                  />
                  <Star
                    aria-hidden="true"
                    className={
                      star <= rating
                        ? "fill-violet-700 text-violet-700"
                        : "text-gray-500"
                    }
                  />
                </label>
              ))}
            </div>
            <label className="grid gap-1 text-sm font-semibold">
              Title (optional)
              <input
                name="title"
                maxLength={100}
                className="min-w-0 rounded-lg border border-gray-300 p-2.5 font-normal"
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Your review
              <textarea
                name="review"
                rows={4}
                required
                maxLength={2000}
                className="min-w-0 rounded-lg border border-gray-300 p-2.5 font-normal"
              />
            </label>
            <div className="grid gap-2 rounded-lg border border-dashed border-violet-300 bg-violet-50 p-3">
              <label htmlFor="review-photos" className="text-sm font-semibold">
                Add photos (optional)
              </label>
              <p id="review-photo-hint" className="text-xs text-gray-700">
                Up to 3 JPEG, PNG, or WebP photos, 5 MB each.
              </p>
              <input
                ref={fileInput}
                id="review-photos"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={selectPhotos}
                aria-describedby="review-photo-hint"
                className="w-full min-w-0 text-sm file:mr-2 file:rounded file:bg-violet-200 file:px-2 file:py-1"
              />
              {photos.length > 0 && (
                <>
                  <ul className="space-y-1 break-all text-xs text-gray-700">
                    {photos.map((photo, index) => (
                      <li key={index}>{photo.name}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="justify-self-start text-sm underline"
                    onClick={() => {
                      if (fileInput.current) fileInput.current.value = "";
                      setPhotos([]);
                    }}
                  >
                    Clear photos
                  </button>
                </>
              )}
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="rounded-lg bg-[#140824] px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {status === "submitting" ? "Submitting…" : "Submit Review"}
            </button>
          </fieldset>
        </form>
      )}
    </section>
  );
}
