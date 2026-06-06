import items from '@/data/museo.json'

export type MuseoItem = {
  id: string
  title: string
  cover: string
  tags: string[]
  year: number
  size: string
  price_from: number
  description: string
}

export function getMuseo(): MuseoItem[] {
  return items as MuseoItem[]
}

export function getMuseoById(id: string): MuseoItem | undefined {
  return (items as MuseoItem[]).find((x) => x.id === id)
}

export function getMuseoTags(): string[] {
  const set = new Set<string>()
  for (const it of items as MuseoItem[]) it.tags.forEach((t) => set.add(t))
  return Array.from(set).sort()
}
