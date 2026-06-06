# Arquitectura general

## Stack tecnologico

| Capa | Tecnologia | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.12 |
| Runtime | Node.js | `runtime: 'nodejs'` |
| Lenguaje | TypeScript | 5.5.4 (strict) |
| Estilos | Tailwind CSS | 3.4.10 |
| Iconos | Lucide React | 0.452 |
| Utilidades | clsx | 2.1.1 |
| Linting | ESLint | 8.57 (next/core-web-vitals) |
| Build | PostCSS + Autoprefixer | — |
| Datos | JSON plano (sin DB) | — |

## Tipo de aplicacion

Aplicacion **hibrida static/dynamic** de Next.js 14:

- **Server Components (RSC)**: Catalogo, detalle de catalogo, museo, links, footer, header. Leen datos de archivos JSON en el servidor.
- **Client Components**: Calculadora, cargue (upload UI), configurador de pedidos, panel admin, Hero con carrusel. Usan `useState`, `useEffect`.
- **API Routes** (Node.js): `GET /api/rate`, `POST /api/rate/refresh`, `POST /api/rate/manual`. Manejan el sistema de tasa BCV.

## Estructura del repositorio

```
pirografia-ct-portalv2/
├── app/                    # Next.js App Router (paginas + API routes)
│   ├── layout.tsx          # Layout raiz (HTML, HeaderBar, FooterBar)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # CSS global (Tailwind + film grain)
│   ├── admin/page.tsx      # Panel admin de tasa BCV
│   ├── api/rate/           # API de tasa BCV (3 endpoints)
│   ├── calculadora/        # Calculadora de precios
│   ├── cargue/             # UI de upload (placeholder v1)
│   ├── catalogo/           # Listado + [slug] detalle con configurador
│   ├── links/              # Pagina de enlaces
│   └── museo/              # Galeria + [id] detalle de pieza
├── components/             # Componentes React reutilizables
│   ├── HeaderBar.tsx       # Header sticky
│   ├── FooterBar.tsx       # Footer
│   ├── Hero.tsx            # Hero con carrusel (version actual)
│   ├── Hero-v1..v5.tsx     # Iteraciones anteriores (legacy)
│   ├── CatalogCard.tsx     # Card de producto en listado
│   ├── CatalogConfigurator.tsx  # Configurador de pedido interactive
│   ├── MuseoGrid.tsx       # Grid de piezas del museo
│   ├── AdminRatePanel.tsx  # Panel admin de tasa BCV
│   ├── SectionCard.tsx     # Wrapper de card con titulo
│   └── CircleCTA.tsx       # CTA circular (no usado)
├── lib/                    # Logica de negocio y utilidades
│   ├── site-config.ts      # Configuracion central del sitio
│   ├── catalog.ts          # Acceso a datos de catalogo
│   ├── portfolio.ts        # Acceso a datos de portafolio
│   ├── currency.ts         # Formateo y conversion de moneda
│   ├── museo.ts            # Acceso legacy a museo.json (no usado)
│   └── rates/              # Sistema de tasa BCV
│       ├── types.ts        # Tipos RateSourceResult, RateState
│       ├── providers.ts    # Fetch de 3 proveedores configurable
│       ├── consensus.ts    # Algoritmo de consenso multivendor
│       ├── storage.ts      # Persistencia en archivo (var/rate-state.json)
│       ├── getRateServer.ts # Getter server-side para RSC
│       └── useRate.ts      # Hook client-side (fetch a /api/rate)
├── data/                   # Datos en JSON plano
│   ├── catalog.json        # Catalogo de productos (fuente principal)
│   ├── catalogo.ts         # Duplicado hardcodeado (legacy, NO USAR)
│   ├── portfolio.json      # Portafolio/museo (fuente principal)
│   ├── museo.json          # Datos legacy (schema diferente, NO USAR)
│   └── portfolio-v1.json   # V1 legacy (NO USAR)
├── public/                 # Assets estaticos
│   ├── brand/              # Logo en PNG, SVG, WebP
│   └── images/             # Imagenes de catalogo y museo
├── var/                    # Estado en runtime
│   └── rate-state.json     # Cache de tasa BCV (generado, no commiteado)
├── next.config.mjs         # Config de Next.js
├── tailwind.config.ts      # Tema de Tailwind
├── tsconfig.json           # Config de TypeScript
├── postcss.config.mjs      # PostCSS
├── .eslintrc.json          # ESLint
└── package.json            # Dependencias y scripts
```

