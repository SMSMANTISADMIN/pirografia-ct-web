'use client'

import { useMemo, useState } from 'react'
import { getPricingTable, type CatalogItem } from '@/lib/catalog'
import { formatBsFromUsd, formatUsd } from '@/lib/currency'
import { whatsappHref } from '@/lib/site-config'

type Props = {
  item: CatalogItem
  fxRate: number
  fxStatus: 'ok-3of3' | 'ok-2of3' | 'stale' | 'manual'
  fxUpdatedAt: string
}

type ColorOpt = 'none' | '2' | '4'

export function CatalogConfigurator({ item, fxRate, fxStatus, fxUpdatedAt }: Props) {
  const pricingTable = getPricingTable()
  const isCategory = item.type === 'categoria'
  const allowsText = item.type !== 'llavero'
  const catNum = isCategory ? Number(item.slug.replace('categoria-', '')) : null
  const row = isCategory && catNum ? pricingTable.categories[String(catNum)] : undefined

  const [colorOpt, setColorOpt] = useState<ColorOpt>('none')
  const [envoltura, setEnvoltura] = useState(false)
  const [texto, setTexto] = useState(false)
  const [additionalPieces, setAdditionalPieces] = useState(0)
  const [note, setNote] = useState('')

  const calc = useMemo(() => {
    const baseUsd = item.basePriceUsd
    const textAddonUsd = allowsText && texto ? row?.texto ?? 0 : 0
    let addonsUsd = 0

    if (isCategory && row) {
      if (colorOpt === '2') addonsUsd += row.color2
      if (colorOpt === '4') addonsUsd += row.color4
      if (envoltura) addonsUsd += row.envoltura
      addonsUsd += textAddonUsd
    }

    addonsUsd += additionalPieces * pricingTable.additionalPieceUsd
    const totalUsd = baseUsd + addonsUsd

    return { baseUsd, addonsUsd, textAddonUsd, totalUsd }
  }, [
    additionalPieces,
    allowsText,
    colorOpt,
    envoltura,
    isCategory,
    item.basePriceUsd,
    pricingTable.additionalPieceUsd,
    row,
    texto,
  ])

  const waMsg = useMemo(() => {
    const lines = [
      `🔥 Nuevo pedido — ${item.title}`,
      `• Base: ${formatUsd(calc.baseUsd)} (${formatBsFromUsd(calc.baseUsd, fxRate)})`,
      isCategory
        ? `• Colores: ${colorOpt === 'none' ? 'Sin color' : colorOpt === '2' ? '2 colores' : '4 colores'}`
        : null,
      isCategory ? `• Envoltura: ${envoltura ? 'Sí' : 'No'}` : null,
      allowsText ? `• Texto: ${texto ? `Sí (+${formatUsd(calc.textAddonUsd)})` : 'No'}` : null,
      `• Piezas adicionales: ${additionalPieces}`,
      note.trim() ? `• Nota: ${note.trim()}` : null,
      `—`,
      `TOTAL: ${formatUsd(calc.totalUsd)} (${formatBsFromUsd(calc.totalUsd, fxRate)})`,
      `Tasa BCV: ${Number(fxRate).toFixed(2).replace('.', ',')} Bs/$ (${fxStatus})`,
    ].filter(Boolean)

    return lines.join('\n')
  }, [
    additionalPieces,
    allowsText,
    calc.baseUsd,
    calc.textAddonUsd,
    calc.totalUsd,
    colorOpt,
    envoltura,
    fxRate,
    fxStatus,
    isCategory,
    item.title,
    note,
    texto,
  ])

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold">Configurar pedido</h3>
          <p className="mt-1 text-xs text-white/60">
            Selecciona opciones y envia el pedido por WhatsApp con el resumen listo.
          </p>
        </div>

        {allowsText ? (
          isCategory ? (
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs text-white/60">Colores</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['none', '2', '4'] as ColorOpt[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setColorOpt(opt)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/10 ${
                        colorOpt === opt ? 'bg-white/20' : 'bg-white/5'
                      }`}
                      type="button"
                    >
                      {opt === 'none' ? 'Sin' : `${opt} colores`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs text-white/60">Envoltura</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEnvoltura(false)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/10 ${
                      !envoltura ? 'bg-white/20' : 'bg-white/5'
                    }`}
                  >
                    Sin
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnvoltura(true)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/10 ${
                      envoltura ? 'bg-white/20' : 'bg-white/5'
                    }`}
                  >
                    Con envoltura
                  </button>
                </div>
              </div>

              <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs text-white/60">Texto</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTexto(false)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/10 ${
                      !texto ? 'bg-white/20' : 'bg-white/5'
                    }`}
                  >
                    Sin texto
                  </button>
                  <button
                    type="button"
                    onClick={() => setTexto(true)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/10 ${
                      texto ? 'bg-white/20' : 'bg-white/5'
                    }`}
                  >
                    Con texto
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-white/60">Letras / Texto</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTexto(false)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/10 ${
                    !texto ? 'bg-white/20' : 'bg-white/5'
                  }`}
                >
                  Sin letras
                </button>
                <button
                  type="button"
                  onClick={() => setTexto(true)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/10 ${
                    texto ? 'bg-white/20' : 'bg-white/5'
                  }`}
                >
                  Con letras
                </button>
              </div>
            </div>
          )
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <label className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs text-white/60">Piezas adicionales</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdditionalPieces((v) => Math.max(0, v - 1))}
                className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10"
              >
                -
              </button>
              <input
                type="number"
                min={0}
                value={additionalPieces}
                onChange={(e) => setAdditionalPieces(Math.max(0, Number(e.target.value || 0)))}
                className="w-20 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setAdditionalPieces((v) => v + 1)}
                className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10"
              >
                +
              </button>
              <span className="text-xs text-white/60">(+{formatUsd(pricingTable.additionalPieceUsd)} c/u)</span>
            </div>
          </label>

          <label className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs text-white/60">Nota</div>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: nombre, idea, referencia, urgencia..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/35"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/60">TOTAL</div>
              <div className="mt-1 text-xl font-semibold">{formatUsd(calc.totalUsd)}</div>
              <div className="text-xs text-white/55">{formatBsFromUsd(calc.totalUsd, fxRate)} (BCV)</div>
            </div>
            <a
              href={whatsappHref(waMsg)}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black shadow hover:opacity-90"
            >
              Enviar por WhatsApp
            </a>
          </div>
          <div className="mt-3 text-[11px] text-white/45">
            * USD/Bs ***BCV*** {fxStatus}
            {fxUpdatedAt ? ` · Última: ${new Date(fxUpdatedAt).toLocaleString()}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
