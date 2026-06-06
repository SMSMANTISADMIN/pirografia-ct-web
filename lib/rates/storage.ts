import fs from 'node:fs'
import path from 'node:path'
import type { RateState } from './types'

const VAR_DIR = process.env.VERCEL ? path.join('/tmp', 'var') : path.join(process.cwd(), 'var')
const FILE_PATH = path.join(VAR_DIR, 'rate-state.json')

let mem: RateState | null = null

export function defaultRateState(fallbackRate: number): RateState {
  const now = new Date().toISOString()
  return {
    mode: 'auto',
    lastGoodRate: fallbackRate,
    currentRate: fallbackRate,
    updatedAt: now,
    status: 'stale',
    sources: []
  }
}

export function readRateState(fallbackRate: number): RateState {
  if (mem) return mem
  const mode = process.env.RATE_STORAGE ?? 'file'
  if (mode === 'memory') {
    mem = defaultRateState(fallbackRate)
    return mem
  }
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf8')
    mem = JSON.parse(raw) as RateState
    return mem
  } catch {
    mem = defaultRateState(fallbackRate)
    return mem
  }
}

export function writeRateState(state: RateState) {
  mem = state
  const mode = process.env.RATE_STORAGE ?? 'file'
  if (mode === 'memory') return
  fs.mkdirSync(VAR_DIR, { recursive: true })
  fs.writeFileSync(FILE_PATH, JSON.stringify(state, null, 2), 'utf8')
}
