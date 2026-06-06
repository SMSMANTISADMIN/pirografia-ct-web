'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'

// Ajusta esta ruta según tu proyecto.
// Si tu JSON está en /data/portfolio.json usa: import portfolioData from '@/data/portfolio.json'
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

function normalizePortfolio(raw: any): PortfolioItem[] {
  const items: PortfolioItem[] = raw?.items ?? raw ?? []
  return items.filter((x) => x?.cover)
}

function toNine(items: PortfolioItem[]) {
  const base = items.slice(0, 9)
  if (base.length >= 9) return base
  const out = [...base]
  let i = 0
  while (out.length < 9 && base.length) {
    out.push(base[i % base.length])
    i++
  }
  return out
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function formatTags(tags?: string[]) {
  if (!tags?.length) return null
  return tags.slice(0, 2).join(' · ')
}

function FeaturedShowcase({ items, hrefAll = '/museo' }: { items: PortfolioItem[]; hrefAll?: string }) {
  const pages = useMemo(() => chunk(toNine(items), 3).filter((p) => p.length === 3), [items])
  const [page, setPage] = useState(0)

  // autoplay
  useEffect(() => {
    if (pages.length <= 1) return
    const t = setInterval(() => setPage((p) => (p + 1) % pages.length), 3200)
    return () => clearInterval(t)
  }, [pages.length])

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5">✦</span>
          Obras destacadas
        </div>
        <Link href={hrefAll} className="text-sm text-white/65 hover:text-white/95">
          Ver más →
        </Link>
      </div>

      {/* Stage con crossfade (no cambio brusco) */}
      <div className="relative min-h-[320px]">
        {pages.map((p, i) => (
          <div
            key={i}
            className={
              'absolute inset-0 grid grid-cols-3 gap-5 transition-all duration-500 ease-out ' +
              (i === page ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2')
            }
          >
            {p.map((w, idx) => {
              const href = w.permalink?.trim() ? w.permalink : hrefAll
              const title = w.title?.trim() || `Pieza ${String(idx + 1).padStart(2, '0')}`
              const tagLine = formatTags(w.tags)

              return (
                <Link
                  key={`${w.id ?? w.cover}-${idx}`}
                  href={href}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-[0_25px_90px_rgba(0,0,0,0.75)]"
                  aria-label={title}
                >
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={w.cover}
                      alt={title}
                      fill
                      priority={i === 0 && idx < 3}
                      sizes="(max-width: 1024px) 30vw, 22vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    {/* vignette suave para que la obra respire */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -inset-20 bg-[radial-gradient(520px_circle_at_30%_20%,rgba(255,255,255,0.10),transparent_60%)]" />
                    </div>
                  </div>

                  {/* Info mínima (no tapar la obra) */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-base font-semibold text-white/95">{title}</div>
                        {/* tags SOLO en hover (desktop) */}
                        <div className="mt-1 hidden text-xs text-white/60 lg:block">
                          <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {tagLine ?? w.size ?? 'Colección'}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[11px] text-white/70">
                        {w.year ?? 'Museo'}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Dots discretos */}
      {pages.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={
                'h-1.5 w-10 rounded-full transition ' +
                (i === page ? 'bg-white/80' : 'bg-white/20 hover:bg-white/35')
              }
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

  // CTA links
  const whatsappHref = '/whatsapp' // si ya tienes una ruta/wa.me, cámbiala aquí

  return (
    <section className="relative pt-8">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/40 shadow-[0_30px_110px_rgba(0,0,0,0.70)]">
          {/* Fondo: menos protagonista, más galería */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_18%,rgba(30,160,180,0.12),transparent_58%),radial-gradient(900px_circle_at_85%_30%,rgba(180,120,40,0.14),transparent_62%)]" />
            <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:60px_60px]" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_45%,transparent_30%,rgba(0,0,0,0.65)_70%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
          </div>

          {/* ✅ NO header duplicado aquí. (El header global ya existe) */}

          <div className="relative z-10 grid gap-10 px-6 py-8 lg:grid-cols-[0.7fr_1.3fr]">
            {/* Izquierda: texto mínimo, obra manda */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <Image src="/brand/logo-mark.webp" alt="PIROGRAFIA_CT" fill className="object-contain" priority />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">PIROGRAFIA_CT</div>
                  <div className="text-xs text-white/60">Catálogo · Museo · WhatsApp</div>
                </div>
              </div>

              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                🔥 Colección destacada
              </div>

              <h1 className="mt-4 text-[clamp(2.2rem,4vw,3.6rem)] font-semibold tracking-[-0.03em] text-white">
                Pirografía que parece museo.
              </h1>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/65">
                Mira obras, elige categoría y solicita por WhatsApp. Sin fricción.
              </p>

              {/* Dock de CTA: siempre visible, compacto y premium */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-soft transition hover:opacity-95"
                >
                  Ir al Catálogo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-2 backdrop-blur">
                  <Link
                    href="/museo"
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
                  >
                    Ver Museo
                  </Link>
                  <Link
                    href={whatsappHref}
                    className="inline-flex items-center justify-center rounded-xl border border-brand-copper/35 bg-brand-copper/10 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-copper/15"
                  >
                    Solicitar
                  </Link>
                  <Link
                    href="/museo"
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/10"
                  >
                    Ver más obras
                  </Link>
                </div>
              </div>

              {/* KPIs discretos */}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs text-white/55">Museo</div>
                  <div className="mt-1 text-sm font-semibold">Obras reales</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs text-white/55">Pedido</div>
                  <div className="mt-1 text-sm font-semibold">WhatsApp armado</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-xs text-white/55">Entrega</div>
                  <div className="mt-1 text-sm font-semibold">Directo</div>
                </div>
              </div>
            </div>

            {/* Derecha: la galería manda */}
            <div className="lg:pl-2">
              <FeaturedShowcase items={items} hrefAll="/museo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
