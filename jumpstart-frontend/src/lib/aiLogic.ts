export interface Item {
  id: string;
  title: string;
  img: string;
  category: string;
}

class AIPersonalization {
  private interactions: Record<string, number> = {};

  constructor() {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("aiInteractions");
      if (data) this.interactions = JSON.parse(data);
    }
  }

  recordInteraction(category: string) {
    this.interactions[category] = (this.interactions[category] || 0) + 1;
    localStorage.setItem("aiInteractions", JSON.stringify(this.interactions));
  }

  getWeights(items: Item[]) {
    const total = Object.values(this.interactions).reduce((a, b) => a + b, 0);
    const weights: Record<string, number> = {};

    items.forEach((item) => {
      const cat = item.category || "other";
      const pref = this.interactions[cat] || 1;
      weights[cat] = total > 0 ? pref / total : 1 / items.length;
    });

    return weights;
  }

  sortItemsByPreference(items: Item[], weights: Record<string, number>) {
    return items.sort((a, b) => {
      const wa = weights[a.category] || 0;
      const wb = weights[b.category] || 0;
      return wb - wa;
    });
  }

  getRecommendationText() {
    const sorted = Object.entries(this.interactions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (sorted.length === 0) return "AI is still learning your preferences...";
    return `AI suggests more about ${sorted.map(([c]) => c).join(", ")}.`;
  }

  getPreferenceSummary() {
    return Object.entries(this.interactions).map(([cat, val]) => ({
      category: cat,
      score: val,
    }));
  }
}

export const aiPersonalization = new AIPersonalization();
