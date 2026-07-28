import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "@/components/ui/Logo";

describe("Logo", () => {
  it("renders the Bidcom wordmark", () => {
    render(<Logo />);

    expect(screen.getByText("Bidcom")).toBeInTheDocument();
  });
});
