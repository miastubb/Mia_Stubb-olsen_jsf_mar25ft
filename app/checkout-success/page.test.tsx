/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: pushMock,
  }),
}));

afterEach(() => {
  cleanup();
});

describe("CheckoutSuccessPage", () => {
  beforeEach(() => {
    pushMock.mockClear();
    sessionStorage.clear();
  });

  it("redirects visitors who have not completed checkout", async () => {
    render(<CheckoutSuccessClient />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/checkout");
    });

    expect(
      screen.queryByRole("heading", { name: /order confirmed/i }),
    ).not.toBeInTheDocument();
  });

  it("shows confirmation after a completed checkout", async () => {
    sessionStorage.setItem("nextstore-demo-checkout", "completed");

    render(<CheckoutSuccessClient />);

    expect(
      await screen.findByRole("heading", {
        name: /order confirmed/i,
      }),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });
});
