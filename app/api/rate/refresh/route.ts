import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site-config'
import { getProviderConfigs, runProvider } from '@/lib/rates/providers'
import { computeConsensus } from '@/lib/rates/consensus'
import { readRateState, writeRateState } from '@/lib/rates/storage'
import type { RateState } from '@/lib/rates/types'

export const runtime = 'nodejs'

function assertToken(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  const expected = process.env.ADMIN_API_TOKEN
  if (!expected) return true
  return token === expected
}

export async function POST(req: Request) {
  if (!assertToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const prev = readRateState(siteConfig.usdRateBs)
  if (prev.mode === 'manual') return NextResponse.json({ ok: true, skipped: true, state: prev })

  const providerCfgs = getProviderConfigs()
  const sources = await Promise.all(providerCfgs.slice(0, 3).map(runProvider))

  const consensus = computeConsensus(sources, prev.lastGoodRate, {
    deltaPct: Number(process.env.RATE_DELTA_PCT ?? 0.005),
    maxJumpPct: Number(process.env.RATE_MAX_JUMP_PCT ?? 0.05)
  })

  const now = new Date().toISOString()
  let next: RateState = { ...prev, mode: 'auto', updatedAt: now, sources }

  if (consensus.ok) {
    next = {
      ...next,
      currentRate: consensus.rate,
      lastGoodRate: consensus.rate,
      status: consensus.status
    }
    writeRateState(next)
    return NextResponse.json({ ok: true, state: next })
  }

  next = { ...next, currentRate: prev.lastGoodRate, status: 'stale' }
  writeRateState(next)
  return NextResponse.json({ ok: false, reason: consensus.reason, state: next })
}
