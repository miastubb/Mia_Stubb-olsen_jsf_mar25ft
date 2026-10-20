"use client";

import { useState } from "react";
import Link from "next/link";
import { IoClose, IoMenu } from "react-icons/io5";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-zinc-700 bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link
                href="/"
                className="text-2xl font-semibold tracking-[0.2em] uppercase"
              >
                NEXT<span className="text-zinc-400">STORE</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/cart"
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Cart
              </Link>
              <Link
                href="/contact"
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/cart"
              className="hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Cart
            </Link>
            <Link
              href="/contact"
              className="hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
