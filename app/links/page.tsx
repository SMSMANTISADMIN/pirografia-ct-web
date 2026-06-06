import SectionCard from '@/components/SectionCard'
import { siteConfig } from '@/lib/site-config'

export default function LinksPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
      </div>

      <SectionCard title="Enlaces rápidos">
        <div className="grid gap-2">
          {siteConfig.links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
              {l.label}
            </a>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Social">
        <div className="grid gap-2 text-sm">
          <a className="text-white/75 hover:text-white" href={siteConfig.socials.instagram}>Instagram</a>
          <a className="text-white/75 hover:text-white" href={siteConfig.socials.tiktok}>TikTok</a>
        </div>
      </SectionCard>
    </div>
  )
}
