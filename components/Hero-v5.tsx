'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

// ✅ Ajusta esta ruta si tu JSON vive en otro sitio.
import portfolioData from '@/data/portfolio.json'

type PortfolioItem = {
  id?: string
  title?: string
  cover: string
  tags?: string[]
  year?: number
  size?: string
  permalink?: string
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function normalizePortfolio(raw: any): PortfolioItem[] {
  const items: any[] = raw?.items ?? raw ?? []
  return items.filter((x) => x?.cover)
}

function toNine(items: PortfolioItem[]) {
  const base = items.slice(0, 9)
  if (base.length >= 9) return base
  const out = [...base]
  let i = 0
  while (out.length < 9 && base.length) {
    out.push(base[i % base.length])
    i += 1
  }
  return out
}

function GalleryShowcase({ items, hrefAll = '/museo' }: { items: PortfolioItem[]; hrefAll?: string }) {
  const pages = useMemo(() => chunk(toNine(items), 3), [items])
  const [page, setPage] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (pages.length <= 1) return
    const t = setInterval(() => {
      setFade(false)
      // micro delay para activar crossfade
      setTimeout(() => {
        setPage((p) => (p + 1) % pages.length)
        setFade(true)
      }, 140)
    }, 3200)
    return () => clearInterval(t)
  }, [pages.length])

  const current = pages[page] ?? []

  return (
    <div className="relative">
      {/* Header curatorial mínimo */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            ✦
          </span>
          Obras destacadas
        </div>

        <Link href={hrefAll} className="text-sm text-white/65 hover:text-white/95">
          Ver más →
        </Link>
      </div>

      {/* ✅ Protagonista: 3 obras GRANDES + crossfade */}
      <div
        className={[
          'grid grid-cols-3 gap-5 transition-[opacity,transform] duration-500 ease-out',
          fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5',
        ].join(' ')}
      >
        {current.map((w, idx) => {
          const href = w.permalink?.trim() ? w.permalink : hrefAll
          const title = w.title?.trim() || `Pieza ${page * 3 + idx + 1}`

          return (
            <Link
              key={`${w.cover}-${idx}-${page}`}
              href={href}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-[0_28px_110px_rgba(0,0,0,0.78)]"
              aria-label={title}
            >
              {/* Aspecto más “gallery poster” */}
              <div className="relative aspect-[2/3]">
                <Image
                  src={w.cover}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 30vw, 22vw"
                  priority={page === 0 && idx < 3}
                />
                {/* Overlay menos UI, más curatorial */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              </div>

              {/* Texto mínimo: título + año (tags solo hover en desktop) */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-white/95">{title}</div>
                    {w.size ? <div className="mt-1 truncate text-xs text-white/60">{w.size}</div> : null}
                  </div>

                  <div className="shrink-0 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-xs text-white/70">
                    {w.year ?? 'Museo'}
                  </div>
                </div>

                {/* Tags: solo en hover (desktop) */}
                <div className="mt-2 hidden gap-2 lg:flex">
                  <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                    Pirografía
                  </div>
                  <div className="max-w-[60%] truncate rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {w.tags?.join(' · ') || 'Colección'}
                  </div>
                </div>
              </div>

              {/* brillo sutil al hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -inset-24 bg-[radial-gradient(520px_circle_at_30%_18%,rgba(255,255,255,0.13),transparent_62%)]" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Dots discretos */}
      {pages.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 w-12 rounded-full transition ${i == page ? 'bg-white/75' : 'bg-white/20 hover:bg-white/35'}`}
              aria-label={`Ver set ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function Hero() {
  const items = useMemo(() => normalizePortfolio(portfolioData), [])

  return (
    <section className="relative pt-8">
      {/* Contenedor centrado real */}
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/40 shadow-[0_22px_90px_rgba(0,0,0,0.68)]">
          {/* Fondo: más galería, menos “UI grid” */}
          <div className="pointer-events-none absolute inset-0">
            {/* spotlights muy sutiles */}
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_28%,rgba(25,130,150,0.14),transparent_58%),radial-gradient(1000px_circle_at_86%_40%,rgba(175,120,35,0.16),transparent_62%)]" />
            {/* grid casi imperceptible */}
            <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px]" />
            {/* vignette: dirige mirada a las obras */}
            <div className="absolute inset-0 bg-[radial-gradient(1400px_circle_at_50%_45%,transparent_40%,rgba(0,0,0,0.78)_78%)]" />
            {/* film shade */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/55" />
          </div>

          {/* ✅ Cuerpo principal (SIN header duplicado dentro del hero) */}
          <div className="relative z-10 grid gap-8 px-6 py-8 lg:grid-cols-[0.55fr_1.45fr]">
            {/* Izquierda: identidad mínima + dock de CTA */}
            <div className="relative">

              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                🔥 Colección destacada
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                Pirografía que parece museo.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60 md:text-base">
                Mira obras, elige categoría y solicita por WhatsApp. Sin fricción.
              </p>

              {/* ✅ Dock CTA compacto (no compite con obras) */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-95"
                >
                  Ir al Catálogo →
                </Link>

                <Link
                  href="/museo"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                >
                  Ver Museo →
                </Link>

                <Link
                  href="/whatsapp"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#c79a38]/35 bg-[#c79a38]/10 px-5 py-3 text-sm font-semibold text-white hover:bg-[#c79a38]/15"
                >
                  Solicitar 💬
                </Link>

                <Link
                  href="/museo"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
                >
                  Ver más obras →
                </Link>
              </div>
            </div>

            {/* Derecha: ✅ GALERÍA PROTAGONISTA (más grande) */}
            <div className="lg:pt-1 lg:scale-[1.08] lg:origin-top-right">
              <GalleryShowcase items={items} hrefAll="/museo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
