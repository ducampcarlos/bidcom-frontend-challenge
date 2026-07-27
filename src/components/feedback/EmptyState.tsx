import Link from "next/link";
import type { Category } from "@/core/entities/Category";

export interface EmptyStateProps {
  categories: Category[];
}

export function EmptyState({ categories }: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 py-16 text-center">
      <p className="max-w-md text-base text-black/70">
        No se encontró ningún producto. Te recomendamos buscar estas categorías
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={`/search?s=${encodeURIComponent(category)}`}
              className="inline-flex rounded-full border border-black/10 px-3 py-1 text-sm capitalize text-blue-600 hover:bg-blue-50"
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
