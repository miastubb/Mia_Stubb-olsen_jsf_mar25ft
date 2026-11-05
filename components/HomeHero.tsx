import Link from "next/link";

export default function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="mb-10 rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-10 sm:px-10 sm:py-14"
    >
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold tracking-widest text-teal-300 uppercase">
          Welcome to Next Store
        </p>

        <h1
          id="home-hero-title"
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          Discover something <span className="text-teal-300">you&apos;ll love.</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
          Explore our collection of everyday essentials, thoughtful gifts, and
          little luxuries. Find your next favourite, all in one place.
        </p>

        <Link
          href="#products"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Explore products
        </Link>
      </div>
    </section>
  );
}
