"use client";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { filterProducts } from "@/utils/filterProducts";
import Image from "next/image";

export default function NavbarSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result: { data: Product[] } = await response.json();

        if (!controller.signal.aborted) {
          setProducts(result.data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const filteredProducts = filterProducts(products, query);
  const suggestions = filteredProducts.slice(0, 5);

  return (
    <div className="space-y-3">
      <label htmlFor="navbar-search" className="sr-only">
        Search products
      </label>

      <input
        ref={inputRef}
        id="navbar-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products..."
        autoComplete="off"
        className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      />

      {isLoading && (
        <p role="status" className="text-sm text-zinc-400">
          Loading products...
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && query.trim() !== "" && (
        <div className="space-y-3">
          <p role="status" className="text-sm text-zinc-300">
            {filteredProducts.length} products found
          </p>

          {suggestions.length > 0 ? (
            <ul className="divide-y divide-zinc-700">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center gap-4 rounded-md px-3 py-3 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Image
                      src={product.image.url}
                      alt={product.image.alt || product.title}
                      width={56}
                      height={56}
                      className="size-14 shrink-0 rounded-md object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {product.title}
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {new Intl.NumberFormat("nb-NO", {
                          style: "currency",
                          currency: "NOK",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(
                          product.discountedPrice < product.price
                            ? product.discountedPrice
                            : product.price,
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">No matching products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
