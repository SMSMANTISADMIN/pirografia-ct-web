import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site-config'
import { readRateState } from '@/lib/rates/storage'
import { refreshIfStale } from '@/lib/rates/getRateServer'

export const runtime = 'nodejs'

export async function GET() {
  await refreshIfStale()
  const state = readRateState(siteConfig.usdRateBs)
  return NextResponse.json({
    rate: state.currentRate,
    mode: state.mode,
    status: state.status,
    updatedAt: state.updatedAt,
    sources: state.sources.map((s) => ({
      source: s.source,
      ok: s.ok,
      rate: s.rate,
      fetchedAt: s.fetchedAt,
      error: s.error
    }))
  })
}
