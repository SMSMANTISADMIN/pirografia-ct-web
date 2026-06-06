import MuseoGrid from '@/components/MuseoGrid'
import SectionCard from '@/components/SectionCard'
import { getPortfolio, getPortfolioTags } from '@/lib/portfolio'

export default function MuseoPage({ searchParams }: { searchParams: { tag?: string; page?: string } }) {
  const tag = searchParams.tag
  const page = Math.max(1, Number(searchParams.page ?? '1') || 1)
  const pageSize = 24

  const tags = getPortfolioTags()
  const all = getPortfolio()
  const filtered = tag ? all.filter((x) => x.tags.includes(tag)) : all
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Museo</h1>
          <p className="mt-1 text-sm text-white/65">Galería de obras. Hacé clic para ver detalle y pedir la tuya.</p>
        </div>
      </div>

      <SectionCard title="Filtros">
        <div className="flex flex-wrap gap-2">
          <a href="/museo" className={`rounded-full border px-3 py-1 text-sm ${!tag ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}>Todo</a>
          {tags.map((t) => (
            <a key={t} href={`/museo?tag=${encodeURIComponent(t)}`} className={`rounded-full border px-3 py-1 text-sm ${tag === t ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}>{t}</a>
          ))}
        </div>
      </SectionCard>

      <MuseoGrid items={items} />

      <div className="flex items-center justify-between gap-3 text-sm">
        <a
          className={`rounded-full border px-4 py-2 ${safePage <= 1 ? 'pointer-events-none border-white/10 bg-white/5 text-white/40' : 'border-white/15 bg-white/10 text-white hover:bg-white/15'}`}
          href={`/museo?${new URLSearchParams({ ...(tag ? { tag } : {}), page: String(safePage - 1) }).toString()}`}
        >
          ← Anterior
        </a>
        <div className="text-white/60">Página {safePage} / {totalPages}</div>
        <a
          className={`rounded-full border px-4 py-2 ${safePage >= totalPages ? 'pointer-events-none border-white/10 bg-white/5 text-white/40' : 'border-white/15 bg-white/10 text-white hover:bg-white/15'}`}
          href={`/museo?${new URLSearchParams({ ...(tag ? { tag } : {}), page: String(safePage + 1) }).toString()}`}
        >
          Siguiente →
        </a>
      </div>
    </div>
  )
}
