import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "@/components/ui/Logo";

describe("Logo", () => {
  it("renders the Bidcom wordmark in white by default (for the brand-blue header)", () => {
    render(<Logo />);

    expect(screen.getByText("Bidcom")).toHaveClass("text-white");
  });

  it("renders in brand-blue when variant is onWhite (for a light header)", () => {
    render(<Logo variant="onWhite" />);

    expect(screen.getByText("Bidcom")).toHaveClass("text-brand");
  });
});
