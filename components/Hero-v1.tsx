import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Flame, CheckCircle2, Package, MessageCircle } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

type HeroProps = {
  eyebrow?: string
}

export default function Hero({ eyebrow = 'PIROGRAFÍA · CATÁLOGO · MUSEO' }: HeroProps) {
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
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
              {/* Logo real */}
              <Image
                src="/brand/logo.webp"
                alt="PIROGRAFIA_CT"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>
            <div className="text-xs text-white/60">{siteConfig.tagline}</div>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            <span className="block">PIROGRAFIA_CT</span>
            <span className="mt-1 block text-base font-medium text-white/65 md:text-lg">
              Catálogo + Museo in-app. Solicita por WhatsApp en segundos.
            </span>
          </h1>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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

        {/* Right (PRO, sin placeholder) */}
        <div className="md:col-span-5">
          <div className="relative h-full min-h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-black/25">
            <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_30%_20%,rgba(179,122,43,.18),transparent_55%),radial-gradient(520px_circle_at_80%_70%,rgba(14,58,67,.26),transparent_60%)]" />

            <div className="absolute inset-0 flex flex-col justify-end p-5">
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

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/catalogo"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black transition hover:opacity-95"
                  >
                    Empezar pedido
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
