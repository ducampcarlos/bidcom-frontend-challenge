import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Price } from "@/components/ui/Price";

describe("Price", () => {
  it("renders the value formatted as currency", () => {
    render(<Price value={19.99} />);
    expect(screen.getByText("$19.99")).toBeInTheDocument();
  });
});
