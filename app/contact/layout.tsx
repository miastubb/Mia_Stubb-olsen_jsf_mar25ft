import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Next Store using our contact form.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
