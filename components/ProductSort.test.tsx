/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ProductSort from "./ProductSort";

afterEach(() => {
  cleanup();
});

describe("ProductSort", () => {
  it("shows the current sort with an accessible label", () => {
    render(<ProductSort sort="price-asc" />);

    expect(screen.getByRole("combobox", { name: "Sort by" })).toHaveValue(
      "price-asc",
    );

    expect(screen.getByRole("button", { name: "Apply" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("submits the selected sort without carrying over the page number", () => {
    render(<ProductSort sort="default" />);

    const select = screen.getByRole("combobox", { name: "Sort by" });

    fireEvent.change(select, { target: { value: "price-desc" } });

    const form = select.closest("form");

    if (!form) {
      throw new Error("Expected the sorting control to be inside a form");
    }

    expect(form).toHaveAttribute("action", "/");

    const formData = new FormData(form);

    expect(formData.get("sort")).toBe("price-desc");
    expect(formData.has("page")).toBe(false);
  });

  it("updates the selection when the URL sort prop changes", () => {
    const { rerender } = render(<ProductSort sort="price-asc" />);

    rerender(<ProductSort sort="price-desc" />);

    expect(screen.getByRole("combobox", { name: "Sort by" })).toHaveValue(
      "price-desc",
    );

    rerender(<ProductSort sort="default" />);

    expect(screen.getByRole("combobox", { name: "Sort by" })).toHaveValue(
      "default",
    );
  });
});
