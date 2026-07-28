import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/components/layout/SearchBar";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

afterEach(() => {
  pushMock.mockClear();
});

describe("SearchBar", () => {
  it("navigates to /search?s=<term> on submit", async () => {
    render(<SearchBar />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    await userEvent.type(input, "phone");
    await userEvent.click(screen.getByRole("button", { name: "Buscar" }));

    expect(pushMock).toHaveBeenCalledWith("/search?s=phone");
  });

  it("encodes special characters in the search term", async () => {
    render(<SearchBar />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    await userEvent.type(input, "a&b");
    await userEvent.click(screen.getByRole("button", { name: "Buscar" }));

    expect(pushMock).toHaveBeenCalledWith("/search?s=a%26b");
  });

  it("navigates to /search?s=<term> when Enter is pressed", async () => {
    render(<SearchBar />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    await userEvent.type(input, "phone{Enter}");

    expect(pushMock).toHaveBeenCalledWith("/search?s=phone");
    expect(pushMock).toHaveBeenCalledOnce();
  });

  it("does not submit on the Enter that confirms an IME composition", async () => {
    render(<SearchBar />);

    const input = screen.getByRole("searchbox", { name: "Buscar productos" });
    await userEvent.type(input, "日本語");
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
