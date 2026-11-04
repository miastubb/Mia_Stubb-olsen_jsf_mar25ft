"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>

      <p className="mt-4 text-zinc-900">
        We are not able to load the requested content. Please try again.
      </p>

      <button
        type="button"
        onClick={reset}
        className="mt-6 cursor-pointer rounded-lg bg-teal-800 px-6 py-3 font-semibold text-white hover:bg-[#53675B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Try again
      </button>
    </main>
  );
}
