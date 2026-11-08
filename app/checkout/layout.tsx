import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your order, enter delivery details, and complete your demo checkout at Next Store.",
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
