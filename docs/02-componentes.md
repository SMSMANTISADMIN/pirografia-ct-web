# 02 — Componentes reutilizables

Todos los componentes en `components/`. Cada uno tiene un proposito unico y bien definido.

---

## Componentes activos (en uso)

### `HeaderBar.tsx`

**Tipo**: Server Component

**Proposito**: Barra de navegacion superior sticky con blur. Contiene:
- Logo a la izquierda (link a `/`)
- Nombre del sitio y tagline (desde `siteConfig`)
- Botones CTA: WhatsApp y Correo (con iconos Lucide)

**Dependencias**: `siteConfig`, `whatsappHref()`, iconos `MessageCircle`, `Mail`

**Props**: Ninguna (usa `siteConfig` directamente)

**Donde modificar**:
- Cambiar logo → `HeaderBar.tsx:12-14` (src `/brand/logo-mark.png`)
- Agregar/quitar CTAs → `HeaderBar.tsx:30-47`
- Cambiar tamano del header → `HeaderBar.tsx:9`

---

### `FooterBar.tsx`

**Tipo**: Server Component

**Proposito**: Footer con tres secciones:
- Nombre del sitio + ano actual
- Links de navegacion (desde `siteConfig.links`)
- Iconos de redes sociales (Instagram, TikTok, YouTube via Lucide)

**Dependencias**: `siteConfig`, iconos `Instagram`, `Youtube`, `Music2`

**Donde modificar**:
- Agregar/quitar redes → `FooterBar.tsx:21-31`
- Cambiar links de nav → `lib/site-config.ts:16-22`

---

### `Hero.tsx`

**Tipo**: Client Component (`'use client'`)

**Proposito**: Hero de la homepage con carrusel automatico de obras destacadas. Funcionalidad:
- Lee `data/portfolio.json` directamente (no usa `lib/portfolio.ts`)
- Normaliza hasta 9 items (rellena ciclicamente si hay menos)
- Divide en paginas de 3 columnas
- Auto-rota cada 3.4s con fade transition
- Dots de navegacion manual
- Cada imagen tiene overlay con titulo, tamano, ano, tags
- Tags solo visibles en hover (desktop)

**Dependencias**: `next/image`, `next/link`, `data/portfolio.json`

**Donde modificar**:
- Cambiar velocidad de rotacion → `Hero.tsx:56` (intervalo `3400` ms)
- Cambiar tamano maximo de items → `Hero.tsx:32` (`toNine()`)
- Cambiar layout (1 columna vs 2) → `Hero.tsx:174` (`lg:grid-cols-[0.50fr_1.50fr]`)
- Cambiar textos del hero → `Hero.tsx:181-187`
- Cambiar CTAs → `Hero.tsx:190-218`

---

### `CatalogCard.tsx`

**Tipo**: Server Component

**Proposito**: Tarjeta de producto para el listado del catalogo. Muestra:
- Imagen thumbnail 80x80
- Titulo, subtitulo (tamanos o notas)
- Precio USD + equivalente en Bs
- Link a la pagina de detalle

**Props**:
```typescript
{
  title: string
  href: string
  cover?: string
  priceUsd: number
  fxRate: number          // Tasa BCV para conversion
  subtitle?: string
}
```

**Donde modificar**:
- Cambiar diseno de la card → `CatalogCard.tsx:16-42`
- Cambiar formato de precio → usa `formatUsd()` y `formatBsFromUsd()`

---

### `CatalogConfigurator.tsx`

**Tipo**: Client Component (`'use client'`)

**Proposito**: Componente mas complejo de la aplicacion. Configurador interactivo de pedidos. Funcionalidad:
- Detecta tipo de item (`categoria` vs `llavero`)
- Para categorias: selector de colores (sin/2/4), envoltura (si/no), texto (si/no)
- Para llaveros: solo texto (con letras/sin letras)
- Piezas adicionales (con +/- y precio unitario)
- Campo de nota libre
- Calculo en tiempo real del total (base + addons + piezas extra)
- Conversion a Bs con tasa BCV (desde `useRate()`)
- Generacion de mensaje formateado para WhatsApp
- Boton CTA "Enviar por WhatsApp" con el mensaje pre-armado

**Props**:
```typescript
{ item: CatalogItem }
```

**Estado interno**:
- `colorOpt`: `'none' | '2' | '4'`
- `envoltura`: boolean
- `texto`: boolean
- `additionalPieces`: number
- `note`: string

**Dependencias**: `useRate()`, `getPricingTable()`, `formatUsd()`, `formatBsFromUsd()`, `siteConfig`, `whatsappHref()`

**Donde modificar**:
- Agregar/quitar opciones → `CatalogConfigurator.tsx:76-168`
- Cambiar calculo de precio → `CatalogConfigurator.tsx:29-45`
- Cambiar formato del mensaje WhatsApp → `CatalogConfigurator.tsx:47-64`
- Cambiar texto del boton → `CatalogConfigurator.tsx:224`

---

### `MuseoGrid.tsx`

**Tipo**: Server Component

**Proposito**: Grid responsivo de tarjetas de piezas del portafolio. Muestra:
- Imagen de portada (aspect 3/2)
- Overlay con titulo y tags (max 3)
- Ano y tamano en el footer de la card
- Descripcion truncada a 2 lineas

**Props**:
```typescript
{ items: PortfolioItem[] }
```

**Donde modificar**:
- Cambiar grid columns → `MuseoGrid.tsx:7` (`sm:grid-cols-2 lg:grid-cols-3`)
- Cambiar aspect ratio → `MuseoGrid.tsx:14` (`aspect-[3/2]`)
- Cambiar max tags visibles → `MuseoGrid.tsx:20` (`.slice(0, 3)`)

---

### `AdminRatePanel.tsx`

**Tipo**: Client Component (`'use client'`)

**Proposito**: Panel completo de administracion de tasa BCV. Funcionalidad:
- Campo para `ADMIN_API_TOKEN`
- Display de tasa actual, modo, status, fecha
- Botones: Recargar, Refrescar AUTO
- Campo de tasa manual + botones Activar MANUAL / Volver a AUTO
- Tabla de fuentes (proveedores) con estado individual

**Dependencias**: `/api/rate`, `/api/rate/refresh`, `/api/rate/manual`

**Donde modificar**:
- Agregar/quitar controles → `AdminRatePanel.tsx:65-113`
- Cambiar UI de fuentes → `AdminRatePanel.tsx:116-141`

---

### `SectionCard.tsx`

**Tipo**: Server Component

**Proposito**: Wrapper reutilizable para secciones con titulo. Usado en homepage, calculadora, cargue, museo, links.

**Props**:
```typescript
{
  title: string
  children: React.ReactNode
  className?: string
}
```

**Donde modificar**:
- Cambiar estilos base → `SectionCard.tsx:13`

---

## Componentes legacy (NO USAR)

### `CircleCTA.tsx`

Componente circular CTA con efecto glow. **No se usa en ninguna pagina actual.** Si necesitas un CTA circular, podes rescatarlo.

### `Hero-v1.tsx` a `Hero-v5.tsx`

Cinco iteraciones anteriores del Hero. **No se usan.** Conservadas como referencia de diseno. El componente activo es `Hero.tsx`.

**Recomendacion**: Eliminar en proxima limpieza (ver [08-deuda-tecnica.md](./08-deuda-tecnica.md)).
