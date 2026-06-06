# 06 — Estilos y configuracion

Archivos de configuracion del proyecto: estilos, build, TypeScript, linting.

---

## `tailwind.config.ts` — Tema de Tailwind CSS

**Content paths**: Escanea `app/`, `components/`, `lib/` en busca de clases Tailwind.

**Personalizaciones**:

| Categoria | Clave | Valor | Uso |
|---|---|---|---|
| `boxShadow.glow` | sombra con glow | `0 0 0 1px rgba(255,255,255,.08), 0 20px 60px rgba(0,0,0,.55)` | Borders con efecto glow |
| `boxShadow.soft` | sombra suave | `0 0 0 1px rgba(255,255,255,.06), 0 12px 40px rgba(0,0,0,.35)` | Cards y contenedores |
| `colors.brand.ink` | `#0B0F14` | Azul muy oscuro (casi negro) | Fondo principal |
| `colors.brand.teal` | `#0E3A43` | Verde azulado oscuro | Acentos |
| `colors.brand.teal2` | `#0B2A31` | Teal mas oscuro | — |
| `colors.brand.copper` | `#B37A2B` | Cobre/dorado | Acentos dorados |
| `colors.brand.copper2` | `#8C5C22` | Cobre mas oscuro | — |
| `backgroundImage.grid-fade` | Radial gradient compuesto | Varias capas radiales + linear | Fondo del layout |
| `backgroundImage.hero-radial` | Radial gradient para hero | 3 capas radiales | Fondo del Hero |
| `borderRadius.2xl` | `1.25rem` | Bordes redondeados grandes | — |

**Donde modificar**:
- Cambiar paleta de colores → `theme.extend.colors.brand`
- Cambiar sombras → `theme.extend.boxShadow`
- Agregar fuentes custom → `theme.extend.fontFamily`
- Agregar breakpoints → `theme.extend.screens`

---

## `app/globals.css` — CSS Global

**Directivas**: `@tailwind base`, `@tailwind components`, `@tailwind utilities`

**Estilos base**:
- `color-scheme: dark` — Fuerza modo oscuro
- `body` con fondo negro (`bg-black`) y texto blanco (`text-white`)
- `html, body` con `height: 100%`

**Efecto film grain** (`.grain::before`):
- Pseudo-elemento `::before` fixed que cubre toda la pantalla
- Usa un SVG inline con `feTurbulence` para generar ruido fractal
- `mix-blend-mode: overlay` con opacidad 25%
- No interfiere con interacciones (`pointer-events: none`)

**Accesibilidad** (`:focus-visible`):
- Outline blanco semitransparente de 2px con offset

**Donde modificar**:
- Quitar film grain → eliminar `.grain::before` (lineas 18-27) y quitar clase `grain` del body
- Cambiar color de fondo → `globals.css:14`
- Cambiar estilos de focus → `globals.css:30-33`

---

## `next.config.mjs` — Configuracion de Next.js

```javascript
{
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: []
  }
}
```

**`reactStrictMode: true`**: Modo estricto de React (doble render en desarrollo).

**`images.formats`**: Next.js optimiza imagenes a AVIF y WebP automaticamente.

**`images.remotePatterns: []`**: Solo permite imagenes locales (en `public/`). Si necesitas cargar imagenes de dominios externos (Cloudinary, Supabase, Instagram), agregalos aqui.

**Donde modificar**:
- Permitir imagenes externas → agregar a `remotePatterns`
- Agregar redirecciones → `async redirects()`
- Agregar headers → `async headers()`

---

## `tsconfig.json` — TypeScript

**Configuracion clave**:

| Opcion | Valor | Significado |
|---|---|---|
| `target` | `ES2022` | JS moderno |
| `strict` | `true` | Todas las verificaciones estrictas |
| `moduleResolution` | `bundler` | Resolucion para bundlers |
| `resolveJsonModule` | `true` | Permite importar `.json` |
| `jsx` | `preserve` | JSX sin transformar (Next lo maneja) |
| `baseUrl` | `.` | Base para path aliases |

**Path aliases**:
```json
{
  "@/*": ["./*"],
  "@/components/*": ["./components/*"],
  "@/lib/*": ["./lib/*"],
  "@/data/*": ["./data/*"]
}
```

**Donde modificar**:
- Agregar nuevo alias → `compilerOptions.paths`
- Relajar strict → `compilerOptions.strict: false` (no recomendado)

---

## `postcss.config.mjs` — PostCSS

Plugins: `tailwindcss` + `autoprefixer`. Configuracion estandar sin personalizaciones.

---

## `.eslintrc.json` — ESLint

Extiende `next/core-web-vitals`. Sin reglas adicionales. Solo corre con `npm run lint`.

---

## `package.json` — Dependencias y scripts

**Scripts**:
| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Servidor de produccion |
| `npm run lint` | ESLint |

**Dependencias runtime** (5): `next`, `react`, `react-dom`, `clsx`, `lucide-react`

**DevDependencies** (7): tipos de Node/React, `tailwindcss`, `postcss`, `autoprefixer`, `eslint`, `eslint-config-next`, `typescript`
