import { mockPatientProfile, getPairedDevice, disconnectDevice, Device } from "@/app/utils/data-store";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qrCodeImage from "figma:asset/c96af0dd64ed6795d6069e7c9a4516961b320c6e.png";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [sharingEnabled, setSharingEnabled] = useState(mockPatientProfile.sharingEnabled);
  const [pairedDevice, setPairedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const device = getPairedDevice();
    setPairedDevice(device);
    
    const interval = setInterval(() => {
      const updatedDevice = getPairedDevice();
      setPairedDevice(updatedDevice);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDisconnectDevice = () => {
    disconnectDevice();
    setPairedDevice(null);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <div className="max-w-[390px] mx-auto px-5 pt-12 pb-8">
        {/* Header */}
        <motion.h1
          {...fadeIn}
          className="text-[28px] leading-[36px] font-semibold text-[var(--text-1)] mb-8"
        >
          Profile
        </motion.h1>

        {/* Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hover)] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-[20px] leading-[28px] font-semibold text-[var(--text-1)]">
                {mockPatientProfile.name}
              </h2>
              <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
                {calculateAge(mockPatientProfile.dateOfBirth)} years old • {mockPatientProfile.gender}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-1)] space-y-3">
            <div className="flex items-center justify-between text-[14px] leading-[20px]">
              <span className="text-[var(--text-2)]">Patient ID</span>
              <span className="font-medium text-[var(--text-1)]">{mockPatientProfile.id}</span>
            </div>
            <div className="flex items-center justify-between text-[14px] leading-[20px]">
              <span className="text-[var(--text-2)]">Date of Birth</span>
              <span className="font-medium text-[var(--text-1)]">
                {new Date(mockPatientProfile.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* QR Share Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-2)] flex items-center justify-center flex-shrink-0">
              <Share2 className="w-5 h-5 text-[var(--accent-1)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-1">
                Clinician Share Code
              </h3>
              <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
                Scan to link your data securely
              </p>
            </div>
          </div>

          <div className="flex justify-center py-4">
            <div className="p-4 bg-white rounded-[16px] shadow-sm">
              <img
                src={qrCodeImage}
                alt="Clinician share QR code"
                className="w-[180px] h-[180px]"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-1)]">
            <p className="text-[12px] leading-[16px] text-[var(--text-2)] text-center">
              Your clinician can scan this code to access your tracking data
            </p>
          </div>
        </motion.div>

        {/* Privacy Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-2)] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[var(--accent-1)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)]">
                Privacy & Sharing
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h4 className="text-[14px] leading-[20px] font-medium text-[var(--text-1)] mb-1">
                  Share data with clinician
                </h4>
                <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                  You can turn this off anytime
                </p>
              </div>
              <button
                onClick={() => setSharingEnabled(!sharingEnabled)}
                className={`relative w-[52px] h-[32px] rounded-full transition-colors ${
                  sharingEnabled ? "bg-[var(--accent-1)]" : "bg-[var(--switch-background)]"
                }`}
              >
                <motion.div
                  className="absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm"
                  animate={{ left: sharingEnabled ? "22px" : "2px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <button className="w-full h-[52px] rounded-[16px] bg-[var(--surface-2)] text-[var(--text-1)] flex items-center justify-between px-4 active:bg-[var(--accent-2)] transition-colors">
              <span className="text-[14px] font-medium">Download report (PDF)</span>
              <ChevronRight className="w-5 h-5 text-[var(--text-2)]" />
            </button>
          </div>
        </motion.div>

        {/* Device Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="p-6 bg-[var(--surface-1)] rounded-[24px] shadow-[var(--shadow-card)] mb-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-2)] flex items-center justify-center flex-shrink-0">
              <Bluetooth className="w-5 h-5 text-[var(--accent-1)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)]">
                Connected Device
              </h3>
            </div>
          </div>

          {pairedDevice ? (
            <div className="space-y-4">
              <div className="p-4 bg-[var(--bg-0)] rounded-[16px]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[14px] leading-[20px] font-medium text-[var(--text-1)]">
                      {pairedDevice.name}
                    </p>
                    <p className="text-[12px] leading-[16px] text-[var(--text-2)]">
                      ID: {pairedDevice.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[var(--surface-1)] rounded-full">
                    <Battery className={`w-4 h-4 ${pairedDevice.battery > 20 ? 'text-[var(--success)]' : 'text-[#F44336]'}`} />
                    <span className={`text-[12px] leading-[16px] font-medium ${pairedDevice.battery > 20 ? 'text-[var(--text-1)]' : 'text-[#F44336]'}`}>
                      {pairedDevice.battery}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                  <span className="text-[12px] leading-[16px] text-[var(--text-2)]">
                    Connected • Last sync: {pairedDevice.lastSyncAt ? new Date(pairedDevice.lastSyncAt).toLocaleTimeString() : 'Never'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleDisconnectDevice}
                className="w-full h-[52px] rounded-[16px] bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger)]/20 flex items-center justify-center gap-2 font-medium text-[14px] active:bg-[var(--danger)] active:text-white transition-colors"
              >
                Disconnect Device
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/patient/pair-device")}
              className="w-full h-[52px] rounded-[16px] bg-[var(--accent-1)] text-white flex items-center justify-center gap-2 font-medium text-[14px] shadow-[var(--shadow-button)] active:scale-[0.98] transition-all"
            >
              <Bluetooth className="w-5 h-5" />
              Connect New Device
            </button>
          )}
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-[14px] leading-[20px] font-medium text-[var(--text-2)]">
            Support
          </h3>

          <button className="w-full h-[52px] rounded-[16px] bg-[var(--surface-1)] text-[var(--text-1)] flex items-center justify-between px-4 shadow-[var(--shadow-sm)] active:bg-[var(--surface-2)] transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-[var(--text-2)]" />
              <span className="text-[14px] font-medium">Contact support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-2)]" />
          </button>

          <button className="w-full h-[52px] rounded-[16px] bg-[var(--surface-1)] text-[var(--text-1)] flex items-center justify-between px-4 shadow-[var(--shadow-sm)] active:bg-[var(--surface-2)] transition-colors">
            <span className="text-[14px] font-medium">Accessibility settings</span>
            <ChevronRight className="w-5 h-5 text-[var(--text-2)]" />
          </button>
        </motion.div>

        {/* Footer disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="text-[12px] leading-[16px] text-[var(--text-2)] text-center mt-12"
        >
          Not a diagnostic device. Intended to support symptom tracking and communication with care teams.
        </motion.p>
      </div>
    </div>
  );
}