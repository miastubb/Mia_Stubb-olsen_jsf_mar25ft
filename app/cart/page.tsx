"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { MAX_CART_QUANTITY } from "@/utils/cartConstants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  calculateCartTotals,
  calculateLineTotal,
} from "@/utils/cartCalculations";

const quantityButtonClasses =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-400 text-zinc-800 transition-colors hover:bg-[#E8EEE9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70] cursor-pointer";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart } = useCart();

  const { subtotal, discount, total } = calculateCartTotals(items);

  function handleCheckout() {
    if (items.length === 0) return;

    router.push("/checkout");
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-zinc-950">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <p className="text-zinc-700">Your cart is empty.</p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg border border-black/40 bg-[#667D70] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#53675B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <section
          aria-label="Products in your cart"
          className="rounded-xl bg-white px-6 py-4 shadow-sm sm:px-8 lg:px-12"
        >
          <ul className="divide-y divide-zinc-200">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-5">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-50 p-2">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt || item.title}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-zinc-950">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-zinc-700">
                      {formatCurrency(item.discountedPrice)} each
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.title}`}
                      className={quantityButtonClasses}
                    >
                      −
                    </button>

                    <span className="min-w-5 text-center font-medium text-zinc-950">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= MAX_CART_QUANTITY}
                      aria-label={`Increase quantity of ${item.title}`}
                      className={quantityButtonClasses}
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-zinc-950">
                    {formatCurrency(calculateLineTotal(item))}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm font-medium text-zinc-700 underline hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-zinc-200 py-6">
            <div className="flex justify-between text-zinc-700">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="mt-2 flex justify-between text-zinc-700">
                <span>Discount</span>
                <span>−{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="mt-4 flex justify-between font-bold text-zinc-950">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full cursor-pointer rounded-lg border border-black/40 bg-[#667D70] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#53675B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
            >
              Proceed to checkout
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