## Diagrama de arquitectura

```mermaid
graph TB
    subgraph "Frontend - App Router"
        LAYOUT[layout.tsx<br/>Root Layout]
        HOME[page.tsx<br/>Homepage + Hero]
        CATALOGO_LIST[catalogo/page.tsx<br/>Listado RSC]
        CATALOGO_DETAIL[catalogo/[slug]/page.tsx<br/>Detalle + Configurador]
        MUSEO_LIST[museo/page.tsx<br/>Galeria RSC]
        MUSEO_DETAIL[museo/[id]/page.tsx<br/>Detalle pieza]
        CALC[calculadora/page.tsx<br/>Calculator Client]
        CARGUE[cargue/page.tsx<br/>Upload Client]
        LINKS[links/page.tsx<br/>Links RSC]
        ADMIN[admin/page.tsx<br/>Admin Panel]
    end

    subgraph "Componentes compartidos"
        HEADER[HeaderBar]
        FOOTER[FooterBar]
        HERO[Hero - Carrusel]
        CAT_CARD[CatalogCard]
        CAT_CONF[CatalogConfigurador]
        MUSEO_GRID[MuseoGrid]
        ADMIN_PANEL[AdminRatePanel]
        SEC_CARD[SectionCard]
    end

    subgraph "Logica de negocio - lib/"
        SITE_CFG[site-config.ts]
        CATALOG_LIB[catalog.ts]
        PORTFOLIO_LIB[portfolio.ts]
        CURRENCY[currency.ts]
    end

    subgraph "Sistema tasa BCV - lib/rates/"
        PROVIDERS[providers.ts<br/>Fetch 3 fuentes]
        CONSENSUS[consensus.ts<br/>Algoritmo consenso]
        STORAGE[storage.ts<br/>Persistencia JSON]
        API_RATE[/api/rate GET]
        API_REFRESH[/api/rate/refresh POST]
        API_MANUAL[/api/rate/manual POST]
    end

    subgraph "Datos - data/"
        CAT_JSON[catalog.json]
        PORT_JSON[portfolio.json]
        RATE_STATE[var/rate-state.json]
    end

    LAYOUT --> HEADER
    LAYOUT --> FOOTER
    HOME --> HERO
    HOME --> SEC_CARD
    CATALOGO_LIST --> CAT_CARD
    CATALOGO_LIST --> CATALOG_LIB
    CATALOGO_LIST --> STORAGE
    CATALOGO_DETAIL --> CAT_CONF
    CATALOGO_DETAIL --> CATALOG_LIB
    CATALOGO_DETAIL --> STORAGE
    MUSEO_LIST --> MUSEO_GRID
    MUSEO_LIST --> PORTFOLIO_LIB
    MUSEO_DETAIL --> PORTFOLIO_LIB
    ADMIN --> ADMIN_PANEL
    ADMIN_PANEL --> API_RATE
    ADMIN_PANEL --> API_REFRESH
    ADMIN_PANEL --> API_MANUAL
    CAT_CONF --> CURRENCY
    CAT_CONF --> SITE_CFG
    CAT_CONF --> API_RATE
    CATALOG_LIB --> CAT_JSON
    PORTFOLIO_LIB --> PORT_JSON
    API_RATE --> STORAGE
    API_REFRESH --> PROVIDERS
    API_REFRESH --> CONSENSUS
    API_REFRESH --> STORAGE
    API_MANUAL --> STORAGE
    PROVIDERS --> |HTTP| EXT_PROV[Proveedores externos<br/>RATE_A/B/C_URL]
    STORAGE --> RATE_STATE
```

## Ciclo de vida de datos

1. **Build/Startup**: `data/catalog.json` y `data/portfolio.json` se importan directamente en Server Components.
2. **Request**: Las paginas RSC leen los JSON en cada request. Las paginas Client Component hacen fetch a `/api/rate`.
3. **Tasa BCV**: Se refresca via `/admin` (manual o auto). El estado persiste en `var/rate-state.json`.
4. **Precios Bs**: Se calculan en runtime: `precioUSD * tasaBCV`.
