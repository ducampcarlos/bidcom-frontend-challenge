import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/feedback/EmptyState";

describe("EmptyState", () => {
  it("shows the no-results message and a link per category", () => {
    render(<EmptyState categories={["beauty", "furniture"]} />);

    expect(
      screen.getByText("No se encontró ningún producto. Te recomendamos buscar estas categorías"),
    ).toBeInTheDocument();

    const beautyLink = screen.getByRole("link", { name: "beauty" });
    expect(beautyLink).toHaveAttribute("href", "/search?s=beauty");
  });

  it("points category links at a custom search base path when given one", () => {
    render(<EmptyState categories={["beauty"]} searchBasePath="/v2/search" />);

    expect(screen.getByRole("link", { name: "beauty" })).toHaveAttribute(
      "href",
      "/v2/search?s=beauty",
    );
  });
});
