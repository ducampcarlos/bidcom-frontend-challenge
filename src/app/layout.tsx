import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bidcom",
  description: "Catálogo de productos Bidcom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-zinc-50 font-sans text-black">{children}</body>
    </html>
  );
}
