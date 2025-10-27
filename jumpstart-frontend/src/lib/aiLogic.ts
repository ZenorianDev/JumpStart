// src/lib/aiLogic.ts
export interface Item {
  id: string;       // always string
  title: string;
  img: string;
  category: string;
}

export const aiPersonalization = {
  // Read lightweight interaction counts from localStorage (per-category)
  getInteractionCounts(): Record<string, number> {
    if (typeof window === "undefined") return {};
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("interaction_")
    );
    const out: Record<string, number> = {};
    for (const k of keys) {
      out[k.replace("interaction_", "")] = Number(localStorage.getItem(k) || 0);
    }
    return out;
  },

  // Record a single interaction (view/click) for a category
  recordInteraction(category: string) {
    if (typeof window === "undefined") return;
    const key = `interaction_${category}`;
    const curr = Number(localStorage.getItem(key) || "0");
    localStorage.setItem(key, String(curr + 1));
  },

  // Compute simple weights from categories present in items
  // returns a map category -> weight (higher => more relevant)
  computeWeightsFromItems(items: Item[]): Record<string, number> {
    const counts = this.getInteractionCounts();
    const weights: Record<string, number> = {};
    const uniqueCats = Array.from(new Set(items.map((i) => i.category)));
    for (const cat of uniqueCats) {
      // default base weight 1, add interactions to prefer previously clicked categories
      weights[cat] = 1 + (counts[cat] || 0);
    }
    return weights;
  },

  // Sort items by the computed weights (descending)
  sortItemsByPreference(items: Item[], weights: Record<string, number>): Item[] {
    return [...items].sort((a, b) => (weights[b.category] || 0) - (weights[a.category] || 0));
  },

  // Simple top-line recommendation message based on highest interaction
  getRecommendationText(): string {
    const counts = this.getInteractionCounts();
    const categories = Object.keys(counts);
    if (categories.length === 0) {
      const greetings = [
        "Welcome — we’ll personalize your feed as you interact.",
        "Pick a few favorites and we’ll tailor the content for you.",
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    const top = categories.sort((a, b) => counts[b] - counts[a])[0];
    return `Because you explored ${top}, here are more items you might enjoy.`;
  },
};
