// src/utils/personalize.ts
import type { ContentItem } from '../lib/contents'

/**
 * Simple client-side "AI-like" scoring:
 * - +10 for each exact tag match
 * - +jaccard*10 to boost multi-tag overlap
 * Sorted descending by score.
 */
export function scoreContentsForInterests(contents: ContentItem[], interests: string[]): ContentItem[] {
  if (!interests || interests.length === 0) return contents.slice(); // cold-start: return all (ordered)
  const interestSet = new Set(interests.map(i => i.toLowerCase()))
  const scored = contents.map(item => {
    const itemTags = item.tags.map(t => t.toLowerCase())
    const intersectionCount = itemTags.filter(t => interestSet.has(t)).length
    const unionSize = new Set([...itemTags, ...Array.from(interestSet)]).size || 1
    const jaccard = intersectionCount / unionSize
    const score = intersectionCount * 10 + jaccard * 10
    return { item, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored.map(s => s.item)
}
