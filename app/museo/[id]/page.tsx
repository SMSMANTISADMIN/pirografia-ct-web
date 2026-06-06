import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SectionCard from '@/components/SectionCard'
import { getPortfolio, getPortfolioById } from '@/lib/portfolio'
import { whatsappHref } from '@/lib/site-config'

export default function MuseoDetail({ params }: { params: { id: string } }) {
  const item = getPortfolioById(params.id)
  if (!item) return notFound()

  const related = getPortfolio()
    .filter((p) => p.id !== item.id && p.tags.some((t) => item.tags.includes(t)))
    .slice(0, 3)

  return (
    <div className="grid gap-6">
      <div>
        <a href="/museo" className="text-sm text-white/65 hover:text-white">← Volver</a>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{item.title}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{item.year}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{item.size}</span>
          {item.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{t}</span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/35 shadow-soft">
        {item.permalink ? (
          <div className="p-4">
            <div className="text-xs text-white/55">Video (Instagram embed, in-app)</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <iframe
                title={item.title}
                src={`${item.permalink.replace(/\/$/, '')}/embed`}
                className="h-[70vh] w-full"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
          </div>
        ) : (
          <div className="relative aspect-[16/10]">
            <Image src={item.cover || '/images/museo/sample-1.svg'} alt={item.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
          </div>
        )}
        <div className="p-5">
          {item.description ? <p className="text-sm text-white/75">{item.description}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
              href={whatsappHref(`Hola! Vi la pieza "${item.title}" en la galería y me interesó. ¿Me podrías dar más info?`)}
            >
              Solicitar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <SectionCard title="Piezas relacionadas">
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/museo/${r.id}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-black/35 transition hover:border-white/20"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={r.cover || '/images/museo/sample-1.svg'} alt={r.title} fill className="object-cover opacity-80 transition group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs font-semibold text-white/90 truncate">{r.title}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  )
}
