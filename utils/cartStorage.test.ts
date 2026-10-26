import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "nextstore-cart";

const testItem: CartItem = {
  id: "perfume-1",
  title: "Test Perfume",
  description: "A perfume used for testing",
  price: 499,
  discountedPrice: 399,
  rating: 4.5,
  image: {
    url: "https://example.com/perfume.jpg",
    alt: "Test perfume bottle",
  },
  tags: ["perfume"],
  reviews: [],
  quantity: 2,
};

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  vi.resetModules();

  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
  });
});

describe("cart storage", () => {
  it("restores a valid cart from localStorage", async () => {
    storage.set(STORAGE_KEY, JSON.stringify([testItem]));

    const { updateStoredCart } = await import("@/utils/cartStorage");

    // Read the existing cart without modifying it.
    updateStoredCart((items) => {
      expect(items).toEqual([testItem]);
      return items;
    });
  });

  it("handles invalid JSON safely", async () => {
    storage.set(STORAGE_KEY, "{invalid-json");

    const { updateStoredCart } = await import("@/utils/cartStorage");

    updateStoredCart((items) => {
      expect(items).toEqual([]);
      return items;
    });
  });

  it("rejects quantities above the maximum", async () => {
    storage.set(STORAGE_KEY, JSON.stringify([{ ...testItem, quantity: 100 }]));

    const { updateStoredCart } = await import("@/utils/cartStorage");

    updateStoredCart((items) => {
      expect(items).toEqual([]);
      return items;
    });
  });

  it("rejects products with missing image data", async () => {
    storage.set(STORAGE_KEY, JSON.stringify([{ ...testItem, image: null }]));

    const { updateStoredCart } = await import("@/utils/cartStorage");

    updateStoredCart((items) => {
      expect(items).toEqual([]);
      return items;
    });
  });

  it("persists cart updates", async () => {
    const { updateStoredCart } = await import("@/utils/cartStorage");

    updateStoredCart(() => [testItem]);

    expect(JSON.parse(storage.get(STORAGE_KEY) ?? "null")).toEqual([testItem]);
  });

  it("persists an empty cart after clearing", async () => {
    storage.set(STORAGE_KEY, JSON.stringify([testItem]));

    const { updateStoredCart } = await import("@/utils/cartStorage");

    updateStoredCart(() => []);

    expect(JSON.parse(storage.get(STORAGE_KEY) ?? "null")).toEqual([]);
  });
});
