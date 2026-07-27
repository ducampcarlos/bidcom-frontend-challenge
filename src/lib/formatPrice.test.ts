import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/formatPrice";

describe("formatPrice", () => {
  it("formats a number as USD currency", () => {
    expect(formatPrice(9.99)).toBe("$9.99");
  });

  it("rounds to two decimals", () => {
    expect(formatPrice(10)).toBe("$10.00");
  });
});
