import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      <p className="text-black/60">No pudimos encontrar lo que buscabas.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
