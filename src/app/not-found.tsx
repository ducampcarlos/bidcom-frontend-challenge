import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      <p className="text-black/60">No pudimos encontrar lo que buscabas.</p>
      <Link href="/" className="text-blue-600 underline">
        Volver al inicio
      </Link>
    </div>
  );
}
