import type { CartItem } from "@/types/cart";

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
}

function toOre(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100);
}

function toKroner(ore: number): number {
  return ore / 100;
}

export function calculateLineTotal(item: CartItem): number {
  return toKroner(toOre(item.discountedPrice) * item.quantity);
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const totals = items.reduce(
    (accumulator, item) => {
      const originalPrice = toOre(item.price);
      const discountedPrice = toOre(item.discountedPrice);

      return {
        subtotal: accumulator.subtotal + originalPrice * item.quantity,
        total: accumulator.total + discountedPrice * item.quantity,
      };
    },
    { subtotal: 0, total: 0 },
  );

  return {
    subtotal: toKroner(totals.subtotal),
    discount: toKroner(totals.subtotal - totals.total),
    total: toKroner(totals.total),
  };
}

