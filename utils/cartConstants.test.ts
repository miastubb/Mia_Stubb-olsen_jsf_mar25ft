import { describe, expect, it } from "vitest";
import { MAX_CART_QUANTITY } from "@/utils/cartConstants";

describe("cart quantity limits", () => {
  it("sets the maximum cart quantity to 99", () => {
    expect(MAX_CART_QUANTITY).toBe(99);
  });
});