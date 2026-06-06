# 04 — Sistema de tasa BCV (`lib/rates/`)

Sistema completo de obtencion, consenso y persistencia de la tasa de cambio USD/Bs (Bolivar venezolano). Es el unico subsistema con estado mutable en runtime.

---

## Arquitectura del sistema

```mermaid
flowchart TD
    subgraph "Fuentes externas"
        PA[Proveedor A<br/>RATE_A_URL + RATE_A_PATH]
        PB[Proveedor B<br/>RATE_B_URL + RATE_B_PATH]
        PC[Proveedor C<br/>RATE_C_URL + RATE_C_PATH]
    end

    subgraph "providers.ts"
        FETCH[runProvider<br/>HTTP GET + JSON parse]
    end

    subgraph "consensus.ts"
        CONSENSUS[computeConsensus<br/>- Al menos 2/3 fuentes<br/>- Dentro de deltaPct<br/>- Anti-salto vs lastGoodRate]
    end

    subgraph "storage.ts"
        STORE[readRateState / writeRateState<br/>var/rate-state.json o memoria]
    end

    subgraph "API Routes"
        GET_RATE[GET /api/rate]
        REFRESH[POST /api/rate/refresh]
        MANUAL[POST /api/rate/manual]
    end

    subgraph "Consumidores"
        RSC[Server Components<br/>getFxRateServer()]
        CLIENT[Client Components<br/>useRate() hook]
        ADMIN[AdminRatePanel]
    end

    PA --> FETCH
    PB --> FETCH
    PC --> FETCH
    FETCH --> CONSENSUS
    CONSENSUS --> STORE
    STORE --> GET_RATE
    REFRESH --> FETCH
    MANUAL --> STORE
    GET_RATE --> RSC
    GET_RATE --> CLIENT
    GET_RATE --> ADMIN
    REFRESH --> ADMIN
    MANUAL --> ADMIN
```

---

## `types.ts` — Tipos del sistema

```typescript
RateSourceResult = {
  source: string        // Nombre del proveedor
  ok: boolean           // Fetch exitoso?
  rate?: number         // Tasa obtenida
  fetchedAt: string     // ISO timestamp
  raw?: unknown         // Respuesta cruda
  error?: string        // Mensaje de error si fallo
}

RateState = {
  mode: 'auto' | 'manual'
  manualRate?: number   // Solo en modo manual
  lastGoodRate: number  // Ultima tasa valida (ancla anti-salto)
  currentRate: number   // Tasa activa
  updatedAt: string     // ISO timestamp
  status: 'ok-3of3' | 'ok-2of3' | 'stale' | 'manual'
  sources: RateSourceResult[]
}
```

**Estados posibles**:
- `ok-3of3`: Las 3 fuentes concordaron
- `ok-2of3`: 2 de 3 fuentes concordaron
- `stale`: No hubo consenso, se mantiene `lastGoodRate`
- `manual`: Override manual activo

---

## `providers.ts` — Fetch de proveedores

### Configuracion via variables de entorno

Para cada proveedor (A, B, C) se configuran 4 variables:

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `RATE_A_URL` | URL del endpoint JSON | `https://api.proveedor.com/rate` |
| `RATE_A_PATH` | Ruta dot-notation al valor en el JSON | `data.rate` o `usd.rate` |
| `RATE_A_NAME` | Nombre visible (opcional) | `BCV` |
| `RATE_A_SCALE` | Factor de escala (opcional) | `1` o `0.001` |

**Ejemplo**: Si `RATE_A_URL=https://api.com/v1`, `RATE_A_PATH=rates.USD.VES`, y el JSON de respuesta es:
```json
{ "rates": { "USD": { "VES": 35.7 } } }
```
Entonces se extrae `35.7`. Si `RATE_A_SCALE=10`, el resultado seria `357`.

### `runProvider(cfg: ProviderConfig): Promise<RateSourceResult>`

1. Hace `fetch(url, { cache: 'no-store' })`
2. Extrae el valor usando `pickPath(raw, ratePath)` (dot-notation)
3. Aplica `scale` si esta configurado
4. Valida que sea numero finito positivo
5. Retorna `{ ok: true, rate, ... }` o `{ ok: false, error }`

### `getProviderConfigs(): ProviderConfig[]`

Lee las variables de entorno y construye la lista de proveedores configurados. Solo incluye proveedores que tengan `URL` y `PATH` definidos.

**Donde modificar**:
- Cambiar logica de extraccion del JSON → `providers.ts:20-31`
- Agregar soporte para headers/auth → `providers.ts:3-7`
- Agregar timeout → `providers.ts:4`

---

## `consensus.ts` — Algoritmo de consenso

### `computeConsensus(sources, lastGoodRate, opts)`

