'use client'

import { useMemo, useState } from 'react'
import SectionCard from '@/components/SectionCard'
import { siteConfig, whatsappHref } from '@/lib/site-config'

type UploadKind = 'imagen' | 'video'

export default function CarguePage() {
  const [kind, setKind] = useState<UploadKind>('imagen')
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const previewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cargue</h1>
        <p className="mt-1 text-sm text-white/65">¿Tenés una foto o diseño? Cargala acá y te cotizamos la pieza.</p>
      </div>

      <SectionCard title="Nuevo cargue">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <label className="text-sm text-white/70">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setKind('imagen')}
                className={`rounded-full border px-4 py-2 text-sm ${kind === 'imagen' ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}
              >
                Imagen
              </button>
              <button
                type="button"
                onClick={() => setKind('video')}
                className={`rounded-full border px-4 py-2 text-sm ${kind === 'video' ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'}`}
              >
                Video
              </button>
            </div>

            <label className="mt-2 text-sm text-white/70">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35" placeholder="Ej: Retrato para cliente X" />

            <label className="mt-2 text-sm text-white/70">Nota</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35" placeholder="Detalles, instrucciones, fecha, etc." />

            <label className="mt-2 text-sm text-white/70">Archivo</label>
            <input
              type="file"
              accept={kind === 'imagen' ? 'image/*' : 'video/mp4,video/*'}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />

            <a
              href={whatsappHref(`Hola! Quiero cotizar una pieza.\n• Tipo: ${kind}\n• Título: ${title || '—'}\n• Nota: ${note || '—'}`)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:opacity-90"
            >
              Enviar por WhatsApp
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <div className="text-sm font-semibold text-white/85">Preview</div>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/40">
              {previewUrl ? (
                kind === 'imagen' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="preview" className="h-[320px] w-full object-cover" />
                ) : (
                  <video src={previewUrl} controls className="h-[320px] w-full object-cover" />
                )
              ) : (
                <div className="flex h-[320px] items-center justify-center text-sm text-white/45">Sin archivo seleccionado</div>
              )}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-white/70">
              <div><span className="text-white/45">Tipo:</span> {kind}</div>
              <div><span className="text-white/45">Título:</span> {title || '—'}</div>
              <div><span className="text-white/45">Nota:</span> {note || '—'}</div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Trabajos anteriores de clientes">
        <div className="text-sm text-white/65">Próximamente: galería de proyectos enviados por nuestros clientes.</div>
      </SectionCard>
    </div>
  )
}
