import type { ProductSort } from "@/utils/productSort";
import type { Product, PaginatedProducts } from "@/types/product";

const API_URL = "https://v2.api.noroff.dev/online-shop";
const API_TIMEOUT_MS = 8_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 0;
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;

  if (!isRecord(value.image)) return false;
  if (
    !Array.isArray(value.tags) ||
    !value.tags.every((tag) => typeof tag === "string")
  ) {
    return false;
  }
  if (!Array.isArray(value.reviews)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    typeof value.discountedPrice === "number" &&
    Number.isFinite(value.discountedPrice) &&
    typeof value.rating === "number" &&
    Number.isFinite(value.rating) &&
    typeof value.image.url === "string" &&
    typeof value.image.alt === "string" &&
    value.reviews.every(
      (review) =>
        isRecord(review) &&
        typeof review.id === "string" &&
        typeof review.username === "string" &&
        typeof review.rating === "number" &&
        Number.isFinite(review.rating) &&
        typeof review.description === "string",
    )
  );
}

function isPaginatedProducts(value: unknown): value is PaginatedProducts {
  if (!isRecord(value) || !Array.isArray(value.data) || !isRecord(value.meta)) {
    return false;
  }

  const meta = value.meta;

  return (
    value.data.every(isProduct) &&
    typeof meta.isFirstPage === "boolean" &&
    typeof meta.isLastPage === "boolean" &&
    isNonNegativeInteger(meta.currentPage) &&
    (meta.previousPage === null || isNonNegativeInteger(meta.previousPage)) &&
    (meta.nextPage === null || isNonNegativeInteger(meta.nextPage)) &&
    isNonNegativeInteger(meta.pageCount) &&
    isNonNegativeInteger(meta.totalCount)
  );
}

async function fetchProductResponse(url: string): Promise<Response> {
  try {
    return await fetch(url, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      throw new Error("Product API request timed out", { cause: error });
    }

    throw new Error("Product API request failed", { cause: error });
  }
}

async function parseProductResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    throw new Error("Invalid product API response", { cause: error });
  }
}

export class ProductsNotFoundError extends Error {
  constructor() {
    super("Requested product page was not found");
    this.name = "ProductsNotFoundError";
  }
}

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product ${id} was not found`);
    this.name = "ProductNotFoundError";
  }
}

export async function getProducts(
  page: number = 1,
  limit: number = 12,
  sort: ProductSort = "default",
): Promise<PaginatedProducts> {
  const url = new URL(API_URL);

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  if (sort !== "default") {
    url.searchParams.set("sort", "discountedPrice");
    url.searchParams.set("sortOrder", sort === "price-asc" ? "asc" : "desc");
  }

  const response = await fetchProductResponse(url.toString());

  if (response.status === 404) {
    throw new ProductsNotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const result: unknown = await parseProductResponse(response);

  if (!isPaginatedProducts(result)) {
    throw new Error("Invalid product API response");
  }

  return result;
}

export async function getAllProducts(): Promise<Product[]> {
  const firstPage = await getProducts(1, 1);

  if (firstPage.meta.totalCount === 0) {
    return [];
  }

  const result = await getProducts(1, firstPage.meta.totalCount);

  return result.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetchProductResponse(
    `${API_URL}/${encodeURIComponent(id)}`,
  );

  if (response.status === 404) {
    throw new ProductNotFoundError(id);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.status}`);
  }

  const result: unknown = await parseProductResponse(response);

  if (!isRecord(result) || !isProduct(result.data)) {
    throw new Error("Invalid product API response");
  }

  return result.data;
}
