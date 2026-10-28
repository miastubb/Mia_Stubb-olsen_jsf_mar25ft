"use client";

import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="mt-6 rounded-md border border-black/40 bg-[#667D70] px-6 py-3 font-medium text-white transition-colors hover:bg-[#53675B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#667D70]"
    >
      Add to Cart
    </button>
  );
}
