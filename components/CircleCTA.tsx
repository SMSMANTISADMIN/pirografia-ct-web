import Link from 'next/link'
import { clsx } from 'clsx'

type Props = {
  title: string
  subtitle?: string
  href: string
  size?: 'sm' | 'md' | 'lg'
  note?: string
}

export default function CircleCTA({ title, subtitle, href, size = 'md', note }: Props) {
  const dims =
    size === 'lg'
      ? 'h-56 w-56 md:h-72 md:w-72'
      : size === 'sm'
        ? 'h-24 w-24 md:h-28 md:w-28'
        : 'h-40 w-40 md:h-48 md:w-48'

  return (
    <Link
      href={href}
      className={clsx(
        'group relative flex items-center justify-center rounded-full border border-white/15 bg-white/5 shadow-glow transition',
        'hover:border-white/30 hover:bg-white/10',
        'focus-visible:outline-none',
        dims
      )}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.16),transparent_55%)] opacity-70" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,.10),transparent_58%)] opacity-70" />
      <div className="relative flex flex-col items-center text-center">
        <div className="text-base font-semibold tracking-tight md:text-lg">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-white/60 md:text-sm">{subtitle}</div> : null}
        {note ? <div className="mt-3 text-[11px] text-white/45">{note}</div> : null}
      </div>
      <div className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-xl transition group-hover:opacity-40" style={{ background: 'radial-gradient(circle, rgba(255,255,255,.35), transparent 60%)' }} />
    </Link>
  )
}
