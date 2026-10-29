"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IoClose, IoMenu, IoSearchOutline } from "react-icons/io5";
import { NavbarMiniCart } from "@/components/NavbarMiniCart";
import NavbarSearch from "@/components/NavbarSearch";

export function Navbar() {
  const navbarRef = useRef<HTMLElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        navbarRef.current &&
        !navbarRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  const handleCartOpenChange = useCallback((open: boolean) => {
    setIsCartOpen(open);

    if (open) {
      setIsMenuOpen(false);
      setIsSearchOpen(false);
    }
  }, []);

  function toggleMenu() {
    setIsMenuOpen((open) => !open);
    setIsCartOpen(false);
    setIsSearchOpen(false);
  }

  function toggleSearch() {
    setIsSearchOpen((open) => !open);
    setIsCartOpen(false);
    setIsMenuOpen(false);
  }

  return (
    <nav
      ref={navbarRef}
      className="relative z-40 border-b border-zinc-700 bg-zinc-950 text-zinc-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="shrink-0 text-2xl font-semibold uppercase tracking-[0.2em]"
          >
            NEXT<span className="text-zinc-400">STORE</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700"
            >
              Home
            </Link>
          </div>

          {/* Search, cart and mobile menu */}
          <div className="flex items-center gap-2">
            {/* Search panel appears before the close button in keyboard order */}
            {isSearchOpen && (
              <div
                id="navbar-search-panel"
                className="absolute top-full right-0 left-0 border-t border-zinc-700 bg-zinc-900 px-4 py-4 shadow-lg"
              >
                <div className="mx-auto max-w-7xl">
                  <NavbarSearch />
                </div>
              </div>
            )}

            <button
              ref={searchButtonRef}
              type="button"
              onClick={toggleSearch}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isSearchOpen}
              aria-controls={isSearchOpen ? "navbar-search-panel" : undefined}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-zinc-100 transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {isSearchOpen ? (
                <IoClose className="h-6 w-6" aria-hidden="true" />
              ) : (
                <IoSearchOutline className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

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
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
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

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div id="mobile-navigation" className="md:hidden">
          <div className="space-y-1 px-4 pt-2 pb-3">
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
