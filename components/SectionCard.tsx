import { clsx } from 'clsx'

export default function SectionCard({
  title,
  children,
  className
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={clsx('rounded-2xl border border-white/10 bg-black/35 p-5 shadow-soft', className)}>
      <h2 className="text-sm font-semibold tracking-wide text-white/85">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
