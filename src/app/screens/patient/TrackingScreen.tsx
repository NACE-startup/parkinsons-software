import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Pause, Square, Activity, Clock, Battery, Bluetooth } from "lucide-react";
import { fadeIn, scaleButton } from "@/app/utils/motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/app/components/ui/dialog";
import { getPairedDevice, Device } from "@/app/utils/data-store";

export default function TrackingScreen() {
  const navigate = useNavigate();
  const [isTracking, setIsTracking] = useState(true); // Start tracking by default
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [episodesDetected, setEpisodesDetected] = useState(3);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [pairedDevice, setPairedDevice] = useState<Device | null>(null);
  const [recentEpisodes, setRecentEpisodes] = useState([
    { time: "14:23", duration: 5 },
    { time: "15:47", duration: 8 },
    { time: "16:12", duration: 4 },
  ]);

  // Check for device and update status
  useEffect(() => {
    const device = getPairedDevice();
    setPairedDevice(device);
    
    // Update device status periodically
    const interval = setInterval(() => {
      const updatedDevice = getPairedDevice();
      setPairedDevice(updatedDevice);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTracking && !isPaused) {
      const interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setShowStopDialog(false);
    // Navigate back to home after showing success message
    setTimeout(() => {
      navigate("/patient");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex flex-col">
      <div className="max-w-[390px] mx-auto w-full px-5 pt-12 pb-8 flex-1 flex flex-col">
        {/* Header */}
        <motion.div {...fadeIn} className="mb-8 relative z-10">
          <h1 className="text-[28px] leading-[36px] font-semibold text-[var(--text-1)] mb-2">
            Tracking
          </h1>
          <p className="text-[16px] leading-[24px] text-[var(--text-2)]">
            Recording movement data
          </p>
        </motion.div>

        {/* Device Status (if connected) */}
        {pairedDevice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="p-4 bg-[var(--surface-1)] rounded-[20px] shadow-[var(--shadow-sm)] mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-2)] flex items-center justify-center">
                  <Bluetooth className="w-4 h-4 text-[var(--accent-1)]" />
                </div>
                <div>
                  <p className="text-[12px] leading-[16px] font-medium text-[var(--text-1)]">
                    {pairedDevice.name}
                  </p>
                  <p className="text-[10px] leading-[14px] text-[var(--text-2)]">
                    Connected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[var(--bg-0)] rounded-full">
                <Battery className={`w-4 h-4 ${pairedDevice.battery > 20 ? 'text-[var(--success)]' : 'text-[#F44336]'}`} />
                <span className={`text-[12px] leading-[16px] font-medium ${pairedDevice.battery > 20 ? 'text-[var(--text-1)]' : 'text-[#F44336]'}`}>
                  {pairedDevice.battery}%
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main tracking display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          {/* Animated waveform/pulse */}
          <div className="relative mb-8 flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hover)] flex items-center justify-center shadow-[var(--shadow-card)] z-10"
              animate={{
                scale: isPaused ? 1 : [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Activity className="w-16 h-16 text-white" strokeWidth={2.5} />
            </motion.div>

            {/* Pulse rings */}
            {!isPaused && (
              <>
                <motion.div
                  className="absolute w-32 h-32 rounded-full border-2 border-[var(--accent-1)]"
                  animate={{
                    scale: [1, 1.6, 1.6],
                    opacity: [0.6, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute w-32 h-32 rounded-full border-2 border-[var(--accent-1)]"
                  animate={{
                    scale: [1, 1.6, 1.6],
                    opacity: [0.6, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </>
            )}
          </div>

          {/* Session timer */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-[48px] leading-[56px] font-semibold text-[var(--text-1)] mb-2 tabular-nums">
              {formatTime(sessionTime)}
            </div>
            <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
              Session duration
            </p>
          </motion.div>

          {/* Episodes detected */}
          <motion.div
            className="px-6 py-4 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <div className="text-center px-4">
                <div className="text-[28px] leading-[36px] font-semibold text-[var(--accent-1)] mb-1">
                  {episodesDetected}
                </div>
                <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                  Episodes detected
                </p>
              </div>
              <div className="w-px h-12 bg-[var(--border-1)]" />
              <div className="text-center px-4">
                <div className="flex items-center gap-1 text-[14px] leading-[20px] font-medium text-[var(--success)] mb-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                  Good
                </div>
                <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                  Signal quality
                </p>
              </div>
            </div>
          </motion.div>

          {/* Status indicator */}
          <motion.p
            className="text-[14px] leading-[20px] text-[var(--text-2)] mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isPaused ? "Paused" : "Movement steady"}
          </motion.p>
        </motion.div>

        {/* Recent episodes timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] leading-[20px] font-medium text-[var(--text-2)]">
              Last 60 min
            </h3>
            <button className="text-[14px] leading-[20px] font-medium text-[var(--accent-1)]">
              View all
            </button>
          </div>

          <div className="space-y-2">
            {recentEpisodes.map((episode, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-3 bg-[var(--surface-1)] rounded-[16px]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-[var(--accent-2)] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[var(--accent-1)]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] leading-[20px] font-medium text-[var(--text-1)]">
                    Episode at {episode.time}
                  </p>
                </div>
                <span className="text-[12px] leading-[16px] text-[var(--text-2)] font-medium">
                  {episode.duration}s
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Control buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              className={`h-[56px] rounded-[16px] flex items-center justify-center gap-2 font-semibold text-[16px] transition-colors ${
                isPaused
                  ? "bg-[var(--accent-1)] text-white shadow-[var(--shadow-button)]"
                  : "bg-[var(--surface-1)] text-[var(--text-1)] border border-[var(--border-1)]"
              }`}
              onClick={() => setIsPaused(!isPaused)}
              {...scaleButton}
            >
              {isPaused ? (
                <>
                  <Activity className="w-5 h-5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              )}
            </motion.button>

            <motion.button
              className="h-[56px] rounded-[16px] bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger)]/20 flex items-center justify-center gap-2 font-semibold text-[16px] active:bg-[var(--danger)] active:text-white transition-colors"
              onClick={() => setShowStopDialog(true)}
              {...scaleButton}
            >
              <Square className="w-4 h-4" fill="currentColor" />
              Stop
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Stop confirmation dialog */}
      <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <DialogContent className="max-w-[350px] rounded-[24px] p-6">
          <DialogHeader>
            <DialogTitle className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)]">
              Stop tracking?
            </DialogTitle>
            <DialogDescription className="sr-only">
              Confirm if you want to stop the current tracking session
            </DialogDescription>
          </DialogHeader>

          <p className="text-[14px] leading-[20px] text-[var(--text-2)] mt-4">
            Your session data will be saved. You can start a new tracking session anytime.
          </p>

          <DialogFooter className="mt-6 flex gap-3">
            <button
              onClick={() => setShowStopDialog(false)}
              className="flex-1 h-[52px] rounded-[16px] bg-[var(--surface-1)] text-[var(--text-1)] font-semibold border border-[var(--border-1)] active:bg-[var(--surface-2)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStopTracking}
              className="flex-1 h-[52px] rounded-[16px] bg-[var(--danger)] text-white font-semibold active:bg-[var(--danger-hover)] transition-colors shadow-[var(--shadow-button)]"
            >
              Stop
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success overlay when stopped */}
      <AnimatePresence>
        {!isTracking && (
          <motion.div
            className="fixed inset-0 bg-[var(--bg-0)] flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-20 h-20 rounded-full bg-[var(--success)] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-card)]">
                <Square className="w-10 h-10 text-white" fill="white" />
              </div>
              <h3 className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)] mb-2">
                Session saved
              </h3>
              <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
                Returning to dashboard...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}