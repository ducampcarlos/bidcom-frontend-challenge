import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SearchBar } from "@/components/layout/SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-brand">
      <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/" aria-label="Ir a la página principal">
            <Logo />
          </Link>
          <Link
            href="/v2"
            className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10"
          >
            Probar V2
          </Link>
        </div>
        <SearchBar />
      </Container>
    </header>
  );
}
