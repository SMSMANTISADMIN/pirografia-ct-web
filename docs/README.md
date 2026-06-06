# Documentacion — Pirografia-CT Portal v2

Documentacion quirurgica del repositorio. Cada archivo cubre una capa especifica del sistema para que puedas ubicar exactamente donde modificar sin afectar lo que no corresponde.

---

## Indice de archivos

| Archivo | Contenido |
|---|---|
| [arquitectura.md](./arquitectura.md) | Vision general, stack tecnologico, diagrama Mermaid |
| [01-app-rutas.md](./01-app-rutas.md) | App Router: layout raiz, paginas, API routes |
| [02-componentes.md](./02-componentes.md) | Componentes reutilizables (HeaderBar, FooterBar, Hero, etc.) |
| [03-logica-negocio.md](./03-logica-negocio.md) | `lib/` — site-config, catalog, portfolio, currency, museo |
| [04-sistema-tasas-bcv.md](./04-sistema-tasas-bcv.md) | `lib/rates/` — Sistema completo de tasa BCV (proveedores, consenso, storage) |
| [05-datos.md](./05-datos.md) | `data/` — JSON store, esquemas, relaciones |
| [06-estilos-y-config.md](./06-estilos-y-config.md) | Tailwind, CSS global, next.config, tsconfig, ESLint, PostCSS |
| [07-assets-publicos.md](./07-assets-publicos.md) | `public/` — Imagenes, logos, placeholders |
| [08-deuda-tecnica.md](./08-deuda-tecnica.md) | Codigo legacy, duplicado, no usado, roadmap v2 |
| [09-flujos-datos.md](./09-flujos-datos.md) | Diagramas de flujo: USD→Bs, consenso BCV, pedido WhatsApp |

---

## Guia rapida: Donde tocar para cambiar X

| Quiero cambiar... | Ubicacion exacta |
|---|---|
| **Nombre del sitio / tagline** | `lib/site-config.ts:2-3` |
| **Numero de WhatsApp** | `lib/site-config.ts:7` |
| **Email de contacto** | `lib/site-config.ts:8` |
| **Links de redes sociales** | `lib/site-config.ts:11-15` |
| **Tasa USD/Bs de fallback** | `lib/site-config.ts:6` (`usdRateBs: 357`) |
| **Precios del catalogo (USD)** | `data/catalog.json` → `pricingTable` y `items[].basePriceUsd` |
| **Agregar/quitar productos del catalogo** | `data/catalog.json` → array `items` |
| **Precios de add-ons (color, envoltura)** | `data/catalog.json` → `pricingTable.categories` |
| **Piezas del portafolio/museo** | `data/portfolio.json` → array `items` |
| **Agregar/quitar tags del museo** | `data/portfolio.json` → `items[].tags` |
| **Proveedores de tasa BCV (URLs)** | Variables de entorno: `RATE_A_URL`, `RATE_A_PATH`, etc. |
| **Tolerancia del consenso BCV** | Variable de entorno: `RATE_DELTA_PCT` (default 0.5%) |
| **Anti-salto BCV** | Variable de entorno: `RATE_MAX_JUMP_PCT` (default 5%) |
| **Token de admin** | Variable de entorno: `ADMIN_API_TOKEN` |
| **Modo storage de tasa** | Variable de entorno: `RATE_STORAGE` (`file` o `memory`) |
| **Estilos visuales (colores, sombras)** | `tailwind.config.ts` → `theme.extend.colors.brand` |
| **Efecto film grain** | `app/globals.css:18-27` (`.grain::before`) |
| **Formula de la calculadora** | `app/calculadora/page.tsx:14-28` |
| **Logica de configurador de pedidos** | `components/CatalogConfigurator.tsx` |
| **Mensaje de WhatsApp generado** | `components/CatalogConfigurator.tsx:47-64` |
| **Metadata SEO** | `app/layout.tsx:7-10` |
| **Header (logo, CTAs)** | `components/HeaderBar.tsx` |
| **Footer (links, socials)** | `components/FooterBar.tsx` |
| **Hero de la homepage** | `components/Hero.tsx` |
| **Layout de la homepage** | `app/page.tsx` |
| **Imagenes del catalogo** | `public/images/catalogo/` |
| **Imagenes del museo** | `public/images/museo/` |
| **Logo** | `public/brand/logo-mark.png` |

---

## Convenciones

- **Tipo de componente**: `'use client'` al inicio del archivo = Client Component. Sin el = Server Component (RSC).
- **Datos**: Siempre en `data/*.json`. No hay base de datos.
- **Precios**: Siempre en USD en los JSON. La conversion a Bs ocurre en runtime con la tasa BCV.
- **Rutas**: Next.js App Router. Cada carpeta en `app/` es una ruta.
- **Alias**: `@/` apunta a la raiz del proyecto, `@/components/`, `@/lib/`, `@/data/`.

---

## Flujo de lectura recomendado

1. [arquitectura.md](./arquitectura.md) — entender el panorama general
2. [09-flujos-datos.md](./09-flujos-datos.md) — entender como fluye la informacion
3. [01-app-rutas.md](./01-app-rutas.md) — entender las paginas y endpoints
4. Luego segun necesidad: componentes, logica, datos, etc.
5. [08-deuda-tecnica.md](./08-deuda-tecnica.md) — saber que NO modificar
