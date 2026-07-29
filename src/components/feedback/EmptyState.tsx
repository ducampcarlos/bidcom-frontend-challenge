import Link from "next/link";
import type { Category } from "@/core/entities/Category";
import { Badge } from "@/components/ui/Badge";

export interface EmptyStateProps {
  categories: Category[];
  /** Lets v2 point these links at /v2/search instead of v1's /search. */
  searchBasePath?: string;
}

export function EmptyState({ categories, searchBasePath = "/search" }: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-16 text-center">
      <p className="max-w-md text-base text-black/70">
        No se encontró ningún producto. Te recomendamos buscar estas categorías
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <li key={category}>
            <Link href={`${searchBasePath}?s=${encodeURIComponent(category)}`}>
              <Badge className="capitalize transition-colors hover:bg-brand hover:text-white">
                {category}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
