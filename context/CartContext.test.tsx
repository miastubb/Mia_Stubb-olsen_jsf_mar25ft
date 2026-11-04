/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { Product } from "@/types/product";
import { CartProvider, useCart } from "./CartContext";

const testProduct: Product = {
  id: "test-product",
  title: "Test product",
  description: "Product used for cart tests",
  price: 100,
  discountedPrice: 80,
  rating: 4,
  image: {
    url: "https://example.com/product.jpg",
    alt: "Test product",
  },
  tags: [],
  reviews: [],
};

function TestCartConsumer() {
  const { items, addToCart } = useCart();

  return (
    <>
      <button type="button" onClick={() => addToCart(testProduct)}>
        Add product
      </button>

      <p data-testid="cart-result">
        {items.length} items, quantity {items[0]?.quantity ?? 0}
      </p>
    </>
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("CartContext", () => {
  it("adds the same product twice without duplicating the cart entry", () => {
    render(
      <CartProvider>
        <TestCartConsumer />
      </CartProvider>,
    );

    const addButton = screen.getByRole("button", {
      name: "Add product",
    });

    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(screen.getByTestId("cart-result").textContent).toBe(
      "1 items, quantity 2",
    );
  });
});
