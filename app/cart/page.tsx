"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { MAX_CART_QUANTITY } from "@/utils/cartConstants";

const quantityButtonClasses =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-400 text-zinc-800 transition-colors hover:bg-[#E8EEE9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70] disabled:cursor-not-allowed disabled:opacity-40";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const total = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0,
  );

  const discount = subtotal - total;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-zinc-950">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <p className="text-zinc-700">Your cart is empty.</p>
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

                  <div className="flex items-center gap-4">
                    <p className="min-w-28 text-right text-lg font-bold text-zinc-950">
                      {formatCurrency(item.discountedPrice * item.quantity)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-zinc-50 text-lg font-medium text-zinc-800 transition-colors hover:bg-[#E8EEE9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-zinc-200 pt-6">
            <h2 className="mb-6 text-xl font-semibold text-zinc-950">
              Order summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-700">Subtotal</span>
                <span className="text-right text-zinc-950">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-700">Discount</span>
                  <span className="text-right font-medium text-[#526B5B]">
                    −{formatCurrency(discount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-4">
                <span className="font-semibold text-zinc-950">Total</span>
                <span className="text-right text-xl font-bold text-zinc-950">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-8 w-full rounded-lg border border-black/40 bg-[#667D70] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              Proceed to checkout
            </button>

            <p className="mt-3 text-center text-sm text-zinc-600">
              Checkout coming soon
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
