import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterSortBar } from "@/components/v2/FilterSortBar";

describe("FilterSortBar", () => {
  it("calls onCategoryChange with the chosen category", async () => {
    const onCategoryChange = vi.fn();
    render(
      <FilterSortBar
        categories={["beauty", "fragrances"]}
        category=""
        sort=""
        onCategoryChange={onCategoryChange}
        onSortChange={vi.fn()}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "beauty");

    expect(onCategoryChange).toHaveBeenCalledWith("beauty");
  });

  it("calls onSortChange with the chosen sort option", async () => {
    const onSortChange = vi.fn();
    render(
      <FilterSortBar
        categories={[]}
        category=""
        sort=""
        onCategoryChange={vi.fn()}
        onSortChange={onSortChange}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Ordenar por"), "price-asc");

    expect(onSortChange).toHaveBeenCalledWith("price-asc");
  });

  it("reflects the current category and sort as the selected options", () => {
    render(
      <FilterSortBar
        categories={["beauty"]}
        category="beauty"
        sort="price-desc"
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Categoría")).toHaveValue("beauty");
    expect(screen.getByLabelText("Ordenar por")).toHaveValue("price-desc");
  });

  it("disables both selects while a category fetch is in flight", () => {
    render(
      <FilterSortBar
        categories={["beauty"]}
        category=""
        sort=""
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        disabled
      />,
    );

    expect(screen.getByLabelText("Categoría")).toBeDisabled();
    expect(screen.getByLabelText("Ordenar por")).toBeDisabled();
  });
});
