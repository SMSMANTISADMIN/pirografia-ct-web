import Link from 'next/link'
import Hero from '@/components/Hero'
import SectionCard from '@/components/SectionCard'

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <Hero />

      <div className="grid gap-6 md:grid-cols-12">
        <SectionCard title="Acceso rápido" className="md:col-span-7">
          <div className="grid gap-2 text-sm">
            <Link className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85 hover:bg-white/10" href="/catalogo">
              Catálogo · Configura y pide
            </Link>
            <Link className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85 hover:bg-white/10" href="/museo">
              Museo · Portafolio digerible
            </Link>
            <Link className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85 hover:bg-white/10" href="/cargue">
              Cargue · Imagen / video
            </Link>
            <Link className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85 hover:bg-white/10" href="/calculadora">
              Calculadora · Tiempo · costo
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Lo que dicen nuestros clientes" className="md:col-span-5">
          <div className="grid gap-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/55">⭐ Excelente trabajo</div>
              <div className="mt-2 text-xs text-white/60">
                &quot;Quedé encantado con el retrato de mi mascota. El nivel de detalle es increíble, cada pelo está grabado con precisión.&quot;
              </div>
              <div className="mt-2 text-xs text-white/45">— Carlos M.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-white/55">⭐ Superó mis expectativas</div>
              <div className="mt-2 text-xs text-white/60">
                &quot;Pedí un logo para mi emprendimiento y el resultado fue espectacular. La madera le da un toque único que no se consigue en otro lado.&quot;
              </div>
              <div className="mt-2 text-xs text-white/45">— María G.</div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
