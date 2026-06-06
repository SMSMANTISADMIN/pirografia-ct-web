import Link from 'next/link'
import { CatalogConfigurator } from '@/components/CatalogConfigurator'
import { getCatalog, getCatalogItemBySlug } from '@/lib/catalog'
import { formatBsFromUsd, formatUsd } from '@/lib/currency'
import { getFxRateServer } from '@/lib/rates/getRateServer'

export function generateStaticParams() {
  return getCatalog().map((c) => ({ slug: c.slug }))
}

export default function CatalogItemPage({ params }: { params: { slug: string } }) {
  const item = getCatalogItemBySlug(params.slug)
  const fx = getFxRateServer()
  if (!item) {
    return (
      <main>
        <section className="mx-auto max-w-3xl py-14">
          <h1 className="text-2xl font-semibold">No encontrado</h1>
          <p className="mt-2 text-sm text-white/65">Este producto/categoría no existe.</p>
          <Link href="/catalogo" className="mt-6 inline-block rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black">
            Volver a Catálogo
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="pb-14 pt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-white/55">
              <Link href="/catalogo" className="hover:underline">
                Catálogo
              </Link>
              <span className="px-2">/</span>
              <span className="text-white/80">{item.title}</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{item.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Desde {formatUsd(item.basePriceUsd)}
              </span>
              <span className="text-white/55">{formatBsFromUsd(item.basePriceUsd, fx.rate)} (BCV)</span>
            </div>
            <div className="mt-2 text-xs text-white/45">
              Tasa BCV: {fx.rate.toFixed(2)} Bs/$ ({fx.status}).
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.cover || '/images/museo/sample-1.svg'} alt={item.title} className="h-[420px] w-full object-cover" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {item.sizes?.length ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-xs text-white/60">Tamaños aproximados</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {item.sizes.map((s) => (
                      <li key={s} className="text-white/85">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.notes?.length ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-xs text-white/60">Incluye</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {item.notes.map((n) => (
                      <li key={n} className="text-white/85">
                        • {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <CatalogConfigurator item={item} />
        </div>
      </section>
    </main>
  )
}
