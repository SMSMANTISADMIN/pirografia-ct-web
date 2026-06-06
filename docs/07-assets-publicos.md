# 07 — Assets publicos (`public/`)

Archivos estaticos servidos directamente por Next.js. Se acceden desde la raiz (`/brand/logo-mark.png`, `/images/catalogo/cat2.jpg`, etc.).

---

## `public/brand/` — Identidad de marca

| Archivo | Formato | Nota |
|---|---|---|
| `logo-mark.png` | PNG | Logo principal. Usado en `HeaderBar.tsx` |
| `logo-mark.svg` | SVG | Version vectorial del logo |
| `logo-mark-2.svg` | SVG | Variante del logo |
| `logo-mark.webp.webp` | WebP | **Nota**: extension duplicada (`.webp.webp`) — posible error |

**Donde modificar**:
- Cambiar logo → reemplazar `logo-mark.png` (o cambiar referencia en `HeaderBar.tsx:12-14`)
- Agregar favicon → colocar en `public/` y referenciar en `app/layout.tsx` metadata

---

## `public/images/catalogo/` — Imagenes del catalogo

7 archivos JPG para las categorias + 1 para llaveros:

| Archivo | Usado por |
|---|---|
| `cat2.jpg` | Categoria 2 (`data/catalog.json` → `cat-2`) |
| `cat3.jpg` | Categoria 3 |
| `cat4.jpg` | Categoria 4 |
| `cat5.jpg` | Categoria 5 |
| `cat6.jpg` | Categoria 6 |
| `cat7.jpg` | Categoria 7 |
| `cat8.jpg` | Categoria 8 |
| `llaveros1.jpg` | Llaveros 1 |

**Donde modificar**:
- Cambiar imagen de un producto → reemplazar el archivo JPG (mismo nombre) o cambiar `cover` en `data/catalog.json`
- Agregar imagen para nueva categoria → colocar JPG en esta carpeta y referenciar en `data/catalog.json`

---

## `public/images/museo/` — Imagenes del portafolio/museo

8 archivos WebP para las piezas + placeholders:

| Archivo | Usado por |
|---|---|
| `m001.webp` a `m008.webp` | Piezas m001-m008 (`data/portfolio.json`) |
| `sample-1.svg` | Placeholder default (cuando no hay imagen) |
| `sample-2.svg` | Placeholder secundario |
| `sample-3.svg` | Placeholder terciario |
| `627697827_..._n.svg` | Imagen importada de Instagram (SVG convertido) |

**Placeholders**: `sample-1.svg` se usa como fallback en `CatalogCard.tsx:23`, `CatalogConfigurator` (via `item.cover`), y `MuseoGrid.tsx:15`.

**Donde modificar**:
- Cambiar imagen de una pieza → reemplazar el archivo WebP o cambiar `cover` en `data/portfolio.json`
- Agregar imagen para nueva pieza → colocar WebP y referenciar
- Cambiar placeholder default → reemplazar `sample-1.svg` o cambiar referencias en componentes

---

## Notas sobre assets

- **Formatos**: Las imagenes del catalogo estan en JPG, las del museo en WebP. Next.js las optimiza a AVIF/WebP en build.
- **Sin imagenes remotas**: `next.config.mjs` tiene `remotePatterns: []`. Si necesitas cargar imagenes de CDN (Cloudinary, Supabase), agrega el dominio a `remotePatterns`.
- **SVG como placeholder**: `sample-1.svg` se usa extensivamente como fallback. Si eliminas este archivo, varias partes de la UI mostraran broken images.
