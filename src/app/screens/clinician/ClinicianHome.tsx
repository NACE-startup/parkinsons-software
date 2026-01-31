import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, TrendingDown, Minus, ChevronLeft } from "lucide-react";
import { fadeIn, scaleButton } from "@/app/utils/motion";
import { mockClinicianPatients } from "@/app/utils/data-store";

type FilterType = "all" | "high-risk" | "new" | "worsening";

export default function ClinicianHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredPatients = mockClinicianPatients.filter((patient) => {
    // Search filter
    if (searchQuery && !patient.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filter === "high-risk" && patient.stabilityScore >= 60) return false;
    if (filter === "worsening" && patient.trend !== "worsening") return false;

    return true;
  });

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

  const getTrendBg = (trend: string) => {
    if (trend === "improving") return "var(--success-bg)";
    if (trend === "worsening") return "var(--warning-bg)";
    return "var(--surface-2)";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--accent-1)";
    if (score >= 40) return "var(--warning)";
    return "var(--danger)";
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <div className="max-w-[390px] mx-auto px-5 pt-12 pb-8">
        {/* Header */}
        <motion.div {...fadeIn} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[var(--surface-2)] transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-[var(--text-1)]" />
            </button>
            <h1 className="text-[28px] leading-[36px] font-semibold text-[var(--text-1)]">
              Patients
            </h1>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-2)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients..."
              className="w-full h-[52px] pl-12 pr-4 rounded-[16px] bg-[var(--surface-1)] border border-[var(--border-1)] text-[16px] text-[var(--text-1)] placeholder:text-[var(--text-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)] transition-shadow"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-5 px-5"
        >
          {[
            { id: "all" as FilterType, label: "All" },
            { id: "high-risk" as FilterType, label: "High Risk" },
            { id: "worsening" as FilterType, label: "Trending Worse" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
                filter === item.id
                  ? "bg-[var(--accent-1)] text-white"
                  : "bg-[var(--surface-1)] text-[var(--text-1)] border border-[var(--border-1)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </motion.div>

        {/* Patient list */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredPatients.map((patient, index) => {
            const TrendIcon = getTrendIcon(patient.trend);

            return (
              <motion.button
                key={patient.id}
                onClick={() => navigate(`/clinician/patient/${patient.id}`)}
                className="w-full p-5 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] text-left active:bg-[var(--surface-2)] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                {...scaleButton}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hover)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[16px] font-semibold text-white">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>

                    {/* Name and age */}
                    <div>
                      <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)]">
                        {patient.name}
                      </h3>
                      <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
                        {patient.age} years old
                      </p>
                    </div>
                  </div>

                  {/* Stability score */}
                  <div className="text-right">
                    <div
                      className="text-[24px] leading-[32px] font-semibold mb-0.5"
                      style={{ color: getScoreColor(patient.stabilityScore) }}
                    >
                      {patient.stabilityScore}
                    </div>
                    <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                      Score
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-[12px] leading-[16px] text-[var(--text-2)] mb-0.5">
                      Episodes/day
                    </p>
                    <p className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)]">
                      {patient.episodesPerDay}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] leading-[16px] text-[var(--text-2)] mb-0.5">
                      Avg duration
                    </p>
                    <p className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)]">
                      {patient.avgDuration}s
                    </p>
                  </div>
                </div>

                {/* Trend and timestamp */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-1)]">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: getTrendBg(patient.trend) }}
                  >
                    <TrendIcon
                      className="w-3.5 h-3.5"
                      style={{ color: getTrendColor(patient.trend) }}
                    />
                    <span
                      className="text-[12px] leading-[16px] font-medium capitalize"
                      style={{ color: getTrendColor(patient.trend) }}
                    >
                      {patient.trend}
                    </span>
                  </div>

                  <span className="text-[12px] leading-[16px] text-[var(--text-2)]">
                    Updated {formatTimeAgo(patient.lastUpdated)}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Empty state */}
        {filteredPatients.length === 0 && (
          <motion.div
            className="py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[16px] leading-[24px] text-[var(--text-2)]">
              No patients found
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}