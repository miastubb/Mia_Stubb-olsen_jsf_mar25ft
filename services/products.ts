import type { Product } from "@/types/product";

const API_URL ="https://v2.ai.noroff.dev/online-shop";

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`Failed to fetch new products: ${response.status}`);
    }

    const result: { data: Product[] } = await response.json();

    return result.data;
}