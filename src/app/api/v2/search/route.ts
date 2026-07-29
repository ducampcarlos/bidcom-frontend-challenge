import { NextResponse, type NextRequest } from "next/server";
import type { ProductSort } from "@/core/repositories/ProductRepository";
import { searchProductsUseCase } from "@/lib/container";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

function parseIntParam(value: string | null, fallback: number, min: number, max: number): number {
  if (value === null) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function parseSortParam(value: string | null): ProductSort | undefined {
  return value === "discount-desc" ? value : undefined;
}

// Client-side entry point for v2's autocomplete and "load more" pagination: the
// only place v2 client components reach the DummyJSON-backed use-case layer, so
// that layer stays server-only everywhere else (mirrors v1's all-Server-Components
// approach, just with one Route Handler instead of zero).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("s") ?? "";
  const limit = parseIntParam(searchParams.get("limit"), DEFAULT_LIMIT, 1, MAX_LIMIT);
  const skip = parseIntParam(searchParams.get("skip"), 0, 0, Number.MAX_SAFE_INTEGER);
  const sort = parseSortParam(searchParams.get("sort"));

  try {
    const result = await searchProductsUseCase.execute(query, limit, skip, sort);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "No pudimos completar la búsqueda." }, { status: 500 });
  }
}
