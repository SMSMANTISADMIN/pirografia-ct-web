import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatBsFromUsd, formatUsd } from '@/lib/currency'

type Props = {
  title: string
  href: string
  cover?: string
  priceUsd: number
  fxRate: number
  subtitle?: string
}

export function CatalogCard({ title, href, cover, priceUsd, fxRate, subtitle }: Props) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-white/10"
    >
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover || '/images/museo/sample-1.svg'}
            alt={title}
            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate text-base font-semibold tracking-tight">{title}</h3>
            <ArrowRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </div>
          {subtitle ? <p className="mt-1 line-clamp-2 text-xs text-white/65">{subtitle}</p> : null}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-semibold">{formatUsd(priceUsd)}</span>
            <span className="text-xs text-white/50">{formatBsFromUsd(priceUsd, fxRate)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
