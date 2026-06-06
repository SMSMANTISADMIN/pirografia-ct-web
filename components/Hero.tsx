'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

// Ajusta esta ruta si tu JSON vive en otro sitio.
import portfolioData from '@/data/portfolio.json'
import { whatsappHref } from '@/lib/site-config'

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
      setTimeout(() => {
        setPage((p) => (p + 1) % pages.length)
        setFade(true)
      }, 150)
    }, 3400)
    return () => clearInterval(t)
  }, [pages.length])

  const current = pages[page] ?? []

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Header curatorial mínimo */}
      <div className="mb-2 flex items-center justify-between gap-3 md:mb-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-white/90 md:text-sm">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-white/10 bg-white/5 md:h-9 md:w-9">
            ✦
          </span>
          Obras destacadas
        </div>

        <Link href={hrefAll} className="text-[11px] text-white/65 hover:text-white/95 md:text-sm">
          Ver más →
        </Link>
      </div>

      {/* Protagonista: 3 obras grandes */}
      <div
        className={[
          'grid flex-[1.15] min-h-0 grid-cols-2 gap-3 transition-[opacity,transform] duration-500 ease-out md:grid-cols-1 lg:grid-cols-3 lg:gap-5',
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
              className={[
                'group relative overflow-hidden rounded-[24px] border border-white/10 bg-black/40 shadow-[0_26px_100px_rgba(0,0,0,0.75)]',
                idx === 0
                  ? 'col-span-2 aspect-[16/9] md:col-span-1 md:aspect-[4/5]'
                  : 'aspect-[4/5]',
              ].join(' ')}
              aria-label={title}
            >
              <div className="relative h-full min-h-0">
                <Image
                  src={w.cover}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 767px) 100vw, (max-width: 1024px) 30vw, 22vw"
                  priority={page === 0 && idx < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/18 to-transparent" />
              </div>

              {/* Texto mínimo */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[11px] font-semibold text-white/95 md:text-sm">{title}</div>
                    {w.size ? <div className="mt-1 truncate text-[10px] text-white/60 md:text-[11px]">{w.size}</div> : null}
                  </div>

                  <div className="shrink-0 rounded-full border border-white/10 bg-black/45 px-2 py-0.5 text-[10px] text-white/70 md:px-2.5 md:py-1 md:text-[11px]">
                    {w.year ?? 'Museo'}
                  </div>
                </div>

                {/* Tags solo hover (desktop) */}
                <div className="mt-2 hidden gap-2 lg:flex">
                  <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                    Pirografía
                  </div>
                  <div className="max-w-[62%] truncate rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {w.tags?.join(' · ') || 'Colección'}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -inset-24 bg-[radial-gradient(520px_circle_at_30%_18%,rgba(255,255,255,0.12),transparent_62%)]" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Dots discretos */}
      {pages.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2 md:mt-5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 w-8 rounded-full transition md:w-12 ${i === page ? 'bg-white/75' : 'bg-white/20 hover:bg-white/35'}`}
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
    <section className="relative pt-0 md:pt-8">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative min-h-[calc(100svh-5rem)] overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-[0_22px_90px_rgba(0,0,0,0.68)] md:min-h-0 md:rounded-[34px]">
          {/* Fondo: más galería, menos ruido */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_28%,rgba(25,130,150,0.12),transparent_58%),radial-gradient(1000px_circle_at_86%_40%,rgba(175,120,35,0.14),transparent_62%)]" />
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:72px_72px]" />
            <div className="absolute inset-0 bg-[radial-gradient(1400px_circle_at_50%_45%,transparent_40%,rgba(0,0,0,0.80)_78%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/10 to-black/55" />
          </div>

          {/* Layout: más espacio para obras, y NUNCA se enciman */}
          <div className="relative z-10 grid h-full grid-rows-[minmax(0,1fr)_auto] gap-4 px-4 py-4 md:px-6 md:py-8 lg:grid-cols-[0.50fr_1.50fr] lg:grid-rows-none lg:gap-8">
            {/* Derecha: Galería con contenedor que impide invadir la izquierda */}
            <div className="order-1 w-full min-h-0 lg:order-2 lg:pl-6">
              <div className="ml-auto h-full w-full min-h-0 max-w-[980px]">
                <GalleryShowcase items={items} hrefAll="/museo" />
              </div>
            </div>

            {/* Izquierda: mínimo texto + CTAs compactos */}
            <div className="order-2 relative pr-2 lg:order-1 lg:pr-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/70 md:px-3 md:text-xs">
                Lo más visto
              </div>

              <h1 className="mt-2 text-[1.55rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:mt-4 md:text-4xl md:leading-tight lg:text-5xl">
                Pirograbado artístico personalizado.
              </h1>

              <p className="mt-2 max-w-md text-[0.72rem] leading-relaxed text-white/60 md:mt-3 md:text-sm md:leading-relaxed">
                Explorá el catálogo, elegí tu estilo y pedí tu pieza por WhatsApp.
              </p>

              {/* CTA dock (más compacto, menos “peso”) */}
              <div className="mt-3 grid grid-cols-2 gap-2 md:mt-6 md:flex md:flex-wrap">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-black hover:opacity-95 md:px-4 md:py-2.5 md:text-sm"
                >
                  Catálogo →
                </Link>

                <Link
                  href="/museo"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 md:px-4 md:py-2.5 md:text-sm"
                >
                  Museo →
                </Link>

                <a
                  href={whatsappHref('Hola! Vi tu trabajo y quiero solicitar un pirograbado.')}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#c79a38]/35 bg-[#c79a38]/10 px-3 py-2 text-xs font-semibold text-white hover:bg-[#c79a38]/15 md:px-4 md:py-2.5 md:text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Solicitar 💬
                </a>

                <Link
                  href="/museo"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 md:px-4 md:py-2.5 md:text-sm"
                >
                  Ver más →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
