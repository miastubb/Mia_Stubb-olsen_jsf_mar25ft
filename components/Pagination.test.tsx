/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Pagination from "./Pagination";
import type { PaginationMeta } from "@/types/product";

const meta: PaginationMeta = {
  currentPage: 2,
  pageCount: 3,
  isFirstPage: false,
  isLastPage: false,
  previousPage: 1,
  nextPage: 3,
  totalCount: 25,
};

afterEach(() => {
  cleanup();
});

describe("Pagination sorting", () => {
  it.each(["price-asc", "price-desc"] as const)(
    "preserves %s in both navigation links",
    (sort) => {
      render(<Pagination meta={meta} sort={sort} />);

      expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
        "href",
        `/?page=1&sort=${sort}`,
      );

      expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
        "href",
        `/?page=3&sort=${sort}`,
      );
    },
  );

  it("keeps default pagination URLs free of sorting parameters", () => {
    render(<Pagination meta={meta} />);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/?page=1",
    );

    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/?page=3",
    );
  });
});
