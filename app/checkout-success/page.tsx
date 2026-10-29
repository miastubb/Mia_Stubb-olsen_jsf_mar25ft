import Link from "next/link";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <section
        aria-labelledby="checkout-success-heading"
        className="rounded-xl bg-white px-6 py-12 text-center shadow-sm sm:px-10"
      >
        <IoCheckmarkCircleOutline
          aria-hidden="true"
          className="mx-auto mb-6 h-16 w-16 text-[#667D70]"
        />

        <h1
          id="checkout-success-heading"
          className="text-3xl font-bold text-zinc-950"
        >
          Order confirmed!
        </h1>

        <p className="mt-4 text-lg text-zinc-700">Thank you for your order.</p>

        <p className="mt-3 text-sm text-zinc-600">
          This was a demonstration checkout. No real payment was processed or
          order submitted to a store.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg border border-black/40 bg-[#667D70] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#53675B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
        >
          Continue shopping
        </Link>
      </section>
    </div>
  );
}
