import Link from "next/link";

export default function NotFoundV2() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
      <h1 className="text-3xl font-bold">No encontramos ese producto</h1>
      <p className="text-black/60">Probá buscando algo distinto.</p>
      <Link
        href="/v2"
        className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
