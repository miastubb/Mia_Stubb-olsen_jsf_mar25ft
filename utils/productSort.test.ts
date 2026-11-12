import { describe, expect, it } from "vitest";
import { parseProductSort } from "./productSort";

describe("parseProductSort", () => {
  it("accepts ascending and descending price sorting", () => {
    expect(parseProductSort("price-asc")).toBe("price-asc");
    expect(parseProductSort("price-desc")).toBe("price-desc");
  });

  it("uses default ordering when sorting is omitted or explicitly default", () => {
    expect(parseProductSort(undefined)).toBe("default");
    expect(parseProductSort("default")).toBe("default");
  });

  it("falls back to default ordering for invalid values", () => {
    expect(parseProductSort("")).toBe("default");
    expect(parseProductSort("invalid")).toBe("default");
  });

  it("falls back to default ordering for repeated URL parameters", () => {
    expect(parseProductSort(["price-asc", "price-desc"])).toBe("default");
    expect(parseProductSort(["price-asc"])).toBe("default");
  });
});
