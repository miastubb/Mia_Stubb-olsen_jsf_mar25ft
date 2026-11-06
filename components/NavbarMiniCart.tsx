"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoAddOutline,
  IoCartOutline,
  IoCloseOutline,
  IoRemoveOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { MAX_CART_QUANTITY } from "@/utils/cartConstants";
import {
  calculateCartTotals,
  calculateLineTotal,
} from "@/utils/cartCalculations";

interface NavbarMiniCartProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavbarMiniCart({ isOpen, onOpenChange }: NavbarMiniCartProps) {
  const { items, updateQuantity, removeFromCart } = useCart();

  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cartQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const { total } = calculateCartTotals(items);

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onOpenChange]);

  function closeCart() {
    onOpenChange(false);
    triggerRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="static md:relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Shopping cart, ${cartQuantity} ${
          cartQuantity === 1 ? "item" : "items"
        }`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => onOpenChange(!isOpen)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-100 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <IoCartOutline className="h-6 w-6" aria-hidden="true" />

        {cartQuantity > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-800 px-1 text-xs font-semibold text-white"
          >
            {cartQuantity > 99 ? "99+" : cartQuantity}
          </span>
        )}
      </button>

       {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-label="Shopping cart preview"
          className="absolute right-4 top-full z-50 mt-3 w-[calc(100vw-2rem)] max-w-sm rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-xl sm:right-6 md:right-0 md:top-full md:w-88"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your cart</h2>

            <button
              ref={closeRef}
              type="button"
              aria-label="Close cart preview"
              onClick={closeCart}
              className="rounded-md p-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
            >
              <IoCloseOutline className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-600">
              Your cart is empty.
            </p>
          ) : (
            <>
              <ul className="max-h-72 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt}
                        width={64}
                        height={64}
                        sizes="64px"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(calculateLineTotal(item))}
                      </p>

                      <div className="mt-2 flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.title}`}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-zinc-300 enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
                        >
                          <IoRemoveOutline aria-hidden="true" />
                        </button>
                        <span className="min-w-6 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.title}`}
                          disabled={item.quantity >= MAX_CART_QUANTITY}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-zinc-300 enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
                        >
                          <IoAddOutline aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${item.title} from cart`}
                          onClick={() => {
                            removeFromCart(item.id);
                            closeRef.current?.focus();
                          }}
                          className="ml-auto flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
                        >
                          <IoTrashOutline aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                <span className="text-sm font-medium">Total</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
              </div>
            </>
          )}

          <Link
            href="/cart"
            onClick={() => onOpenChange(false)}
            className="mt-4 flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            View full cart
          </Link>
        </div>
      )}
    </div>
  );
}
