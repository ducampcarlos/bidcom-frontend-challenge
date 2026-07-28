"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/Input";

export function SearchBar() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ s: term.trim() });
    router.push(`/search?${params.toString()}`);
  }

  // Relying on the native <button type="submit"> for Enter-to-submit turned out
  // to be flaky in manual testing (some keyboard/IME states never fired the
  // form's submit event). Submitting explicitly on Enter makes it deterministic.
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // isComposing guards IME input (e.g. typing Japanese/Chinese/Korean): the Enter
    // that confirms a composition candidate must not also submit the form.
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full max-w-md items-center gap-1 rounded-full bg-white py-1 pr-1 pl-4"
    >
      <Input
        type="search"
        name="s"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="¿Qué estás buscando?"
        aria-label="Buscar productos"
        className="border-none bg-transparent p-0 focus:ring-0"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
