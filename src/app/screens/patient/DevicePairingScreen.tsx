import { fadeIn, scaleButton } from "@/app/utils/motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Bluetooth,
  BluetoothSearching,
  CheckCircle,
  AlertCircle,
  Battery,
  Signal,
  ChevronLeft,
  Loader2,
  Zap,
  Radio,
} from "lucide-react";

type PairingStatus = "scanning" | "found" | "connecting" | "connected" | "error";

interface Device {
  id: string;
  name: string;
  battery: number;
  signalStrength: number;
}

const mockDevice: Device = {
  id: "FOG-SENSOR-4A2B",
  name: "FOG Sensor 4A2B",
  battery: 87,
  signalStrength: 85,
};

export default function DevicePairingScreen() {
  const navigate = useNavigate();
  const [pairingStatus, setPairingStatus] = useState<PairingStatus>("scanning");
  const [discoveredDevice, setDiscoveredDevice] = useState<Device | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate device discovery
    const scanTimer = setTimeout(() => {
      setDiscoveredDevice(mockDevice);
      setPairingStatus("found");
    }, 3000);

    return () => clearTimeout(scanTimer);
  }, []);

  const handleConnect = () => {
    setPairingStatus("connecting");
    setProgress(0);

    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      setPairingStatus("connected");
      // Store device info in localStorage
      if (discoveredDevice) {
        localStorage.setItem(
          "pairedDevice",
          JSON.stringify({
            ...discoveredDevice,
            isConnected: true,
            pairedAt: new Date().toISOString(),
            lastSyncAt: new Date().toISOString(),
          })
        );
      }
    }, 2500);
  };

  const handleComplete = () => {
    navigate("/patient");
  };

  const handleRetry = () => {
    setPairingStatus("scanning");
    setDiscoveredDevice(null);
    setProgress(0);
    
    setTimeout(() => {
      setDiscoveredDevice(mockDevice);
      setPairingStatus("found");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-0)] via-[var(--bg-0)] to-[var(--accent-2)]/30 flex flex-col">
      <div className="max-w-[390px] mx-auto px-5 pt-12 pb-8 flex-1 flex flex-col w-full">
        {/* Header */}
        <motion.div {...fadeIn} className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[var(--surface-1)] flex items-center justify-center active:bg-[var(--surface-2)] transition-colors shadow-[var(--shadow-sm)]"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-1)]" />
          </button>
          <div>
            <h1 className="text-[24px] leading-[32px] font-semibold text-[var(--text-1)]">
              Connect Sensor
            </h1>
            <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
              Pair your FOG movement sensor
            </p>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          {/* Scanning Animation */}
          <AnimatePresence mode="wait">
            {pairingStatus === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative flex items-center justify-center mb-8"
              >
                {/* Radar rings */}
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute rounded-full border-2 border-[var(--accent-1)]/20"
                    style={{
                      width: `${80 + ring * 50}px`,
                      height: `${80 + ring * 50}px`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: [0.6, 0],
                      scale: [1, 1.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: ring * 0.4,
                      ease: "easeOut",
                    }}
                  />
                ))}
                
                {/* Center icon */}
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hover)] flex items-center justify-center shadow-lg z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BluetoothSearching className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>
            )}

            {(pairingStatus === "found" || pairingStatus === "connecting") && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full mb-8"
              >
                {/* Device Card */}
                <div className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] border border-[var(--border-1)]">
                  {/* Device Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <motion.div
                      className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hover)] flex items-center justify-center shadow-md"
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Radio className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-[18px] leading-[24px] font-semibold text-[var(--text-1)] mb-1">
                        {discoveredDevice?.name}
                      </h3>
                      <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
                        ID: {discoveredDevice?.id}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                        <span className="text-[12px] text-[var(--success)] font-medium">
                          Ready to connect
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Device Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="p-4 bg-[var(--bg-0)] rounded-[16px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Battery className="w-4 h-4 text-[var(--success)]" />
                        <span className="text-[12px] text-[var(--text-2)]">Battery</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[24px] font-semibold text-[var(--text-1)]">
                          {discoveredDevice?.battery}
                        </span>
                        <span className="text-[14px] text-[var(--text-2)]">%</span>
                      </div>
                    </div>
                    <div className="p-4 bg-[var(--bg-0)] rounded-[16px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Signal className="w-4 h-4 text-[var(--accent-1)]" />
                        <span className="text-[12px] text-[var(--text-2)]">Signal</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[24px] font-semibold text-[var(--text-1)]">
                          {discoveredDevice?.signalStrength}
                        </span>
                        <span className="text-[14px] text-[var(--text-2)]">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Connection Progress */}
                  {pairingStatus === "connecting" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-4 border-t border-[var(--border-1)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-[var(--text-2)]">Connecting...</span>
                        <span className="text-[14px] font-medium text-[var(--accent-1)]">{progress}%</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-0)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-hover)] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {pairingStatus === "connected" && (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center mb-8"
              >
                <motion.div
                  className="w-28 h-28 rounded-full bg-[var(--success-bg)] flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  >
                    <CheckCircle className="w-14 h-14 text-[var(--success)]" strokeWidth={1.5} />
                  </motion.div>
                </motion.div>
                
                <motion.h2
                  className="text-[24px] leading-[32px] font-semibold text-[var(--text-1)] text-center mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Successfully Connected!
                </motion.h2>
                
                <motion.p
                  className="text-[14px] leading-[20px] text-[var(--text-2)] text-center max-w-[280px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Your FOG sensor is now paired and ready to track movement episodes
                </motion.p>

                <motion.div
                  className="flex items-center gap-2 mt-4 px-4 py-2 bg-[var(--success-bg)] rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Zap className="w-4 h-4 text-[var(--success)]" />
                  <span className="text-[12px] font-medium text-[var(--success)]">
                    Live tracking enabled
                  </span>
                </motion.div>
              </motion.div>
            )}

            {pairingStatus === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center mb-8"
              >
                <motion.div
                  className="w-28 h-28 rounded-full bg-[var(--danger-bg)] flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <AlertCircle className="w-14 h-14 text-[var(--danger)]" strokeWidth={1.5} />
                </motion.div>
                
                <h2 className="text-[24px] leading-[32px] font-semibold text-[var(--text-1)] text-center mb-2">
                  Connection Failed
                </h2>
                
                <p className="text-[14px] leading-[20px] text-[var(--text-2)] text-center max-w-[280px]">
                  We couldn't connect to your sensor. Please make sure it's powered on and nearby.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Text for Scanning */}
          {pairingStatus === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)] mb-2">
                Searching for sensors...
              </h2>
              <p className="text-[14px] leading-[20px] text-[var(--text-2)] max-w-[280px]">
                Make sure your sensor is powered on and Bluetooth is enabled
              </p>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="space-y-3"
        >
          {pairingStatus === "found" && (
            <motion.button
              onClick={handleConnect}
              className="w-full h-[56px] rounded-[16px] bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-hover)] text-white font-semibold text-[16px] shadow-[var(--shadow-button)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              {...scaleButton}
            >
              <Bluetooth className="w-5 h-5" />
              Connect Sensor
            </motion.button>
          )}

          {pairingStatus === "connected" && (
            <motion.button
              onClick={handleComplete}
              className="w-full h-[56px] rounded-[16px] bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-hover)] text-white font-semibold text-[16px] shadow-[var(--shadow-button)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              {...scaleButton}
            >
              <CheckCircle className="w-5 h-5" />
              Continue to Dashboard
            </motion.button>
          )}

          {pairingStatus === "error" && (
            <motion.button
              onClick={handleRetry}
              className="w-full h-[56px] rounded-[16px] bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-hover)] text-white font-semibold text-[16px] shadow-[var(--shadow-button)] active:scale-[0.98] transition-all"
              {...scaleButton}
            >
              Try Again
            </motion.button>
          )}

          {(pairingStatus === "scanning" || pairingStatus === "connecting") && (
            <button
              onClick={() => navigate(-1)}
              className="w-full h-[56px] rounded-[16px] bg-[var(--surface-1)] text-[var(--text-1)] font-medium text-[16px] border border-[var(--border-1)] active:bg-[var(--surface-2)] transition-colors"
            >
              Cancel
            </button>
          )}

          {(pairingStatus === "found" || pairingStatus === "error") && (
            <button
              onClick={() => navigate(-1)}
              className="w-full h-[56px] rounded-[16px] bg-[var(--surface-1)] text-[var(--text-1)] font-medium text-[16px] border border-[var(--border-1)] active:bg-[var(--surface-2)] transition-colors"
            >
              Cancel
            </button>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-6 p-4 bg-[var(--surface-1)] rounded-[16px] border border-[var(--border-1)]"
        >
          <h4 className="text-[14px] font-medium text-[var(--text-1)] mb-2">
            Troubleshooting Tips
          </h4>
          <ul className="space-y-2 text-[12px] leading-[18px] text-[var(--text-2)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-1)]">•</span>
              Ensure Bluetooth is enabled on your device
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-1)]">•</span>
              Keep the sensor within 3 feet of your phone
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-1)]">•</span>
              Press the sensor button to wake it from sleep
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
