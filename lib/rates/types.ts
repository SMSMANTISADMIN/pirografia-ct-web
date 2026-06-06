export type RateSourceResult = {
  source: string
  ok: boolean
  rate?: number
  fetchedAt: string
  raw?: unknown
  error?: string
}

export type RateState = {
  mode: 'auto' | 'manual'
  manualRate?: number
  lastGoodRate: number
  currentRate: number
  updatedAt: string
  status: 'ok-3of3' | 'ok-2of3' | 'stale' | 'manual'
  sources: RateSourceResult[]
}
