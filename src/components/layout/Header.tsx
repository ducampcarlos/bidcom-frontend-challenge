import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SearchBar } from "@/components/layout/SearchBar";

export function Header() {
  return (
    <header className="border-b border-black/10 bg-white">
      <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label="Ir a la página principal">
          <Logo />
        </Link>
        <SearchBar />
      </Container>
    </header>
  );
}
