import { fadeIn } from "@/app/utils/motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    }, 2000);

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
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      setPairingStatus("connected");
      // Store device info in localStorage
      if (discoveredDevice) {
        localStorage.setItem(
          "pairedDevice",
          JSON.stringify({
            ...discoveredDevice,
            pairedAt: new Date().toISOString(),
          })
        );
      }
    }, 2000);
  };

  const handleComplete = () => {
    navigate("/patient");
  };

  const getStatusIcon = () => {
    switch (pairingStatus) {
      case "scanning":
        return <Loader2 className="w-12 h-12 text-[var(--accent-1)] animate-spin" />;
      case "found":
        return <Bluetooth className="w-12 h-12 text-[var(--accent-1)]" />;
      case "connecting":
        return <Loader2 className="w-12 h-12 text-[var(--accent-1)] animate-spin" />;
      case "connected":
        return <CheckCircle className="w-12 h-12 text-[#4CAF50]" />;
      case "error":
        return <AlertCircle className="w-12 h-12 text-[#F44336]" />;
    }
  };

  const getStatusText = () => {
    switch (pairingStatus) {
      case "scanning":
        return "Scanning for devices...";
      case "found":
        return "Device found";
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Successfully connected!";
      case "error":
        return "Connection failed";
    }
  };

  const getStatusDescription = () => {
    switch (pairingStatus) {
      case "scanning":
        return "Make sure your sensor is powered on and nearby";
      case "found":
        return "We found your movement sensor";
      case "connecting":
        return "Establishing secure connection";
      case "connected":
        return "Your sensor is ready to track movement episodes";
      case "error":
        return "Please try again or contact support";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex flex-col">
      <div className="max-w-[390px] mx-auto px-5 pt-12 pb-8 flex-1 flex flex-col">
        {/* Header */}
        <motion.div {...fadeIn} className="mb-8">
          <h1 className="text-[28px] leading-[36px] font-semibold text-[var(--text-1)] mb-2">
            Connect Your Sensor
          </h1>
          <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
            Pair your wearable movement sensor to begin tracking
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="w-full p-8 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] text-center">
            {/* Icon */}
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-2)] flex items-center justify-center"
              animate={
                pairingStatus === "scanning" || pairingStatus === "connecting"
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getStatusIcon()}
            </motion.div>

            {/* Status Text */}
            <h2 className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)] mb-2">
              {getStatusText()}
            </h2>
            <p className="text-[14px] leading-[20px] text-[var(--text-2)] mb-6">
              {getStatusDescription()}
            </p>

            {/* Device Info (when found or connecting/connected) */}
            <AnimatePresence>
              {discoveredDevice && pairingStatus !== "scanning" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-[var(--border-1)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-left">
                      <p className="text-[14px] font-medium text-[var(--text-1)]">
                        {discoveredDevice.name}
                      </p>
                      <p className="text-[12px] text-[var(--text-2)]">ID: {discoveredDevice.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery className="w-5 h-5 text-[var(--accent-1)]" />
                      <span className="text-[14px] font-medium text-[var(--text-1)]">
                        {discoveredDevice.battery}%
                      </span>
                    </div>
                  </div>

                  {/* Signal Strength Indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[12px] text-[var(--text-2)]">Signal</span>
                    <div className="flex-1 h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--accent-1)] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${discoveredDevice.signalStrength}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[12px] font-medium text-[var(--text-1)]">
                      {discoveredDevice.signalStrength}%
                    </span>
                  </div>

                  {/* Connection Progress */}
                  {pairingStatus === "connecting" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4"
                    >
                      <div className="h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[var(--accent-1)] rounded-full"
                          style={{ width: `${progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                      <p className="text-[12px] text-[var(--text-2)] mt-2">{progress}%</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="space-y-3 mt-8"
        >
          {pairingStatus === "found" && (
            <button
              onClick={handleConnect}
              className="w-full h-[52px] rounded-[16px] bg-[var(--accent-1)] text-white font-medium text-[16px] shadow-[var(--shadow-button)] active:scale-[0.98] transition-all"
            >
              Connect Sensor
            </button>
          )}

          {pairingStatus === "connected" && (
            <button
              onClick={handleComplete}
              className="w-full h-[52px] rounded-[16px] bg-[var(--accent-1)] text-white font-medium text-[16px] shadow-[var(--shadow-button)] active:scale-[0.98] transition-all"
            >
              Continue to Dashboard
            </button>
          )}

          {(pairingStatus === "scanning" ||
            pairingStatus === "connecting" ||
            pairingStatus === "connected") && (
            <button
              onClick={() => navigate(-1)}
              className="w-full h-[52px] rounded-[16px] bg-[var(--surface-1)] text-[var(--text-1)] font-medium text-[16px] active:bg-[var(--surface-2)] transition-colors"
            >
              {pairingStatus === "connected" ? "Skip" : "Cancel"}
            </button>
          )}

          {pairingStatus === "error" && (
            <>
              <button
                onClick={() => {
                  setPairingStatus("scanning");
                  setTimeout(() => {
                    setDiscoveredDevice(mockDevice);
                    setPairingStatus("found");
                  }, 2000);
                }}
                className="w-full h-[52px] rounded-[16px] bg-[var(--accent-1)] text-white font-medium text-[16px] shadow-[var(--shadow-button)] active:scale-[0.98] transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full h-[52px] rounded-[16px] bg-[var(--surface-1)] text-[var(--text-1)] font-medium text-[16px] active:bg-[var(--surface-2)] transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-[12px] leading-[16px] text-[var(--text-2)] text-center mt-6"
        >
          Having trouble? Make sure Bluetooth is enabled and your sensor is charged.
        </motion.p>
      </div>
    </div>
  );
}