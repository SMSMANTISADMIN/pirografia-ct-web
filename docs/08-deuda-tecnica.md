# 08 — Deuda tecnica y roadmap

Codigo legacy, duplicado, no utilizado, y plan de evolucion a v2. Esta seccion es critica para entender que NO modificar y que limpiar.

---

## Codigo duplicado

### `data/catalogo.ts` duplica `data/catalog.json`

| Aspecto | `data/catalog.json` | `data/catalogo.ts` |
|---|---|---|
| Formato | JSON | TypeScript hardcodeado |
| En uso | SI (`lib/catalog.ts` lo importa) | NO |
| Riesgo | — | Si alguien lo modifica creyendo que es la fuente, los cambios no tendran efecto |

**Accion**: Eliminar `data/catalogo.ts`. Es un espejo obsoleto.

---

## Codigo legacy no utilizado

### `lib/museo.ts` + `data/museo.json`

- `lib/museo.ts` define `MuseoItem` (con campo `price_from`) y funciones `getMuseo()`, `getMuseoById()`, `getMuseoTags()`
- `data/museo.json` contiene 3 items placeholder con schema legacy
- **Ninguna pagina o componente importa `lib/museo.ts`**
- Las paginas del museo usan `lib/portfolio.ts` + `data/portfolio.json`

**Accion**: Eliminar ambos archivos.

### `data/portfolio-v1.json`

3 items de una version anterior del portafolio. No referenciado en ninguna parte.

**Accion**: Eliminar.

### `components/Hero-v1.tsx` a `Hero-v5.tsx`

Cinco iteraciones anteriores del componente Hero. El componente activo es `Hero.tsx`.

**Accion**: Eliminar (o mover a carpeta `_archive/` si se quieren conservar como referencia).

### `components/CircleCTA.tsx`

Componente CTA circular. No se usa en ninguna pagina actual.

**Accion**: Eliminar o rescatar si se planea usar.

---

## Errores / Issues detectados

### Extension duplicada en logo

`public/brand/logo-mark.webp.webp` — tiene `.webp` duplicado en la extension. Posiblemente un error al exportar. No se usa actualmente (se usa `logo-mark.png` en `HeaderBar`).

**Accion**: Renombrar a `logo-mark.webp` o eliminar.

### Categoria 1 ausente en items

`data/catalog.json` tiene `pricingTable.categories["1"]` pero no existe un item con `slug: "categoria-1"`. Esto no causa errores (la fila simplemente no se usa), pero es inconsistente.

**Accion**: Agregar Categoria 1 o eliminar la fila del pricing table.

### Sin tests

No hay framework de testing configurado (ni Jest, ni Vitest, ni Playwright, ni Cypress). Cero cobertura.

**Accion**: Agregar al menos tests unitarios para `lib/currency.ts`, `lib/rates/consensus.ts` y `lib/rates/providers.ts`.

---

## Roadmap v2 (segun README)

| Feature | Estado actual | Plan v2 |
|---|---|---|
| **Upload de archivos** | UI placeholder (`/cargue`) | Backend con Cloudinary + Supabase |
| **Admin CRUD** | Solo tasa BCV (`/admin`) | Panel para gestionar catalogo, portafolio, tags, precios |
| **Base de datos** | JSON plano | Supabase (auth + estados de cargues) |
| **SEO** | Metadata basica | OpenGraph por pieza, meta tags, sitemap |
| **i18n** | Solo espanol | ES/EN con Next.js i18n routing |
| **Identidad visual** | Placeholder | Paleta definitiva, logo real |
| **Factura/resumen** | Solo mensaje WhatsApp | Resumen tipo factura, CTA sticky movil |

---

## Archivos a eliminar en limpieza

Lista consolidada de archivos que se pueden eliminar sin afectar funcionalidad:

```
data/catalogo.ts          # Duplicado de catalog.json
data/museo.json           # Legacy, reemplazado por portfolio.json
data/portfolio-v1.json    # Version anterior
lib/museo.ts              # Acceso legacy, no usado
components/Hero-v1.tsx    # Iteracion anterior
components/Hero-v2.tsx    # Iteracion anterior
components/Hero-v3.tsx    # Iteracion anterior
components/Hero-v4.tsx    # Iteracion anterior
components/Hero-v5.tsx    # Iteracion anterior
components/CircleCTA.tsx  # No usado
public/brand/logo-mark.webp.webp  # Extension duplicada
```

**Impacto**: Cero. Ninguno de estos archivos es importado por codigo activo.

---

## Recomendaciones de arquitectura para v2

1. **Migrar `siteConfig` a variables de entorno**: Actualmente los datos de contacto y redes estan hardcodeados en TypeScript. Mover a `.env` permitiria cambiar sin redeploy.
2. **Extraer la calculadora a `lib/`**: La formula esta incrustada en el componente. Moverla a `lib/calculator.ts` facilitaria testearla y reusarla.
3. **Unificar acceso a datos**: `catalog.ts` y `portfolio.ts` tienen patrones identicos. Se podria crear un helper generico `lib/data-access.ts`.
4. **Agregar rate limiting a la API**: Los endpoints `/api/rate/*` no tienen rate limiting. En produccion, un ataque podria saturar los proveedores externos.
