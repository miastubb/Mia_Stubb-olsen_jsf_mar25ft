"use client";

import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { MAX_CART_QUANTITY } from "@/utils/cartConstants";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { items, addToCart } = useCart();
  const { showToast } = useToast();

  function handleAddToCart() {
    const cartItem = items.find((item) => item.id === product.id);

    if (cartItem && cartItem.quantity >= MAX_CART_QUANTITY) {
      return;
    }

    addToCart(product);
    showToast("Added to cart");
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="mt-6 rounded-md border border-black/40 bg-teal-800 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
    >
      Add to Cart
    </button>
  );
}
