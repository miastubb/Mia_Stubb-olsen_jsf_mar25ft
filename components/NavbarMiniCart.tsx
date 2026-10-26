"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoCartOutline, IoCloseOutline } from "react-icons/io5";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";

interface NavbarMiniCartProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavbarMiniCart({ isOpen, onOpenChange }: NavbarMiniCartProps) {
  const { items } = useCart();

  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cartQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0,
  );

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
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#667D70] px-1 text-xs font-semibold text-white"
          >
            {cartQuantity}
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
              className="rounded-md p-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
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
                      <p className="mt-1 text-xs text-zinc-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold">
                      {formatCurrency(item.discountedPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </>
          )}

          <Link
            href="/cart"
            onClick={() => onOpenChange(false)}
            className="mt-4 flex min-h-11 items-center justify-center rounded-lg bg-[#667D70] px-4 py-3 text-sm font-semibold text-white hover:bg-[#53675B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
          >
            View full cart
          </Link>
        </div>
      )}
    </div>
  );
}
