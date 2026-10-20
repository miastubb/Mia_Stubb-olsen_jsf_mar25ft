import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/services/products";

async function Products() {
  const products = await getProducts();

  return <ProductGrid products={products} />;
}

export default function HomePage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Welcome to our online store!</h1>

      <Suspense fallback={<p>Loading products...</p>}>
        <Products />
      </Suspense>
    </main>
  );
}
