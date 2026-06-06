import Image from 'next/image'
import Link from 'next/link'
import type { PortfolioItem } from '@/lib/portfolio'

export default function MuseoGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <Link
          key={it.id}
          href={`/museo/${it.id}`}
          className="group overflow-hidden rounded-2xl border border-white/10 bg-black/35 shadow-soft transition hover:border-white/20"
        >
          <div className="relative aspect-[3/2]">
            <Image src={it.cover || '/images/museo/sample-1.svg'} alt={it.title} fill className="object-cover opacity-90 transition group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="text-sm font-semibold text-white/90">{it.title}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {it.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs text-white/55">{it.year ?? '—'} · {it.size ?? '—'}</div>
            {it.description ? <p className="mt-2 line-clamp-2 text-sm text-white/70">{it.description}</p> : null}
          </div>
        </Link>
      ))}
    </div>
  )
}
