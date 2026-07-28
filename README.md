# Bidcom Frontend Challenge

Mini catálogo de productos construido con Next.js (App Router), TypeScript y Tailwind CSS,
consumiendo la API pública de [DummyJSON](https://dummyjson.com/docs/products). Hecho como
resolución de la Evaluación Técnica Frontend de Bidcom.

## Requisitos

- Node.js 20+
- npm

## Setup

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm test` | Corre la suite de Vitest una vez |
| `npm run test:watch` | Vitest en modo watch |
| `npm run test:ui` | Vitest con UI interactiva |
| `npm run storybook` | Storybook en modo desarrollo (puerto 6006) |
| `npm run build-storybook` | Build estático de Storybook |

## Páginas

- **`/`** — listado de productos (sin filtro, primeros 20 del catálogo).
- **`/search?s=termino`** — listado filtrado por el término de búsqueda ingresado en el header.
  Sin resultados, muestra un mensaje + 5 categorías sugeridas (linkean a esta misma ruta).
- **`/product/[sku]`** — detalle de un producto por su `sku`. El PDF del challenge solo exige
  el *routing* hacia esta ruta (no describe su contenido); se construyó con criterio propio
  (imagen, nombre, precio, descripción, categoría) para que la navegación quede completa.

## Arquitectura

El código sigue una separación estilo Clean Architecture, pensada para que la fuente de datos
(hoy DummyJSON) sea intercambiable sin tocar la UI ni la lógica de negocio:

```
src/
├── app/               Rutas de Next.js (capa externa) — Server Components, sin lógica propia
├── components/        Design System: ui/ (átomos), product/, layout/, feedback/
├── core/               Dominio puro: entities, repositories (interfaces), use-cases
├── infrastructure/     Adaptadores que implementan los puertos de core/ (hoy: DummyJSON)
├── lib/                 config.ts, formatPrice.ts, container.ts (composition root)
└── test/                setup de Vitest, fixtures y fakes para tests
```

Los `use-cases` (`SearchProductsUseCase`, `GetProductBySkuUseCase`, `ListCategoriesUseCase`)
dependen de la interfaz `ProductRepository`, no de `fetch` ni de DummyJSON directamente
(Dependency Inversion). `lib/container.ts` es el único lugar donde se conecta la implementación
real (`DummyJsonProductRepository`) con los use-cases; las páginas solo importan de ahí. Cambiar
de fuente de datos el día de mañana implica escribir una nueva implementación del repositorio,
sin tocar componentes ni use-cases — y permite testear los use-cases con un repositorio fake en
memoria (`src/test/fakes/FakeProductRepository.ts`), sin red.

Server-side oriented: el fetching de datos ocurre en Server Components (`page.tsx`, funciones
`async`). El único Client Component es `SearchBar` (necesita estado local y navegación).

## Notas sobre la API de DummyJSON

- El listado usa `GET /products/search?q=<termino>&limit=20` (una búsqueda con `q` vacío
  devuelve el catálogo completo, por eso el home reutiliza el mismo use-case que `/search`).
- Las 5 categorías del estado vacío salen de `GET /products/category-list`.
- **No existe un endpoint para buscar un producto por `sku`** (es un campo, no una key de
  lookup). `findBySku` trae el catálogo completo (`GET /products?limit=0&select=...`, ~194
  productos, con selección de campos para aligerar el payload) y filtra localmente. Se cachea
  con `revalidate` largo (1h) para no pagar ese costo en cada visita a `/product/[sku]`.

## Testing

Vitest + React Testing Library, en `jsdom`. Cobertura:

- **Unitarios**: mapeo DTO → entidad de dominio, `formatPrice`, los tres use-cases contra un
  repositorio fake en memoria, átomos (`Button`, `Price`).
- **Integración**: `ProductGrid` / `EmptyState` / `ProductListing` con datos mockeados,
  `SearchBar` con `next/navigation` mockeado (verifica el `push` con la URL correctamente
  encodeada), y un test que invoca la función `async` de `/search` directamente con `fetch`
  global stubbeado — ejercita el wiring real (container → use-case → repositorio → mapper →
  componentes) de punta a punta sin depender de la red.

`next/image` se mockea en `src/test/setup.tsx` por un `<img>` plano: la validación de hosts
remotos contra `next.config.ts` solo tiene sentido corriendo bajo el runtime real de Next
(dev/build/start), no en `jsdom`.

## Storybook

Historias para los átomos del Design System y los componentes compuestos principales:
`Button`, `Input`, `Badge`, `Price`, `Logo`, `ProductCard`, `Header`, `SearchBar`, `EmptyState`.

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://dummyjson.com` | Base URL de la API de productos |
