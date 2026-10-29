import { describe, expect, it } from "vitest";
import { filterProducts } from "./filterProducts";
import type { Product } from "@/types/product";

const products = [
  { id: "1", title: "Gold headphones" },
  { id: "2", title: "Black headphones" },
  { id: "3", title: "Vanilla Perfume" },
] as Product[];

describe("filterProducts", () => {
  it("returns all products for an empty query", () => {
    expect(filterProducts(products, "")).toEqual(products);
  });

  it("matches product titles case-insensitively", () => {
    expect(filterProducts(products, "PERFUME")).toEqual([products[2]]);
  });

  it("supports partial matches", () => {
    expect(filterProducts(products, "head")).toEqual([
      products[0],
      products[1],
    ]);
  });

  it("ignores surrounding whitespace", () => {
    expect(filterProducts(products, "  gold  ")).toEqual([products[0]]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterProducts(products, "laptop")).toEqual([]);
  });
});
