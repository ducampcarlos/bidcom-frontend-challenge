"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SearchBar() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ s: term.trim() });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full max-w-md gap-2">
      <Input
        type="search"
        name="s"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
      />
      <Button type="submit">Buscar</Button>
    </form>
  );
}
