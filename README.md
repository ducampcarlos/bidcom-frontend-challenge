# Bidcom Frontend Challenge

Mini catálogo de productos construido con Next.js (App Router), TypeScript y Tailwind CSS,
consumiendo la API pública de [DummyJSON](https://dummyjson.com/docs/products). Hecho como
resolución de la Evaluación Técnica Frontend de Bidcom.

El repositorio tiene dos experiencias:

- **v1** (`/`, `/search`, `/product/[sku]`): resuelve la consigna del challenge tal cual está
  descripta en el PDF.
- **v2** (`/v2`, ver [sección V2](#v2)): una segunda experiencia más libre, pensada para mostrar
  qué tan reutilizable es la capa de dominio, reusando los mismos `use-cases` y `repository`
  que v1 detrás de una UI distinta.

## Stack

- [Next.js](https://nextjs.org) `16.2.11` (App Router, Server Components, Turbopack)
- [React](https://react.dev) `19.2.4`
- TypeScript `^5` (`strict: true`)
- Tailwind CSS `^4` (config CSS-first en `src/app/globals.css`, sin `tailwind.config.js`)
- [Vitest](https://vitest.dev) + React Testing Library + `jsdom`
- [Storybook](https://storybook.js.org) `^10` (`@storybook/nextjs-vite`)

## Cumplimiento de la consigna

### Criterios técnicos excluyentes

| Criterio | Cómo se cumple |
|---|---|
| TypeScript | Todo el código fuente es `.ts`/`.tsx`, con `strict: true` en `tsconfig.json`. |
| Tests de integración y/o unitarios | Vitest + Testing Library, 100% de statements/branches/functions/lines. Ver [Testing](#testing). |
| Última versión de Next.js | `16.2.11` (`package.json`). |
| Última versión de Tailwind | `^4` (`package.json`). |
| Responsive | Mobile first con los breakpoints de Tailwind (`sm:`, `lg:`); ver [Diseño](#diseño-y-design-system). |
| Server-side oriented | Todas las páginas son Server Components `async`; el fetching de datos ocurre en el servidor. Los únicos Client Components son los que necesitan estado o interacción del navegador (`SearchBar` en v1; `SearchAutocomplete`, `ProductListingV2`, `FilterSortBar` y `OfertasCarousel` en v2). |
| Buenas prácticas de componentización | Design System por capas (`ui/` átomos, `product/` / `layout/` / `feedback/` compuestos), con una responsabilidad por componente y props tipadas. |

### Criterios técnicos deseados

| Criterio | Cómo se cumple |
|---|---|
| Principios SOLID | Ver [Arquitectura](#arquitectura). |
| Clean Architecture | Capas `core/` (dominio) → `infrastructure/` (adaptadores) → `app/` + `components/` (UI); las dependencias siempre apuntan hacia adentro. |
| Design System | `src/components/ui/` (`Input`, `Badge`, `Price`, `Logo`, `Container`), documentado en Storybook. |
| Storybook | 8 historias para v1, 7 para v2. Ver [Storybook](#storybook). |
| Mobile first / container | `Container` centraliza el ancho máximo y el padding responsive; el resto de los componentes parte del layout mobile y agrega breakpoints hacia arriba. |

### Card de producto

| Criterio | Cómo se cumple |
|---|---|
| Imagen | `product.thumbnail`, provisto por DummyJSON. |
| Nombre | `product.title`. |
| Precio | `product.price`, formateado con `formatPrice` (`Intl.NumberFormat`). |

### Listado de productos (`/`)

| Criterio | Cómo se cumple |
|---|---|
| Header con logo → home | `Logo` dentro de un `Link` a `/`. |
| Buscador → `/search?s=$termino` (Enter o botón) | `SearchBar`. |
| Listado vía endpoint de búsqueda, límite 20 | `GetProductListingUseCase` → `SearchProductsUseCase` → `GET /products/search?q=&limit=20`. |
| Cards a todo el ancho, enfiladas según responsive | `ProductGrid` (grid de Tailwind, 1/2/4 columnas por breakpoint). |
| Click en producto → `/product/$sku` | `Link` dentro de cada `ProductCard`, usando el campo `sku` de la API. |
| Mensaje de "sin resultados" | `EmptyState`, con el texto literal pedido en el PDF. |
| 5 categorías sugeridas → `/search?s=$categoria` | `GET /products/category-list`, primeras 5. |

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
| `npm run test:coverage` | Corre la suite con reporte de cobertura |
| `npm run test:watch` | Vitest en modo watch |
| `npm run test:ui` | Vitest con UI interactiva |
| `npm run storybook` | Storybook en modo desarrollo (puerto 6006) |
| `npm run build-storybook` | Build estático de Storybook |

## Páginas

- **`/`**: listado de productos (sin filtro, primeros 20 del catálogo).
- **`/search?s=termino`**: listado filtrado por el término de búsqueda ingresado en el header.
  Sin resultados, muestra un mensaje + 5 categorías sugeridas (linkean a esta misma ruta).
- **`/product/[sku]`**: detalle de un producto por su `sku`. El PDF del challenge solo exige
  el *routing* hacia esta ruta (no describe su contenido); se construyó con criterio propio
  (imagen, nombre, precio, descripción, categoría) para que la navegación quede completa.

## V2

Además de las páginas del challenge, `/v2` es una segunda experiencia, más ambiciosa y libre
de la wireframe del PDF, pensada para mostrar qué tan reutilizable es la capa de dominio: usa
los mismos `use-cases`/`ProductRepository`/`container.ts` que v1, solo con una UI y features
distintas.

- **`/v2`**: home editorial con una sección de mejores ofertas (carrusel, ordenado por
  descuento) y el listado completo debajo.
- **`/v2/search?s=termino`** y **`/v2/ofertas`**: mismo listado reutilizable, con filtro por
  categoría, orden (precio/rating/relevancia) y paginación por "Cargar más".
- **`/v2/product/[sku]`**: detalle con rating, marca y precio tachado cuando hay descuento.
- Autocompletado en vivo en el buscador del header, vía `GET /api/v2/search` (el único Route
  Handler del proyecto: es la puerta de entrada que le permite a componentes cliente de v2
  llegar a `searchProductsUseCase` sin importar `container.ts` directamente).
- Cada header (v1 y v2) tiene un link para pasar a la otra versión.

Sus componentes (`src/components/v2/`) tienen historias de Storybook bajo el grupo `V2/`,
igual que el Design System de v1.

## Arquitectura

El código sigue una separación estilo Clean Architecture, pensada para que la fuente de datos
(hoy DummyJSON) sea intercambiable sin tocar la UI ni la lógica de negocio:

```
src/
├── app/               Rutas de Next.js (capa externa), Server Components, sin lógica propia
├── components/        Design System: ui/ (átomos), product/, layout/, feedback/, v2/
├── core/               Dominio puro: entities, repositories (interfaces), use-cases
├── infrastructure/     Adaptadores que implementan los puertos de core/ (hoy: DummyJSON)
├── lib/                 config.ts, formatPrice.ts, container.ts (composition root)
└── test/                setup de Vitest, fixtures y fakes para tests
```

Los `use-cases` (`SearchProductsUseCase`, `GetProductBySkuUseCase`, `ListCategoriesUseCase`,
`GetProductListingUseCase`) dependen de la interfaz `ProductRepository`, no de `fetch` ni de
DummyJSON directamente. `lib/container.ts` es el único lugar donde se conecta la implementación
real (`DummyJsonProductRepository`) con los use-cases; las páginas solo importan de ahí. Cambiar
de fuente de datos el día de mañana implica escribir una nueva implementación del repositorio,
sin tocar componentes ni use-cases, y permite testear los use-cases con un repositorio fake en
memoria (`src/test/fakes/FakeProductRepository.ts`), sin red.

Server-side oriented: el fetching de datos ocurre en Server Components (`page.tsx`, funciones
`async`). Los Client Components (`SearchBar` en v1; `SearchAutocomplete`, `FilterSortBar`,
`ProductListingV2` y `OfertasCarousel` en v2) son los mínimos necesarios para tener estado local
o navegación.

### SOLID

- **Single Responsibility**: cada use-case resuelve una sola operación (`SearchProductsUseCase`
  busca, `GetProductBySkuUseCase` trae un producto, `ListCategoriesUseCase` lista categorías);
  `GetProductListingUseCase` compone los dos primeros para la vista de listado.
- **Open/Closed**: agregar un nuevo campo de orden (`ProductSort`) o un nuevo parámetro de
  paginación se hizo extendiendo firmas con parámetros opcionales, sin modificar el
  comportamiento existente de ningún llamador.
- **Liskov Substitution**: `DummyJsonProductRepository` y `FakeProductRepository` implementan
  la misma interfaz `ProductRepository` y son intercambiables; los tests usan la segunda sin
  tocar los use-cases.
- **Interface Segregation**: `ProductRepository` expone solo tres métodos (`search`,
  `findBySku`, `listCategories`), lo mínimo que necesita cada use-case.
- **Dependency Inversion**: los use-cases dependen de la interfaz `ProductRepository`, no de la
  implementación concreta; `container.ts` es el único punto que conoce a
  `DummyJsonProductRepository`.

## Diseño y Design System

- **Mobile first**: las clases de Tailwind parten del layout mobile (sin prefijo) y agregan
  breakpoints hacia arriba (`sm:`, `lg:`) para pantallas más grandes, nunca al revés.
- **Container**: `src/components/ui/Container.tsx` centraliza el ancho máximo (`max-w-7xl`) y
  el padding horizontal responsive; todas las páginas y secciones lo reutilizan en vez de
  repetir esos valores.
- **Átomos** (`src/components/ui/`): `Input`, `Badge`, `Price`, `Logo`, `Container`, cada uno
  con su historia de Storybook.
- **Tokens de marca**: definidos en `src/app/globals.css` con `@theme` (Tailwind 4, sin
  `tailwind.config.js`): `--color-brand`, `--color-brand-dark`, `--color-brand-soft`,
  `--color-line`, `--color-paper`.

## Notas sobre la API de DummyJSON

- El listado usa `GET /products/search?q=<termino>&limit=20` (una búsqueda con `q` vacío
  devuelve el catálogo completo, por eso el home reutiliza el mismo use-case que `/search`).
- Las 5 categorías del estado vacío salen de `GET /products/category-list`.
- **No existe un endpoint para buscar un producto por `sku`** (es un campo, no una key de
  lookup). `findBySku` trae el catálogo completo (`GET /products?limit=0&select=...`, ~194
  productos, con selección de campos para aligerar el payload) y filtra localmente. Se cachea
  con `revalidate` largo (1h) para no pagar ese costo en cada visita a `/product/[sku]`.
- v2 agrega paginación (`skip`/`limit`) y orden (`sortBy`/`order`) sobre los mismos endpoints,
  y usa además los campos `brand`, `rating` y `discountPercentage` que v1 no muestra.

## Testing

Vitest + React Testing Library, en `jsdom`. Cobertura:

- **Unitarios**: mapeo DTO → entidad de dominio, `formatPrice`, los use-cases contra un
  repositorio fake en memoria, átomos (`Logo`, `Price`), y el manejo de errores HTTP de
  `DummyJsonProductRepository` (status no-ok → excepción).
- **Integración**: `ProductGrid` / `EmptyState` / `ProductListing` / `Header` con datos
  mockeados, `SearchBar` con `next/navigation` mockeado (verifica el `push` con la URL
  correctamente encodeada, incluyendo el caso de Enter durante una composición IME), y las
  páginas (`/`, `/search`, `/product/[sku]`, y sus equivalentes de v2) invocadas directamente
  como funciones `async` con `fetch` global stubbeado: ejercitan el wiring real (container →
  use-case → repositorio → mapper → componentes) de punta a punta sin depender de la red,
  incluyendo el caso 404 (`notFound()`) y los distintos shapes de `searchParams.s` (string,
  array, ausente).

`npm run test:coverage` corre la suite con reporte de cobertura (`@vitest/coverage-v8`):
100% de statements/branches/functions/lines sobre el código de dominio, infraestructura,
componentes y páginas (se excluyen `src/core/entities`, interfaces sin lógica, y los
`layout.tsx`, wiring de Next sin nada real que asertar).

`next/image` se mockea en `src/test/setup.tsx` por un `<img>` plano: la validación de hosts
remotos contra `next.config.ts` solo tiene sentido corriendo bajo el runtime real de Next
(dev/build/start), no en `jsdom`. También se agrega ahí un polyfill de `Element.scrollBy`,
que `jsdom` no implementa y que necesita el carrusel de v2 para no fallar en los tests.

## Storybook

Historias para los átomos del Design System y los componentes compuestos principales:
`Input`, `Badge`, `Price`, `Logo`, `ProductCard`, `Header`, `SearchBar`, `EmptyState`, y bajo
el grupo `V2/` sus equivalentes de `/v2`: `ProductCardV2`, `ProductGridV2`, `HeaderV2`,
`FilterSortBar`, `SearchAutocomplete`, `OfertasCarousel`, `OfertasSection`.

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://dummyjson.com` | Base URL de la API de productos |
