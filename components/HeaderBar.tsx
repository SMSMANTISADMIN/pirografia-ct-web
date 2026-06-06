import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { siteConfig, whatsappHref } from "@/lib/site-config";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/35 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5 md:h-14 md:w-14 lg:h-16 lg:w-16">
            <Image
              src="/brand/logo-mark.png"
              alt="Logo"
              fill
              className="object-contain p-1 md:p-0.5"
              priority
            />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight md:text-base">
              {siteConfig.name}
            </div>
            <div className="hidden text-[11px] text-white/55 md:block">
              {siteConfig.tagline}
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <a
            href={whatsappHref("Hola! Vi tu trabajo y quería consultar por un pedido.")}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 shadow-soft transition hover:bg-white/10"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 shadow-soft transition hover:bg-white/10"
            aria-label="Correo"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Correo</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
