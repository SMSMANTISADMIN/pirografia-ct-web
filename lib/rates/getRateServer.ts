import { siteConfig } from '@/lib/site-config'
import { readRateState, writeRateState } from './storage'
import { getProviderConfigs, runProvider } from './providers'
import { computeConsensus } from './consensus'

export let refreshPromise: Promise<void> | null = null

export async function refreshIfStale() {
  const state = readRateState(siteConfig.usdRateBs)
  if (state.status !== 'stale' || state.mode === 'manual') return

  if (refreshPromise) {
    await refreshPromise
    return
  }

  refreshPromise = (async () => {
    try {
      const cfgs = getProviderConfigs()
      if (!cfgs.length) return
      const sources = await Promise.all(cfgs.slice(0, 3).map(runProvider))
      const isFirstRefresh = state.sources.length === 0
      const maxJumpPct = isFirstRefresh ? 999 : Number(process.env.RATE_MAX_JUMP_PCT ?? 0.05)
      const consensus = computeConsensus(sources, state.lastGoodRate, {
        deltaPct: Number(process.env.RATE_DELTA_PCT ?? 0.005),
        maxJumpPct
      })
      const now = new Date().toISOString()
      if (consensus.ok) {
        writeRateState({
          ...state,
          currentRate: consensus.rate,
          lastGoodRate: consensus.rate,
          status: consensus.status,
          updatedAt: now,
          sources
        })
      }
    } catch { /* silent fail */ }
  })()

  await refreshPromise
}

export async function getFxRateServer() {
  await refreshIfStale()
  const state = readRateState(siteConfig.usdRateBs)
  return { rate: state.currentRate, status: state.status, updatedAt: state.updatedAt }
}
