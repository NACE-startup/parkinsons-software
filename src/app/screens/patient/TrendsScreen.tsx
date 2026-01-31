import { useState } from "react";
import { motion } from "motion/react";
import { Info, Pill } from "lucide-react";
import { fadeIn } from "@/app/utils/motion";
import AnimatedLineChart from "@/app/components/LineChart";
import { mockEpisodes, groupEpisodesByDay } from "@/app/utils/data-store";
import { calculateStabilityScore } from "@/app/utils/stability-score";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export default function TrendsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [showMedication, setShowMedication] = useState(false);

  // Get data based on time range
  const getDaysForRange = (range: TimeRange) => {
    switch (range) {
      case "daily":
        return 1;
      case "weekly":
        return 7;
      case "monthly":
        return 30;
      case "yearly":
        return 365;
    }
  };

  const days = getDaysForRange(timeRange);
  const dailyData = groupEpisodesByDay(mockEpisodes, days);

  // Format data for charts
  const episodeCountData = dailyData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    episodes: d.count,
  }));

  const durationData = dailyData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    duration: d.avgDuration,
  }));

  const scoreData = dailyData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: calculateStabilityScore({ count: d.count, totalDuration: d.totalDuration }),
  }));

  // Calculate insight
  const avgEpisodes =
    dailyData.reduce((sum, d) => sum + d.count, 0) / dailyData.length;
  const peakHours = "6–8pm"; // Mock data

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <div className="max-w-[390px] mx-auto px-5 pt-12 pb-8">
        {/* Header */}
        <motion.h1
          {...fadeIn}
          className="text-[28px] leading-[36px] font-semibold text-[var(--text-1)] mb-8"
        >
          Trends
        </motion.h1>

        {/* Time range filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-5 px-5"
        >
          {(["daily", "weekly", "monthly", "yearly"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
                timeRange === range
                  ? "bg-[var(--accent-1)] text-white"
                  : "bg-[var(--surface-1)] text-[var(--text-1)] border border-[var(--border-1)]"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Episodes count chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-1">
                Episode Frequency
              </h2>
              <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                Episodes over time
              </p>
            </div>
          </div>

          <AnimatedLineChart
            data={episodeCountData}
            dataKey="episodes"
            xKey="date"
            color="var(--accent-1)"
          />
        </motion.div>

        {/* Average duration chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-1">
                Average Duration
              </h2>
              <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                Duration per episode (seconds)
              </p>
            </div>
          </div>

          <AnimatedLineChart
            data={durationData}
            dataKey="duration"
            xKey="date"
            color="var(--chart-2)"
          />
        </motion.div>

        {/* Stability score chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-1">
                Stability Score
              </h2>
              <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                Score over time
              </p>
            </div>
          </div>

          <AnimatedLineChart
            data={scoreData}
            dataKey="score"
            xKey="date"
            color="var(--success)"
          />
        </motion.div>

        {/* Medication overlay toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-2)] flex items-center justify-center">
                <Pill className="w-5 h-5 text-[var(--accent-1)]" />
              </div>
              <div>
                <h3 className="text-[14px] leading-[20px] font-semibold text-[var(--text-1)]">
                  Medication timing overlay
                </h3>
                <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                  Show on graphs
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMedication(!showMedication)}
              className={`relative w-[52px] h-[32px] rounded-full transition-colors ${
                showMedication ? "bg-[var(--accent-1)]" : "bg-[var(--switch-background)]"
              }`}
            >
              <motion.div
                className="absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm"
                animate={{ left: showMedication ? "22px" : "2px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        {/* Insights card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 bg-[var(--accent-2)] rounded-[24px] border border-[var(--accent-1)]/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-1)] flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] leading-[20px] font-semibold text-[var(--text-1)] mb-2">
                Pattern Insight
              </h3>
              <p className="text-[14px] leading-[20px] text-[var(--text-1)]">
                Most episodes occur between {peakHours}. Average of{" "}
                {avgEpisodes.toFixed(1)} episodes per day over the last {days} days.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
