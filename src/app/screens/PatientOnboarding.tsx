import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";
import { fadeIn, scaleButton, slideUp } from "@/app/utils/motion";

const STEPS = [
  { id: "consent", title: "Welcome", subtitle: "Let's get you started" },
  { id: "info", title: "About You", subtitle: "Help us personalize your experience" },
  { id: "preferences", title: "Preferences", subtitle: "Set your tracking preferences" },
  { id: "complete", title: "You're Set", subtitle: "Ready to start tracking" },
];

export default function PatientOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    caregiverEnabled: false,
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding, navigate to patient home
      navigate("/patient");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex flex-col">
      {/* Header with progress */}
      <div className="px-5 pt-12 pb-6">
        <div className="max-w-[390px] mx-auto">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[var(--surface-2)] transition-colors mb-6"
          >
            <ChevronLeft className="w-6 h-6 text-[var(--text-1)]" />
          </button>

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className="h-1 flex-1 rounded-full bg-[var(--surface-2)] overflow-hidden"
              >
                <motion.div
                  className="h-full bg-[var(--accent-1)]"
                  initial={{ width: 0 }}
                  animate={{ width: index <= currentStep ? "100%" : "0%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>

          <motion.h1
            key={`title-${currentStep}`}
            className="text-[28px] leading-[36px] font-semibold text-[var(--text-1)] mb-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {STEPS[currentStep].title}
          </motion.h1>

          <motion.p
            key={`subtitle-${currentStep}`}
            className="text-[16px] leading-[24px] text-[var(--text-2)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {STEPS[currentStep].subtitle}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8">
        <div className="max-w-[390px] mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && <ConsentStep key="consent" />}
            {currentStep === 1 && (
              <InfoStep key="info" formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 2 && (
              <PreferencesStep key="preferences" formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 3 && <CompleteStep key="complete" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer button */}
      <div className="px-5 pb-8">
        <div className="max-w-[390px] mx-auto">
          <motion.button
            className="w-full h-[56px] rounded-[16px] bg-[var(--accent-1)] text-white text-[16px] font-semibold shadow-[var(--shadow-button)] active:shadow-[var(--shadow-sm)] transition-shadow"
            onClick={handleNext}
            {...scaleButton}
          >
            {currentStep === STEPS.length - 1 ? "Get Started" : "Continue"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function ConsentStep() {
  return (
    <motion.div {...slideUp} className="space-y-6">
      <div className="p-6 bg-[var(--surface-1)] rounded-[24px] space-y-4">
        <p className="text-[16px] leading-[24px] text-[var(--text-1)]">
          This app helps you track movement-related episodes and share insights with your care team.
        </p>
        <p className="text-[16px] leading-[24px] text-[var(--text-1)]">
          Your data stays private and secure. You control what's shared and with whom.
        </p>
        <div className="pt-4 border-t border-[var(--border-1)]">
          <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
            By continuing, you agree to use this app as a tracking tool to support conversations with your healthcare provider.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function InfoStep({ formData, setFormData }: any) {
  return (
    <motion.div {...slideUp} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-[14px] leading-[20px] text-[var(--text-2)] mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your name"
            className="w-full h-[52px] px-4 rounded-[16px] bg-[var(--surface-1)] border border-[var(--border-1)] text-[16px] text-[var(--text-1)] placeholder:text-[var(--text-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)] transition-shadow"
          />
        </div>

        <div>
          <label className="block text-[14px] leading-[20px] text-[var(--text-2)] mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full h-[52px] px-4 rounded-[16px] bg-[var(--surface-1)] border border-[var(--border-1)] text-[16px] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-1)] transition-shadow"
          />
        </div>

        <div>
          <label className="block text-[14px] leading-[20px] text-[var(--text-2)] mb-2">
            Gender
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Male", "Female", "Other"].map((option) => (
              <button
                key={option}
                onClick={() => setFormData({ ...formData, gender: option })}
                className={`h-[44px] rounded-[12px] text-[14px] font-medium border transition-colors ${
                  formData.gender === option
                    ? "bg-[var(--accent-2)] border-[var(--accent-1)] text-[var(--accent-1)]"
                    : "bg-[var(--surface-1)] border-[var(--border-1)] text-[var(--text-1)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PreferencesStep({ formData, setFormData }: any) {
  return (
    <motion.div {...slideUp} className="space-y-6">
      <div className="p-6 bg-[var(--surface-1)] rounded-[24px]">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--text-1)] mb-1">
              Caregiver Support
            </h3>
            <p className="text-[14px] leading-[20px] text-[var(--text-2)]">
              Allow a caregiver to view your tracking data and receive notifications
            </p>
          </div>
          <button
            onClick={() =>
              setFormData({ ...formData, caregiverEnabled: !formData.caregiverEnabled })
            }
            className={`relative w-[52px] h-[32px] rounded-full transition-colors ${
              formData.caregiverEnabled ? "bg-[var(--accent-1)]" : "bg-[var(--switch-background)]"
            }`}
          >
            <motion.div
              className="absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm"
              animate={{ left: formData.caregiverEnabled ? "22px" : "2px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      <div className="p-6 bg-[var(--accent-2)] rounded-[24px] border border-[var(--accent-1)]/20">
        <p className="text-[14px] leading-[20px] text-[var(--text-1)]">
          You can adjust these preferences anytime in your profile settings.
        </p>
      </div>
    </motion.div>
  );
}

function CompleteStep() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-[var(--success)] flex items-center justify-center mb-6 shadow-[var(--shadow-card)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </motion.div>

      <motion.h2
        className="text-[24px] leading-[32px] font-semibold text-[var(--text-1)] mb-3 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        All set, Toshi!
      </motion.h2>

      <motion.p
        className="text-[16px] leading-[24px] text-[var(--text-2)] text-center max-w-[280px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        You're ready to start tracking. Tap "Get Started" to go to your dashboard.
      </motion.p>
    </motion.div>
  );
}