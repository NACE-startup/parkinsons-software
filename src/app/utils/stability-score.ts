/**
 * Stability Score calculation
 * Formula: score = 100 * exp(-burden / k)
 * where burden = wN * N + wT * D_total
 */

interface EpisodeData {
  count: number; // N: number of episodes
  totalDuration: number; // D_total: sum of durations in seconds
}

const WEIGHT_COUNT = 6; // wN: weight for episode count
const WEIGHT_DURATION = 0.8; // wT: weight for total duration
const SATURATION_CONSTANT = 60; // k: controls score drop rate

export function calculateStabilityScore(episodes: EpisodeData): number {
  const burden = WEIGHT_COUNT * episodes.count + WEIGHT_DURATION * episodes.totalDuration;
  const score = 100 * Math.exp(-burden / SATURATION_CONSTANT);
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#6BA86F"; // soft green
  if (score >= 60) return "#4A9B8E"; // muted teal
  if (score >= 40) return "#D9984F"; // amber
  return "#C85A54"; // caution
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs attention";
}

export function getTrendIndicator(current: number, previous: number): {
  icon: "up" | "down" | "stable";
  text: string;
  color: string;
} {
  const diff = current - previous;
  
  if (Math.abs(diff) < 3) {
    return { icon: "stable", text: "Stable", color: "#6C6C70" };
  }
  
  if (diff > 0) {
    return { icon: "up", text: `+${diff}`, color: "#6BA86F" };
  }
  
  return { icon: "down", text: `${diff}`, color: "#D9984F" };
}
