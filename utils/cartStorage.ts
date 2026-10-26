import { useSyncExternalStore } from "react";
import type { CartItem } from "@/types/cart";
import { MAX_CART_QUANTITY } from "@/utils/cartConstants";

const CART_STORAGE_KEY = "nextstore-cart";

let cachedItems: CartItem[] = [];
let cachedRaw: string | null | undefined;
const listeners = new Set<() => void>();

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  const image = item.image;

  const hasValidImage =
    typeof image === "object" &&
    image !== null &&
    "url" in image &&
    typeof image.url === "string" &&
    "alt" in image &&
    typeof image.alt === "string";

  const hasValidReviews =
    Array.isArray(item.reviews) &&
    item.reviews.every(
      (review: unknown) =>
        typeof review === "object" &&
        review !== null &&
        "id" in review &&
        typeof review.id === "string" &&
        "username" in review &&
        typeof review.username === "string" &&
        "rating" in review &&
        typeof review.rating === "number" &&
        Number.isFinite(review.rating) &&
        "description" in review &&
        typeof review.description === "string",
    );

  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.title === "string" &&
    typeof item.description === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.discountedPrice === "number" &&
    Number.isFinite(item.discountedPrice) &&
    item.discountedPrice >= 0 &&
    typeof item.rating === "number" &&
    Number.isFinite(item.rating) &&
    Array.isArray(item.tags) &&
    item.tags.every((tag: unknown) => typeof tag === "string") &&
    hasValidImage &&
    hasValidReviews &&
    Number.isSafeInteger(item.quantity) &&
    (item.quantity as number) >= 1 &&
    (item.quantity as number) <= MAX_CART_QUANTITY
  );
}

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);

    // React requires the same reference when storage hasn't changed.
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedItems = parseCart(raw);
    }
  } catch {
    // Keep the current in-memory cart if storage is unavailable.
  }

  return cachedItems;
}

const EMPTY_CART: CartItem[] = [];

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY || event.key === null) {
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useStoredCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function updateStoredCart(
  updater: (currentItems: CartItem[]) => CartItem[],
): void {
  const currentItems = getSnapshot();
  const nextItems = updater(currentItems);

  if (nextItems === currentItems) return;

  cachedItems = nextItems;

  try {
    const raw = JSON.stringify(nextItems);
    localStorage.setItem(CART_STORAGE_KEY, raw);
    cachedRaw = raw;
  } catch {
    // Cart remains usable in memory.
    cachedRaw = undefined;
  }

  listeners.forEach((listener) => listener());
}
