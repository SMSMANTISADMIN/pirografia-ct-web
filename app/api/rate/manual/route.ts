import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site-config'
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

  const body = (await req.json().catch(() => null)) as { mode?: 'auto' | 'manual'; manualRate?: number } | null
  const prev = readRateState(siteConfig.usdRateBs)
  const now = new Date().toISOString()

  const mode = body?.mode ?? prev.mode
  const manualRate = body?.manualRate

  let next: RateState = { ...prev, updatedAt: now }
  if (mode === 'manual') {
    const r = Number(manualRate)
    if (!Number.isFinite(r) || r <= 0) return NextResponse.json({ error: 'manualRate inválida' }, { status: 400 })
    next = { ...next, mode: 'manual', manualRate: r, currentRate: r, lastGoodRate: r, status: 'manual' }
  } else {
    next = { ...next, mode: 'auto', manualRate: undefined, currentRate: prev.lastGoodRate, status: 'stale' }
  }

  writeRateState(next)
  return NextResponse.json({ ok: true, state: next })
}
