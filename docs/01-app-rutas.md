# 01 — App Router: Rutas y API endpoints

Todas las paginas y endpoints viven en `app/`. Next.js App Router utiliza el sistema de carpetas para definir rutas.

---

## Layout raiz

### `app/layout.tsx`

**Tipo**: Server Component

**Proposito**: Layout raiz de toda la aplicacion. Define:
- `<html lang="es">` — idioma espanol
- Metadata SEO basica (`title`, `description` desde `siteConfig`)
- Estructura base: `<body>` con clase `grain` (efecto film grain), `HeaderBar` sticky arriba, `<main>` centrado con max-width, `FooterBar` abajo

**Dependencias**: `HeaderBar`, `FooterBar`, `globals.css`, `siteConfig`

**Donde modificar**:
- Cambiar metadata SEO → `layout.tsx:7-10`
- Cambiar idioma → `layout.tsx:14` (`lang="es"`)
- Cambiar ancho maximo → `layout.tsx:18` (`max-w-6xl`)

---

## Paginas

### `/` — Homepage (`app/page.tsx`)

**Tipo**: Server Component

**Proposito**: Landing page. Contiene:
- Componente `Hero` con carrusel de obras destacadas
- `SectionCard` de "Acceso rapido" con links a todas las secciones
- `SectionCard` de "Estado" con roadmap de fases

**Dependencias**: `Hero`, `SectionCard`

**Donde modificar**:
- Cambiar links de acceso rapido → `page.tsx:13-24`
- Cambiar contenido del roadmap → `page.tsx:30-44`

### `/catalogo` — Listado de catalogo (`app/catalogo/page.tsx`)

**Tipo**: Server Component

**Proposito**: Lista todos los items del catalogo como tarjetas. Muestra:
- Titulo y descripcion
- Tasa BCV actual (desde `getFxRateServer()`)
- Grid de `CatalogCard` con precio USD y Bs

**Datos**: `getCatalog()` → `data/catalog.json`

**Donde modificar**:
- Cambiar layout del listado → `page.tsx:19-31`
- Cambiar texto de descripcion → `page.tsx:13-15`

### `/catalogo/[slug]` — Detalle de producto (`app/catalogo/[slug]/page.tsx`)

**Tipo**: Server Component + Client Component anidado

**Proposito**: Pagina de detalle para cada item del catalogo. Contiene:
- Breadcrumb (Catalogo / Producto)
- Imagen del producto, tamanos, notas, precio base
- `CatalogConfigurator` (Client Component) para configurar el pedido

**SSG**: `generateStaticParams()` genera rutas estaticas para todos los slugs.

**Datos**: `getCatalogItemBySlug(params.slug)` + `getFxRateServer()`

**Donde modificar**:
- Cambiar layout del detalle → `page.tsx:53-88`
- Modificar breadcrumb → `page.tsx:33-39`

### `/museo` — Galeria del museo (`app/museo/page.tsx`)

**Tipo**: Server Component

**Proposito**: Galeria de piezas del portafolio con:
- Filtro por tags (query param `?tag=`)
- Paginacion (query param `?page=`, 24 items/pagina)
- Grid de `MuseoGrid`

**Datos**: `getPortfolio()`, `getPortfolioTags()` → `data/portfolio.json`

**Donde modificar**:
- Cambiar tamano de pagina → `page.tsx:8` (`pageSize = 24`)
- Cambiar logica de filtrado → `page.tsx:12-15`

### `/museo/[id]` — Detalle de pieza (`app/museo/[id]/page.tsx`)

**Tipo**: Server Component

**Proposito**: Vista detallada de una pieza del portafolio. Soporta:
- Imagen estatica (si no hay `permalink`)
- Embed de Instagram via iframe (si hay `permalink`)
- Boton de WhatsApp para solicitar informacion

**Datos**: `getPortfolioById(params.id)`

**Donde modificar**:
- Cambiar embed de Instagram → `page.tsx:26-37`
- Cambiar mensaje de WhatsApp → `page.tsx:49`

### `/calculadora` — Calculadora de precios (`app/calculadora/page.tsx`)

**Tipo**: Client Component (`'use client'`)

**Proposito**: Calculadora interactiva de precios. Inputs:
- Ancho (cm), Alto (cm)
- Complejidad (1-5, slider)
- Tarifa por hora (€), Costo de material (€), Margen (%)

