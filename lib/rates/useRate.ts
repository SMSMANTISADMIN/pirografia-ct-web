'use client'

import { useEffect, useState } from 'react'

export function useRate() {
  const [rate, setRate] = useState<number | null>(null)
  const [meta, setMeta] = useState<{ status?: string; updatedAt?: string } | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/rate', { cache: 'no-store' })
        const json = (await res.json()) as { rate: number; status?: string; updatedAt?: string }
        if (!alive) return
        setRate(json.rate)
        setMeta({ status: json.status, updatedAt: json.updatedAt })
      } catch {
        if (!alive) return
        setRate(null)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return { rate, meta }
}
