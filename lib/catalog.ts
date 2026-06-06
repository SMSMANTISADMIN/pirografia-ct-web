import catalogData from '@/data/catalog.json'

export type CatalogItemType = 'categoria' | 'llavero'

export type CatalogItem = {
  id: string
  type: CatalogItemType
  title: string
  slug: string
  cover?: string
  basePriceUsd: number
  textIncludedPriceUsd?: number
  sizes?: string[]
  notes?: string[]
}

export type PricingRow = { color2: number; color4: number; envoltura: number }

export type PricingTable = {
  additionalPieceUsd: number
  categories: Record<string, PricingRow>
}

export function getCatalog(): CatalogItem[] {
  return (catalogData as any).items as CatalogItem[]
}

export function getPricingTable(): PricingTable {
  return (catalogData as any).pricingTable as PricingTable
}

export function getCatalogItemBySlug(slug: string): CatalogItem | undefined {
  return getCatalog().find((c) => c.slug === slug)
}

export function getCatalogSlugs(): string[] {
  return getCatalog().map((c) => c.slug)
}
