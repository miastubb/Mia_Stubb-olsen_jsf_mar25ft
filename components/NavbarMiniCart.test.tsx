/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { CartItem } from "@/types/cart";
import { useCart } from "@/context/CartContext";
import { NavbarMiniCart } from "@/components/NavbarMiniCart";

vi.mock("@/context/CartContext", () => ({ useCart: vi.fn() }));
vi.mock("next/image", () => ({ default: () => null }));

const testItem: CartItem = {
  id: "test-product",
  title: "Test product",
  description: "Product used for mini-cart tests",
  price: 100,
  discountedPrice: 80,
  rating: 4,
  image: { url: "https://example.com/product.jpg", alt: "Test product" },
  tags: [],
  reviews: [],
  quantity: 2,
};

function renderMiniCart(quantity = 2) {
  const updateQuantity = vi.fn();
  const removeFromCart = vi.fn();

  vi.mocked(useCart).mockReturnValue({
    items: [{ ...testItem, quantity }],
    addToCart: vi.fn(),
    updateQuantity,
    removeFromCart,
    clearCart: vi.fn(),
  });

  render(<NavbarMiniCart isOpen onOpenChange={vi.fn()} />);
  return { updateQuantity, removeFromCart };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("NavbarMiniCart", () => {
  it("uses the shared cart action to increase and decrease quantity", () => {
    const { updateQuantity } = renderMiniCart();

    fireEvent.click(
      screen.getByRole("button", { name: "Decrease quantity of Test product" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Increase quantity of Test product" }),
    );

    expect(updateQuantity).toHaveBeenNthCalledWith(1, "test-product", 1);
    expect(updateQuantity).toHaveBeenNthCalledWith(2, "test-product", 3);
  });

  it("disables decrease when quantity is one", () => {
    renderMiniCart(1);
    expect(
      screen
        .getByRole("button", { name: "Decrease quantity of Test product" })
        .hasAttribute("disabled"),
    ).toBe(true);
  });

  it("disables increase at the maximum quantity", () => {
    renderMiniCart(99);
    expect(
      screen
        .getByRole("button", { name: "Increase quantity of Test product" })
        .hasAttribute("disabled"),
    ).toBe(true);
  });

  it("removes the product and moves focus to the cart close button", () => {
    const { removeFromCart } = renderMiniCart();
    fireEvent.click(
      screen.getByRole("button", { name: "Remove Test product from cart" }),
    );

    expect(removeFromCart).toHaveBeenCalledWith("test-product");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Close cart preview" }),
    );
  });
});
