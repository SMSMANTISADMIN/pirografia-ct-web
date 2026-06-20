import CalculatorClient from '@/components/CalculatorClient'
import { getFxRateServer } from '@/lib/rates/getRateServer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CalculadoraPage() {
  const fx = await getFxRateServer()

  return (
    <main>
      <CalculatorClient fxRate={fx.rate} fxStatus={fx.status} fxUpdatedAt={fx.updatedAt} />
    </main>
  )
}
