"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

interface ReviewCarouselProps {
  reviews: Product["reviews"];
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function goToNext() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  }

  function goToPrevious() {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length,
    );
  }

  if (reviews.length === 0) {
    return <p className="mt-4">No customer reviews yet.</p>;
  }

  const currentReview = reviews[currentIndex];

  return (
    <article className="mx-auto mt-4 w-full max-w-2xl rounded-lg bg-zinc-900 px-5 py-3 text-zinc-100">
      <h3 className="font-semibold">{currentReview.username}</h3>

      <p className="mt-2 text-sm">
        <span aria-hidden="true" className="text-amber-400">
          ★
        </span>{" "}
        {currentReview.rating.toFixed(1)} / 5
      </p>
      <p className="mt-3 text-sm leading-relaxed">
        {currentReview.description}
      </p>

      {reviews.length > 1 && (
        <div className="mt-3 flex items-center justify-between border-t border-zinc-700 pt-2">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous review"
            className="rounded px-2 py-1 hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ←
          </button>

          <span className="text-sm text-zinc-300">
            {currentIndex + 1} / {reviews.length}
          </span>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next review"
            className="rounded px-2 py-1 hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            →
          </button>
        </div>
      )}
    </article>
  );
}
