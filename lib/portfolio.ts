import data from '@/data/portfolio.json'

export type PortfolioItem = {
  id: string
  title: string
  cover?: string
  tags: string[]
  year?: number
  size?: string
  description?: string
  // Instagram permalink del reel/post. Si está vacío, se muestra cover.
  permalink?: string
}

export function getPortfolio(): PortfolioItem[] {
  return (data as any).items as PortfolioItem[]
}

export function getPortfolioById(id: string): PortfolioItem | undefined {
  return getPortfolio().find((x) => x.id === id)
}

export function getPortfolioTags(): string[] {
  const set = new Set<string>()
  for (const it of getPortfolio()) it.tags.forEach((t) => set.add(t))
  return Array.from(set).sort()
}
