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
      className="mt-6 rounded-md bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      Add to Cart
    </button>
  );
}
