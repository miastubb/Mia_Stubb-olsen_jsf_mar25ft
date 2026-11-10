import type { Metadata } from "next";
import CheckoutSuccessClient from "@/app/checkout-success/CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Confirmation of your completed demo order at Next Store.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />;
}
