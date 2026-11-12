import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getProducts,
  getProductById,
  ProductsNotFoundError,
  ProductNotFoundError,
} from "./products";
import type { PaginatedProducts } from "@/types/product";

const validResponse: PaginatedProducts = {
  data: [
    {
      id: "product-1",
      title: "Test headphones",
      description: "Wireless headphones",
      price: 499,
      discountedPrice: 399,
      rating: 4.5,
      image: {
        url: "https://example.com/headphones.jpg",
        alt: "Black headphones",
      },
      tags: ["electronics"],
      reviews: [
        {
          id: "review-1",
          username: "Test user",
          rating: 5,
          description: "Great headphones",
        },
      ],
    },
  ],
  meta: {
    isFirstPage: true,
    isLastPage: true,
    currentPage: 1,
    previousPage: null,
    nextPage: null,
    pageCount: 1,
    totalCount: 1,
  },
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("getProducts", () => {
  it("returns a valid paginated product response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => validResponse,
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(getProducts()).resolves.toEqual(validResponse);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://v2.api.noroff.dev/online-shop?page=1&limit=12",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("rejects malformed product data", async () => {
    const invalidResponse = {
      ...validResponse,
      data: [
        {
          ...validResponse.data[0],
          price: "not-a-number",
        },
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => invalidResponse,
      }),
    );

    await expect(getProducts()).rejects.toThrow("Invalid product API response");
  });

  it("passes an abort signal to fetch", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => validResponse,
    });

    vi.stubGlobal("fetch", fetchMock);

    await getProducts();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://v2.api.noroff.dev/online-shop?page=1&limit=12",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("configures an eight-second request timeout", async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => validResponse,
    });

    vi.stubGlobal("fetch", fetchMock);

    await getProducts();

    expect(timeoutSpy).toHaveBeenCalledWith(8_000);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://v2.api.noroff.dev/online-shop?page=1&limit=12",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  describe("product API failure handling", () => {
    it("preserves the product-list 404 error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        }),
      );

      await expect(getProducts()).rejects.toBeInstanceOf(ProductsNotFoundError);
    });

    it("preserves the single-product 404 error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        }),
      );

      await expect(getProductById("missing-product")).rejects.toBeInstanceOf(
        ProductNotFoundError,
      );
    });

    it("rejects malformed JSON", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => {
            throw new SyntaxError("Unexpected token");
          },
        }),
      );

      await expect(getProducts()).rejects.toThrow();
    });

    it("rejects a network failure", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
      );

      await expect(getProducts()).rejects.toThrow();
    });

    it("rejects an invalid single-product response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            data: {
              ...validResponse.data[0],
              price: "invalid",
            },
          }),
        }),
      );

      await expect(getProductById("product-1")).rejects.toThrow(
        "Invalid product API response",
      );
    });

    it("returns a valid single product", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            data: validResponse.data[0],
          }),
        }),
      );

      await expect(getProductById("product-1")).resolves.toEqual(
        validResponse.data[0],
      );
    });
  });
  describe("product price sorting", () => {
    it.each([
      ["price-asc", "asc"],
      ["price-desc", "desc"],
    ] as const)(
      "requests %s while preserving page and limit",
      async (sort, expectedOrder) => {
        const fetchMock = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => validResponse,
        });

        vi.stubGlobal("fetch", fetchMock);

        await getProducts(2, 12, sort);

        expect(fetchMock).toHaveBeenCalledOnce();

        const requestUrl = new URL(fetchMock.mock.calls[0][0]);

        expect(requestUrl.searchParams.get("page")).toBe("2");
        expect(requestUrl.searchParams.get("limit")).toBe("12");
        expect(requestUrl.searchParams.get("sort")).toBe("discountedPrice");
        expect(requestUrl.searchParams.get("sortOrder")).toBe(expectedOrder);
      },
    );
  });
});
