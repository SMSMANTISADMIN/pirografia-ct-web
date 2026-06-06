// Catálogo data-first (USD como base).
// Bs se calcula con tasa BCV confirmada (AUTO) o manual override.

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

// Tabla — add-ons por categoría (USD base)
export const pricingTable = {
  additionalPieceUsd: 2,
  categories: {
    1: { color2: 1, color4: 1, envoltura: 2 },
    2: { color2: 2, color4: 4, envoltura: 5 },
    3: { color2: 3, color4: 4, envoltura: 6 },
    4: { color2: 3, color4: 5, envoltura: 7 },
    5: { color2: 4, color4: 6, envoltura: 10 },
    6: { color2: 6, color4: 8, envoltura: 13 },
    7: { color2: 9, color4: 12, envoltura: 16 },
    8: { color2: 18, color4: 24, envoltura: 19 }
  }
} as const

// Placeholders convertidos del prototipo (ajusta a tu catálogo real)
export const catalog: CatalogItem[] = [
  {
    id: 'cat-2',
    type: 'categoria',
    title: 'Categoría 2',
    slug: 'categoria-2',
    cover: '/images/catalogo/cat2.jpg',
    basePriceUsd: 23,
    textIncludedPriceUsd: 26,
    sizes: ['13cm x 16cm', '13cm x 18cm'],
    notes: ['Resina incluida']
  },
  {
    id: 'cat-3',
    type: 'categoria',
    title: 'Categoría 3',
    slug: 'categoria-3',
    cover: '/images/catalogo/cat3.jpg',
    basePriceUsd: 25,
    textIncludedPriceUsd: 28,
    sizes: ['13cm x 19cm', '13cm x 20cm'],
    notes: ['Resina incluida']
  },
  {
    id: 'cat-4',
    type: 'categoria',
    title: 'Categoría 4',
    slug: 'categoria-4',
    cover: '/images/catalogo/cat4.jpg',
    basePriceUsd: 31,
    textIncludedPriceUsd: 34,
    sizes: ['9cm x 27cm', '22cm x 14cm'],
    notes: ['Resina incluida']
  },
  {
    id: 'cat-5',
    type: 'categoria',
    title: 'Categoría 5',
    slug: 'categoria-5',
    cover: '/images/catalogo/cat5.jpg',
    basePriceUsd: 41,
    textIncludedPriceUsd: 45,
    sizes: ['11cm x 28cm', '19cm x 23cm'],
    notes: ['Resina incluida']
  },
  {
    id: 'cat-6',
    type: 'categoria',
    title: 'Categoría 6',
    slug: 'categoria-6',
    cover: '/images/catalogo/cat6.jpg',
    basePriceUsd: 54,
    textIncludedPriceUsd: 62,
    sizes: ['17cm x 32cm', '19cm x 30cm'],
    notes: ['Resina incluida']
  },
  {
    id: 'cat-7',
    type: 'categoria',
    title: 'Categoría 7',
    slug: 'categoria-7',
    cover: '/images/catalogo/cat7.jpg',
    basePriceUsd: 84,
    textIncludedPriceUsd: 92,
    sizes: ['20cm x 31cm', '25cm x 27cm'],
    notes: ['Resina incluida']
  },
  {
    id: 'cat-8',
    type: 'categoria',
    title: 'Categoría 8',
    slug: 'categoria-8',
    cover: '/images/catalogo/cat8.jpg',
    basePriceUsd: 148,
    textIncludedPriceUsd: 142,
    sizes: ['41cm x 38cm', '43cm circunferencia', '37cm x 34cm'],
    notes: ['Resina incluida']
  },
  {
    id: 'llavero-1',
    type: 'llavero',
    title: 'Llaveros 1',
    slug: 'llaveros-1',
    cover: '/images/catalogo/llaveros1.jpg',
    basePriceUsd: 6,
    textIncludedPriceUsd: 8,
    sizes: ['5cm x 5cm', '5cm x 6cm', '5cm x 7cm'],
    notes: ['Resina artística incluida', 'Incluye una sola cara']
  }
]

export function getCatalogItemBySlug(slug: string) {
  return catalog.find((c) => c.slug === slug)
}
