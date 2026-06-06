# 03 — Logica de negocio (`lib/`)

Modulos en `lib/` que contienen la logica de negocio, acceso a datos y utilidades. No contienen UI.

---

## `site-config.ts` — Configuracion central del sitio

Objeto `siteConfig` que centraliza toda la configuracion editable del portal.

```typescript
siteConfig = {
  name: 'PIROGRAFIA_CT',           // Nombre del sitio
  tagline: 'Catalogo · ...',       // Tagline / descripcion
  usdRateBs: 357,                  // Tasa de fallback (cuando no hay BCV)
  contact: {
    whatsappNumber: '+584242167169',
    email: 'correo@ejemplo.com'
  },
  socials: {
    instagram: 'https://...',
    tiktok: 'https://...',
    youtube: 'https://...'
  },
  links: [                         // Navegacion principal
    { label: 'Catalogo', href: '/catalogo' },
    ...
  ]
}
```

**Funcion auxiliar**: `whatsappHref(message?)` — genera URL `https://wa.me/<numero>?text=<mensaje>`.

**Donde modificar**: Todo lo que sea configuracion del negocio (contacto, redes, links).

---

## `catalog.ts` — Acceso a datos del catalogo

**Fuente de datos**: `data/catalog.json`

**Tipos exportados**:
```typescript
CatalogItemType = 'categoria' | 'llavero'

CatalogItem = {
  id: string
  type: CatalogItemType
  title: string
  slug: string
  cover?: string
  basePriceUsd: number
  textIncludedPriceUsd?: number   // Precio si incluye texto
  sizes?: string[]
  notes?: string[]
}

PricingRow = { color2: number; color4: number; envoltura: number }

PricingTable = {
  additionalPieceUsd: number       // Precio por pieza extra
  categories: Record<string, PricingRow>  // "1" a "8"
}
```

**Funciones exportadas**:

| Funcion | Retorna | Uso |
|---|---|---|
| `getCatalog()` | `CatalogItem[]` | Lista todos los items |
| `getPricingTable()` | `PricingTable` | Tabla de add-ons |
| `getCatalogItemBySlug(slug)` | `CatalogItem \| undefined` | Busca item por slug |
| `getCatalogSlugs()` | `string[]` | Todos los slugs (para SSG) |

**Donde modificar**:
- Agregar/quitar campos del tipo → `catalog.ts:3-15`
- Cambiar estructura de pricing → `catalog.ts:17-22`
- Cambiar fuente de datos (ej: migrar a API) → `catalog.ts:1` (cambiar import)

---

## `portfolio.ts` — Acceso a datos del portafolio/museo

**Fuente de datos**: `data/portfolio.json`

**Tipo exportado**:
```typescript
PortfolioItem = {
  id: string
  title: string
  cover?: string
  tags: string[]
  year?: number
  size?: string
  description?: string
  permalink?: string            // URL de Instagram (si hay, se usa embed)
}
```

**Funciones exportadas**:

| Funcion | Retorna | Uso |
|---|---|---|
| `getPortfolio()` | `PortfolioItem[]` | Lista todas las piezas |
| `getPortfolioById(id)` | `PortfolioItem \| undefined` | Busca pieza por ID |
| `getPortfolioTags()` | `string[]` | Tags unicos ordenados |

**Donde modificar**:
- Agregar/quitar campos → `portfolio.ts:3-13`
- Cambiar fuente de datos → `portfolio.ts:1`

---

## `currency.ts` — Formateo y conversion de moneda

Utilidades puras para manejo de USD y Bs.

**Funciones exportadas**:

| Funcion | Input | Output | Ejemplo |
|---|---|---|---|
| `formatBs(value)` | `number` | `string` | `formatBs(35700)` → `"35.700Bs"` |
| `formatUsd(value)` | `number` | `string` | `formatUsd(23)` → `"23$"` |
| `usdToBs(usd, rate)` | `number, number` | `number` | `usdToBs(10, 357)` → `3570` |
| `bsToUsd(bs, rate)` | `number, number` | `number` | `bsToUsd(3570, 357)` → `10` |
| `formatBsFromUsd(usd, rate)` | `number, number` | `string` | `formatBsFromUsd(10, 357)` → `"3.570Bs"` |
| `formatUsdFromBs(bs, rate)` | `number, number` | `string` | `formatUsdFromBs(3570, 357)` → `"10$"` |

**Donde modificar**:
- Cambiar formato de Bs (separador de miles, sufijo) → `currency.ts:1-3`
- Cambiar formato de USD → `currency.ts:5-7`

---

## `museo.ts` — Acceso legacy al museo (NO USAR)

**Fuente de datos**: `data/museo.json` (schema diferente: `MuseoItem` con `price_from`)

**Estado**: Legacy. Las paginas actuales usan `portfolio.ts` con `data/portfolio.json`. Este archivo y su JSON asociado no se importan en ninguna ruta activa.

**Recomendacion**: No modificar. Eliminar en limpieza (ver [08-deuda-tecnica.md](./08-deuda-tecnica.md)).
