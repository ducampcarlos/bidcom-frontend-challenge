import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SearchBar } from "@/components/layout/SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-brand">
      <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label="Ir a la página principal" className="shrink-0">
          <Logo />
        </Link>
        <SearchBar />
      </Container>
    </header>
  );
}
