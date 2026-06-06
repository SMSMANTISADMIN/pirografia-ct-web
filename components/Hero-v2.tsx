'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Flame, CheckCircle2, Package, MessageCircle, Images } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

type HeroProps = {
  eyebrow?: string
}

type Work = { src: string; title?: string; tag?: string; href?: string }

// TODO: reemplaza estos src por tus obras reales en /public/images/museo/
const FEATURED_WORKS: Work[] = [
  { src: '/images/museo/featured-1.webp', title: 'Obra destacada 01', tag: 'Museo', href: '/museo' },
  { src: '/images/museo/featured-2.webp', title: 'Obra destacada 02', tag: 'Museo', href: '/museo' },
  { src: '/images/museo/featured-3.webp', title: 'Obra destacada 03', tag: 'Museo', href: '/museo' },
  { src: '/images/museo/featured-4.webp', title: 'Obra destacada 04', tag: 'Museo', href: '/museo' },
  { src: '/images/museo/featured-5.webp', title: 'Obra destacada 05', tag: 'Museo', href: '/museo' },
  { src: '/images/museo/featured-6.webp', title: 'Obra destacada 06', tag: 'Museo', href: '/museo' },
  { src: '/images/museo/featured-7.webp', title: 'Obra destacada 07', tag: 'Museo', href: '/museo' },
  { src: '/images/museo/featured-8.webp', title: 'Obra destacada 08', tag: 'Museo', href: '/museo' },
  { src: '/images/museo/featured-9.webp', title: 'Obra destacada 09', tag: 'Museo', href: '/museo' },
]

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function getWhatsAppHref() {
  const raw = (siteConfig as any)?.whatsappHref || (siteConfig as any)?.whatsapp || (siteConfig as any)?.whatsappUrl
  if (typeof raw === 'string' && raw.length > 0) return raw

  const phone = (siteConfig as any)?.whatsappNumber || (siteConfig as any)?.phone || ''
  const digits = String(phone).replace(/\D/g, '')
  if (!digits) return '/catalogo'

  const msg = encodeURIComponent('Hola, quiero solicitar un pirograbado. ¿Me ayudas con opciones y tiempos?')
  return `https://wa.me/${digits}?text=${msg}`
}

function FeaturedShowcase({ works }: { works: Work[] }) {
  // 3 visibles SIEMPRE; rota “páginas” de 3 hasta 9.
  const pages = useMemo(() => chunk(works.slice(0, 9), 3).filter((p) => p.length === 3), [works])
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (pages.length <= 1) return
    const t = setInterval(() => setPage((p) => (p + 1) % pages.length), 3200)
    return () => clearInterval(t)
  }, [pages.length])

  const current = pages[page] ?? []

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
          <Images className="h-4 w-4 text-brand-copper" />
          Obras destacadas
        </div>
        <div className="flex items-center gap-2">
          {pages.length > 1 ? (
            <div className="hidden items-center gap-2 sm:flex">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-1.5 w-6 rounded-full transition ${i === page ? 'bg-white/75' : 'bg-white/20 hover:bg-white/35'}`}
                  aria-label={`Ver set ${i + 1}`}
                />
              ))}
            </div>
          ) : null}
          <Link href="/museo" className="text-xs text-white/60 hover:text-white/90">
            Ver más →
          </Link>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {current.map((w, idx) => {
          const href = w.href || '/museo'
          return (
            <Link
              key={`${w.src}-${idx}`}
              href={href}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-black/35"
              aria-label={w.title ?? `Obra ${idx + 1}`}
            >
              <Image
                src={w.src}
                alt={w.title ?? `Obra ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 30vw, 18vw"
                priority={page === 0 && idx < 3}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-[11px] font-medium text-white/90">{w.title ?? 'Obra destacada'}</div>
                  <div className="shrink-0 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-white/70">
                    {w.tag ?? 'Museo'}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Dots mobile */}
      {pages.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 w-6 rounded-full transition ${i === page ? 'bg-white/75' : 'bg-white/20 hover:bg-white/35'}`}
              aria-label={`Ver set ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function Hero({ eyebrow = 'PIROGRAFÍA · CATÁLOGO · MUSEO' }: HeroProps) {
  const whatsappHref = getWhatsAppHref()

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 shadow-glow">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <div className="pointer-events-none absolute inset-0 opacity-80 [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative grid gap-8 p-6 md:grid-cols-12 md:p-10">
        {/* Left */}
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-widest text-white/70">
            <Flame className="h-3.5 w-3.5 text-brand-copper" />
            <span className="uppercase">{eyebrow}</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:h-16 md:w-16">
              {/* Logo real */}
              <Image src="/brand/logo-mark.webp" alt="PIROGRAFIA_CT" fill className="object-contain" priority />
            </div>
            <div className="text-xs text-white/60">{siteConfig.tagline}</div>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
            <span className="block">PIROGRAFIA_CT</span>
            <span className="mt-2 block max-w-xl text-base font-medium text-white/65 md:text-lg">
              Catálogo + Museo in-app. Solicita por WhatsApp en segundos.
            </span>
          </h1>

          {/* CTAs (NO desaparecen) */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-soft transition hover:opacity-95"
            >
              Ir al Catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/museo"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-white/10"
            >
              Ver Museo
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={whatsappHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-copper/35 bg-brand-copper/10 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-copper/15"
            >
              Solicitar pirograbado
              <MessageCircle className="h-4 w-4" />
            </Link>

            <Link
              href="/museo"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/30 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-white/10"
            >
              Ver más obras
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/55">Tasa</div>
              <div className="mt-1 text-sm font-semibold">BCV automática</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/55">Pedido</div>
              <div className="mt-1 text-sm font-semibold">WhatsApp armado</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/55">Portafolio</div>
              <div className="mt-1 text-sm font-semibold">Museo in-app</div>
            </div>
          </div>
        </div>

        {/* Right: OBRAS (protagonista) + cómo pedir (secundario) */}
        <div className="md:col-span-5">
          <div className="space-y-4">
            <FeaturedShowcase works={FEATURED_WORKS} />

            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
                <div className="text-xs text-white/55">Cómo pedir</div>
                <div className="mt-1 text-sm font-semibold">3 pasos, sin fricción</div>

                <ul className="mt-3 space-y-2 text-xs text-white/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-copper" />
                    <span>Elige categoría y opciones (colores, texto, envoltura).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 text-brand-copper" />
                    <span>Revisa el total USD/Bs ***BCV***.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageCircle className="mt-0.5 h-4 w-4 text-brand-copper" />
                    <span>Envía por WhatsApp con el resumen listo.</span>
                  </li>
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href="/catalogo"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black transition hover:opacity-95"
                  >
                    Empezar pedido
                  </Link>
                  <Link
                    href={whatsappHref}
                    className="inline-flex items-center justify-center rounded-xl border border-brand-copper/35 bg-brand-copper/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-copper/15"
                  >
                    Solicitar
                  </Link>
                  <Link
                    href="/museo"
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    Ver trabajos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Right */}
      </div>
    </section>
  )
}
