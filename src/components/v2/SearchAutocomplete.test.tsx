import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchAutocomplete } from "@/components/v2/SearchAutocomplete";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  pushMock.mockClear();
  vi.restoreAllMocks();
});

const suggestion = {
  id: 1,
  sku: "PHN-001",
  title: "Phone X",
  price: 499,
  category: "smartphones",
  thumbnail: "https://cdn.dummyjson.com/thumb.webp",
  description: "",
};

function mockSuggestFetch(products: unknown[]) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ products, total: products.length }),
  }) as unknown as typeof fetch;
}

describe("SearchAutocomplete", () => {
  it("shows suggestions after debounce while typing", async () => {
    mockSuggestFetch([suggestion]);
    render(<SearchAutocomplete />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar productos" }), {
      target: { value: "phone" },
    });

    expect(await screen.findByText("Phone X")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/v2/search?s=phone"));
  });

  it("does not show suggestions when the response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    render(<SearchAutocomplete />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar productos" }), {
      target: { value: "phone" },
    });
    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("ignores a stale response for an earlier term that resolves after a newer one", async () => {
    const resolvers: Array<(value: unknown) => void> = [];
    global.fetch = vi.fn().mockImplementation(() => new Promise((resolve) => resolvers.push(resolve)));

    render(<SearchAutocomplete />);
    const input = screen.getByRole("searchbox", { name: "Buscar productos" });

    fireEvent.change(input, { target: { value: "a" } });
    await new Promise((resolve) => setTimeout(resolve, 300));

    fireEvent.change(input, { target: { value: "ab" } });
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(resolvers).toHaveLength(2);
    resolvers[1]({ ok: true, json: async () => ({ products: [{ ...suggestion, title: "Fresh AB" }] }) });
    expect(await screen.findByText("Fresh AB")).toBeInTheDocument();

    resolvers[0]({ ok: true, json: async () => ({ products: [{ ...suggestion, title: "Stale A" }] }) });
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(screen.queryByText("Stale A")).not.toBeInTheDocument();
    expect(screen.getByText("Fresh AB")).toBeInTheDocument();
  });

  it("does not fetch suggestions for an empty/whitespace term", async () => {
    mockSuggestFetch([suggestion]);
    render(<SearchAutocomplete />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar productos" }), {
      target: { value: "   " },
    });

    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("navigates to /v2/search on Enter", async () => {
    mockSuggestFetch([]);
    render(<SearchAutocomplete />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    fireEvent.change(input, { target: { value: "phone" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(pushMock).toHaveBeenCalledWith("/v2/search?s=phone");
  });

  it("shows a loading spinner on the submit button once a search navigation starts", async () => {
    mockSuggestFetch([]);
    render(<SearchAutocomplete />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    fireEvent.change(input, { target: { value: "phone" } });

    const button = screen.getByRole("button", { name: "Buscar" });
    expect(button).not.toBeDisabled();

    fireEvent.keyDown(input, { key: "Enter" });

    expect(button).toBeDisabled();
  });

  it("does not navigate on the Enter that confirms an IME composition", async () => {
    mockSuggestFetch([]);
    render(<SearchAutocomplete />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    fireEvent.change(input, { target: { value: "日本語" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("links each suggestion to its product page and closes the dropdown when clicked", async () => {
    mockSuggestFetch([suggestion]);
    render(<SearchAutocomplete />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar productos" }), {
      target: { value: "phone" },
    });

    const link = await screen.findByRole("link", { name: /Phone X/ });
    expect(link).toHaveAttribute("href", "/v2/product/PHN-001");

    fireEvent.click(link);
    await waitFor(() => expect(screen.queryByText("Phone X")).not.toBeInTheDocument());
  });

  it("navigates to /v2/search when the form is submitted via the button", async () => {
    mockSuggestFetch([]);
    render(<SearchAutocomplete />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar productos" }), {
      target: { value: "phone" },
    });
    fireEvent.submit(screen.getByRole("search"));

    expect(pushMock).toHaveBeenCalledWith("/v2/search?s=phone");
  });

  it("does nothing on focus when there are no suggestions loaded yet", () => {
    mockSuggestFetch([]);
    render(<SearchAutocomplete />);

    fireEvent.focus(screen.getByRole("searchbox", { name: "Buscar productos" }));

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("closes the dropdown shortly after the input blurs", async () => {
    mockSuggestFetch([suggestion]);
    render(<SearchAutocomplete />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    fireEvent.change(input, { target: { value: "phone" } });
    await screen.findByText("Phone X");

    fireEvent.blur(input);

    await waitFor(() => expect(screen.queryByText("Phone X")).not.toBeInTheDocument());
  });

  it("reopens the dropdown on focus when suggestions are already loaded", async () => {
    mockSuggestFetch([suggestion]);
    render(<SearchAutocomplete />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    fireEvent.change(input, { target: { value: "phone" } });
    await screen.findByText("Phone X");

    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(() => expect(screen.queryByText("Phone X")).not.toBeInTheDocument());

    fireEvent.focus(input);
    expect(await screen.findByText("Phone X")).toBeInTheDocument();
  });

  it("closes the dropdown on Escape", async () => {
    mockSuggestFetch([suggestion]);
    render(<SearchAutocomplete />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    fireEvent.change(input, { target: { value: "phone" } });
    await screen.findByText("Phone X");

    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() => expect(screen.queryByText("Phone X")).not.toBeInTheDocument());
  });
});
