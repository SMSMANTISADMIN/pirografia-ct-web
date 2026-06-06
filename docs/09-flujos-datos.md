# 09 — Flujos de datos

Diagramas de los flujos principales de datos en la aplicacion.

---

## Flujo 1: Visualizacion de precios (USD → Bs)

```mermaid
sequenceDiagram
    participant JSON as data/catalog.json
    participant LIB as lib/catalog.ts
    participant RSC as Server Component<br/>(catalogo/page.tsx)
    participant STORAGE as lib/rates/storage.ts
    participant BROWSER as Navegador

    JSON->>LIB: getCatalog()
    STORAGE->>RSC: getFxRateServer() → { rate: 357, status: 'ok-3of3' }
    LIB->>RSC: CatalogItem[] con basePriceUsd
    RSC->>RSC: Calcula precio Bs = basePriceUsd * rate
    RSC->>BROWSER: HTML con precios USD + Bs
```

**Archivos involucrados**:
- `data/catalog.json` — precios base en USD
- `lib/catalog.ts` — `getCatalog()`, `getPricingTable()`
- `lib/rates/storage.ts` — `readRateState()`
- `lib/rates/getRateServer.ts` — `getFxRateServer()`
- `app/catalogo/page.tsx` — renderiza precios
- `components/CatalogCard.tsx` — muestra precio USD + Bs

---

## Flujo 2: Consenso de tasa BCV (refresh automatico)

```mermaid
sequenceDiagram
    participant ADMIN as Admin (navegador)
    participant API as POST /api/rate/refresh
    participant PROV as providers.ts
    participant EXT_A as RATE_A_URL
    participant EXT_B as RATE_B_URL
    participant EXT_C as RATE_C_URL
    participant CONS as consensus.ts
    participant STORE as storage.ts
    participant DISK as var/rate-state.json

    ADMIN->>API: POST /api/rate/refresh?token=xxx
    API->>API: assertToken()
    API->>STORE: readRateState() → estado actual
    alt Modo manual
        API-->>ADMIN: { skipped: true }
    else Modo auto
        API->>PROV: Promise.all([runProvider(A), runProvider(B), runProvider(C)])
        PROV->>EXT_A: fetch(RATE_A_URL)
        PROV->>EXT_B: fetch(RATE_B_URL)
        PROV->>EXT_C: fetch(RATE_C_URL)
        EXT_A-->>PROV: JSON → extract via RATE_A_PATH
        EXT_B-->>PROV: JSON → extract via RATE_B_PATH
        EXT_C-->>PROV: JSON → extract via RATE_C_PATH
        PROV-->>API: [RateSourceResult, RateSourceResult, RateSourceResult]
        API->>CONS: computeConsensus(sources, lastGoodRate, { deltaPct, maxJumpPct })
        alt Consenso OK (2/3 o 3/3)
            CONS-->>API: { ok: true, rate, status }
            API->>STORE: writeRateState({ currentRate: rate, status: 'ok-3of3', ... })
            STORE->>DISK: Guarda JSON
            API-->>ADMIN: { ok: true, state }
        else Sin consenso
            CONS-->>API: { ok: false, reason }
            API->>STORE: writeRateState({ status: 'stale', currentRate: lastGoodRate })
            API-->>ADMIN: { ok: false, reason, state }
        end
    end
```

**Archivos involucrados**:
- `app/api/rate/refresh/route.ts` — endpoint
- `lib/rates/providers.ts` — `runProvider()`, `getProviderConfigs()`
- `lib/rates/consensus.ts` — `computeConsensus()`
- `lib/rates/storage.ts` — `readRateState()`, `writeRateState()`

---

## Flujo 3: Configurador de pedido → WhatsApp

