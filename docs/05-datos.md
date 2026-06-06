# 05 — Datos (`data/`)

Store de datos en JSON plano. Sin base de datos, sin ORM, sin migraciones. Los archivos se importan directamente en Server Components o modulos de `lib/`.

---

## Archivos activos (en uso)

### `data/catalog.json` — Catalogo de productos

**Version**: `1.0`
**Moneda**: USD (todos los precios)
**Estructura**:

```json
{
  "version": "1.0",
  "currency": "USD",
  "pricingTable": {
    "additionalPieceUsd": 2,
    "categories": {
      "1": { "color2": 1, "color4": 1, "envoltura": 2 },
      "2": { "color2": 2, "color4": 4, "envoltura": 5 },
      ...
      "8": { "color2": 18, "color4": 24, "envoltura": 19 }
    }
  },
  "items": [
    {
      "id": "cat-2",
      "type": "categoria",
      "title": "Categoria 2",
      "slug": "categoria-2",
      "cover": "/images/catalogo/cat2.jpg",
      "basePriceUsd": 23,
      "textIncludedPriceUsd": 26,
      "sizes": ["13cm x 16cm", "13cm x 18cm"],
      "notes": ["Resina incluida"]
    }
    // ... 7 categorias + 1 llavero
  ]
}
```

**Campo `textIncludedPriceUsd`**: Precio cuando se incluye texto. Si no esta presente, `CatalogConfigurator` usa `basePriceUsd`.

**Pricing table**: Los add-ons (`color2`, `color4`, `envoltura`) se indexan por numero de categoria (1-8). La categoria 1 no existe en items (empieza en 2), pero su fila esta definida.

**Items**: 7 categorias (cat-2 a cat-8) + 1 llavero (llavero-1).

**Consumido por**: `lib/catalog.ts`

**Donde modificar**:
- Agregar/quitar producto → agregar/quitar objeto en array `items`
- Cambiar precios → modificar `basePriceUsd` o `textIncludedPriceUsd`
- Cambiar add-ons → modificar `pricingTable.categories`
- Agregar nueva categoria → nuevo item en `items` + fila en `pricingTable.categories`

---

### `data/portfolio.json` — Portafolio / Museo

**Version**: `1.0`
**Estructura**:

```json
{
  "version": "1.0",
  "items": [
    {
      "id": "m001",
      "title": "Pieza m001",
      "cover": "/images/museo/m001.webp",
      "tags": ["museo"],
      "year": 2026,
      "size": "",
      "description": "",
      "permalink": ""
    }
    // ... 8 items (m001 a m008)
  ]
}
```

**Campo `permalink`**: Si tiene valor, la pagina de detalle muestra un embed de Instagram en vez de la imagen estatica. Debe ser una URL de Instagram (post o reel).

**Campo `tags`**: Usados para filtrar en la galeria (`/museo?tag=xxx`).

**Items**: 8 piezas placeholder (m001-m008). Todas con tags `["museo"]`, sin descripcion, sin permalink.

**Consumido por**: `lib/portfolio.ts`, `components/Hero.tsx` (lee el JSON directamente)

**Donde modificar**:
- Agregar/quitar pieza → `items[]`
- Activar embed de Instagram → agregar `permalink` con URL del post
- Agregar tags para filtros → modificar `tags[]`
- Cambiar imagenes → modificar `cover`

---

## Archivos legacy (NO USAR)

### `data/catalogo.ts`

**Estado**: Duplicado hardcodeado de `data/catalog.json`. Contiene los mismos datos pero en TypeScript con `export const`.

**Problema**: Si alguien modifica este archivo en vez de `catalog.json`, los cambios no tendran efecto porque `lib/catalog.ts` importa de `catalog.json`, no de `catalogo.ts`.

**Recomendacion**: Eliminar. Ver [08-deuda-tecnica.md](./08-deuda-tecnica.md).

### `data/museo.json`

**Estado**: 3 items placeholder con schema diferente (`MuseoItem` con campo `price_from`).

**Schema legacy**:
```json
[{
  "id": "m_001",
  "title": "Retrato — Realismo",
  "cover": "/images/museo/sample-1.svg",
  "tags": ["retrato", "realismo"],
  "year": 2026,
  "size": "30x40",
  "price_from": 0,
  "description": "..."
}]
```

**Consumido por**: `lib/museo.ts` (que no se usa en ninguna pagina).

**Recomendacion**: Eliminar junto con `lib/museo.ts`.

### `data/portfolio-v1.json`

**Estado**: 3 items legacy de una version anterior del portafolio.

**Recomendacion**: Eliminar. No referenciado en ninguna parte.

---

## Estado en runtime

### `var/rate-state.json`

**Proposito**: Cache de tasa BCV. Escrito por `lib/rates/storage.ts`.

**Estructura**: Ver `RateState` en [04-sistema-tasas-bcv.md](./04-sistema-tasas-bcv.md#typests--tipos-del-sistema).

**Git**: NO se commitea. `var/` esta en `.gitignore`.

---

## Convenciones para modificar datos

1. **Siempre modifica el JSON, nunca el `.ts`**: `catalog.json` y `portfolio.json` son las fuentes de verdad.
2. **Los slugs deben ser unicos**: Cada item del catalogo tiene un `slug` que se usa en la URL (`/catalogo/<slug>`).
3. **Los IDs deben ser unicos**: Cada pieza del portafolio tiene un `id` (`/museo/<id>`).
4. **Las imagenes deben existir en `public/`**: El campo `cover` debe apuntar a un archivo real (ej: `/images/catalogo/cat2.jpg`).
5. **Precios en USD**: Todos los precios en los JSON estan en dolares. La conversion a Bs ocurre en runtime.
