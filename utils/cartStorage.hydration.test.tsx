/**
 * @vitest-environment jsdom
 */

import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "nextstore-cart";

const testItem: CartItem = {
  id: "test-product",
  title: "Test product",
  description: "Product used for cart hydration testing",
  price: 100,
  discountedPrice: 80,
  rating: 4,
  image: {
    url: "https://example.com/product.jpg",
    alt: "Test product",
  },
  tags: [],
  reviews: [],
  quantity: 2,
};

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.resetModules();
});

describe("cart storage hydration", () => {
  // TEST 1: Client-side restoration
  it("restores saved cart items on initial mount", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([testItem]));

    const { useStoredCart } = await import("@/utils/cartStorage");

    function CartDisplay() {
      const items = useStoredCart();

      return (
        <p data-testid="cart-quantity">
          {items.reduce((total, item) => total + item.quantity, 0)}
        </p>
      );
    }

    render(<CartDisplay />);

    expect((await screen.findByTestId("cart-quantity")).textContent).toBe("2");
  });

  // TEST 2: Server rendering followed by client hydration
  it("restores saved items after server-to-client hydration", async () => {
    const { useStoredCart } = await import("@/utils/cartStorage");

    function CartDisplay() {
      const items = useStoredCart();

      return (
        <p data-testid="hydrated-cart-quantity">
          {items.reduce((total, item) => total + item.quantity, 0)}
        </p>
      );
    }

    // Server-rendered HTML starts with an empty cart.
    localStorage.removeItem(STORAGE_KEY);

    const serverHTML = renderToString(<CartDisplay />);

    expect(serverHTML).toContain(">0</p>");

    // Saved cart exists before hydration begins.
    localStorage.setItem(STORAGE_KEY, JSON.stringify([testItem]));

    const container = document.createElement("div");
    container.innerHTML = serverHTML;
    document.body.appendChild(container);

    let root: ReturnType<typeof hydrateRoot> | undefined;

    try {
      await act(async () => {
        root = hydrateRoot(container, <CartDisplay />);
      });

      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="hydrated-cart-quantity"]')
            ?.textContent,
        ).toBe("2");
      });
    } finally {
      await act(async () => {
        root?.unmount();
      });

      container.remove();
    }
  });
});
