import type { Product } from "@/types/product";

export function filterProducts(products: Product[], query: string): Product[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) =>
    product.title.toLocaleLowerCase().includes(normalizedQuery),
  );
}
