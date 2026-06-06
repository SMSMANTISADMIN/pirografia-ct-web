import { AdminRatePanel } from '@/components/AdminRatePanel'

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold">Admin — Tasa BCV</h1>
        <p className="mt-2 text-sm text-white/60">
          AUTO = consenso 3 fuentes (con tolerancia). MANUAL = override inmediato. En producción protege con
          <span className="font-semibold"> ADMIN_API_TOKEN</span>.
        </p>
      </div>

      <div className="mt-6">
        <AdminRatePanel />
      </div>
    </main>
  )
}
