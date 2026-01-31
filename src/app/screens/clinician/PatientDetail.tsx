import { useState } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Phone, MessageCircle, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { fadeIn, scaleButton } from "@/app/utils/motion";
import AnimatedLineChart from "@/app/components/LineChart";
import ScoreRing from "@/app/components/ScoreRing";
import { mockClinicianPatients, mockEpisodes, groupEpisodesByDay } from "@/app/utils/data-store";
import { calculateStabilityScore } from "@/app/utils/stability-score";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export default function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [clinicalNote, setClinicalNote] = useState("");

  // Find patient
  const patient = mockClinicianPatients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center">
        <p className="text-[16px] text-[var(--text-2)]">Patient not found</p>
      </div>
    );
  }

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

  // Calculate summary metrics
  const avgEpisodesPerDay =
    dailyData.reduce((sum, d) => sum + d.count, 0) / dailyData.length;
  const avgDuration =
    dailyData.reduce((sum, d) => sum + d.avgDuration, 0) / dailyData.length;
  const totalFrozenTime =
    dailyData.reduce((sum, d) => sum + d.totalDuration, 0) / dailyData.length;

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

  const getTrendIcon = (trend: string) => {
    if (trend === "improving") return TrendingUp;
    if (trend === "worsening") return TrendingDown;
    return Minus;
  };

  const getTrendColor = (trend: string) => {
    if (trend === "improving") return "var(--success)";
    if (trend === "worsening") return "var(--warning)";
    return "var(--text-2)";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--accent-1)";
    if (score >= 40) return "var(--warning)";
    return "var(--danger)";
  };

  const TrendIcon = getTrendIcon(patient.trend);

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <div className="max-w-[390px] mx-auto px-5 pt-12 pb-8">
        {/* Header */}
        <motion.div {...fadeIn} className="mb-8">
          <button
            onClick={() => navigate("/clinician")}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[var(--surface-2)] transition-colors mb-4"
          >
            <ChevronLeft className="w-6 h-6 text-[var(--text-1)]" />
          </button>

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hover)] flex items-center justify-center">
                <span className="text-[20px] font-semibold text-white">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>

              <div>
                <h1 className="text-[24px] leading-[32px] font-semibold text-[var(--text-1)]">
                  {patient.name}
                </h1>
                <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
                  {patient.age} years old • ID: {patient.id}
                </p>
              </div>
            </div>
          </div>

          {/* Contact buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              className="h-[52px] rounded-[16px] bg-[var(--accent-1)] text-white flex items-center justify-center gap-2 shadow-[var(--shadow-button)] active:shadow-[var(--shadow-sm)] transition-shadow"
              {...scaleButton}
            >
              <Phone className="w-5 h-5" />
              <span className="text-[16px] font-semibold">Call</span>
            </motion.button>

            <motion.button
              className="h-[52px] rounded-[16px] bg-[var(--surface-1)] border border-[var(--border-1)] text-[var(--text-1)] flex items-center justify-center gap-2 active:bg-[var(--surface-2)] transition-colors"
              {...scaleButton}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-[16px] font-semibold">Message</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Score Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-1">
                Stability Score
              </h2>
              <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                7-day average
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                backgroundColor:
                  patient.trend === "improving"
                    ? "var(--success-bg)"
                    : patient.trend === "worsening"
                    ? "var(--warning-bg)"
                    : "var(--surface-2)",
              }}
            >
              <TrendIcon className="w-3.5 h-3.5" style={{ color: getTrendColor(patient.trend) }} />
              <span
                className="text-[12px] leading-[16px] font-medium capitalize"
                style={{ color: getTrendColor(patient.trend) }}
              >
                {patient.trend}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <ScoreRing score={patient.stabilityScore} size={120} strokeWidth={10} />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-1)]">
            <div className="text-center">
              <p className="text-[12px] leading-[16px] text-[var(--text-2)] mb-1">
                Episodes/day
              </p>
              <p className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)]">
                {avgEpisodesPerDay.toFixed(1)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[12px] leading-[16px] text-[var(--text-2)] mb-1">
                Avg duration
              </p>
              <p className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)]">
                {avgDuration.toFixed(1)}s
              </p>
            </div>
            <div className="text-center">
              <p className="text-[12px] leading-[16px] text-[var(--text-2)] mb-1">
                Total/day
              </p>
              <p className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)]">
                {totalFrozenTime.toFixed(1)}s
              </p>
            </div>
          </div>
        </motion.div>

        {/* Time range filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-5 px-5 sticky top-0 bg-[var(--bg-0)] pt-2 z-10"
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

        {/* Episodes chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-4">
            Episodes Over Time
          </h3>
          <AnimatedLineChart
            data={episodeCountData}
            dataKey="episodes"
            xKey="date"
            color="var(--accent-1)"
          />
        </motion.div>

        {/* Duration chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-4">
            Average Duration
          </h3>
          <AnimatedLineChart
            data={durationData}
            dataKey="duration"
            xKey="date"
            color="var(--chart-2)"
          />
        </motion.div>

        {/* Score trend chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-4">
            Stability Score Over Time
          </h3>
          <AnimatedLineChart
            data={scoreData}
            dataKey="score"
            xKey="date"
            color="var(--success)"
          />
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 bg-[var(--accent-2)] rounded-[24px] border border-[var(--accent-1)]/20 mb-6"
        >
          <h3 className="text-[14px] leading-[20px] font-semibold text-[var(--text-1)] mb-3">
            Pattern Insights
          </h3>
          <ul className="space-y-2 text-[14px] leading-[20px] text-[var(--text-1)]">
            <li>• Most common time window: 6–8pm</li>
            <li>• High turning-associated episodes</li>
            <li>• Pattern suggests time-of-day clustering</li>
          </ul>
        </motion.div>

        {/* Clinical note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[var(--accent-1)]" />
            <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)]">
              Clinical Note
            </h3>
          </div>

          <textarea
            value={clinicalNote}
            onChange={(e) => setClinicalNote(e.target.value)}
            placeholder="Add context (med change, PT, illness, travel)"
            className="w-full h-[100px] p-4 rounded-[16px] bg-[var(--bg-0)] border border-[var(--border-1)] text-[14px] leading-[20px] text-[var(--text-1)] placeholder:text-[var(--text-2)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)] transition-shadow"
          />

          <button className="w-full h-[44px] rounded-[12px] bg-[var(--accent-1)] text-white text-[14px] font-semibold mt-3 active:bg-[var(--accent-hover)] transition-colors">
            Save Note
          </button>
        </motion.div>

        {/* Footer disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[12px] leading-[16px] text-[var(--text-2)] text-center mt-8"
        >
          Data reflects device-based estimates; interpret in clinical context.
        </motion.p>
      </div>
    </div>
  );
}