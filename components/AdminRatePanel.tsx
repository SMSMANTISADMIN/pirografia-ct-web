'use client'

import { useEffect, useMemo, useState } from 'react'

type ApiState = {
  rate: number
  mode: 'auto' | 'manual'
  status: string
  updatedAt: string
  sources: { source: string; ok: boolean; rate?: number; fetchedAt: string; error?: string }[]
}

export function AdminRatePanel() {
  const [token, setToken] = useState('')
  const [state, setState] = useState<ApiState | null>(null)
  const [manualRate, setManualRate] = useState('')
  const tokenQs = useMemo(() => (token ? `?token=${encodeURIComponent(token)}` : ''), [token])

  async function load() {
    const res = await fetch('/api/rate', { cache: 'no-store' })
    const json = (await res.json()) as ApiState
    setState(json)
    setManualRate(String(Math.round(json.rate)))
  }

  useEffect(() => {
    load()
  }, [])

  async function refreshAuto() {
    await fetch(`/api/rate/refresh${tokenQs}`, { method: 'POST' })
    await load()
  }

  async function setMode(mode: 'manual' | 'auto') {
    const payload = mode === 'manual' ? { mode: 'manual', manualRate: Number(manualRate) } : { mode: 'auto' }
    await fetch(`/api/rate/manual${tokenQs}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    await load()
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-white/60">ADMIN_API_TOKEN (opcional)</div>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="token"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/35"
          />
        </label>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-white/60">Estado</div>
          <div className="mt-1 text-sm font-semibold">{state ? `${state.mode.toUpperCase()} — ${state.status}` : '…'}</div>
          <div className="text-xs text-white/55">{state ? `Actualizada: ${new Date(state.updatedAt).toLocaleString()}` : ''}</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-white/60">Tasa actual (Bs por $)</div>
            <div className="mt-1 text-2xl font-semibold">{state ? Math.round(state.rate).toLocaleString('es-VE') : '…'}</div>
          </div>
          <button
            type="button"
            onClick={load}
            className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
          >
            Recargar
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={refreshAuto}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:opacity-90"
          >
            Refrescar AUTO
          </button>

          <label className="rounded-2xl border border-white/10 bg-black/20 p-3 md:col-span-2">
            <div className="text-xs text-white/60">Manual rate (Bs/$)</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                value={manualRate}
                onChange={(e) => setManualRate(e.target.value)}
                className="min-w-[140px] flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="whitespace-nowrap rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
              >
                Activar MANUAL
              </button>
              <button
                type="button"
                onClick={() => setMode('auto')}
                className="whitespace-nowrap rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
              >
                Volver a AUTO
              </button>
            </div>
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-sm font-semibold">Fuentes</div>
        <div className="mt-3 space-y-2 text-xs text-white/70">
          {(state?.sources ?? []).length === 0 ? (
            <div className="text-white/50">No hay proveedores configurados (RATE_A/B/C_URL + RATE_A/B/C_PATH).</div>
          ) : (
            (state?.sources ?? []).map((s) => (
              <div
                key={s.source}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2"
              >
                <div>
                  <div className="font-semibold">{s.source}</div>
                  <div className="text-white/45">{new Date(s.fetchedAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className={s.ok ? 'text-white' : 'text-red-200'}>
                    {s.ok ? Math.round(s.rate ?? 0).toLocaleString('es-VE') : 'ERROR'}
                  </div>
                  {!s.ok && <div className="text-white/45">{s.error}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
