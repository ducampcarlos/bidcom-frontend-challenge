import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFoundV2 from "@/app/v2/not-found";

describe("v2 NotFound", () => {
  it("shows a message and a link back to /v2", () => {
    render(<NotFoundV2 />);

    expect(screen.getByText("No encontramos ese producto")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/v2");
  });
});
