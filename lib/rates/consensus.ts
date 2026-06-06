import type { RateSourceResult } from './types'

export type ConsensusOptions = {
  deltaPct: number // 0.005 = 0.5%
  maxJumpPct: number // anti-salto (vs lastGood)
}

function median(values: number[]) {
  const arr = [...values].sort((a, b) => a - b)
  const mid = Math.floor(arr.length / 2)
  return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid]
}

function within(a: number, b: number, deltaPct: number) {
  const d = Math.abs(a - b)
  const ref = Math.max(1e-9, (Math.abs(a) + Math.abs(b)) / 2)
  return d / ref <= deltaPct
}

export function computeConsensus(
  sources: RateSourceResult[],
  lastGoodRate: number,
  opts: ConsensusOptions
):
  | { ok: true; rate: number; status: 'ok-3of3' | 'ok-2of3'; used: RateSourceResult[] }
  | { ok: false; reason: string } {
  const good = sources.filter((s) => s.ok && typeof s.rate === 'number' && (s.rate as number) > 0)
  if (good.length < 2) return { ok: false, reason: 'Menos de 2 fuentes válidas.' }

  const rates = good.map((g) => g.rate as number)

  if (good.length >= 3) {
    const [a, b, c] = rates
    const all = within(a, b, opts.deltaPct) && within(a, c, opts.deltaPct) && within(b, c, opts.deltaPct)
    if (all) {
      const r = median([a, b, c])
      if (Math.abs(r - lastGoodRate) / Math.max(lastGoodRate, 1e-9) > opts.maxJumpPct) {
        return { ok: false, reason: 'Anti-salto: cambio demasiado grande vs última tasa válida.' }
      }
      return { ok: true, rate: r, status: 'ok-3of3', used: good.slice(0, 3) }
    }
  }

  for (let i = 0; i < good.length; i++) {
    for (let j = i + 1; j < good.length; j++) {
      const ri = good[i].rate as number
      const rj = good[j].rate as number
      if (within(ri, rj, opts.deltaPct)) {
        const r = median([ri, rj])
        if (Math.abs(r - lastGoodRate) / Math.max(lastGoodRate, 1e-9) > opts.maxJumpPct) {
          return { ok: false, reason: 'Anti-salto: cambio demasiado grande vs última tasa válida.' }
        }
        return { ok: true, rate: r, status: 'ok-2of3', used: [good[i], good[j]] }
      }
    }
  }

  return { ok: false, reason: 'No hubo consenso (2/3) dentro de tolerancia.' }
}
