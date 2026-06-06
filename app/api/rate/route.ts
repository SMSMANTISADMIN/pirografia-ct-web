import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site-config'
import { readRateState } from '@/lib/rates/storage'

export const runtime = 'nodejs'

export async function GET() {
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
