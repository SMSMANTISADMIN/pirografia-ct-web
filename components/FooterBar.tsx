import Link from 'next/link'
import { Instagram, Music2 } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export default function FooterBar() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="text-sm text-white/60">
          <span className="text-white/80">{siteConfig.name}</span> · {new Date().getFullYear()}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {siteConfig.links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a className="rounded-full border border-white/15 bg-white/5 p-2 hover:bg-white/10" href={siteConfig.socials.instagram} aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
          <a className="rounded-full border border-white/15 bg-white/5 p-2 hover:bg-white/10" href={siteConfig.socials.tiktok} aria-label="TikTok">
            <Music2 className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
