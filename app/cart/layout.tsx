
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description:
    "Review the products in your Next Store shopping cart before proceeding to checkout.",
};

export default function CartLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
