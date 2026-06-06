import type { RateSourceResult } from './types'

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function pickPath(obj: any, path: string): unknown {
  return path.split('.').reduce((acc: any, key) => (acc ? acc[key] : undefined), obj)
}

export type ProviderConfig = {
  name: string
  url: string
  ratePath: string
  scale?: number
}

export async function runProvider(cfg: ProviderConfig): Promise<RateSourceResult> {
  const fetchedAt = new Date().toISOString()
  try {
    const raw = await fetchJson(cfg.url)
    const v = pickPath(raw, cfg.ratePath)
    const n = typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v)
    const rate = cfg.scale ? n * cfg.scale : n
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('Tasa inválida')
    return { source: cfg.name, ok: true, rate, fetchedAt, raw }
  } catch (e: any) {
    return { source: cfg.name, ok: false, fetchedAt, error: e?.message ?? 'Error' }
  }
}

export function getProviderConfigs(): ProviderConfig[] {
  const cfgs: ProviderConfig[] = []
  const mk = (prefix: 'A' | 'B' | 'C') => {
    const url = process.env[`RATE_${prefix}_URL`]
    const ratePath = process.env[`RATE_${prefix}_PATH`]
    const name = process.env[`RATE_${prefix}_NAME`] ?? `Provider${prefix}`
    const scale = process.env[`RATE_${prefix}_SCALE`] ? Number(process.env[`RATE_${prefix}_SCALE`]) : undefined
    if (url && ratePath) cfgs.push({ name, url, ratePath, scale })
  }
  mk('A')
  mk('B')
  mk('C')
  return cfgs
}
