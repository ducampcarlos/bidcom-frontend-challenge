import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductListingV2 } from "@/components/v2/ProductListingV2";
import { mockProduct } from "@/test/fixtures";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

const cheapBeauty = {
  ...mockProduct,
  id: 1,
  sku: "SKU-1",
  title: "Cheap Beauty",
  category: "beauty",
  price: 10,
  rating: 3,
};
const pricyFragrance = {
  ...mockProduct,
  id: 2,
  sku: "SKU-2",
  title: "Pricy Fragrance",
  category: "fragrances",
  price: 50,
  rating: 4.8,
};
const midMisc = {
  ...mockProduct,
  id: 3,
  sku: "SKU-3",
  title: "Mid Misc",
  category: "misc",
  price: 25,
  rating: undefined,
};

const products = [cheapBeauty, pricyFragrance, midMisc];

describe("ProductListingV2", () => {
  it("shows the empty state when there are no products", () => {
    render(
      <ProductListingV2
        query="zzz"
        initialProducts={[]}
        initialTotal={0}
        categories={["beauty"]}
        emptyStateCategories={["beauty", "fragrances"]}
      />,
    );

    expect(
      screen.getByText("No se encontró ningún producto. Te recomendamos buscar estas categorías"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "beauty" })).toHaveAttribute("href", "/v2/search?s=beauty");
  });

  it("renders the grid when there are products", () => {
    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={["beauty", "fragrances", "misc"]}
        emptyStateCategories={[]}
      />,
    );

    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(3);
  });

  it("fetches category-scoped products from the server when a category is chosen", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [cheapBeauty], total: 1 }),
    }) as unknown as typeof fetch;

    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={["beauty", "fragrances", "misc"]}
        emptyStateCategories={[]}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "beauty");

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("s=beauty"));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("skip=0"));

    const links = await screen.findAllByRole("link", { name: /Cheap Beauty/ });
    expect(links).toHaveLength(1);
    expect(screen.queryByText("Pricy Fragrance")).not.toBeInTheDocument();
  });

  it("shows a no-match message when the chosen category has no products", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [], total: 0 }),
    }) as unknown as typeof fetch;

    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={["beauty"]}
        emptyStateCategories={[]}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "beauty");

    expect(await screen.findByText("Esa categoría no tiene productos por ahora.")).toBeInTheDocument();
  });

  it("shows the no-products message when the category fetch itself fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={["beauty"]}
        emptyStateCategories={[]}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "beauty");

    expect(await screen.findByText("Esa categoría no tiene productos por ahora.")).toBeInTheDocument();
  });

  it("restores the original listing instantly when the category filter is cleared", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [cheapBeauty], total: 1 }),
    }) as unknown as typeof fetch;

    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={["beauty", "fragrances", "misc"]}
        emptyStateCategories={[]}
      />,
    );

    const select = screen.getByLabelText("Categoría");
    await userEvent.selectOptions(select, "beauty");
    await screen.findByText("Cheap Beauty");
    (global.fetch as ReturnType<typeof vi.fn>).mockClear();

    await userEvent.selectOptions(select, "");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByText("Pricy Fragrance")).toBeInTheDocument();
    expect(screen.getByText("Mid Misc")).toBeInTheDocument();
  });

  it("sorts ascending by price", async () => {
    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={[]}
        emptyStateCategories={[]}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Ordenar por"), "price-asc");

    const productLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("/v2/product/"));
    expect(productLinks.map((link) => link.getAttribute("href"))).toEqual([
      `/v2/product/${cheapBeauty.sku}`,
      `/v2/product/${midMisc.sku}`,
      `/v2/product/${pricyFragrance.sku}`,
    ]);
  });

  it("sorts descending by price", async () => {
    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={[]}
        emptyStateCategories={[]}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Ordenar por"), "price-desc");

    const productLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("/v2/product/"));
    expect(productLinks.map((link) => link.getAttribute("href"))).toEqual([
      `/v2/product/${pricyFragrance.sku}`,
      `/v2/product/${midMisc.sku}`,
      `/v2/product/${cheapBeauty.sku}`,
    ]);
  });

  it("sorts by rating, treating a missing rating as 0", async () => {
    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={[]}
        emptyStateCategories={[]}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Ordenar por"), "rating-desc");

    const productLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("/v2/product/"));
    expect(productLinks[0]).toHaveAttribute("href", `/v2/product/${pricyFragrance.sku}`);
    expect(productLinks[2]).toHaveAttribute("href", `/v2/product/${midMisc.sku}`);
  });

  it("hides the load-more button once every product has been loaded", () => {
    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={[]}
        emptyStateCategories={[]}
      />,
    );

    expect(screen.queryByRole("button", { name: "Cargar más" })).not.toBeInTheDocument();
  });

  it("loads more products and appends them", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [midMisc], total: 3 }),
    }) as unknown as typeof fetch;

    render(
      <ProductListingV2
        query=""
        initialProducts={[cheapBeauty, pricyFragrance]}
        initialTotal={3}
        categories={[]}
        emptyStateCategories={[]}
      />,
    );

    const button = screen.getByRole("button", { name: "Cargar más" });
    await userEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("skip=2"));
    expect(await screen.findByText(midMisc.title)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cargar más" })).not.toBeInTheDocument();
  });

  it("continues paginating the selected category, not the original query, once one is active", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ products: [cheapBeauty], total: 2 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ products: [midMisc], total: 2 }) }) as unknown as typeof fetch;

    render(
      <ProductListingV2
        query=""
        initialProducts={products}
        initialTotal={3}
        categories={["beauty", "fragrances", "misc"]}
        emptyStateCategories={[]}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "beauty");
    await screen.findByText("Cheap Beauty");

    await userEvent.click(screen.getByRole("button", { name: "Cargar más" }));

    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining("s=beauty"));
    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining("skip=1"));
    expect(await screen.findByText("Mid Misc")).toBeInTheDocument();
  });

  it("threads forcedSort through both load-more and category-change requests", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [midMisc], total: 4 }),
    }) as unknown as typeof fetch;

    render(
      <ProductListingV2
        query=""
        initialProducts={[cheapBeauty, pricyFragrance]}
        initialTotal={4}
        categories={["beauty"]}
        emptyStateCategories={[]}
        forcedSort="discount-desc"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Cargar más" }));
    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining("sort=discount-desc"));

    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "beauty");
    expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining("sort=discount-desc"));
  });

  it("leaves the list unchanged when the load-more request fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    render(
      <ProductListingV2
        query=""
        initialProducts={[cheapBeauty, pricyFragrance]}
        initialTotal={3}
        categories={[]}
        emptyStateCategories={[]}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Cargar más" }));

    expect(screen.getByRole("button", { name: "Cargar más" })).toBeInTheDocument();
    expect(screen.queryByText(midMisc.title)).not.toBeInTheDocument();
  });
});
