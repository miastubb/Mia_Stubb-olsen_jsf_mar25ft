import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { getAllProducts } from "@/services/products";
import { filterProducts } from "@/utils/filterProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Products",
  description:
    "Search Next Store products by name or product tags and explore matching results.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  if (!query) {
    return (
      <section aria-labelledby="search-heading">
        <h1 id="search-heading" className="mb-4 text-2xl font-semibold">
          Search products
        </h1>
        <p>Enter a search term using the search button in the header.</p>
      </section>
    );
  }

  const products = await getAllProducts();
  const filteredProducts = filterProducts(products, query);

  return (
    <section aria-labelledby="search-heading" className="space-y-6">
      <div>
        <h1 id="search-heading" className="text-2xl font-semibold">
          Search results for &ldquo;{query}&rdquo;
        </h1>

        <p className="mt-2">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} found
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p>No matching products found. Try another search term.</p>
      )}
    </section>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<p role="status">Loading search results...</p>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
