import { siteConfig } from '@/lib/site-config'
import { readRateState } from './storage'

export function getFxRateServer() {
  const state = readRateState(siteConfig.usdRateBs)
  return { rate: state.currentRate, status: state.status, updatedAt: state.updatedAt }
}
