import { CatalogCard } from '@/components/CatalogCard'
import { getCatalog } from '@/lib/catalog'
import { getFxRateServer } from '@/lib/rates/getRateServer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CatalogoPage() {
  const fx = await getFxRateServer()
  const catalog = getCatalog()
  return (
    <main>
      <section className="pb-14 pt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
          <p className="max-w-2xl text-sm text-white/65">
            Selecciona una categoría o producto, configura tu pedido y envíalo por WhatsApp con el resumen listo.
          </p>
          <p className="text-xs text-white/45">
            Tasa BCV: 1$ ≈ {Math.round(fx.rate)} Bs ({fx.status})
            {fx.updatedAt ? ` · Actualizada ${new Date(fx.updatedAt).toLocaleString()}` : ''}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {catalog.map((item) => (
            <CatalogCard
              key={item.id}
              title={item.title}
              href={`/catalogo/${item.slug}`}
              cover={item.cover}
              priceUsd={item.basePriceUsd}
              fxRate={fx.rate}
              subtitle={item.sizes?.join(' · ') || item.notes?.join(' · ')}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
