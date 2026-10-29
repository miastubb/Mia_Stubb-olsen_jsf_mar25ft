"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );

  const shippingCost = shippingMethod === "standard" ? 79 : 149;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const productTotal = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0,
  );

  const discount = subtotal - productTotal;
  const orderTotal = productTotal + shippingCost;

  const inputClasses =
    "mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]";

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-zinc-950">Checkout</h1>

        <div className="rounded-xl bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <p className="text-zinc-700">
            Your cart is empty. Add some products before checking out.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg border border-black/40 bg-[#667D70] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#53675B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) return;

    try {
      sessionStorage.setItem("nextstore-demo-checkout", "completed");
    } catch {
      // Storage may be unavailable in restricted browser environments.
    }

    clearCart();
    router.push("/checkout-success");
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-zinc-950">Checkout</h1>

      <section
        aria-labelledby="customer-details-heading"
        className="rounded-xl bg-white px-6 py-8 shadow-sm sm:px-8 lg:px-12"
      >
        <h2
          id="customer-details-heading"
          className="mb-6 text-xl font-semibold text-zinc-950"
        >
          Customer information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-zinc-800"
              >
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-zinc-800"
              >
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-800"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="streetAddress"
              className="block text-sm font-medium text-zinc-800"
            >
              Street address
            </label>
            <input
              id="streetAddress"
              name="streetAddress"
              type="text"
              autoComplete="street-address"
              required
              className={inputClasses}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-zinc-800"
              >
                Postal code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="[0-9]{4}"
                maxLength={4}
                title="Enter a four-digit Norwegian postal code"
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-zinc-800"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                className={inputClasses}
              />
            </div>
          </div>
          <fieldset className="border-t border-zinc-200 pt-6">
            <legend className="px-1 text-xl font-semibold text-zinc-950">
              Shipping method
            </legend>

            <div className="mt-4 space-y-3">
              {(
                [
                  { id: "standard", label: "Standard delivery", price: 79 },
                  { id: "express", label: "Express delivery", price: 149 },
                ] as const
              ).map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors ${
                    shippingMethod === option.id
                      ? "border-[#667D70] bg-[#E8EEE9]"
                      : "border-zinc-300 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={option.id}
                      checked={shippingMethod === option.id}
                      onChange={() => setShippingMethod(option.id)}
                      className="h-4 w-4 accent-[#667D70]"
                    />
                    <span className="font-medium text-zinc-950">
                      {option.label}
                    </span>
                  </span>

                  <span className="shrink-0 font-medium text-zinc-950">
                    {formatCurrency(option.price)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="border-t border-zinc-200 pt-6">
            <legend className="px-1 text-xl font-semibold text-zinc-950">
              Payment method
            </legend>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-[#667D70] bg-[#E8EEE9] p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="demo"
                defaultChecked
                required
                className="mt-1 h-4 w-4 accent-[#667D70]"
              />

              <span>
                <span className="block font-medium text-zinc-950">
                  Demo payment
                </span>
                <span className="mt-1 block text-sm text-zinc-700">
                  This is a simulated checkout. No payment details are
                  collected, and no real transaction will take place.
                </span>
              </span>
            </label>
          </fieldset>
          <div className="mt-8 border-t border-zinc-200 pt-6">
            <h2 className="mb-6 text-xl font-semibold text-zinc-950">
              Order summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-700">Subtotal</span>
                <span className="font-medium text-zinc-950">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-700">Discount</span>
                  <span className="font-medium text-[#526B5B]">
                    −{formatCurrency(discount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-700">Shipping</span>
                <span className="font-medium text-zinc-950">
                  {formatCurrency(shippingCost)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-4">
                <span className="text-lg font-semibold text-zinc-950">
                  Total
                </span>
                <span className="text-xl font-bold text-zinc-950">
                  {formatCurrency(orderTotal)}
                </span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={items.length === 0}
            className="mt-8 w-full cursor-pointer rounded-lg border border-black/40 bg-[#667D70] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#53675B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Place demo order
          </button>
        </form>
      </section>
    </div>
  );
}
