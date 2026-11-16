import Link from "next/link";

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="flex min-h-[60vh] items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white px-6 py-12 text-center text-zinc-900 shadow-sm sm:px-12">
        <p aria-hidden="true" className="text-7xl font-bold text-teal-800">
          404
        </p>

        <h1
          id="not-found-heading"
          className="mt-4 text-2xl font-semibold sm:text-3xl"
        >
          This page cannot be found
        </h1>

        <p className="mt-3 text-zinc-600">
          The link may be outdated, or the page may have moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-teal-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
        >
          Back to shop
        </Link>
      </div>
    </section>
  );
}
