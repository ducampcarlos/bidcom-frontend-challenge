import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SearchAutocomplete } from "@/components/v2/SearchAutocomplete";

export function HeaderV2() {
  return (
    <header className="border-b border-line bg-white">
      <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/v2" aria-label="Ir al inicio de Bidcom v2">
            <Logo variant="onWhite" />
          </Link>
          <Link
            href="/"
            className="rounded-full border border-brand/30 px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand-soft"
          >
            Versión clásica
          </Link>
        </div>
        <SearchAutocomplete />
      </Container>
    </header>
  );
}
