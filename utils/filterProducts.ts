import type { Product } from "@/types/product";

export function filterProducts(products: Product[], query: string): Product[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => {
    const matchesTitle = product.title
      .toLocaleLowerCase()
      .includes(normalizedQuery);

    const matchesTag = product.tags.some((tag) =>
      tag.toLocaleLowerCase().includes(normalizedQuery),
    );

    return matchesTitle || matchesTag;
  });
}
