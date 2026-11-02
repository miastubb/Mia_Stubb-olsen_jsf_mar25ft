import { describe, expect, it } from "vitest";
import type { CartItem } from "@/types/cart";
import { calculateCartTotals, calculateLineTotal } from "./cartCalculations";

function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "test-product",
    title: "Test product",
    description: "Product used for pricing tests",
    price: 100,
    discountedPrice: 100,
    rating: 0,
    image: {
      url: "https://example.com/product.jpg",
      alt: "Test product",
    },
    tags: [],
    reviews: [],
    quantity: 1,
    ...overrides,
  };
}

describe("calculateCartTotals", () => {
  it("returns zero totals for an empty cart", () => {
    expect(calculateCartTotals([])).toEqual({
      subtotal: 0,
      discount: 0,
      total: 0,
    });
  });

  it("calculates a product without a discount", () => {
    const items = [createCartItem({ price: 100, discountedPrice: 100 })];

    expect(calculateCartTotals(items)).toEqual({
      subtotal: 100,
      discount: 0,
      total: 100,
    });
  });

  it("calculates a discounted product with multiple quantities", () => {
    const items = [
      createCartItem({
        price: 2599.99,
        discountedPrice: 2079.99,
        quantity: 2,
      }),
    ];

    expect(calculateCartTotals(items)).toEqual({
      subtotal: 5199.98,
      discount: 1040,
      total: 4159.98,
    });
  });

  it("calculates multiple products correctly", () => {
    const items = [
      createCartItem({
        id: "first",
        price: 100,
        discountedPrice: 80,
        quantity: 2,
      }),
      createCartItem({
        id: "second",
        price: 49.99,
        discountedPrice: 49.99,
        quantity: 3,
      }),
    ];

    expect(calculateCartTotals(items)).toEqual({
      subtotal: 349.97,
      discount: 40,
      total: 309.97,
    });
  });

  it("handles floating-point precision when adding prices", () => {
    const items = [
      createCartItem({
        id: "first",
        price: 0.1,
        discountedPrice: 0.1,
      }),
      createCartItem({
        id: "second",
        price: 0.2,
        discountedPrice: 0.2,
      }),
    ];

    expect(calculateCartTotals(items)).toEqual({
      subtotal: 0.3,
      discount: 0,
      total: 0.3,
    });
  });

  it("rounds fractional øre at the unit-price level", () => {
    const items = [
      createCartItem({
        price: 10.005,
        discountedPrice: 10.005,
        quantity: 3,
      }),
    ];

    expect(calculateCartTotals(items)).toEqual({
      subtotal: 30.03,
      discount: 0,
      total: 30.03,
    });
  });
});

describe("calculateLineTotal", () => {
  it("calculates the discounted line total in whole øre", () => {
    const item = createCartItem({
      discountedPrice: 19.99,
      quantity: 3,
    });

    expect(calculateLineTotal(item)).toBe(59.97);
  });

  it("agrees with the cart total for a single product", () => {
    const item = createCartItem({
      price: 100,
      discountedPrice: 79.995,
      quantity: 3,
    });

    expect(calculateLineTotal(item)).toBe(calculateCartTotals([item]).total);
  });
});