```mermaid
sequenceDiagram
    participant USER as Usuario
    participant UI as CatalogConfigurator<br/>(Client Component)
    participant HOOK as useRate()
    participant API as GET /api/rate
    participant CALC as Calculo local<br/>(useMemo)
    participant WA as WhatsApp

    USER->>UI: Selecciona opciones (colores, envoltura, texto, piezas)
    UI->>HOOK: useRate()
    HOOK->>API: fetch('/api/rate')
    API-->>HOOK: { rate: 357, status: 'ok-3of3' }
    HOOK-->>UI: { rate: 357, meta: {...} }
    UI->>CALC: basePriceUsd + addons + additionalPieces
    CALC-->>UI: { baseUsd, addonsUsd, totalUsd }
    UI->>UI: Formatea total en USD y Bs
    UI->>UI: Genera mensaje WhatsApp (waMsg)
    USER->>UI: Click "Enviar por WhatsApp"
    UI->>WA: Abre wa.me/<numero>?text=<mensaje>
```

**Mensaje generado** (`CatalogConfigurator.tsx:47-64`):
```
🧾 Pedido — Categoria 4
• Base: 31$ (11.067Bs)
• Colores: 2 colores
• Envoltura: Si
• Texto: Si
• Piezas adicionales: 0
• Nota: Urgente para el viernes
—
TOTAL: 40$ (14.280Bs)
Tasa BCV: 357,00 Bs/$ (ok-3of3)
```

**Archivos involucrados**:
- `components/CatalogConfigurator.tsx` — UI y logica
- `lib/rates/useRate.ts` — hook de tasa
- `app/api/rate/route.ts` — endpoint de tasa
- `lib/currency.ts` — `formatUsd()`, `formatBsFromUsd()`
- `lib/site-config.ts` — `whatsappHref()`

---

## Flujo 4: Visualizacion del portafolio/museo

```mermaid
sequenceDiagram
    participant JSON as data/portfolio.json
    participant LIB as lib/portfolio.ts
    participant PAGE as museo/page.tsx<br/>(Server Component)
    participant BROWSER as Navegador
    participant USER as Usuario

    JSON->>LIB: getPortfolio() → PortfolioItem[]
    LIB->>PAGE: items, tags unicos
    PAGE->>PAGE: Filtra por ?tag= (si existe)
    PAGE->>PAGE: Pagina (24 items por pagina)
    PAGE->>PAGE: Renderiza MuseoGrid + paginacion
    PAGE->>BROWSER: HTML con grid de imagenes
    USER->>BROWSER: Click en tag → recarga con ?tag=xxx
    USER->>BROWSER: Click en pagina → recarga con ?page=N
    USER->>BROWSER: Click en pieza → navega a /museo/[id]
```

**Archivos involucrados**:
- `data/portfolio.json` — datos
- `lib/portfolio.ts` — `getPortfolio()`, `getPortfolioTags()`
- `app/museo/page.tsx` — listado con filtros y paginacion
- `app/museo/[id]/page.tsx` — detalle de pieza
- `components/MuseoGrid.tsx` — grid de cards

---

## Flujo 5: Override manual de tasa BCV

```mermaid
sequenceDiagram
    participant ADMIN as Admin (navegador)
    participant UI as AdminRatePanel
    participant API as POST /api/rate/manual
    participant STORE as storage.ts
    participant DISK as var/rate-state.json

    ADMIN->>UI: Ingresa tasa manual (ej: 400)
    ADMIN->>UI: Click "Activar MANUAL"
    UI->>API: POST { mode: 'manual', manualRate: 400 }
    API->>API: assertToken()
    API->>STORE: readRateState() → prev
    API->>API: Valida manualRate (Number.isFinite, >0)
    API->>STORE: writeRateState({ mode: 'manual', currentRate: 400, status: 'manual' })
    STORE->>DISK: Guarda JSON
    API-->>UI: { ok: true, state }
    UI->>UI: Actualiza display

    Note over ADMIN,DISK: Para volver a modo auto:

    ADMIN->>UI: Click "Volver a AUTO"
    UI->>API: POST { mode: 'auto' }
    API->>STORE: writeRateState({ mode: 'auto', currentRate: lastGoodRate, status: 'stale' })
    STORE->>DISK: Guarda JSON
    API-->>UI: { ok: true, state }
```

**Archivos involucrados**:
- `components/AdminRatePanel.tsx` — UI del panel
- `app/api/rate/manual/route.ts` — endpoint
- `lib/rates/storage.ts` — persistencia
