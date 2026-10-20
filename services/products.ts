import type { Product } from "@/types/product";

const API_URL = "https://v2.api.noroff.dev/online-shop";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw Error(`Failed to fetch new products: ${response.status}`);
  }

  const result: { data: Product[] } = await response.json();

  return result.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw Error(`Failed to fetch product ${id}: ${response.status}`);
  }

  const result: { data: Product } = await response.json();

  return result.data;
}
