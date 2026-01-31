import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { fadeIn, scaleButton } from "@/app/utils/motion";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-gradient-to-b from-[var(--bg-0)] to-[var(--surface-1)]">
      <motion.div
        className="w-full max-w-[390px] flex flex-col items-center"
        {...fadeIn}
      >
        {/* Logo/Icon */}
        <motion.div
          className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hover)] flex items-center justify-center mb-8 shadow-[var(--shadow-card)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Activity className="w-12 h-12 text-white" strokeWidth={2.5} />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-[28px] leading-[36px] font-semibold text-[var(--text-1)] text-center mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          Movement Tracking
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-[16px] leading-[24px] text-[var(--text-2)] text-center mb-12 max-w-[300px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          Track movement episodes and share insights with care teams.
        </motion.p>

        {/* Role Selection Buttons */}
        <motion.div
          className="w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <motion.button
            className="w-full h-[56px] rounded-[16px] bg-[var(--accent-1)] text-white text-[16px] font-semibold shadow-[var(--shadow-button)] active:shadow-[var(--shadow-sm)] transition-shadow"
            onClick={() => navigate("/patient-onboarding")}
            {...scaleButton}
          >
            I'm a Patient
          </motion.button>

          <motion.button
            className="w-full h-[56px] rounded-[16px] bg-[var(--surface-1)] text-[var(--text-1)] text-[16px] font-semibold border border-[var(--border-1)] active:bg-[var(--surface-2)] transition-colors"
            onClick={() => navigate("/clinician")}
            {...scaleButton}
          >
            I'm a Clinician
          </motion.button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-[12px] leading-[16px] text-[var(--text-2)] text-center mt-16 max-w-[320px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          Not a diagnostic device. Intended to support symptom tracking and communication with care teams.
        </motion.p>
      </motion.div>
    </div>
  );
}