Algoritmo de consenso multivendor con tolerancia y proteccion anti-salto.

**Parametros**:
- `opts.deltaPct`: Tolerancia maxima entre fuentes (default `0.005` = 0.5%)
- `opts.maxJumpPct`: Maximo cambio permitido vs `lastGoodRate` (default `0.05` = 5%)

**Algoritmo**:
1. Filtra fuentes validas (`ok === true` y `rate > 0`)
2. Si hay menos de 2 fuentes → falla (`reason: 'Menos de 2 fuentes validas'`)
3. Si hay 3 fuentes y las 3 estan dentro de `deltaPct` entre si:
   - Calcula la mediana de las 3
   - Verifica anti-salto vs `lastGoodRate`
   - Si el salto es muy grande → falla
   - Si pasa → retorna `{ ok: true, status: 'ok-3of3' }`
4. Si no, busca cualquier par de fuentes dentro de `deltaPct`:
   - Calcula la mediana del par
   - Verifica anti-salto
   - Si pasa → retorna `{ ok: true, status: 'ok-2of3' }`
5. Si ningun par concuerda → falla (`reason: 'No hubo consenso (2/3)'`)

**Funciones auxiliares**:
- `median(values)`: Mediana de un array (sorted, middle element)
- `within(a, b, deltaPct)`: Verifica si dos valores estan dentro del % de tolerancia

**Donde modificar**:
- Cambiar algoritmo de consenso → `consensus.ts:20-58`
- Cambiar a promedio en vez de mediana → `consensus.ts:8-11`
- Agregar mas de 3 fuentes → `consensus.ts:32-42`

---

## `storage.ts` — Persistencia del estado

### `readRateState(fallbackRate: number): RateState`

1. Si hay estado en memoria (`mem`) → lo retorna (cache)
2. Si `RATE_STORAGE=memory` → crea estado default en memoria
3. Si `RATE_STORAGE=file` (default) → lee `var/rate-state.json`
4. Si el archivo no existe o hay error → crea estado default

### `writeRateState(state: RateState)`

1. Actualiza cache en memoria
2. Si `RATE_STORAGE=memory` → no escribe a disco
3. Si `RATE_STORAGE=file` → crea directorio `var/` si no existe, escribe JSON

### `defaultRateState(fallbackRate): RateState`

Estado inicial con `mode: 'auto'`, `status: 'stale'`, usando `fallbackRate` de `siteConfig.usdRateBs` (357).

**Archivo de estado**: `var/rate-state.json` (NO se commitea, esta en `.gitignore` via `var/`)

**Donde modificar**:
- Cambiar ubicacion del archivo → `storage.ts:6`
- Cambiar formato de persistencia (DB, Redis) → `storage.ts:39-44`

---

## `getRateServer.ts` — Getter para Server Components

```typescript
getFxRateServer(): { rate: number; status: string; updatedAt: string }
```

Wrapper simple que lee `readRateState()` y expone solo los campos necesarios para RSC. Lo usan `app/catalogo/page.tsx` y `app/catalogo/[slug]/page.tsx`.

---

## `useRate.ts` — Hook para Client Components

```typescript
useRate(): { rate: number | null; meta: { status?: string; updatedAt?: string } | null }
```

Hook React que:
1. Al montar, hace `fetch('/api/rate')` con `cache: 'no-store'`
2. Almacena `rate` y `meta` en estado local
3. Maneja limpieza (cleanup con flag `alive`)

**Usado por**: `CatalogConfigurator` (para mostrar precios en Bs actualizados).

---

## Variables de entorno relevantes

| Variable | Default | Descripcion |
|---|---|---|
| `RATE_A_URL` | — | URL del proveedor A |
| `RATE_A_PATH` | — | Path dot-notation al valor |
| `RATE_A_NAME` | `ProviderA` | Nombre visible |
| `RATE_A_SCALE` | — | Factor de escala |
| `RATE_B_URL` | — | URL del proveedor B |
| `RATE_B_PATH` | — | Path dot-notation |
| `RATE_B_NAME` | `ProviderB` | Nombre visible |
| `RATE_B_SCALE` | — | Factor de escala |
| `RATE_C_URL` | — | URL del proveedor C |
| `RATE_C_PATH` | — | Path dot-notation |
| `RATE_C_NAME` | `ProviderC` | Nombre visible |
| `RATE_C_SCALE` | — | Factor de escala |
| `RATE_DELTA_PCT` | `0.005` (0.5%) | Tolerancia entre fuentes |
| `RATE_MAX_JUMP_PCT` | `0.05` (5%) | Maximo salto vs lastGoodRate |
| `RATE_STORAGE` | `file` | `file` o `memory` |
| `ADMIN_API_TOKEN` | — | Token para proteger endpoints |
