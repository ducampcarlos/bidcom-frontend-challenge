import type { Category } from "@/core/entities/Category";

export interface FilterSortBarProps {
  categories: Category[];
  category: string;
  sort: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  disabled?: boolean;
}

const SORT_OPTIONS = [
  { value: "", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "rating-desc", label: "Mejor calificados" },
] as const;

const SELECT_CLASSES =
  "rounded-full border-2 border-brand/30 bg-white px-3.5 py-2 text-sm font-medium text-black transition-colors hover:border-brand/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

// A pure controlled component: category/sort live in the parent's state (see
// ProductListingV2), not the URL, so selecting a value never triggers a full
// page navigation. Sort only ever re-orders data already in memory; category
// selection does fetch fresh data behind the scenes (see ProductListingV2),
// so `disabled` lets the parent lock the controls while that's in flight.
export function FilterSortBar({
  categories,
  category,
  sort,
  onCategoryChange,
  onSortChange,
  disabled = false,
}: FilterSortBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand/15 bg-brand-soft/60 px-4 py-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
        Categoría
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          disabled={disabled}
          className={`${SELECT_CLASSES} capitalize disabled:cursor-wait disabled:opacity-60`}
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
        Ordenar por
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          disabled={disabled}
          className={`${SELECT_CLASSES} disabled:cursor-wait disabled:opacity-60`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
