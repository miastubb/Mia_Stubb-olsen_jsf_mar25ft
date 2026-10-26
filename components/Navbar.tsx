"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { IoClose, IoMenu } from "react-icons/io5";
import { NavbarMiniCart } from "@/components/NavbarMiniCart";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartOpenChange = useCallback((open: boolean) => {
    setIsCartOpen(open);

    if (open) {
      setIsMenuOpen(false);
    }
  }, []);

  function toggleMenu() {
    setIsMenuOpen((open) => !open);
    setIsCartOpen(false);
  }

  return (
    <nav className="relative z-40 border-b border-zinc-700 bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="shrink-0 text-2xl font-semibold uppercase tracking-[0.2em]"
          >
            NEXT<span className="text-zinc-400">STORE</span>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700"
            >
              Home
            </Link>

            <Link
              href="/contact"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <NavbarMiniCart
              isOpen={isCartOpen}
              onOpenChange={handleCartOpenChange}
            />

            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls={isMenuOpen ? "mobile-navigation" : undefined}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
            >
              {isMenuOpen ? (
                <IoClose className="h-6 w-6" aria-hidden="true" />
              ) : (
                <IoMenu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-navigation" className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Home
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Cart
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
