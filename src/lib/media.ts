/** Client-safe media URL extraction helpers */
export const mediaUrl = (m: unknown): string | null => {
  if (!m) return null
  if (typeof m === 'string') return m
  if (typeof m === 'object') {
    const obj = m as any
    if (obj.sizes?.hero?.url) return obj.sizes.hero.url
    if (obj.sizes?.card?.url) return obj.sizes.card.url
    if (obj.url) return obj.url
  }
  return null
}

export const cardUrl = (m: unknown): string | null => {
  if (!m) return null
  if (typeof m === 'string') return m
  if (typeof m === 'object') {
    const obj = m as any
    if (obj.sizes?.card?.url) return obj.sizes.card.url
    if (obj.sizes?.thumb?.url) return obj.sizes.thumb.url
    if (obj.url) return obj.url
  }
  return null
}
