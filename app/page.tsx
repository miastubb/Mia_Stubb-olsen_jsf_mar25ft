import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/services/products";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import { ProductsNotFoundError } from "@/services/products";
import HomeHero from "@/components/HomeHero";
import { parseProductSort } from "@/utils/productSort";
import ProductSort from "@/components/ProductSort";

interface HomePageProps {
  searchParams: Promise<{
    page?: string | string[];
    sort?: string | string[];
  }>;
}

async function Products({ searchParams }: HomePageProps) {
  const { page, sort } = await searchParams;

  const selectedSort = parseProductSort(sort);

  const parsedPage = typeof page === "string" ? Number(page) : 1;
  const currentPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  let result;

  try {
    result = await getProducts(currentPage, 12, selectedSort);
  } catch (error) {
    if (error instanceof ProductsNotFoundError) {
      notFound();
    }

    throw error;
  }

  const { data: products, meta } = result;

  return (
    <>
      <ProductSort sort={selectedSort} />
      <ProductGrid products={products} />
      <Pagination meta={meta} sort={selectedSort} />
    </>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <>
      <HomeHero />

      <section id="products" aria-label="Our products">
        <Suspense fallback={<p>Loading products...</p>}>
          <Products searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