**Formula** (v1, `page.tsx:14-28`):
```
area = (ancho * alto) / 100          // dm²
horas = max(1, (1.2 + area * 0.18) * (0.7 + complejidad * 0.25))
manoObra = horas * tarifa
subtotal = manoObra + material
total = subtotal * (1 + margen/100)
```

**Donde modificar**:
- Cambiar formula → `page.tsx:15-22`
- Agregar/quitar inputs → `page.tsx:39-71`

### `/cargue` — Upload de archivos (`app/cargue/page.tsx`)

**Tipo**: Client Component (`'use client'`)

**Proposito**: UI de carga de archivos (placeholder v1). Permite:
- Seleccionar tipo (imagen/video)
- Ingresar titulo, nota
- Seleccionar archivo, previsualizar
- Boton "Subir" que muestra alert (no funcional aun)

**Estado**: Placeholder. Backend planeado para v2 (Cloudinary + Supabase).

**Donde modificar**:
- Conectar backend real → `page.tsx:63` (reemplazar `alert()`)
- Agregar campos → `page.tsx:26-68`

### `/links` — Enlaces y redes (`app/links/page.tsx`)

**Tipo**: Server Component

**Proposito**: Pagina con enlaces rapidos y redes sociales. Datos desde `siteConfig.links` y `siteConfig.socials`.

**Datos**: `siteConfig`

**Donde modificar**:
- Cambiar enlaces → `lib/site-config.ts:16-22`
- Cambiar sociales → `lib/site-config.ts:11-15`

### `/admin` — Panel de administracion (`app/admin/page.tsx`)

**Tipo**: Server Component + Client Component anidado

**Proposito**: Panel de administracion de tasa BCV. Contiene:
- Instrucciones de uso
- `AdminRatePanel` (Client Component) con controles de tasa

**Donde modificar**:
- Cambiar instrucciones → `page.tsx:8-11`

---

## API Routes

Todas usan `export const runtime = 'nodejs'`. Requieren Node.js runtime (no Edge).

### `GET /api/rate`

**Archivo**: `app/api/rate/route.ts`

**Proposito**: Devuelve el estado actual de la tasa BCV.

**Response**:
```json
{
  "rate": 357,
  "mode": "auto",
  "status": "ok-3of3",
  "updatedAt": "2026-06-06T...",
  "sources": [...]
}
```

**Usado por**: `useRate()` (client-side hook), `AdminRatePanel`

**Donde modificar**:
- Cambiar campos expuestos → `route.ts:9-21`

### `POST /api/rate/refresh`

**Archivo**: `app/api/rate/refresh/route.ts`

**Proposito**: Dispara un refresco de tasa BCV. Flujo:
1. Verifica `ADMIN_API_TOKEN` (query param `?token=`)
2. Si modo manual → saltea
3. Ejecuta los 3 proveedores en paralelo
4. Corre el algoritmo de consenso
5. Si consenso OK → actualiza tasa y persiste
6. Si no hay consenso → mantiene `lastGoodRate`, marca `stale`

**Protegido por**: `ADMIN_API_TOKEN` (si esta configurado)

**Donde modificar**:
- Cambiar tolerancias → `route.ts:27-28` (usa env vars)

### `POST /api/rate/manual`

**Archivo**: `app/api/rate/manual/route.ts`

**Proposito**: Cambia entre modo auto y manual, o establece tasa manual.

**Body**:
```json
{ "mode": "manual", "manualRate": 400 }
// o
{ "mode": "auto" }
```

**Protegido por**: `ADMIN_API_TOKEN` (si esta configurado)

**Donde modificar**:
- Cambiar validacion de tasa → `route.ts:28`

---

## CSS Global

### `app/globals.css`

**Proposito**: Estilos globales de la aplicacion:
- Directivas de Tailwind (`@tailwind base/components/utilities`)
- `color-scheme: dark` forzado
- Fondo negro, texto blanco
- Efecto film grain (`.grain::before`) con SVG turbulence filter
- Estilos de accesibilidad (`:focus-visible`)

**Donde modificar**:
- Cambiar/eliminar film grain → `globals.css:18-27`
- Cambiar color de fondo/texto → `globals.css:13-15`
