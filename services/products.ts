import type { Product, PaginatedProducts } from "@/types/product";

const API_URL = "https://v2.api.noroff.dev/online-shop";

export class ProductsNotFoundError extends Error {
  constructor() {
    super("Requested product page was not found");
    this.name = "ProductsNotFoundError";
  }
}

export async function getProducts(
  page: number = 1,
  limit: number = 12,
): Promise<PaginatedProducts> {
  const url = new URL(API_URL);

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url.toString());

  if (response.status === 404) {
    throw new ProductsNotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const result: PaginatedProducts = await response.json();

  return result;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.status}`);
  }

  const result: { data: Product } = await response.json();

  return result.data;
}
