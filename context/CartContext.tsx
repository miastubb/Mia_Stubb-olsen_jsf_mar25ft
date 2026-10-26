"use client";

import { createContext, useContext } from "react";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { MAX_CART_QUANTITY } from "@/utils/cartConstants";
import { useStoredCart, updateStoredCart } from "@/utils/cartStorage";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useStoredCart();

  function addToCart(product: Product) {
    updateStoredCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= MAX_CART_QUANTITY) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId: string) {
    updateStoredCart((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }

  function updateQuantity(productId: string, quantity: number) {
    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_CART_QUANTITY
    ) {
      return;
    }

    updateStoredCart((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function clearCart() {
    updateStoredCart(() => []);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
