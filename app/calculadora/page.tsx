'use client'

import { useMemo, useState } from 'react'
import SectionCard from '@/components/SectionCard'
import { siteConfig } from '@/lib/site-config'
import { useRate } from '@/lib/rates/useRate'

type Moneda = 'Bs' | 'USD'

export default function CalculadoraPage() {
  const [w, setW] = useState(30)
  const [h, setH] = useState(40)
  const [complexity, setComplexity] = useState(3)
  const [rate, setRate] = useState(18)
  const [material, setMaterial] = useState(8)
  const [marginPct, setMarginPct] = useState(25)
  const [moneda, setMoneda] = useState<Moneda>('Bs')
  const { rate: fxRate } = useRate()
  const fx = fxRate ?? siteConfig.usdRateBs

  const result = useMemo(() => {
    const area = (w * h) / 100
    const baseHours = 1.2 + area * 0.18
    const hours = Math.max(1, baseHours * (0.7 + complexity * 0.25))
    const labor = hours * rate
    const subtotal = labor + material
    const total = subtotal * (1 + marginPct / 100)
    const totalBs = moneda === 'Bs' ? Math.round(total * fx) : total
    return {
      area: Number(area.toFixed(2)),
      hours: Number(hours.toFixed(1)),
      labor: Number(labor.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      total: Number(total.toFixed(2)),
      totalBs
    }
  }, [w, h, complexity, rate, material, marginPct, fx, moneda])

  const currencySymbol = moneda === 'Bs' ? 'Bs' : '$'
  const displayTotal = moneda === 'Bs' ? result.totalBs.toLocaleString('es-VE') : result.total.toFixed(0)
  const displayLabor = moneda === 'Bs' ? Math.round(result.labor * fx).toLocaleString('es-VE') : result.labor.toFixed(2)
  const displaySubtotal = moneda === 'Bs' ? Math.round(result.subtotal * fx).toLocaleString('es-VE') : result.subtotal.toFixed(2)

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calculadora</h1>
        <p className="mt-1 text-sm text-white/65">Estimá el costo de tu pieza personalizada en segundos.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Inputs">
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-white/70">Moneda</label>
              <div className="mt-1 flex gap-2">
                {(['Bs', 'USD'] as Moneda[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMoneda(m)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      moneda === m ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {m === 'Bs' ? 'Bs (Bolívares)' : 'USD (Dólares)'}
                  </button>
                ))}
              </div>
              {moneda === 'Bs' && (
                <div className="mt-1 text-xs text-white/45">Tasa BCV: 1$ ≈ {Math.round(fx)} Bs</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-white/70">Ancho (cm)</label>
                <input type="number" value={w} onChange={(e) => setW(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm text-white/70">Alto (cm)</label>
                <input type="number" value={h} onChange={(e) => setH(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70">Complejidad (1–5)</label>
              <input type="range" min={1} max={5} value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="mt-2 w-full" />
              <div className="mt-1 text-xs text-white/55">{complexity}</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-white/70">{currencySymbol}/hora</label>
                <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm text-white/70">Material ({currencySymbol})</label>
                <input type="number" value={material} onChange={(e) => setMaterial(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm text-white/70">Margen %</label>
                <input type="number" value={marginPct} onChange={(e) => setMarginPct(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Resultado">
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between"><span className="text-white/55">Área aprox</span><span>{result.area} dm²</span></div>
            <div className="flex justify-between"><span className="text-white/55">Horas estimadas</span><span>{result.hours} h</span></div>
            <div className="flex justify-between"><span className="text-white/55">Mano de obra</span><span>{currencySymbol} {displayLabor}</span></div>
            <div className="flex justify-between"><span className="text-white/55">Subtotal</span><span>{currencySymbol} {displaySubtotal}</span></div>
            <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/55">Precio sugerido</div>
              <div className="mt-1 text-2xl font-semibold">{currencySymbol} {displayTotal}</div>
            </div>
            <div className="text-xs text-white/50">¿Necesitás algo más personalizado? Escribinos y te armamos un presupuesto a medida.</div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
