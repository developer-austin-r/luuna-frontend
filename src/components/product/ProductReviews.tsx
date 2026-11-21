"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Camera, ChevronRight, Star, X } from "lucide-react";

interface ReviewItem {
  id: string;
  title: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  images?: string[];
}

const defaultReviews: ReviewItem[] = [
  {
    id: "1",
    title: "Love it",
    rating: 5,
    comment: "Amazing quality Toy!! Thanks For Luuna...",
    author: "Venkatesh kumar",
    date: "2 Days ago",
    images: ["/images/hero-1.jpg", "/images/hero-2.jpg"],
  },
  {
    id: "2",
    title: "Love it",
    rating: 5,
    comment: "Amazing quality Toy!! Thanks For Luuna...",
    author: "Venkatesh kumar",
    date: "2 Days ago",
    images: ["/images/hero-3.jpg", "/images/hero-4.jpg"],
  },
  {
    id: "3",
    title: "Love it",
    rating: 5,
    comment: "Amazing quality Toy!! Thanks For Luuna...",
    author: "Venkatesh kumar",
    date: "2 Days ago",
    images: ["/images/hero-4.jpg", "/images/hero-5.jpg"],
  },
  {
    id: "4",
    title: "Love it",
    rating: 5,
    comment: "Amazing quality Toy!! Thanks For Luuna...",
    author: "Venkatesh kumar",
    date: "2 Days ago",
    images: ["/images/hero-2.jpg", "/images/hero-3.jpg"],
  },
];

const customerPhotos = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
  "/images/hero-4.jpg",
  "/images/hero-5.jpg",
  "/images/recommendation-toy.png",
];

const ratingBreakdown = [
  { label: "Excellent", percentage: 80 },
  { label: "Very Good", percentage: 60 },
  { label: "Average", percentage: 20 },
  { label: "Poor", percentage: 10 },
  { label: "Terrible", percentage: 0 },
];

export const ProductReviews: React.FC = () => {
  // Form State
  const [selectedRating, setSelectedRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gallery Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) {
      toast.error("Please select a rating star");
      return;
    }
    if (!reviewTitle.trim()) {
      toast.error("Please enter a review title");
      return;
    }
    if (!reviewBody.trim()) {
      toast.error("Please write your review");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setReviewTitle("");
      setReviewBody("");
      setSelectedRating(5);
      toast.success("Thank you! Your review has been submitted for approval.");
    }, 600);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  return (
    <section className="w-full bg-[#10051b] text-white pt-8 sm:pt-12 pb-14 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider font-['Impact','Arial_Black',sans-serif]">
            REVIEWS
          </h2>
        </div>

        {/* Reviews Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ================= LEFT COLUMN (8 cols) ================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 1. Rating Overview & Breakdown Card */}
            <div className="bg-white text-gray-900 rounded-2xl p-5 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8">
                {/* Overall Score */}
                <div className="flex flex-col items-center justify-center text-center sm:w-52 shrink-0">
                  <div className="text-5xl sm:text-6xl font-black text-gray-950 tracking-tight">
                    4.5
                  </div>
                  <div className="flex items-center gap-1 my-2 text-purple-600">
                    {[1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 fill-purple-600 text-purple-600"
                      />
                    ))}
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-xs text-gray-600 leading-snug">
                    5.0 out of 5 Stars
                    <br />
                    (based on 100 review)
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px bg-gray-200 self-stretch" />

                {/* Breakdown Bars */}
                <div className="flex-1 w-full flex flex-col justify-center gap-2.5">
                  {ratingBreakdown.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 text-xs"
                    >
                      <span className="w-20 text-gray-800 font-medium truncate">
                        {item.label}
                      </span>
                      {/* Pill Progress Bar */}
                      <div className="flex-1 h-3 rounded-full border border-gray-300 bg-gray-50 p-0.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-600 transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-right font-semibold text-gray-700">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Customer Uploaded Images Strip */}
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
                {customerPhotos.slice(0, 4).map((photo, idx) => {
                  const isLast = idx === 3;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveModalImage(photo);
                        setIsModalOpen(true);
                      }}
                      className="relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer group bg-[#160B2A] border border-white/10"
                    >
                      <Image
                        src={photo}
                        alt={`Customer photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 25vw, 180px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isLast && (
                        <div className="absolute inset-0 bg-black/55 backdrop-blur-2xs flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          + More
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* View All Images Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveModalImage(customerPhotos[0] ?? null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-white hover:text-purple-300 text-xs sm:text-sm font-semibold transition-colors w-fit cursor-pointer mt-1"
              >
                <Camera className="w-4 h-4" />
                <span>View All Images</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Customer Reviews Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white text-gray-900 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between border border-gray-100"
                >
                  <div>
                    <h3 className="font-bold text-sm text-gray-950">
                      {review.title}
                    </h3>
                    <div className="flex items-center gap-1 my-1.5 text-purple-600">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-purple-600 text-purple-600"
                        />
                      ))}
                    </div>

                    {/* Attached Photos */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 my-2.5">
                        {review.images.map((img, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setActiveModalImage(img);
                              setIsModalOpen(true);
                            }}
                            className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
                          >
                            <Image
                              src={img}
                              alt="Customer review photo"
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-700 leading-relaxed mt-2">
                      {review.comment}
                    </p>
                  </div>

                  <div className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span>-{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90 font-medium pl-1">
              <span>
                Page {currentPage}/{totalPages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                className="underline hover:text-purple-300 cursor-pointer font-semibold"
              >
                Next
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (4 cols) ================= */}
          <div className="lg:col-span-4">
            <div className="bg-white text-gray-900 rounded-2xl p-5 sm:p-7 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-black text-gray-950 text-center mb-6">
                Write a Review
              </h3>

              <form
                onSubmit={handleSubmitReview}
                className="flex flex-col gap-4"
              >
                {/* Rating Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
                    Rate your Experience
                  </label>
                  <div className="flex items-center gap-1.5 text-purple-600">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} star`}
                        className="cursor-pointer transition-transform hover:scale-110 p-0.5"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (hoverRating || selectedRating)
                              ? "fill-purple-600 text-purple-600"
                              : "text-purple-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
                    Tittle of your review
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your review or highlight an interesting detail"
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                  />
                </div>

                {/* Review Body Textarea */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
                    Your review
                  </label>
                  <textarea
                    rows={6}
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Tell people your review"
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors resize-none min-h-[140px]"
                  />
                </div>

                {/* Submit Review Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#10051b] hover:bg-[#200b34] text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-150 active:scale-[0.99] shadow-md cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Customer Photos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#160B2A] rounded-2xl p-4 border border-white/20 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white p-1 cursor-pointer rounded-full bg-white/10"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModalImage && (
              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mt-6">
                <Image
                  src={activeModalImage}
                  alt="Customer photo enlarged"
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="flex gap-2 overflow-x-auto w-full mt-4 pb-2">
              {customerPhotos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModalImage(p)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 ${
                    activeModalImage === p
                      ? "border-purple-400"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <Image
                    src={p}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
