import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/services/products";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import { ProductsNotFoundError } from "@/services/products";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

async function Products({ searchParams }: HomePageProps) {
  const { page } = await searchParams;

  const parsedPage = Number(page ?? 1);
  const currentPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  let result;

try {
  result = await getProducts(currentPage);
} catch (error) {
  if (error instanceof ProductsNotFoundError) {
    notFound();
  }

  throw error;
}

const { data: products, meta } = result;

  return (
    <>
      <ProductGrid products={products} />
      <Pagination meta={meta} />
    </>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Welcome to our online store!</h1>

      <Suspense fallback={<p>Loading products...</p>}>
        <Products searchParams={searchParams} />
      </Suspense>
    </>
  );
}
