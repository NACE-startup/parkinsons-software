import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, TrendingUp, TrendingDown, Minus, Info, Battery, Bluetooth, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ScoreRing from "@/app/components/ScoreRing";
import { fadeIn, scaleButton } from "@/app/utils/motion";
import {
  mockEpisodes,
  getEpisodesToday,
  getAverageDuration,
  getTotalDuration,
  getEpisodesInRange,
  getPairedDevice,
  Device,
} from "@/app/utils/data-store";
import { calculateStabilityScore, getScoreLabel } from "@/app/utils/stability-score";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";

export default function PatientHome() {
  const navigate = useNavigate();
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [pairedDevice, setPairedDevice] = useState<Device | null>(null);

  useEffect(() => {
    // Check for paired device on mount and update periodically
    const updateDevice = () => {
      const device = getPairedDevice();
      setPairedDevice(device);
    };
    
    updateDevice();
    const interval = setInterval(updateDevice, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Calculate today's data
  const todayEpisodes = getEpisodesToday(mockEpisodes);
  const todayCount = todayEpisodes.length;
  const todayAvgDuration = getAverageDuration(todayEpisodes);
  const todayTotalDuration = getTotalDuration(todayEpisodes);

  // Calculate stability score
  const stabilityScore = calculateStabilityScore({
    count: todayCount,
    totalDuration: todayTotalDuration,
  });
  const scoreLabel = getScoreLabel(stabilityScore);

  // Yesterday's comparison
  const yesterdayEpisodes = mockEpisodes.filter((ep) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const dayBefore = new Date(yesterday);
    dayBefore.setDate(dayBefore.getDate() + 1);

    return ep.timestamp >= yesterday && ep.timestamp < dayBefore;
  });
  const yesterdayCount = yesterdayEpisodes.length;
  const countDiff = todayCount - yesterdayCount;

  // Quick action tags
  const tags = ["Doorways", "Turning", "Crowds", "Stress", "Medication timing"];

  // Get current time greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <div className="max-w-[390px] mx-auto px-5 pt-12 pb-8">
        {/* Header */}
        <motion.div {...fadeIn} className="mb-8">
          <h1 className="text-[28px] leading-[36px] font-semibold text-[var(--text-1)] mb-2">
            {greeting}, Toshi
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--success-bg)] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
            <span className="text-[12px] leading-[16px] font-medium text-[var(--success)]">
              Tracking active
            </span>
          </div>
        </motion.div>

        {/* Device Status Card */}
        {pairedDevice ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="p-4 bg-[var(--surface-1)] rounded-[20px] shadow-[var(--shadow-sm)] mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-2)] flex items-center justify-center">
                  <Bluetooth className="w-5 h-5 text-[var(--accent-1)]" />
                </div>
                <div>
                  <p className="text-[14px] leading-[20px] font-medium text-[var(--text-1)]">
                    {pairedDevice.name}
                  </p>
                  <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                    Connected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-0)] rounded-full">
                <Battery className={`w-4 h-4 ${pairedDevice.battery > 20 ? 'text-[var(--success)]' : 'text-[#F44336]'}`} />
                <span className={`text-[12px] leading-[16px] font-medium ${pairedDevice.battery > 20 ? 'text-[var(--text-1)]' : 'text-[#F44336]'}`}>
                  {pairedDevice.battery}%
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            onClick={() => navigate("/patient/pair-device")}
            className="w-full p-4 bg-[var(--accent-2)] rounded-[20px] mb-6 flex items-center justify-between active:bg-[var(--accent-1)]/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[var(--accent-1)]" />
              </div>
              <div className="text-left">
                <p className="text-[14px] leading-[20px] font-medium text-[var(--text-1)]">
                  Connect your sensor
                </p>
                <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                  Tap to pair your device
                </p>
              </div>
            </div>
            <Plus className="w-5 h-5 text-[var(--accent-1)]" />
          </motion.button>
        )}

        {/* Freezing Frequency Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[14px] leading-[20px] text-[var(--text-2)] mb-1">
                Movement Episodes Today
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-[34px] leading-[40px] font-semibold text-[var(--text-1)]">
                  {todayCount}
                </span>
                <span className="text-[16px] leading-[24px] text-[var(--text-2)]">
                  episodes
                </span>
              </div>
            </div>

            {/* Trend indicator */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                countDiff > 0
                  ? "bg-[var(--warning-bg)]"
                  : countDiff < 0
                  ? "bg-[var(--success-bg)]"
                  : "bg-[var(--surface-2)]"
              }`}
            >
              {countDiff > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-[var(--warning)]" />
              ) : countDiff < 0 ? (
                <TrendingDown className="w-3.5 h-3.5 text-[var(--success)]" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-[var(--text-2)]" />
              )}
              <span
                className={`text-[12px] leading-[16px] font-medium ${
                  countDiff > 0
                    ? "text-[var(--warning)]"
                    : countDiff < 0
                    ? "text-[var(--success)]"
                    : "text-[var(--text-2)]"
                }`}
              >
                {countDiff > 0 ? `+${countDiff}` : countDiff === 0 ? "0" : countDiff}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-1)]">
            <div className="flex items-center justify-between text-[14px] leading-[20px]">
              <span className="text-[var(--text-2)]">Avg duration</span>
              <span className="font-medium text-[var(--text-1)]">{todayAvgDuration}s</span>
            </div>
          </div>
        </motion.div>

        {/* Stability Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-[14px] leading-[20px] text-[var(--text-2)] mb-1">
                Stability Score
              </h2>
              <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                Higher is better
              </p>
            </div>
            <button
              onClick={() => setShowScoreInfo(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center active:bg-[var(--surface-2)] transition-colors"
            >
              <Info className="w-5 h-5 text-[var(--text-2)]" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <ScoreRing score={stabilityScore} />
            <p className="text-[16px] leading-[24px] font-medium text-[var(--text-1)] mt-4">
              {scoreLabel}
            </p>
            <p className="text-[14px] leading-[20px] text-[var(--text-2)] text-center mt-2 max-w-[260px]">
              Your score reflects episode frequency and duration
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="space-y-3 mb-6"
        >
          <h3 className="text-[14px] leading-[20px] font-medium text-[var(--text-2)]">
            Quick Actions
          </h3>

          <button
            onClick={() => navigate("/patient/tracking")}
            className="w-full h-[56px] rounded-[16px] bg-[var(--accent-1)] text-white flex items-center justify-center gap-2 shadow-[var(--shadow-button)] active:shadow-[var(--shadow-sm)] transition-shadow"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            <span className="text-[16px] font-semibold">Start Tracking</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              className="h-[56px] rounded-[16px] bg-[var(--surface-1)] border border-[var(--border-1)] flex items-center justify-center gap-2 active:bg-[var(--surface-2)] transition-colors"
              {...scaleButton}
            >
              <Plus className="w-5 h-5 text-[var(--text-1)]" />
              <span className="text-[16px] font-semibold text-[var(--text-1)]">
                Log Episode
              </span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/patient/trends")}
              className="h-[56px] rounded-[16px] bg-[var(--surface-1)] border border-[var(--border-1)] flex items-center justify-center gap-2 active:bg-[var(--surface-2)] transition-colors"
              {...scaleButton}
            >
              <TrendingUp className="w-5 h-5 text-[var(--text-1)]" />
              <span className="text-[16px] font-semibold text-[var(--text-1)]">
                View Trends
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Today's Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)]"
        >
          <h3 className="text-[14px] leading-[20px] font-medium text-[var(--text-2)] mb-4">
            Today's Notes
          </h3>
          <p className="text-[14px] leading-[20px] text-[var(--text-2)] mb-4">
            Tag common triggers to identify patterns:
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 rounded-full bg-[var(--surface-2)] text-[14px] font-medium text-[var(--text-1)] active:bg-[var(--accent-2)] active:text-[var(--accent-1)] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Score Info Dialog */}
      <Dialog open={showScoreInfo} onOpenChange={setShowScoreInfo}>
        <DialogContent className="max-w-[350px] rounded-[24px] p-6">
          <DialogHeader>
            <DialogTitle className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)]">
              What this score means
            </DialogTitle>
            <DialogDescription className="sr-only">
              Information about the stability score and how to interpret it
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-[14px] leading-[20px] text-[var(--text-1)]">
              The Stability Score summarizes your recent tracking into one number. It's
              calculated from episode frequency and duration.
            </p>

            <div className="p-4 bg-[var(--accent-2)] rounded-[16px]">
              <h4 className="text-[14px] leading-[20px] font-semibold text-[var(--text-1)] mb-2">
                What it does NOT mean
              </h4>
              <ul className="space-y-1 text-[14px] leading-[20px] text-[var(--text-1)]">
                <li>• This score does not diagnose Parkinson's disease</li>
                <li>• This score is not a medical decision on its own</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] leading-[20px] font-semibold text-[var(--text-1)] mb-2">
                How to use it
              </h4>
              <ul className="space-y-1 text-[14px] leading-[20px] text-[var(--text-2)]">
                <li>• Compare your score across days, not minute-to-minute</li>
                <li>• Look for patterns around routines or medication timing</li>
                <li>• Share trends with your clinician</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}