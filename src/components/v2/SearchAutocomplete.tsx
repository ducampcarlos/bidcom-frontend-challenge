"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Product } from "@/core/entities/Product";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/formatPrice";

const DEBOUNCE_MS = 250;
const SUGGESTION_LIMIT = 6;

export function SearchAutocomplete() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Debounced as-you-type suggestions, fetched through /api/v2/search (the one
  // Route Handler that lets this client component reach the existing
  // searchProductsUseCase without ever importing the container/use-case layer
  // directly from client code).
  useEffect(() => {
    const trimmed = term.trim();
    if (!trimmed) {
      return;
    }

    // `cancelled` guards against a stale response landing after the user has
    // already typed a further character (a new effect run set it before this
    // one's fetch resolved). Without it, a slow response for an earlier term
    // could overwrite the suggestions for what's currently in the input.
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/v2/search?s=${encodeURIComponent(trimmed)}&limit=${SUGGESTION_LIMIT}`,
        );
        if (!response.ok) return;
        const data: { products: Product[] } = await response.json();
        if (cancelled) return;
        setSuggestions(data.products);
        setIsOpen(true);
      } catch {
        // Ignore network errors here; the user can still press Enter to hit /v2/search.
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  function goToSearch() {
    setIsOpen(false);
    // The only genuine server round-trip left in this component: autocomplete
    // suggestions and category/sort filtering are both already-instant
    // client-side work, so this is the one place worth a visible loading
    // state. No need to reset it back to false: this component unmounts once
    // the new /v2/search page takes over.
    setIsNavigating(true);
    router.push(`/v2/search?${new URLSearchParams({ s: term.trim() }).toString()}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToSearch();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      goToSearch();
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex w-full items-center gap-1 rounded-full border border-line bg-white py-1 pr-1 pl-4"
      >
        <Input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Buscar productos, marcas..."
          aria-label="Buscar productos"
          className="border-none bg-transparent p-0 focus:ring-0"
        />
        <button
          type="submit"
          aria-label="Buscar"
          disabled={isNavigating}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:cursor-wait"
        >
          {isNavigating ? (
            <svg className="h-4.5 w-4.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </form>

      {isOpen && term.trim() && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
          {suggestions.map((product) => (
            <li key={product.sku}>
              <Link
                href={`/v2/product/${product.sku}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-brand-soft"
              >
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-50">
                  <Image src={product.thumbnail} alt="" fill sizes="40px" className="object-contain p-1" />
                </span>
                <span className="flex-1 truncate text-sm text-black">{product.title}</span>
                <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
