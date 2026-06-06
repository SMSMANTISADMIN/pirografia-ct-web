'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

// ✅ Ajusta esta ruta según tu proyecto:
// - si está en /data/portfolio.json => '@/data/portfolio.json'
import portfolioData from '@/data/portfolio.json'

type PortfolioItem = {
  id: string
  title: string
  cover: string
  tags?: string[]
  year?: number
  size?: string
  description?: string
  permalink?: string
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function normalizePortfolio(raw: any): PortfolioItem[] {
  const items: PortfolioItem[] = raw?.items ?? []
  return items.filter((x) => x?.cover)
}

// Repite items para llegar a 9 sin “huecos” (si tienes 8, funciona perfecto)
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

function GalleryShowcase({
  items,
  hrefAll = '/museo',
}: {
  items: PortfolioItem[]
  hrefAll?: string
}) {
  // 9 items -> 3 páginas de 3
  const pages = useMemo(() => chunk(toNine(items), 3), [items])
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (pages.length <= 1) return
    const t = setInterval(() => setPage((p) => (p + 1) % pages.length), 2800)
    return () => clearInterval(t)
  }, [pages.length])

  const current = pages[page] ?? []

  return (
    <div className="relative">
      {/* Header mínimo (curatorial) */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            ✦
          </span>
          Obras destacadas
        </div>

        <Link
          href={hrefAll}
          className="text-sm text-white/70 hover:text-white/95"
        >
          Ver más →
        </Link>
      </div>

      {/* ✅ Protagonista: 3 obras GRANDES */}
      <div className="grid grid-cols-3 gap-4">
        {current.map((w, idx) => {
          const href = w.permalink?.trim()
            ? w.permalink
            : hrefAll

          return (
            <Link
              key={`${w.id}-${idx}-${page}`}
              href={href}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_10px_35px_rgba(0,0,0,0.55)]"
              aria-label={w.title}
            >
              {/* Aspecto “galería”: alto y elegante */}
              <div className="relative aspect-[3/4]">
                <Image
                  src={w.cover}
                  alt={w.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 30vw, 20vw"
                  priority={page === 0 && idx < 3}
                />
                {/* Overlay curatorial */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-95" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-semibold text-white/95">
                    {w.title}
                  </div>
                  <div className="shrink-0 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[11px] text-white/70">
                    {w.year ?? 'Museo'}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2 text-[11px] text-white/60">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                    Pirografía
                  </span>
                  <span className="truncate">
                    {w.size ? w.size : 'Colección destacada'}
                  </span>
                </div>
              </div>

              {/* micro-brillo */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -inset-20 bg-[radial-gradient(500px_circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Dots (discretos) */}
      {pages.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 w-10 rounded-full transition ${
                i === page ? 'bg-white/80' : 'bg-white/20 hover:bg-white/35'
              }`}
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
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/40 shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
          {/* Fondo cinematográfico */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_20%,rgba(30,160,180,0.18),transparent_55%),radial-gradient(900px_circle_at_85%_35%,rgba(180,120,40,0.20),transparent_60%)]" />
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55" />
          </div>

          {/* Header superior (tu barra) */}
          <div className="relative z-10 flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image
                  src="/brand/logo-mark.webp"
                  alt="PIROGRAFIA_CT"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <div className="text-sm font-semibold tracking-tight">
                  PIROGRAFIA_CT
                </div>
                <div className="text-xs text-white/60">
                  Catálogo · Museo · WhatsApp
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/whatsapp"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
              >
                <span>WhatsApp</span>
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
              >
                <span>Correo</span>
              </Link>
            </div>
          </div>

          {/* Cuerpo principal: obras dominan */}
          <div className="relative z-10 grid gap-8 px-6 pb-8 pt-2 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Izquierda: texto MINIMO + CTAs SIEMPRE */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                🔥 Colección destacada
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                Pirografía que parece museo.
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
                Mira obras, elige categoría y solicita por WhatsApp. Sin fricción.
              </p>

              {/* ✅ CTAs fijos (no desaparecen) */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:opacity-95"
                >
                  Ir al Catálogo →
                </Link>

                <Link
                  href="/museo"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                >
                  Ver Museo →
                </Link>

                <Link
                  href="/whatsapp"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#c79a38]/35 bg-[#c79a38]/10 px-4 py-3 text-sm font-semibold text-white hover:bg-[#c79a38]/15"
                >
                  Solicitar pirograbado 💬
                </Link>

                <Link
                  href="/museo"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10"
                >
                  Ver más obras →
                </Link>
              </div>

              {/* Micro-KPIs discretos */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="text-white/55">Museo</div>
                  <div className="mt-1 font-semibold text-white/90">
                    Obras reales
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="text-white/55">Pedido</div>
                  <div className="mt-1 font-semibold text-white/90">
                    WhatsApp listo
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="text-white/55">Entrega</div>
                  <div className="mt-1 font-semibold text-white/90">
                    Directo
                  </div>
                </div>
              </div>
            </div>

            {/* Derecha: ✅ GALERÍA PROTAGONISTA */}
            <div className="lg:pl-2">
              <GalleryShowcase items={items} hrefAll="/museo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
